import { randomBytes } from "crypto";

/**
 * Validates a portal token against a booking record.
 *
 * Returns true only when:
 * - token matches booking.portalToken exactly
 * - portalTokenExpiresAt is null (treated as valid — defensive fallback) OR is in the future
 *
 * When portalTokenExpiresAt is null the token is still accepted so that any
 * row that pre-dates this change (e.g. a test booking) does not get locked out.
 * All tokens generated after this change will carry an explicit expiry.
 */
export function isPortalTokenValid(
  booking: { portalToken: string | null; portalTokenExpiresAt: Date | null },
  token: string
): boolean {
  if (!booking.portalToken || booking.portalToken !== token) return false;
  if (booking.portalTokenExpiresAt && booking.portalTokenExpiresAt < new Date()) return false;
  return true;
}

/** Generates a new random 32-byte hex portal token. */
export function generatePortalToken(): string {
  return randomBytes(32).toString("hex");
}

/** Returns a Date exactly 12 months from now to use as portal token expiry. */
export function newPortalTokenExpiry(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d;
}
