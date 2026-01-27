import { NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const info = {
    resendConfigured: !!process.env.RESEND_API_KEY,
    resendApiKeyLength: process.env.RESEND_API_KEY?.length || 0,
    recipientEmail: process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk",
    fromEmail: process.env.SMTP_FROM_EMAIL || "info@stylishentertainment.co.uk",
    smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
  };

  const primaryService = info.resendConfigured ? "Resend" : info.smtpConfigured ? "SMTP (fallback)" : "None";

  return NextResponse.json({
    status: "Email system configuration",
    primaryService,
    details: info,
    checks: [
      info.resendConfigured 
        ? "1. ✅ Resend is configured - emails will use Resend API"
        : "1. ⚠️ Resend not configured - add RESEND_API_KEY to .env.local",
      "2. Check spam/junk folder in your email",
      "3. Verify info@stylishentertainment.co.uk is set up to receive emails",
      "4. Wait 2-3 minutes for email delivery (can be delayed)",
      info.resendConfigured 
        ? "5. Check Resend Dashboard → Logs for delivery status: https://resend.com/emails"
        : "5. Check your email service dashboard for delivery status",
    ],
  });
}
