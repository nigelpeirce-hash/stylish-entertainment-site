import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, weddingDate, venueNamePostcode, contactPreference, services, message, recaptchaToken, preferredDJ, upsellItems } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // TODO: Verify reCAPTCHA token on server side if needed
    // For now, we'll trust the client-side verification

    // Format services list
    const servicesList = Array.isArray(services) ? services.join(", ") : services || "Not specified";

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
            ${weddingDate ? `
            <div class="field">
              <div class="field-label">Wedding Date:</div>
              <div class="field-value">${weddingDate}</div>
            </div>
            ` : ''}
            ${venueNamePostcode ? `
            <div class="field">
              <div class="field-label">Venue Name/Postcode:</div>
              <div class="field-value">${venueNamePostcode}</div>
            </div>
            ` : ''}
            ${contactPreference ? `
            <div class="field">
              <div class="field-label">Preferred Contact Method:</div>
              <div class="field-value">${contactPreference}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="field-label">Services Interested In:</div>
              <div class="field-value">${servicesList}</div>
            </div>
            ${preferredDJ ? `
            <div class="field">
              <div class="field-label">Preferred DJ:</div>
              <div class="field-value">${preferredDJ === null ? "Any DJ" : preferredDJ}</div>
            </div>
            ` : ''}
            ${upsellItems && Array.isArray(upsellItems) && upsellItems.length > 0 ? `
            <div class="field">
              <div class="field-label">Items of Interest (Upsells):</div>
              <div class="field-value">${upsellItems.join(", ")}</div>
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
    
    console.log("Attempting to send email to:", recipientEmail);
    console.log("SMTP configured:", !!process.env.SMTP_USER && !!process.env.SMTP_PASSWORD);
    
    const emailResult = await sendEmail({
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email send result:", emailResult);

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
    
    console.log("✅ Business email sent successfully:", emailResult.success ? (emailResult as any).messageId : undefined);

    // Optionally send a confirmation email to the user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: #000; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Stylish Entertainment" class="logo" style="max-width: 200px; height: auto; margin-bottom: 15px;" />
            <h1 style="margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for getting in touch with Stylish Entertainment. We've received your message and will get back to you as soon as possible.</p>
            <p>We typically respond within 24-48 hours.</p>
            <p>If you have any urgent questions, please call us at 07970793177.</p>
            <p>Best regards,<br>The Team at Stylish Entertainment</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email to the user
    console.log("Sending confirmation email to:", email);
    const confirmationResult = await sendEmail({
      to: email,
      subject: "Thank you for contacting Stylish Entertainment",
      html: confirmationHtml,
    });
    console.log("Confirmation email result:", confirmationResult);

    // Return detailed response for debugging
    return NextResponse.json(
      { 
        success: true, 
        message: "Your message has been sent successfully!",
        emailDetails: {
          businessEmailSent: emailResult.success,
          businessEmailMessageId: emailResult.success ? (emailResult as any).messageId : undefined,
          confirmationEmailSent: confirmationResult.success,
          confirmationEmailMessageId: confirmationResult.success ? (confirmationResult as any).messageId : undefined,
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
