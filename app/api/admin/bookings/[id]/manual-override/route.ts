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

    const { field, value, performedBy } = body;

    // Validate field
    const validFields = ["depositReceived", "finalDetailsConfirmed", "djWorksheetApproved"];
    if (!validFields.includes(field)) {
      return NextResponse.json(
        { error: "Invalid field" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    let action = "";
    let description = "";

    if (field === "depositReceived") {
      updateData.depositReceived = value;
      updateData.depositReceivedManual = true; // Always mark as manual when using this endpoint
      action = "deposit_received_manual";
      description = value
        ? `${performedBy || "Admin"} manually marked Deposit as Paid`
        : `${performedBy || "Admin"} manually removed Deposit as Paid`;
    } else if (field === "finalDetailsConfirmed") {
      updateData.finalDetailsConfirmed = value;
      updateData.finalDetailsConfirmedManual = true;
      action = "final_details_confirmed_manual";
      description = value
        ? `${performedBy || "Admin"} manually marked Final Details as Confirmed`
        : `${performedBy || "Admin"} manually removed Final Details confirmation`;
    } else if (field === "djWorksheetApproved") {
      updateData.djWorksheetApproved = value;
      updateData.djWorksheetApprovedManual = true;
      action = "dj_worksheet_approved_manual";
      description = value
        ? `${performedBy || "Admin"} manually marked DJ Worksheet as Approved`
        : `${performedBy || "Admin"} manually removed DJ Worksheet approval`;
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      select: {
        id: true,
        depositReceived: true,
        depositReceivedManual: true,
        finalDetailsConfirmed: true,
        finalDetailsConfirmedManual: true,
        djWorksheetApproved: true,
        djWorksheetApprovedManual: true,
      },
    });

    // Create audit log entry
    const auditLog = await prisma.auditLog.create({
      data: {
        bookingId,
        action,
        description: `${description} on ${new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
        })}`,
        performedBy: performedBy || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Manual override recorded",
      booking: updatedBooking,
      auditLog,
    });
  } catch (error: any) {
    console.error("Error updating manual override:", error);
    return NextResponse.json(
      {
        error: "Failed to update manual override",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
