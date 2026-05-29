import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { getJourneyEmail } from "@/lib/email-journey-templates";
import sendEmail from "@/lib/email/send-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/[id]/send-first-touch
 * Sends the New Enquiry Auto-Responder thank-you email to the client and sets lastEmailSentAt
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
    const eventDateFormatted = eventDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const { subject, html } = getJourneyEmail("enquiry-autoresponder", {
      clientName: booking.name,
      eventType: "event",
      eventDate: eventDateFormatted,
      venueName: booking.venueName ?? undefined,
    });
    const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

    // Idempotency: atomically claim the send before dispatching the email.
    // Only one concurrent request can flip lastEmailSentAt from null → now,
    // which prevents duplicates from double-clicks, two tabs, and retries.
    const now = new Date();
    const claim = await prisma.booking.updateMany({
      where: { id: bookingId, lastEmailSentAt: null },
      data: { lastEmailSentAt: now, updatedAt: now },
    });

    if (claim.count === 0) {
      // First Touch already sent (or the client was already contacted).
      // Return success so the dashboard removes the row without re-sending.
      return NextResponse.json({
        success: true,
        alreadySent: true,
        message: "First Touch already sent for this booking",
      });
    }

    const sendResult = await sendEmail({
      to: booking.email,
      subject,
      html,
      text,
    });

    if (sendResult.error) {
      console.error("[Send First Touch] Resend error:", sendResult.error);
      // Roll back the claim so the admin can retry after a genuine send failure.
      await prisma.booking
        .update({ where: { id: bookingId }, data: { lastEmailSentAt: null } })
        .catch(() => {});
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

    await logActivity({
      bookingId,
      action: "first_touch_sent",
      description: `First Touch email sent to ${booking.email}`,
      actor: "admin",
      performedBy: admin?.name ?? admin?.email ?? undefined,
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
