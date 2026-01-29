import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getVenueNamesForAdmin } from "@/lib/venues-weve-worked-at";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/venues
 *
 * - No query: returns venues for Quick select. Merges (1) "Venues we've worked at" (DJ page)
 *   with (2) distinct venueName+postcode from Booking. Deduped by venueName (case-insensitive).
 *   Shape: { venues: { id, venueName, venuePostcode }[] }
 * - ?name=...: lookup Venue table (intelligence) for default timings/notes.
 *   Shape: { venues: Venue[] } — use for "Apply venue defaults".
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name")?.trim();

    if (name) {
      const venues = await prisma.venue.findMany({
        where: {
          venueName: {
            contains: name,
            mode: "insensitive",
          },
        },
        orderBy: { venueName: "asc" },
      });
      return NextResponse.json({ venues });
    }

    const known = getVenueNamesForAdmin();
    const rows = await prisma.booking.findMany({
      where: {
        venueName: { not: "" },
      },
      select: { venueName: true, venuePostcode: true },
      orderBy: { venueName: "asc" },
      take: 500,
    });

    const seenKey = new Set<string>();
    const seenName = new Set<string>();
    const combined: { venueName: string; venuePostcode: string | null }[] = [];

    for (const r of rows) {
      const n = (r.venueName || "").trim();
      const p = (r.venuePostcode || "").trim().replace(/\s/g, "");
      const key = `${n.toLowerCase()}_${p.toLowerCase()}`;
      if (seenKey.has(key)) continue;
      seenKey.add(key);
      seenName.add(n.toLowerCase());
      combined.push({ venueName: n, venuePostcode: r.venuePostcode || null });
    }

    for (const v of known) {
      const n = v.venueName.trim();
      if (seenName.has(n.toLowerCase())) continue;
      seenName.add(n.toLowerCase());
      combined.push({ venueName: n, venuePostcode: v.venuePostcode });
    }

    const venues = combined
      .sort((a, b) => a.venueName.localeCompare(b.venueName, undefined, { sensitivity: "base" }))
      .map((r, i) => ({
        id: `v-${i}-${r.venueName.replace(/\s/g, "-")}`,
        venueName: r.venueName,
        venuePostcode: r.venuePostcode,
      }));

    return NextResponse.json({ venues });
  } catch (e: any) {
    console.error("[venues]", e);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}
