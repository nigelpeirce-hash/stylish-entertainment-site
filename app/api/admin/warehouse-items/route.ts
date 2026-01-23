import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/admin/warehouse-items
 * Returns all active warehouse items, optionally filtered by category
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = request.nextUrl.searchParams.get("category");
    const isActive = request.nextUrl.searchParams.get("isActive") !== "false";

    const items = await prisma.warehouseItem.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      orderBy: [
        { category: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching warehouse items:", error);
    return NextResponse.json(
      { error: "Failed to fetch warehouse items" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/warehouse-items
 * Create a new warehouse item
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, weight, size, description, isActive = true } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    const item = await prisma.warehouseItem.create({
      data: {
        name,
        category,
        weight: weight ? parseFloat(weight) : null,
        size: size || null,
        description: description || null,
        isActive,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Error creating warehouse item:", error);
    return NextResponse.json(
      { error: "Failed to create warehouse item" },
      { status: 500 }
    );
  }
}
