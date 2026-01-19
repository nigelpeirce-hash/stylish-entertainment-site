import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Check recent bookings - especially useful for debugging missing enquiries
 * Shows bookings from the last 24 hours
 */
export async function GET(request: NextRequest) {
  try {
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    // In development/localhost, allow access even if admin check fails (for dev bypass)
    let admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get bookings from last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentBookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: yesterday,
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    // Check for specific enquiry (Alison Peirce)
    const alisonBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { name: { contains: "Alison", mode: "insensitive" } },
          { name: { contains: "Alison Peirce", mode: "insensitive" } },
          { email: { contains: "alison", mode: "insensitive" } },
        ],
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Also check ALL bookings to see if database is working
    const allBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        venueName: true,
      },
    });

    // Check pending bookings specifically
    const pendingBookings = await prisma.booking.findMany({
      where: {
        status: "pending",
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        venueName: true,
      },
    });

    return NextResponse.json({
      recentBookings: recentBookings.map(b => ({
        id: b.id,
        name: b.name,
        email: b.email,
        status: b.status,
        priority: (b as any).priority || "unknown",
        createdAt: b.createdAt,
        venueName: b.venueName,
      })),
      alisonBookings: alisonBookings.map(b => ({
        id: b.id,
        name: b.name,
        email: b.email,
        status: b.status,
        priority: (b as any).priority || "unknown",
        createdAt: b.createdAt,
        venueName: b.venueName,
      })),
      allBookings: allBookings,
      pendingBookings: pendingBookings,
      stats: {
        total: recentBookings.length,
        pending: recentBookings.filter(b => b.status === "pending").length,
        confirmed: recentBookings.filter(b => b.status === "confirmed").length,
        allBookingsCount: allBookings.length,
        pendingBookingsCount: pendingBookings.length,
      },
      databaseCheck: {
        hasAnyBookings: allBookings.length > 0,
        hasPendingBookings: pendingBookings.length > 0,
        lastBookingDate: allBookings.length > 0 ? allBookings[0].createdAt : null,
      },
    });
  } catch (error) {
    console.error("Error checking recent bookings:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
