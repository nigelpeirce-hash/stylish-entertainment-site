/**
 * Builds the URL clients should use to access their portal from emails.
 * Sends them to the login page with a callback so after signing in they land on their booking.
 */
import { clientPortalLoginUrl } from "@/lib/portal-paths";

/** @deprecated Prefer clientPortalLoginUrl from @/lib/portal-paths */
export function getClientPortalLoginUrl(baseUrl: string, bookingId: string): string {
  return clientPortalLoginUrl(baseUrl, bookingId);
}
