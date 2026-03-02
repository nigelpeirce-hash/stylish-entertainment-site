import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";
import { TERMS_VERSION } from "@/lib/terms-content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/bookings/accept-terms
 * Accept terms for a booking. Requires session auth; booking must belong to the user.
 */
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    let userId: string | null = null;
    if (token) {
      userId = (token.id as string) || (token.sub as string);
    } else {
      const session = await getServerSession();
      userId = (session?.user as any)?.id ?? null;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const bookingId = typeof body.bookingId === "string" ? body.bookingId.trim() : null;
    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true, archivedAt: true, name: true, venueName: true, eventDate: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (booking.archivedAt) {
      return NextResponse.json(
        { error: "This booking is no longer active" },
        { status: 410 }
      );
    }
    if (booking.userId !== userId) {
      return NextResponse.json(
        { error: "You do not have access to this booking" },
        { status: 403 }
      );
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        termsAccepted: true,
        termsAcceptedAt: new Date(),
        termsAcceptedByUserId: userId,
        termsAcceptedVersion: TERMS_VERSION,
        updatedAt: new Date(),
      },
    });

    try {
      await logActivity({
        bookingId,
        action: "terms_accepted",
        description: "Client accepted T&Cs (secure booking)",
        actor: "client",
        performedBy: booking.name ?? undefined,
        metadata: booking.venueName ? { venueName: booking.venueName } : undefined,
      });
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
        description: `${booking.name ?? "Client"} accepted T&Cs (secure booking)`,
        actor: "client",
        performedBy: booking.name ?? undefined,
        bookingName: booking.name ?? undefined,
        venueName: booking.venueName ?? undefined,
        eventDate: eventDateLabel,
      });
    } catch (e) {
      console.warn("[bookings/accept-terms] Admin notification failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error accepting terms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
