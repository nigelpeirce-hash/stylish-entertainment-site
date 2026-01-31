import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET - List active service quote items by category (public, for quote builder).
 * Query: category=lighting | venue_styling (required).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();

    if (category !== "lighting" && category !== "venue_styling") {
      return NextResponse.json(
        { error: "Query parameter category is required: lighting or venue_styling" },
        { status: 400 }
      );
    }

    const items = await prisma.serviceQuoteItem.findMany({
      where: { category, isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        unit: true,
        pricePerUnit: true,
        category: true,
      },
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
