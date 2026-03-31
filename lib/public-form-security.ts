import type { NextRequest } from "next/server";

/** In-memory per-instance limits (sufficient for casual abuse; not a substitute for WAF / edge rate limits). */
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const LIMIT_PER_WINDOW = 10;
const WINDOW_MS = 15 * 60 * 1000;

export type PublicFormRouteId = "dj-worksheet" | "babington-dj-final-details";

export function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

/**
 * Returns whether this IP may submit again. Call before consuming the request body when possible.
 */
export function checkPublicFormRateLimit(
  routeId: PublicFormRouteId,
  ip: string
): { ok: true } | { ok: false } {
  const key = `${routeId}:${ip}`;
  const now = Date.now();
  let rec = rateBuckets.get(key);
  if (!rec || now > rec.resetAt) {
    rec = { count: 1, resetAt: now + WINDOW_MS };
    rateBuckets.set(key, rec);
    return { ok: true };
  }
  if (rec.count >= LIMIT_PER_WINDOW) {
    return { ok: false };
  }
  rec.count += 1;
  return { ok: true };
}

/** Block header-injection via Reply-To (CRLF / NUL). */
export function isSafeReplyToEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  if (/[\r\n\0]/.test(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Strip control chars and newlines from user-derived subject fragments. */
export function sanitizeSubjectUserPart(s: string, maxLen = 180): string {
  return s.replace(/[\r\n\x00-\x1f\x7f]/g, " ").slice(0, maxLen).trim();
}

export function rejectIfTooLong(
  value: string,
  max: number,
  fieldLabel: string
): string | null {
  if (value.length > max) {
    return `${fieldLabel} is too long.`;
  }
  return null;
}

/** HTML5 time input (HH:MM or HH:MM:SS) or short free-text fallback. */
export function isReasonableTimeField(value: string, maxLen: number): boolean {
  if (!value || value.length > maxLen) return false;
  return /^\d{1,2}:\d{2}(:\d{2})?$/.test(value);
}
