import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const MAX_SONGS_PER_GUEST = 3;

/**
 * Helper to get or create session ID
 */
async function getSessionId(request: NextRequest): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("guest_session")?.value;

  if (!sessionId) {
    sessionId = uuidv4();
  }

  return sessionId;
}

/**
 * POST /api/guest-requests/[token]/songs
 * 
 * Add a song request from a guest
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const sessionId = await getSessionId(request);

    if (!token) {
      return NextResponse.json(
        { error: "Invalid request link" },
        { status: 400 }
      );
    }

    // Find booking
    const booking = await prisma.booking.findUnique({
      where: { guestRequestToken: token },
      select: {
        id: true,
        eventDate: true,
        guestRequestsEnabled: true,
        guestRequests: {
          where: { sessionId },
          select: { id: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "This request link is not valid." },
        { status: 404 }
      );
    }

    // Check if enabled
    if (!booking.guestRequestsEnabled) {
      return NextResponse.json(
        { error: "Song requests are currently closed." },
        { status: 403 }
      );
    }

    // Check if event has passed
    const eventDate = new Date(booking.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return NextResponse.json(
        { error: "Song requests have closed." },
        { status: 403 }
      );
    }

    // Check 3-song limit
    if (booking.guestRequests.length >= MAX_SONGS_PER_GUEST) {
      return NextResponse.json(
        { error: `You can only request up to ${MAX_SONGS_PER_GUEST} songs.` },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      spotifyTrackId, 
      trackName, 
      artistName, 
      albumName, 
      albumArtUrl, 
      previewUrl, 
      spotifyUrl,
      guestName,
      note,
    } = body;

    // Validate required fields
    if (!trackName || !artistName) {
      return NextResponse.json(
        { error: "Song name and artist are required." },
        { status: 400 }
      );
    }

    // Check for duplicate song in this booking (by track name + artist)
    const existingRequest = await prisma.guestRequest.findFirst({
      where: {
        bookingId: booking.id,
        trackName: { equals: trackName, mode: "insensitive" },
        artistName: { equals: artistName, mode: "insensitive" },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "This song has already been requested!" },
        { status: 400 }
      );
    }

    // Create the guest request
    const guestRequest = await prisma.guestRequest.create({
      data: {
        bookingId: booking.id,
        sessionId,
        spotifyTrackId,
        trackName,
        artistName,
        albumName,
        albumArtUrl,
        previewUrl,
        spotifyUrl,
        guestName: guestName?.trim() || null,
        note: note?.trim() || null,
        status: "pending",
      },
    });

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      request: {
        id: guestRequest.id,
        trackName: guestRequest.trackName,
        artistName: guestRequest.artistName,
        albumArtUrl: guestRequest.albumArtUrl,
        guestName: guestRequest.guestName,
        note: guestRequest.note,
      },
      remainingSlots: MAX_SONGS_PER_GUEST - (booking.guestRequests.length + 1),
    });

    // Set session cookie (expires in 1 year)
    response.cookies.set("guest_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error adding song request:", error);
    
    // Handle unique constraint violation (duplicate song)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This song has already been requested!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/guest-requests/[token]/songs?id=xxx
 * 
 * Remove a song request (only if it belongs to this session)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const sessionId = await getSessionId(request);
    
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    if (!token || !requestId) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // Find the guest request
    const guestRequest = await prisma.guestRequest.findFirst({
      where: {
        id: requestId,
        sessionId,
        booking: {
          guestRequestToken: token,
        },
      },
    });

    if (!guestRequest) {
      return NextResponse.json(
        { error: "Request not found or you don't have permission to remove it." },
        { status: 404 }
      );
    }

    // Delete the request
    await prisma.guestRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing song request:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
