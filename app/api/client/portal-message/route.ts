import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";
import { isPortalTokenValid } from "@/lib/portal-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type BookingForMessage = {
  id: string;
  name: string | null;
  email: string;
  userId: string | null;
  eventType: string | null;
  eventDate: Date;
  venueName: string | null;
  portalToken: string | null;
  portalTokenExpiresAt: Date | null;
};

/**
 * POST /api/client/portal-message
 * Send a message from the client portal to the office inbox.
 *
 * Auth (either path):
 * - Session: existing logged-in client (getToken / user record).
 * - Magic link: body { bookingId, token } validated with isPortalTokenValid
 *   against that exact booking — token for booking A cannot message booking B.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, bookingId, attachments, token: portalTokenFromBody } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const portalToken =
      typeof portalTokenFromBody === "string" && portalTokenFromBody.trim()
        ? portalTokenFromBody.trim()
        : request.nextUrl.searchParams.get("token");

    let senderName: string;
    let senderEmail: string;
    let senderUserId: string | null = null;
    let booking: BookingForMessage | null = null;

    if (portalToken) {
      // Magic-link path: bookingId is mandatory; token must match that booking only.
      if (!bookingId || typeof bookingId !== "string") {
        return NextResponse.json(
          { error: "Booking ID is required when using a portal link" },
          { status: 400 }
        );
      }

      const bookingRecord = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: {
          id: true,
          name: true,
          email: true,
          userId: true,
          eventType: true,
          eventDate: true,
          venueName: true,
          portalToken: true,
          portalTokenExpiresAt: true,
        },
      });

      if (!bookingRecord) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      if (!isPortalTokenValid(bookingRecord, portalToken)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      booking = bookingRecord;
      senderName = bookingRecord.name?.trim() || bookingRecord.email;
      senderEmail = bookingRecord.email;
      senderUserId = bookingRecord.userId;
    } else {
      // Session path: unchanged behaviour for logged-in portal users.
      const jwtToken = await getToken({
        req: request as any,
        secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
      });

      if (!jwtToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const userId = (jwtToken.id as string) || (jwtToken.sub as string);

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

      senderName = user.name?.trim() || user.email;
      senderEmail = user.email;
      senderUserId = userId;

      if (bookingId) {
        const bookingRecord = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: {
            id: true,
            name: true,
            email: true,
            userId: true,
            eventType: true,
            eventDate: true,
            venueName: true,
            portalToken: true,
            portalTokenExpiresAt: true,
          },
        });

        if (!bookingRecord) {
          return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const session = await auth();
        const u = session?.user as { id?: string; role?: string; email?: string } | undefined;
        let allowed = false;
        if (u?.role === "admin" || (!!u?.id && bookingRecord.userId === u.id)) {
          allowed = true;
        }
        if (!allowed && u?.email && bookingRecord.email) {
          if (
            u.email.toString().toLowerCase().trim() ===
            bookingRecord.email.toLowerCase().trim()
          ) {
            allowed = true;
          }
        }

        if (!allowed) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        booking = bookingRecord;
      } else if (user.bookings && user.bookings.length > 0) {
        const b = user.bookings[0];
        booking = {
          id: b.id,
          name: b.name,
          email: b.email,
          userId: b.userId,
          eventType: b.eventType,
          eventDate: b.eventDate,
          venueName: b.venueName,
          portalToken: null,
          portalTokenExpiresAt: null,
        };
      }
    }

    let officeInbox = await prisma.emailInbox.findFirst({
      where: {
        email: { contains: "info@stylishentertainment.co.uk" },
        isActive: true,
      },
    });

    if (!officeInbox) {
      officeInbox = await prisma.emailInbox.findFirst({
        where: { isActive: true },
      });
    }

    if (!officeInbox) {
      return NextResponse.json({ error: "No active inbox configured" }, { status: 500 });
    }

    const attachmentOwnerKey = senderUserId || booking?.id || "portal";

    let attachmentData: any[] = [];
    if (attachments && Array.isArray(attachments)) {
      for (const attachment of attachments) {
        if (attachment.data && attachment.filename) {
          try {
            if (process.env.CLOUDINARY_CLOUD_NAME) {
              const uploadResult = await uploadToCloudinary(
                attachment.data,
                `portal-attachments/${attachmentOwnerKey}/${Date.now()}-${attachment.filename}`,
                attachment.contentType || "application/octet-stream"
              );

              attachmentData.push({
                filename: attachment.filename,
                contentType: attachment.contentType || "application/octet-stream",
                url: uploadResult.secure_url,
                size: attachment.size || 0,
              });
            } else {
              attachmentData.push({
                filename: attachment.filename,
                contentType: attachment.contentType || "application/octet-stream",
                data: attachment.data,
                size: attachment.size || 0,
              });
            }
          } catch (error) {
            console.error("Error uploading attachment:", error);
          }
        }
      }
    }

    const subject = booking
      ? `Message from ${senderName} - ${booking.eventType} at ${booking.venueName}`
      : `Message from ${senderName} via Portal`;

    const threadWhere = portalToken
      ? {
          bookingId: booking!.id,
          source: "portal" as const,
          inboxId: officeInbox.id,
          fromEmail: senderEmail.toLowerCase(),
        }
      : {
          userId: senderUserId!,
          bookingId: booking?.id || null,
          source: "portal" as const,
          inboxId: officeInbox.id,
        };

    let thread = await prisma.emailThread.findFirst({
      where: threadWhere,
      orderBy: { lastMessageAt: "desc" },
    });

    if (!thread) {
      thread = await prisma.emailThread.create({
        data: {
          subject,
          fromEmail: senderEmail,
          fromName: senderName || null,
          toEmail: officeInbox.email,
          userId: senderUserId,
          bookingId: booking?.id || null,
          inboxId: officeInbox.id,
          source: "portal",
        },
      });
    }

    const emailRecord = await prisma.email.create({
      data: {
        threadId: thread.id,
        subject,
        fromEmail: senderEmail,
        fromName: senderName || null,
        toEmail: officeInbox.email,
        textContent: message,
        htmlContent: message.replace(/\n/g, "<br>"),
        direction: "inbound",
        inboxId: officeInbox.id,
        sentByUserId: senderUserId ?? undefined,
        attachments: attachmentData.length > 0 ? attachmentData : undefined,
      },
    });

    await prisma.emailThread.update({
      where: { id: thread.id },
      data: { lastMessageAt: new Date() },
    });

    const notificationSubject = `New Message from ${senderName} via Portal`;
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
          New Portal Message
        </h2>
        <p style="color: #333; line-height: 1.6;">
          <strong>From:</strong> ${senderName} (${senderEmail})<br>
          ${booking ? `<strong>Booking:</strong> ${booking.eventType} at ${booking.venueName} on ${new Date(booking.eventDate).toLocaleDateString()}<br>` : ""}
          <strong>Date:</strong> ${new Date().toLocaleString()}
        </p>
        <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        ${
          attachmentData.length > 0
            ? `
          <p style="color: #666; font-size: 14px;">
            <strong>Attachments:</strong><br>
            ${attachmentData.map((a) => `• ${a.filename} (${(a.size / 1024).toFixed(1)} KB)`).join("<br>")}
          </p>
        `
            : ""
        }
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          <a href="${process.env.NEXTAUTH_URL || "https://stylishentertainment.co.uk"}/admin/bookings${booking ? `/${booking.id}` : ""}" 
             style="color: #D4AF37; text-decoration: none; font-weight: bold;">
            View in Admin Dashboard →
          </a>
        </p>
      </div>
    `;

    const recipientEmail =
      process.env.CONTACT_FORM_EMAIL ||
      process.env.NOTIFICATION_EMAIL ||
      "info@stylishentertainment.co.uk";
    try {
      await sendEmail({
        to: recipientEmail,
        subject: notificationSubject,
        html: notificationHtml,
        text: `New Message from ${senderName} via Portal\n\n${message}`,
      });
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
    }

    if (booking?.id) {
      try {
        await notifyAdminSignificantEvent({
          type: "portal_message",
          bookingId: booking.id,
          actor: "client",
          title: "Portal message",
          description: `Message from ${senderName}: ${message.slice(0, 100)}${message.length > 100 ? "…" : ""}`,
          bookingName: booking.name ?? undefined,
          venueName: booking.venueName ?? undefined,
          eventDate: booking.eventDate
            ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : undefined,
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
