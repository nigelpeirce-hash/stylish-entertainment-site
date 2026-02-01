import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { PORTAL_INVITATION } from "@/lib/email/templates";
import { getEmailBaseUrl } from "@/lib/get-base-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/[id]/finalize-and-invite
 *
 * Finalize & Send Invite:
 * - Skip sending if deposit already confirmed (client already has portal link from Deposit confirmed email).
 * - Otherwise set status to 'confirmed', send PORTAL_INVITATION as autoresponder (sign in with credentials).
 * - Portal link in email is login URL so client is encouraged to sign in.
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
        status: true,
        emailsSent: true,
        depositReceivedManual: true,
        depositReceived: true,
        portalToken: true,
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

    // If deposit already confirmed, client already has portal access from Deposit confirmed email — do not send Portal invitation
    if (booking.depositReceivedManual === true || booking.depositReceived === true) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: "Deposit already confirmed; client already has portal access from that email. Portal invitation not sent.",
      });
    }

    const baseUrl = getEmailBaseUrl().replace(/\/$/, "");
    const portalToken = (booking.portalToken as string | null) || randomBytes(32).toString("hex");
    const portalUrl = `${baseUrl}/client/bookings/${bookingId}?token=${encodeURIComponent(portalToken)}`;

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
        ...(booking.portalToken ? {} : { portalToken }),
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
