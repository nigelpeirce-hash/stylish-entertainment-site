# Admin & Booking Workflow Audit

Structured audit of admin and booking workflows from initial enquiry to post-event. Ready for QA review and planning fixes.

---

## Full Audit Table

| Step | Route / Component | Purpose | Admin Notification Exists? | Status / Notes | Auth Required | Source File |
|------|-------------------|---------|---------------------------|----------------|---------------|-------------|
| **1a** | `POST /api/contact` | Initial enquiry – creates Booking | ✅ Pushover + notifyAdmin (AuditLog + email) | Complete | Public (reCAPTCHA) | [app/api/contact/route.ts](app/api/contact/route.ts), [app/contact-us/ContactForm.tsx](app/contact-us/ContactForm.tsx), [app/contact/page.tsx](app/contact/page.tsx) |
| **1b** | `POST /api/inquiries/new` | Initial enquiry – creates NewEnquiry | ⚠️ **Partial** | MOBILE_NOTIFICATION_WEBHOOK only; no AuditLog/Pushover if webhook unset | Public | [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts), [app/new-inquiry/page.tsx](app/new-inquiry/page.tsx) |
| **1c** | `POST /api/public/quote-request` | Initial enquiry – creates NewEnquiry (quote_request) | ⚠️ **Partial** | Email to admin only; no AuditLog, no Pushover | Public | [app/api/public/quote-request/route.ts](app/api/public/quote-request/route.ts), [app/request-quote/RequestQuoteClient.tsx](app/request-quote/RequestQuoteClient.tsx) |
| **1d** | `POST /api/public/hire-enquiry` | Initial enquiry – creates NewEnquiry (hire_only) | ⚠️ **Partial** | Email when hire items; no AuditLog, no Pushover | Public | [app/api/public/hire-enquiry/route.ts](app/api/public/hire-enquiry/route.ts) |
| **2a** | `POST /api/admin/send-composed-email` | Admin sends quote via EmailCompositionCenter | ❌ **Missing** | No AuditLog, no notifyAdmin | requireAdmin | [app/api/admin/send-composed-email/route.ts](app/api/admin/send-composed-email/route.ts), [components/EmailCompositionCenter.tsx](components/EmailCompositionCenter.tsx) |
| **2b** | `POST /api/admin/send-dj-inquiry-reply` | Admin sends DJ-specific quote | ❌ **Missing** | No notifyAdmin | requireAdmin | [app/api/admin/send-dj-inquiry-reply/route.ts](app/api/admin/send-dj-inquiry-reply/route.ts) |
| **2c** | `POST /api/admin/enquiries/[id]/reply` | Admin replies to enquiry (ReplyToEnquiryModal) | ❌ **Missing** | No activity feed | requireAdmin | [app/api/admin/enquiries/[id]/reply/route.ts](app/api/admin/enquiries/[id]/reply/route.ts), [components/admin/ReplyToEnquiryModal.tsx](components/admin/ReplyToEnquiryModal.tsx), [components/EnquiryDrawer.tsx](components/EnquiryDrawer.tsx) |
| **2d** | `POST /api/admin/send-artist-quote` | Admin sends artist quote (MultiArtistReply) | ✅ notifyAdmin (quote_sent) | Complete | requireAdmin | [app/api/admin/send-artist-quote/route.ts](app/api/admin/send-artist-quote/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **3** | N/A | Client receives quote email | N/A | Sent by Resend from step 2 routes | — | — |
| **4a** | `GET /api/client/bookings/[id]/marked-deposit-paid?sig=...` | Client clicks "I've paid" from deposit invoice | ✅ Pushover + notifyAdmin | Complete | Public (signed link) | [app/api/client/bookings/[id]/marked-deposit-paid/route.ts](app/api/client/bookings/[id]/marked-deposit-paid/route.ts), [lib/deposit-paid-link.ts](lib/deposit-paid-link.ts) |
| **4b** | `POST /api/bookings/confirm-from-quote` | Client confirms from Book-from-Quote page | ⚠️ **Partial** | Pushover only; no AuditLog | Public (token in body) | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts), [app/book-from-quote/page.tsx](app/book-from-quote/page.tsx) |
| **5** | `POST /api/admin/bookings/staff/confirm` | Assign artists to booking | ✅ notifyAdmin (artist_assigned) | Complete | requireAdmin | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| **5** | `POST /api/admin/bookings/[id]/dispatch` | Send brief to DJ/staff | ✅ notifyAdmin (dispatched) | Complete | requireAdmin | [app/api/admin/bookings/[id]/dispatch/route.ts](app/api/admin/bookings/[id]/dispatch/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| **6** | `PATCH /api/admin/bookings/[id]/handoff` | Hand off booking to Ali | ✅ Pushover + notifyAdmin | Complete | requireAdmin | [app/api/admin/bookings/[id]/handoff/route.ts](app/api/admin/bookings/[id]/handoff/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| **7** | N/A | Event occurs | N/A | No system action | — | — |
| **8** | `GET /api/cron/email-journey` | Post-event autoresponder (post-wedding-magic, 3 days after event) | ❌ **Missing** | No admin notification when sent | Cron (CRON_SECRET) | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts), [lib/email-journey-templates.ts](lib/email-journey-templates.ts) |
| **9** | — | Post-event summary / digest | ❌ **Not implemented** | No automated post-event digest for admin | — | — |
| **10** | `POST /api/admin/new-enquiries/[id]/convert` | Convert NewEnquiry → Booking | ❌ **Missing** | No notifyAdmin | requireAdmin | [app/api/admin/new-enquiries/[id]/convert/route.ts](app/api/admin/new-enquiries/[id]/convert/route.ts), [app/admin/new-enquiries/[id]/page.tsx](app/admin/new-enquiries/[id]/page.tsx) |
| **11** | `POST /api/client/bookings/[id]/final-payment-sent` | Client confirms "I've sent final payment" | ⚠️ **Partial** | logActivity only; email to DJ(s); **no admin email**. **🔴 Insecure: no token/session validation** | None (callable by anyone with booking ID) | [app/api/client/bookings/[id]/final-payment-sent/route.ts](app/api/client/bookings/[id]/final-payment-sent/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |

---

## T&C Acceptance Flow Audit

| Check | Status | Details |
|-------|--------|---------|
| **Route exists** | ✅ | `POST /api/client/bookings/[id]/accept-terms` |
| **Frontend wired** | ✅ | PortalView → AcceptTermsModule → handleAcceptTerms → fetch with token |
| **Auth** | ✅ | Token (`?token=`) or session (user owns booking or admin) |
| **DB updates** | ⚠️ **Partial** | `termsAccepted`, `termsAcceptedAt` updated. **`termsAcceptedByUserId` does NOT exist in schema** |
| **Admin notification** | ⚠️ **Partial** | logActivity (terms_accepted) → AuditLog only. No notifyAdmin, no Pushover, no email |
| **T&C displayed** | ⚠️ **Partial** | AcceptTermsModule shows generic T&C from `lib/terms-content.ts`. **Not client-specific** (no venue, date, fee in dialog) |
| **Client bypass** | ⚠️ **Possible** | For bookings with status=confirmed or depositReceived/depositReceivedManual, T&C card is **hidden** – treated as already accepted. Contact-form bookings can reach confirmed/deposit without ever seeing portal T&C |
| **ContractFooter** | ✅ | Shows "Confirmed" + Download PDF when termsAccepted; "Terms acceptance pending" otherwise |

### T&C Acceptance Routes & Components

| Flow | Component | API | DB Fields |
|------|-----------|-----|-----------|
| **Portal (post-booking)** | PortalView + AcceptTermsModule | `POST /api/client/bookings/[id]/accept-terms` | termsAccepted, termsAcceptedAt |
| **Book from quote** | AcceptTermsModule | `POST /api/bookings/confirm-from-quote` (includes termsAccepted) | termsAccepted, termsAcceptedAt |
| **Book DJ** | AcceptTermsModule | `POST /api/bookings` | termsAccepted, termsAcceptedAt |
| **Secure booking** | Inline checkbox | `POST /api/bookings/accept-terms` | termsAccepted, termsAcceptedAt |

### T&C Gaps

| Gap | Impact |
|-----|--------|
| No `termsAcceptedByUserId` | Cannot track which user accepted (if multiple users have access) |
| No notifyAdmin on portal accept-terms | Admin does not get email/Pushover when client accepts in portal |
| T&C in AcceptTermsModule is generic | Client sees same T&C for all; no personalised venue/date/fee in acceptance dialog |
| Bypass path | Contact form → admin marks deposit → client never sees portal T&C; booking treated as "accepted" |

### Source Files

- [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/[id]/accept-terms/route.ts)
- [components/client/PortalView.tsx](components/client/PortalView.tsx) (lines ~1521–1555)
- [components/AcceptTermsModule.tsx](components/AcceptTermsModule.tsx)
- [lib/terms-content.ts](lib/terms-content.ts)
- [components/client/ContractFooter.tsx](components/client/ContractFooter.tsx)

---

## Highlighted Issues

### 🔴 Security Gaps (Insecure Endpoints)

| Route | Issue | Impact |
|-------|-------|--------|
| `POST /api/client/bookings/[id]/final-payment-sent` | **No token or session validation** | Anyone with a booking ID can trigger this endpoint. Sets `finalDetailsConfirmed` and emails DJ(s). |

### ❌ Missing Admin Notifications (Admin unaware of key events)

| Step | Route / Event | Missing |
|------|---------------|---------|
| 2a | send-composed-email | AuditLog, notifyAdmin |
| 2b | send-dj-inquiry-reply | notifyAdmin |
| 2c | enquiries/[id]/reply | Activity feed |
| 4b | confirm-from-quote | AuditLog (Pushover exists) |
| 8 | cron/email-journey (post-wedding-magic) | Admin notification when post-event email sent |
| 9 | Post-event digest | Feature not implemented |
| 10 | new-enquiries/[id]/convert | notifyAdmin |
| 11 | final-payment-sent | Admin email (DJ gets email; logActivity exists) |
| T&C accept (portal) | accept-terms | logActivity only; no notifyAdmin, no email |

### ⚠️ Partial Coverage

| Step | Route | Current | Missing |
|------|-------|---------|---------|
| 1b | inquiries/new | Webhook if MOBILE_NOTIFICATION_WEBHOOK set | AuditLog, Pushover if webhook unset |
| 1c | public/quote-request | Email to ADMIN_EMAIL | AuditLog, Pushover |
| 1d | public/hire-enquiry | Email when hire items selected | AuditLog, Pushover |
| 4b | confirm-from-quote | Pushover to Ali/Nigel | AuditLog |
| 11 | final-payment-sent | logActivity, email to DJ | Admin email, **auth validation** |

---

## Auth Summary

| Route Type | Auth | Status |
|------------|------|--------|
| `/api/admin/*` | requireAdmin | ✅ All admin routes protected |
| `/api/contact` | Public, reCAPTCHA (where configured) | ✅ |
| `/api/inquiries/new` | Public | ✅ |
| `/api/public/*` | Public | ✅ |
| `/api/client/bookings/[id]/*` | Token or session (except final-payment-sent) | ⚠️ final-payment-sent has no auth |
| `/api/client/bookings/[id]/marked-deposit-paid` | Signed link (sig=) | ✅ |
| `/api/bookings/confirm-from-quote` | Token in body | ✅ |
| `/api/cron/*` | CRON_SECRET when set | ✅ |

---

## DB Workflow Updates (Verified)

| Step | Fields Updated | Table |
|------|----------------|-------|
| 1a | Booking created (status, emailsSent, etc.) | Booking |
| 1b–1d | NewEnquiry created | NewEnquiry |
| 2c | enquiryRepliedAt, enquiryRepliedByUserId | NewEnquiry |
| 4a | depositPaidClickedAt | Booking |
| 4b | termsAccepted, staff assignment, status | Booking, BookingStaffAssignment |
| 5 | status, confirmationEmailSent | BookingStaffAssignment |
| 6 | handoff metadata | Booking |
| 8 | emailsSent.postWeddingMagic | Booking |
| 10 | NewEnquiry.status=converted, originalBookingId; Booking created | NewEnquiry, Booking |
| 11 | finalDetailsConfirmed, finalDetailsConfirmedManual | Booking |

---

## Email Templates Used

| Step | Template / Source |
|------|-------------------|
| 1a | Contact autoresponder, admin notification (inline) |
| 1b | First touch (inline in route) |
| 2a–2d | Custom HTML in routes / EmailCompositionCenter |
| 4a | depositInvoiceEmail (lib/email-templates) – link contains markedPaidUrl |
| 4b | sendDepositInvoiceForBooking → depositInvoiceEmail |
| Deposit confirmed | DEPOSIT_CONFIRMED (lib/email-templates) |
| Portal invite | PORTAL_INVITATION (lib/email/templates) |
| Dispatch | buildDispatchEmailHtml (lib/dispatch-email) |
| 8 | post-wedding-magic (lib/email-journey-templates) |
| 11 | Inline HTML to DJ(s) |

---

## Frontend → Route Wiring

| Component / Page | Route(s) Called |
|------------------|-----------------|
| ContactForm | POST /api/contact |
| contact page | POST /api/contact |
| new-inquiry page | POST /api/inquiries/new |
| RequestQuoteClient | POST /api/public/quote-request |
| EmailCompositionCenter | POST /api/admin/send-composed-email |
| ReplyToEnquiryModal | POST /api/admin/enquiries/[id]/reply, POST .../reply/preview |
| EnquiryDrawer | GET /api/admin/enquiries/[id]/emails, PATCH .../talent-status |
| TeamAssignment | POST /api/admin/bookings/staff/confirm |
| Admin booking page | GET/PATCH /api/admin/bookings/[id], send-deposit-invoice, finalize-and-invite, handoff, dispatch, flexible-update |
| book-from-quote page | POST /api/bookings/confirm-from-quote |
| PortalView | GET /api/client/bookings/[id], PATCH final-details, POST final-payment-sent, accept-terms |
| deposit-paid link (email) | GET /api/client/bookings/[id]/marked-deposit-paid?sig=... |
| Admin new-enquiries [id] | POST /api/admin/new-enquiries/[id]/convert |
