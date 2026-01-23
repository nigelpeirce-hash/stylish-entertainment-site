import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/client/bookings/[id]
 * Returns booking data for the client portal (countdown, venue, timings).
 * Auth: session (user owns booking or admin) OR ?token= matching portalToken.
 * Used for live sync / polling so the Golden Countdown updates when admin edits.
 */
export async function GET(
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
        name: true,
        email: true,
        eventDate: true,
        ceremonyTime: true,
        venueName: true,
        venuePostcode: true,
        status: true,
        depositReceived: true,
        depositReceivedManual: true,
        finalDetailsConfirmed: true,
        message: true,
        eventType: true,
        numberOfGuests: true,
        services: true,
        upsellItems: true,
        djStartTime: true,
        djFinishTime: true,
        portalToken: true,
        musicRequests: true,
      },
    });

    // Fetch guest requests if booking exists
    let guestRequests: Array<{
      id: string;
      songTitle: string;
      artist: string | null;
      guestName: string | null;
      status: string;
    }> = [];
    if (booking) {
      try {
        const requests = await prisma.guestRequest.findMany({
          where: {
            bookingId: booking.id,
            status: { in: ["pending", "approved", "moved_to_official"] },
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            songTitle: true,
            artist: true,
            guestName: true,
            status: true,
          },
        });
        guestRequests = requests;
      } catch (e) {
        console.log("Note: Guest requests not available", e);
      }
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin" || (!!u.id && booking.userId === u.id)) allowed = true;
    }

    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch venue notes if venueName exists
    let venueNotes: string | null = null;
    let googleMapsUrl: string | null = null;
    if (booking.venueName) {
      try {
        const venue = await prisma.venue.findUnique({
          where: { venueName: booking.venueName },
          select: { venueNotes: true },
        });
        venueNotes = venue?.venueNotes || null;
      } catch (e) {
        console.log("Note: Venue lookup failed", e);
      }
      
      // Generate Google Maps URL from venue name and postcode
      const query = [booking.venueName, booking.venuePostcode].filter(Boolean).join(", ");
      if (query) {
        googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      }
    }

    const { portalToken: _pt, userId: _uid, ...safe } = booking;
    return NextResponse.json({ 
      booking: { 
        ...safe, 
        venueNotes,
        googleMapsUrl,
        guestRequests,
      } 
    });
  } catch (e: unknown) {
    console.error("[GET /api/client/bookings/[id]]", e);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
