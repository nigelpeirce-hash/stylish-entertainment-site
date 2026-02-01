import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/demo/guest-requests-links
 *
 * Returns portal and guest-request links for a booking with the given email.
 * Query: ?email=nigelpeirce@me.com
 * Ensures portalToken and guestRequestToken exist; creates them if missing.
 * For demo/testing only.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "nigelpeirce@me.com";

    const booking = await prisma.booking.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        archivedAt: null,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        eventDate: true,
        venueName: true,
        eventType: true,
        portalToken: true,
        guestRequestToken: true,
        guestRequestsEnabled: true,
      },
      orderBy: { eventDate: "desc" },
    });

    if (!booking) {
      return NextResponse.json(
        {
          error: "No booking found",
          hint: `No active booking found for ${email}. Create a booking in admin or use a different email.`,
        },
        { status: 404 }
      );
    }

    let portalToken = booking.portalToken;
    let guestRequestToken = booking.guestRequestToken;
    const updates: Record<string, string> = {};

    if (!portalToken) {
      portalToken = randomBytes(32).toString("hex");
      updates.portalToken = portalToken;
    }
    if (!guestRequestToken) {
      guestRequestToken = `gr_${randomBytes(12).toString("hex")}`;
      updates.guestRequestToken = guestRequestToken;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: updates,
      });
    }

    const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
    const baseUrl = base.replace(/\/$/, "");

    return NextResponse.json({
      bookingId: booking.id,
      clientName: booking.displayName || booking.name,
      email: booking.email,
      eventDate: booking.eventDate,
      venueName: booking.venueName,
      eventType: booking.eventType,
      guestRequestsEnabled: booking.guestRequestsEnabled ?? true,
      links: {
        clientPortal: `${baseUrl}/client/bookings/${booking.id}?token=${encodeURIComponent(portalToken!)}`,
        guestRequestPage: `${baseUrl}/requests/${guestRequestToken}`,
      },
    });
  } catch (e) {
    console.error("[demo guest-requests-links]", e);
    return NextResponse.json(
      { error: (e as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
