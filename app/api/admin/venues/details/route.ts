import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET ?venueName=X&venuePostcode=Y
 * Returns venue fields from the most recent booking matching that venue (for worksheet pre-fill).
 * Admin only.
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const venueName = searchParams.get("venueName")?.trim();
    if (!venueName) {
      return NextResponse.json({ error: "venueName is required" }, { status: 400 });
    }
    const venuePostcode = searchParams.get("venuePostcode")?.trim() || null;

    const booking = await prisma.booking.findFirst({
      where: {
        venueName: { equals: venueName, mode: "insensitive" },
        ...(venuePostcode
          ? { venuePostcode: { contains: venuePostcode.replace(/\s+/g, ""), mode: "insensitive" as const } }
          : {}),
      },
      orderBy: { eventDate: "desc" },
      select: {
        venueContact: true,
        venueAddress: true,
        venueAddress2: true,
        venueTown: true,
        venueCounty: true,
        venuePostcode: true,
        venuePhoneAreaCode: true,
        venuePhoneNumber: true,
        venueIsPrivateHouse: true,
        venueWhat3Words: true,
        venueLoadInNotes: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ venue: null }, { status: 200 });
    }

    const venuePhone =
      booking.venuePhoneAreaCode && booking.venuePhoneNumber
        ? `${booking.venuePhoneAreaCode} ${booking.venuePhoneNumber}`.trim()
        : "";

    return NextResponse.json({
      venue: {
        venueContact: booking.venueContact || "",
        venueAddress: booking.venueAddress || "",
        venueAddress2: booking.venueAddress2 || "",
        venueTown: booking.venueTown || "",
        venueCounty: booking.venueCounty || "",
        venuePostcode: booking.venuePostcode || "",
        venuePhone,
        venueIsPrivateHouse: !!booking.venueIsPrivateHouse,
        venueWhat3Words: booking.venueWhat3Words || "",
        venueLoadInNotes: booking.venueLoadInNotes || "",
      },
    });
  } catch (e) {
    console.error("[venues/details]", e);
    return NextResponse.json({ error: "Failed to fetch venue details" }, { status: 500 });
  }
}
