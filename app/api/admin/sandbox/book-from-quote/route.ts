import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { createQuoteToken } from "@/lib/quote-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/sandbox/book-from-quote
 * Admin-only. Generate a book-from-quote token for testing (sandbox).
 * Body: { bookingId, artistType, staffId?, fee? }
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { bookingId, artistType, staffId, fee } = body;

    if (!bookingId || !artistType) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, artistType" },
        { status: 400 }
      );
    }
    if (artistType !== "dj" && artistType !== "musician") {
      return NextResponse.json(
        { error: "artistType must be 'dj' or 'musician'" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, email: true, name: true, archivedAt: true },
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

    const token = createQuoteToken({
      bookingId: booking.id,
      clientEmail: booking.email,
      artistType: artistType as "dj" | "musician",
      staffId: staffId ?? undefined,
      fee: typeof fee === "number" ? fee : fee != null ? parseFloat(String(fee)) : undefined,
    });

    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
    const link = `${base.replace(/\/$/, "")}/book-from-quote?token=${encodeURIComponent(token)}`;

    return NextResponse.json({ token, link, bookingId: booking.id });
  } catch (e) {
    console.error("[sandbox book-from-quote] error:", e);
    return NextResponse.json(
      { error: (e as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
