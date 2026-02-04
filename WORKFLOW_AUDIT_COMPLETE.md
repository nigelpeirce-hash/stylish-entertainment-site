# Site-Wide Workflow Audit (Complete)

Comprehensive audit of all flows from initial enquiry to post-event follow-up. Includes talent assignment (DJ, Musician, Lighting, Styling, Production), T&C acceptance, auth, DB fields, admin notifications, and client content. Ready for QA review.

---

## 1. Public Domain

| Flow / Step | Route / Component | Auth | DB Fields Updated | Admin Notification Exists? | Client Content Displayed? | Notes / Gaps | Source File |
|-------------|-------------------|------|-------------------|---------------------------|---------------------------|--------------|-------------|
| Contact form | `POST /api/contact` | Public (reCAPTCHA where configured) | Booking created; status, emailsSent | ✅ Pushover + notifyAdmin | Autoresponder email | Complete | [app/api/contact/route.ts](app/api/contact/route.ts), [app/contact-us/ContactForm.tsx](app/contact-us/ContactForm.tsx) |
| New enquiry | `POST /api/inquiries/new` | Public | NewEnquiry; firstTouchEmailSent | ⚠️ MOBILE_NOTIFICATION_WEBHOOK only | First touch email | No AuditLog, no Pushover if webhook unset | [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts), [app/new-inquiry/page.tsx](app/new-inquiry/page.tsx) |
| Quote request | `POST /api/public/quote-request` | Public | NewEnquiry | ⚠️ Email to admin only | Success message | No AuditLog, no Pushover | [app/api/public/quote-request/route.ts](app/api/public/quote-request/route.ts), [app/request-quote/RequestQuoteClient.tsx](app/request-quote/RequestQuoteClient.tsx) |
| Hire enquiry | `POST /api/public/hire-enquiry` | Public | NewEnquiry | ⚠️ Email when hire items | Success message | No AuditLog, no Pushover | [app/api/public/hire-enquiry/route.ts](app/api/public/hire-enquiry/route.ts) |

---

## 2. Admin Domain

| Flow / Step | Route / Component | Auth | DB Fields Updated | Admin Notification Exists? | Client Content Displayed? | Notes / Gaps | Source File |
|-------------|-------------------|------|-------------------|---------------------------|---------------------------|--------------|-------------|
| Send artist quote | `POST /api/admin/send-artist-quote` | requireAdmin | — | ✅ notifyAdmin (quote_sent) | Quote email to client | Complete | [app/api/admin/send-artist-quote/route.ts](app/api/admin/send-artist-quote/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| Send composed email | `POST /api/admin/send-composed-email` | requireAdmin | — | ❌ **Missing** | Custom email to client | No AuditLog, no notifyAdmin | [app/api/admin/send-composed-email/route.ts](app/api/admin/send-composed-email/route.ts), [components/EmailCompositionCenter.tsx](components/EmailCompositionCenter.tsx) |
| Send DJ reply | `POST /api/admin/send-dj-inquiry-reply` | requireAdmin | — | ❌ **Missing** | DJ quote to client | No notifyAdmin | [app/api/admin/send-dj-inquiry-reply/route.ts](app/api/admin/send-dj-inquiry-reply/route.ts) |
| Reply to enquiry | `POST /api/admin/enquiries/[id]/reply` | requireAdmin | enquiryRepliedAt, enquiryRepliedByUserId | ❌ **Missing** | Reply email to client | No activity feed | [app/api/admin/enquiries/[id]/reply/route.ts](app/api/admin/enquiries/[id]/reply/route.ts), [components/admin/ReplyToEnquiryModal.tsx](components/admin/ReplyToEnquiryModal.tsx) |
| Convert enquiry → booking | `POST /api/admin/new-enquiries/[id]/convert` | requireAdmin | NewEnquiry.status=converted, originalBookingId; Booking created | ❌ **Missing** | — | No notifyAdmin | [app/api/admin/new-enquiries/[id]/convert/route.ts](app/api/admin/new-enquiries/[id]/convert/route.ts), [app/admin/new-enquiries/[id]/page.tsx](app/admin/new-enquiries/[id]/page.tsx) |
| Send deposit invoice | `POST /api/admin/bookings/[id]/send-deposit-invoice` | requireAdmin | emailsSent | logActivity | Deposit invoice (venue, date, fee, markedPaidUrl) | Admin action | [app/api/admin/bookings/[id]/send-deposit-invoice/route.ts](app/api/admin/bookings/[id]/send-deposit-invoice/route.ts), [lib/send-deposit-invoice.ts](lib/send-deposit-invoice.ts) |
| Finalise & invite | `POST /api/admin/bookings/[id]/finalize-and-invite` | requireAdmin | status, portalToken, emailsSent | logActivity | Portal invite email | Admin action | [app/api/admin/bookings/[id]/finalize-and-invite/route.ts](app/api/admin/bookings/[id]/finalize-and-invite/route.ts) |
| **Assign talent** (DJ, Musician, Lighting, Styling, Production) | `POST /api/admin/bookings/staff/confirm` | requireAdmin | BookingStaffAssignment (role, agreedFee, status) | ✅ notifyAdmin (artist_assigned) | Staff confirmation email to talent | Single route; TeamAssignment role selector | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| Cancel talent | `POST /api/admin/bookings/staff/[id]/cancel` | requireAdmin | status=cancelled, cancelledAt, cancellationReason | ✅ logActivity | Staff cancellation email | — | [app/api/admin/bookings/staff/[id]/cancel/route.ts](app/api/admin/bookings/staff/[id]/cancel/route.ts) |
| Remove talent | `DELETE /api/admin/bookings/staff/[id]` | requireAdmin | Assignment deleted | ✅ logActivity | — | — | [app/api/admin/bookings/staff/[id]/route.ts](app/api/admin/bookings/staff/[id]/route.ts) |
| Handoff | `PATCH /api/admin/bookings/[id]/handoff` | requireAdmin | handoffStatus, assignedTo, handoffNote | ✅ Pushover + notifyAdmin | — | Complete | [app/api/admin/bookings/[id]/handoff/route.ts](app/api/admin/bookings/[id]/handoff/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| Dispatch brief | `POST /api/admin/bookings/[id]/dispatch` | requireAdmin | briefStatus, status (BookingStaffAssignment) | ✅ notifyAdmin (dispatched) | Brief email to DJ/staff | Complete | [app/api/admin/bookings/[id]/dispatch/route.ts](app/api/admin/bookings/[id]/dispatch/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| Mark deposit received | `PATCH /api/admin/bookings/[id]/flexible-update` | requireAdmin | depositReceivedManual | N/A | DEPOSIT_CONFIRMED email to client | Admin action | [app/api/admin/bookings/[id]/flexible-update/route.ts](app/api/admin/bookings/[id]/flexible-update/route.ts), [components/FlexibleOperatorSidebar.tsx](components/FlexibleOperatorSidebar.tsx) |

---

## 3. Client Domain

| Flow / Step | Route / Component | Auth | DB Fields Updated | Admin Notification Exists? | Client Content Displayed? | Notes / Gaps | Source File |
|-------------|-------------------|------|-------------------|---------------------------|---------------------------|--------------|-------------|
| "I've paid" (deposit) | `GET /api/client/bookings/[id]/marked-deposit-paid?sig=...` | Signed link (sig=) | depositPaidClickedAt | ✅ Pushover + notifyAdmin | Redirect to thank-you | Complete | [app/api/client/bookings/[id]/marked-deposit-paid/route.ts](app/api/client/bookings/[id]/marked-deposit-paid/route.ts), [lib/deposit-paid-link.ts](lib/deposit-paid-link.ts) |
| Confirm from quote | `POST /api/bookings/confirm-from-quote` | Quote token in body | termsAccepted, termsAcceptedAt, status, staff assignment | ⚠️ Pushover only | Deposit invoice email; Quote Summary PDF (optional) | No AuditLog for terms | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts), [app/book-from-quote/page.tsx](app/book-from-quote/page.tsx) |
| Accept T&C (portal) | `POST /api/client/bookings/[id]/accept-terms` | Token or session | termsAccepted, termsAcceptedAt | ⚠️ logActivity only | Generic T&C in AcceptTermsModule; Booking Agreement PDF post-acceptance | No notifyAdmin; **termsAcceptedByUserId missing** | [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/[id]/accept-terms/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| Accept T&C (secure booking) | `POST /api/bookings/accept-terms` | Session (userId) | termsAccepted, termsAcceptedAt | ❌ **Missing** | Generic T&C in inline dialog; page shows venue/date/DJ | No logActivity, no notifyAdmin | [app/api/bookings/accept-terms/route.ts](app/api/bookings/accept-terms/route.ts), [app/dashboard/secure-booking/page.tsx](app/dashboard/secure-booking/page.tsx) |
| Submit final details | `PATCH /api/client/bookings/[id]/final-details` | Token or session | music*, venue*, finalDetailsConfirmed | ✅ Pushover + notifyAdmin | Portal shows booking data | Complete | [app/api/client/bookings/[id]/final-details/route.ts](app/api/client/bookings/[id]/final-details/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| "Final payment sent" | `POST /api/client/bookings/[id]/final-payment-sent` | **🔴 None** | finalDetailsConfirmed, finalDetailsConfirmedManual | ⚠️ logActivity only | — | **🔴 Insecure: no auth**; no admin email; DJ gets email | [app/api/client/bookings/[id]/final-payment-sent/route.ts](app/api/client/bookings/[id]/final-payment-sent/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| Portal message | `POST /api/client/portal-message` | Session (getToken) | — | ✅ notifyAdmin | — | Complete | [app/api/client/portal-message/route.ts](app/api/client/portal-message/route.ts) |
| Confirm hire request | `POST /api/client/bookings/[id]/confirm-hire-request` | Token or session | — | logActivity + email to admin | Hire request sent | Complete | [app/api/client/bookings/[id]/confirm-hire-request/route.ts](app/api/client/bookings/[id]/confirm-hire-request/route.ts), [components/client/HireShop.tsx](components/client/HireShop.tsx) |

---

## 4. Cron Domain

| Flow / Step | Route / Component | Auth | DB Fields Updated | Admin Notification Exists? | Client Content Displayed? | Notes / Gaps | Source File |
|-------------|-------------------|------|-------------------|---------------------------|---------------------------|--------------|-------------|
| Email journey | `GET /api/cron/email-journey` | CRON_SECRET (Bearer) | emailsSent (3-day, 4-week, week-of, final-chase, post-wedding-magic, portal-reminder) | ❌ **Missing** | Client emails (post-wedding, reminders) | No admin notification when post-event sent | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts), [lib/email-journey-templates.ts](lib/email-journey-templates.ts) |
| Scheduled emails | `GET /api/cron/send-scheduled-emails` | CRON_SECRET (Bearer) | emailsSent | N/A | Confirmation, final details reminder, payment reminder | Expected | [app/api/cron/send-scheduled-emails/route.ts](app/api/cron/send-scheduled-emails/route.ts) |
| Post-event digest | — | — | — | ❌ **Not implemented** | — | No automated post-event summary for admin | — |

---

## 5. Talent Assignment (Detail)

| Role | Route | UI | Admin Notification | Talent Email | DB |
|------|-------|----|--------------------|--------------|----|
| DJ | `POST /api/admin/bookings/staff/confirm` | TeamAssignment | notifyAdmin (artist_assigned) | staffConfirmationEmail | BookingStaffAssignment |
| Musician | Same | Same | Same | Same | Same |
| Lighting | Same | Same | Same | Same | Same |
| Styling | Same | Same | Same | Same | Same |
| Production | Same | Same | Same | Same | Same |

**Roles:** [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) line 63: `["DJ", "Lighting", "Styling", "Musician", "Production"]`.

**Related routes:**
- Cancel: `POST /api/admin/bookings/staff/[id]/cancel` → logActivity, staff cancellation email
- Remove: `DELETE /api/admin/bookings/staff/[id]` → logActivity
- Dispatch: `POST /api/admin/bookings/[id]/dispatch` → notifyAdmin (dispatched), brief email to staff

---

## 6. T&C Acceptance Summary

| Route | Auth | logActivity | notifyAdmin | Pushover | termsAcceptedByUserId |
|-------|------|-------------|-------------|----------|------------------------|
| `POST /api/client/bookings/[id]/accept-terms` | Token/session | ✅ terms_accepted | ❌ | ❌ | ❌ Not in schema |
| `POST /api/bookings/confirm-from-quote` | Quote token | ❌ | ❌ | ✅ (quote confirmed) | ❌ Not in schema |
| `POST /api/bookings` (Book DJ) | Session/email | ❌ | ❌ | ❌ | ❌ Not in schema |
| `POST /api/bookings/accept-terms` | Session | ❌ | ❌ | ❌ | ❌ Not in schema |
| `POST /api/orders/create` | Session | ❌ | ❌ | ❌ | N/A (HireOrder) |

**Client T&C content:**
- AcceptTermsModule & secure-booking dialog: **generic** (lib/terms-content.ts) – no venue, date, fee, talent
- Quote Summary PDF (book-from-quote): optional; has venue, date, artist, fee
- Booking Agreement PDF: venue, date, event type, client name – **no talent info**

---

## 7. Security Issues

| Severity | Route | Issue |
|----------|-------|-------|
| 🔴 **High** | `POST /api/client/bookings/[id]/final-payment-sent` | **No token or session validation.** Anyone with a booking ID can call this, set `finalDetailsConfirmed`, and trigger DJ emails. Only check: booking exists, within 21-day window. |

---

## 8. Missing Admin Notifications

| Flow | Route / Event | Missing |
|------|---------------|---------|
| Send composed email | send-composed-email | AuditLog, notifyAdmin |
| Send DJ reply | send-dj-inquiry-reply | notifyAdmin |
| Reply to enquiry | enquiries/[id]/reply | Activity feed / logActivity |
| Convert enquiry | new-enquiries/[id]/convert | notifyAdmin |
| Confirm from quote | confirm-from-quote | logActivity (AuditLog) – Pushover exists |
| T&C accepted (portal) | accept-terms | notifyAdmin, Pushover, email – logActivity exists |
| T&C accepted (secure) | bookings/accept-terms | logActivity, notifyAdmin |
| Book DJ | bookings (POST) | logActivity, notifyAdmin |
| Post-event email sent | cron/email-journey | Admin notification |
| Final payment sent | final-payment-sent | Admin email (DJ gets email; logActivity exists) |
| New enquiry | inquiries/new | AuditLog, Pushover if webhook unset |
| Quote / hire enquiry | public/quote-request, hire-enquiry | AuditLog, Pushover |

---

## 9. Client Content Gaps

| Flow | Content | Issue |
|------|---------|-------|
| T&C acceptance (AcceptTermsModule) | T&C dialog | **Generic** – no venue, date, fee, talent. Same for all clients. |
| T&C acceptance (portal) | Bypass | When status=confirmed or deposit received, T&C card **hidden**; client may never see portal T&C. |
| Quote Summary PDF (book-from-quote) | Optional download | Has venue, date, artist, fee – separate from T&C dialog. |
| Booking Agreement PDF | Post-acceptance | Venue, date, event type, client name – **no talent/staff info**. |
| Secure booking | Page vs dialog | Page shows venue/date/DJ; T&C dialog is generic. |

---

## 10. Auth Summary

| Route Type | Auth | Status |
|------------|------|--------|
| `/api/admin/*` | requireAdmin | ✅ |
| `/api/contact` | Public, reCAPTCHA where configured | ✅ |
| `/api/inquiries/new`, `/api/public/*` | Public | ✅ |
| `/api/client/bookings/[id]/*` | Token or session | ⚠️ **final-payment-sent has no auth** |
| `/api/client/bookings/[id]/marked-deposit-paid` | Signed link (sig=) | ✅ |
| `/api/bookings/confirm-from-quote` | Quote token in body | ✅ |
| `/api/bookings/accept-terms` | Session (userId) | ✅ |
| `/api/bookings` | Session or user by email | ✅ |
| `/api/orders/create` | Session (getToken) | ✅ |
| `/api/cron/*` | CRON_SECRET (Bearer header) | ✅ |

---

## 11. DB Workflow Fields

| Field | Schema | Updated By |
|-------|--------|------------|
| termsAccepted | ✅ Booking, HireOrder | All T&C routes |
| termsAcceptedAt | ✅ | All T&C routes |
| **termsAcceptedByUserId** | ❌ **Not in schema** | — |
| depositPaidClickedAt | ✅ | marked-deposit-paid |
| depositReceivedManual | ✅ | flexible-update |
| enquiryRepliedAt | ✅ | enquiries/[id]/reply |
| enquiryRepliedByUserId | ✅ | enquiries/[id]/reply |
| finalDetailsConfirmed | ✅ | final-details, final-payment-sent |
| finalDetailsConfirmedManual | ✅ | final-payment-sent |
| emailsSent (JSON) | ✅ | Various (deposit, journey, etc.) |
| portalToken | ✅ | finalize-and-invite |
| briefStatus | ✅ | dispatch |
| status (BookingStaffAssignment) | ✅ | staff/confirm, staff/[id]/cancel, dispatch |

---

## 12. Edge Cases & Bypasses

| Scenario | Bypass? | Notes |
|----------|---------|-------|
| Portal T&C when status=confirmed | ⚠️ Yes | T&C card hidden; treated as accepted |
| Portal T&C when deposit received | ⚠️ Yes | Same |
| Contact form → admin confirms deposit | ⚠️ Yes | Client never sees portal T&C |
| Admin pre-confirmed booking | ⚠️ Yes | T&C card hidden |
| final-payment-sent without auth | 🔴 Yes | Callable by anyone with booking ID |
| Confirm-from-quote | ❌ No | termsAccepted required in body |
| Book DJ / Secure booking | ❌ No | termsAccepted required; submit disabled until checked |
| Idempotent re-accept | ✅ | Portal returns alreadyAccepted: true |
| Archived booking | ✅ | confirm-from-quote 410; accept-terms checks archivedAt |
| Talent added post-acceptance | ⚠️ | No re-accept required |
| Talent swap post-acceptance | ⚠️ | No re-accept or re-disclosure |
| Multiple talent assignments | ✅ | Same route; multiple assignments per booking supported |

---

## 13. Source File Index

| Domain | Key Files |
|--------|-----------|
| **Public** | [app/api/contact/route.ts](app/api/contact/route.ts), [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts), [app/api/public/quote-request/route.ts](app/api/public/quote-request/route.ts), [app/api/public/hire-enquiry/route.ts](app/api/public/hire-enquiry/route.ts), [app/contact-us/ContactForm.tsx](app/contact-us/ContactForm.tsx), [app/request-quote/RequestQuoteClient.tsx](app/request-quote/RequestQuoteClient.tsx) |
| **Admin** | [app/api/admin/send-artist-quote/route.ts](app/api/admin/send-artist-quote/route.ts), [app/api/admin/send-composed-email/route.ts](app/api/admin/send-composed-email/route.ts), [app/api/admin/send-dj-inquiry-reply/route.ts](app/api/admin/send-dj-inquiry-reply/route.ts), [app/api/admin/enquiries/[id]/reply/route.ts](app/api/admin/enquiries/[id]/reply/route.ts), [app/api/admin/new-enquiries/[id]/convert/route.ts](app/api/admin/new-enquiries/[id]/convert/route.ts), [app/api/admin/bookings/[id]/send-deposit-invoice/route.ts](app/api/admin/bookings/[id]/send-deposit-invoice/route.ts), [app/api/admin/bookings/[id]/finalize-and-invite/route.ts](app/api/admin/bookings/[id]/finalize-and-invite/route.ts), [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [app/api/admin/bookings/staff/[id]/cancel/route.ts](app/api/admin/bookings/staff/[id]/cancel/route.ts), [app/api/admin/bookings/[id]/handoff/route.ts](app/api/admin/bookings/[id]/handoff/route.ts), [app/api/admin/bookings/[id]/dispatch/route.ts](app/api/admin/bookings/[id]/dispatch/route.ts), [app/api/admin/bookings/[id]/flexible-update/route.ts](app/api/admin/bookings/[id]/flexible-update/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx), [components/EmailCompositionCenter.tsx](components/EmailCompositionCenter.tsx) |
| **Client** | [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/[id]/accept-terms/route.ts), [app/api/client/bookings/[id]/final-details/route.ts](app/api/client/bookings/[id]/final-details/route.ts), [app/api/client/bookings/[id]/final-payment-sent/route.ts](app/api/client/bookings/[id]/final-payment-sent/route.ts), [app/api/client/bookings/[id]/marked-deposit-paid/route.ts](app/api/client/bookings/[id]/marked-deposit-paid/route.ts), [app/api/client/portal-message/route.ts](app/api/client/portal-message/route.ts), [app/api/client/bookings/[id]/confirm-hire-request/route.ts](app/api/client/bookings/[id]/confirm-hire-request/route.ts), [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts), [app/api/bookings/accept-terms/route.ts](app/api/bookings/accept-terms/route.ts), [app/api/bookings/route.ts](app/api/bookings/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| **T&C** | [components/AcceptTermsModule.tsx](components/AcceptTermsModule.tsx), [lib/terms-content.ts](lib/terms-content.ts), [components/client/ContractFooter.tsx](components/client/ContractFooter.tsx), [lib/booking-agreement-pdf.ts](lib/booking-agreement-pdf.ts), [lib/quote-summary-pdf.ts](lib/quote-summary-pdf.ts) |
| **Cron** | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts), [app/api/cron/send-scheduled-emails/route.ts](app/api/cron/send-scheduled-emails/route.ts), [lib/email-journey-templates.ts](lib/email-journey-templates.ts) |
| **Email** | [lib/email-templates.ts](lib/email-templates.ts), [lib/email/templates.ts](lib/email/templates.ts), [lib/send-deposit-invoice.ts](lib/send-deposit-invoice.ts) |
