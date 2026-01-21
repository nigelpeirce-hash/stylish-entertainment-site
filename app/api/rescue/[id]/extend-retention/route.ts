import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";
import { Resend } from "resend";

// Force dynamic rendering
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
    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        name: true,
        email: true,
        eventDate: true,
        venueName: true,
        status: true,
        purgeAt: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Calculate new purge_at date (30 days from now, or 30 days from current purge_at if it exists)
    const now = new Date();
    const currentPurgeAt = booking.purgeAt ? new Date(booking.purgeAt) : null;
    const newPurgeAt = currentPurgeAt 
      ? new Date(currentPurgeAt.getTime() + 30 * 24 * 60 * 60 * 1000) // Add 30 days to existing purge_at
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days from now

    // Update booking: extend retention and set status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        purgeAt: newPurgeAt,
        rescuedAt: now, // Track when lead was rescued
        status: "Active - Follow Up Requested", // Set new status
      },
      select: {
        id: true,
        name: true,
        email: true,
        eventDate: true,
        venueName: true,
        status: true,
      },
    });

    // Send admin notification email
    try {
      const emailConfig = getResendConfig("general");
      const formattedDate = new Date(updatedBooking.eventDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4af37; color: #000; padding: 30px 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .alert { background: #fff3cd; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; }
            .details { background: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #333; }
            .detail-value { color: #666; }
            .button { display: inline-block; padding: 12px 24px; background: #d4af37; color: #000; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🎯 Lead Rescued!</h1>
            </div>
            <div class="content">
              <div class="alert">
                <strong>Action Required:</strong> A client has requested more time for their enquiry.
              </div>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Client Name:</span>
                  <span class="detail-value">${updatedBooking.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${updatedBooking.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Event Date:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Venue:</span>
                  <span class="detail-value">${updatedBooking.venueName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">${updatedBooking.status}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">New Purge Date:</span>
                  <span class="detail-value">${newPurgeAt.toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
              </div>

              <p style="margin-top: 20px;">
                <strong>Next Steps:</strong> Please follow up with ${updatedBooking.name} to see if there's anything specific we can help with during this extended period.
              </p>

              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk"}/admin/bookings/${bookingId}" class="button">
                View Booking Details
              </a>
            </div>
            <div class="footer">
              <p>STYLISH Entertainment - Admin Notification</p>
              <p>This is an automated alert from the Lead Rescue system.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await getResend().emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [EMAIL_CONFIG.OFFICE_EMAIL],
        subject: `🎯 Lead Rescued! ${updatedBooking.name} - ${formattedDate}`,
        html: adminEmailHtml,
      });
    } catch (emailError: any) {
      // Log email error but don't fail the request
      console.error("Error sending admin notification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Retention period extended successfully",
      booking: {
        name: updatedBooking.name,
        eventDate: updatedBooking.eventDate,
        venueName: updatedBooking.venueName,
      },
    });
  } catch (error: any) {
    console.error("Error extending retention:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to extend retention period. Please contact us directly.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
