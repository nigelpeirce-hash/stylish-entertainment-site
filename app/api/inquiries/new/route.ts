import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getJourneyEmail } from "@/lib/email-journey-templates";
import sendEmail from "@/lib/email/send-email";
import { getResendConfig } from "@/lib/email-config";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phoneAreaCode, phoneNumber, eventDate, venuePostcode, eventType, message } = body;

    // Validate required fields
    if (!name || !email || !eventDate || !venuePostcode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse event date
    const parsedEventDate = new Date(eventDate);
    if (isNaN(parsedEventDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid event date" },
        { status: 400 }
      );
    }

    // Normalize postcode for matching (uppercase, remove spaces)
    const normalizedPostcode = venuePostcode.toUpperCase().replace(/\s+/g, "");

    // Conflict Detection Engine: Check for matching Date + Postcode
    const existingBooking = await prisma.booking.findFirst({
      where: {
        eventDate: {
          gte: new Date(parsedEventDate.setHours(0, 0, 0, 0)),
          lt: new Date(parsedEventDate.setHours(23, 59, 59, 999)),
        },
        OR: [
          { venuePostcode: { contains: normalizedPostcode, mode: "insensitive" } },
          { venuePostcode: normalizedPostcode },
        ],
        status: {
          not: "cancelled",
        },
      },
      select: {
        id: true,
        name: true,
        eventDate: true,
        venueName: true,
        venuePostcode: true,
      },
    });

    // Create new enquiry
    const enquiry = await prisma.newEnquiry.create({
      data: {
        id: randomUUID(),
        name,
        email,
        phoneAreaCode: phoneAreaCode || null,
        phoneNumber: phoneNumber || null,
        message: message && String(message).trim() ? String(message).trim() : null,
        eventDate: parsedEventDate,
        venuePostcode: normalizedPostcode,
        eventType: eventType || null, // Store event type from form
        isConflict: !!existingBooking,
        originalBookingId: existingBooking?.id || null,
        conflictDetectedAt: existingBooking ? new Date() : null,
        status: "new",
        updatedAt: new Date(),
      },
    });

    // Send New Enquiry Auto-Responder (same as contact form)
    try {
      const eventDateFormatted = parsedEventDate.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const { subject, html } = getJourneyEmail("enquiry-autoresponder", {
        clientName: name,
        eventType: eventType || "event",
        eventDate: eventDateFormatted,
        venueName: venuePostcode || undefined,
      });
      const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

      await sendEmail({
        to: email,
        subject,
        html,
        text,
      });

      // Update enquiry with email sent status
      await prisma.newEnquiry.update({
        where: { id: enquiry.id },
        data: {
          firstTouchEmailSent: true,
          firstTouchEmailSentAt: new Date(),
        },
      });
    } catch (emailError) {
      console.error("Error sending first touch email:", emailError);
      // Don't fail the request if email fails
    }

    // Send Mobile Notification Webhook
    try {
      await sendMobileNotification(enquiry, existingBooking);
    } catch (notificationError) {
      console.error("Error sending mobile notification:", notificationError);
      // Don't fail the request if notification fails
    }

    // Send admin email notification (enquiry has no bookingId; link to new-enquiries)
    try {
      const recipientEmail = process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk";
      const backupEmail = process.env.NOTIFICATION_EMAIL;
      const recipients = [recipientEmail, ...(backupEmail && backupEmail !== recipientEmail ? [backupEmail] : [])];
      const dateLabel = new Date(enquiry.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      const title = existingBooking ? "New enquiry (conflict flagged)" : "New enquiry";
      const description = existingBooking
        ? `${enquiry.name} – ${dateLabel} at ${enquiry.venuePostcode}. Potential conflict with existing booking.`
        : `${enquiry.name} – ${dateLabel} at ${enquiry.venuePostcode}.`;
      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://stylishentertainment.co.uk";
      const enquiryUrl = `${baseUrl}/admin/new-enquiries/${enquiry.id}`;
      const subject = `[Stylish] ${title}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">${title}</h2>
          <p style="color: #333; line-height: 1.6;">${description.replace(/\n/g, "<br>")}</p>
          <p><strong>Name:</strong> ${enquiry.name}</p>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Event date:</strong> ${dateLabel}</p>
          <p><strong>Venue postcode:</strong> ${enquiry.venuePostcode}</p>
          <p style="margin-top: 20px; font-size: 14px;">
            <a href="${enquiryUrl}" style="color: #D4AF37; font-weight: bold;">View enquiry →</a>
          </p>
        </div>
      `;
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey && apiKey !== "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" && apiKey.startsWith("re_") && apiKey.length >= 35) {
        const resend = new Resend(apiKey);
        const emailConfig = getResendConfig("general");
        for (const to of recipients) {
          const result = await resend.emails.send({
            from: emailConfig.from,
            replyTo: emailConfig.replyTo,
            to: [to],
            subject,
            html,
          });
          if (result.data?.id && !result.error) {
            console.log("[inquiries/new] Admin notification sent to", to);
          }
        }
      } else {
        await sendEmail({ to: recipientEmail, subject, html }).catch((err) =>
          console.warn("[inquiries/new] Admin email fallback failed:", err)
        );
      }
    } catch (adminEmailError) {
      console.warn("Admin notification (new enquiry) failed:", adminEmailError);
    }

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      conflictDetected: !!existingBooking,
      message: existingBooking
        ? "Enquiry received. A potential conflict was detected and flagged for review."
        : "Enquiry received successfully. We'll contact you soon.",
    });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function sendMobileNotification(enquiry: any, existingBooking: any) {
  const webhookUrl = process.env.MOBILE_NOTIFICATION_WEBHOOK_URL;
  const notificationType = process.env.MOBILE_NOTIFICATION_TYPE || "pushover"; // "pushover", "slack", "whatsapp"

  if (!webhookUrl) {
    console.warn("Mobile notification webhook URL not configured");
    return;
  }

  // Use relative paths for internal links (works regardless of port)
  const dashboardPath = `/admin/new-enquiries/${enquiry.id}`;
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}${dashboardPath}`
    : dashboardPath;
  const deepLinkUrl = dashboardUrl;

  const message = existingBooking
    ? `⚠️ CONFLICT DETECTED: New enquiry from ${enquiry.name} for ${new Date(enquiry.eventDate).toLocaleDateString()} at ${enquiry.venuePostcode}. Conflicting with existing booking for ${existingBooking.name}.`
    : `📧 New Enquiry: ${enquiry.name} - ${new Date(enquiry.eventDate).toLocaleDateString()} at ${enquiry.venuePostcode}`;

  const payload: any = {
    message,
    title: existingBooking ? "⚠️ Conflict Detected" : "📧 New Enquiry",
    url: deepLinkUrl,
    priority: existingBooking ? 1 : 0, // High priority for conflicts
  };

  // Pushover format
  if (notificationType === "pushover") {
    const pushoverPayload = {
      token: process.env.PUSHOVER_API_TOKEN || "",
      user: process.env.PUSHOVER_USER_KEY || "",
      title: payload.title,
      message: payload.message,
      url: payload.url,
      url_title: "View Enquiry",
      priority: payload.priority,
    };

    await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pushoverPayload),
    });
  }
  // Slack format
  else if (notificationType === "slack") {
    const slackPayload = {
      text: payload.title,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${payload.title}*\n${payload.message}`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Enquiry",
              },
              url: payload.url,
              style: existingBooking ? "danger" : "primary",
            },
          ],
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackPayload),
    });
  }
  // Generic webhook format
  else {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  // Update enquiry with notification sent status
  await prisma.newEnquiry.update({
    where: { id: enquiry.id },
    data: {
      notificationSent: true,
      notificationSentAt: new Date(),
    },
  });
}
