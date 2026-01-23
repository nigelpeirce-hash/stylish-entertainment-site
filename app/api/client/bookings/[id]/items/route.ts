import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/client/bookings/[id]/items
 * List hire items added to this booking (BookingItem). No auth required; access via portal token or context.
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

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const items = await prisma.bookingItem.findMany({
      where: { bookingId },
      include: {
        HireItem: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("[booking items GET]", e);
    return NextResponse.json(
      { error: "Failed to fetch booking items" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/client/bookings/[id]/items
 * Add hireItemId to booking (BookingItem). No Stripe or payment session.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const body = await request.json();
    const hireItemId = typeof body.hireItemId === "string" ? body.hireItemId.trim() : null;
    const quantity = typeof body.quantity === "number" ? Math.max(1, Math.floor(body.quantity)) : 1;

    if (!hireItemId) {
      return NextResponse.json({ error: "hireItemId required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const hireItem = await prisma.hireItem.findUnique({
      where: { id: hireItemId },
      select: { id: true, isActive: true, stockAvailable: true },
    });
    if (!hireItem) {
      return NextResponse.json({ error: "Hire item not found" }, { status: 404 });
    }
    if (!hireItem.isActive) {
      return NextResponse.json({ error: "Hire item is not available" }, { status: 400 });
    }

    const existing = await prisma.bookingItem.findUnique({
      where: {
        bookingId_hireItemId: { bookingId, hireItemId },
      },
      select: { id: true, quantity: true },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      const cap = hireItem.stockAvailable > 0 ? Math.min(newQty, hireItem.stockAvailable) : newQty;
      await prisma.bookingItem.update({
        where: { id: existing.id },
        data: { quantity: cap, updatedAt: new Date() },
      });
    } else {
      const qty = hireItem.stockAvailable > 0 ? Math.min(quantity, hireItem.stockAvailable) : quantity;
      await prisma.bookingItem.create({
        data: {
          bookingId,
          hireItemId,
          quantity: qty,
          status: "pending_approval",
          updatedAt: new Date(),
        },
      });
    }

    const items = await prisma.bookingItem.findMany({
      where: { bookingId },
      include: {
        HireItem: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, items });
  } catch (e: any) {
    console.error("[booking items POST]", e);
    return NextResponse.json(
      { error: "Failed to add item to booking" },
      { status: 500 }
    );
  }
}
