import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";
import { TERMS_VERSION } from "@/lib/terms-content";
import { isPortalTokenValid } from "@/lib/portal-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/client/bookings/[id]/accept-terms
 * Accept T&Cs for a booking. Auth: ?token= (portalToken) OR session (user owns booking or admin).
 * Body: { signedName?: string } (optional, for future e-sign use).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const token = request.nextUrl.searchParams.get("token");
    const session = await auth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        email: true,
        portalToken: true,
        portalTokenExpiresAt: true,
        termsAccepted: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && isPortalTokenValid(booking, token)) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string; email?: string };
      if (u.role === "admin" || (!!u.id && booking.userId === u.id)) allowed = true;
      if (!allowed && u.email && booking.email) {
        if (u.email.toString().toLowerCase().trim() === booking.email.toLowerCase().trim()) {
          allowed = true;
        }
      }
    }

    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (booking.termsAccepted) {
      return NextResponse.json({ success: true, alreadyAccepted: true });
    }

    const userId = session?.user ? ((session.user as { id?: string }).id ?? null) : null;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        termsAccepted: true,
        termsAcceptedAt: new Date(),
        termsAcceptedByUserId: userId ?? undefined,
        termsAcceptedVersion: TERMS_VERSION,
        updatedAt: new Date(),
      },
    });

    await logActivity({
      bookingId,
      action: "terms_accepted",
      description: "Client accepted T&Cs",
      actor: "client",
      performedBy: booking.name ?? undefined,
      metadata: booking.venueName ? { venueName: booking.venueName } : undefined,
    });

    try {
      const eventDateLabel = booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : undefined;
      await notifyAdminSignificantEvent({
        type: "terms_accepted",
        bookingId,
        title: "Terms accepted",
        description: `${booking.name ?? "Client"} accepted T&Cs`,
        actor: "client",
        performedBy: booking.name ?? undefined,
        bookingName: booking.name ?? undefined,
        venueName: booking.venueName ?? undefined,
        eventDate: eventDateLabel,
      });
    } catch (e) {
      console.warn("[accept-terms] Admin notification failed:", e);
    }

    const updated = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        termsAccepted: true,
        termsAcceptedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        termsAccepted: updated?.termsAccepted ?? true,
        termsAcceptedAt: updated?.termsAcceptedAt ?? new Date(),
      },
    });
  } catch (e) {
    console.error("[POST /api/client/bookings/[id]/accept-terms]", e);
    return NextResponse.json(
      { error: "Failed to accept terms" },
      { status: 500 }
    );
  }
}
