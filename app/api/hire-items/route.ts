import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all active hire items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const slug = searchParams.get("slug");

    const where: any = {};
    if (category) where.category = category;
    if (slug) where.slug = slug;
    if (isActive !== null) {
      where.isActive = isActive === "true";
    } else {
      where.isActive = true; // Default to active items
    }

    const items = await prisma.hireItem.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching hire items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
