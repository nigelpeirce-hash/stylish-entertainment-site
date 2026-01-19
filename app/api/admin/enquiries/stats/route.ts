import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total leads this month (Bookings + NewEnquiries)
    const bookingLeads = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          not: "cancelled",
        },
      },
    });

    const newEnquiryLeads = await prisma.newEnquiry.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          not: "converted", // Don't count converted (they're already in bookings)
        },
      },
    });

    const totalLeadsThisMonth = bookingLeads + newEnquiryLeads;

    // Conversion rate (bookings that reached "contract_sent" / total leads)
    const convertedCount = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          in: ["confirmed", "locked"],
        },
        finalDetailsConfirmed: true,
      },
    });

    const conversionRate = totalLeadsThisMonth > 0 
      ? (convertedCount / totalLeadsThisMonth) * 100 
      : 0;

    // Hottest upcoming date (date with most bookings in the next 30 days)
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        eventDate: {
          gte: now,
          lte: next30Days,
        },
        status: {
          not: "cancelled",
        },
      },
      select: {
        eventDate: true,
      },
    });

    // Group by date and find the date with most bookings
    const dateCounts = new Map<string, number>();
    upcomingBookings.forEach((booking) => {
      const dateKey = booking.eventDate.toISOString().split("T")[0];
      dateCounts.set(dateKey, (dateCounts.get(dateKey) || 0) + 1);
    });

    let hottestDate: string | null = null;
    let maxCount = 0;
    dateCounts.forEach((count, date) => {
      if (count > maxCount) {
        maxCount = count;
        hottestDate = date;
      }
    });

    const stats = {
      totalLeadsThisMonth,
      conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
      hottestUpcomingDate: hottestDate,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching enquiry stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
