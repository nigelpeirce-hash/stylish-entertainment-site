import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

// Lazy initialization
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      bookingId,
      clientEmail,
      clientName,
      venueName,
      eventDate,
      selectedDJ,
      fee,
      emailContent,
      emailHTML,
      services,
    } = body;

    if (!bookingId || !clientEmail || !fee || !emailContent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch authoritative booking data at send time so the recipient and subject
    // come from the database, not from the possibly-stale values the browser submitted.
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        email: true,
        venueName: true,
        eventDate: true,
        feeBreakdown: true,
        emailsSent: true,
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

    // Subject uses DB venue/date (fall back to submitted values only if the DB field is absent).
    const subjectVenue = booking.venueName ?? venueName;
    const subjectEventDate = booking.eventDate ?? eventDate;

    // Format event date
    const formattedDate = new Date(subjectEventDate).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Get DJ name if selected
    let djName = "TBC";
    if (selectedDJ) {
      const dj = await prisma.dJ.findUnique({
        where: { id: selectedDJ },
        select: { name: true },
      });
      if (dj) {
        djName = dj.name;
      }
    }

    // Send email using Resend
    const emailConfig = getResendConfig("booking");
    const result = await getResend().emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: [booking.email],
      subject: `Your Quote - ${subjectVenue} on ${formattedDate}`,
      html: emailHTML,
    });

    // Update booking with quoted fee. Track persistence so the caller can surface
    // recordSaved:false when the send succeeded but the record could not be saved.
    let recordSaved = false;
    try {
      if (booking) {
        const existingFeeBreakdown = (booking.feeBreakdown as any) || {};
        const existingEmailsSent = (booking.emailsSent as any) || {};
        const composedEmails = existingEmailsSent.composedEmails || [];

        // Update fee breakdown
        const updatedFeeBreakdown = {
          ...existingFeeBreakdown,
          quotedFee: fee,
          quotedAt: new Date().toISOString(),
          quotedBy: admin.name || admin.email || "System",
          services: {
            dj: services.dj || false,
            lighting: services.lighting || false,
            styling: services.styling || false,
          },
          djName: selectedDJ ? djName : undefined,
        };

        // Log email send
        composedEmails.push({
          sentAt: new Date().toISOString(),
          sentBy: admin.name || admin.email || "System",
          subject: `Your Quote - ${subjectVenue} on ${formattedDate}`,
          messageId: result.data?.id,
          fee: fee,
          services: services,
        });

        // Update booking
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            feeBreakdown: updatedFeeBreakdown as any,
            emailsSent: {
              ...existingEmailsSent,
              composedEmails,
            } as any,
            lastEmailSentAt: new Date(),
          },
        });
        recordSaved = true;
      }
    } catch (dbError) {
      console.error("Error updating booking with quoted fee:", dbError);
      // Don't fail the request if database update fails
    }

    try {
      await logActivity({
        bookingId,
        action: "composed_email_sent",
        description: `Quote email sent to ${booking.email} (fee: £${fee})`,
        actor: "admin",
        performedBy: admin?.name ?? admin?.email ?? undefined,
        metadata: { venueName: subjectVenue, fee },
      });
      await notifyAdminSignificantEvent({
        type: "composed_email_sent",
        bookingId,
        title: "Composed email sent",
        description: `Quote sent to ${clientName} for ${subjectVenue} – £${fee}`,
        actor: "admin",
        performedBy: admin?.name ?? admin?.email ?? undefined,
        bookingName: clientName,
        venueName: subjectVenue ?? undefined,
        eventDate: formattedDate,
      });
    } catch (e) {
      console.warn("[send-composed-email] Admin notification failed:", e);
    }

    return NextResponse.json({
      success: true,
      recordSaved,
      messageId: result.data?.id,
      message: recordSaved
        ? "Email sent successfully and quoted fee saved"
        : "Email sent, but saving the quote record failed",
    });
  } catch (error: any) {
    console.error("Error sending composed email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
