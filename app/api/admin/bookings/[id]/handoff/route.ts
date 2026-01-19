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

    const { action, assignedTo, handoffStatus, handoffNote } = body;

    let updateData: any = {};

    if (action === "assign") {
      // Assign to wife or husband
      if (assignedTo === "wife") {
        updateData.assignedTo = "wife";
        updateData.handoffStatus = "action_needed";
        updateData.handoffNote = handoffNote || null;
      } else if (assignedTo === "husband" || assignedTo === "you") {
        updateData.assignedTo = "husband";
        updateData.handoffStatus = "tech_review";
        updateData.handoffNote = handoffNote || null;
        updateData.isTechReady = false; // Reset tech ready status when handed to husband
      }
    } else if (action === "tech_alert") {
      // Wife sends technical alert to husband
      updateData.assignedTo = "husband";
      updateData.handoffStatus = "tech_alert";
      updateData.handoffNote = handoffNote || null;
      updateData.isTechReady = false;
    } else if (action === "tech_done") {
      // Husband finishes tech review, flip back to wife
      updateData.assignedTo = "wife";
      updateData.handoffStatus = "awaiting_quote";
      updateData.handoffNote = null;
      updateData.isTechReady = true;
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      select: {
        id: true,
        assignedTo: true,
        handoffStatus: true,
        handoffNote: true,
      },
    });

    // If it's a tech alert, we could trigger a notification here
    // For now, we'll just return success
    if (action === "tech_alert") {
      // TODO: Implement phone notification system
      // This could integrate with Twilio, push notifications, or email alerts
      console.log(`TECHNICAL ALERT: Booking ${bookingId} requires technical review`);
      console.log(`Note: ${handoffNote}`);
    }

    return NextResponse.json({
      success: true,
      message: "Handoff updated successfully",
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("Error updating handoff:", error);
    return NextResponse.json(
      {
        error: "Failed to update handoff",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
