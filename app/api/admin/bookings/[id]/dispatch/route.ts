import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";
import {
  ensureBookingReference,
  getThreadingHeaders,
  generateThreadIdFooter,
} from "@/lib/booking-integrity";
import { generateBriefToken } from "@/lib/brief-token";
import { buildDispatchEmailHtml } from "@/lib/dispatch-email";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";
import { SAFE_BOOKING_SCALARS } from "@/lib/safe-booking-query";

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy initialization to prevent build-time errors
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { assignedDJName, assignedDJEmail, finalDetails, staffAssignmentId } = body;
    const fd = finalDetails || {};

    // Support both DJ dispatch and staff assignment dispatch
    let staffAssignment = null;
    let recipientEmail = assignedDJEmail;
    let recipientName = assignedDJName;
    let briefToken: string | null = null;
    let staffRole: string = '';

    if (staffAssignmentId) {
      // This is a staff assignment final brief
      staffAssignment = await prisma.bookingStaffAssignment.findUnique({
        where: { id: staffAssignmentId },
        include: {
          staff: true,
        },
      });

      if (!staffAssignment) {
        return NextResponse.json(
          { error: "Staff assignment not found" },
          { status: 404 }
        );
      }

      if (!staffAssignment.staff.email) {
        return NextResponse.json(
          { error: "Staff member does not have an email address configured" },
          { status: 400 }
        );
      }

      recipientEmail = staffAssignment.staff.email;
      recipientName = staffAssignment.staff.name;
      staffRole = staffAssignment.role || '';

      // Generate token for brief confirmation
      briefToken = generateBriefToken();

      // Update assignment with token and set status to dispatched
      await prisma.bookingStaffAssignment.update({
        where: { id: staffAssignmentId },
        data: {
          briefToken,
          status: "dispatched",
          briefStatus: "pending",
          confirmationEmailSent: true,
          confirmationSentAt: new Date(),
        },
      });
    } else if (!assignedDJName || !assignedDJEmail) {
      return NextResponse.json(
        { error: "DJ/Agent name and email are required, or provide staffAssignmentId" },
        { status: 400 }
      );
    }

    // Fetch booking data (safe select: omit columns that may not exist in DB)
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        ...SAFE_BOOKING_SCALARS,
        staffAssignments: {
          include: { staff: true },
        },
        warehouseItems: {
          include: { WarehouseItem: true },
          orderBy: [
            { WarehouseItem: { category: "asc" } },
            { WarehouseItem: { name: "asc" } },
          ],
        },
        guestRequests: {
          where: { status: { in: ["pending", "approved", "moved_to_official"] } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // DJ dispatch (no staff assignment): generate token and create DispatchConfirmation for "I accept" flow
    if (!staffAssignmentId && !briefToken) {
      briefToken = generateBriefToken();
      await prisma.dispatchConfirmation.create({
        data: {
          token: briefToken,
          bookingId,
          recipientEmail,
          recipientName: recipientName || undefined,
        },
      });
    }

    const eventDate = booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not set";

    const eventSummary = buildDispatchEmailHtml({
      booking: booking as any,
      fd,
      eventDate,
      staffAssignment,
      briefToken,
    });

    // Use centralised email config with dynamic sender name for DJ worksheets
    const emailConfig = getResendConfig("dj_worksheet");

    // Get booking reference for email threading
    const bookingReference = await ensureBookingReference(bookingId);
    const threadingHeaders = bookingReference 
      ? getThreadingHeaders(bookingReference)
      : {};

    // Add Thread-ID footer to email HTML for threading
    const finalHtml = bookingReference
      ? eventSummary + generateThreadIdFooter(bookingReference)
      : eventSummary;

    // Send email via Resend
    const emailResult = await getResend().emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: [recipientEmail],
      bcc: [EMAIL_CONFIG.OFFICE_EMAIL],
      subject: `Artist Worksheet - ${booking.eventType} at ${fd.venueName || booking.venueName} - ${eventDate}`,
      html: finalHtml, // Include Thread-ID footer
      headers: threadingHeaders, // Add In-Reply-To and References headers
    });

    // Update booking with dispatch metadata
    // Store dispatch info in emailsSent JSON field (temporary until schema fields are added)
    const dispatchMetadata = {
      dispatchedAt: new Date().toISOString(),
      dispatchedBy: admin.name || admin.email,
      assignedDJName: recipientName,
      assignedDJEmail: recipientEmail,
      emailMessageId: emailResult.data?.id,
      staffAssignmentId: staffAssignment?.id || null,
      briefToken: briefToken || null,
    };

    const currentEmailsSent = (booking.emailsSent as any) || {};
    const updatedEmailsSent = {
      ...currentEmailsSent,
      artistDispatch: dispatchMetadata,
    };

    // Update booking with dispatch metadata and mark as action taken
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        emailsSent: updatedEmailsSent,
        lastEmailSentAt: new Date(), // Mark that admin has taken action
        // Note: If you add dispatchedAt, dispatchedBy, assignedDJName, assignedDJEmail,
        // and reviewComplete fields to the Booking schema, update them here instead
      },
    });

    // Log dispatch for audit trail
    console.log("Artist dispatch completed:", dispatchMetadata);

    try {
      const eventDateLabel = booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : undefined;
      await notifyAdminSignificantEvent({
        actor: "admin",
        type: "dispatched",
        bookingId,
        title: "Dispatched",
        description: `Event details dispatched to ${recipientName}`,
        performedBy: admin.name || admin.email,
        bookingName: booking.name ?? undefined,
        venueName: booking.venueName ?? undefined,
        eventDate: eventDateLabel,
      });
    } catch (e) {
      console.warn("Admin notification (dispatched) failed:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Event details dispatched successfully",
      messageId: emailResult.data?.id,
      ...dispatchMetadata,
    });
  } catch (error: any) {
    console.error("Error dispatching to artist:", error);
    return NextResponse.json(
      {
        error: "Failed to dispatch event details",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
