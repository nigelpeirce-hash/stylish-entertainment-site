/**
 * Shared helper to send the deposit invoice email ("please pay").
 * Used by: confirm-from-quote (auto-send), admin send-deposit-invoice API.
 */

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import { depositInvoiceEmail } from "@/lib/email-templates";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import { buildMarkedPaidUrl } from "@/lib/deposit-paid-link";

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx") return null;
  return new Resend(apiKey);
};

function bankDetailsFromEnv(): {
  name: string;
  sortCode: string;
  accountNumber: string;
  iban?: string;
  swift?: string;
} | null {
  const name = process.env.DEPOSIT_INVOICE_BANK_NAME?.trim();
  const sortCode = process.env.DEPOSIT_INVOICE_SORT_CODE?.trim();
  const accountNumber = process.env.DEPOSIT_INVOICE_ACCOUNT_NUMBER?.trim();
  if (!name || !sortCode || !accountNumber) return null;
  const iban = process.env.DEPOSIT_INVOICE_IBAN?.trim() || undefined;
  const swift = process.env.DEPOSIT_INVOICE_SWIFT?.trim() || undefined;
  return { name, sortCode, accountNumber, iban, swift };
}

export interface SendDepositInvoiceResult {
  success: boolean;
  error?: string;
  lastSentAt?: string;
}

/** Overrides for deposit amount and/or reference when sending (admin review step). */
export interface SendDepositInvoiceOverrides {
  amount?: number | null;
  reference?: string;
}

/** Draft data for admin to review before sending. Does not send. */
export interface DepositInvoiceDraft {
  clientName: string;
  recipient: string;
  eventDate: string;
  venueName: string | null;
  eventType: string | null;
  amount: number | null;
  reference: string;
  subject: string;
  html: string;
  text: string;
}

/** Parse bookingFee string (e.g. "£150", "150") to number for deposit amount. */
function parseBookingFee(s: string | null | undefined): number | null {
  if (s == null || typeof s !== "string") return null;
  const cleaned = s.replace(/[£,\s]/g, "");
  const n = parseFloat(cleaned);
  return Number.isNaN(n) || n < 0 ? null : n;
}

async function getBookingAndPayload(bookingId: string, overrides?: SendDepositInvoiceOverrides) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      name: true,
      email: true,
      eventDate: true,
      eventType: true,
      venueName: true,
      bookingReference: true,
      bookingFee: true,
      staffAssignments: {
        where: { status: "confirmed" },
        select: { agreedFee: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!booking) return { booking: null, payload: null, emailContent: null };
  if (!booking.email) return { booking, payload: null, emailContent: null };

  const clientName = deduplicateName(getDisplayName(booking.name) || booking.name) || "there";
  const staffFee =
    booking.staffAssignments[0] != null && typeof booking.staffAssignments[0].agreedFee === "number"
      ? Number(booking.staffAssignments[0].agreedFee)
      : null;
  const defaultAmount = parseBookingFee(booking.bookingFee) ?? staffFee;
  const defaultReference =
    booking.bookingReference?.trim() ||
    `SE-${bookingId.slice(-8)}`;

  const amount = overrides?.amount !== undefined ? overrides.amount : defaultAmount;
  const reference = (overrides?.reference?.trim() || defaultReference).trim();
  const bankDetails = bankDetailsFromEnv();

  const payload = {
    booking: {
      name: booking.name,
      eventDate: booking.eventDate,
      eventType: booking.eventType ?? undefined,
      venueName: booking.venueName ?? undefined,
      clientName,
    },
    amount,
    reference,
    bankDetails: bankDetails ?? undefined,
    markedPaidUrl: buildMarkedPaidUrl(booking.id),
  };

  const emailContent = depositInvoiceEmail(payload);
  const eventDateStr = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";

  return {
    booking,
    payload,
    emailContent,
    clientName,
    eventDateStr,
    venueName: booking.venueName,
    eventType: booking.eventType,
  };
}

/**
 * Get draft deposit invoice for admin review (no send).
 * Use before showing modal so admin can check fees and optionally override amount.
 */
export async function getDepositInvoiceDraft(bookingId: string): Promise<DepositInvoiceDraft | null> {
  const result = await getBookingAndPayload(bookingId);
  if (!result?.booking?.email || !result.emailContent || !result.payload) return null;

  return {
    clientName: result.clientName,
    recipient: result.booking.email,
    eventDate: result.eventDateStr,
    venueName: result.venueName,
    eventType: result.eventType,
    amount: result.payload.amount,
    reference: result.payload.reference,
    subject: result.emailContent.subject,
    html: result.emailContent.html,
    text: result.emailContent.text,
  };
}

export async function sendDepositInvoiceForBooking(
  bookingId: string,
  overrides?: SendDepositInvoiceOverrides
): Promise<SendDepositInvoiceResult> {
  const result = await getBookingAndPayload(bookingId, overrides);
  if (!result?.booking) return { success: false, error: "Booking not found" };
  if (!result.booking.email) return { success: false, error: "Booking has no email address" };
  if (!result.payload || !result.emailContent) return { success: false, error: "Could not build invoice" };

  const resend = getResend();
  if (!resend) {
    console.error("[send-deposit-invoice] Resend not configured");
    return { success: false, error: "Resend API key not configured" };
  }

  const config = getResendConfig("booking");
  const sendResult = await resend.emails.send({
    from: config.from,
    to: result.booking.email,
    replyTo: config.replyTo,
    subject: result.emailContent.subject,
    html: result.emailContent.html,
    text: result.emailContent.text,
  });

  if (sendResult.error) {
    console.error("[send-deposit-invoice] Resend error:", sendResult.error);
    return { success: false, error: sendResult.error.message };
  }

  const now = new Date();
  const updateData: { depositInvoiceSentAt: Date; lastEmailSentAt: Date; updatedAt: Date; bookingFee?: string } = {
    depositInvoiceSentAt: now,
    lastEmailSentAt: now,
    updatedAt: now,
  };
  if (result.payload.amount != null && result.payload.amount > 0) {
    updateData.bookingFee = `£${result.payload.amount.toLocaleString("en-GB")}`;
  }
  await prisma.booking.update({
    where: { id: bookingId },
    data: updateData,
  });

  return { success: true, lastSentAt: now.toISOString() };
}
