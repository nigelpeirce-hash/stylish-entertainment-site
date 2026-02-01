import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * DELETE - Remove a staff assignment from a booking
 * This permanently deletes the assignment (unlike cancel which marks it as cancelled)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const assignmentId = resolvedParams.id;

    // Fetch assignment to get booking info for audit log
    const assignment = await prisma.bookingStaffAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        staff: true,
        booking: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Delete the assignment
    await prisma.bookingStaffAssignment.delete({
      where: { id: assignmentId },
    });

    const { logActivity } = await import("@/lib/activity-log");
    await logActivity({
      bookingId: assignment.bookingId,
      action: "crew_removed",
      description: `Crew member ${assignment.staff.name} (${assignment.role}) was removed from booking`,
      actor: "admin",
      performedBy: admin?.name || "Admin",
    });

    return NextResponse.json({
      success: true,
      message: "Staff assignment removed successfully",
    });
  } catch (error: any) {
    console.error("Error removing staff assignment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove staff assignment" },
      { status: 500 }
    );
  }
}
