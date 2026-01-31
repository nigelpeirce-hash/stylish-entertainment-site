import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.id as string || token.sub as string;
    const body = await request.json();
    const { message, bookingId, attachments } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: {
          where: bookingId ? { id: bookingId } : undefined,
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or find booking
    let booking = null;
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
    } else if (user.bookings && user.bookings.length > 0) {
      // Use most recent booking if no bookingId provided
      booking = user.bookings[0];
    }

    // Get the office inbox (or create a default one)
    let officeInbox = await prisma.emailInbox.findFirst({
      where: {
        email: { contains: "info@stylishentertainment.co.uk" },
        isActive: true,
      },
    });

    if (!officeInbox) {
      // Fallback to first active inbox
      officeInbox = await prisma.emailInbox.findFirst({
        where: { isActive: true },
      });
    }

    if (!officeInbox) {
      return NextResponse.json({ error: "No active inbox configured" }, { status: 500 });
    }

    // Process attachments if provided
    let attachmentData: any[] = [];
    if (attachments && Array.isArray(attachments)) {
      for (const attachment of attachments) {
        if (attachment.data && attachment.filename) {
          try {
            // Try to upload to Cloudinary if configured
            if (process.env.CLOUDINARY_CLOUD_NAME) {
              const uploadResult = await uploadToCloudinary(
                attachment.data,
                `portal-attachments/${userId}/${Date.now()}-${attachment.filename}`,
                attachment.contentType || "application/octet-stream"
              );
              
              attachmentData.push({
                filename: attachment.filename,
                contentType: attachment.contentType || "application/octet-stream",
                url: uploadResult.secure_url,
                size: attachment.size || 0,
              });
            } else {
              // Store as base64 if Cloudinary not configured
              attachmentData.push({
                filename: attachment.filename,
                contentType: attachment.contentType || "application/octet-stream",
                data: attachment.data, // Store base64 data
                size: attachment.size || 0,
              });
            }
          } catch (error) {
            console.error("Error uploading attachment:", error);
            // Continue without this attachment
          }
        }
      }
    }

    // Create email thread if it doesn't exist
    const subject = booking 
      ? `Message from ${user.name || user.email} - ${booking.eventType} at ${booking.venueName}`
      : `Message from ${user.name || user.email} via Portal`;

    let thread = await prisma.emailThread.findFirst({
      where: {
        userId: userId,
        bookingId: booking?.id || null,
        source: "portal",
        inboxId: officeInbox.id,
      },
      orderBy: { lastMessageAt: "desc" },
    });

    if (!thread) {
      thread = await prisma.emailThread.create({
        data: {
          subject,
          fromEmail: user.email,
          fromName: user.name || null,
          toEmail: officeInbox.email,
          userId: userId,
          bookingId: booking?.id || null,
          inboxId: officeInbox.id,
          source: "portal",
        },
      });
    }

    // Create email record
    const emailRecord = await prisma.email.create({
      data: {
        threadId: thread.id,
        subject,
        fromEmail: user.email,
        fromName: user.name || null,
        toEmail: officeInbox.email,
        textContent: message,
        htmlContent: message.replace(/\n/g, "<br>"),
        direction: "inbound",
        inboxId: officeInbox.id,
        attachments: attachmentData.length > 0 ? attachmentData : undefined,
      },
    });

    // Update thread last message time
    await prisma.emailThread.update({
      where: { id: thread.id },
      data: { lastMessageAt: new Date() },
    });

    // Send notification email to office
    const notificationSubject = `New Message from ${user.name || user.email} via Portal`;
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
          New Portal Message
        </h2>
        <p style="color: #333; line-height: 1.6;">
          <strong>From:</strong> ${user.name || user.email} (${user.email})<br>
          ${booking ? `<strong>Booking:</strong> ${booking.eventType} at ${booking.venueName} on ${new Date(booking.eventDate).toLocaleDateString()}<br>` : ''}
          <strong>Date:</strong> ${new Date().toLocaleString()}
        </p>
        <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        ${attachmentData.length > 0 ? `
          <p style="color: #666; font-size: 14px;">
            <strong>Attachments:</strong><br>
            ${attachmentData.map(a => `• ${a.filename} (${(a.size / 1024).toFixed(1)} KB)`).join("<br>")}
          </p>
        ` : ''}
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          <a href="${process.env.NEXTAUTH_URL || 'https://stylishentertainment.co.uk'}/admin/bookings${booking ? `/${booking.id}` : ''}" 
             style="color: #D4AF37; text-decoration: none; font-weight: bold;">
            View in Admin Dashboard →
          </a>
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: "info@stylishentertainment.co.uk",
        subject: notificationSubject,
        html: notificationHtml,
        text: `New Message from ${user.name || user.email} via Portal\n\n${message}`,
      });
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // Don't fail the request if email fails
    }

    if (booking?.id) {
      try {
        await notifyAdminSignificantEvent({
          type: "portal_message",
          bookingId: booking.id,
          title: "Portal message",
          description: `Message from ${user.name || user.email}: ${message.slice(0, 100)}${message.length > 100 ? "…" : ""}`,
          bookingName: booking.name ?? undefined,
          venueName: booking.venueName ?? undefined,
          eventDate: booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : undefined,
        });
      } catch (e) {
        console.warn("Admin notification (portal_message) failed:", e);
      }
    }

    return NextResponse.json({
      success: true,
      threadId: thread.id,
      emailId: emailRecord.id,
    });
  } catch (error: any) {
    console.error("Error creating portal message:", error);
    return NextResponse.json(
      { error: "Failed to send message", details: error.message },
      { status: 500 }
    );
  }
}
