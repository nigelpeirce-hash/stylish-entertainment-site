import { NextRequest, NextResponse } from "next/server";
import { checkForBookingConflicts } from "@/lib/booking-integrity";
import { createNewEnquiry } from "@/lib/create-new-enquiry";
import { SIGNATURE_BLOCK_HTML, EMAIL_LOGO_HTML } from "@/lib/email-signature";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // reCAPTCHA v3 server-side verification
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY?.trim();
    const recaptchaBypassDev =
      process.env.NODE_ENV === "development" && process.env.RECAPTCHA_BYPASS_DEV === "1";

    const minScoreRaw = process.env.RECAPTCHA_MIN_SCORE;
    const minScoreParsed = minScoreRaw != null && minScoreRaw !== "" ? Number(minScoreRaw) : 0.3;
    const recaptchaMinScore =
      Number.isFinite(minScoreParsed) && minScoreParsed >= 0 && minScoreParsed <= 1
        ? minScoreParsed
        : 0.3;

    if (recaptchaBypassDev && recaptchaSecret) {
      console.warn("⚠️ RECAPTCHA_BYPASS_DEV=1 — skipping reCAPTCHA verification (development only)");
    } else if (recaptchaSecret && recaptchaToken) {
      try {
        const verifyBody = new URLSearchParams({
          secret: recaptchaSecret,
          response: String(recaptchaToken),
        });
        const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: verifyBody.toString(),
        });
        const recaptchaData = (await recaptchaRes.json()) as {
          success?: boolean;
          score?: number;
          "error-codes"?: string[];
        };
        const score =
          typeof recaptchaData.score === "number" && Number.isFinite(recaptchaData.score)
            ? recaptchaData.score
            : Number(recaptchaData.score);
        const scoreOk = Number.isFinite(score) && score >= recaptchaMinScore;

        if (!recaptchaData.success || !scoreOk) {
          console.warn("⚠️ reCAPTCHA verification failed:", {
            success: recaptchaData.success,
            score: recaptchaData.score,
            minScore: recaptchaMinScore,
            errorCodes: recaptchaData["error-codes"],
          });
          const devDetails =
            process.env.NODE_ENV === "development"
              ? {
                  score: recaptchaData.score,
                  minScore: recaptchaMinScore,
                  errorCodes: recaptchaData["error-codes"],
                  hint:
                    "Local: add localhost to reCAPTCHA key domains, set RECAPTCHA_MIN_SCORE=0.1, or RECAPTCHA_BYPASS_DEV=1 in .env.local",
                }
              : undefined;
          return NextResponse.json(
            {
              error: "Request could not be verified. Please try again.",
              details: devDetails,
            },
            { status: 400 }
          );
        }
        console.log("✅ reCAPTCHA verified, score:", recaptchaData.score);
      } catch (recaptchaError) {
        // Don't block the submission if Google's API is unreachable
        console.warn("⚠️ reCAPTCHA verification request failed (allowing submission):", recaptchaError);
      }
    } else if (!recaptchaSecret) {
      console.warn("⚠️ RECAPTCHA_SECRET_KEY not configured — skipping verification");
    }

    // Find or create user — deferred until enquiry is converted to a booking

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

    // Map upsells (from /contact-us) and services (from /contact) to services list for enquiry metadata
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

    const adminEventDateFormatted = eventDate
      ? new Date(eventDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

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
          .content { background: #f9f9f9; padding: 30px; }
          .field { margin: 15px 0; padding: 10px; background: #fff; border-left: 4px solid #d4af37; }
          .field-label { font-weight: bold; color: #333; }
          .field-value { color: #666; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${EMAIL_LOGO_HTML}
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

    let enquiryResult;
    try {
      enquiryResult = await createNewEnquiry({
        name,
        email,
        phone,
        phoneAreaCode,
        phoneNumber,
        eventDate: bookingEventDate,
        venueName: parsedVenueName,
        venuePostcode: parsedVenuePostcode || "CONTACT",
        eventType: eventType || "wedding",
        message,
        enquiryType: "contact",
        quoteRequestData: {
          servicesRequested: services,
          preferredDJ: preferredDJ || null,
          upsells: upsells || [],
          upsellItems: upsells || [],
          contactPreference,
          priority,
        },
        adminEmailHtml: emailHtml,
        adminEmailSubject: emailSubject,
        brochureVenueName: clientVenueName,
      });
      console.log("✅ New enquiry created:", enquiryResult.enquiry.id);
    } catch (enquiryError) {
      console.error("❌ CRITICAL: Failed to create enquiry:", enquiryError);
      return NextResponse.json(
        {
          error: "Failed to save your enquiry. Please contact support.",
          details: process.env.NODE_ENV === "development" ? String(enquiryError) : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        enquiryId: enquiryResult.enquiry.id,
        bookingId: enquiryResult.enquiry.id,
        conflictStatus: conflictCheck.status,
        conflictWarning:
          conflictCheck.status === "POTENTIAL_DUPLICATE"
            ? `Warning: This event details match an existing booking under a different email (${conflictCheck.existingBooking?.email}). Please review in admin dashboard.`
            : undefined,
        emailDetails: {
          businessEmailSent: enquiryResult.adminEmailSent,
          confirmationEmailSent: enquiryResult.autoresponderSent,
        },
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
