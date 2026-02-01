import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/bookings/[id]/guest-requests
 *
 * Fetch all guest song requests for a booking.
 * Auth: session (user owns booking or admin) OR ?token= matching portalToken (magic link).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;
    const token = request.nextUrl.searchParams.get("token");
    const session = await getServerSession(request);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        email: true,
        portalToken: true,
        guestRequests: {
          select: {
            id: true,
            guestName: true,
            note: true,
            trackName: true,
            artistName: true,
            albumName: true,
            albumArtUrl: true,
            spotifyUrl: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin") allowed = true;
      else if (u.id && booking.userId === u.id) allowed = true;
      else if (session.user.email && booking.email === session.user.email) allowed = true;
    }

    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      requests: booking.guestRequests,
    });
  } catch (error) {
    console.error("Error fetching guest requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch guest requests" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/client/bookings/[id]/guest-requests
 *
 * Toggle guest requests enabled/disabled.
 * Auth: session (user owns booking or admin) OR ?token= matching portalToken (magic link).
 */
export async function PATCH(
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
    const session = await getServerSession(request);
    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        email: true,
        portalToken: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin") allowed = true;
      else if (u.id && booking.userId === u.id) allowed = true;
      else if (session.user.email && booking.email === session.user.email) allowed = true;
    }

    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { guestRequestsEnabled: enabled },
      select: { guestRequestsEnabled: true },
    });

    return NextResponse.json({
      success: true,
      enabled: updated.guestRequestsEnabled,
    });
  } catch (error) {
    console.error("Error updating guest requests setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
