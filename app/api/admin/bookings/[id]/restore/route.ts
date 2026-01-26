import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/admin/bookings/[id]/restore
 * Restore an archived booking back to active status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    const admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, name: true, archivedAt: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.archivedAt) {
      return NextResponse.json({ 
        error: "Booking is not archived",
        message: "This booking is already active"
      }, { status: 400 });
    }

    // Restore the booking
    const restoredBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        archivedAt: null,
        archivedBy: null,
        status: "pending", // Reset to pending, admin can change as needed
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking restored successfully",
      booking: restoredBooking,
    });

  } catch (error) {
    console.error("Error restoring booking:", error);
    return NextResponse.json(
      { error: "Failed to restore booking", message: (error as Error)?.message },
      { status: 500 }
    );
  }
}
