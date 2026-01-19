import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { venueName: { contains: search, mode: "insensitive" } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [
        { priority: "desc" }, // Urgent first (alphabetically "urgent" > "medium" > "low")
        { createdAt: "desc" },
      ],
      take: 100,
    });

    // Sort to ensure urgent bookings are truly first (priority: urgent > high > medium > low)
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const sortedBookings = bookings.sort((a, b) => {
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ bookings: sortedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
