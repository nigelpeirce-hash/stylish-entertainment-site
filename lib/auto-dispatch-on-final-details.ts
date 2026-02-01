/**
 * Auto-dispatch: when client confirms final details, send the full artist worksheet
 * to assigned staff who have status "held" (assigned but not yet received full brief).
 *
 * Controlled by AUTO_DISPATCH_ON_FINAL_DETAILS env (default: true).
 * Set to "false" to disable and keep manual dispatch only.
 */

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";
import {
  ensureBookingReference,
  getThreadingHeaders,
  generateThreadIdFooter,
} from "@/lib/booking-integrity";
import { generateBriefToken } from "@/lib/brief-token";
import { buildDispatchEmailHtml, type DispatchFinalDetails } from "@/lib/dispatch-email";
import { notifyAdminSignificantEvent } from "@/lib/admin-notifications";

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");
  return new Resend(apiKey);
};

/** Build fd (final details) from booking - same shape as ArtistDispatch editableDetails */
function buildFdFromBooking(booking: any): DispatchFinalDetails {
  const phone =
    booking.phoneAreaCode && booking.phoneNumber
      ? `${booking.phoneAreaCode} ${booking.phoneNumber}`.trim()
      : "";
  const venuePhone =
    booking.venuePhoneAreaCode && booking.venuePhoneNumber
      ? `${booking.venuePhoneAreaCode} ${booking.venuePhoneNumber}`.trim()
      : "";
  return {
    clientName: booking.name,
    clientEmail: booking.email,
    clientPhone: phone || undefined,
    eventType: booking.eventType ?? undefined,
    numberOfGuests: booking.numberOfGuests ?? undefined,
    venueName: booking.venueName ?? undefined,
    venueAddress: booking.venueAddress ?? undefined,
    venueAddress2: booking.venueAddress2 ?? undefined,
    venueTown: booking.venueTown ?? undefined,
    venueCounty: booking.venueCounty ?? undefined,
    venuePostcode: booking.venuePostcode ?? undefined,
    venueContact: booking.venueContact ?? undefined,
    venuePhone: venuePhone || undefined,
    djArrivalTime: booking.djArrivalTime ?? undefined,
    djStartTime: booking.djStartTime ?? undefined,
    djFinishTime: booking.djFinishTime ?? undefined,
    djSetupLocation: booking.djSetupLocation ?? undefined,
    djParking: booking.djParking ?? undefined,
    soundLimiter:
      booking.soundLimiter === true
        ? "Yes"
        : booking.soundLimiter === false
          ? "No"
          : undefined,
    venueIsPrivateHouse: booking.venueIsPrivateHouse ?? undefined,
    venueWhat3Words: booking.venueWhat3Words ?? undefined,
    venueLoadInNotes: booking.venueLoadInNotes ?? undefined,
    firstDance: booking.firstDance ?? undefined,
    lastSong: booking.lastSong ?? undefined,
    musicRequests: booking.musicRequests ?? undefined,
    musicDislikes: booking.musicDislikes ?? undefined,
    musicNotesToDJ: booking.musicNotesToDJ ?? undefined,
    musicFileUrl: booking.musicFileUrl ?? undefined,
  };
}

export interface AutoDispatchResult {
  sent: number;
  recipients: string[];
  skipped: string;
}

/**
 * Try to auto-dispatch full brief to assigned staff (status "held").
 * Does nothing if AUTO_DISPATCH_ON_FINAL_DETAILS is false or no eligible staff.
 */
export async function tryAutoDispatch(bookingId: string): Promise<AutoDispatchResult> {
  const enabled = process.env.AUTO_DISPATCH_ON_FINAL_DETAILS !== "false";
  if (!enabled) {
    return { sent: 0, recipients: [], skipped: "AUTO_DISPATCH_ON_FINAL_DETAILS=false" };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      staffAssignments: {
        where: { status: "held" },
        include: { staff: true },
      },
      warehouseItems: {
        include: { WarehouseItem: true },
        orderBy: [
          { WarehouseItem: { category: "asc" as const } },
          { WarehouseItem: { name: "asc" as const } },
        ],
      },
      guestRequests: {
        where: { status: { in: ["pending", "approved", "moved_to_official"] } },
        orderBy: { createdAt: "desc" as const },
      },
    },
  });

  if (!booking) {
    return { sent: 0, recipients: [], skipped: "Booking not found" };
  }

  const heldAssignments = booking.staffAssignments.filter(
    (a) => a.status === "held" && a.staff?.email
  );
  if (heldAssignments.length === 0) {
    return { sent: 0, recipients: [], skipped: "No staff with status 'held' and email" };
  }

  const eventDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not set";

  const fd = buildFdFromBooking(booking);
  const emailConfig = getResendConfig("dj_worksheet");
  const bookingReference = await ensureBookingReference(bookingId);
  const threadingHeaders = bookingReference ? getThreadingHeaders(bookingReference) : {};
  const subject = `Artist Worksheet - ${booking.eventType} at ${fd.venueName || booking.venueName} - ${eventDate}`;
  const resend = getResend();
  const recipients: string[] = [];

  for (const assignment of heldAssignments) {
    const recipientEmail = assignment.staff?.email;
    if (!recipientEmail) continue;

    const briefToken = generateBriefToken();
    await prisma.bookingStaffAssignment.update({
      where: { id: assignment.id },
      data: {
        briefToken,
        status: "dispatched",
        briefStatus: "pending",
        confirmationEmailSent: true,
        confirmationSentAt: new Date(),
      },
    });

    const htmlContent = buildDispatchEmailHtml({
      booking: booking as any,
      fd,
      eventDate,
      staffAssignment: assignment,
      briefToken,
    });
    const finalHtml = bookingReference
      ? htmlContent + generateThreadIdFooter(bookingReference)
      : htmlContent;

    await resend.emails.send({
      from: emailConfig.from,
      replyTo: emailConfig.replyTo,
      to: [recipientEmail],
      bcc: [EMAIL_CONFIG.OFFICE_EMAIL],
      subject,
      html: finalHtml,
      headers: threadingHeaders,
    });

    recipients.push(`${assignment.staff?.name} <${recipientEmail}>`);
  }

  const currentEmailsSent = (booking.emailsSent as Record<string, unknown>) || {};
  const staffIds = heldAssignments.map((a) => a.id);
  const updatedEmailsSent = {
    ...currentEmailsSent,
    autoDispatch: {
      at: new Date().toISOString(),
      trigger: "final_details_confirmed",
      recipients,
      staffAssignmentIds: staffIds,
    },
  };

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      emailsSent: updatedEmailsSent,
      lastEmailSentAt: new Date(),
    },
  });

  try {
    await notifyAdminSignificantEvent({
      type: "dispatched",
      bookingId,
      title: "Auto-dispatched",
      description: `Final details confirmed – brief sent to ${recipients.length} staff: ${recipients.join(", ")}`,
      bookingName: booking.name ?? undefined,
      venueName: booking.venueName ?? undefined,
      eventDate: eventDate !== "Date not set" ? eventDate : undefined,
    });
  } catch (e) {
    console.warn("[auto-dispatch] notifyAdminSignificantEvent failed:", e);
  }

  return {
    sent: recipients.length,
    recipients,
    skipped: "",
  };
}
