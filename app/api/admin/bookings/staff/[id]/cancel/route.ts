import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { staffCancellationEmail } from "@/lib/email-staff-cancellation";
import { getResendConfig } from "@/lib/email-config";
import { Resend } from "resend";

// Lazy initialization to prevent build-time errors
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Cancel a crew assignment
 * Updates status to 'cancelled', sends cancellation email, and logs to audit
 */
export async function POST(
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
    const body = await request.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Cancellation reason is required" },
        { status: 400 }
      );
    }

    // Fetch assignment with related data
    const assignment = await prisma.bookingStaffAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        staff: true,
        booking: {
          select: {
            id: true,
            name: true,
            eventDate: true,
            venueName: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (assignment.status === "cancelled") {
      return NextResponse.json({ error: "Assignment is already cancelled" }, { status: 400 });
    }

    // Update assignment status
    const updatedAssignment = await prisma.bookingStaffAssignment.update({
      where: { id: assignmentId },
      data: {
        status: "cancelled",
        cancellationReason: reason.trim(),
        cancelledAt: new Date(),
      },
    });

    // Log to audit log
    await prisma.auditLog.create({
      data: {
        bookingId: assignment.bookingId,
        action: "crew_cancelled",
        description: `Crew member ${assignment.staff.name} (${assignment.role}) was cancelled. Reason: ${reason.trim()}`,
        performedBy: admin?.name || "Admin",
      },
    });

    // Send cancellation email if staff has email
    if (assignment.staff.email) {
      try {
        const formattedDate = new Date(assignment.booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const senderName = "Nigel"; // TODO: Could be determined from session or config

        const emailData = staffCancellationEmail({
          staffName: assignment.staff.name,
          eventDate: formattedDate,
          venueName: assignment.booking.venueName,
          role: assignment.role,
          reason: reason.trim(),
          senderName,
        });

        const emailConfig = getResendConfig("general");

        await getResend().emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [assignment.staff.email],
          subject: emailData.subject,
          html: emailData.html,
        });

        // Log email to CommsLog
        await prisma.commsLog.create({
          data: {
            bookingId: assignment.bookingId,
            platform: "email",
            direction: "outbound",
            email: assignment.staff.email,
            contactName: assignment.staff.name,
            message: `Job Cancellation email sent: ${reason.trim()}`,
          },
        });
      } catch (emailError: any) {
        console.error("Error sending cancellation email:", emailError);
        // Don't fail the request if email fails - cancellation is still recorded
      }
    }

    return NextResponse.json({
      success: true,
      assignment: updatedAssignment,
    });
  } catch (error: any) {
    console.error("Error cancelling crew assignment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel crew assignment" },
      { status: 500 }
    );
  }
}
