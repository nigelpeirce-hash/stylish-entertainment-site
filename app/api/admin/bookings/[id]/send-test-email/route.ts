import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { DEPOSIT_CONFIRMED } from "@/lib/email-templates";
import { getClientPortalLoginUrl } from "@/lib/client-portal-url";
import { getEmailBaseUrl } from "@/lib/get-base-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TEST_EMAIL_TO =
  process.env.TEST_EMAIL || process.env.ADMIN_TEST_EMAIL || "nigel@stylishentertainment.co.uk";

/**
 * Send the current booking's DEPOSIT_CONFIRMED–formatted email to Nigel (or TEST_EMAIL)
 * for final visual check. Admin only.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1") ||
      process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        name: true,
        eventDate: true,
        eventType: true,
        venueName: true,
        bookingFee: true,
        finalBalance: true,
        preferredDJ: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const baseUrl = getEmailBaseUrl();
    const portalUrl = getClientPortalLoginUrl(baseUrl, booking.id);

    const emailContent = DEPOSIT_CONFIRMED({
      booking: {
        name: booking.name,
        eventDate: booking.eventDate,
        eventType: booking.eventType || undefined,
        venueName: booking.venueName || undefined,
        bookingId: booking.id,
        bookingFee: booking.bookingFee,
        finalBalance: booking.finalBalance,
        preferredDJ: booking.preferredDJ,
      },
      portalUrl,
    });

    await sendEmail({
      to: TEST_EMAIL_TO,
      subject: `[TEST] ${emailContent.subject}`,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${TEST_EMAIL_TO}`,
    });
  } catch (error: any) {
    console.error("[Send Test Email] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
