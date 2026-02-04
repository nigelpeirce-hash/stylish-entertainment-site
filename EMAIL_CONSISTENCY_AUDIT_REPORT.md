# Email Consistency & Notifications Audit Report

**Date:** 2025-01-28  
**Scope:** `lib/email*`, `components/EmailCompositionCenter.tsx`, `components/admin/*`, `app/api/admin/**`, `app/api/client/**`

---

## 1. Missing logActivity

| Route / Component | File | Line(s) | Notes |
|-------------------|------|---------|-------|
| Send first touch | `app/api/admin/bookings/[id]/send-first-touch/route.ts` | 87–91 | Sends email, updates lastEmailSentAt; no logActivity |
| Finalize and invite | `app/api/admin/bookings/[id]/finalize-and-invite/route.ts` | 82–105 | Sends portal invite; no logActivity (has emailsSent) |
| Flexible update (deposit email) | `app/api/admin/bookings/[id]/flexible-update/route.ts` | 225–231 | Sends deposit confirmation; no logActivity |
| Send DJ inquiry reply | `app/api/admin/send-dj-inquiry-reply/route.ts` | 293–328 | Has notifyAdmin (which calls logActivity) — **OK** |
| Enquiries reply (NewEnquiry) | `app/api/admin/enquiries/[id]/reply/route.ts` | 115–136 | logActivity only for booking; NewEnquiry has no bookingId |
| Public quote request | `app/api/public/quote-request/route.ts` | 172 | Sends to admin; no logActivity (no bookingId) |
| Public hire enquiry | `app/api/public/hire-enquiry/route.ts` | 141 | Sends to admin; no logActivity |
| Inquiries/new first touch | `app/api/inquiries/new/route.ts` | 126 | Sends first touch; no logActivity (NewEnquiry) |
| Send resource | `app/api/admin/send-resource/route.ts` | 237 | Sends email; no logActivity |
| Rescue extend retention | `app/api/rescue/[id]/extend-retention/route.ts` | 166 | Sends email; no logActivity |
| Contact update | `app/api/contact/update/route.ts` | 109 | Sends email; no logActivity |
| User invite | `app/api/admin/users/invite/route.ts` | 373, 190 | Sends invite; no logActivity |

---

## 2. Missing notifyAdmin

| Route / Component | File | Line(s) | Notes |
|-------------------|------|---------|-------|
| Send first touch | `app/api/admin/bookings/[id]/send-first-touch/route.ts` | — | Admin-triggered; no notifyAdmin |
| Finalize and invite | `app/api/admin/bookings/[id]/finalize-and-invite/route.ts` | — | Admin-triggered; no notifyAdmin |
| Flexible update | `app/api/admin/bookings/[id]/flexible-update/route.ts` | 225 | Sends deposit email; no notifyAdmin |
| Enquiries reply (NewEnquiry) | `app/api/admin/enquiries/[id]/reply/route.ts` | — | No bookingId; notifyAdmin requires bookingId |
| **Confirm hire request** | `app/api/client/bookings/[id]/confirm-hire-request/route.ts` | 114 | Client-triggered; has logActivity; **no notifyAdmin** — admin should know |
| Send resource | `app/api/admin/send-resource/route.ts` | 237 | Admin-triggered; no notifyAdmin |
| Send portal link | `app/api/admin/bookings/[id]/send-portal-link/route.ts` | — | Has logActivity; no notifyAdmin; **does not update emailsSent.portalInvite** (cron portal reminder may duplicate) |

---

## 3. Routes with Complete Coverage (logActivity + notifyAdmin where applicable)

| Route | logActivity | notifyAdmin | Notes |
|-------|-------------|-------------|-------|
| Send composed email | ✅ | ✅ | Full coverage |
| Send DJ inquiry reply | ✅ (via notifyAdmin) | ✅ | Full coverage |
| Staff confirm | ✅ (via notifyAdmin) | ✅ | Full coverage |
| Staff cancel | ✅ | — | Staff action; notifyAdmin not typical |
| Dispatch | ✅ (via notifyAdmin) | ✅ | Full coverage |
| Send deposit email | ✅ | — | logActivity exists |
| Send portal link | ✅ | — | logActivity exists |
| Accept terms (portal) | ✅ | ✅ | Full coverage |
| Accept terms (secure) | ✅ | ✅ | Full coverage |
| Final payment sent | ✅ | ✅ | Full coverage |
| Confirm from quote | ✅ | Pushover | logActivity + Pushover |
| Portal message | — | ✅ | notifyAdmin exists |
| Contact form | Pushover + notifyAdmin | ✅ | Full coverage |

---

## 4. Missing Dynamic Fields in Templates

| Template / Flow | Missing Variable | File | Line |
|-----------------|------------------|------|------|
| EmailCompositionCenter | talent (when multiple) | Already uses `toTalentDisplayList` | — |
| Send composed email | eventType in subject | `app/api/admin/send-composed-email/route.ts` | 77 | Subject: `Your Quote - ${venueName} on ${formattedDate}` — could add eventType |
| Inquiries/new first touch | venueName, standard footer | `app/api/inquiries/new/route.ts` | 100–124 | Custom HTML; no SIGNATURE_BLOCK_HTML |
| Deposit invoice | — | `lib/email-templates.ts` | depositInvoiceEmail | Has clientName, eventDate, venue, amount, reference |
| Enquiry reply | — | `lib/email/enquiry-reply-template.ts` | buildEnquiryReplyEmail | Has venue, date |

---

## 5. Formatting Inconsistencies

| Template / Flow | Issue | File | Line |
|-----------------|-------|------|------|
| Inquiries/new first touch | No SIGNATURE_BLOCK_HTML; custom footer | `app/api/inquiries/new/route.ts` | 100–124 |
| Public quote request | Simple inline HTML; admin-facing | `app/api/public/quote-request/route.ts` | 156–170 |
| Public hire enquiry | Simple inline HTML; admin-facing | `app/api/public/hire-enquiry/route.ts` | 127–138 |
| Portal message (admin) | Hardcoded `info@stylishentertainment.co.uk` | `app/api/client/portal-message/route.ts` | 198 |
| Confirm hire request (admin) | Simple inline HTML | `app/api/client/bookings/[id]/confirm-hire-request/route.ts` | 99–111 |
| Send DJ inquiry reply | LUXE_STYLES inline; different from lib/email/templates | `app/api/admin/send-dj-inquiry-reply/route.ts` | 23–127 |

---

## 6. React Rendering & Accessibility

| Component | Issue | File | Line | Status |
|-----------|-------|------|------|--------|
| EmailCompositionCenter | Uses toSafeDisplayString, toVenueDisplay, toFeeDisplay, toDepositDisplay, toTalentDisplayList | `components/EmailCompositionCenter.tsx` | 12–18, 299–327 | ✅ Fixed |
| EmailCompositionCenter | Has `aria-describedby="email-compose-desc"` on DialogContent | `components/EmailCompositionCenter.tsx` | 299 | ✅ Has DialogDescription |
| AcceptTermsModule | — | `components/AcceptTermsModule.tsx` | — | ✅ Safe |
| TeamAssignment | Uses `assignment.staff?.name` | `components/admin/TeamAssignment.tsx` | 312, 318, 333 | ✅ Defensive |
| CrewAssignments | Uses `assignment.staff?.name` | `components/CrewAssignments.tsx` | 216, 243 | ✅ Defensive |

**Potential risk:** Any component that renders `booking.fee`, `booking.bookingFee`, or `booking.staffAssignments` directly without `toFeeDisplay` or `toTalentDisplayList` could cause "Objects are not valid as React child".

---

## 7. API Routes That Send Email Without logActivity or notifyAdmin

| Method | Route | Sends Email? | logActivity | notifyAdmin |
|--------|-------|--------------|-------------|-------------|
| POST | `/api/admin/bookings/[id]/send-first-touch` | ✅ Client | ❌ | ❌ |
| POST | `/api/admin/bookings/[id]/finalize-and-invite` | ✅ Client | ❌ | ❌ |
| PATCH | `/api/admin/bookings/[id]/flexible-update` | ✅ Client (conditional) | ❌ | ❌ |
| POST | `/api/public/quote-request` | ✅ Admin | ❌ | ❌ |
| POST | `/api/public/hire-enquiry` | ✅ Admin (conditional) | ❌ | ❌ |
| POST | `/api/inquiries/new` | ✅ Client | ❌ | ⚠️ Webhook only |
| POST | `/api/admin/send-resource` | ✅ Recipient | ❌ | ❌ |
| GET | `/api/rescue/[id]/extend-retention` | ✅ Client | ❌ | ❌ |
| PATCH | `/api/contact/update` | ✅ Client | ❌ | ❌ |
| POST | `/api/admin/users/invite` | ✅ New user | ❌ | ❌ |
| POST | `/api/client/bookings/[id]/confirm-hire-request` | ✅ Admin | ✅ | ❌ |

---

## 8. Optional PDF / Portal Notice Gaps

| Flow | PDF Mentioned? | Portal Notice? | Notes |
|------|----------------|----------------|-------|
| Book from quote | Quote Summary PDF (optional download) | — | AcceptTermsModule showDownloadPdf |
| Deposit confirmation | — | Portal link in deposit email | ✅ |
| Accept T&C (portal) | Booking Agreement PDF post-acceptance | — | ContractFooter |
| Send composed email | — | — | Admin composes; no PDF |

---

## 9. Auto-Fix Suggestions

### 9.1 Add logActivity to send-first-touch

```ts
// After prisma.booking.update (line 90)
await logActivity({
  bookingId,
  action: "first_touch_sent",
  description: `First Touch email sent to ${booking.email}`,
  actor: "admin",
  performedBy: admin?.name ?? admin?.email ?? undefined,
});
```

### 9.2 Add logActivity to finalize-and-invite

```ts
// After prisma.booking.update (line 105)
await logActivity({
  bookingId,
  action: "portal_invite_sent",
  description: `Portal invite sent to ${booking.email}`,
  actor: "admin",
  performedBy: admin?.name ?? admin?.email ?? undefined,
});
```

### 9.3 Add logActivity + notifyAdmin to flexible-update (when email sent)

```ts
// After sendEmail (line 231), inside the try block
await logActivity({
  bookingId,
  action: "deposit_confirmation_sent",
  description: `Deposit confirmation email sent to ${currentBooking.email}`,
  actor: "admin",
  performedBy: admin?.name ?? admin?.email ?? undefined,
});
await notifyAdminSignificantEvent({
  type: "composed_email_sent", // or add "deposit_confirmation_sent"
  bookingId,
  title: "Deposit confirmation sent",
  description: `Deposit confirmation sent to ${currentBooking.name}`,
  actor: "admin",
  performedBy: admin?.name ?? admin?.email ?? undefined,
  bookingName: currentBooking.name ?? undefined,
  venueName: currentBooking.venueName ?? undefined,
});
```

### 9.4 Add notifyAdmin to confirm-hire-request

Add `hire_request_confirmed` to `SignificantEventType` in `lib/admin-notifications.ts`, then:

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
  eventDate: eventDate,
});
```

### 9.5 Use FIRST_TOUCH in inquiries/new

Replace custom HTML in `app/api/inquiries/new/route.ts` with `FIRST_TOUCH` from `lib/email/templates.ts` (same as contact flow) for consistent header/footer and SIGNATURE_BLOCK_HTML.

### 9.6 Update emailsSent.portalInvite in send-portal-link

`send-portal-link` does not update `emailsSent.portalInvite`. The cron email-journey checks this to avoid sending duplicate portal reminders. Add:

```ts
// After sendEmail success, before logActivity
const existingEmailsSent = (booking.emailsSent as Record<string, unknown>) || {};
await prisma.booking.update({
  where: { id: bookingId },
  data: {
    emailsSent: { ...existingEmailsSent, portalInvite: { sentAt: new Date().toISOString() } },
    lastEmailSentAt: new Date(),
  },
});
```

(Note: send-portal-link does not currently fetch/update booking after send; may need to add this.)

### 9.7 Map object fields before rendering in JSX

For any component that displays `booking.bookingFee`, `booking.finalBalance`, or `booking.staffAssignments`:

- Use `toFeeDisplay(value)` from `lib/transformers/booking-transformer.ts`
- Use `toTalentDisplayList(assignments).map(...)` for staff
- Use `toSafeDisplayString(value)` for unknown types
