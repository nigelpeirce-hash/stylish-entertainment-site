import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBrochureLink } from "@/lib/venue-assets";
import { enquiryAutoresponder } from "@/lib/email-journey-templates";
import { getResendConfig } from "@/lib/email-config";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { 
  checkForBookingConflicts, 
  generateBookingReference,
  ensureBookingReference 
} from "@/lib/booking-integrity";
import { sendNewLeadNotification } from "@/lib/pushover-notifications";
import { SIGNATURE_BLOCK_HTML } from "@/lib/email-signature";
import sendEmail from "@/lib/email/send-email";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy initialization to prevent build-time errors
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY not found in environment variables");
    return null;
  }
  
  // Validate API key format (Resend keys start with 're_' and are 35+ chars)
  const isPlaceholder = apiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const isValidFormat = apiKey.startsWith("re_") && apiKey.length >= 35;
  
  if (isPlaceholder || !isValidFormat) {
    console.error("❌ RESEND_API_KEY appears invalid:", {
      isPlaceholder,
      isValidFormat,
      length: apiKey.length,
      startsWithRe: apiKey.startsWith("re_"),
    });
    return null;
  }
  
  console.log("✅ RESEND_API_KEY found and validated, initializing Resend client");
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError);
      return NextResponse.json(
        { 
          error: "Invalid request format. Please check your form data.",
          details: process.env.NODE_ENV === "development" ? (parseError instanceof Error ? parseError.message : String(parseError)) : undefined
        },
        { status: 400 }
      );
    }
    // Support both /contact-us form (eventDate, venueName, preferredDJ, upsells) and /contact form (weddingDate, venueNamePostcode, services)
    const eventDate = body.eventDate ?? body.weddingDate;
    const venueName = body.venueName;
    const venueNamePostcode = body.venueNamePostcode;
    const eventType = body.eventType;
    const preferredDJ = body.preferredDJ;
    const upsells = body.upsells;
    const bodyServices = body.services; // /contact form sends "services" (e.g. ["DJs", "Lighting Design"])
    const message = body.message != null ? String(body.message).trim() : "";
    const contactPreference = body.contactPreference || "Email";
    const { name, email, phone, recaptchaToken } = body;

    // Log incoming request for debugging
    console.log("📧 Contact form submission received:", {
      name,
      email,
      hasEventDate: !!eventDate,
      hasVenueName: !!venueName,
      hasVenueNamePostcode: !!venueNamePostcode,
      eventType,
      hasMessage: !!message,
      hasPreferredDJ: !!preferredDJ,
      hasServices: Array.isArray(bodyServices) && bodyServices.length > 0,
      timestamp: new Date().toISOString(),
    });

    // Extract venue name (handle both venueName and venueNamePostcode fields)
    const clientVenueName = venueName || venueNamePostcode || null;

    // Basic validation
    if (!name || !email || !message) {
      console.error("❌ Validation failed: Missing required fields", { name: !!name, email: !!email, message: !!message });
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a new user account for this enquiry
      user = await prisma.user.create({
        data: {
          email,
          name,
          phone: phone || null,
          role: "client",
          updatedAt: new Date(),
        },
      });
    } else {
      // Update user info if name or phone changed
      if (name && user.name !== name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name, updatedAt: new Date() },
        });
      }
      if (phone && user.phone !== phone) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { phone, updatedAt: new Date() },
        });
      }
    }

    // Parse phone number if provided (split into area code and number if UK format)
    let phoneAreaCode: string | null = null;
    let phoneNumber: string | null = null;
    if (phone) {
      // Try to parse UK phone format (e.g., "07700 900000" or "020 7946 0958")
      const cleaned = phone.replace(/\s+/g, "");
      if (cleaned.startsWith("0")) {
        // UK mobile or landline
        if (cleaned.startsWith("07")) {
          // Mobile: 07700 900000
          phoneAreaCode = cleaned.substring(0, 4); // "0770"
          phoneNumber = cleaned.substring(4); // "0900000"
        } else {
          // Landline: 020 7946 0958
          phoneAreaCode = cleaned.substring(0, 3); // "020"
          phoneNumber = cleaned.substring(3); // "79460958"
        }
      } else {
        // International or other format, store as-is
        phoneNumber = phone;
      }
    }

    // Parse venue name and postcode if provided as combined field
    let parsedVenueName = clientVenueName || "TBC";
    let parsedVenuePostcode: string | null = null;
    if (clientVenueName) {
      // Try to split venue name and postcode (postcode usually at end)
      const parts = clientVenueName.trim().split(/\s+(?=[A-Z]{1,2}\d)/);
      if (parts.length > 1 && /[A-Z]{1,2}\d/.test(parts[parts.length - 1])) {
        parsedVenuePostcode = parts[parts.length - 1];
        parsedVenueName = parts.slice(0, -1).join(" ");
      }
    }

    // Calculate priority: urgent if event date is within 2 weeks (14 days)
    let priority = "medium";
    if (eventDate) {
      const eventDateObj = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDateObj.setHours(0, 0, 0, 0);
      const daysUntilEvent = Math.floor((eventDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilEvent >= 0 && daysUntilEvent <= 14) {
        priority = "urgent";
      }
    }

    // Default event date to a far future date if not provided (required field)
    const bookingEventDate = eventDate ? new Date(eventDate) : new Date("2099-12-31");

    // Check for booking conflicts before creating (with name for fuzzy matching)
    const conflictCheck = await checkForBookingConflicts(
      email,
      name, // Include name for fuzzy matching
      bookingEventDate,
      parsedVenuePostcode
    );

    // If conflict detected, mark booking with conflict status
    const conflictStatus = 
      conflictCheck.status === "POTENTIAL_DUPLICATE" || 
      conflictCheck.status === "NAME_MATCH_WARNING"
        ? "pending"
        : null;

    // Generate booking reference
    const bookingReference = generateBookingReference();

    // Map upsells (from /contact-us) and services (from /contact) to booking services array
    const services: string[] = [];
    if (upsells && Array.isArray(upsells)) {
      upsells.forEach((upsell: string) => {
        if (upsell === "lighting") services.push("lighting");
        if (upsell === "musicians") services.push("musicians");
        if (upsell === "fire-pits") services.push("fire-pits");
        if (upsell === "venue-styling") services.push("venue-styling");
      });
    }
    if (bodyServices && Array.isArray(bodyServices)) {
      bodyServices.forEach((s: string) => {
        const lower = String(s).toLowerCase();
        if (lower.includes("dj") && !services.includes("DJs")) services.push("DJs");
        else if ((lower.includes("lighting") || lower.includes("design")) && !services.includes("lighting")) services.push("lighting");
        else if ((lower.includes("musician") || lower.includes("live")) && !services.includes("musicians")) services.push("musicians");
        else if ((lower.includes("fire") || lower.includes("pit")) && !services.includes("fire-pits")) services.push("fire-pits");
        else if ((lower.includes("venue") || lower.includes("styling") || lower.includes("decoration")) && !services.includes("venue-styling")) services.push("venue-styling");
        else if (s && !services.includes(s)) services.push(s);
      });
    }

    // Create booking record in database
    console.log("🔨 Starting booking creation...", {
      name,
      email,
      venueName: parsedVenueName,
      eventDate: bookingEventDate.toISOString(),
      status: "pending",
      priority,
      bookingReference,
      conflictStatus: conflictCheck.status,
    });
    
    let booking;
    try {
      booking = await prisma.booking.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          name,
          email,
          phoneAreaCode,
          phoneNumber,
          eventType: eventType || "wedding",
          eventDate: bookingEventDate,
          venueName: parsedVenueName,
          venuePostcode: parsedVenuePostcode,
          preferredDJ: preferredDJ || null,
          services,
          upsellItems: upsells || [],
          message: message || null,
          status: "pending",
          // @ts-ignore - Priority field exists in schema but TypeScript types may be out of sync
          priority,
          contactPreference, // From form (e.g. /contact sends "Phone" or "Email")
          bookingReference, // Add booking reference for email threading
          conflictStatus, // Mark if conflict detected
          authorizedSenders: [], // Initialize empty array
          // DO NOT mark enquiry email as sent here. Autoresponder doesn't count as admin action.
          emailsSent: null as any, // Initialize as null, no admin action taken yet
          lastEmailSentAt: null, // Initialize as null, no admin action taken yet
          updatedAt: new Date(),
        },
      });
      console.log("✅ Booking created successfully:", booking.id, "Status:", booking.status, "Priority:", (booking as any).priority);
      
      // Send push notification to Ali and Nigel about new lead
      try {
        await sendNewLeadNotification({
          id: booking.id,
          name: booking.name,
          eventDate: booking.eventDate,
          venueName: booking.venueName,
        });
      } catch (notificationError) {
        // Don't fail the booking creation if notification fails
        console.error("Failed to send new lead notification:", notificationError);
      }
    } catch (bookingError) {
      console.error("❌ CRITICAL: Failed to create booking record:", bookingError);
      console.error("❌ Booking creation error details:", JSON.stringify(bookingError, null, 2));
      console.error("❌ Booking data that failed:", {
        userId: user.id,
        name,
        email,
        eventDate: bookingEventDate,
        venueName: parsedVenueName,
        status: "pending",
        priority,
      });
      // CRITICAL: Don't continue to send email if booking creation fails
      // The booking must exist for the enquiry to appear in dashboard
      return NextResponse.json(
        { 
          error: "Failed to create booking record. The enquiry was not saved. Please contact support.",
          details: process.env.NODE_ENV === "development" ? String(bookingError) : undefined,
          bookingError: process.env.NODE_ENV === "development" ? (bookingError instanceof Error ? bookingError.message : String(bookingError)) : undefined
        },
        { status: 500 }
      );
    }

    // Ensure booking was created before proceeding
    if (!booking || !booking.id) {
      console.error("❌ CRITICAL: Booking creation returned null/undefined");
      return NextResponse.json(
        { error: "Failed to create booking record. Booking ID is missing." },
        { status: 500 }
      );
    }

    // Dashboard + email notification for significant event (AuditLog + admin email)
    const eventDateLabel = eventDate
      ? new Date(eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : undefined;
    try {
      await notifyAdminSignificantEvent({
        type: "booking_request_received",
        bookingId: booking.id,
        actor: "client",
        title: "New Enquiry",
        description: `${name} – ${clientVenueName || "Venue TBC"}${eventDateLabel ? ` – ${eventDateLabel}` : ""}`,
        bookingName: name,
        venueName: clientVenueName || undefined,
        eventDate: eventDateLabel,
        linkText: "View enquiry",
      });
    } catch (e) {
      console.warn("Admin notification (booking_request_received) failed:", e);
    }

    // TODO: Verify reCAPTCHA token on server side if needed
    // For now, we'll trust the client-side verification

    // Get base URL for logo (use NEXTAUTH_URL if set, otherwise try Vercel URL, fallback to production domain)
    let baseUrl = 'https://stylishentertainment.co.uk';
    if (process.env.NEXTAUTH_URL) {
      baseUrl = process.env.NEXTAUTH_URL;
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    const logoUrl = "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png";

    // Format event date for admin email: day month year (e.g. 20 June 2026)
    const adminEventDateFormatted = eventDate
      ? new Date(eventDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

    // Create email content – subject makes it clear this is a booking request notification
    const eventLabel = adminEventDateFormatted ? ` – ${eventType || "Event"} ${adminEventDateFormatted}` : "";
    const emailSubject = `New Enquiry: ${name}${eventLabel}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: #000; padding: 30px 20px; text-align: center; }
          .logo { max-width: 200px; height: auto; margin-bottom: 15px; }
          .content { background: #f9f9f9; padding: 30px; }
          .field { margin: 15px 0; padding: 10px; background: #fff; border-left: 4px solid #d4af37; }
          .field-label { font-weight: bold; color: #333; }
          .field-value { color: #666; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Stylish Entertainment" class="logo" style="max-width: 200px; height: auto; margin-bottom: 15px;" />
            <h1 style="margin: 0; font-size: 24px;">New Enquiry</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Name:</div>
              <div class="field-value">${name}</div>
            </div>
            <div class="field">
              <div class="field-label">Email:</div>
              <div class="field-value">${email}</div>
            </div>
            ${phone ? `
            <div class="field">
              <div class="field-label">Phone:</div>
              <div class="field-value">${phone}</div>
            </div>
            ` : ''}
            ${adminEventDateFormatted ? `
            <div class="field">
              <div class="field-label">Event Date:</div>
              <div class="field-value">${adminEventDateFormatted}</div>
            </div>
            ` : ''}
            ${clientVenueName ? `
            <div class="field">
              <div class="field-label">Venue Name:</div>
              <div class="field-value">${clientVenueName}</div>
            </div>
            ` : ''}
            ${eventType ? `
            <div class="field">
              <div class="field-label">Event Type:</div>
              <div class="field-value">${eventType}</div>
            </div>
            ` : ''}
            ${preferredDJ ? `
            <div class="field">
              <div class="field-label">Preferred DJ:</div>
              <div class="field-value">${preferredDJ}</div>
            </div>
            ` : ''}
            ${upsells && upsells.length > 0 ? `
            <div class="field">
              <div class="field-label">Selected Enhancements:</div>
              <div class="field-value">${upsells.map((upsell: string) => {
                const upsellMap: Record<string, string> = {
                  "lighting": "Professional Lighting Design",
                  "musicians": "Live Musicians (Sax, Bongos)",
                  "fire-pits": "Fire Pit Hire",
                  "venue-styling": "Venue Styling & Decoration",
                  "early-setup": "Early Setup Available",
                  "extended-hours": "Extended Performance Hours",
                };
                return upsellMap[upsell] || upsell;
              }).join(", ")}</div>
            </div>
            ` : ''}
            ${services && services.length > 0 ? `
            <div class="field">
              <div class="field-label">Services requested:</div>
              <div class="field-value">${services.join(", ")}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="field-label">Message:</div>
              <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          ${SIGNATURE_BLOCK_HTML}
        </div>
      </body>
      </html>
    `;

    // Send notification to business: primary recipient + optional backup
    const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    const backupEmail = process.env.NOTIFICATION_EMAIL || undefined; // optional second inbox
    const recipients = [recipientEmail, ...(backupEmail && backupEmail !== recipientEmail ? [backupEmail] : [])];

    const emailConfig = getResendConfig("booking");
    const resend = getResend();
    let emailResult: any = { success: false, error: "Email not sent" };

    console.log("📧 Attempting to send enquiry notification to business:", {
      hasResendClient: !!resend,
      recipients: recipients.join(", "),
      from: emailConfig.from,
    });

    const sendBusinessNotification = async (to: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
      if (!resend) return { success: false, error: "RESEND_API_KEY not configured" };
      const result = await resend.emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [to],
        subject: emailSubject,
        html: emailHtml,
      });
      const messageId = result.data?.id;
      const hasError = result.error || !messageId;
      if (hasError) {
        return {
          success: false,
          error: (result.error as any)?.message || JSON.stringify(result.error) || "No messageId",
        };
      }
      return { success: true, messageId };
    };

    try {
      let sent = false;
      for (const to of recipients) {
        try {
          const result = await sendBusinessNotification(to);
          if (result.success) {
            console.log("✅ Enquiry notification sent to:", to, "messageId:", result.messageId);
            emailResult = { success: true, messageId: result.messageId };
            sent = true;
          } else {
            console.warn("⚠️ Failed to send to", to, result.error);
          }
        } catch (e) {
          console.warn("⚠️ Error sending to", to, e);
        }
      }
      if (!sent && resend) {
        // Fallback: try shared sendEmail (uses RESEND_DEFAULT_FROM – may work if booking 'from' domain isn't verified)
        try {
          const fallback = await sendEmail({
            to: recipientEmail,
            subject: emailSubject,
            html: emailHtml,
          });
          if (fallback?.data?.id && !fallback?.error) {
            console.log("✅ Enquiry notification sent via fallback (RESEND_DEFAULT_FROM) to:", recipientEmail);
            emailResult = { success: true, messageId: fallback.data.id };
          }
        } catch (fallbackErr) {
          console.error("❌ Fallback sendEmail also failed:", fallbackErr);
        }
      }
      if (!emailResult.success && !resend) {
        emailResult = { success: false, error: "RESEND_API_KEY not configured" };
      }
    } catch (emailError) {
      console.error("❌ Unexpected error sending business email:", emailError);
      emailResult = { success: false, error: emailError instanceof Error ? emailError.message : "Unknown error" };
    }

    if (!emailResult?.success) {
      console.error("❌ Failed to send contact form email:", (emailResult as any).error);
      console.error("Error details:", JSON.stringify(emailResult, null, 2));
      // Don't fail the entire request if email fails - booking was created successfully
      // Log the error but continue to send autoresponder
      console.warn("⚠️ Business email failed but continuing with autoresponder");
    }

    // Send automated enquiry autoresponder email to the client
    // Fetch brochure link from venue_assets table based on venueName
    // Query: SELECT pdf_url FROM venue_assets WHERE venue_name = [clientVenueName] AND is_active = true
    let brochureUrl: string;
    try {
      const cloudinaryUrl = await getBrochureLink(clientVenueName);
      // Ensure the URL is HTTPS and valid (Cloudinary URLs should already be HTTPS)
      if (cloudinaryUrl && cloudinaryUrl.startsWith('http')) {
        brochureUrl = cloudinaryUrl;
      } else {
        // Fallback to general brochure if URL is invalid
        brochureUrl = "https://res.cloudinary.com/stylish/brochures/general-stylish-brochure.pdf";
      }
    } catch (error) {
      console.error("Error fetching brochure link:", error);
      // Fallback to general brochure
      brochureUrl = "https://res.cloudinary.com/stylish/brochures/general-stylish-brochure.pdf";
    }
    
    // Ensure brochure URL is always HTTPS (Cloudinary URLs should already be HTTPS, but double-check)
    if (brochureUrl && !brochureUrl.startsWith('https://')) {
      console.warn("Brochure URL is not HTTPS, using fallback:", brochureUrl);
      brochureUrl = "https://res.cloudinary.com/stylish/brochures/general-stylish-brochure.pdf";
    }

    // Format event date if provided
    const formattedEventDate = eventDate 
      ? new Date(eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;

    // Generate enquiry autoresponder email using the template
    const enquiryEmail = enquiryAutoresponder({
      clientName: name,
      eventType: eventType || "your event",
      eventDate: formattedEventDate || "your event date",
      venueName: clientVenueName || undefined,
      brochureUrl: brochureUrl,
    });

    // Send enquiry autoresponder email using Resend (reuse existing emailConfig and resend from above)
    let confirmationResult: any = { success: false };
    
    console.log("📧 Attempting to send autoresponder email:", {
      hasResendClient: !!resend,
      recipient: email,
      from: emailConfig.from,
    });
    
    try {
      if (resend) {
        try {
          console.log("📤 Sending autoresponder via Resend...");
          confirmationResult = await resend.emails.send({
            from: emailConfig.from,
            replyTo: emailConfig.replyTo,
            to: [email],
            subject: enquiryEmail.subject,
            html: enquiryEmail.html,
          });
          
          // Check for Resend errors in response
          const confirmationMessageId = confirmationResult.data?.id;
          const confirmationHasError = confirmationResult.error || !confirmationMessageId;
          
          if (confirmationHasError) {
            console.error("❌ Autoresponder Resend error:", {
              error: confirmationResult.error,
              messageId: confirmationMessageId,
              fullResponse: JSON.stringify(confirmationResult, null, 2),
            });
            confirmationResult = { 
              success: false,
              error: confirmationResult.error?.message || confirmationResult.error || "No messageId returned",
            };
          } else {
            console.log("✅ Autoresponder sent via Resend:", {
              messageId: confirmationMessageId,
              to: email,
            });
          }
        } catch (resendError) {
          console.error("❌ Error sending enquiry autoresponder via Resend:", resendError);
          console.error("❌ Resend error details:", JSON.stringify(resendError, null, 2));
          confirmationResult = { 
            success: false, 
            error: resendError instanceof Error ? resendError.message : "Resend API error" 
          };
        }
      } else {
        // No Resend API key - email cannot be sent
        console.error("❌ RESEND_API_KEY not set - autoresponder cannot be sent");
        confirmationResult = { 
          success: false, 
          error: "RESEND_API_KEY not configured" 
        };
      }
    } catch (confirmationError) {
      console.error("❌ Unexpected error sending confirmation email:", confirmationError);
      confirmationResult = { 
        success: false, 
        error: confirmationError instanceof Error ? confirmationError.message : "Unknown error" 
      };
    }

    // Return detailed response for debugging
    // Resend returns { data: { id: '...' } } on success
    const confirmationSuccess = !!(confirmationResult?.data?.id || confirmationResult?.id);
    const confirmationMessageId = confirmationResult?.data?.id || confirmationResult?.id;
    
    // Booking was created successfully, so return success even if emails failed
    // Emails are logged but don't block the user experience
    return NextResponse.json(
      { 
        success: true, 
        message: "Your message has been sent successfully!",
        bookingId: booking.id,
        bookingReference: booking.bookingReference, // Include booking reference
        conflictStatus: conflictCheck.status, // Include conflict status
        conflictWarning: conflictCheck.status === "POTENTIAL_DUPLICATE" 
          ? `Warning: This event details match an existing booking under a different email (${conflictCheck.existingBooking?.email}). Please review in admin dashboard.`
          : undefined,
        emailDetails: {
          businessEmailSent: emailResult?.success || false,
          businessEmailMessageId: emailResult?.success ? (emailResult as any).messageId : undefined,
          businessEmailError: emailResult?.success ? undefined : ((emailResult as any)?.error || (emailResult as any)?.errorDetails),
          confirmationEmailSent: confirmationSuccess,
          confirmationEmailMessageId: confirmationMessageId || undefined,
          confirmationEmailError: confirmationSuccess ? undefined : (confirmationResult as any)?.error,
          businessEmailTo: recipientEmail,
          confirmationEmailTo: email,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Contact form error:", error);
    console.error("❌ Error type:", error?.constructor?.name || typeof error);
    console.error("❌ Error message:", error?.message || String(error));
    console.error("❌ Error code:", error?.code);
    console.error("❌ Error meta:", JSON.stringify(error?.meta || {}, null, 2));
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack");
    
    // Check if it's a database connection error
    if (error?.code) {
      console.error(`❌ Prisma error code: ${error.code}`);
      if (error.code === 'P2001') {
        console.error("   💡 Table does not exist - run: npx prisma db push");
      } else if (error.code === 'P1001') {
        console.error("   💡 Cannot reach database server - check connection");
      } else if (error.code === 'ETIMEDOUT') {
        console.error("   💡 Connection timeout - check network/DATABASE_URL");
      }
    }
    
    return NextResponse.json(
      { 
        error: "An error occurred. Please try again later.",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
