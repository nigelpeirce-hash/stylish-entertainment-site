import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import {
  bookingConfirmationEmail,
  finalDetailsReminderEmail,
  paymentReminderEmail,
} from "@/lib/email-templates";

// This endpoint should be called by a cron job or scheduled task
// For local development, you can call it manually or set up a cron
// For production, use Vercel Cron, Azure Functions, or similar
export async function GET(request: NextRequest) {
  try {
    // Verify it's a cron request (in production, add authentication header check)
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const results = {
      confirmationEmails: 0,
      finalDetailsEmails: 0,
      paymentReminders: 0,
      errors: [] as string[],
    };

    // Get all confirmed/pending bookings
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["confirmed", "pending"],
        },
      },
    });

    for (const booking of bookings) {
      const emailsSent = (booking.emailsSent as any) || {};
      const bookingDate = new Date(booking.eventDate);
      const daysUntilEvent = Math.ceil((bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceBooking = Math.floor((now.getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60 * 24));

      // Send booking confirmation email 2 days after booking
      if (daysSinceBooking >= 2 && !emailsSent.confirmation) {
        try {
          const emailContent = bookingConfirmationEmail({
            booking: {
              name: booking.name,
              eventType: booking.eventType,
              eventDate: bookingDate,
              venueName: booking.venueName,
              bookingId: booking.id,
            },
          });

          const result = await sendEmail({
            to: booking.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });

          if (result.success) {
            emailsSent.confirmation = {
              sent: true,
              sentAt: now.toISOString(),
              messageId: result.messageId,
            };
            results.confirmationEmails++;
          }
        } catch (error) {
          results.errors.push(`Failed to send confirmation to ${booking.email}: ${error}`);
        }
      }

      // Send final details reminder 3 weeks (21 days) before event
      if (daysUntilEvent <= 21 && daysUntilEvent > 14 && !emailsSent.finalDetails) {
        try {
          const emailContent = finalDetailsReminderEmail({
            booking: {
              name: booking.name,
              eventType: booking.eventType,
              eventDate: bookingDate,
              venueName: booking.venueName,
              bookingId: booking.id,
            },
          });

          const result = await sendEmail({
            to: booking.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });

          if (result.success) {
            emailsSent.finalDetails = {
              sent: true,
              sentAt: now.toISOString(),
              messageId: result.messageId,
            };
            results.finalDetailsEmails++;
          }
        } catch (error) {
          results.errors.push(`Failed to send final details reminder to ${booking.email}: ${error}`);
        }
      }

      // Send payment reminder 2 weeks (14 days) before event
      if (daysUntilEvent <= 14 && daysUntilEvent > 7 && !emailsSent.paymentReminder) {
        try {
          const emailContent = paymentReminderEmail({
            booking: {
              name: booking.name,
              eventType: booking.eventType,
              eventDate: bookingDate,
              venueName: booking.venueName,
              bookingId: booking.id,
            },
          });

          const result = await sendEmail({
            to: booking.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });

          if (result.success) {
            emailsSent.paymentReminder = {
              sent: true,
              sentAt: now.toISOString(),
              messageId: result.messageId,
            };
            results.paymentReminders++;
          }
        } catch (error) {
          results.errors.push(`Failed to send payment reminder to ${booking.email}: ${error}`);
        }
      }

      // Update booking with email tracking
      if (Object.keys(emailsSent).length > Object.keys(booking.emailsSent || {}).length) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            emailsSent: emailsSent,
            lastEmailSentAt: now,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Error in scheduled email job:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
