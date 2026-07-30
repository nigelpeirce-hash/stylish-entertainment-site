# Email Library Audit & Standardization

**Original audit:** 28 January 2025
**Portal-email sections updated:** 30 July 2026
**Scope:** All email-sending code across `app/api/**`, `lib/email*`, `lib/send-*`, `lib/*-email*`, components

> The wider audit remains a point-in-time review from January 2025. Portal-related rows, gaps and recommendations below were refreshed after portal references were removed from all client-facing emails.

---

## 1. Audit Table

| Email Flow | Trigger | DB Fields Updated | Client Receives | Admin Notified | Logging | Content Format OK | Notes / Gaps | Source File |
|------------|---------|-------------------|-----------------|----------------|---------|-------------------|--------------|-------------|
| **Contact form – admin notification** | Public (contact form) | Booking created | — | ✅ Pushover (sendNewLeadNotification) | ❌ No AuditLog | ⚠️ Inline HTML; subject varies | Admin receives; no emailsSent/CommsLog | [app/api/contact/route.ts](app/api/contact/route.ts) |
| **Contact form – enquiry autoresponder** | Public | — | ✅ Thank you + brochure | — | ❌ No emailsSent | ✅ enquiryAutoresponder (venue, date) | Uses lib/email-journey-templates; no DB update for emailsSent | [app/api/contact/route.ts](app/api/contact/route.ts) |
| **Quote request – admin** | Public | NewEnquiry | — | ❌ None | ❌ | ⚠️ Simple inline HTML | Subject: `Quote request: Name @ Venue — Date`; no Pushover/AuditLog | [app/api/public/quote-request/route.ts](app/api/public/quote-request/route.ts) |
| **Hire enquiry – admin** | Public | NewEnquiry | — | ❌ None | ❌ | ⚠️ Simple inline HTML | Subject: `Hire quote request: Name @ Venue — Date`; no Pushover/AuditLog | [app/api/public/hire-enquiry/route.ts](app/api/public/hire-enquiry/route.ts) |
| **Inquiries/new – first touch** | Public (new enquiry flow) | firstTouchEmailSent, firstTouchEmailSentAt | ✅ Thank you | — | ❌ | ⚠️ Custom HTML, no SIGNATURE_BLOCK_HTML | Different flow from contact; no standard header/footer | [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts) |
| **Admin – send composed email (quote)** | Admin | feeBreakdown, emailsSent.composedEmails, lastEmailSentAt | ✅ Quote (venue, date, fee, DJ) | ✅ logActivity, notifyAdmin | ✅ emailsSent | ⚠️ Subject: `Your Quote - Venue on Date` (not standard) | HTML from admin; uses Resend directly | [app/api/admin/send-composed-email/route.ts](app/api/admin/send-composed-email/route.ts) |
| **Admin – send DJ inquiry reply** | Admin | quoteSentAt, preferredDJ, etc. | ✅ Quote with DJ details | ✅ notifyAdmin (quote_sent) | ✅ | ⚠️ LUXE_STYLES inline; subject varies | Uses custom template; no logActivity | [app/api/admin/send-dj-inquiry-reply/route.ts](app/api/admin/send-dj-inquiry-reply/route.ts) |
| **Admin – enquiries reply** | Admin | enquiryRepliedAt, enquiryRepliedByUserId (NewEnquiry) | ✅ Admin reply with custom intro | ⚠️ logActivity (booking only) | — | ✅ buildEnquiryReplyEmail (venue, date) | No notifyAdmin for NewEnquiry; subject: `Re: Your enquiry – Venue` | [app/api/admin/enquiries/[id]/reply/route.ts](app/api/admin/enquiries/[id]/reply/route.ts) |
| **Admin – send deposit email** | Admin | lastEmailSentAt | ✅ Deposit confirmed (wedding/event) | ✅ logActivity | — | ✅ depositEmailWeddingCelebration / depositEmailEventConfirmed | Uses lib/email-templates; event-type aware | [app/api/admin/bookings/[id]/send-deposit-email/route.ts](app/api/admin/bookings/[id]/send-deposit-email/route.ts) |
| **Admin – send first touch** | Admin | lastEmailSentAt | ✅ Thank you (venue, date) | ❌ No logActivity | — | ✅ FIRST_TOUCH from lib/email/templates | No logActivity, no notifyAdmin | [app/api/admin/bookings/[id]/send-first-touch/route.ts](app/api/admin/bookings/[id]/send-first-touch/route.ts) |
| **Admin – staff confirmation** | Admin | confirmationEmailSent, status=confirmed | Staff receives | ✅ notifyAdmin (artist_assigned) | ✅ CommsLog | ✅ staffConfirmationEmail | Staff (internal) email; subject: venue, date, role | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts) |
| **Admin – staff cancellation** | Admin | status=cancelled | Staff receives | ✅ logActivity | ✅ CommsLog | ✅ staffCancellationEmail | Staff (internal) email | [app/api/admin/bookings/staff/[id]/cancel/route.ts](app/api/admin/bookings/staff/[id]/cancel/route.ts) |
| **Admin – dispatch** | Admin | emailsSent.artistDispatch, lastEmailSentAt | Staff receives worksheet | ✅ notifyAdmin (dispatched) | ✅ emailsSent | ✅ Artist Worksheet format | Subject: `Artist Worksheet - EventType at Venue - Date` ✅ | [app/api/admin/bookings/[id]/dispatch/route.ts](app/api/admin/bookings/[id]/dispatch/route.ts) |
| **Admin – finalize booking** | Admin | status, portalToken, portalTokenExpiresAt | No email | — | ✅ logActivity (`booking_finalized`) | — | Legacy route name retained; confirms booking and refreshes token only | [app/api/admin/bookings/[id]/finalize-and-invite/route.ts](app/api/admin/bookings/[id]/finalize-and-invite/route.ts) |
| **Confirm from quote – deposit invoice** | Client (quote token) | depositInvoiceSentAt, lastEmailSentAt | ✅ Deposit invoice (bank details) | — | — | ✅ depositInvoiceEmail | Uses lib/send-deposit-invoice; no AuditLog | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts) (via sendDepositInvoiceForBooking) |
| **Confirm from quote – staff confirmation** | Client | confirmationEmailSent on assignment | Staff receives | — | ✅ CommsLog | ✅ staffConfirmationEmail | Same as admin staff confirm | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts) |
| **Final payment sent – artist notify** | Client | finalDetailsConfirmed | — | ✅ logActivity, notifyAdmin | — | ⚠️ Plain HTML, SIGNATURE_BLOCK_HTML | Artists receive; subject: `Final payment received – Name @ Venue` | [app/api/client/bookings/[id]/final-payment-sent/route.ts](app/api/client/bookings/[id]/final-payment-sent/route.ts) |
| **Confirm hire request – admin** | Client | — | — | ✅ logActivity | — | ⚠️ Simple inline HTML | Admin receives hire items; no notifyAdmin | [app/api/client/bookings/[id]/confirm-hire-request/route.ts](app/api/client/bookings/[id]/confirm-hire-request/route.ts) |
| **Portal message – admin** | Client | — | — | ✅ notifyAdmin (portal_message) | — | ⚠️ Custom HTML, hardcoded info@ | Admin receives; no standard template | [app/api/client/portal-message/route.ts](app/api/client/portal-message/route.ts) |
| **Cron – 3-day reminder** | Cron | emailsSent.threeDayReminder, lastEmailSentAt | ✅ Gentle reminder | — | ✅ emailsSent | ✅ gentle-reminder (venue, date) | Uses getJourneyEmail | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts) |
| **Cron – 4-week check-in** | Cron | emailsSent.fourWeekCheckin, lastEmailSentAt | ✅ 4-week check-in with public worksheet link | — | ✅ emailsSent | ✅ 4-week-checkin | Wedding → `/dj-worksheet/`; other events → `/party-dj-worksheet/` | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts) |
| **Cron – week-of excitement** | Cron | emailsSent.weekOfExcitement, lastEmailSentAt | ✅ Week-of email | — | ✅ emailsSent | ✅ week-of-excitement | Uses getJourneyEmail | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts) |
| **Cron – post-wedding magic** | Cron | emailsSent.postWeddingMagic, lastEmailSentAt | ✅ Post-event thank you | — | ✅ emailsSent | ✅ post-wedding-magic | Uses getJourneyEmail | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts) |
| **Auto-dispatch (final details)** | Lib (triggered by final details) | emailsSent.autoDispatch | Staff receives worksheet | — | ✅ emailsSent | ✅ Same as admin dispatch | Subject matches standard | [lib/auto-dispatch-on-final-details.ts](lib/auto-dispatch-on-final-details.ts) |
| **Admin notifications** | Various (logActivity, etc.) | — | — | Recipients receive | — | ⚠️ Generic `[Stylish] Title` | Internal admin emails | [lib/admin-notifications.ts](lib/admin-notifications.ts) |
| **Client login notification** | Auth (magic link) | — | ✅ Magic link | — | — | ⚠️ Custom | Login flow | [lib/client-login-notifications.ts](lib/client-login-notifications.ts) |
| **Send email (admin journey)** | Admin | — | Client receives | — | ❌ | ✅ getJourneyEmail | Manual send from admin; no emailsSent update | [app/api/send-email/route.ts](app/api/send-email/route.ts) |
| **Admin send artist quote** | Admin | — | Client receives | — | — | ⚠️ Custom | DJ-specific quote flow | [app/api/admin/send-artist-quote/route.ts](app/api/admin/send-artist-quote/route.ts) |
| **Admin send resource** | Admin | — | Recipient | — | — | ⚠️ Custom | Resource/attachment email | [app/api/admin/send-resource/route.ts](app/api/admin/send-resource/route.ts) |
| **Rescue extend retention** | Admin | — | Client | — | — | ⚠️ Custom | Lead rescue flow | [app/api/rescue/[id]/extend-retention/route.ts](app/api/rescue/[id]/extend-retention/route.ts) |
| **Contact update** | Admin/CRM | — | Client | — | — | ⚠️ Custom | Contact form update | [app/api/contact/update/route.ts](app/api/contact/update/route.ts) |
| **Send guest invites** | Admin | — | Guests | — | — | ⚠️ Batch send | [app/api/client/bookings/[id]/send-guest-invites/route.ts](app/api/client/bookings/[id]/send-guest-invites/route.ts) |
| **Flexible update** | Admin | — | Client (conditional) | — | — | ⚠️ | [app/api/admin/bookings/[id]/flexible-update/route.ts](app/api/admin/bookings/[id]/flexible-update/route.ts) |
| **User invite** | Admin | — | New user | — | — | ⚠️ Custom | [app/api/admin/users/invite/route.ts](app/api/admin/users/invite/route.ts) |

---

## 2. Standard Format Definition

**Recommended subject line pattern:** `<Event Type> - <Venue> - <Date>`

Examples:
- `Wedding - Babington House - Saturday 20 June 2026`
- `Private Party - The Tithe Barn - Friday 5 December 2025`

**Standard header/footer:**
- Logo: `https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png`
- Brand line: "Stylish Entertainment"
- Footer: `SIGNATURE_BLOCK_HTML` from [lib/email-signature.ts](lib/email-signature.ts)

**Required dynamic placeholders:** clientName, venueName, eventDate, eventType, fee (where relevant), talent (where relevant), worksheetUrl (for the 4-week check-in)

---

## 3. Deviations from Standard

### 3.1 Subject line inconsistencies

| Flow | Current Subject | Standard Should Be |
|------|-----------------|--------------------|
| Send composed email | `Your Quote - {Venue} on {Date}` | `{EventType} - {Venue} - {Date} – Your Quote` |
| Enquiry reply | `Re: Your enquiry – {Venue}` | OK (reply format) |
| Send first touch | `Thank you for your enquiry – {Venue} \| Stylish Entertainment Ltd` | OK |
| Deposit email | `Your Date is Secured: {Client} x Stylish Entertainment Ltd` | OK (deposit-specific) |
| Deposit invoice | `Deposit invoice: {Client} – Stylish Entertainment Ltd` | OK |
| Inquiries/new first touch | `Thank you for your enquiry - {Date}` | Add venue; use standard header/footer |

### 3.2 Missing standard header/footer

| Flow | Issue |
|------|-------|
| [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts) | Custom HTML, no SIGNATURE_BLOCK_HTML |
| [app/api/public/quote-request/route.ts](app/api/public/quote-request/route.ts) | Admin-facing; no need for client branding |
| [app/api/public/hire-enquiry/route.ts](app/api/public/hire-enquiry/route.ts) | Admin-facing |
| [app/api/client/bookings/[id]/confirm-hire-request/route.ts](app/api/client/bookings/[id]/confirm-hire-request/route.ts) | Admin-facing; simple HTML |
| [app/api/client/portal-message/route.ts](app/api/client/portal-message/route.ts) | Admin-facing; hardcoded recipient |
| [app/api/client/bookings/[id]/final-payment-sent/route.ts](app/api/client/bookings/[id]/final-payment-sent/route.ts) | Internal (artists); has SIGNATURE_BLOCK_HTML |

### 3.3 Missing admin notifications

| Flow | Missing |
|------|---------|
| Quote request (public) | Pushover, AuditLog |
| Hire enquiry (public) | Pushover, AuditLog |
| Send first touch | logActivity, notifyAdmin |
| Enquiries reply (NewEnquiry) | notifyAdmin (only booking gets logActivity) |
| Confirm hire request | notifyAdmin |

### 3.4 Missing or inconsistent logging

| Flow | Missing |
|------|---------|
| Contact form (both emails) | emailsSent / AuditLog for enquiry autoresponder |
| Send deposit email | emailsSent.depositConfirmation |
| Send first touch | logActivity |
| Send email (journey) | emailsSent update when bookingId provided |
| Confirm from quote (deposit invoice) | logActivity |

---

## 4. Suggested Standardization Edits

### 4.1 Create shared email wrapper

Create `lib/email/standard-client-email.ts`:

```ts
import { SIGNATURE_BLOCK_HTML } from "@/lib/email-signature";

const LOGO_URL = "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png";

export function wrapClientEmail(contentHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(180deg, #fdf8f0 0%, #f5f0e8 100%);">
  <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.25);">
    <div style="text-align: center; margin-bottom: 32px;">
      <img src="${LOGO_URL}" alt="STYLISH ENTERTAINMENT" style="max-width: 220px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto;" />
      <p style="font-size: 11px; color: #D4AF37; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; margin: 0;">Stylish Entertainment</p>
    </div>
    ${contentHtml}
    ${SIGNATURE_BLOCK_HTML}
  </div>
</body>
</html>
  `.trim();
}

export function standardSubject(eventType: string, venueName: string, dateStr: string, suffix?: string): string {
  const base = `${eventType || "Event"} - ${venueName || "Venue"} - ${dateStr}`;
  return suffix ? `${base} – ${suffix}` : base;
}
```

### 4.2 Apply to inquiries/new first touch

Replace inline HTML in [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts) with `FIRST_TOUCH` from `lib/email/templates.ts` (same as contact flow) or use `wrapClientEmail` + standard footer.

### 4.3 Add missing logActivity / notifyAdmin

- **Send first touch:** Add `logActivity({ action: "first_touch_sent", ... })` and optionally `notifyAdminSignificantEvent`.
- **Enquiries reply (NewEnquiry):** Add `notifyAdminSignificantEvent` for consistency.
- **Finalize booking:** Already logs `booking_finalized`; no client email is sent.
- **Confirm hire request:** Add `notifyAdminSignificantEvent` (type: `hire_request_confirmed`).
- **Quote request / Hire enquiry:** Add `sendNewLeadNotification` or equivalent admin notification.

### 4.4 Add emailsSent updates where missing

- **Send deposit email:** Add `emailsSent.depositConfirmation`.
- **Contact form autoresponder:** Consider storing in `emailsSent.enquiryAutoresponder` on the created booking (contact creates a booking).
- **Send first touch:** Add `emailsSent.firstTouch` or similar if not already in schema.

---

## 5. Source File Index

| File | Purpose |
|------|---------|
| [lib/email/send-email.ts](lib/email/send-email.ts) | Shared `sendEmail` – RESEND_DEFAULT_FROM |
| [lib/email.ts](lib/email.ts) | Re-exports sendEmail |
| [lib/email/templates.ts](lib/email/templates.ts) | FIRST_TOUCH |
| [lib/email/enquiry-reply-template.ts](lib/email/enquiry-reply-template.ts) | buildEnquiryReplyEmail (admin reply) |
| [lib/email-templates.ts](lib/email-templates.ts) | depositInvoiceEmail, depositEmailWeddingCelebration, depositEmailEventConfirmed, etc. |
| [lib/email-journey-templates.ts](lib/email-journey-templates.ts) | getJourneyEmail (enquiry-autoresponder, gentle-reminder, booking-confirmation, 4-week, week-of, post-wedding) |
| [lib/worksheet-url.ts](lib/worksheet-url.ts) | Selects the wedding or party worksheet URL for client emails |
| [lib/email-signature.ts](lib/email-signature.ts) | SIGNATURE_BLOCK_HTML, CLIENT_SIGNOFF_TEXT |
| [lib/email-config.ts](lib/email-config.ts) | getResendConfig (booking, general, dj_worksheet) |
| [lib/send-deposit-invoice.ts](lib/send-deposit-invoice.ts) | sendDepositInvoiceForBooking |
| [lib/email-staff-confirmation.ts](lib/email-staff-confirmation.ts) | staffConfirmationEmail |
| [lib/email-staff-cancellation.ts](lib/email-staff-cancellation.ts) | staffCancellationEmail |
| [lib/admin-notifications.ts](lib/admin-notifications.ts) | notifyAdminSignificantEvent → admin emails |
| [lib/client-login-notifications.ts](lib/client-login-notifications.ts) | Magic link emails |
| [lib/auto-dispatch-on-final-details.ts](lib/auto-dispatch-on-final-details.ts) | Auto-dispatch worksheet to staff |
| [lib/actions/booking-actions.ts](lib/actions/booking-actions.ts) | CRM booking creation and artist confirmation |
| [lib/email-send.ts](lib/email-send.ts) | sendEmailFromCRM (inbox-specific) |
| [lib/dispatch-email.ts](lib/dispatch-email.ts) | buildDispatchEmailHtml (artist worksheet) |

---

## 6. Summary of Gaps

1. **Inconsistent subject lines** – Some use `{EventType} - {Venue} - {Date}`, others use `Your Quote - {Venue} on {Date}`.
2. **Missing admin notifications** – Quote request, hire enquiry, send first touch, confirm hire request lack notifyAdmin/Pushover.
3. **Missing logActivity** – Send first touch and some enquiry flows.
4. **Missing emailsSent** – Send deposit email and contact autoresponder (on booking).
5. **Duplicate / divergent templates** – inquiries/new uses different first-touch HTML than contact form.
6. **Admin-facing emails** – Quote request, hire enquiry, portal message, confirm hire request use simple inline HTML; acceptable for internal use but could use consistent styling.
7. **No central PDF notice tracking** – No unified “client received PDF” record in the emailsSent schema.

---

## 7. Concrete Cursor Edit Suggestions

### Edit 1: Inquiries/new – Use FIRST_TOUCH from lib/email/templates

**File:** `app/api/inquiries/new/route.ts`

Replace the custom first-touch HTML block with:

```ts
import { FIRST_TOUCH } from "@/lib/email/templates";

// In the email send block:
const { subject, html, text } = FIRST_TOUCH({
  name: enquiry.name,
  email: enquiry.email,
  venueName: (enquiry.venueName || enquiry.venuePostcode || "your venue").trim(),
  eventDate: enquiry.eventDate ? new Date(enquiry.eventDate) : new Date(),
});
await resend.emails.send({
  from: ...,
  to: email,
  subject,
  html,
  text,
});
```

This aligns with the contact form flow and ensures SIGNATURE_BLOCK_HTML.

### Edit 2: Send first touch – Add logActivity

**File:** `app/api/admin/bookings/[id]/send-first-touch/route.ts`

After successful send and DB update, add:

```ts
import { logActivity } from "@/lib/activity-log";

// After prisma.booking.update
await logActivity({
  bookingId,
  action: "first_touch_sent",
  description: `First Touch email sent to ${booking.email}`,
  actor: "admin",
  performedBy: admin?.name ?? admin?.email ?? undefined,
});
```

### Edit 3: Enquiries reply – Add notifyAdmin for NewEnquiry

**File:** `app/api/admin/enquiries/[id]/reply/route.ts`

After updating NewEnquiry, add:

```ts
if (isNewEnquiry && admin) {
  await notifyAdminSignificantEvent({
    type: "enquiry_reply_sent",
    title: "Enquiry reply sent",
    description: `Replied to ${enquiry.name} – ${enquiry.venueName ?? "venue"}`,
    actor: "admin",
    performedBy: admin?.name ?? admin?.email ?? undefined,
    // No bookingId for NewEnquiry
  });
}
```

Note: notifyAdminSignificantEvent may need to support `enquiryId` when `bookingId` is absent.

### Edit 4: Confirm hire request – Add notifyAdmin

**File:** `app/api/client/bookings/[id]/confirm-hire-request/route.ts`

After logActivity, add:

```ts
await notifyAdminSignificantEvent({
  type: "hire_request_confirmed",
  bookingId,
  title: "Hire request confirmed",
  description: `Client confirmed hire request: £${total.toFixed(2)}`,
  actor: "client",
  performedBy: booking.name ?? undefined,
  bookingName: booking.name ?? undefined,
  venueName: booking.venueName ?? undefined,
  eventDate: ...,
});
```

Extend `SignificantEventType` in lib/admin-notifications.ts to include `hire_request_confirmed` if not already present.

### Edit 5: Send composed email – Standardize subject (optional)

**File:** `app/api/admin/send-composed-email/route.ts`

Current: `Your Quote - ${venueName} on ${formattedDate}`  
Suggested: `${eventType || "Event"} - ${venueName} - ${formattedDate} – Your Quote`

Requires passing `eventType` from the request body (likely already available).
