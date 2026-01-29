import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import sendEmail from "@/lib/email/send-email";
import { getDisplayName, getGreetingName } from "@/lib/utils/name-helpers";
import { yourEventLabel } from "@/lib/email-templates";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Send portal access link to booking client
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check admin authorization
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve params (Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    // Fetch the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        name: true,
        email: true,
        eventDate: true,
        venueName: true,
        displayName: true,
        eventType: true,
        djFinishTime: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.email) {
      return NextResponse.json(
        { error: "Booking has no email address" },
        { status: 400 }
      );
    }

    // Generate portal link
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3001";
    const portalUrl = `${baseUrl}/client/bookings/${booking.id}`;

    // Get greeting name for email
    const greetingName = getGreetingName(booking.name);
    const displayName = getDisplayName(booking.name) || booking.name;

    // Format event date
    const eventDate = new Date(booking.eventDate);
    const formattedDate = eventDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const isWedding = (booking.eventType || "").toLowerCase() === "wedding";
    const eventLabel = yourEventLabel(booking.eventType);

    const headline = isWedding ? "Your Wedding Portal is Ready!" : "Your Booking Portal is Ready!";
    const greeting = isWedding ? `Dear ${displayName},` : `Hello ${greetingName || "there"},`;
    const intro = isWedding
      ? "We're so excited to be part of your special day! Your personal wedding portal is ready for you to explore."
      : `Thank you for booking with Stylish Entertainment Ltd! Your personal portal for ${eventLabel} is ready for you to explore.`;
    const portalIntro = isWedding
      ? "In your portal you can manage your entertainment details, share your music preferences, view your booking information, and communicate with us directly."
      : "In your portal you can view your booking details, manage your preferences, and communicate with us directly.";
    const subject = isWedding
      ? `Your Wedding Portal - ${displayName}`
      : `Your Booking Portal - ${displayName}`;
    const ctaText = "View Your Countdown";

    // Create email HTML
    const portalInviteHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <style>
          /* Prevent dark mode from inverting colors */
          @media (prefers-color-scheme: dark) {
            .email-container { background-color: #ffffff !important; }
            .email-text { color: #1a1a1a !important; }
            .email-footer { background-color: #1a1a1a !important; }
            .email-footer-text { color: #ffffff !important; }
          }
        </style>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff !important; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" class="email-container">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 40px; text-align: center;">
                    <img src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png" alt="STYLISH ENTERTAINMENT" width="180" style="display: block; margin: 0 auto;">
                    <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 8px 0 0 0; font-family: Arial, sans-serif;">Stylish Entertainment</p>
                  </td>
                </tr>
                
                ${isWedding ? `
                <!-- Gold Accent Bar for Weddings -->
                <tr>
                  <td style="background: linear-gradient(90deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%); height: 4px;"></td>
                </tr>
                ` : `
                <!-- Accent Bar -->
                <tr>
                  <td style="background-color: #D4AF37; height: 4px;"></td>
                </tr>
                `}
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    
                    <!-- Headline -->
                    <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a !important; margin: 0 0 24px 0; text-align: center; ${isWedding ? 'font-family: Georgia, serif;' : ''}" class="email-text">
                      ${headline}
                    </h1>
                    
                    <!-- Greeting -->
                    <p style="font-size: 16px; color: #333333 !important; line-height: 1.8; margin: 0 0 16px 0;" class="email-text">
                      ${greeting}
                    </p>
                    
                    <!-- Intro -->
                    <p style="font-size: 16px; color: #333333 !important; line-height: 1.8; margin: 0 0 24px 0;" class="email-text">
                      ${intro}
                    </p>
                    
                    <!-- Event Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: ${isWedding ? 'linear-gradient(135deg, #fdfbf7 0%, #f9f5ed 100%)' : '#f9f9f9'}; border-radius: 8px; margin: 24px 0; ${isWedding ? 'border: 1px solid #D4AF37;' : 'border: 1px solid #e5e5e5;'}">
                      <tr>
                        <td style="padding: 24px;">
                          ${isWedding ? '<p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; margin: 0 0 16px 0; font-weight: 600;">Your Wedding Details</p>' : `<p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #888888; margin: 0 0 16px 0; font-weight: 600;">Your ${eventLabel === "your corporate party" ? "Corporate Party" : "Party"} Details</p>`}
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="80" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Event</td>
                              <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${displayName}</td>
                            </tr>
                            <tr>
                              <td width="80" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Date</td>
                              <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${formattedDate}</td>
                            </tr>
                            ${booking.venueName ? `
                            <tr>
                              <td width="80" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Venue</td>
                              <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${booking.venueName}</td>
                            </tr>
                            ` : ''}
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Portal Info -->
                    <p style="font-size: 16px; color: #333333 !important; line-height: 1.8; margin: 24px 0;" class="email-text">
                      ${portalIntro}
                    </p>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                      <tr>
                        <td align="center">
                          <a href="${portalUrl}" style="display: inline-block; padding: 16px 40px; background: ${isWedding ? 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)' : '#1a1a1a'} !important; color: ${isWedding ? '#1a1a1a' : '#ffffff'} !important; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 4px; box-shadow: 0 4px 12px ${isWedding ? 'rgba(212, 175, 55, 0.4)' : 'rgba(0, 0, 0, 0.2)'};">
                            ${ctaText}
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Questions -->
                    <p style="font-size: 14px; color: #666666 !important; line-height: 1.6; margin: 24px 0 0 0;" class="email-text">
                      If you have any questions, we're always here to help. Simply reply to this email or use the messaging feature in your portal.
                    </p>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #1a1a1a !important; padding: 30px 40px;" class="email-footer">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: center;">
                          <p style="font-size: 14px; color: #ffffff !important; margin: 0 0 4px 0; font-weight: 600;" class="email-footer-text">Kind Regards, Ali & Nige</p>
                          <p style="font-size: 14px; color: #D4AF37 !important; margin: 0 0 16px 0;" class="email-footer-text">Stylish Entertainment Ltd</p>
                          <p style="font-size: 13px; color: #cccccc !important; margin: 0 0 4px 0;" class="email-footer-text">
                            <a href="tel:+447970793177" style="color: #cccccc !important; text-decoration: none;">07970 793 177</a>
                          </p>
                          <p style="font-size: 13px; color: #cccccc !important; margin: 0 0 4px 0;" class="email-footer-text">
                            <a href="mailto:info@stylishentertainment.co.uk" style="color: #cccccc !important; text-decoration: none;">info@stylishentertainment.co.uk</a>
                          </p>
                          <p style="font-size: 13px; margin: 12px 0 0 0;" class="email-footer-text">
                            <a href="https://stylishentertainment.co.uk" style="color: #D4AF37 !important; text-decoration: none;">stylishentertainment.co.uk</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const portalInviteText = `
${headline}

${greeting}

${intro}

EVENT DETAILS
-------------
Event: ${displayName}
Date: ${formattedDate}
${booking.venueName ? `Venue: ${booking.venueName}` : ''}

${portalIntro}

View Your Countdown: ${portalUrl}

If you have any questions, we're always here to help.

Kind Regards, Ali & Nige
Stylish Entertainment Ltd
07970 793 177
info@stylishentertainment.co.uk
https://stylishentertainment.co.uk
    `;

    // Send via Resend (same as deposit invoice, contact, etc.)
    const result = await sendEmail({
      to: booking.email,
      subject,
      html: portalInviteHtml,
      text: portalInviteText,
    });

    if (result.error) {
      console.error("[Send Portal Link] Resend error:", result.error);
      return NextResponse.json(
        { success: false, error: "Failed to send portal link", message: String(result.error.message || result.error) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portal access link sent successfully",
    });
  } catch (error: any) {
    console.error("[Send Portal Link] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send portal link",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
