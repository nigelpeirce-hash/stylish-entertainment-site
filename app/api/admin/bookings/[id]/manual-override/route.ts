import { randomBytes } from "crypto";
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
    
    // Check for dev bypass header
    const devBypass = request.headers.get("x-dev-bypass") === "true";
    
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !devBypass && !isLocalhost) {
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

    // Build update data and action info (declare outside try for error handling)
    let action = "";
    let description = "";
    let updateData: Record<string, any> = {};

    if (field === "depositReceived") {
      const isConfirmingDeposit = Boolean(value);
      updateData = {
        depositReceived: Boolean(value),
        depositReceivedManual: true,
      };
      if (isConfirmingDeposit) {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: { status: true, portalToken: true, depositReceivedManual: true },
        });
        if (booking?.status === "pending") {
          (updateData as any).status = "confirmed";
        }
        if (!booking?.portalToken) {
          (updateData as any).portalToken = randomBytes(32).toString("hex");
        }
      }
      action = "deposit_received_manual";
      description = value
        ? `${performedBy || "Admin"} manually marked Deposit as Paid`
        : `${performedBy || "Admin"} manually removed Deposit as Paid`;
    } else if (field === "finalDetailsConfirmed") {
      updateData = {
        finalDetailsConfirmed: Boolean(value),
        finalDetailsConfirmedManual: true,
      };
      action = "final_details_confirmed_manual";
      description = value
        ? `${performedBy || "Admin"} manually marked Final Details as Confirmed`
        : `${performedBy || "Admin"} manually removed Final Details confirmation`;
    } else if (field === "djWorksheetApproved") {
      updateData = {
        djWorksheetApproved: Boolean(value),
        djWorksheetApprovedManual: true,
      };
      action = "dj_worksheet_approved_manual";
      description = value
        ? `${performedBy || "Admin"} manually marked DJ Worksheet as Approved`
        : `${performedBy || "Admin"} manually removed DJ Worksheet approval`;
    }

    // Update booking using Prisma update (simpler approach)
    console.log("Updating booking with data:", JSON.stringify(updateData, null, 2));
    console.log("Booking ID:", bookingId);
    console.log("Field being updated:", field);
    
    // Use Prisma's update with explicit field selection to avoid relation issues
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
    
    console.log("Successfully updated booking:", updatedBooking);

    const auditDescription = `${description} on ${new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    })}`;
    const { logActivity } = await import("@/lib/activity-log");
    await logActivity({
      bookingId,
      action,
      description: auditDescription,
      actor: "admin",
      performedBy: performedBy || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Manual override recorded",
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("Error updating manual override:", error);
    console.error("Error code:", error.code);
    console.error("Error meta:", error.meta);
    console.error("Full error:", JSON.stringify(error, null, 2));
    
    // If it's a Prisma error about a missing column, provide more context
    if (error.code === "P2022") {
      console.error("Prisma P2022 error - Column does not exist");
      console.error("Error meta details:", JSON.stringify(error.meta, null, 2));
      // The error.meta should contain the column name that doesn't exist
      if (error.meta?.column) {
        console.error(`Missing column: ${error.meta.column}`);
      }
    }
    
    return NextResponse.json(
      {
        error: "Failed to update manual override",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        code: error.code,
        meta: process.env.NODE_ENV === "development" ? error.meta : undefined,
      },
      { status: 500 }
    );
  }
}
