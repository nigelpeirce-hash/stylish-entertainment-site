import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { FIRST_TOUCH } from "@/lib/email/templates";
import sendEmail from "@/lib/email/send-email";

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

    // Send Automated First Touch Email (shared template for consistency)
    try {
      const { subject, html, text } = FIRST_TOUCH({
        name,
        email,
        venueName: venuePostcode || "your venue",
        eventDate: parsedEventDate,
      });

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
