/**
 * Canonical internal page paths for the STYLISH Entertainment client portal.
 * Site uses trailingSlash: true — page links and email URLs should use these helpers
 * so paths end with / before query strings (e.g. /client/bookings/id/?token=...).
 */

/** Ensure a page pathname has a trailing slash; preserve ?query and #hash. */
export function withTrailingSlash(path: string): string {
  if (!path || path === "/") return "/";

  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const beforeHash = hashIdx >= 0 ? path.slice(0, hashIdx) : path;

  const queryIdx = beforeHash.indexOf("?");
  const query = queryIdx >= 0 ? beforeHash.slice(queryIdx) : "";
  const pathname = queryIdx >= 0 ? beforeHash.slice(0, queryIdx) : beforeHash;

  const normalized =
    pathname.endsWith("/") ? pathname : `${pathname}/`;

  return `${normalized}${query}${hash}`;
}

/** Join base origin (no trailing slash) with a path that may include query/hash. */
export function joinBaseUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? withTrailingSlash(path) : withTrailingSlash(`/${path}`);
  return `${base}${normalizedPath}`;
}

export function clientDashboardPath(): string {
  return "/client/dashboard/";
}

export function clientProfilePath(): string {
  return "/client/profile/";
}

export function clientMessagesPath(): string {
  return "/client/messages/";
}

export function clientMessageThreadPath(threadId: string): string {
  return `/client/messages/${threadId}/`;
}

export function clientBookingsNewPath(): string {
  return "/client/bookings/new/";
}

export function clientBookingPath(bookingId: string): string {
  return `/client/bookings/${bookingId}/`;
}

export function clientAccountDeletedPath(): string {
  return "/client/account-deleted/";
}

export function clientDepositPaidThankYouPath(query?: string): string {
  const base = "/client/deposit-paid-thank-you/";
  return query ? `${base}?${query.replace(/^\?/, "")}` : base;
}

export function loginPath(query?: string): string {
  const base = "/login/";
  return query ? `${base}?${query.replace(/^\?/, "")}` : base;
}

export function forgotPasswordPath(): string {
  return "/forgot-password/";
}

export function registerPath(): string {
  return "/register/";
}

export function resetPasswordWorkaroundPath(): string {
  return "/reset-password-workaround/";
}

export function guestRequestPath(token: string): string {
  return `/requests/${token}/`;
}

/**
 * Magic-link portal URL — token query follows the trailing slash on the booking path.
 * Example: https://stylishentertainment.co.uk/client/bookings/abc/?token=...
 */
export function clientBookingMagicUrl(
  baseUrl: string,
  bookingId: string,
  token: string
): string {
  const path = `${clientBookingPath(bookingId)}?token=${encodeURIComponent(token)}`;
  return joinBaseUrl(baseUrl, path);
}

/**
 * Login URL with callbackUrl to the client's booking portal (post sign-in redirect).
 */
export function clientPortalLoginUrl(baseUrl: string, bookingId: string): string {
  const callback = encodeURIComponent(clientBookingPath(bookingId));
  return joinBaseUrl(baseUrl, `/login/?callbackUrl=${callback}`);
}

/** Login URL with callbackUrl to the client dashboard. */
export function clientDashboardLoginUrl(baseUrl: string): string {
  const callback = encodeURIComponent(clientDashboardPath());
  return joinBaseUrl(baseUrl, `/login/?callbackUrl=${callback}`);
}
