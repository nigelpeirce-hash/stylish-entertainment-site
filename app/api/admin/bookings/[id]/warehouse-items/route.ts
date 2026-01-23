import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/bookings/[id]/warehouse-items
 * Returns all warehouse items assigned to a booking
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;

    const items = await prisma.bookingWarehouseItem.findMany({
      where: { bookingId },
      include: {
        WarehouseItem: true,
      },
      orderBy: [
        { WarehouseItem: { category: "asc" } },
        { WarehouseItem: { name: "asc" } },
      ],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching booking warehouse items:", error);
    return NextResponse.json(
      { error: "Failed to fetch warehouse items" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/bookings/[id]/warehouse-items
 * Add a warehouse item to a booking (upsert - increments quantity if exists)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    const body = await request.json();
    const { warehouseItemId, quantity = 1 } = body;

    if (!warehouseItemId) {
      return NextResponse.json(
        { error: "warehouseItemId is required" },
        { status: 400 }
      );
    }

    // Check if item already exists for this booking
    const existing = await prisma.bookingWarehouseItem.findUnique({
      where: {
        bookingId_warehouseItemId: {
          bookingId,
          warehouseItemId,
        },
      },
    });

    let item;
    if (existing) {
      // Increment quantity
      item = await prisma.bookingWarehouseItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { WarehouseItem: true },
      });
    } else {
      // Create new
      item = await prisma.bookingWarehouseItem.create({
        data: {
          bookingId,
          warehouseItemId,
          quantity,
        },
        include: { WarehouseItem: true },
      });
    }

    return NextResponse.json({ item }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error("Error adding warehouse item to booking:", error);
    return NextResponse.json(
      { error: "Failed to add warehouse item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/bookings/[id]/warehouse-items
 * Remove a warehouse item from a booking (or reduce quantity)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    const { searchParams } = request.nextUrl;
    const warehouseItemId = searchParams.get("warehouseItemId");
    const reduceOnly = searchParams.get("reduceOnly") === "true";

    if (!warehouseItemId) {
      return NextResponse.json(
        { error: "warehouseItemId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.bookingWarehouseItem.findUnique({
      where: {
        bookingId_warehouseItemId: {
          bookingId,
          warehouseItemId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Item not found in booking" },
        { status: 404 }
      );
    }

    if (reduceOnly && existing.quantity > 1) {
      // Reduce quantity by 1
      await prisma.bookingWarehouseItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity - 1 },
      });
    } else {
      // Remove completely
      await prisma.bookingWarehouseItem.delete({
        where: { id: existing.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing warehouse item from booking:", error);
    return NextResponse.json(
      { error: "Failed to remove warehouse item" },
      { status: 500 }
    );
  }
}
