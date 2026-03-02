import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { verifyQuoteToken } from "@/lib/quote-token";
import {
  getStaffPushKeys,
  sendPushoverNotification,
} from "@/lib/pushover-notifications";
import { logActivity } from "@/lib/activity-log";
import { sendDepositInvoiceForBooking } from "@/lib/send-deposit-invoice";
import { staffConfirmationEmail } from "@/lib/email-staff-confirmation";
import { getResendConfig } from "@/lib/email-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/bookings/confirm-from-quote
 * Client confirms quote from Book-from-Quote page. Updates booking, optional staff assignment, terms.
 * Public – auth via token in body.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      token,
      name,
      email,
      phone,
      clientAddress,
      clientAddress2,
      clientTown,
      clientCounty,
      clientPostcode,
      eventType,
      eventDate,
      eventStartTime,
      eventEndTime,
      venueName,
      venueAddress,
      venueAddress2,
      venueTown,
      venueCounty,
      venuePostcode,
      selectedStaffId,
      termsAccepted,
      fee,
    } = body;

    if (!token || !name || !email || !eventType || !eventDate || !venueName) {
      return NextResponse.json(
        { error: "Missing required fields: token, name, email, eventType, eventDate, venueName" },
        { status: 400 }
      );
    }
    if (termsAccepted !== true) {
      return NextResponse.json(
        { error: "You must accept the Terms & Conditions to confirm." },
        { status: 400 }
      );
    }

    const payload = verifyQuoteToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired link. Please contact us or request a new quote." },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: payload.bookingId },
      select: {
        id: true,
        email: true,
        archivedAt: true,
        status: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    if (booking.archivedAt) {
      return NextResponse.json(
        { error: "This booking is no longer active." },
        { status: 410 }
      );
    }
    if (booking.email.toLowerCase() !== payload.clientEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "This link was sent to a different email address." },
        { status: 403 }
      );
    }

    const staffId = selectedStaffId ?? payload.staffId ?? null;
    const agreedFee = typeof fee === "number" ? fee : payload.fee ?? 0;
    const role = payload.artistType === "dj" ? "DJ" : "Musician";
    const eventDateObj = new Date(eventDate);

    function parsePhone(val: unknown): { phoneAreaCode: string | null; phoneNumber: string | null } {
      const s = val != null ? String(val).trim() : "";
      if (!s) return { phoneAreaCode: null, phoneNumber: null };
      const cleaned = s.replace(/\D/g, "");
      if (/^0?7\d{9}$/.test(cleaned)) {
        const d = cleaned.replace(/^0/, "");
        return { phoneAreaCode: d.slice(0, 4), phoneNumber: d.slice(4) || null };
      }
      if (/^0?1\d{8,9}$/.test(cleaned) || /^0?2\d{9}$/.test(cleaned)) {
        const d = cleaned.replace(/^0/, "");
        return { phoneAreaCode: d.slice(0, 3), phoneNumber: d.slice(3) || null };
      }
      return { phoneAreaCode: null, phoneNumber: cleaned };
    }
    const { phoneAreaCode, phoneNumber } = parsePhone(phone);

    const trim = (v: unknown) => (v != null ? String(v).trim() || null : null);
    const updateData: Record<string, unknown> = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phoneAreaCode: phoneAreaCode ?? null,
      phoneNumber: phoneNumber ?? null,
      eventType: String(eventType).trim(),
      eventDate: eventDateObj,
      venueName: String(venueName).trim(),
      venueAddress: trim(venueAddress),
      venueAddress2: trim(venueAddress2),
      venueTown: trim(venueTown),
      venueCounty: trim(venueCounty),
      venuePostcode: trim(venuePostcode),
      djStartTime: trim(eventStartTime),
      djFinishTime: trim(eventEndTime),
      termsAccepted: true,
      termsAcceptedAt: new Date(),
      termsAcceptedByUserId: null,
      confirmedViaBookFromQuote: true,
      status: booking.status === "pending" ? "confirmed" : undefined,
      updatedAt: new Date(),
    };
    if (clientAddress != null) updateData.clientAddress = String(clientAddress).trim() || null;
    if (clientAddress2 != null) updateData.clientAddress2 = String(clientAddress2).trim() || null;
    if (clientTown != null) updateData.clientTown = String(clientTown).trim() || null;
    if (clientCounty != null) updateData.clientCounty = String(clientCounty).trim() || null;
    if (clientPostcode != null) updateData.clientPostcode = String(clientPostcode).trim() || null;

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: payload.bookingId },
        data: updateData as Parameters<typeof tx.booking.update>[0]["data"],
      });

      if (staffId) {
        const staff = await tx.freelanceCrew.findUnique({
          where: { id: staffId },
          select: { id: true },
        });
        if (staff) {
          const existing = await tx.bookingStaffAssignment.findFirst({
            where: { bookingId: payload.bookingId, staffId },
          });
          if (existing) {
            await tx.bookingStaffAssignment.update({
              where: { id: existing.id },
              data: {
                role,
                agreedFee: Number(agreedFee),
                status: "confirmed",
                updatedAt: new Date(),
              },
            });
          } else {
            await tx.bookingStaffAssignment.create({
              data: {
                bookingId: payload.bookingId,
                staffId,
                role,
                agreedFee: Number(agreedFee),
                status: "confirmed",
              },
            });
          }
        }
      }
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stylishentertainment.co.uk";
    const bookingUrl = `${siteUrl}/admin/bookings/${payload.bookingId}`;
    const formattedDate = eventDateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const title = "✓ Quote confirmed";
    const message = `${name} confirmed for ${formattedDate} at ${venueName}.`;

    try {
      const { ali, nigel } = await getStaffPushKeys();
      const notifications: Promise<unknown>[] = [];
      if (ali) {
        notifications.push(
          sendPushoverNotification({
            title,
            message,
            userKey: ali,
            priority: 1,
            url: bookingUrl,
            urlTitle: "View booking",
          })
        );
      }
      if (nigel) {
        notifications.push(
          sendPushoverNotification({
            title,
            message,
            userKey: nigel,
            priority: 1,
            url: bookingUrl,
            urlTitle: "View booking",
          })
        );
      }
      await Promise.allSettled(notifications);
    } catch (e) {
      console.error("[confirm-from-quote] Pushover error:", e);
    }

    try {
      await logActivity({
        bookingId: payload.bookingId,
        action: "quote_confirmed",
        description: `Client confirmed from quote – ${name} for ${formattedDate} at ${venueName}`,
        actor: "client",
        performedBy: name ?? undefined,
        metadata: { venueName, staffId: staffId ?? undefined },
      });
    } catch (e) {
      console.warn("[confirm-from-quote] logActivity failed:", e);
    }

    try {
      const inv = await sendDepositInvoiceForBooking(payload.bookingId);
      if (!inv.success) {
        console.error("[confirm-from-quote] Deposit invoice send failed:", inv.error);
      }
    } catch (e) {
      console.error("[confirm-from-quote] Deposit invoice error:", e);
    }

    // Send artist confirmation email if staff was assigned and has not been notified
    if (staffId) {
      try {
        const assignment = await prisma.bookingStaffAssignment.findFirst({
          where: { bookingId: payload.bookingId, staffId },
          include: { staff: true },
        });
        if (
          assignment &&
          assignment.staff?.email &&
          !assignment.confirmationEmailSent
        ) {
          const apiKey = process.env.RESEND_API_KEY;
          if (apiKey && apiKey !== "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
            const formattedDate = eventDateObj.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const emailData = staffConfirmationEmail({
              staffName: assignment.staff.name,
              eventDate: formattedDate,
              venueName: String(venueName).trim(),
              role,
              agreedFee: Number(agreedFee),
              senderName: "Ali",
            });
            const config = getResendConfig("general");
            const resend = new Resend(apiKey);
            await resend.emails.send({
              from: config.from,
              replyTo: config.replyTo,
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
                bookingId: payload.bookingId,
                platform: "email",
                direction: "outbound",
                email: assignment.staff.email,
                contactName: assignment.staff.name,
                message: `Job Confirmation email sent for ${role} at ${String(venueName).trim()}`,
              },
            });
          }
        }
      } catch (e) {
        console.error("[confirm-from-quote] Artist confirmation email error:", e);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: payload.bookingId,
      message: "Thanks, we've confirmed your booking.",
    });
  } catch (e) {
    console.error("[confirm-from-quote] error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us." },
      { status: 500 }
    );
  }
}
