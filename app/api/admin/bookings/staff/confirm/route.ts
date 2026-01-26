import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { staffConfirmationEmail } from "@/lib/email-staff-confirmation";
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
 * Quick Staff Confirm API
 * Creates or finds a staff member and assigns them to a booking
 */
export async function POST(request: NextRequest) {
  try {
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    // In development/localhost, allow access even if admin check fails (for dev bypass)
    const admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, staffId, staffName, role, agreedFee, sendEmail } = body;

    // Support both staffId (new) and staffName (legacy)
    if (!bookingId || (!staffId && !staffName) || !role) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, staffId (or staffName), role" },
        { status: 400 }
      );
    }

    // Fetch booking to get event details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        eventDate: true,
        venueName: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Find staff member by ID or name
    let staff;
    if (staffId) {
      staff = await prisma.freelanceCrew.findUnique({
        where: { id: staffId },
      });
      if (!staff) {
        return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
      }
    } else if (staffName) {
      // Legacy support: find by name
      staff = await prisma.freelanceCrew.findFirst({
        where: {
          name: {
            equals: staffName.trim(),
            mode: "insensitive",
          },
        },
      });

      if (!staff) {
        // Auto-create staff member if they don't exist
        staff = await prisma.freelanceCrew.create({
          data: {
            name: staffName.trim(),
            roles: [role], // Initial role
            isActive: true,
          },
        });
      }
    } else {
      return NextResponse.json({ error: "staffId or staffName is required" }, { status: 400 });
    }

    // Check for staff double-booking conflicts (same staff on same date)
    const eventDate = new Date(booking.eventDate);
    const startOfDay = new Date(eventDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(eventDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingAssignments = await prisma.bookingStaffAssignment.findMany({
      where: {
        staffId: staff.id,
        status: {
          in: ["held", "dispatched", "confirmed"], // Only check active assignments
        },
        booking: {
          eventDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
          id: {
            not: bookingId, // Exclude current booking
          },
        },
      },
      include: {
        booking: {
          select: {
            id: true,
            name: true,
            venueName: true,
            eventDate: true,
          },
        },
      },
    });

    if (conflictingAssignments.length > 0) {
      const conflict = conflictingAssignments[0];
      return NextResponse.json(
        {
          error: "Staff double-booking conflict detected",
          conflict: {
            message: `${staff.name} is already assigned to another booking on this date`,
            existingBooking: {
              id: conflict.booking.id,
              name: conflict.booking.name,
              venueName: conflict.booking.venueName,
              eventDate: conflict.booking.eventDate,
            },
          },
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.bookingStaffAssignment.findFirst({
      where: {
        bookingId,
        staffId: staff.id,
      },
    });

    // Create or update staff assignment
    const assignment = existingAssignment
      ? await prisma.bookingStaffAssignment.update({
          where: { id: existingAssignment.id },
          data: {
            role,
            agreedFee: agreedFee ? parseFloat(agreedFee) : existingAssignment.agreedFee,
            status: "confirmed", // Set to confirmed when using Confirm Job button
            confirmationEmailSent: sendEmail ? true : existingAssignment.confirmationEmailSent,
            confirmationSentAt: sendEmail ? new Date() : existingAssignment.confirmationSentAt,
          },
        })
      : await prisma.bookingStaffAssignment.create({
          data: {
            bookingId,
            staffId: staff.id,
            role,
            agreedFee: agreedFee ? parseFloat(agreedFee) : 0,
            status: "confirmed", // Set to confirmed when using Confirm Job button
            confirmationEmailSent: sendEmail || false,
            confirmationSentAt: sendEmail ? new Date() : null,
          },
        });

    // Auto-update booking status from "pending" to "confirmed" when staff is assigned
    const currentBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { status: true },
    });

    if (currentBooking?.status === "pending") {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "confirmed" },
      });
    }

    // Send confirmation email if requested and staff has email
    if (sendEmail && staff.email) {
      try {
        const formattedDate = new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Ali runs the office and sends staff communications
        const senderName = "Ali";

        const emailData = staffConfirmationEmail({
          staffName: staff.name,
          eventDate: formattedDate,
          venueName: booking.venueName,
          role,
          agreedFee: agreedFee ? parseFloat(agreedFee) : 0,
          senderName,
        });

        const emailConfig = getResendConfig("general");

        await getResend().emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [staff.email],
          subject: emailData.subject,
          html: emailData.html,
        });

        // Update assignment with email sent timestamp
        await prisma.bookingStaffAssignment.update({
          where: { id: assignment.id },
          data: {
            confirmationEmailSent: true,
            confirmationSentAt: new Date(),
          },
        });

        // Log email to CommsLog
        await prisma.commsLog.create({
          data: {
            bookingId,
            platform: "email",
            direction: "outbound",
            email: staff.email,
            contactName: staff.name,
            message: `Job Confirmation email sent for ${role} at ${booking.venueName}`,
          },
        });
      } catch (emailError: any) {
        console.error("Error sending staff confirmation email:", emailError);
        // Don't fail the request if email fails - assignment is still created
      }
    }

    return NextResponse.json({
      success: true,
      assignment: {
        id: assignment.id,
        staffName: staff.name,
        role,
        agreedFee: parseFloat(agreedFee),
        status: assignment.status,
      },
    });
  } catch (error: any) {
    console.error("Error confirming staff:", error);
    return NextResponse.json(
      { error: error.message || "Failed to confirm staff" },
      { status: 500 }
    );
  }
}
