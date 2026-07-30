import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import {
  depositEmailWeddingCelebration,
  depositEmailEventConfirmed,
} from "@/lib/email-templates";
import { staffConfirmationEmail } from "@/lib/email-staff-confirmation";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import { logActivity } from "@/lib/activity-log";

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    return null;
  }
  return new Resend(apiKey);
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Manually send the deposit confirmation email to the client.
 * - Data: booking, eventType, clientName (deduplicated).
 * - Template: Wedding → Wedding Celebration (gold theme); Corporate/Private → Event Confirmed.
 * - Tracks lastEmailSentAt for "Last Sent: [Date]" in Admin UI.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1") ||
      process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        name: true,
        email: true,
        eventDate: true,
        eventType: true,
        venueName: true,
        bookingFee: true,
        finalBalance: true,
        preferredDJ: true,
        staffAssignments: {
          where: { status: "confirmed", cancelledAt: null },
          select: {
            id: true,
            role: true,
            agreedFee: true,
            confirmationEmailSent: true,
            staff: { select: { id: true, name: true, email: true } },
          },
        },
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

    const clientName =
      deduplicateName(getDisplayName(booking.name) || booking.name) || "there";
    const eventType = (booking.eventType || "").toLowerCase().trim();

    const payload = {
      booking: {
        name: booking.name,
        eventDate: booking.eventDate,
        eventType: booking.eventType || undefined,
        venueName: booking.venueName || undefined,
        bookingId: booking.id,
        clientName,
        bookingFee: booking.bookingFee,
        finalBalance: booking.finalBalance,
        preferredDJ: booking.preferredDJ,
      },
    };

    const emailContent =
      eventType === "wedding"
        ? depositEmailWeddingCelebration(payload)
        : depositEmailEventConfirmed(payload);

    // Send email via Resend
    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: "Resend API key not configured" },
        { status: 500 }
      );
    }

    const emailConfig = getResendConfig("booking");
    const sendResult = await resend.emails.send({
      from: emailConfig.from,
      to: booking.email,
      replyTo: emailConfig.replyTo,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (sendResult.error) {
      console.error("Resend error sending deposit email:", sendResult.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send deposit confirmation email",
          details: process.env.NODE_ENV === "development" ? sendResult.error.message : undefined,
        },
        { status: 500 }
      );
    }

    const now = new Date();
    await prisma.booking.update({
      where: { id: bookingId },
      data: { lastEmailSentAt: now, updatedAt: now },
    });

    const assignments = booking.staffAssignments ?? [];
    for (const assignment of assignments) {
      if (!assignment.confirmationEmailSent && assignment.staff?.email) {
        try {
          const formattedDate = new Date(booking.eventDate).toLocaleDateString(
            "en-GB",
            { weekday: "long", year: "numeric", month: "long", day: "numeric" }
          );
          const emailData = staffConfirmationEmail({
            staffName: assignment.staff.name,
            eventDate: formattedDate,
            venueName: booking.venueName ?? "",
            role: assignment.role,
            agreedFee: Number(assignment.agreedFee) || 0,
            senderName: "Ali",
          });
          const artistConfig = getResendConfig("general");
          await resend.emails.send({
            from: artistConfig.from,
            replyTo: artistConfig.replyTo,
            to: [assignment.staff.email],
            subject: emailData.subject,
            html: emailData.html,
          });
          await prisma.bookingStaffAssignment.update({
            where: { id: assignment.id },
            data: {
              confirmationEmailSent: true,
              confirmationSentAt: new Date(),
            },
          });
          await prisma.commsLog.create({
            data: {
              bookingId,
              platform: "email",
              direction: "outbound",
              email: assignment.staff.email,
              contactName: assignment.staff.name,
              message: `Job Confirmation email sent for ${assignment.role} at ${booking.venueName ?? ""}`,
            },
          });
        } catch (e) {
          console.error("[Send Deposit Email] Artist confirmation error:", e);
        }
      }
    }

    await logActivity({
      bookingId,
      action: "email_sent",
      description: "Deposit confirmation email sent to client",
      actor: "admin",
      performedBy: admin?.name ?? admin?.email ?? "Admin",
      metadata: { emailSubject: emailContent.subject },
    });

    return NextResponse.json({
      success: true,
      message: `Email sent to ${booking.email}`,
      clientName,
      lastSentAt: now.toISOString(),
    });
  } catch (error: any) {
    console.error("[Send Deposit Email] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send deposit confirmation email",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
