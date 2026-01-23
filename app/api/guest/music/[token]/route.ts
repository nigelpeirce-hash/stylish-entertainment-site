import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/guest/music/[token]
 * Returns booking info and existing guest requests for a token
 * Token is stored in a cookie or session - for simplicity, we'll use a guest token system
 * For now, we'll validate via booking.portalToken or a separate guestToken field
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const token = resolved.token;

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Find booking by portalToken (reuse existing magic link system)
    const booking = await prisma.booking.findFirst({
      where: {
        portalToken: token,
      },
      select: {
        id: true,
        name: true,
        eventDate: true,
        venueName: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    // Get guest requests for this booking
    const requests = await prisma.guestRequest.findMany({
      where: {
        bookingId: booking.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      booking: {
        name: booking.name,
        eventDate: booking.eventDate,
        venueName: booking.venueName,
      },
      requests,
    });
  } catch (error) {
    console.error("Error fetching guest music requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/guest/music/[token]
 * Submit a new guest request (limit 3 per booking)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const token = resolved.token;
    const body = await request.json();
    const { songTitle, artist, guestName } = body;

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    if (!songTitle || !songTitle.trim()) {
      return NextResponse.json({ error: "Song title is required" }, { status: 400 });
    }

    // Find booking by portalToken
    const booking = await prisma.booking.findFirst({
      where: {
        portalToken: token,
      },
      select: {
        id: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    // Check existing pending requests (limit 3)
    const pendingCount = await prisma.guestRequest.count({
      where: {
        bookingId: booking.id,
        status: "pending",
      },
    });

    if (pendingCount >= 3) {
      return NextResponse.json(
        { error: "Maximum of 3 song requests allowed" },
        { status: 400 }
      );
    }

    // Create guest request
    const guestRequest = await prisma.guestRequest.create({
      data: {
        bookingId: booking.id,
        songTitle: songTitle.trim(),
        artist: artist?.trim() || null,
        guestName: guestName?.trim() || null,
        status: "pending",
      },
    });

    return NextResponse.json({ request: guestRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating guest request:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
