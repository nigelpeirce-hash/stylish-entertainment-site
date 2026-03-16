import { NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const info = {
    resendConfigured: !!process.env.RESEND_API_KEY,
    resendApiKeyLength: process.env.RESEND_API_KEY?.length || 0,
    resendDefaultFromSet: !!process.env.RESEND_DEFAULT_FROM,
    recipientEmail: process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk",
    fromEmail: process.env.RESEND_DEFAULT_FROM || process.env.SMTP_FROM_EMAIL || "info@stylishentertainment.co.uk",
    smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
  };

  const primaryService = info.resendConfigured ? "Resend" : info.smtpConfigured ? "SMTP (fallback)" : "None";
  const resendFullyReady = info.resendConfigured && info.resendDefaultFromSet;

  const checks: string[] = [
    info.resendConfigured
      ? "1. ✅ RESEND_API_KEY is set"
      : "1. ⚠️ RESEND_API_KEY missing - add to .env.local or Vercel env",
    info.resendDefaultFromSet
      ? "2. ✅ RESEND_DEFAULT_FROM is set (required for sendEmail)"
      : "2. ⚠️ RESEND_DEFAULT_FROM missing - e.g. STYLISH Entertainment <info@stylishentertainment.co.uk>",
    "3. Contact form recipient: " + info.recipientEmail,
    "4. Check spam/junk folder if emails not received",
    "5. Resend Dashboard: https://resend.com/emails",
  ];

  return NextResponse.json({
    status: "Email system configuration",
    primaryService,
    resendReady: resendFullyReady,
    details: info,
    checks,
  });
}
