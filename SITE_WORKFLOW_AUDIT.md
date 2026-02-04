# Site-Wide Workflow Audit

Comprehensive audit of all flows from initial enquiry to post-event autoresponder. Ready for QA.

---

## Audit Table

| Domain | Flow / Step | Route / Component | Auth | DB Fields Updated | Admin Notification Exists? | Client Content Displayed? | Notes / Gaps | Source File |
|--------|-------------|-------------------|------|-------------------|---------------------------|---------------------------|--------------|-------------|
| **Public** | Initial enquiry (contact) | `POST /api/contact` | Public (reCAPTCHA) | Booking created; status, emailsSent | ✅ Pushover + notifyAdmin | Autoresponder email to client | Complete | [app/api/contact/route.ts](app/api/contact/route.ts), [app/contact-us/ContactForm.tsx](app/contact-us/ContactForm.tsx) |
| **Public** | Initial enquiry (new) | `POST /api/inquiries/new` | Public | NewEnquiry; firstTouchEmailSent | ⚠️ MOBILE_NOTIFICATION_WEBHOOK only | First touch email to client | No AuditLog/Pushover if webhook unset | [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts), [app/new-inquiry/page.tsx](app/new-inquiry/page.tsx) |
| **Public** | Quote request | `POST /api/public/quote-request` | Public | NewEnquiry | ⚠️ Email to admin only | Success message | No AuditLog, no Pushover | [app/api/public/quote-request/route.ts](app/api/public/quote-request/route.ts), [app/request-quote/RequestQuoteClient.tsx](app/request-quote/RequestQuoteClient.tsx) |
| **Public** | Hire enquiry | `POST /api/public/hire-enquiry` | Public | NewEnquiry | ⚠️ Email when hire items | Success message | No AuditLog, no Pushover | [app/api/public/hire-enquiry/route.ts](app/api/public/hire-enquiry/route.ts) |
| **Admin** | Send artist quote | `POST /api/admin/send-artist-quote` | requireAdmin | — | ✅ notifyAdmin (quote_sent) | Quote email to client | Complete | [app/api/admin/send-artist-quote/route.ts](app/api/admin/send-artist-quote/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **Admin** | Send composed email | `POST /api/admin/send-composed-email` | requireAdmin | — | ❌ **Missing** | Custom email to client | No AuditLog, no notifyAdmin | [app/api/admin/send-composed-email/route.ts](app/api/admin/send-composed-email/route.ts), [components/EmailCompositionCenter.tsx](components/EmailCompositionCenter.tsx) |
| **Admin** | Send DJ reply | `POST /api/admin/send-dj-inquiry-reply` | requireAdmin | — | ❌ **Missing** | DJ quote to client | No notifyAdmin | [app/api/admin/send-dj-inquiry-reply/route.ts](app/api/admin/send-dj-inquiry-reply/route.ts) |
| **Admin** | Reply to enquiry | `POST /api/admin/enquiries/[id]/reply` | requireAdmin | enquiryRepliedAt, enquiryRepliedByUserId | ❌ **Missing** | Reply email to client | No activity feed | [app/api/admin/enquiries/[id]/reply/route.ts](app/api/admin/enquiries/[id]/reply/route.ts), [components/admin/ReplyToEnquiryModal.tsx](components/admin/ReplyToEnquiryModal.tsx) |
| **Admin** | Convert enquiry → booking | `POST /api/admin/new-enquiries/[id]/convert` | requireAdmin | NewEnquiry.status=converted, originalBookingId; Booking created | ❌ **Missing** | — | No notifyAdmin | [app/api/admin/new-enquiries/[id]/convert/route.ts](app/api/admin/new-enquiries/[id]/convert/route.ts), [app/admin/new-enquiries/[id]/page.tsx](app/admin/new-enquiries/[id]/page.tsx) |
| **Admin** | Send deposit invoice | `POST /api/admin/bookings/[id]/send-deposit-invoice` | requireAdmin | emailsSent | N/A | Deposit invoice email (venue, date, fee, markedPaidUrl) | Admin action | [app/api/admin/bookings/[id]/send-deposit-invoice/route.ts](app/api/admin/bookings/[id]/send-deposit-invoice/route.ts), [lib/send-deposit-invoice.ts](lib/send-deposit-invoice.ts) |
| **Admin** | Finalize & invite | `POST /api/admin/bookings/[id]/finalize-and-invite` | requireAdmin | status, portalToken, emailsSent | N/A | Portal invite email | Admin action | [app/api/admin/bookings/[id]/finalize-and-invite/route.ts](app/api/admin/bookings/[id]/finalize-and-invite/route.ts) |
| **Admin** | Assign artist | `POST /api/admin/bookings/staff/confirm` | requireAdmin | BookingStaffAssignment | ✅ notifyAdmin (artist_assigned) | — | Complete | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **Admin** | Handoff | `PATCH /api/admin/bookings/[id]/handoff` | requireAdmin | handoff metadata | ✅ Pushover + notifyAdmin | — | Complete | [app/api/admin/bookings/[id]/handoff/route.ts](app/api/admin/bookings/[id]/handoff/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| **Admin** | Dispatch brief | `POST /api/admin/bookings/[id]/dispatch` | requireAdmin | BookingStaffAssignment.status, briefStatus | ✅ notifyAdmin (dispatched) | Brief email to DJ/staff | Complete | [app/api/admin/bookings/[id]/dispatch/route.ts](app/api/admin/bookings/[id]/dispatch/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| **Admin** | Mark deposit received | `PATCH /api/admin/bookings/[id]/flexible-update` | requireAdmin | depositReceivedManual | N/A | DEPOSIT_CONFIRMED email to client | Admin action | [app/api/admin/bookings/[id]/flexible-update/route.ts](app/api/admin/bookings/[id]/flexible-update/route.ts), [components/FlexibleOperatorSidebar.tsx](components/FlexibleOperatorSidebar.tsx) |
| **Client** | "I've paid" (deposit) | `GET /api/client/bookings/[id]/marked-deposit-paid?sig=...` | Signed link (sig=) | depositPaidClickedAt | ✅ Pushover + notifyAdmin | Redirect to thank-you | Complete | [app/api/client/bookings/[id]/marked-deposit-paid/route.ts](app/api/client/bookings/[id]/marked-deposit-paid/route.ts), [lib/deposit-paid-link.ts](lib/deposit-paid-link.ts) |
| **Client** | Confirm from quote | `POST /api/bookings/confirm-from-quote` | Token in body | termsAccepted, termsAcceptedAt, staff assignment, status | ⚠️ Pushover only | Deposit invoice email | No AuditLog | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts), [app/book-from-quote/page.tsx](app/book-from-quote/page.tsx) |
| **Client** | Accept T&C (portal) | `POST /api/client/bookings/[id]/accept-terms` | Token or session | termsAccepted, termsAcceptedAt | ⚠️ logActivity only | Generic T&C in dialog | No notifyAdmin; **termsAcceptedByUserId missing**; T&C not client-specific | [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/[id]/accept-terms/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| **Client** | Accept T&C (secure) | `POST /api/bookings/accept-terms` | Session (userId) | termsAccepted, termsAcceptedAt | ❌ **Missing** | Generic T&C in dialog | No logActivity, no notifyAdmin | [app/api/bookings/accept-terms/route.ts](app/api/bookings/accept-terms/route.ts), [app/dashboard/secure-booking/page.tsx](app/dashboard/secure-booking/page.tsx) |
| **Client** | Submit final details | `PATCH /api/client/bookings/[id]/final-details` | Token or session | music*, venue*, finalDetailsConfirmed | ✅ Pushover + notifyAdmin | Portal shows booking data | Complete | [app/api/client/bookings/[id]/final-details/route.ts](app/api/client/bookings/[id]/final-details/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| **Client** | "Final payment sent" | `POST /api/client/bookings/[id]/final-payment-sent` | **🔴 None** | finalDetailsConfirmed, finalDetailsConfirmedManual | ⚠️ logActivity only | — | **🔴 Insecure: no auth**; no admin email; DJ gets email | [app/api/client/bookings/[id]/final-payment-sent/route.ts](app/api/client/bookings/[id]/final-payment-sent/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| **Client** | Portal message | `POST /api/client/portal-message` | Session (getToken) | — | ✅ notifyAdmin | — | Complete | [app/api/client/portal-message/route.ts](app/api/client/portal-message/route.ts) |
| **Client** | Confirm hire request | `POST /api/client/bookings/[id]/confirm-hire-request` | Token or session | — | logActivity + email to admin | Hire request sent | Complete | [app/api/client/bookings/[id]/confirm-hire-request/route.ts](app/api/client/bookings/[id]/confirm-hire-request/route.ts), [components/client/HireShop.tsx](components/client/HireShop.tsx) |
| **Cron** | Email journey | `GET /api/cron/email-journey` | CRON_SECRET | emailsSent (3-day, 4-week, week-of, final-chase, post-wedding-magic, portal-reminder) | ❌ **Missing** | Client emails (post-wedding, reminders) | No admin notification when post-event sent | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts), [lib/email-journey-templates.ts](lib/email-journey-templates.ts) |
| **Cron** | Scheduled emails | `GET /api/cron/send-scheduled-emails` | CRON_SECRET | emailsSent | N/A | Confirmation, final details reminder, payment reminder | Expected | [app/api/cron/send-scheduled-emails/route.ts](app/api/cron/send-scheduled-emails/route.ts) |
| — | Post-event digest | — | — | — | ❌ **Not implemented** | — | No automated post-event summary for admin | — |

---

## Security Issues

| Severity | Route | Issue |
|----------|-------|-------|
| 🔴 **High** | `POST /api/client/bookings/[id]/final-payment-sent` | **No token or session validation.** Anyone with a booking ID can call this, set `finalDetailsConfirmed`, and trigger DJ emails. |

---

## Missing Admin Notifications

| Flow | Route / Event | Missing |
|------|---------------|---------|
| Quote sent (composed) | send-composed-email | AuditLog, notifyAdmin |
| Quote sent (DJ reply) | send-dj-inquiry-reply | notifyAdmin |
| Reply to enquiry | enquiries/[id]/reply | Activity feed |
| Enquiry converted | new-enquiries/[id]/convert | notifyAdmin |
| Client confirms quote | confirm-from-quote | AuditLog (Pushover exists) |
| T&C accepted (portal) | accept-terms | notifyAdmin (logActivity exists) |
| T&C accepted (secure) | bookings/accept-terms | logActivity, notifyAdmin |
| Post-event email sent | cron/email-journey | Admin notification |
| Client "final payment sent" | final-payment-sent | Admin email (DJ gets email) |
| New enquiry (inquiries/new) | inquiries/new | AuditLog, Pushover if webhook unset |
| Quote/hire enquiry | public/quote-request, hire-enquiry | AuditLog, Pushover |

---

## Client Content Gaps

| Flow | Content | Issue |
|------|---------|-------|
| T&C acceptance (AcceptTermsModule) | T&C dialog | **Generic** – no venue, date, fee. Same content for all clients. |
| T&C acceptance (portal) | Bypass | When status=confirmed or deposit received, T&C card **hidden**; client may never see portal T&C. |
| Quote summary PDF (book-from-quote) | Optional download | Has venue, date, fee – but separate from T&C dialog. |

---

## DB Workflow Fields

| Field | Schema | Used By |
|-------|--------|---------|
| termsAccepted | ✅ | All T&C flows |
| termsAcceptedAt | ✅ | All T&C flows |
| termsAcceptedByUserId | ❌ **Not in schema** | — |
| depositPaidClickedAt | ✅ | marked-deposit-paid |
| depositReceivedManual | ✅ | flexible-update |
| enquiryRepliedAt | ✅ | enquiries/[id]/reply |
| enquiryRepliedByUserId | ✅ | enquiries/[id]/reply |
| finalDetailsConfirmed | ✅ | final-details, final-payment-sent |
| emailsSent (JSON) | ✅ | Various (deposit, journey, etc.) |

---

## Auth Summary

| Route Type | Auth | Status |
|------------|------|--------|
| `/api/admin/*` | requireAdmin | ✅ |
| `/api/contact` | Public, reCAPTCHA where configured | ✅ |
| `/api/inquiries/new`, `/api/public/*` | Public | ✅ |
| `/api/client/bookings/[id]/*` | Token or session | ⚠️ **final-payment-sent has no auth** |
| `/api/client/bookings/[id]/marked-deposit-paid` | Signed link (sig=) | ✅ |
| `/api/bookings/confirm-from-quote` | Quote token in body | ✅ |
| `/api/bookings/accept-terms` | Session | ✅ |
| `/api/cron/*` | CRON_SECRET | ✅ |

---

## Edge Cases & Bypasses

| Scenario | Bypass? | Notes |
|----------|---------|-------|
| Portal T&C when confirmed/deposit received | ⚠️ Yes | T&C card hidden; treated as accepted |
| Contact form → admin confirms deposit | ⚠️ Yes | Client never sees portal T&C |
| final-payment-sent without auth | 🔴 Yes | Callable by anyone with booking ID |
| Confirm-from-quote | ❌ No | termsAccepted required in body |

---

## Source File Index

| Domain | Key Files |
|--------|-----------|
| Public enquiry | [app/api/contact/route.ts](app/api/contact/route.ts), [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts), [app/api/public/quote-request/route.ts](app/api/public/quote-request/route.ts), [app/api/public/hire-enquiry/route.ts](app/api/public/hire-enquiry/route.ts) |
| Admin | [app/api/admin/send-artist-quote/route.ts](app/api/admin/send-artist-quote/route.ts), [app/api/admin/send-composed-email/route.ts](app/api/admin/send-composed-email/route.ts), [app/api/admin/enquiries/[id]/reply/route.ts](app/api/admin/enquiries/%5Bid%5D/reply/route.ts), [app/api/admin/new-enquiries/[id]/convert/route.ts](app/api/admin/new-enquiries/%5Bid%5D/convert/route.ts) |
| Client portal | [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/%5Bid%5D/accept-terms/route.ts), [app/api/client/bookings/[id]/final-details/route.ts](app/api/client/bookings/%5Bid%5D/final-details/route.ts), [app/api/client/bookings/[id]/final-payment-sent/route.ts](app/api/client/bookings/%5Bid%5D/final-payment-sent/route.ts), [app/api/client/bookings/[id]/marked-deposit-paid/route.ts](app/api/client/bookings/%5Bid%5D/marked-deposit-paid/route.ts) |
| T&C | [components/AcceptTermsModule.tsx](components/AcceptTermsModule.tsx), [lib/terms-content.ts](lib/terms-content.ts), [components/client/ContractFooter.tsx](components/client/ContractFooter.tsx) |
| Cron | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts), [app/api/cron/send-scheduled-emails/route.ts](app/api/cron/send-scheduled-emails/route.ts) |
| Email templates | [lib/email-journey-templates.ts](lib/email-journey-templates.ts), [lib/email-templates.ts](lib/email-templates.ts), [lib/email/templates.ts](lib/email/templates.ts) |
