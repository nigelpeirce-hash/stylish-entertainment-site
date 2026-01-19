import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;
    const body = await request.json();

    const { flaggedFor } = body;

    // Validate flaggedFor value
    if (flaggedFor && flaggedFor !== "user1" && flaggedFor !== "user2") {
      return NextResponse.json(
        { error: "Invalid flag value. Must be 'user1', 'user2', or null" },
        { status: 400 }
      );
    }

    // Update booking flag
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { flaggedFor: flaggedFor || null },
      select: {
        id: true,
        flaggedFor: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking flag updated successfully",
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("Error updating booking flag:", error);
    return NextResponse.json(
      {
        error: "Failed to update booking flag",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
