import { NextResponse } from "next/server";

export async function GET() {
  const info = {
    mailgunConfigured: !!process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN || "stylishentertainment.co.uk",
    mailgunApiUrl: process.env.MAILGUN_API_URL || "https://api.eu.mailgun.net/v3",
    recipientEmail: process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk",
    fromEmail: process.env.SMTP_FROM_EMAIL || "info@stylishentertainment.co.uk",
    smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
  };

  return NextResponse.json({
    status: "Email system configuration",
    details: info,
    checks: [
      "1. Check Mailgun Dashboard → Logs for delivery status",
      "2. Check spam/junk folder in your email",
      "3. Verify info@stylishentertainment.co.uk is set up to receive emails",
      "4. Check if your email provider is blocking Mailgun emails",
      "5. Wait 2-3 minutes for email delivery (can be delayed)",
    ],
  });
}
