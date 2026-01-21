import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
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

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy initialization to prevent build-time errors
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, eventDate, venueName, venueNamePostcode, referralSource, eventType, preferredDJ, upsells, message, recaptchaToken } = body;
    
    // Log incoming request for debugging
    console.log("📧 Contact form submission received:", {
      name,
      email,
      hasEventDate: !!eventDate,
      hasVenueName: !!venueName,
      hasVenueNamePostcode: !!venueNamePostcode,
      eventType,
      hasMessage: !!message,
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
        },
      });
    } else {
      // Update user info if name or phone changed
      if (name && user.name !== name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name },
        });
      }
      if (phone && user.phone !== phone) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { phone },
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

    // Map upsells to services array
    const services: string[] = [];
    if (upsells && Array.isArray(upsells)) {
      upsells.forEach((upsell: string) => {
        if (upsell === "lighting") services.push("lighting");
        if (upsell === "musicians") services.push("musicians");
        if (upsell === "fire-pits") services.push("fire-pits");
        if (upsell === "venue-styling") services.push("venue-styling");
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
          message: `${message}${referralSource ? `\n\nHow did you hear about us: ${referralSource}` : ""}`,
          status: "pending",
          // @ts-ignore - Priority field exists in schema but TypeScript types may be out of sync
          priority,
          contactPreference: "Email", // Default for contact form submissions
          bookingReference, // Add booking reference for email threading
          conflictStatus, // Mark if conflict detected
          authorizedSenders: [], // Initialize empty array
          // DO NOT mark enquiry email as sent here. Autoresponder doesn't count as admin action.
          emailsSent: null as any, // Initialize as null, no admin action taken yet
          lastEmailSentAt: null, // Initialize as null, no admin action taken yet
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

    // TODO: Verify reCAPTCHA token on server side if needed
    // For now, we'll trust the client-side verification

    // Get base URL for logo (use NEXTAUTH_URL if set, otherwise try Vercel URL, fallback to production domain)
    let baseUrl = 'https://stylishentertainment.co.uk';
    if (process.env.NEXTAUTH_URL) {
      baseUrl = process.env.NEXTAUTH_URL;
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    const logoUrl = `${baseUrl}/logo-header.svg`;

    // Create email content
    const emailSubject = `New Contact Form Submission from ${name}`;
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
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
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
            ${eventDate ? `
            <div class="field">
              <div class="field-label">Event Date:</div>
              <div class="field-value">${eventDate}</div>
            </div>
            ` : ''}
            ${clientVenueName ? `
            <div class="field">
              <div class="field-label">Venue Name:</div>
              <div class="field-value">${clientVenueName}</div>
            </div>
            ` : ''}
            ${referralSource ? `
            <div class="field">
              <div class="field-label">How did you hear about us:</div>
              <div class="field-value">${referralSource}</div>
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
            <div class="field">
              <div class="field-label">Message:</div>
              <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to your business email
    const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    
    const emailResult = await sendEmail({
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    if (!emailResult.success) {
      console.error("❌ Failed to send contact form email:", (emailResult as any).error);
      console.error("Error details:", JSON.stringify(emailResult, null, 2));
      return NextResponse.json(
        { 
          error: "Failed to send email. Please try again later.",
          details: (emailResult as any).error
        },
        { status: 500 }
      );
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

    // Send enquiry autoresponder email using Resend (with centralized config)
    const emailConfig = getResendConfig("booking");
    let confirmationResult;
    
    try {
      confirmationResult = await getResend().emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [email],
        subject: enquiryEmail.subject,
        html: enquiryEmail.html,
      });
    } catch (resendError) {
      console.error("Error sending enquiry autoresponder via Resend:", resendError);
      // Fallback to SMTP if Resend fails
      confirmationResult = await sendEmail({
        to: email,
        subject: enquiryEmail.subject,
        html: enquiryEmail.html,
      });
    }

    // Return detailed response for debugging
    const confirmationSuccess = 'data' in confirmationResult || (confirmationResult as any).success;
    const confirmationMessageId = 'data' in confirmationResult 
      ? (confirmationResult as any).data?.id 
      : (confirmationResult as any).messageId;
    
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
          businessEmailSent: emailResult.success,
          businessEmailMessageId: emailResult.success ? (emailResult as any).messageId : undefined,
          confirmationEmailSent: confirmationSuccess,
          confirmationEmailMessageId: confirmationMessageId || undefined,
          businessEmailTo: recipientEmail,
          confirmationEmailTo: email,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
