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
import { SIGNATURE_BLOCK_HTML } from "@/lib/email-signature";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

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

    // Fetch booking data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        staffAssignments: {
          include: {
            staff: true
          }
        },
        warehouseItems: {
          include: {
            WarehouseItem: true,
          },
          orderBy: [
            { WarehouseItem: { category: "asc" } },
            { WarehouseItem: { name: "asc" } },
          ],
        },
        guestRequests: {
          where: {
            status: { in: ["pending", "approved", "moved_to_official"] },
          },
          orderBy: {
            createdAt: "desc",
          },
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

    // Format event date
    const eventDate = booking.eventDate
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not set";
    
    // Detect if this is a musician dispatch (for custom sections)
    const isMusicianDispatch = staffAssignment && (
      staffRole?.toLowerCase().includes('musician') || 
      staffRole?.toLowerCase().includes('band')
    );

    const clientPhoneDisplay = fd.clientPhone || (booking.phoneAreaCode != null || booking.phoneNumber != null ? [booking.phoneAreaCode, booking.phoneNumber].filter(Boolean).join(" ").trim() : "") || "To be confirmed";
    const venuePhoneDisplay = fd.venuePhone || (booking.venuePhoneAreaCode && booking.venuePhoneNumber ? [booking.venuePhoneAreaCode, booking.venuePhoneNumber].filter(Boolean).join(" ").trim() : "") || "To be confirmed";

    const venueIsPrivateHouse = !!fd.venueIsPrivateHouse || !!(booking as any).venueIsPrivateHouse;
    const venueWhat3Words = (fd.venueWhat3Words || (booking as any).venueWhat3Words || "").trim();
    const venueLoadInNotes = (fd.venueLoadInNotes || (booking as any).venueLoadInNotes || "").trim();
    const w3wSlug = venueWhat3Words ? venueWhat3Words.replace(/\s+/g, ".").replace(/\.+/g, ".") : "";

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
          <span class="detail-value">${fd.clientName || booking.name}</span>
        </div>
        ${fd.clientEmail || booking.email ? `<div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${fd.clientEmail || booking.email}</span>
        </div>` : ''}
        <div class="detail-row">
          <span class="detail-label">Client phone (in case of emergency on the day):</span>
          <span class="detail-value">${clientPhoneDisplay}</span>
        </div>
        ${fd.eventType || booking.eventType ? `<div class="detail-row">
          <span class="detail-label">Event Type:</span>
          <span class="detail-value">${fd.eventType || booking.eventType}</span>
        </div>` : ''}
        ${fd.numberOfGuests || booking.numberOfGuests ? `<div class="detail-row">
          <span class="detail-label">Number of Guests:</span>
          <span class="detail-value">${fd.numberOfGuests || booking.numberOfGuests}</span>
        </div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Venue Information</div>
        <div class="detail-row">
          <span class="detail-label">Venue Name:</span>
          <span class="detail-value">${fd.venueName || booking.venueName || "To be confirmed"}</span>
        </div>
        ${(fd.venueAddress || booking.venueAddress) ? `<div class="detail-row">
          <span class="detail-label">Address Line 1:</span>
          <span class="detail-value">${fd.venueAddress || booking.venueAddress}</span>
        </div>` : ""}
        ${fd.venueAddress2 ? `<div class="detail-row">
          <span class="detail-label">Address Line 2:</span>
          <span class="detail-value">${fd.venueAddress2}</span>
        </div>` : ""}
        ${(fd.venueTown || booking.venueTown) ? `<div class="detail-row">
          <span class="detail-label">Town:</span>
          <span class="detail-value">${fd.venueTown || booking.venueTown}</span>
        </div>` : ""}
        ${(fd.venueCounty || booking.venueCounty) ? `<div class="detail-row">
          <span class="detail-label">County:</span>
          <span class="detail-value">${fd.venueCounty || booking.venueCounty}</span>
        </div>` : ""}
        ${(fd.venuePostcode || booking.venuePostcode) ? `<div class="detail-row">
          <span class="detail-label">Postcode:</span>
          <span class="detail-value">${fd.venuePostcode || booking.venuePostcode}</span>
        </div>` : ""}
        <div class="detail-row">
          <span class="detail-label">Venue Contact:</span>
          <span class="detail-value">${fd.venueContact || booking.venueContact || "To be confirmed"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue Phone:</span>
          <span class="detail-value">${venuePhoneDisplay}</span>
        </div>
      </div>

      <div class="section" style="border-left: 4px solid #D4AF37;">
        <div class="section-title">Finding the venue / Load-in</div>
        ${venueIsPrivateHouse ? `<div class="detail-row">
          <span class="detail-label">Private house:</span>
          <span class="detail-value">Yes – use full address above, What3words, and/or load-in notes below to find the exact location.</span>
        </div>` : ""}
        ${venueWhat3Words ? `<div class="detail-row">
          <span class="detail-label">What3words:</span>
          <span class="detail-value"><a href="https://what3words.com/${w3wSlug}" target="_blank" rel="noopener" style="color: #D4AF37;">${venueWhat3Words}</a></span>
        </div>` : ""}
        <div class="detail-row">
          <span class="detail-label">Load-in / access:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${venueLoadInNotes || "To be confirmed"}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Event Timings</div>
        <div class="detail-row">
          <span class="detail-label">Event Date:</span>
          <span class="detail-value">${eventDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Arrival Time:</span>
          <span class="detail-value">${fd.djArrivalTime || booking.djArrivalTime || "To be confirmed"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Start Time:</span>
          <span class="detail-value">${fd.djStartTime || booking.djStartTime || "To be confirmed"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Finish Time:</span>
          <span class="detail-value">${fd.djFinishTime || booking.djFinishTime || "To be confirmed"}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Technical Setup</div>
        <div class="detail-row">
          <span class="detail-label">Setup Location:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${fd.djSetupLocation || booking.djSetupLocation || "To be confirmed"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Parking Information:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${fd.djParking || booking.djParking || "To be confirmed"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Sound Limiter:</span>
          <span class="detail-value">${fd.soundLimiter !== undefined ? fd.soundLimiter : (booking.soundLimiter !== null && booking.soundLimiter !== undefined ? (booking.soundLimiter ? "Yes" : "No") : "To be confirmed")}</span>
        </div>
      </div>

      ${staffAssignment && (staffRole?.toLowerCase().includes('musician') || staffRole?.toLowerCase().includes('band')) ? `<div class="section">
        <div class="section-title" style="color: #D4AF37; font-weight: 600;">🎷 Live Performance Technical Requirements</div>
        <div class="detail-row">
          <span class="detail-label">PA System:</span>
          <span class="detail-value">${booking.services?.includes('DJ') || booking.services?.includes('Sound System') ? 'Provided by DJ/Sound System' : 'Please confirm if PA system is required'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Staging Area:</span>
          <span class="detail-value">${fd.djSetupLocation || booking.djSetupLocation || 'To be confirmed with venue'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Power Requirements:</span>
          <span class="detail-value">Standard power outlet required near performance area. Please confirm if additional power is needed.</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Audio Connection:</span>
          <span class="detail-value">${booking.services?.includes('DJ') ? 'Can connect to DJ mixer if needed' : 'Standalone performance'}</span>
        </div>
        ${booking.musicNotesToDJ ? `<div class="detail-row">
          <span class="detail-label">Performance Notes:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${booking.musicNotesToDJ}</span>
        </div>` : ''}
      </div>` : ''}

      ${booking.firstDance || booking.lastSong || booking.musicRequests || booking.musicDislikes || booking.musicNotesToDJ || (booking as any).musicFileUrl ? `<div class="section">
        <div class="section-title">${staffAssignment && (staffRole?.toLowerCase().includes('musician') || staffRole?.toLowerCase().includes('band')) ? '🎵 Ceremony Music Choices (For Live Performance)' : '🎵 Music Preferences (from client portal)'}</div>
        ${booking.firstDance ? `<div class="detail-row">
          <span class="detail-label">${staffAssignment && (staffRole?.toLowerCase().includes('musician') || staffRole?.toLowerCase().includes('band')) ? 'First Dance (Live Performance):' : 'First Dance:'}</span>
          <span class="detail-value">${booking.firstDance}</span>
        </div>` : ''}
        ${booking.lastSong ? `<div class="detail-row">
          <span class="detail-label">${staffAssignment && (staffRole?.toLowerCase().includes('musician') || staffRole?.toLowerCase().includes('band')) ? 'Processional/Recessional (Live Performance):' : 'Last Song:'}</span>
          <span class="detail-value">${booking.lastSong}</span>
        </div>` : ''}
        ${booking.musicRequests ? `<div class="detail-row">
          <span class="detail-label">Must-Plays / Requests:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${booking.musicRequests}</span>
        </div>` : ''}
        ${booking.musicDislikes ? `<div class="detail-row">
          <span class="detail-label">Do-Not-Plays:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${booking.musicDislikes}</span>
        </div>` : ''}
        ${booking.musicNotesToDJ && !(staffAssignment && (staffRole?.toLowerCase().includes('musician') || staffRole?.toLowerCase().includes('band'))) ? `<div class="detail-row">
          <span class="detail-label">Additional Notes to DJ/Musician:</span>
          <span class="detail-value" style="white-space: pre-wrap;">${booking.musicNotesToDJ}</span>
        </div>` : ''}
        ${(booking as any).musicFileUrl ? `<div class="detail-row">
          <span class="detail-label">Spotify / PDF music list:</span>
          <span class="detail-value"><a href="${(booking as any).musicFileUrl}" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; text-decoration: underline;">${(booking as any).musicFileUrl}</a></span>
        </div>` : ''}
        ${staffAssignment && (staffRole?.toLowerCase().includes('musician') || staffRole?.toLowerCase().includes('band')) && booking.services?.includes('DJ') ? `<div class="detail-row" style="background-color: #f9f9f9; padding: 10px; border-left: 3px solid #D4AF37; margin-top: 10px;">
          <span class="detail-label" style="font-weight: 600;">Note:</span>
          <span class="detail-value">DJ will handle reception music. Your live performance is for the ceremony (First Dance, Processional, etc.).</span>
        </div>` : ''}
      </div>` : ''}

      ${booking.guestRequests && booking.guestRequests.length > 0 ? `<div class="section">
        <div class="section-title" style="color: #D4AF37; font-weight: 600;">🎵 Guest Song Requests</div>
        <p style="margin-bottom: 15px; color: #666; font-size: 14px;">Songs requested by your guests. These are crowd favorites to consider.</p>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${booking.guestRequests.map((req: any) => {
            const title = req.trackName || req.songTitle || 'Unknown';
            const artist = req.artistName || req.artist;
            return `
            <li style="padding: 8px 0; border-bottom: 1px solid #e5e5e5;">
              <span style="font-weight: 500; color: #1a1a1a;">${title}</span>
              ${artist ? `<span style="color: #666; margin-left: 8px;">by ${artist}</span>` : ''}
              ${req.guestName ? `<span style="color: #999; font-size: 12px; margin-left: 8px;">— ${req.guestName}</span>` : ''}
              ${req.spotifyUrl ? ` <a href="${req.spotifyUrl}" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; font-size: 12px; margin-left: 8px;">Spotify</a>` : ''}
              ${req.status === "moved_to_official" ? `<span style="background-color: #D4AF37; color: #1a1a1a; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; margin-left: 8px; text-transform: uppercase;">Added to Official List</span>` : ''}
            </li>
          `;
          }).join('')}
        </ul>
      </div>` : ''}

      ${booking.warehouseItems && booking.warehouseItems.length > 0 ? `<div class="section">
        <div class="section-title" style="color: #D4AF37; font-weight: 600;">📦 Kit Provided by Stylish</div>
        ${Object.entries(
          booking.warehouseItems.reduce((acc: Record<string, typeof booking.warehouseItems>, item) => {
            const cat = item.WarehouseItem.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
          }, {})
        ).map(([category, items]) => `
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 8px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">${category}</div>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${items.map((item: any) => `
                <li style="padding: 6px 0; border-bottom: 1px solid #e5e5e5;">
                  <span style="font-weight: 500; color: #1a1a1a;">${item.quantity}x ${item.WarehouseItem.name}</span>
                  ${item.WarehouseItem.size ? `<span style="color: #666; font-size: 12px; margin-left: 8px;">(${item.WarehouseItem.size})</span>` : ''}
                  ${item.WarehouseItem.weight ? `<span style="color: #666; font-size: 12px; margin-left: 8px;">${item.WarehouseItem.weight}kg</span>` : ''}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>` : ''}
    </div>
    ${briefToken ? `
    <div style="text-align: center; padding: 30px 20px; margin-top: 30px; border-top: 1px solid #D4AF37;">
      <p style="margin-bottom: 8px; color: #666; font-size: 14px;">This Artist Worksheet includes details from the client portal (music preferences, final details) and the booking.</p>
      <p style="margin-bottom: 20px; color: #1a1a1a; font-weight: 500;">Please confirm you accept this booking:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://stylishentertainment.co.uk'}/api/confirm-brief/${briefToken}" 
         style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); color: #1a1a1a; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">
        Yes, I accept the booking
      </a>
    </div>
    ` : ''}
    ${SIGNATURE_BLOCK_HTML}
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
