import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import {
  depositEmailWeddingCelebration,
  depositEmailEventConfirmed,
} from "@/lib/email-templates";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Manually send the deposit confirmation email to the client.
 * - Data: booking, eventType, clientName (deduplicated).
 * - Template: Wedding → Wedding Celebration (gold theme); Corporate/Private → Event Confirmed.
 * - Tracks lastEmailSentAt for "Last Sent: [Date]" in Admin UI.
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
        eventType: true,
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

    const clientName =
      deduplicateName(getDisplayName(booking.name) || booking.name) || "there";
    const eventType = (booking.eventType || "").toLowerCase().trim();

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3001";
    const portalUrl = `${baseUrl}/client/bookings/${booking.id}`;

    const payload = {
      booking: {
        name: booking.name,
        eventDate: booking.eventDate,
        eventType: booking.eventType || undefined,
        venueName: booking.venueName || undefined,
        bookingId: booking.id,
        clientName,
      },
      portalUrl,
    };

    const emailContent =
      eventType === "wedding"
        ? depositEmailWeddingCelebration(payload)
        : depositEmailEventConfirmed(payload);

    await sendEmail({
      to: booking.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    const now = new Date();
    await prisma.booking.update({
      where: { id: bookingId },
      data: { lastEmailSentAt: now, updatedAt: now },
    });

    return NextResponse.json({
      success: true,
      message: `Email sent to ${booking.email}`,
      clientName,
      lastSentAt: now.toISOString(),
    });
  } catch (error: any) {
    console.error("[Send Deposit Email] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send deposit confirmation email",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
