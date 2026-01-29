import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { PORTAL_INVITATION } from "@/lib/email/templates";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/[id]/finalize-and-invite
 *
 * Finalize & Send Invite:
 * - Set booking status to 'confirmed' (ACTIVE).
 * - Ensure unique, long-lived portalToken (generate if missing).
 * - Send PORTAL_INVITATION email with magic link (Step Into Your Portal).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        name: true,
        email: true,
        venueName: true,
        eventType: true,
        portalToken: true,
        status: true,
        emailsSent: true,
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

    let portalToken = booking.portalToken;
    if (!portalToken) {
      portalToken = randomBytes(32).toString("hex");
      await prisma.booking.update({
        where: { id: bookingId },
        data: { portalToken },
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://stylishentertainment.co.uk";
    const portalUrl = `${baseUrl}/client/bookings/${booking.id}?token=${encodeURIComponent(portalToken)}`;

    const { subject, html, text } = PORTAL_INVITATION({
      name: booking.name,
      venueName: booking.venueName || "your venue",
      portalUrl,
      eventType: booking.eventType ?? undefined,
    });

    await sendEmail({
      to: booking.email,
      subject,
      html,
      text,
    });

    const now = new Date();
    const existingEmailsSent = (booking.emailsSent as Record<string, unknown>) || {};
    const emailsSent = {
      ...existingEmailsSent,
      portalInvite: { sentAt: now.toISOString() },
    };

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "confirmed",
        lastEmailSentAt: now,
        emailsSent,
        updatedAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Finalized and portal invite sent",
    });
  } catch (e: any) {
    console.error("[finalize-and-invite]", e);
    return NextResponse.json(
      { error: e?.message || "Failed to finalize and send invite" },
      { status: 500 }
    );
  }
}
