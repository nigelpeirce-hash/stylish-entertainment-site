import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/sandbox/client-portal
 * Admin-only. Generate a client portal magic-link for testing (sandbox).
 * Body: { bookingId }
 * Returns: { link, bookingId } — open link in incognito to test as client.
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { bookingId } = body;

    if (!bookingId || typeof bookingId !== "string" || !bookingId.trim()) {
      return NextResponse.json(
        { error: "Missing required field: bookingId" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId.trim() },
      select: { id: true, portalToken: true, name: true, archivedAt: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (booking.archivedAt) {
      return NextResponse.json(
        { error: "Booking is archived" },
        { status: 400 }
      );
    }

    let portalToken = booking.portalToken;
    if (!portalToken) {
      portalToken = randomBytes(32).toString("hex");
      await prisma.booking.update({
        where: { id: booking.id },
        data: { portalToken },
      });
    }

    const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
    const link = `${base.replace(/\/$/, "")}/client/bookings/${booking.id}?token=${encodeURIComponent(portalToken)}`;

    return NextResponse.json({ link, bookingId: booking.id, clientName: booking.name || undefined });
  } catch (e) {
    console.error("[sandbox client-portal] error:", e);
    return NextResponse.json(
      { error: (e as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
