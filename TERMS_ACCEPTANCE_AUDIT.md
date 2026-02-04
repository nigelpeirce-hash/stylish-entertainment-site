# Terms & Conditions Acceptance Workflow Audit

Audit of T&C acceptance flows for bookings. Ready for QA review.

---

## Audit Table

| Flow | Route / Component | Auth | DB Fields Updated | Admin Notification Exists? | Client-specific T&C? | Notes / Gaps | Source File |
|------|-------------------|------|-------------------|---------------------------|----------------------|--------------|-------------|
| **Portal (post-booking)** | `POST /api/client/bookings/[id]/accept-terms` | ✅ Token (`?token=`) or session (user owns booking or admin) | termsAccepted, termsAcceptedAt | ⚠️ logActivity only | ❌ No | AcceptTermsModule shows generic TERMS_SECTIONS. No venue/date/fee in dialog | [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/[id]/accept-terms/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| **Book from quote** | `POST /api/bookings/confirm-from-quote` | ✅ Token in body (quote token) | termsAccepted, termsAcceptedAt | ⚠️ Pushover to staff; no AuditLog for terms | ⚠️ Partial | quoteSummary passed for PDF download only; T&C dialog is generic | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts), [app/book-from-quote/page.tsx](app/book-from-quote/page.tsx) |
| **Book DJ** | `POST /api/bookings` | ✅ Session or find user by email | termsAccepted, termsAcceptedAt | ❌ No | ❌ No | termsAccepted required; no logActivity, no notifyAdmin | [app/api/bookings/route.ts](app/api/bookings/route.ts), [app/book-dj/page.tsx](app/book-dj/page.tsx) |
| **Secure booking** | `POST /api/bookings/accept-terms` | ✅ Session (userId required) | termsAccepted, termsAcceptedAt | ❌ No | ❌ No | No logActivity, no notifyAdmin; booking must belong to user | [app/api/bookings/accept-terms/route.ts](app/api/bookings/accept-terms/route.ts), [app/dashboard/secure-booking/page.tsx](app/dashboard/secure-booking/page.tsx) |

---

## Auth Summary

| Route | Auth | Status |
|-------|------|--------|
| `POST /api/client/bookings/[id]/accept-terms` | Token or session | ✅ Enforced |
| `POST /api/bookings/confirm-from-quote` | Quote token in body | ✅ Enforced |
| `POST /api/bookings` | Session or user by email | ✅ Enforced |
| `POST /api/bookings/accept-terms` | Session (userId) | ✅ Enforced |

---

## DB Fields

| Field | Exists in Schema | Updated by Routes |
|-------|------------------|-------------------|
| termsAccepted | ✅ | All 4 flows |
| termsAcceptedAt | ✅ | All 4 flows |
| **termsAcceptedByUserId** | ❌ **Not in schema** | — |

**Schema:** [prisma/schema.prisma](prisma/schema.prisma) – Booking model has `termsAccepted`, `termsAcceptedAt`. No `termsAcceptedByUserId`, `termsAcceptedIp`, or `termsAcceptedName`.

---

## Admin Notifications

| Flow | logActivity | notifyAdmin | Pushover | Email |
|------|-------------|-------------|----------|-------|
| Portal accept-terms | ✅ terms_accepted | ❌ | ❌ | ❌ |
| Book from quote | ❌ | ❌ | ✅ (quote confirmed) | ❌ |
| Book DJ | ❌ | ❌ | ❌ | ❌ |
| Secure booking | ❌ | ❌ | ❌ | ❌ |

**Gaps:** Only portal accept-terms writes to AuditLog. No flow sends admin email or Pushover for T&C acceptance.

---

## Client-Specific T&C Content

| Component | Venue | Date | Fee | Notes |
|-----------|-------|------|-----|-------|
| **AcceptTermsModule dialog** | ❌ | ❌ | ❌ | Generic TERMS_SECTIONS from [lib/terms-content.ts](lib/terms-content.ts) |
| **Quote summary PDF** (book-from-quote) | ✅ | ✅ | ✅ | Optional download; not part of T&C acceptance dialog |
| **Booking Agreement PDF** (ContractFooter) | ✅ | ✅ | — | Generated after acceptance; uses booking data |
| **Email templates** | ✅ | ✅ | ✅ | contractData has venue, date, fee, talent |

**Gap:** The T&C dialog users read before accepting does not include client-specific venue, date, or fee. Same content for all clients.

---

## Bypass Risks

| Scenario | Bypass? | Details |
|----------|---------|---------|
| Portal: status=confirmed or deposit received | ⚠️ **Yes** | T&C card is **hidden** when `status === "confirmed"` or `depositReceived`/`depositReceivedManual`. Treated as already accepted. |
| Contact form → admin confirms deposit | ⚠️ **Yes** | Client never sees portal T&C; admin can mark deposit without client accepting in portal |
| Book from quote | ❌ | termsAccepted must be `true` in body; submit disabled until checked |
| Book DJ | ❌ | termsAccepted required; 400 if false |
| Secure booking | ❌ | Checkbox required; submit disabled until checked |

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
| Admin pre-confirmed booking | ⚠️ | T&C card hidden; no way for client to accept in portal |
| Deposit received before T&C | ⚠️ | T&C card hidden; assumed accepted |
| Idempotent re-accept | ✅ | Portal returns `alreadyAccepted: true`; secure/book DJ no-op if already set |
| Archived booking | ✅ | confirm-from-quote returns 410; secure booking accept-terms checks archivedAt |

---

## Frontend Wiring

| Page / Component | API Called | T&C UI |
|------------------|------------|--------|
| PortalView (Contract tab) | `POST /api/client/bookings/[id]/accept-terms?token=...` | AcceptTermsModule + "Accept terms" button |
| book-from-quote | `POST /api/bookings/confirm-from-quote` | AcceptTermsModule (quoteSummary for PDF) |
| book-dj | `POST /api/bookings` | AcceptTermsModule |
| dj-booking-confirmation | `POST /api/bookings` | AcceptTermsModule |
| secure-booking | `POST /api/bookings/accept-terms` | Inline checkbox + dialog (not AcceptTermsModule) |
| checkout | `POST /api/orders/create` | AcceptTermsModule (orders flow) |

---

## Summary of Gaps

| Gap | Impact |
|-----|--------|
| No termsAcceptedByUserId | Cannot track which user accepted |
| No notifyAdmin on any T&C acceptance | Admin not notified when client accepts |
| T&C dialog is generic | Client does not see venue/date/fee in acceptance dialog |
| Portal bypass | Confirmed/deposit-received bookings skip T&C card entirely |
| /api/bookings/accept-terms has no logActivity | Secure booking acceptance not in AuditLog |
