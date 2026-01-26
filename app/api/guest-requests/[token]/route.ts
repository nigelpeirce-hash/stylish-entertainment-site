import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/guest-requests/[token]
 * 
 * Public endpoint to get booking info for guest request page
 * Returns couple names, event date, and existing song requests
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: "Invalid request link" },
        { status: 400 }
      );
    }

    // Find booking by guest request token
    const booking = await prisma.booking.findUnique({
      where: { guestRequestToken: token },
      select: {
        id: true,
        name: true,
        displayName: true,
        eventDate: true,
        eventType: true,
        venueName: true,
        guestRequestsEnabled: true,
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
            sessionId: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "This request link is not valid or has expired." },
        { status: 404 }
      );
    }

    // Check if guest requests are enabled
    if (!booking.guestRequestsEnabled) {
      return NextResponse.json(
        { error: "Song requests are currently closed for this event." },
        { status: 403 }
      );
    }

    // Check if event date has passed (auto-close)
    const eventDate = new Date(booking.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return NextResponse.json(
        { error: "Song requests have closed as the event has passed." },
        { status: 403 }
      );
    }

    // Get session ID from cookie to identify this guest's requests
    const sessionId = request.cookies.get("guest_session")?.value;

    // Format couple names nicely
    const coupleName = booking.displayName || booking.name;

    // Format event date
    const formattedDate = eventDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Determine event type label
    const eventTypeLabel = booking.eventType?.toLowerCase().includes("wedding")
      ? "Wedding"
      : booking.eventType?.toLowerCase().includes("party")
      ? "Party"
      : "Celebration";

    // Get this session's requests
    const myRequests = sessionId
      ? booking.guestRequests.filter((r) => r.sessionId === sessionId)
      : [];

    // Count total requests
    const totalRequests = booking.guestRequests.length;

    return NextResponse.json({
      coupleName,
      eventDate: formattedDate,
      eventType: eventTypeLabel,
      venueName: booking.venueName,
      totalRequests,
      myRequests: myRequests.map((r) => ({
        id: r.id,
        trackName: r.trackName,
        artistName: r.artistName,
        albumArtUrl: r.albumArtUrl,
        guestName: r.guestName,
        note: r.note,
      })),
      // All requests (for bride's view via different endpoint, not exposed here)
    });
  } catch (error) {
    console.error("Error fetching guest request info:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
