# Email CTA Audit

**Last reviewed:** 30 July 2026
**Scope:** Current email templates and send routes after removing client-portal references.

Client-facing emails no longer mention or link to the client portal, dashboard, login or sign-in. Dedicated portal invitation/reminder emails and their send route have been removed.

---

## Deposit and booking confirmation

| Email | CTA / behaviour |
|-------|-----------------|
| Deposit confirmed (wedding/event) | No CTA. The email says the worksheet will follow and asks the client to reply with questions. |
| Booking-confirmation journey | **I've paid** → signed `/api/client/bookings/{id}/marked-deposit-paid?sig=...`; validates the signature and records the payment notification. |
| Deposit invoice | **I've paid** → signed payment-notification URL supplied as `markedPaidUrl`. |

**Sources:** `lib/email-templates.ts`, `lib/email-journey-templates.ts`, `app/api/admin/bookings/[id]/send-deposit-email/route.ts`, `app/api/admin/bookings/[id]/flexible-update/route.ts`, `app/api/send-email/route.ts`.

---

## Four-week check-in

| CTA | Purpose | URL / behaviour |
|-----|---------|-----------------|
| **Complete Your Worksheet** | Collect final music and event details | `worksheetUrlFor(baseUrl, eventType)` chooses `/dj-worksheet/` for weddings and `/party-dj-worksheet/` for other events. |

The public worksheet pages are intentionally direct-link forms and are marked `noindex`.

**Sources:** `lib/worksheet-url.ts`, `lib/email-journey-templates.ts`, `app/api/cron/email-journey/route.ts`, `app/api/send-email/route.ts`.

---

## Other email-journey CTAs

| CTA | Template / stage | URL / behaviour |
|-----|------------------|-----------------|
| **Get in Touch** | Gentle reminder | `https://stylishentertainment.co.uk/contact-us/`. |
| **Leave a Google Review** | Post-event follow-up | `NEXT_PUBLIC_GOOGLE_REVIEW_URL` when configured. |
| **Share on Instagram** | Post-event follow-up | `https://www.instagram.com/stylishentertainment/`. |

The enquiry autoresponder and week-of email currently contain no primary CTA.

---

## DJ / artist quote emails

| CTA | Purpose | URL / behaviour |
|-----|---------|-----------------|
| **Book Your DJ** / **Book Your DJ & Musician** | Pre-fill the booking form from a quote | `{baseUrl}/book-dj?quote={signedToken}`. |

**Sources:** `app/api/admin/send-dj-inquiry-reply/route.ts`, `app/api/admin/send-artist-quote/route.ts`.

---

## Internal and shared links

- **Email signature:** Contact and social links come from `lib/email-signature.ts`.
- **Monday brief (internal):** “View Booking” / “View Messages” point to admin-only booking pages.
- **Terms & Conditions:** `{{tc_link}}` is supplied by the caller where used.
- **Production base URL:** Dynamic links use `getEmailBaseUrl()` so production emails do not point to localhost.

---

## Removed portal email paths

- `PORTAL_INVITATION` and `PORTAL_REMINDER` were removed from `lib/email/templates.ts`.
- `app/api/admin/bookings/[id]/send-portal-link/route.ts` was deleted.
- Portal-reminder processing was removed from `app/api/cron/email-journey/route.ts`.
- Booking creation no longer accepts `sendPortalInvite` or sends a portal email.
- `finalize-and-invite` now confirms the booking and refreshes its token without emailing the client.
