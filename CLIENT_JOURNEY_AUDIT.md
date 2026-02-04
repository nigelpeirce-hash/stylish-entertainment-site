# Client Journey Audit: Enquiry → Post-Event

Audit of the full client journey flow for completeness, correctness, and admin visibility.

**Note:** There is no `/api/admin/enquiries/[id]/send-quote` route in the codebase. Quote sending uses `send-artist-quote`, `send-composed-email`, or `enquiries/[id]/reply`.

---

## "Out of Sync" (MIME / 404 Errors)

If you see:
- `Refused to apply style... MIME type ('text/html') is not a supported stylesheet MIME type`
- `GET .../main-app.js net::ERR_ABORTED 404`
- `Refused to execute script... MIME type ('text/html') is not executable`

**Cause:** Next.js `.next` build cache is corrupted or stale. When chunk requests 404, the server returns an HTML error page; the browser rejects that as CSS/JS due to MIME type.

**Fix:** Stop the dev server, delete `.next`, and restart:
```bash
rm -rf .next && npm run dev
```
(or `npm run build` for production)

---

## Summary

| Step | Admin Notification | Status |
|------|--------------------|--------|
| 1. Client submits enquiry | Varies by form | See table below |
| 2. Admin receives notification | ✅ / ⚠️ / ❌ | Contact form: full. NewEnquiry forms: partial. |
| 3. Admin sends quote | ✅ | AuditLog + email via notifyAdmin |
| 4. Client receives quote | N/A | Email sent by admin action |
| 5. Client pays deposit | ✅ | Pushover + AuditLog (marked-deposit-paid) or Pushover only (confirm-from-quote) |
| 6. Admin receives deposit confirmation | ✅ | Via marked-deposit-paid; confirm-from-quote has Pushover only |
| 7. Admin assigns artists | ✅ | AuditLog + email |
| 8. Admin sends event brief | ✅ | AuditLog + email |
| 9. Event occurs | N/A | No system action |
| 10. Post-event autoresponder | ❌ | No admin notification when sent |
| 11. Admin post-event summary | ❌ | No automated post-event notification |

---

## Detailed Audit Table

| Step | Route / Component | Purpose | Admin Notification Exists? | Status / Notes | Auth Required |
|------|-------------------|---------|---------------------------|----------------|---------------|
| **1a** | `POST /api/contact` | Main contact form (contact-us, contact) – creates Booking | ✅ Pushover (sendNewLeadNotification) + notifyAdminSignificantEvent (AuditLog + email) | Complete | Public |
| **1b** | `POST /api/inquiries/new` | New enquiry form (new-inquiry page) – creates NewEnquiry | ⚠️ MOBILE_NOTIFICATION_WEBHOOK only (optional). No AuditLog, no Pushover if webhook unset | Gap: No notifyAdmin or sendNewLead when webhook not configured | Public |
| **1c** | `POST /api/public/quote-request` | Request-quote page – creates NewEnquiry (quote_request) | ⚠️ Email to ADMIN_EMAIL only. No AuditLog, no Pushover | Gap: Admin email but no activity feed / mobile push | Public |
| **1d** | `POST /api/public/hire-enquiry` | Hire-only enquiry – creates NewEnquiry (hire_only) | ⚠️ Email to admin only when hire items selected. No AuditLog, no Pushover | Gap: Partial notification | Public |
| **2** | Admin dashboard, `/admin/bookings`, `/admin/enquiries`, `/admin/new-enquiries` | Admin views enquiries | N/A | Bookings from /api/contact appear in bookings list. NewEnquiry from 1b/1c/1d appear in new-enquiries / enquiries. | Admin |
| **3** | `POST /api/admin/send-artist-quote` | MultiArtistReply – send quote with artist options | ✅ notifyAdminSignificantEvent (quote_sent) | Complete | Admin |
| **3** | `POST /api/admin/send-composed-email` | EmailCompositionCenter – composed quote email | ❌ No notifyAdminSignificantEvent | Gap: Quote sent but no AuditLog/email for this path | Admin |
| **3** | `POST /api/admin/send-dj-inquiry-reply` | DJInquiryReply – DJ-specific quote | ❌ Not audited in notifyAdmin grep | Check if used; if so, may need notifyAdmin | Admin |
| **3** | `POST /api/admin/enquiries/[id]/reply` | ReplyToEnquiryModal – human reply to enquiry | ❌ No notifyAdmin | Gap: Admin reply to enquiry not in activity feed | Admin |
| **4** | N/A | Client receives quote email | N/A | Sent by Resend from admin actions above | N/A |
| **5a** | `GET /api/client/bookings/[id]/marked-deposit-paid?sig=...` | Client clicks “I've paid” from deposit invoice email | ✅ sendDepositPaidNotification (Pushover) + notifyAdminSignificantEvent | Complete | Public (signed link) |
| **5b** | `POST /api/bookings/confirm-from-quote` | Client confirms from Book-from-Quote page | ⚠️ Pushover (getStaffPushKeys) only. No notifyAdminSignificantEvent, no AuditLog | Gap: No activity feed entry when client confirms quote | Public (token) |
| **6** | Admin marks “Deposit Received” via `PATCH /api/admin/bookings/[id]/flexible-update` | Sets depositReceivedManual, sends DEPOSIT_CONFIRMED email to client | N/A (admin action) | Complete. Deposit confirmation email sent to client. | Admin |
| **7** | `POST /api/admin/bookings/staff/confirm` | Staff assignment confirmation | ✅ notifyAdminSignificantEvent (artist_assigned) | Complete | Admin |
| **7** | `PATCH /api/admin/bookings/[id]/handoff` | Assign to Ali/Husband | ✅ sendHandoffNotification (Pushover) + notifyAdminSignificantEvent | Complete | Admin |
| **8** | `POST /api/admin/bookings/[id]/dispatch` | Send brief to DJ/staff | ✅ notifyAdminSignificantEvent (dispatched) | Complete | Admin |
| **9** | N/A | Event occurs | N/A | No system action | N/A |
| **10** | `GET /api/cron/email-journey` | Cron: sends post-wedding-magic email 3 days after event | ❌ No admin notification when post-event email sent | Gap: Admin has no visibility that post-event autoresponder was sent | Cron (CRON_SECRET) |
| **11** | N/A | Optional post-event admin summary | ❌ Not implemented | Gap: No automated post-event digest for admin | N/A |

---

## Source Files (for QA / Planning)

| Step | Route | API Source | Frontend Source |
|------|-------|------------|-----------------|
| 1a | `/api/contact` | `app/api/contact/route.ts` | `app/contact-us/ContactForm.tsx`, `app/contact/page.tsx` |
| 1b | `/api/inquiries/new` | `app/api/inquiries/new/route.ts` | `app/new-inquiry/page.tsx` |
| 1c | `/api/public/quote-request` | `app/api/public/quote-request/route.ts` | `app/request-quote/RequestQuoteClient.tsx` |
| 1d | `/api/public/hire-enquiry` | `app/api/public/hire-enquiry/route.ts` | Hire pages |
| 3 | `/api/admin/send-artist-quote` | `app/api/admin/send-artist-quote/route.ts` | MultiArtistReply (admin booking) |
| 3 | `/api/admin/send-composed-email` | `app/api/admin/send-composed-email/route.ts` | `components/EmailCompositionCenter.tsx` |
| 3 | `/api/admin/send-dj-inquiry-reply` | `app/api/admin/send-dj-inquiry-reply/route.ts` | — |
| 3 | `/api/admin/enquiries/[id]/reply` | `app/api/admin/enquiries/[id]/reply/route.ts` | `components/admin/ReplyToEnquiryModal.tsx` |
| 5a | `/api/client/bookings/[id]/marked-deposit-paid` | `app/api/client/bookings/[id]/marked-deposit-paid/route.ts` | Link in email (`lib/deposit-paid-link.ts`) |
| 5b | `/api/bookings/confirm-from-quote` | `app/api/bookings/confirm-from-quote/route.ts` | `app/book-from-quote/page.tsx` |
| 6 | `/api/admin/bookings/[id]/flexible-update` | `app/api/admin/bookings/[id]/flexible-update/route.ts` | `app/admin/bookings/[id]/page.tsx` |
| 7 | `/api/admin/bookings/staff/confirm` | `app/api/admin/bookings/staff/confirm/route.ts` | Admin staff UI |
| 7 | `/api/admin/bookings/[id]/handoff` | `app/api/admin/bookings/[id]/handoff/route.ts` | `app/admin/bookings/[id]/page.tsx` |
| 8 | `/api/admin/bookings/[id]/dispatch` | `app/api/admin/bookings/[id]/dispatch/route.ts` | Admin booking page |
| 10 | `/api/cron/email-journey` | `app/api/cron/email-journey/route.ts` | — (cron) |

---

## Additional Routes (Supporting)

| Route | Purpose | Admin Notification | Auth |
|-------|---------|--------------------|------|
| `POST /api/admin/bookings/[id]/send-deposit-invoice` | Send “please pay” deposit invoice | N/A (admin action) | Admin |
| `POST /api/admin/bookings/[id]/finalize-and-invite` | Send portal invite | N/A (admin action) | Admin |
| `POST /api/admin/bookings/[id]/send-first-touch` | Manual first-touch thank-you | N/A (admin action) | Admin |
| `POST /api/admin/new-enquiries/[id]/convert` | Convert NewEnquiry → Booking | ❌ No notifyAdmin | Admin |
| `PATCH /api/client/bookings/[id]/final-details` | Client submits final details (music, etc.) | ✅ Pushover + notifyAdminSignificantEvent | Client (token) |
| `POST /api/client/portal-message` | Client sends message via portal | ✅ notifyAdminSignificantEvent | Client |

---

## Gaps and Recommendations

### Missing Admin Notifications

1. **`/api/inquiries/new`** – Uses optional MOBILE_NOTIFICATION_WEBHOOK. If unset, no Pushover or AuditLog. **Recommendation:** Add notifyAdminSignificantEvent or sendNewLeadNotification for NewEnquiry, similar to contact flow.

2. **`/api/public/quote-request`** and **`/api/public/hire-enquiry`** – Email to admin only. No AuditLog, no Pushover. **Recommendation:** Add notifyAdminSignificantEvent so these appear in activity feed and optionally trigger Pushover.

3. **`/api/admin/send-composed-email`** – Quote sent via composition center but no AuditLog. **Recommendation:** Add notifyAdminSignificantEvent after successful send.

4. **`/api/admin/enquiries/[id]/reply`** – Human reply to enquiry. **Recommendation:** Add notifyAdminSignificantEvent for audit trail (optional; admin performed the action).

5. **`/api/bookings/confirm-from-quote`** – Client confirms quote. Has Pushover but no AuditLog. **Recommendation:** Add notifyAdminSignificantEvent for activity feed consistency.

6. **Post-event autoresponder** – When cron sends post-wedding-magic email, admin is not notified. **Recommendation:** Optionally add low-priority AuditLog or daily digest: “Post-event emails sent: N”.

7. **`/api/admin/new-enquiries/[id]/convert`** – Enquiry converted to booking. **Recommendation:** Add notifyAdminSignificantEvent for “enquiry_converted” visibility.

### Route Authorization

- **Public:** `/api/contact`, `/api/inquiries/new`, `/api/public/quote-request`, `/api/public/hire-enquiry`, `/api/client/bookings/[id]/marked-deposit-paid`, `/api/bookings/confirm-from-quote` – all correctly public with appropriate validation (token, signature, reCAPTCHA where used).
- **Admin:** All `/api/admin/*` routes use `requireAdmin` or equivalent.
- **Cron:** `email-journey` uses `CRON_SECRET` when set.

### Database Workflow States

- **Booking:** `status`, `depositReceivedManual`, `depositPaidClickedAt`, `emailsSent` (JSON), `lastEmailSentAt` – updated at appropriate steps.
- **NewEnquiry:** `firstTouchEmailSent`, `firstTouchEmailSentAt`, `status`, `enquiryRepliedAt`, `enquiryRepliedByUserId` – updated when relevant.
- **BookingStaffAssignment:** `status` (held/dispatched), `confirmationEmailSent` – updated on assign and dispatch.

### Email Templates

- Contact: enquiry autoresponder from `lib/email-journey-templates` (when applicable); admin notification from contact route.
- First touch: `FIRST_TOUCH` from `lib/email/templates`.
- Quote: Custom HTML in send-artist-quote, send-composed-email.
- Deposit invoice: `depositInvoiceEmail` from `lib/email-templates`.
- Deposit confirmed: `DEPOSIT_CONFIRMED` from `lib/email-templates`.
- Post-event: `post-wedding-magic` from `lib/email-journey-templates`.

---

## Frontend Pages → API Mapping

| Page / Component | API Route(s) Called |
|------------------|---------------------|
| `/contact-us` (ContactForm) | `POST /api/contact` |
| `/contact` | `POST /api/contact` |
| `/new-inquiry` | `POST /api/inquiries/new` |
| `/request-quote` (RequestQuoteClient) | `POST /api/public/quote-request` |
| Hire pages (hire enquiry) | `POST /api/public/hire-enquiry` |
| `/book-from-quote` | `POST /api/bookings/confirm-from-quote` |
| Admin booking detail | `GET /api/admin/bookings/[id]`, `PATCH flexible-update`, `POST send-deposit-invoice`, `POST finalize-and-invite`, `POST handoff`, `POST dispatch`, etc. |
| MultiArtistReply | `POST /api/admin/send-artist-quote` |
| EmailCompositionCenter | `POST /api/admin/send-composed-email` |
| ReplyToEnquiryModal | `POST /api/admin/enquiries/[id]/reply`, `POST .../reply/preview` |
| EnquiryDrawer | `GET /api/admin/enquiries/[id]/emails`, `PATCH .../talent-status` |
| Client portal “I've paid” link | `GET /api/client/bookings/[id]/marked-deposit-paid?sig=...` |
