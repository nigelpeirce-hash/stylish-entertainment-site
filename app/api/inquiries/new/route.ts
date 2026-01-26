import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phoneAreaCode, phoneNumber, eventDate, venuePostcode, eventType } = body;

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
        name,
        email,
        phoneAreaCode: phoneAreaCode || null,
        phoneNumber: phoneNumber || null,
        eventDate: parsedEventDate,
        venuePostcode: normalizedPostcode,
        eventType: eventType || null, // Store event type from form
        isConflict: !!existingBooking,
        originalBookingId: existingBooking?.id || null,
        conflictDetectedAt: existingBooking ? new Date() : null,
        status: "new",
      },
    });

    // Send Automated First Touch Email
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #d4af37; color: #000; padding: 20px; text-align: center; }
              .content { background: #f5f5f0; padding: 30px; }
              .footer { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>STYLISH Entertainment</h1>
              </div>
              <div class="content">
                <h2>Hi ${name},</h2>
                <p>Thanks for reaching out about ${parsedEventDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}!</p>
                <p>We are currently checking our talent availability and will get back to you shortly.</p>
                <p>We're excited to help make your event unforgettable.</p>
                <p>Best regards,<br>STYLISH Entertainment Team</p>
              </div>
              <div class="footer">
                <p>STYLISH Entertainment | Premium DJs, Lighting & Events</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const resend = getResend();
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@stylishentertainment.co.uk",
        to: email,
        subject: `Thank you for your enquiry - ${parsedEventDate.toLocaleDateString("en-GB")}`,
        html: emailHtml,
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
