import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { FIRST_TOUCH } from "@/lib/email/templates";
import sendEmail from "@/lib/email/send-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/[id]/send-first-touch
 * Sends the First Touch thank-you email to the client and sets lastEmailSentAt
 * so the booking no longer shows as "New Enquiry" / urgent on the dashboard.
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
        email: true,
        eventDate: true,
        venueName: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.email) {
      return NextResponse.json(
        { error: "Booking has no email address" },
        { status: 400 }
      );
    }

    const eventDate = booking.eventDate instanceof Date
      ? booking.eventDate
      : new Date(booking.eventDate);

    const { subject, html, text } = FIRST_TOUCH({
      name: booking.name,
      email: booking.email,
      venueName: booking.venueName || "your venue",
      eventDate,
    });

    const sendResult = await sendEmail({
      to: booking.email,
      subject,
      html,
      text,
    });

    if (sendResult.error) {
      console.error("[Send First Touch] Resend error:", sendResult.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send First Touch email",
          details: process.env.NODE_ENV === "development"
            ? (sendResult.error as { message?: string })?.message
            : undefined,
        },
        { status: 500 }
      );
    }

    const now = new Date();
    await prisma.booking.update({
      where: { id: bookingId },
      data: { lastEmailSentAt: now, updatedAt: now },
    });

    return NextResponse.json({
      success: true,
      message: `First Touch email sent to ${booking.email}`,
      lastSentAt: now.toISOString(),
    });
  } catch (error: unknown) {
    console.error("[Send First Touch] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send First Touch email",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
