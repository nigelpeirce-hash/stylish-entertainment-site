# Booking Flows & Terms & Conditions Audit

Comprehensive audit of all booking flows (DJ, musicians, lighting, styling) and T&C acceptance. Ready for QA.

---

## Audit Table

| Flow | Route / Component | Auth | DB Fields Updated | Admin Notification Exists? | Client-specific T&C + Talent? | Notes / Gaps | Source File |
|------|-------------------|------|-------------------|---------------------------|------------------------------|--------------|-------------|
| **Portal T&C** | `POST /api/client/bookings/[id]/accept-terms` | ✅ Token or session | termsAccepted, termsAcceptedAt | ⚠️ logActivity only | ❌ Generic | No notifyAdmin; no termsAcceptedByUserId | [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/[id]/accept-terms/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| **Book from quote** | `POST /api/bookings/confirm-from-quote` | ✅ Quote token in body | termsAccepted, termsAcceptedAt, status, staff assignment | ⚠️ Pushover only | ⚠️ Partial | No AuditLog for terms; quoteSummary PDF has venue/date/artist/fee; T&C dialog generic | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts), [app/book-from-quote/page.tsx](app/book-from-quote/page.tsx) |
| **Book DJ** | `POST /api/bookings` | ✅ Session or user by email | termsAccepted, termsAcceptedAt (create) | ❌ None | ❌ Generic | No logActivity, no notifyAdmin | [app/api/bookings/route.ts](app/api/bookings/route.ts), [app/book-dj/page.tsx](app/book-dj/page.tsx) |
| **DJ confirmation** | `POST /api/bookings` | ✅ Session or user by email | termsAccepted, termsAcceptedAt | ❌ None | ❌ Generic | Same as Book DJ flow | [app/api/bookings/route.ts](app/api/bookings/route.ts), [app/dj-booking-confirmation/page.tsx](app/dj-booking-confirmation/page.tsx) |
| **Secure booking** | `POST /api/bookings/accept-terms` | ✅ Session (userId) | termsAccepted, termsAcceptedAt | ❌ None | ⚠️ Partial | Page shows venue/date/DJ/deposit; T&C dialog is generic; **no logActivity** | [app/api/bookings/accept-terms/route.ts](app/api/bookings/accept-terms/route.ts), [app/dashboard/secure-booking/page.tsx](app/dashboard/secure-booking/page.tsx) |
| **Checkout (hire)** | `POST /api/orders/create` | ✅ Session (getToken) | HireOrder.termsAccepted, termsAcceptedAt | ❌ None | ❌ Generic | Different model (HireOrder); AcceptTermsModule | [app/api/orders/create/route.ts](app/api/orders/create/route.ts), [app/checkout/page.tsx](app/checkout/page.tsx) |
| **Assign DJ** | `POST /api/admin/bookings/staff/confirm` | ✅ requireAdmin | BookingStaffAssignment (role=DJ) | ✅ notifyAdmin (artist_assigned) | N/A | Sends staff confirmation email | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **Assign Musician** | `POST /api/admin/bookings/staff/confirm` | ✅ requireAdmin | BookingStaffAssignment (role=Musician) | ✅ notifyAdmin | N/A | Same route; role selection | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **Assign Lighting** | `POST /api/admin/bookings/staff/confirm` | ✅ requireAdmin | BookingStaffAssignment (role=Lighting) | ✅ notifyAdmin | N/A | Same route | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **Assign Styling** | `POST /api/admin/bookings/staff/confirm` | ✅ requireAdmin | BookingStaffAssignment (role=Styling) | ✅ notifyAdmin | N/A | Same route | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **Assign Production** | `POST /api/admin/bookings/staff/confirm` | ✅ requireAdmin | BookingStaffAssignment (role=Production) | ✅ notifyAdmin | N/A | Same route | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **Cancel talent** | `POST /api/admin/bookings/staff/[id]/cancel` | ✅ requireAdmin | status=cancelled, cancelledAt | ✅ logActivity | N/A | Sends staff cancellation email | [app/api/admin/bookings/staff/[id]/cancel/route.ts](app/api/admin/bookings/staff/[id]/cancel/route.ts) |
| **Dispatch brief** | `POST /api/admin/bookings/[id]/dispatch` | ✅ requireAdmin | briefStatus, status | ✅ notifyAdmin (dispatched) | N/A | Sends brief to DJ/staff | [app/api/admin/bookings/[id]/dispatch/route.ts](app/api/admin/bookings/[id]/dispatch/route.ts) |
| **Confirm from quote (talent)** | `POST /api/bookings/confirm-from-quote` | ✅ Quote token | BookingStaffAssignment | N/A | N/A | Client selects staff; sends staff confirmation email | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts) |

---

## T&C Acceptance Routes Summary

| Route | Auth | logActivity | notifyAdmin | Pushover | Source |
|-------|------|-------------|-------------|----------|--------|
| `POST /api/client/bookings/[id]/accept-terms` | Token/session | ✅ terms_accepted | ❌ | ❌ | [route.ts](app/api/client/bookings/[id]/accept-terms/route.ts) |
| `POST /api/bookings/confirm-from-quote` | Quote token | ❌ | ❌ | ✅ (quote confirmed) | [route.ts](app/api/bookings/confirm-from-quote/route.ts) |
| `POST /api/bookings` | Session/email | ❌ | ❌ | ❌ | [route.ts](app/api/bookings/route.ts) |
| `POST /api/bookings/accept-terms` | Session | ❌ | ❌ | ❌ | [route.ts](app/api/bookings/accept-terms/route.ts) |
| `POST /api/orders/create` | Session | ❌ | ❌ | ❌ | [route.ts](app/api/orders/create/route.ts) |

---

## Talent Assignment Flows

| Role | API | UI Component | Admin Notification | Talent Email |
|------|-----|--------------|--------------------|--------------|
| DJ | `POST /api/admin/bookings/staff/confirm` | TeamAssignment | notifyAdmin (artist_assigned) | staffConfirmationEmail |
| Musician | Same | Same | Same | Same |
| Lighting | Same | Same | Same | Same |
| Styling | Same | Same | Same | Same |
| Production | Same | Same | Same | Same |

**Roles defined:** [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) line 63: `["DJ", "Lighting", "Styling", "Musician", "Production"]`.

**Talent acceptance:** No client-facing talent contract confirmation. Admin assigns → staff receives email. Client does not explicitly confirm talent assignment in T&C.

---

## DB Fields

| Field | Schema | Updated By |
|-------|--------|------------|
| termsAccepted | ✅ Booking, HireOrder | All T&C routes |
| termsAcceptedAt | ✅ | All T&C routes |
| **termsAcceptedByUserId** | ❌ **Not in schema** | — |
| termsAcceptedIp | ❌ | — |
| termsAcceptedName | ❌ | — |

**Schema:** [prisma/schema.prisma](prisma/schema.prisma) – `Booking` has `termsAccepted`, `termsAcceptedAt` only.

---

## Client Content (T&C Dialog vs Page vs PDF)

| Flow | T&C Dialog Content | Page Context | PDF |
|------|--------------------|--------------|-----|
| **Portal** | Generic TERMS_SECTIONS | — | Booking Agreement (venue, date; no talent) |
| **Book from quote** | Generic | Event section shows artist + fee | Quote Summary (venue, date, artist, fee) |
| **Book DJ** | Generic | Form fields | — |
| **Secure booking** | Generic (inline) | Booking Summary: venue, date, DJ/artists, lighting, deposit | — |
| **Checkout** | Generic | — | — |

**Gap:** AcceptTermsModule and secure-booking T&C dialog use generic content from [lib/terms-content.ts](lib/terms-content.ts). Venue, date, fee, and talent are **not** in the acceptance dialog itself. Quote Summary PDF (book-from-quote) is optional and has client-specific data but is separate from T&C text.

**Booking Agreement PDF** ([lib/booking-agreement-pdf.ts](lib/booking-agreement-pdf.ts)): venue, date, event type, client name – **no talent/staff info**.

---

## Portal Bypass Scenarios

| Scenario | Bypass? | Details |
|----------|---------|---------|
| status=confirmed | ⚠️ **Yes** | T&C card hidden; treated as accepted |
| depositReceived / depositReceivedManual | ⚠️ **Yes** | Same |
| Contact form → admin confirms deposit | ⚠️ **Yes** | Client never sees portal T&C |
| Admin pre-confirmed booking | ⚠️ **Yes** | T&C card hidden |
| Book from quote | ❌ | termsAccepted required in body |
| Book DJ / DJ confirmation | ❌ | termsAccepted required; 400 if false |
| Secure booking | ❌ | Checkbox required; submit disabled until checked |
| Checkout | ❌ | termsAccepted required |

**Source:** [components/client/PortalView.tsx](components/client/PortalView.tsx) lines 1521–1527:

```tsx
{!booking.termsAccepted &&
  !(booking.status === "confirmed" || booking.depositReceived === true || booking.depositReceivedManual === true) && (
  // T&C card
)}
```

---

## Edge Cases

| Edge Case | Handled? | Notes |
|-----------|----------|-------|
| Idempotent re-accept | ✅ | Portal returns `alreadyAccepted: true`; secure/book DJ no-op if already set |
| Archived booking | ✅ | confirm-from-quote returns 410; accept-terms checks archivedAt |
| Deposit received before T&C | ⚠️ | T&C card hidden; assumed accepted |
| Talent added post-acceptance | ⚠️ | Client accepts before talent assigned; no re-accept required |
| Talent swap post-acceptance | ⚠️ | No re-accept or re-disclosure; client may not see updated talent in T&C |

---

## Frontend Wiring

| Page / Component | API | T&C UI | Submit Enforcement |
|------------------|-----|--------|--------------------|
| PortalView (Contract tab) | `POST /api/client/bookings/[id]/accept-terms` | AcceptTermsModule + button | Button triggers acceptance |
| book-from-quote | `POST /api/bookings/confirm-from-quote` | AcceptTermsModule (quoteSummary) | Submit disabled until checked |
| book-dj | `POST /api/bookings` | AcceptTermsModule | Submit disabled until checked |
| dj-booking-confirmation | `POST /api/bookings` | AcceptTermsModule | Submit disabled until checked |
| secure-booking | `POST /api/bookings/accept-terms` | Inline checkbox + dialog | handlePayDeposit checks termsAccepted |
| checkout | `POST /api/orders/create` | AcceptTermsModule | Submit disabled until checked |

---

## Highlighted Gaps & Risks

### Missing termsAcceptedByUserId
- Cannot track which user accepted when multiple users (e.g. couple) have access.
- **Recommendation:** Add `termsAcceptedByUserId` to Booking schema and populate in all T&C routes.

### Missing Admin Notifications (T&C Acceptance)
| Flow | Missing |
|------|---------|
| Portal accept-terms | notifyAdmin, Pushover, email |
| confirm-from-quote | logActivity (AuditLog) for terms |
| Book DJ | logActivity, notifyAdmin |
| Secure booking | logActivity, notifyAdmin |
| Checkout | logActivity, notifyAdmin |

### Generic T&C Content
- AcceptTermsModule and secure-booking dialog show same TERMS_SECTIONS for all clients.
- Venue, date, fee, and talent **not** in acceptance dialog.
- Quote Summary PDF (book-from-quote) and Booking Agreement PDF have some client-specific data but are separate from T&C acceptance text.

### Portal Bypass
- Confirmed or deposit-received bookings never show T&C card; treated as accepted.
- Contact-form bookings can reach confirmed without client accepting in portal.

### Missing AuditLog Entries
- `POST /api/bookings/accept-terms` (secure booking): no logActivity.
- `POST /api/bookings` (Book DJ): no logActivity.
- `POST /api/orders/create`: no logActivity for T&C.

### Talent in T&C
- No talent/staff info in Booking Agreement PDF.
- Client accepts generic T&C; talent may be assigned later.
- Talent swap has no re-accept flow.

---

## Source File Index

| Domain | Files |
|--------|-------|
| T&C routes | [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/[id]/accept-terms/route.ts), [app/api/bookings/accept-terms/route.ts](app/api/bookings/accept-terms/route.ts), [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts), [app/api/bookings/route.ts](app/api/bookings/route.ts), [app/api/orders/create/route.ts](app/api/orders/create/route.ts) |
| T&C UI | [components/AcceptTermsModule.tsx](components/AcceptTermsModule.tsx), [lib/terms-content.ts](lib/terms-content.ts), [components/client/ContractFooter.tsx](components/client/ContractFooter.tsx), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| PDFs | [lib/booking-agreement-pdf.ts](lib/booking-agreement-pdf.ts), [lib/quote-summary-pdf.ts](lib/quote-summary-pdf.ts) |
| Pages | [app/book-from-quote/page.tsx](app/book-from-quote/page.tsx), [app/book-dj/page.tsx](app/book-dj/page.tsx), [app/dj-booking-confirmation/page.tsx](app/dj-booking-confirmation/page.tsx), [app/dashboard/secure-booking/page.tsx](app/dashboard/secure-booking/page.tsx), [app/checkout/page.tsx](app/checkout/page.tsx) |
| Talent | [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx), [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [app/api/admin/bookings/staff/[id]/cancel/route.ts](app/api/admin/bookings/staff/[id]/cancel/route.ts), [app/api/admin/bookings/[id]/dispatch/route.ts](app/api/admin/bookings/[id]/dispatch/route.ts) |
