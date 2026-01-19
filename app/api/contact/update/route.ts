import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";
import { Resend } from "resend";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy initialization
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

/**
 * Update an existing booking with additional information
 * Allows clients to add updates like corrected event date, DJ preference, or additional message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, email, updates } = body;

    // Validation
    if (!bookingId || !email || !updates) {
      return NextResponse.json(
        { error: "Booking ID, email, and updates are required" },
        { status: 400 }
      );
    }

    // Verify the booking exists and belongs to this email
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        email: email,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or email mismatch" },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {};
    const updateMessages: string[] = [];

    // Handle event date update
    if (updates.eventDate) {
      const newEventDate = new Date(updates.eventDate);
      updateData.eventDate = newEventDate;
      updateMessages.push(`Event date updated to: ${newEventDate.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`);
    }

    // Handle DJ preference update
    if (updates.preferredDJ !== undefined) {
      updateData.preferredDJ = updates.preferredDJ || null;
      if (updates.preferredDJ) {
        updateMessages.push(`Preferred DJ updated to: ${updates.preferredDJ}`);
      } else {
        updateMessages.push("DJ preference cleared");
      }
    }

    // Handle additional message
    if (updates.additionalMessage) {
      // Append to existing message
      const currentMessage = booking.message || "";
      updateData.message = `${currentMessage}\n\n--- UPDATE (${new Date().toLocaleString("en-GB")}) ---\n${updates.additionalMessage}`;
      updateMessages.push("Additional message added");
    }

    // Update priority if event date changed and it's now urgent (within 2 weeks)
    if (updates.eventDate) {
      const newEventDate = new Date(updates.eventDate);
      const today = new Date();
      const daysUntilEvent = Math.ceil((newEventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilEvent <= 14 && daysUntilEvent >= 0) {
        updateData.priority = "urgent";
        updateMessages.push("Priority updated to URGENT (event within 2 weeks)");
      }
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    // Send notification email to business
    try {
      const emailConfig = getResendConfig("booking");
      const updateSummary = updateMessages.join("\n");
      
      await getResend().emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: EMAIL_CONFIG.OFFICE_EMAIL,
        subject: `🔔 Booking Update: ${booking.name} - ${booking.venueName || "Venue TBD"}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #d4af37; border-top: none; border-radius: 0 0 8px 8px; }
                .update-box { background: #f8f9fa; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Booking Update</h1>
                </div>
                <div class="content">
                  <p><strong>Client:</strong> ${booking.name}</p>
                  <p><strong>Email:</strong> ${booking.email}</p>
                  <p><strong>Original Event Date:</strong> ${booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-GB") : "TBD"}</p>
                  <p><strong>Venue:</strong> ${booking.venueName || "TBD"}</p>
                  
                  <div class="update-box">
                    <h3 style="margin-top: 0; color: #d4af37;">Updates:</h3>
                    <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${updateSummary}</pre>
                  </div>

                  ${updates.additionalMessage ? `
                    <div class="update-box">
                      <h3 style="margin-top: 0; color: #d4af37;">Client Message:</h3>
                      <p style="margin: 0;">${updates.additionalMessage.replace(/\n/g, "<br>")}</p>
                    </div>
                  ` : ""}

                  <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://stylishentertainment.co.uk"}/admin/bookings/${bookingId}" style="color: #d4af37; text-decoration: none; font-weight: bold;">View Booking Details →</a></p>
                </div>
                <div class="footer">
                  <p>This update was submitted via the STYLISH Entertainment enquiry form.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Error sending update notification email:", emailError);
      // Don't fail the update if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking: {
        id: updatedBooking.id,
        eventDate: updatedBooking.eventDate,
        preferredDJ: updatedBooking.preferredDJ,
      },
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the booking. Please try again." },
      { status: 500 }
    );
  }
}
