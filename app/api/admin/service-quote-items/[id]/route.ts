import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * PATCH - Update a service quote item (admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1") ||
      process.env.NODE_ENV === "development";
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      description,
      unit,
      pricePerUnit,
      category,
      displayOrder,
      isActive,
    } = body;

    const data: {
      name?: string;
      description?: string | null;
      unit?: string;
      pricePerUnit?: number;
      category?: string;
      displayOrder?: number;
      isActive?: boolean;
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      }
      data.name = name.trim();
    }
    if (description !== undefined) {
      data.description = description == null || description === "" ? null : String(description).trim();
    }
    if (unit !== undefined) {
      if (typeof unit !== "string" || !unit.trim()) {
        return NextResponse.json({ error: "Unit cannot be empty" }, { status: 400 });
      }
      data.unit = unit.trim();
    }
    if (pricePerUnit !== undefined) {
      const price = Number(pricePerUnit);
      if (Number.isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: "Price must be a non-negative number" },
          { status: 400 }
        );
      }
      data.pricePerUnit = price;
    }
    if (category !== undefined) {
      if (category !== "lighting" && category !== "venue_styling") {
        return NextResponse.json(
          { error: "Category must be 'lighting' or 'venue_styling'" },
          { status: 400 }
        );
      }
      data.category = category;
    }
    if (displayOrder !== undefined) data.displayOrder = Number(displayOrder) || 0;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const item = await prisma.serviceQuoteItem.update({
      where: { id },
      data,
    });

    return NextResponse.json({ item });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    console.error("Error updating service quote item:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a service quote item (admin)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1") ||
      process.env.NODE_ENV === "development";
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.serviceQuoteItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2025") {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    console.error("Error deleting service quote item:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete item" },
      { status: 500 }
    );
  }
}
