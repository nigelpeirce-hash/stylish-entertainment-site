import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Seed initial hire items
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = [
      {
        name: "Lanterns",
        description: "Decorative lanterns for ambient lighting",
        price: 50.00,
        stockAvailable: 999, // Unlimited for now
        category: "decor",
        isActive: true,
      },
      {
        name: "Candlesticks",
        description: "Elegant candlesticks for table settings",
        price: 50.00,
        stockAvailable: 999,
        category: "decor",
        isActive: true,
      },
      {
        name: "Mirroballs",
        description: "Mirror balls for disco lighting effects",
        price: 50.00,
        stockAvailable: 40,
        category: "lighting",
        isActive: true,
      },
      {
        name: "Vases",
        description: "Decorative vases for floral arrangements",
        price: 50.00,
        stockAvailable: 10,
        category: "decor",
        isActive: true,
      },
    ];

    const created = [];
    for (const item of items) {
      // Check if item already exists
      const existing = await prisma.hireItem.findFirst({
        where: { name: item.name },
      });

      if (!existing) {
        const createdItem = await prisma.hireItem.create({
          data: item,
        });
        created.push(createdItem);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${created.length} new items`,
      items: created,
    });
  } catch (error) {
    console.error("Error seeding hire items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
