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

    const {
      finalBalance,
      adminNotes,
      taxInclusive,
      taxRate,
      feeBreakdown,
      overrideMode,
      overrideReason,
      selectedTemplate,
      eventDate,
      venueName,
    } = body;

    // Validate override mode
    if (overrideMode && !overrideReason?.trim()) {
      return NextResponse.json(
        { error: "Override reason is required when override mode is enabled" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    // Update flexible operator fields
    if (finalBalance !== undefined) {
      updateData.finalBalance = finalBalance;
    }
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    if (taxInclusive !== undefined) {
      updateData.taxInclusive = taxInclusive;
    }
    if (taxRate !== undefined) {
      updateData.taxRate = taxRate;
    }
    if (feeBreakdown !== undefined) {
      updateData.feeBreakdown = feeBreakdown;
    }
    if (overrideReason !== undefined) {
      updateData.overrideReason = overrideReason;
    }
    if (selectedTemplate !== undefined) {
      updateData.selectedTemplate = selectedTemplate;
    }

    // Only update locked fields if override mode is enabled
    if (overrideMode) {
      if (eventDate) {
        updateData.eventDate = new Date(eventDate);
      }
      if (venueName) {
        updateData.venueName = venueName;
      }
      // Log override action
      updateData.overrideReason = overrideReason;
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      select: {
        id: true,
        finalBalance: true,
        adminNotes: true,
        taxInclusive: true,
        taxRate: true,
        feeBreakdown: true,
        overrideReason: true,
        selectedTemplate: true,
        eventDate: true,
        venueName: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      {
        error: "Failed to update booking",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
