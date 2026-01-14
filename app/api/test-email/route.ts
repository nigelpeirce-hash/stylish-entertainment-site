import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    console.log("=== TEST EMAIL ENDPOINT ===");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "***SET***" : "MISSING");
    console.log("SMTP_FROM_EMAIL:", process.env.SMTP_FROM_EMAIL);

    const testEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
    
    console.log("Sending test email to:", testEmail);
    
    const result = await sendEmail({
      to: testEmail,
      subject: "Test Email from Stylish Entertainment",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify Mailgun SMTP is working.</p>
        <p>If you receive this, your email configuration is correct!</p>
      `,
    });

    console.log("Test email result:", result);

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? "Test email sent! Check your inbox." 
        : `Failed to send: ${(result as any).error || "Unknown error"}`,
      details: {
        smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
        result,
      },
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
