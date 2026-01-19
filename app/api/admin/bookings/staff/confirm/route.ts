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
    // Check authentication
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, staffName, role, agreedFee, sendEmail } = body;

    if (!bookingId || !staffName || !role || agreedFee === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, staffName, role, agreedFee" },
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

    // Find or create staff member
    let staff = await prisma.freelanceCrew.findFirst({
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
            agreedFee: parseFloat(agreedFee),
            status: "held",
            confirmationEmailSent: sendEmail ? true : existingAssignment.confirmationEmailSent,
            confirmationSentAt: sendEmail ? new Date() : existingAssignment.confirmationSentAt,
          },
        })
      : await prisma.bookingStaffAssignment.create({
          data: {
        bookingId,
        staffId: staff.id,
        role,
        agreedFee: parseFloat(agreedFee),
        status: "held",
        confirmationEmailSent: sendEmail || false,
        confirmationSentAt: sendEmail ? new Date() : null,
      },
    });

    // Send confirmation email if requested and staff has email
    if (sendEmail && staff.email) {
      try {
        const formattedDate = new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Determine sender name (default to "Nigel" - can be made dynamic based on admin)
        const senderName = "Nigel"; // TODO: Could be determined from session or config

        const emailData = staffConfirmationEmail({
          staffName: staff.name,
          eventDate: formattedDate,
          venueName: booking.venueName,
          role,
          agreedFee: parseFloat(agreedFee),
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
