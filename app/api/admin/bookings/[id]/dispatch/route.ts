import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";
import { 
  ensureBookingReference, 
  getThreadingHeaders,
  generateThreadIdFooter
} from "@/lib/booking-integrity";
import { generateBriefToken } from "@/lib/brief-token";

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

    // Support both DJ dispatch and staff assignment dispatch
    let staffAssignment = null;
    let recipientEmail = assignedDJEmail;
    let recipientName = assignedDJName;
    let briefToken: string | null = null;

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

    // Fetch booking data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Format event date
    const eventDate = booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not set";

    // Generate professional event summary email
    const eventSummary = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 30px 20px;
      border-bottom: 1px solid #D4AF37;
    }
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 1px;
    }
    .content {
      padding: 30px 20px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 10px;
      border-bottom: 1px solid #D4AF37;
      padding-bottom: 5px;
    }
    .detail-row {
      margin-bottom: 8px;
    }
    .detail-label {
      font-weight: 600;
      color: #666;
      display: inline-block;
      min-width: 120px;
    }
    .detail-value {
      color: #1a1a1a;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #D4AF37;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">S</div>
    </div>
    <div class="content">
      <h1 style="font-size: 24px; margin-bottom: 20px; color: #1a1a1a;">Event Details</h1>
      
      <div class="section">
        <div class="section-title">Client Information</div>
        <div class="detail-row">
          <span class="detail-label">Client Name:</span>
          <span class="detail-value">${finalDetails.clientName || booking.name}</span>
        </div>
        ${finalDetails.clientEmail || booking.email ? `<div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${finalDetails.clientEmail || booking.email}</span>
        </div>` : ''}
        ${finalDetails.clientPhone ? `<div class="detail-row">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${finalDetails.clientPhone}</span>
        </div>` : ''}
        ${finalDetails.eventType || booking.eventType ? `<div class="detail-row">
          <span class="detail-label">Event Type:</span>
          <span class="detail-value">${finalDetails.eventType || booking.eventType}</span>
        </div>` : ''}
        ${finalDetails.numberOfGuests || booking.numberOfGuests ? `<div class="detail-row">
          <span class="detail-label">Number of Guests:</span>
          <span class="detail-value">${finalDetails.numberOfGuests || booking.numberOfGuests}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Venue Information</div>
        <div class="detail-row">
          <span class="detail-label">Venue Name:</span>
          <span class="detail-value">${finalDetails.venueName || booking.venueName}</span>
        </div>
        ${finalDetails.venueAddress || booking.venueAddress ? `<div class="detail-row">
          <span class="detail-label">Address Line 1:</span>
          <span class="detail-value">${finalDetails.venueAddress || booking.venueAddress}</span>
        </div>` : ''}
        ${finalDetails.venueAddress2 ? `<div class="detail-row">
          <span class="detail-label">Address Line 2:</span>
          <span class="detail-value">${finalDetails.venueAddress2}</span>
        </div>` : ''}
        ${finalDetails.venueTown || booking.venueTown ? `<div class="detail-row">
          <span class="detail-label">Town:</span>
          <span class="detail-value">${finalDetails.venueTown || booking.venueTown}</span>
        </div>` : ''}
        ${finalDetails.venueCounty || booking.venueCounty ? `<div class="detail-row">
          <span class="detail-label">County:</span>
          <span class="detail-value">${finalDetails.venueCounty || booking.venueCounty}</span>
        </div>` : ''}
        ${finalDetails.venuePostcode || booking.venuePostcode ? `<div class="detail-row">
          <span class="detail-label">Postcode:</span>
          <span class="detail-value">${finalDetails.venuePostcode || booking.venuePostcode}</span>
        </div>` : ''}
        ${finalDetails.venueContact || booking.venueContact ? `<div class="detail-row">
          <span class="detail-label">Venue Contact:</span>
          <span class="detail-value">${finalDetails.venueContact || booking.venueContact}</span>
        </div>` : ''}
        ${finalDetails.venuePhone || (booking.venuePhoneAreaCode && booking.venuePhoneNumber) ? `<div class="detail-row">
          <span class="detail-label">Venue Phone:</span>
          <span class="detail-value">${finalDetails.venuePhone || `${booking.venuePhoneAreaCode} ${booking.venuePhoneNumber}`}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Event Timings</div>
        <div class="detail-row">
          <span class="detail-label">Event Date:</span>
          <span class="detail-value">${eventDate}</span>
        </div>
        ${finalDetails.djArrivalTime ? `<div class="detail-row">
          <span class="detail-label">Arrival Time:</span>
          <span class="detail-value">${finalDetails.djArrivalTime}</span>
        </div>` : ''}
        ${finalDetails.djStartTime ? `<div class="detail-row">
          <span class="detail-label">Start Time:</span>
          <span class="detail-value">${finalDetails.djStartTime}</span>
        </div>` : ''}
        ${finalDetails.djFinishTime ? `<div class="detail-row">
          <span class="detail-label">Finish Time:</span>
          <span class="detail-value">${finalDetails.djFinishTime}</span>
        </div>` : ''}
      </div>

      ${(finalDetails.djSetupLocation || booking.djSetupLocation) || (finalDetails.djParking || booking.djParking) || finalDetails.soundLimiter !== undefined || booking.soundLimiter !== null ? `<div class="section">
        <div class="section-title">Technical Setup</div>
        ${finalDetails.djSetupLocation || booking.djSetupLocation ? `<div class="detail-row">
          <span class="detail-label">Setup Location:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${finalDetails.djSetupLocation || booking.djSetupLocation}</span>
        </div>` : ''}
        ${finalDetails.djParking || booking.djParking ? `<div class="detail-row">
          <span class="detail-label">Parking Information:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${finalDetails.djParking || booking.djParking}</span>
        </div>` : ''}
        ${finalDetails.soundLimiter !== undefined || booking.soundLimiter !== null ? `<div class="detail-row">
          <span class="detail-label">Sound Limiter:</span>
          <span class="detail-value">${finalDetails.soundLimiter !== undefined ? finalDetails.soundLimiter : (booking.soundLimiter ? 'Yes' : 'No')}</span>
        </div>` : ''}
      </div>` : ''}

      ${finalDetails.firstDance || booking.firstDance || finalDetails.lastSong || booking.lastSong || finalDetails.musicRequests || booking.musicRequests || finalDetails.musicDislikes || booking.musicDislikes || finalDetails.musicNotesToDJ || booking.musicNotesToDJ ? `<div class="section">
        <div class="section-title">Music Preferences</div>
        ${finalDetails.firstDance || booking.firstDance ? `<div class="detail-row">
          <span class="detail-label">First Dance:</span>
          <span class="detail-value">${finalDetails.firstDance || booking.firstDance}</span>
        </div>` : ''}
        ${finalDetails.lastSong || booking.lastSong ? `<div class="detail-row">
          <span class="detail-label">Last Song:</span>
          <span class="detail-value">${finalDetails.lastSong || booking.lastSong}</span>
        </div>` : ''}
        ${finalDetails.musicRequests || booking.musicRequests ? `<div class="detail-row">
          <span class="detail-label">Must-Plays / Requests:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${finalDetails.musicRequests || booking.musicRequests}</span>
        </div>` : ''}
        ${finalDetails.musicDislikes || booking.musicDislikes ? `<div class="detail-row">
          <span class="detail-label">Do-Not-Plays:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${finalDetails.musicDislikes || booking.musicDislikes}</span>
        </div>` : ''}
        ${finalDetails.musicNotesToDJ || booking.musicNotesToDJ ? `<div class="detail-row">
          <span class="detail-label">Additional Notes to DJ/Musician:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${finalDetails.musicNotesToDJ || booking.musicNotesToDJ}</span>
        </div>` : ''}
      </div>` : ''}
    </div>
    ${briefToken ? `
    <div style="text-align: center; padding: 30px 20px; margin-top: 30px; border-top: 1px solid #D4AF37;">
      <p style="margin-bottom: 20px; color: #1a1a1a; font-weight: 500;">Please confirm that you have received and understood these final details:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://stylishentertainment.co.uk'}/api/confirm-brief/${briefToken}" 
         style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); color: #1a1a1a; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">
        I have received and understood the final details
      </a>
    </div>
    ` : ''}
    <div class="footer">
      <p>Stylish Entertainment</p>
      <p>This is an automated dispatch. Please confirm receipt.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

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
      subject: `Event Details - ${booking.eventType} at ${finalDetails.venueName || booking.venueName} - ${eventDate}`,
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
