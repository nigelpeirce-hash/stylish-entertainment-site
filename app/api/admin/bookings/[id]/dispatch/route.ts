import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";

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
    const { assignedDJName, assignedDJEmail, finalDetails } = body;

    if (!assignedDJName || !assignedDJEmail) {
      return NextResponse.json(
        { error: "DJ/Agent name and email are required" },
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
        <div class="section-title">Venue Information</div>
        <div class="detail-row">
          <span class="detail-label">Venue:</span>
          <span class="detail-value">${finalDetails.venueName || booking.venueName}</span>
        </div>
        ${booking.venueAddress ? `<div class="detail-row">
          <span class="detail-label">Address:</span>
          <span class="detail-value">${booking.venueAddress}${booking.venuePostcode ? `, ${booking.venuePostcode}` : ''}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Event Timings</div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">${eventDate}</span>
        </div>
        ${finalDetails.djArrivalTime ? `<div class="detail-row">
          <span class="detail-label">Arrival:</span>
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

      ${finalDetails.firstDance ? `<div class="section">
        <div class="section-title">First Dance</div>
        <div class="detail-value">${finalDetails.firstDance}</div>
      </div>` : ''}

      ${finalDetails.musicDislikes ? `<div class="section">
        <div class="section-title">Do-Not-Plays</div>
        <div class="detail-value" style="white-space: pre-wrap;">${finalDetails.musicDislikes}</div>
      </div>` : ''}

      ${finalDetails.musicNotesToDJ ? `<div class="section">
        <div class="section-title">Additional Notes</div>
        <div class="detail-value" style="white-space: pre-wrap;">${finalDetails.musicNotesToDJ}</div>
      </div>` : ''}
    </div>
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

    // Send email via Resend
    const emailResult = await getResend().emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: [assignedDJEmail],
      bcc: [EMAIL_CONFIG.OFFICE_EMAIL],
      subject: `Event Details - ${booking.eventType} at ${finalDetails.venueName || booking.venueName} - ${eventDate}`,
      html: eventSummary,
    });

    // Update booking with dispatch metadata
    // Store dispatch info in emailsSent JSON field (temporary until schema fields are added)
    const dispatchMetadata = {
      dispatchedAt: new Date().toISOString(),
      dispatchedBy: admin.name || admin.email,
      assignedDJName,
      assignedDJEmail,
      emailMessageId: emailResult.data?.id,
    };

    const currentEmailsSent = (booking.emailsSent as any) || {};
    const updatedEmailsSent = {
      ...currentEmailsSent,
      artistDispatch: dispatchMetadata,
    };

    // Update booking with dispatch metadata
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        emailsSent: updatedEmailsSent,
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
