import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/public/bookings/[token]/guest-request
 * Submit a guest music request (public endpoint, no auth required)
 * Token is the booking's portalToken
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const token = resolved.token;
    const body = await request.json();
    const { songInput, guestName } = body;

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    if (!songInput || !songInput.trim()) {
      return NextResponse.json({ error: "Song is required" }, { status: 400 });
    }

    // Find booking by portalToken (need name, venueName, eventDate for admin notification)
    const booking = await prisma.booking.findFirst({
      where: {
        portalToken: token,
      },
      select: {
        id: true,
        name: true,
        venueName: true,
        eventDate: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    // Parse songInput - try to split "Artist - Title" or just use as title
    let songTitle = songInput.trim();
    let artist: string | null = null;

    // Try to parse "Artist - Title" format
    const dashMatch = songInput.match(/^(.+?)\s*-\s*(.+)$/);
    if (dashMatch) {
      artist = dashMatch[1].trim();
      songTitle = dashMatch[2].trim();
    }

    // Check existing pending requests (limit 3 per booking)
    // Note: We're not enforcing per-guest limit here since we're using localStorage on client
    // But we still want to prevent database spam
    const pendingCount = await prisma.guestRequest.count({
      where: {
        bookingId: booking.id,
        status: "pending",
      },
    });

    if (pendingCount >= 50) {
      // Reasonable limit to prevent abuse
      return NextResponse.json(
        { error: "Maximum requests reached for this event" },
        { status: 400 }
      );
    }

    // Create guest request
    const guestRequest = await prisma.guestRequest.create({
      data: {
        bookingId: booking.id,
        songTitle,
        artist,
        guestName: guestName?.trim() || null,
        status: "pending",
      },
    });

    try {
      const eventDateLabel = booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : undefined;
      await notifyAdminSignificantEvent({
        type: "guest_request_submitted",
        bookingId: booking.id,
        actor: "client",
        title: "Guest song request",
        description: `"${songTitle}"${artist ? ` by ${artist}` : ""}${guestName?.trim() ? ` from ${guestName.trim()}` : ""}`,
        bookingName: booking.name ?? undefined,
        venueName: booking.venueName ?? undefined,
        eventDate: eventDateLabel,
        linkText: "View booking",
      });
    } catch (e) {
      console.warn("Admin notification (guest_request_submitted) failed:", e);
    }

    return NextResponse.json({ success: true, request: guestRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating guest request:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
