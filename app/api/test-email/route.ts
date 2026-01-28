import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const testEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";

    if (process.env.NODE_ENV === "development") {
      console.log("=== TEST EMAIL (sendEmail) ===");
      console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "***SET***" : "MISSING");
      console.log("RESEND_DEFAULT_FROM:", process.env.RESEND_DEFAULT_FROM || "MISSING");
      console.log("Sending test email to:", testEmail);
    }

    const result = await sendEmail({
      to: testEmail,
      subject: "Test Email from Stylish Entertainment Ltd",
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify Resend (sendEmail) is working.</p>
        <p>If you receive this, your mail API is set up correctly.</p>
      `,
    });

    const success = !result.error && !!result.data?.id;
    const errorMsg = result.error
      ? (typeof result.error === "string" ? result.error : (result.error as Error)?.message || JSON.stringify(result.error))
      : null;

    if (process.env.NODE_ENV === "development") {
      console.log("Test email result:", { success, id: result.data?.id, error: errorMsg });
    }

    return NextResponse.json({
      success,
      message: success
        ? "Test email sent! Check your inbox (and spam)."
        : `Failed to send: ${errorMsg || "Unknown error"}`,
      details: {
        resendConfigured: !!process.env.RESEND_API_KEY,
        resendDefaultFromSet: !!process.env.RESEND_DEFAULT_FROM,
        recipient: testEmail,
        emailId: result.data?.id ?? null,
        error: errorMsg,
      },
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
