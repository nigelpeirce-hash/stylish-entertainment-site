import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;
    const { status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    const ALLOWED_STATUSES = ["pending", "checking_availability", "quoted", "contract_sent", "confirmed", "cancelled", "locked", "archived"] as const;
    if (!(ALLOWED_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // Map new status values to booking status
    let bookingStatus = "pending";
    let updateData: any = {};

    switch (status) {
      case "pending":
        bookingStatus = "pending";
        break;
      case "checking_availability":
        bookingStatus = "pending";
        updateData.assignedTo = "you";
        updateData.handoffStatus = "tech_review";
        break;
      case "quoted":
        bookingStatus = "confirmed";
        break;
      case "contract_sent":
        bookingStatus = "confirmed";
        updateData.finalDetailsConfirmed = true;
        break;
      default:
        bookingStatus = status;
    }

    updateData.status = bookingStatus;

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    await logActivity({
      bookingId,
      action: "status_changed",
      description: `Status changed to: ${status}`,
      actor: "admin",
      performedBy: admin?.email || admin?.id || null,
    });

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
