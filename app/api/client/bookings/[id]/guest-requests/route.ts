import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/bookings/[id]/guest-requests
 * 
 * Fetch all guest song requests for a booking (authenticated client)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;

    // Verify the user has access to this booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { userId: session.user.id },
          { email: session.user.email || "" },
        ],
      },
      select: {
        id: true,
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
 * Toggle guest requests enabled/disabled
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;
    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Verify the user has access to this booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { userId: session.user.id },
          { email: session.user.email || "" },
        ],
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update the setting
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
