import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/venues
 * Returns venues for Venue Intelligence (default timings, venue notes).
 * Query: ?name=... for lookup by venue name (case-insensitive partial match).
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name")?.trim();

    const venues = await prisma.venue.findMany({
      where: name
        ? {
            venueName: {
              contains: name,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { venueName: "asc" },
    });

    return NextResponse.json({ venues });
  } catch (e: any) {
    console.error("[venues]", e);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}
