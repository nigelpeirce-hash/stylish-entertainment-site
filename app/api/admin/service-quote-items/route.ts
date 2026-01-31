import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET - List service quote items (admin). Optional ?category=lighting|venue_styling
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();

    const where: { category?: string } = {};
    if (category === "lighting" || category === "venue_styling") {
      where.category = category;
    }

    const items = await prisma.serviceQuoteItem.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ items });
  } catch (error: unknown) {
    console.error("Error fetching service quote items:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch items" },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a service quote item (admin)
 */
export async function POST(request: NextRequest) {
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

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (!unit || typeof unit !== "string" || !unit.trim()) {
      return NextResponse.json(
        { error: "Unit is required (e.g. per 10m string, each)" },
        { status: 400 }
      );
    }
    if (category !== "lighting" && category !== "venue_styling") {
      return NextResponse.json(
        { error: "Category must be lighting or venue_styling" },
        { status: 400 }
      );
    }

    const price = Number(pricePerUnit);
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Price must be a non-negative number" },
        { status: 400 }
      );
    }

    const now = new Date();
    const item = await prisma.serviceQuoteItem.create({
      data: {
        name: name.trim(),
        description: description != null ? String(description).trim() || null : null,
        unit: unit.trim(),
        pricePerUnit: price,
        category,
        displayOrder: Number(displayOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        updatedAt: now,
      },
    });

    return NextResponse.json({ item });
  } catch (error: unknown) {
    console.error("Error creating service quote item:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create item" },
      { status: 500 }
    );
  }
}
