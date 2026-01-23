import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/client/bookings/[id]/guest-requests/[requestId]/move-to-official
 * Moves a guest request to the official music list (updates booking.musicRequests)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; requestId: string }> | { id: string; requestId: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    const requestId = resolved.requestId;

    const session = await auth();
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        musicRequests: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check authorization (user owns booking or is admin)
    const u = session?.user as { id?: string; role?: string };
    if (u.role !== "admin" && (!u.id || booking.userId !== u.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get guest request
    const guestRequest = await prisma.guestRequest.findUnique({
      where: { id: requestId },
    });

    if (!guestRequest || guestRequest.bookingId !== bookingId) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Update guest request status
    await prisma.guestRequest.update({
      where: { id: requestId },
      data: { status: "moved_to_official" },
    });

    // Add to booking's musicRequests field
    const newRequest = guestRequest.artist
      ? `${guestRequest.songTitle} by ${guestRequest.artist}`
      : guestRequest.songTitle;
    const currentRequests = (booking.musicRequests as string) || "";
    const updatedRequests = currentRequests
      ? `${currentRequests}\n${newRequest}`
      : newRequest;

    await prisma.booking.update({
      where: { id: bookingId },
      data: { musicRequests: updatedRequests },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error moving guest request to official list:", error);
    return NextResponse.json(
      { error: "Failed to move request" },
      { status: 500 }
    );
  }
}
