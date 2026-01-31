/**
 * Shared helper for the signed "I've paid" link used in:
 * - Booking confirmation email (send-email API)
 * - Deposit invoice email (send-deposit-invoice)
 * Client clicks link → marked-deposit-paid API sets depositPaidClickedAt → admin sees "client reported paid" until manual confirmation.
 */

import { createHmac } from "crypto";
import { getEmailBaseUrl } from "@/lib/get-base-url";

export function buildMarkedPaidUrl(bookingId: string): string {
  const baseUrl = getEmailBaseUrl();
  const secret = process.env.DEPOSIT_PAID_LINK_SECRET || process.env.NEXTAUTH_SECRET || "deposit-paid-fallback";
  const sig = createHmac("sha256", secret).update(bookingId).digest("hex");
  return `${baseUrl}/api/client/bookings/${bookingId}/marked-deposit-paid?sig=${encodeURIComponent(sig)}`;
}
