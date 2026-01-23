import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { sendEmailFromCRM } from "@/lib/email-send";
import { getDisplayName, getGreetingName } from "@/lib/utils/name-helpers";

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
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create email HTML
    const portalInviteHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto;">
        <div style="border-top: 2px solid #000000; padding-top: 20px; margin-top: 20px;"></div>
        <h1 style="font-size: 24px; font-weight: 600; color: #1A1A1A; margin: 20px 0;">Manage Your Booking</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 20px 0;">
          Hello ${greetingName || "there"},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 20px 0;">
          You can now access your booking portal to view and manage your event details for <strong>${displayName}</strong> on <strong>${formattedDate}</strong>.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${portalUrl}" style="display: inline-block; background-color: #D4AF37; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 16px;">
            Access Your Booking Portal
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #666666; margin: 20px 0;">
          If you have any questions or need to make changes, please don't hesitate to contact us.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #666666; margin: 20px 0;">
          Best regards,<br />
          Stylish Entertainment
        </p>
      </div>
    `;

    // Send email
    await sendEmailFromCRM({
      to: booking.email,
      subject: `Access Your Booking Portal - ${displayName}`,
      html: portalInviteHtml,
      text: `Hello ${greetingName || "there"},\n\nYou can now access your booking portal to view and manage your event details for ${displayName} on ${formattedDate}.\n\nAccess your portal: ${portalUrl}\n\nIf you have any questions, please contact us.\n\nBest regards,\nStylish Entertainment`,
    });

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
