/**
 * Shared helper to send the deposit invoice email ("please pay").
 * Used by: confirm-from-quote (auto-send), admin send-deposit-invoice API.
 */

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getResendConfig } from "@/lib/email-config";
import { depositInvoiceEmail } from "@/lib/email-templates";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";

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

export async function sendDepositInvoiceForBooking(bookingId: string): Promise<SendDepositInvoiceResult> {
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
      staffAssignments: {
        where: { status: "confirmed" },
        select: { agreedFee: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!booking) return { success: false, error: "Booking not found" };
  if (!booking.email) return { success: false, error: "Booking has no email address" };

  const clientName = deduplicateName(getDisplayName(booking.name) || booking.name) || "there";
  const amount =
    booking.staffAssignments[0] != null && typeof booking.staffAssignments[0].agreedFee === "number"
      ? Number(booking.staffAssignments[0].agreedFee)
      : null;
  const reference =
    booking.bookingReference?.trim() ||
    `SE-${bookingId.slice(-8)}`;
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
  };

  const emailContent = depositInvoiceEmail(payload);
  const resend = getResend();
  if (!resend) {
    console.error("[send-deposit-invoice] Resend not configured");
    return { success: false, error: "Resend API key not configured" };
  }

  const config = getResendConfig("booking");
  const result = await resend.emails.send({
    from: config.from,
    to: booking.email,
    replyTo: config.replyTo,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  if (result.error) {
    console.error("[send-deposit-invoice] Resend error:", result.error);
    return { success: false, error: result.error.message };
  }

  const now = new Date();
  await prisma.booking.update({
    where: { id: bookingId },
    data: { depositInvoiceSentAt: now, lastEmailSentAt: now, updatedAt: now },
  });

  return { success: true, lastSentAt: now.toISOString() };
}
