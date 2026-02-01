import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { sendHandoffNotification } from "@/lib/pushover-notifications";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

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

    const { action, assignedTo, handoffStatus, handoffNote, assignedBy } = body;

    let updateData: any = {};

    if (action === "assign") {
      // Assign to Ali or Nigel
      if (assignedTo === "ali" || assignedTo === "wife") {
        updateData.assignedTo = "ali";
        updateData.handoffStatus = "action_needed";
        updateData.handoffNote = handoffNote || null;
      } else if (assignedTo === "husband" || assignedTo === "you" || assignedTo === "nigel") {
        updateData.assignedTo = "husband";
        updateData.handoffStatus = "tech_review";
        updateData.handoffNote = handoffNote || null;
        updateData.isTechReady = false; // Reset tech ready status when handed to Nigel
      }
    } else if (action === "tech_alert") {
      // Ali sends technical alert to Nigel
      updateData.assignedTo = "husband";
      updateData.handoffStatus = "tech_alert";
      updateData.handoffNote = handoffNote || null;
      updateData.isTechReady = false;
    } else if (action === "tech_done") {
      // Nigel finishes tech review, flip back to Ali
      updateData.assignedTo = "ali";
      updateData.handoffStatus = "awaiting_quote";
      updateData.handoffNote = null;
      updateData.isTechReady = true;
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Get booking details before update for notification
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { name: true, venueName: true, eventDate: true },
    });

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      select: {
        id: true,
        name: true,
        assignedTo: true,
        handoffStatus: true,
        handoffNote: true,
      },
    });

    // Send hand-off notification if Nigel is passing to Ali
    // Check if this is a handoff from Nigel to Ali
    const isNigelToAli = action === "assign" && 
                         updatedBooking.assignedTo === "ali" && 
                         (assignedBy === "Nigel" || admin?.name?.toLowerCase().includes("nigel"));
    
    if (isNigelToAli) {
      try {
        await sendHandoffNotification({
          id: bookingId,
          name: booking?.name || updatedBooking.name || "Unknown",
          assignedBy: "Nigel",
        });
      } catch (notificationError) {
        // Don't fail the handoff if notification fails
        console.error("Failed to send hand-off notification:", notificationError);
      }
    }

    try {
      const assignLabel = updatedBooking.assignedTo === "ali" ? "Ali" : updatedBooking.assignedTo === "husband" ? "Nigel" : updatedBooking.assignedTo;
      await notifyAdminSignificantEvent({
        actor: "admin",
        type: "handoff",
        bookingId,
        title: "Handoff",
        description: `Assigned to ${assignLabel}${updatedBooking.handoffNote ? ` – ${updatedBooking.handoffNote}` : ""}`,
        performedBy: (admin as any)?.name ?? (admin as any)?.email,
        bookingName: booking?.name ?? updatedBooking.name ?? undefined,
        venueName: booking?.venueName ?? undefined,
        eventDate: booking?.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : undefined,
      });
    } catch (e) {
      console.warn("Admin notification (handoff) failed:", e);
    }

    // If it's a tech alert, log it
    if (action === "tech_alert") {
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
