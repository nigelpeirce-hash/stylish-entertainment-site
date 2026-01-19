import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getBrochureLink } from "@/lib/venue-assets";
import { inquiryAutoresponder } from "@/lib/email-journey-templates";
import { getResendConfig } from "@/lib/email-config";
import { Resend } from "resend";

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
    
    // Extract venue name (handle both venueName and venueNamePostcode fields)
    const clientVenueName = venueName || venueNamePostcode || null;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
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

    // Send automated inquiry autoresponder email to the client
    // Fetch brochure link from venue_assets table based on venueName
    // Query: SELECT pdf_url FROM venue_assets WHERE venue_name = [clientVenueName] AND is_active = true
    let brochureUrl: string;
    try {
      brochureUrl = await getBrochureLink(clientVenueName);
    } catch (error) {
      console.error("Error fetching brochure link:", error);
      // Fallback to general brochure
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

    // Generate inquiry autoresponder email using the template
    const inquiryEmail = inquiryAutoresponder({
      clientName: name,
      eventType: eventType || "your event",
      eventDate: formattedEventDate || "your event date",
      venueName: clientVenueName || undefined,
      brochureUrl: brochureUrl,
    });

    // Send inquiry autoresponder email using Resend (with centralized config)
    const emailConfig = getResendConfig("booking");
    let confirmationResult;
    
    try {
      confirmationResult = await getResend().emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [email],
        subject: inquiryEmail.subject,
        html: inquiryEmail.html,
      });
    } catch (resendError) {
      console.error("Error sending inquiry autoresponder via Resend:", resendError);
      // Fallback to SMTP if Resend fails
      confirmationResult = await sendEmail({
        to: email,
        subject: inquiryEmail.subject,
        html: inquiryEmail.html,
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
