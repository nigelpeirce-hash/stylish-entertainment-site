# Admin & Booking Functionality Audit

Comprehensive audit of admin-facing and booking-related functionality for QA review.

---

## 1. Viewing / Updating Bookings or Enquiries

| Step | Route / Component | Purpose | Admin Notification Exists? | Status / Notes | Auth | Source |
|------|-------------------|---------|---------------------------|----------------|------|--------|
| View bookings list | `GET /api/admin/bookings` | List bookings (filter by status) | N/A | Complete | requireAdmin | [app/api/admin/bookings/route.ts](app/api/admin/bookings/route.ts), [app/admin/bookings/page.tsx](app/admin/bookings/page.tsx) |
| View single booking | `GET /api/admin/bookings/[id]` | Booking detail | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/route.ts](app/api/admin/bookings/[id]/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| Update booking | `PATCH /api/admin/bookings/[id]` | Update booking fields | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/route.ts](app/api/admin/bookings/[id]/route.ts) |
| Flexible update (fee, deposit, etc.) | `PATCH /api/admin/bookings/[id]/flexible-update` | Fee, depositReceivedManual, admin notes | N/A | Sends DEPOSIT_CONFIRMED when deposit marked | requireAdmin | [app/api/admin/bookings/[id]/flexible-update/route.ts](app/api/admin/bookings/[id]/flexible-update/route.ts), [components/FlexibleOperatorSidebar.tsx](components/FlexibleOperatorSidebar.tsx) |
| Manual override | `POST /api/admin/bookings/[id]/manual-override` | Override status, deposit, etc. | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/manual-override/route.ts](app/api/admin/bookings/[id]/manual-override/route.ts), [app/admin/90-day-command/page.tsx](app/admin/90-day-command/page.tsx) |
| View new enquiries | `GET /api/admin/new-enquiries` | List NewEnquiry records | N/A | Complete | requireAdmin | [app/api/admin/new-enquiries/route.ts](app/api/admin/new-enquiries/route.ts), [app/admin/new-enquiries/page.tsx](app/admin/new-enquiries/page.tsx) |
| View enquiry detail | `GET /api/admin/new-enquiries/[id]` | Single enquiry | N/A | Complete | requireAdmin | [app/api/admin/new-enquiries/[id]/route.ts](app/api/admin/new-enquiries/[id]/route.ts), [app/admin/new-enquiries/[id]/page.tsx](app/admin/new-enquiries/[id]/page.tsx) |
| View enquiries (kanban) | `GET /api/admin/enquiries` | Enquiry kanban/stats | N/A | Complete | requireAdmin | [app/api/admin/enquiries/route.ts](app/api/admin/enquiries/route.ts), [app/admin/enquiries/page.tsx](app/admin/enquiries/page.tsx) |
| Enquiry emails | `GET /api/admin/enquiries/[id]/emails` | Email history for enquiry | N/A | Complete | requireAdmin | [app/api/admin/enquiries/[id]/emails/route.ts](app/api/admin/enquiries/[id]/emails/route.ts), [components/EnquiryDrawer.tsx](components/EnquiryDrawer.tsx) |
| Audit logs | `GET /api/admin/bookings/[id]/audit-logs` | Activity history for booking | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/audit-logs/route.ts](app/api/admin/bookings/[id]/audit-logs/route.ts), [components/FlexibleOperatorSidebar.tsx](components/FlexibleOperatorSidebar.tsx) |
| Dashboard summary | `GET /api/admin/dashboard-summary` | Admin dashboard stats | N/A | Complete | requireAdmin | [app/api/admin/dashboard-summary/route.ts](app/api/admin/dashboard-summary/route.ts), [app/admin/page.tsx](app/admin/page.tsx) |
| Activity feed | `GET /api/admin/activity` | Recent activity (AuditLog) | N/A | Complete | requireAdmin | [app/api/admin/activity/route.ts](app/api/admin/activity/route.ts), [components/admin/RecentActivityFeed.tsx](components/admin/RecentActivityFeed.tsx) |
| Inbox (threads) | `GET /api/admin/threads`, `GET /api/admin/threads/[id]` | Email inbox | N/A | Complete | requireAdmin | [app/api/admin/threads/route.ts](app/api/admin/threads/route.ts), [app/admin/inbox/page.tsx](app/admin/inbox/page.tsx) |
| Convert enquiry → booking | `POST /api/admin/new-enquiries/[id]/convert` | NewEnquiry → Booking | ❌ **Missing** | No notifyAdmin | requireAdmin | [app/api/admin/new-enquiries/[id]/convert/route.ts](app/api/admin/new-enquiries/[id]/convert/route.ts), [app/admin/new-enquiries/[id]/page.tsx](app/admin/new-enquiries/[id]/page.tsx) |
| Flag booking | `POST /api/admin/bookings/[id]/flag` | Flag for review | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/flag/route.ts](app/api/admin/bookings/[id]/flag/route.ts), [app/admin/bookings/page.tsx](app/admin/bookings/page.tsx) |
| Restore booking | `POST /api/admin/bookings/[id]/restore` | Restore cancelled | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/restore/route.ts](app/api/admin/bookings/[id]/restore/route.ts), [app/admin/bookings/page.tsx](app/admin/bookings/page.tsx) |

---

## 2. Sending Quotes, Emails, Deposit Invoices, Portal Invites

| Step | Route / Component | Purpose | Admin Notification Exists? | Status / Notes | Auth | Source |
|------|-------------------|---------|---------------------------|----------------|------|--------|
| Send artist quote | `POST /api/admin/send-artist-quote` | MultiArtistReply – DJ/musician quote | ✅ notifyAdmin (quote_sent) | Complete | requireAdmin | [app/api/admin/send-artist-quote/route.ts](app/api/admin/send-artist-quote/route.ts), TeamAssignment / admin booking |
| Send composed email | `POST /api/admin/send-composed-email` | EmailCompositionCenter – custom quote | ❌ **Missing** | No AuditLog / notifyAdmin | requireAdmin | [app/api/admin/send-composed-email/route.ts](app/api/admin/send-composed-email/route.ts), [components/EmailCompositionCenter.tsx](components/EmailCompositionCenter.tsx) |
| Send DJ enquiry reply | `POST /api/admin/send-dj-inquiry-reply` | DJ-specific quote | ❌ **Missing** | No notifyAdmin | requireAdmin | [app/api/admin/send-dj-inquiry-reply/route.ts](app/api/admin/send-dj-inquiry-reply/route.ts) |
| Reply to enquiry | `POST /api/admin/enquiries/[id]/reply` | Human reply (ReplyToEnquiryModal) | ❌ **Missing** | No activity feed | requireAdmin | [app/api/admin/enquiries/[id]/reply/route.ts](app/api/admin/enquiries/[id]/reply/route.ts), [components/admin/ReplyToEnquiryModal.tsx](components/admin/ReplyToEnquiryModal.tsx) |
| Send deposit invoice | `POST /api/admin/bookings/[id]/send-deposit-invoice` | “Please pay” deposit email | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/send-deposit-invoice/route.ts](app/api/admin/bookings/[id]/send-deposit-invoice/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| Send deposit confirmation | `POST /api/admin/bookings/[id]/send-deposit-email` | “You’re in” after payment | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/send-deposit-email/route.ts](app/api/admin/bookings/[id]/send-deposit-email/route.ts) |
| Finalize & invite (portal) | `POST /api/admin/bookings/[id]/finalize-and-invite` | Send portal invite | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/finalize-and-invite/route.ts](app/api/admin/bookings/[id]/finalize-and-invite/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| Send portal link | `POST /api/admin/bookings/[id]/send-portal-link` | Resend portal magic link | logActivity only | Complete | requireAdmin | [app/api/admin/bookings/[id]/send-portal-link/route.ts](app/api/admin/bookings/[id]/send-portal-link/route.ts) |
| Send first touch | `POST /api/admin/bookings/[id]/send-first-touch` | Manual thank-you email | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/send-first-touch/route.ts](app/api/admin/bookings/[id]/send-first-touch/route.ts), [app/admin/page.tsx](app/admin/page.tsx) |
| Send resource | `POST /api/admin/send-resource` | Send doc/link to client | N/A | Complete | requireAdmin | [app/api/admin/send-resource/route.ts](app/api/admin/send-resource/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| Inbox: send email | `POST /api/admin/email/send` | Send from inbox | N/A | Complete | requireAdmin | [app/api/admin/email/send/route.ts](app/api/admin/email/send/route.ts), [app/admin/inbox/page.tsx](app/admin/inbox/page.tsx) |

---

## 3. Payment Confirmation & Client Actions (Logging)

| Step | Route / Component | Purpose | Admin Notification Exists? | Status / Notes | Auth | Source |
|------|-------------------|---------|---------------------------|----------------|------|--------|
| Client “I’ve paid” (deposit) | `GET /api/client/bookings/[id]/marked-deposit-paid?sig=...` | Client clicks from email | ✅ Pushover + notifyAdmin | Complete | Public (signed) | [app/api/client/bookings/[id]/marked-deposit-paid/route.ts](app/api/client/bookings/[id]/marked-deposit-paid/route.ts), [lib/deposit-paid-link.ts](lib/deposit-paid-link.ts) |
| Client confirms quote (Book-from-Quote) | `POST /api/bookings/confirm-from-quote` | Client confirms & pays deposit path | ⚠️ **Partial** | Pushover only, no AuditLog | Public (token) | [app/api/bookings/confirm-from-quote/route.ts](app/api/bookings/confirm-from-quote/route.ts), [app/book-from-quote/page.tsx](app/book-from-quote/page.tsx) |
| Client submit final details | `PATCH /api/client/bookings/[id]/final-details` | Music, address, load-in | ✅ Pushover + notifyAdmin | Complete | Client (token) | [app/api/client/bookings/[id]/final-details/route.ts](app/api/client/bookings/[id]/final-details/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| Client “final payment sent” | `POST /api/client/bookings/[id]/final-payment-sent` | Client confirms balance paid | ⚠️ **Partial** | logActivity only, email to DJ; no admin email. **Note:** No token/session validation. | Client (token) | [app/api/client/bookings/[id]/final-payment-sent/route.ts](app/api/client/bookings/[id]/final-payment-sent/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |
| Client portal message | `POST /api/client/portal-message` | Client sends message | ✅ notifyAdmin | Complete | Client (session) | [app/api/client/portal-message/route.ts](app/api/client/portal-message/route.ts) |
| Client confirm hire request | `POST /api/client/bookings/[id]/confirm-hire-request` | Request hire items | logActivity + email to admin | Complete | Client (token) | [app/api/client/bookings/[id]/confirm-hire-request/route.ts](app/api/client/bookings/[id]/confirm-hire-request/route.ts), [components/client/HireShop.tsx](components/client/HireShop.tsx) |
| Client accept terms | `POST /api/client/bookings/[id]/accept-terms` | Accept T&Cs in portal | logActivity | Complete | Client (token/session) | [app/api/client/bookings/[id]/accept-terms/route.ts](app/api/client/bookings/[id]/accept-terms/route.ts), [components/client/PortalView.tsx](components/client/PortalView.tsx) |

---

## 4. Assigning Artists, Sending Briefs, Dispatch

| Step | Route / Component | Purpose | Admin Notification Exists? | Status / Notes | Auth | Source |
|------|-------------------|---------|---------------------------|----------------|------|--------|
| Staff assignment confirm | `POST /api/admin/bookings/staff/confirm` | Assign DJ/staff to booking | ✅ notifyAdmin (artist_assigned) | Complete | requireAdmin | [app/api/admin/bookings/staff/confirm/route.ts](app/api/admin/bookings/staff/confirm/route.ts), [components/admin/TeamAssignment.tsx](components/admin/TeamAssignment.tsx) |
| Staff cancel | `DELETE /api/admin/bookings/staff/[id]` | Cancel staff assignment | N/A | Complete | requireAdmin | [app/api/admin/bookings/staff/[id]/cancel/route.ts](app/api/admin/bookings/staff/[id]/cancel/route.ts) |
| Handoff | `PATCH /api/admin/bookings/[id]/handoff` | Hand off to Ali | ✅ Pushover + notifyAdmin | Complete | requireAdmin | [app/api/admin/bookings/[id]/handoff/route.ts](app/api/admin/bookings/[id]/handoff/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| Dispatch brief | `POST /api/admin/bookings/[id]/dispatch` | Send brief to DJ/staff | ✅ notifyAdmin (dispatched) | Complete | requireAdmin | [app/api/admin/bookings/[id]/dispatch/route.ts](app/api/admin/bookings/[id]/dispatch/route.ts), [app/admin/bookings/[id]/page.tsx](app/admin/bookings/[id]/page.tsx) |
| Internal brief | `GET /api/admin/bookings/[id]/internal-brief` | Fetch brief data (preview) | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/internal-brief/route.ts](app/api/admin/bookings/[id]/internal-brief/route.ts), [app/admin/bookings/[id]/brief/page.tsx](app/admin/bookings/[id]/brief/page.tsx) |
| Warehouse items | `GET/POST /api/admin/bookings/[id]/warehouse-items` | Pick list, items | N/A | Complete | requireAdmin | [app/api/admin/bookings/[id]/warehouse-items/route.ts](app/api/admin/bookings/[id]/warehouse-items/route.ts) |

---

## 5. Post-Event & Cron Jobs

| Step | Route / Component | Purpose | Admin Notification Exists? | Status / Notes | Auth | Source |
|------|-------------------|---------|---------------------------|----------------|------|--------|
| Email journey cron | `GET /api/cron/email-journey` | 3-day reminder, 4-week, week-of, final-chase, **post-wedding-magic**, portal reminder | ❌ **Missing** | No admin notification when post-event email sent | Cron (CRON_SECRET) | [app/api/cron/email-journey/route.ts](app/api/cron/email-journey/route.ts), [lib/email-journey-templates.ts](lib/email-journey-templates.ts) |
| Scheduled emails cron | `GET /api/cron/send-scheduled-emails` | Booking confirmation, final details reminder, payment reminder | N/A | No admin notification (expected) | Cron (CRON_SECRET) | [app/api/cron/send-scheduled-emails/route.ts](app/api/cron/send-scheduled-emails/route.ts) |
| Post-event admin digest | — | Not implemented | ❌ **Missing** | No post-event summary for admin | — | — |

---

## 6. Initial Enquiry (Public Forms) → Admin Visibility

| Step | Route / Component | Purpose | Admin Notification Exists? | Status / Notes | Auth | Source |
|------|-------------------|---------|---------------------------|----------------|------|--------|
| Contact form | `POST /api/contact` | Creates Booking | ✅ Pushover + notifyAdmin | Complete | Public | [app/api/contact/route.ts](app/api/contact/route.ts), [app/contact-us/ContactForm.tsx](app/contact-us/ContactForm.tsx) |
| New enquiry form | `POST /api/inquiries/new` | Creates NewEnquiry | ⚠️ **Partial** | MOBILE_NOTIFICATION_WEBHOOK only; no AuditLog if unset | Public | [app/api/inquiries/new/route.ts](app/api/inquiries/new/route.ts), [app/new-inquiry/page.tsx](app/new-inquiry/page.tsx) |
| Quote request | `POST /api/public/quote-request` | Creates NewEnquiry | ⚠️ **Partial** | Email to admin only; no AuditLog, no Pushover | Public | [app/api/public/quote-request/route.ts](app/api/public/quote-request/route.ts), [app/request-quote/RequestQuoteClient.tsx](app/request-quote/RequestQuoteClient.tsx) |
| Hire enquiry | `POST /api/public/hire-enquiry` | Creates NewEnquiry | ⚠️ **Partial** | Email when hire items; no AuditLog, no Pushover | Public | [app/api/public/hire-enquiry/route.ts](app/api/public/hire-enquiry/route.ts) |

---

## Summary: Gaps & Inconsistencies

### ❌ Missing Admin Notifications (Admin unaware of key events)

| Event | Route / Flow | Impact |
|-------|--------------|--------|
| Quote sent via composition center | `send-composed-email` | No AuditLog; admin activity feed doesn’t show it |
| Quote sent via DJ reply | `send-dj-inquiry-reply` | No AuditLog |
| Human reply to enquiry | `enquiries/[id]/reply` | No activity feed |
| Enquiry converted to booking | `new-enquiries/[id]/convert` | No visibility in activity feed |
| Client confirms quote (Book-from-Quote) | `confirm-from-quote` | Pushover only; no AuditLog |
| Post-event autoresponder sent | `cron/email-journey` | No admin notification |
| Client “final payment sent” | `final-payment-sent` | logActivity only; no admin email (DJ gets email) |
| Client accept terms | `accept-terms` | logActivity exists ✓ |

### ⚠️ Partial Coverage

| Event | Route | Current | Missing |
|-------|-------|---------|---------|
| New enquiry (inquiries/new) | `inquiries/new` | Webhook if configured | AuditLog, Pushover if webhook unset |
| Quote request | `public/quote-request` | Email to admin | AuditLog, Pushover |
| Hire enquiry | `public/hire-enquiry` | Email when items | AuditLog, Pushover |
| Client confirm quote | `confirm-from-quote` | Pushover | AuditLog |

### ✅ Auth Summary

- **Admin routes:** All `/api/admin/*` use `requireAdmin` ✓
- **Public enquiry routes:** No auth (reCAPTCHA on contact where configured)
- **Client routes:** Token (`?token=`) or session; `marked-deposit-paid` uses signed link (`sig=`)
- **Cron:** `CRON_SECRET` when set ✓

### ✅ DB Workflow States

- **Booking:** `status`, `depositReceivedManual`, `depositPaidClickedAt`, `emailsSent`, `lastEmailSentAt`, `finalDetailsConfirmed`
- **NewEnquiry:** `status`, `firstTouchEmailSent`, `enquiryRepliedAt`, `enquiryRepliedByUserId`, `originalBookingId`
- **BookingStaffAssignment:** `status`, `confirmationEmailSent`, `briefStatus`

### ✅ Email Templates Used

- Contact autoresponder: `lib/email-journey-templates`
- First touch: `lib/email/templates` (FIRST_TOUCH)
- Deposit invoice: `lib/email-templates` (depositInvoiceEmail)
- Deposit confirmed: `lib/email-templates` (DEPOSIT_CONFIRMED)
- Post-event: `lib/email-journey-templates` (post-wedding-magic)
- Portal invite: `lib/email/templates` (PORTAL_INVITATION)
- Dispatch: `lib/dispatch-email` (buildDispatchEmailHtml)
