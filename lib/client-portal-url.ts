/**
 * Builds the URL clients should use to access their portal from emails.
 * Sends them to the login page with a callback so after signing in they land on their booking.
 */
export function getClientPortalLoginUrl(baseUrl: string, bookingId: string): string {
  const path = `/client/bookings/${bookingId}`;
  const callbackUrl = encodeURIComponent(path);
  return `${baseUrl.replace(/\/$/, "")}/login?callbackUrl=${callbackUrl}`;
}
