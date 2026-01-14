import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import {
  bookingConfirmationEmail,
  finalDetailsReminderEmail,
  paymentReminderEmail,
  welcomeEmail,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    // Only allow admin users or system to send emails
    const session = await getServerSession();
    // For now, allow sending (in production, you might want to restrict this)
    
    const body = await request.json();
    const { bookingId, emailType } = body;

    if (!bookingId || !emailType) {
      return NextResponse.json(
        { error: "bookingId and emailType are required" },
        { status: 400 }
      );
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Prepare booking details for email template
    const bookingDetails = {
      name: booking.name,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      venueName: booking.venueName,
      bookingId: booking.id,
    };

    // Generate email based on type
    let emailContent: { subject: string; html: string };
    let emailKey: string;

    switch (emailType) {
      case "welcome":
        emailContent = welcomeEmail({ booking: bookingDetails });
        emailKey = "welcome";
        break;
      case "confirmation":
        emailContent = bookingConfirmationEmail({ booking: bookingDetails });
        emailKey = "confirmation";
        break;
      case "final-details":
        emailContent = finalDetailsReminderEmail({ booking: bookingDetails });
        emailKey = "finalDetails";
        break;
      case "payment-reminder":
        emailContent = paymentReminderEmail({ booking: bookingDetails });
        emailKey = "paymentReminder";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    // Send email
    const result = await sendEmail({
      to: booking.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: (result as any).error || "Failed to send email" },
        { status: 500 }
      );
    }

    // Update booking to track email sent
    const emailsSent = (booking.emailsSent as any) || {};
    emailsSent[emailKey] = {
      sent: true,
      sentAt: new Date().toISOString(),
      messageId: result.success ? (result as any).messageId : undefined,
    };

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        emailsSent: emailsSent,
        lastEmailSentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.success ? (result as any).messageId : undefined,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
