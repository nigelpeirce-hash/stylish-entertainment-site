# Email CTA Audit

All client-facing email links use a production-safe base URL via `getEmailBaseUrl()` (from `lib/get-base-url.ts`). In production, when env vars are unset, this defaults to `https://stylishentertainment.co.uk` so links never point to localhost.

Portal links that require login use `getClientPortalLoginUrl(baseUrl, bookingId)`, which sends the client to `/login?callbackUrl=/client/bookings/{id}` so after sign-in they land on their booking.

---

## Deposit confirmed (Wedding / Event)

| CTA | Purpose | URL / behaviour |
|-----|--------|------------------|
| **Access your portal** / **View Your Countdown** | Open client portal for this booking | `getClientPortalLoginUrl(baseUrl, booking.id)` → `/login?callbackUrl=/client/bookings/{id}`. After login, user is redirected to their booking portal. |
| **I've paid** (booking-confirmation journey) | Mark deposit as paid | Signed link: `/api/client/bookings/{id}/marked-deposit-paid?sig=...`. Validates HMAC and redirects to thank-you page. |

**Sources:** `send-deposit-email`, `send-test-email`, `flexible-update` (when deposit marked received), `lib/email-templates.ts` (DEPOSIT_CONFIRMED, depositEmailWeddingCelebration, depositEmailEventConfirmed). All use `getEmailBaseUrl()` and `getClientPortalLoginUrl()` for the portal CTA.

---

## Portal invite / Send portal link

| CTA | Purpose | URL / behaviour |
|-----|--------|------------------|
| **View Your Countdown** | Open client portal | Same as above: `getClientPortalLoginUrl(baseUrl, booking.id)`. |

**Sources:** `app/api/admin/bookings/[id]/send-portal-link/route.ts`, `lib/actions/booking-actions.ts` (sendPortalInvite). Both use `getEmailBaseUrl()` and `getClientPortalLoginUrl()`.

---

## Finalize & invite (magic link)

| CTA | Purpose | URL / behaviour |
|-----|--------|------------------|
| **Step Into Your Portal** / **View Your Countdown** | One-click portal access (no login) | Magic link: `/client/bookings/{id}?token=...`. Middleware validates token and grants access. |

**Sources:** `app/api/admin/bookings/[id]/finalize-and-invite/route.ts`, `app/api/cron/email-journey/route.ts` (portal reminder). Base URL from `getEmailBaseUrl()`.

---

## Email journey (send-email API + cron)

| CTA | Template / stage | URL / behaviour |
|-----|------------------|------------------|
| **Update Your Music Preferences** | booking-confirmation | `clientAdminUrl` → `getClientPortalLoginUrl(baseUrl, booking.id)`. |
| **I've paid** | booking-confirmation | `markedPaidUrl` → signed `/api/client/bookings/{id}/marked-deposit-paid?sig=...`. |
| **CLICK TO ACCESS PORTAL NOW (No Login Required)** | final-chase | `portalMagicUrl` → `/client/bookings/{id}?token=...`. |
| **Get in Touch** | 3-day reminder | Hardcoded `https://stylishentertainment.co.uk/contact-us`. |
| **Leave a Google Review** / **Share on Instagram** | post-wedding-magic | Hardcoded review/social URLs. |
| **Download Brochure** | enquiry-autoresponder | `brochureUrl` from venue assets or general brochure. |

**Sources:** `app/api/send-email/route.ts` (clientAdminUrl, markedPaidUrl, brochureUrl), `app/api/cron/email-journey/route.ts` (clientAdminUrl, portalMagicUrl, portalUrl for reminder). All portal links that are not magic-link now use `getClientPortalLoginUrl(baseUrl, booking.id)` or `getEmailBaseUrl()` for base.

---

## DJ / Artist quote emails

| CTA | Purpose | URL / behaviour |
|-----|--------|------------------|
| **Book Your DJ** / **Book Your DJ & Musician** | Pre-fill booking form from quote | `{baseUrl}/book-dj?quote={signedToken}`. `/book-dj` reads token and pre-fills from quote. |

**Sources:** `app/api/admin/send-dj-inquiry-reply/route.ts`, `app/api/admin/send-artist-quote/route.ts`. Both use `getEmailBaseUrl()` for base.

---

## Other links in emails

- **Footer:** Contact (tel, mailto, website), social (Facebook, Instagram, YouTube) — from `lib/email-signature.ts`; static/hardcoded.
- **Monday brief (internal):** "View Booking" / "View Messages" → `{baseUrl}/admin/bookings/{id}` (admin-only).
- **Terms & Conditions:** `{{tc_link}}` placeholder when used; set by caller.

---

## Summary

- **Portal (login required):** Always `getClientPortalLoginUrl(baseUrl, bookingId)` so the link is `/login?callbackUrl=/client/bookings/{id}`.
- **Portal (magic link):** `/client/bookings/{id}?token=...` with base from `getEmailBaseUrl()`.
- **I've paid:** Signed API link; base from `getEmailBaseUrl()`.
- **Book DJ / quote:** `getEmailBaseUrl()/book-dj?quote=...`.
- **Base URL:** All client-facing email links use `getEmailBaseUrl()` so production never gets localhost.
