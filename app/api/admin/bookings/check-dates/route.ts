import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Diagnostic endpoint to check for bookings with suspicious dates
 * Returns bookings with dates that are:
 * - Before 2000 (likely wrong)
 * - In the past more than 5 years (might be old completed bookings)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allBookings = await prisma.booking.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        eventType: true,
        eventDate: true,
        venueName: true,
        createdAt: true,
        status: true,
      },
      orderBy: {
        eventDate: "asc",
      },
    });

    const now = new Date();
    const year2000 = new Date("2000-01-01");
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(now.getFullYear() - 5);

    const suspiciousBookings = allBookings
      .map((booking) => {
        const eventDate = new Date(booking.eventDate);
        const isBefore2000 = eventDate < year2000;
        const isOldPast = eventDate < fiveYearsAgo && booking.status !== "completed" && booking.status !== "cancelled";

        return {
          ...booking,
          eventDateRaw: booking.eventDate.toISOString(),
          eventDateFormatted: eventDate.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          flags: {
            isBefore2000,
            isOldPast,
          },
        };
      })
      .filter((b) => b.flags.isBefore2000 || b.flags.isOldPast);

    return NextResponse.json({
      totalBookings: allBookings.length,
      suspiciousCount: suspiciousBookings.length,
      suspiciousBookings,
    });
  } catch (error) {
    console.error("Error checking booking dates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
