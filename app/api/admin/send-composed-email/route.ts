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

    // Format event date
    const formattedDate = new Date(eventDate).toLocaleDateString("en-GB", {
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
      to: [clientEmail],
      subject: `Your Quote - ${venueName} on ${formattedDate}`,
      html: emailHTML,
    });

    // Update booking with quoted fee
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { feeBreakdown: true, emailsSent: true },
      });

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
          subject: `Your Quote - ${venueName} on ${formattedDate}`,
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
      }
    } catch (dbError) {
      console.error("Error updating booking with quoted fee:", dbError);
      // Don't fail the request if database update fails
    }

    try {
      await logActivity({
        bookingId,
        action: "composed_email_sent",
        description: `Quote email sent to ${clientEmail} (fee: £${fee})`,
        actor: "admin",
        performedBy: admin?.name ?? admin?.email ?? undefined,
        metadata: { venueName, fee },
      });
      await notifyAdminSignificantEvent({
        type: "composed_email_sent",
        bookingId,
        title: "Composed email sent",
        description: `Quote sent to ${clientName} for ${venueName} – £${fee}`,
        actor: "admin",
        performedBy: admin?.name ?? admin?.email ?? undefined,
        bookingName: clientName,
        venueName: venueName ?? undefined,
        eventDate: formattedDate,
      });
    } catch (e) {
      console.warn("[send-composed-email] Admin notification failed:", e);
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
      message: "Email sent successfully and quoted fee saved",
    });
  } catch (error: any) {
    console.error("Error sending composed email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
