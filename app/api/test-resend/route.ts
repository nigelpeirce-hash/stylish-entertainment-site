import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Test Resend email configuration
 * GET /api/test-resend - Check Resend configuration
 * POST /api/test-resend - Send a test email
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.SMTP_FROM_EMAIL || "info@stylishentertainment.co.uk";
  const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";

  // Resend API keys start with "re_" and are typically 35-60 characters
  // Placeholder is exactly "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" (32 chars)
  const isPlaceholder = resendApiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  // Real keys are at least 35 chars (re_ + 32+ chars), but can vary
  const isTooShort = resendApiKey && resendApiKey.length < 35;
  const isConfigured = !!resendApiKey && !isPlaceholder && !isTooShort;
  const apiKeyLength = resendApiKey?.length || 0;
  const apiKeyPrefix = resendApiKey?.substring(0, 3) || "";
  const isValidFormat = apiKeyPrefix === "re_";

  return NextResponse.json({
    status: "Resend Email Configuration Check",
    configured: isConfigured,
    details: {
      apiKeyPresent: !!resendApiKey,
      apiKeyLength,
      apiKeyPrefix: isValidFormat ? "✅ Valid format (starts with 're_')" : "⚠️ Invalid format (should start with 're_')",
      fromEmail,
      recipientEmail,
      isPlaceholder,
      isTooShort: isTooShort || false,
      expectedLength: "35+ characters (re_ + 32+ chars)",
      note: isTooShort 
        ? "⚠️ API key appears too short. Real Resend keys are typically 51+ characters."
        : isPlaceholder
        ? "⚠️ Using placeholder value. Replace with your actual API key."
        : "✅ API key length looks valid",
    },
    instructions: isConfigured
      ? [
          "✅ Resend is configured and ready",
          "Use POST /api/test-resend to send a test email",
          "Check Resend Dashboard: https://resend.com/emails",
        ]
      : [
          isPlaceholder 
            ? "⚠️ Resend API key is still the placeholder value"
            : isTooShort
            ? "⚠️ Resend API key appears too short (expected 51+ characters)"
            : "⚠️ Resend API key not configured",
          "Add RESEND_API_KEY to .env.local with your actual key",
          "Get your key from: https://resend.com/api-keys",
          "Real Resend keys start with 're_' and are 35+ characters long",
        ],
  });
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    // Check if API key is configured (not placeholder and reasonable length)
    const isPlaceholder = resendApiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const isTooShort = resendApiKey && resendApiKey.length < 35;
    
    if (!resendApiKey || isPlaceholder || isTooShort) {
      return NextResponse.json(
        {
          error: "Resend API key not configured",
          message: isPlaceholder 
            ? "Please replace the placeholder RESEND_API_KEY in .env.local with your actual key"
            : isTooShort
            ? `API key appears too short (${resendApiKey?.length} chars). Real Resend keys are 35+ characters.`
            : "Please add RESEND_API_KEY to .env.local",
          details: {
            apiKeyLength: resendApiKey?.length || 0,
            isPlaceholder,
            isTooShort: isTooShort || false,
            expectedLength: "35+ characters",
          },
        },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const recipientEmail = body.email || process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    const fromEmail = process.env.SMTP_FROM_EMAIL || "onboarding@resend.dev";

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Send test email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: "Test Email from Stylish Entertainment",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                      <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
                        <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">✅ Resend Email Test</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          This is a test email from your Stylish Entertainment website.
                        </p>
                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          <strong>If you received this email, your Resend configuration is working correctly! 🎉</strong>
                        </p>
                        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 6px; margin: 20px 0;">
                          <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;"><strong>Test Details:</strong></p>
                          <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">From: ${fromEmail}</p>
                          <p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">To: ${recipientEmail}</p>
                          <p style="color: #666666; font-size: 14px; margin: 0;">Sent: ${new Date().toLocaleString("en-GB")}</p>
                        </div>
                        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                          You can check email delivery status in your <a href="https://resend.com/emails" style="color: #D4AF37; text-decoration: none;">Resend Dashboard</a>.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                        <p style="color: #cccccc; font-size: 12px; margin: 0;">
                          Stylish Entertainment Ltd
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Test Email from Stylish Entertainment\n\nIf you received this email, your Resend configuration is working correctly!\n\nFrom: ${fromEmail}\nTo: ${recipientEmail}\nSent: ${new Date().toLocaleString("en-GB")}`,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: error,
          message: error.message || "Resend API returned an error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      emailId: data?.id,
      recipient: recipientEmail,
      from: fromEmail,
      timestamp: new Date().toISOString(),
      resendDashboard: "https://resend.com/emails",
      note: "Check your inbox and spam folder. Delivery may take a few seconds.",
    });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Failed to send test email",
      },
      { status: 500 }
    );
  }
}
