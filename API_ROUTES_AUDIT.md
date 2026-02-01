# API Routes Audit

**Date:** 2025-01-29  
**Scope:** All `/api/*` routes for client portal, admin/booking backend, public forms, and integrations.

---

## 1. Master Route Table

### 1.1 Auth

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth session & sign-in | Complete | — |
| `/api/auth/check-credentials` | POST | Validate login (email/password) | Complete | — |
| `/api/auth/complete-setup` | POST | Complete invite setup (password) | Complete | — |
| `/api/auth/debug-session` | GET | Debug session (dev) | Complete | Restrict to dev or remove in prod |
| `/api/auth/forgot-password` | POST | Request password reset | Complete | — |
| `/api/auth/register` | POST | User registration (Zod validated) | Complete | — |
| `/api/auth/reset-password` | POST | Set new password from token | Complete | — |
| `/api/auth/validate-invite` | POST | Validate invite token | Complete | — |
| `/api/auth/validate-reset-token` | POST | Validate reset token | Complete | — |

### 1.2 Client portal – bookings list & create

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/client/bookings` | GET | List bookings for logged-in user | Complete | Uses getToken + getServerSession; no portal-token support for “magic link” users listing bookings (they land on single booking URL). OK as-is. |
| `/api/client/bookings` | POST | Create booking from portal (e.g. new booking) | Complete | Same auth as GET. |
| `/api/client/bookings/[id]` | GET | Single booking for portal (countdown, venue, timings) | Complete | Auth: token or session. Good. |

### 1.3 Client portal – booking-scoped actions

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/client/bookings/[id]/accept-terms` | POST | Accept T&Cs | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/confirm-hire-request` | POST | Send hire request email to admin | **Complete** | Auth: token or session (fixed). |
| `/api/client/bookings/[id]/final-details` | PATCH | Submit final details (music, address, etc.) | Complete | Auth, 21-day window, music required, Pushover + admin notification. |
| `/api/client/bookings/[id]/final-payment-sent` | POST | Mark final payment sent | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/guest-requests` | GET | List guest song requests | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/guest-requests` | PATCH | Toggle guest requests on/off | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/guest-requests/[requestId]` | PATCH | Update single guest request (e.g. status) | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/guest-requests/[requestId]/move-to-official` | POST | Move request to official playlist | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/items` | GET | List hire items on booking | **Complete** | Auth: token or session (fixed). |
| `/api/client/bookings/[id]/items` | POST | Add hire item to booking | **Complete** | Auth: token or session (fixed). |
| `/api/client/bookings/[id]/marked-deposit-paid` | GET | Check if deposit marked paid (for UI) | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/music-preferences` | PATCH | Update music (must-plays, do-not-plays, etc.) | Complete | Auth: token or session. Returns `{ ok: true }`; consider `{ success: true }` for consistency. |
| `/api/client/bookings/[id]/payment-details` | GET | Staff bank details within 21-day window | **Complete** | Auth: token or session (fixed). |
| `/api/client/bookings/[id]/send-guest-invites` | POST | Send guest invite emails (multipart) | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/tasks` | PATCH | Toggle task completed | **Complete** | Auth: token or session (fixed). |
| `/api/client/bookings/[id]/threads` | GET | List email threads for booking | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/upload-hero-image` | POST, DELETE | Upload/delete hero image | Complete | Auth: token or session. |
| `/api/client/bookings/[id]/upload-music-file` | POST | Upload music file URL | Complete | Auth: token or session. |

### 1.4 Client portal – missing routes (referenced by front-end)

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/client/bookings/[id]/addons` | (GET/POST implied) | Add-ons / concierge | **Missing** | Used by `AddOnConcierge.tsx`. Either implement GET/POST (with auth) or remove/repurpose component. |
| `/api/client/bookings/[id]/music` | (GET/PATCH implied) | Playlist / music (alternate) | **Missing** | Used by `MusicPlaylistManager.tsx`. Prefer wiring component to existing `music-preferences` (PATCH) and booking payload (GET from `/api/client/bookings/[id]`). |
| `/api/client/bookings/[id]/budget` | (GET/PATCH implied) | Budget | **Missing** | Used by `BudgetTracker.tsx`. Add GET/PATCH with auth, or read `budget` from `/api/client/bookings/[id]` and add PATCH field in final-details or dedicated budget route. |
| `/api/client/bookings/[id]/timeline` | GET | Event timeline | **Missing** | Used by `EventTimeline.tsx`. Add GET (auth) or derive from booking + staffAssignments in existing GET booking. |
| `/api/client/bookings/[id]/guests` | (GET/PATCH implied) | Guest count | **Missing** | Used by `GuestCountTracker.tsx`. Add GET/PATCH with auth, or use `numberOfGuests` from booking GET and allow update via final-details or dedicated route. |

### 1.5 Client portal – profile & misc

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/client/check-ip-recognition` | POST | Check IP for recognition | Complete | — |
| `/api/client/delete-account` | POST | Delete own account | Complete | Session only. |
| `/api/client/ip-lookup` | (implied) | IP lookup | Present | — |
| `/api/client/portal-message` | POST | Send message from portal | Complete | — |
| `/api/client/profile` | GET, PUT | Get/update profile | Complete | getToken + getServerSession. |
| `/api/client/threads` | GET | List threads (client context) | Complete | — |
| `/api/client/threads/[id]` | GET | Single thread | Complete | — |

### 1.6 Guest-facing (token-based, no login)

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/guest-requests/[token]` | GET | Get guest request page data by token | Complete | Token in path. |
| `/api/guest-requests/[token]/songs` | POST | Add song request | Complete | Validation, 3-song limit, duplicate check, session cookie. |
| `/api/guest-requests/[token]/songs` | DELETE | Remove own song (query id) | Complete | Session-scoped. |
| `/api/guest/music/[token]` | GET, POST | Guest music page by token | Complete | — |
| `/api/public/bookings/[token]/guest-request` | POST | Submit guest request (alternate) | Complete | — |

### 1.7 Public (no auth)

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/contact` | POST | Contact form | Complete | — |
| `/api/contact/audit` | GET | Contact audit (consider protecting) | Complete | Add admin auth if sensitive. |
| `/api/contact/update` | POST | Update contact (e.g. preferences) | Complete | — |
| `/api/public/hire-enquiry` | POST | Hire enquiry form | Complete | — |
| `/api/public/quote-request` | POST | Quote request form | Complete | — |

### 1.8 Bookings (mixed: public + session)

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/bookings` | POST | Create booking (e.g. post-DJ flow) | Complete | Session optional; Zod validated; TODO: confirmation email. |
| `/api/bookings/accept-terms` | POST | Accept terms (body: bookingId etc.) | Complete | — |
| `/api/bookings/confirm-from-quote` | POST | Confirm booking from quote | Complete | — |
| `/api/bookings/send-email` | POST | Send booking email (bookingId, emailType) | Complete | Uses getServerSession(); consider requireAdmin for production. |

### 1.9 Confirm brief (staff/artist token)

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/confirm-brief/[token]` | GET | Show brief confirmation page | Complete | Token in path. |
| `/api/confirm-brief/[token]` | POST | Submit brief acknowledgment | Complete | — |

### 1.10 Cart & orders

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/cart` | GET | Get/create cart (user or sessionId) | Complete | getToken + sessionId. |
| `/api/cart` | POST | Add item to cart | Complete | Zod validated. |
| `/api/cart` | PUT | Update cart item | Complete | — |
| `/api/cart` | DELETE | Remove cart item | Complete | — |
| `/api/orders/create` | POST | Create order from cart | Complete | — |
| `/api/book-from-quote` | GET | Book-from-quote flow | Complete | — |

### 1.11 Public data (read-only)

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/djs` | GET | List DJs (public) | Complete | — |
| `/api/musicians` | GET | List musicians (public) | Complete | — |
| `/api/hire-items` | GET | List hire items | Complete | — |
| `/api/service-quote-items` | GET | Service quote items (e.g. by category) | Complete | — |
| `/api/venues/search` | GET | Venue search (q) | Complete | — |
| `/api/spotify/search` | GET | Spotify search | Complete | — |
| `/api/book-dj/quote` | GET | Quote by token | Complete | — |
| `/api/google-reviews` | GET | Google reviews | Complete | — |

### 1.12 Admin – bookings

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/admin/bookings` | GET | List bookings (filter, pagination) | Complete | requireAdmin. |
| `/api/admin/bookings/[id]` | GET | Single booking full | Complete | — |
| `/api/admin/bookings/[id]` | PATCH | Update booking | Complete | — |
| `/api/admin/bookings/[id]` | DELETE | Soft delete / archive | Complete | — |
| `/api/admin/bookings/90-day-command` | GET, PATCH | 90-day view / bulk update | Complete | — |
| `/api/admin/bookings/audit-logs` | (n/a) | — | — | Under [id]. |
| `/api/admin/bookings/[id]/audit-logs` | GET | Booking audit logs | Complete | — |
| `/api/admin/bookings/bulk-delete` | POST | Bulk delete | Complete | — |
| `/api/admin/bookings/check-conflicts` | GET, POST | Check booking conflicts | Complete | — |
| `/api/admin/bookings/check-dates` | GET | Diagnostic date check | Complete | getServerSession admin. |
| `/api/admin/bookings/conflicts/count` | GET | Conflict count | Complete | — |
| `/api/admin/bookings/[id]/dispatch` | POST | Dispatch brief to DJ/staff | Complete | requireAdmin; email + notifyAdminSignificantEvent. |
| `/api/admin/bookings/[id]/finalize-and-invite` | POST | Finalize & send portal invite | Complete | requireAdmin; skip if deposit confirmed. |
| `/api/admin/bookings/[id]/flag` | PATCH | Flag booking | Complete | — |
| `/api/admin/bookings/[id]/flexible-update` | PATCH | Flexible field update | Complete | — |
| `/api/admin/bookings/[id]/handoff` | PATCH | Handoff state | Complete | — |
| `/api/admin/bookings/[id]/internal-brief` | GET | Internal brief data | Complete | — |
| `/api/admin/bookings/[id]/link-email` | POST | Link email to booking | Complete | — |
| `/api/admin/bookings/[id]/locked-event-data` | GET | Locked event data for templates | Complete | — |
| `/api/admin/bookings/[id]/manual-override` | PATCH | Manual override | Complete | — |
| `/api/admin/bookings/[id]/resolve-conflict` | POST | Resolve conflict | Complete | — |
| `/api/admin/bookings/[id]/restore` | POST | Restore archived | Complete | — |
| `/api/admin/bookings/[id]/send-deposit-email` | POST | Send deposit email | Complete | — |
| `/api/admin/bookings/[id]/send-deposit-invoice` | POST | Send deposit invoice | Complete | — |
| `/api/admin/bookings/[id]/send-first-touch` | POST | First touch email | Complete | — |
| `/api/admin/bookings/[id]/send-portal-link` | POST | Send portal link | Complete | — |
| `/api/admin/bookings/[id]/send-test-email` | POST | Send test email | Complete | — |
| `/api/admin/bookings/[id]/split-whatsapp-thread` | POST | Split WhatsApp thread | Complete | — |
| `/api/admin/bookings/[id]/warehouse-items` | GET, POST, DELETE | Warehouse items for booking | Complete | — |
| `/api/admin/bookings/[id]/whatsapp-messages` | GET | WhatsApp messages | Complete | — |
| `/api/admin/bookings/staff/confirm` | POST | Confirm staff assignment | Complete | — |
| `/api/admin/bookings/staff/[id]` | DELETE | Remove staff assignment | Complete | — |
| `/api/admin/bookings/staff/[id]/cancel` | POST | Cancel assignment | Complete | — |

### 1.13 Admin – enquiries, new enquiries, email, inbox, templates

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/admin/enquiries` | GET | List enquiries | Complete | — |
| `/api/admin/enquiries/[id]/emails` | GET | Emails for enquiry | Complete | — |
| `/api/admin/enquiries/[id]/status` | PATCH | Update status | Complete | — |
| `/api/admin/enquiries/[id]/talent-status` | GET, PATCH | Talent status | Complete | — |
| `/api/admin/enquiries/stats` | GET | Enquiry stats | Complete | — |
| `/api/admin/new-enquiries` | GET | List new enquiries | Complete | — |
| `/api/admin/new-enquiries/[id]` | GET | Single new enquiry | Complete | — |
| `/api/admin/new-enquiries/[id]/convert` | POST | Convert to booking | Complete | — |
| `/api/admin/new-enquiries/[id]/review` | PATCH | Mark reviewed | Complete | — |
| `/api/admin/new-enquiries/[id]/status` | PATCH | Update status | Complete | — |
| `/api/admin/email/audit` | GET | Email audit | Complete | — |
| `/api/admin/email/send` | POST | Send email | Complete | — |
| `/api/admin/email/sync` | POST | Sync emails | Complete | — |
| `/api/admin/email-templates` | GET, POST | List/create templates | Complete | — |
| `/api/admin/email-templates/[id]` | (GET, PATCH, DELETE) | Single template | Complete | — |
| `/api/admin/email-templates/[id]/preview` | POST | Preview template | Complete | — |
| `/api/admin/email-templates/[id]/send` | POST | Send from template | Complete | — |
| `/api/admin/inboxes` | GET, POST | Inboxes | Complete | — |
| `/api/admin/inboxes/[id]` | PUT, DELETE | Update/delete inbox | Complete | — |
| `/api/admin/inboxes/[id]/folders` | GET | Folders | Complete | — |
| `/api/admin/inboxes/test-connection` | POST | Test inbox connection | Complete | — |
| `/api/admin/threads` | GET | List threads | Complete | — |
| `/api/admin/threads/[id]` | GET, PATCH | Single thread | Complete | — |
| `/api/admin/threads/[id]/move` | POST | Move thread | Complete | — |
| `/api/admin/sync-emails` | POST | Trigger sync | Complete | — |

### 1.14 Admin – staff, users, venues, warehouse, etc.

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/admin/activity` | GET | Activity feed | Complete | — |
| `/api/admin/breadcrumb-data` | GET | Breadcrumb data | Complete | — |
| `/api/admin/calculate-mileage` | POST | Calculate mileage | Complete | — |
| `/api/admin/dashboard-summary` | GET | Dashboard summary | Complete | — |
| `/api/admin/db-audit` | GET | DB audit (table info) | Complete | — |
| `/api/admin/djs` | GET, POST | List/create DJs | Complete | — |
| `/api/admin/djs/[id]` | GET, PUT, DELETE | Single DJ | Complete | — |
| `/api/admin/freelance-crew` | GET, POST | List/create crew | Complete | — |
| `/api/admin/freelance-crew/[id]` | GET, PUT, DELETE | Single crew | Complete | — |
| `/api/admin/freelance-crew/add` | POST | Add crew (alternate) | Complete | — |
| `/api/admin/freelance-crew/search` | GET | Search crew | Complete | — |
| `/api/admin/fix-triggers` | POST | Fix DB triggers | Complete | — |
| `/api/admin/hire-items` | GET | List hire items | Complete | — |
| `/api/admin/hire-items/[id]` | GET, PUT, DELETE | Single hire item | Complete | — |
| `/api/admin/hire-items/seed` | POST, DELETE | Seed hire items | Complete | — |
| `/api/admin/make-admin` | POST | Make user admin | Complete | — |
| `/api/admin/musicians` | GET, POST | List/create musicians | Complete | — |
| `/api/admin/musicians/[id]` | GET, PUT, DELETE | Single musician | Complete | — |
| `/api/admin/orders` | GET | List orders | Complete | — |
| `/api/admin/orders/[id]` | GET, PATCH? | Single order | Complete | — |
| `/api/admin/send-artist-quote` | POST | Send artist quote | Complete | — |
| `/api/admin/send-composed-email` | POST | Send composed email | Complete | — |
| `/api/admin/send-dj-inquiry-reply` | POST | Send DJ inquiry reply | Complete | — |
| `/api/admin/send-resource` | POST | Send resource | Complete | — |
| `/api/admin/staff` | GET, POST | List/create staff | Complete | — |
| `/api/admin/staff/[id]` | GET, PUT, DELETE | Single staff | Complete | — |
| `/api/admin/users` | GET, PATCH, DELETE | Users | Complete | — |
| `/api/admin/users/invite` | POST | Invite user | Complete | — |
| `/api/admin/venue-assets/upload` | POST | Upload venue asset | Complete | — |
| `/api/admin/venues` | GET | List venues | Complete | — |
| `/api/admin/venues/details` | GET | Venue details (name/postcode) | Complete | — |
| `/api/admin/warehouse-items` | GET, POST | Warehouse items | Complete | — |
| `/api/admin/check-recent-bookings` | GET | Check recent bookings | Complete | — |
| `/api/admin/create-booking-from-email` | POST | Create booking from email | Complete | — |
| `/api/admin/sandbox/client-portal` | POST | Sandbox client portal | Complete | — |
| `/api/admin/sandbox/book-from-quote` | POST | Sandbox book-from-quote | Complete | — |
| `/api/admin/service-quote-items` | GET, POST | Service quote items | Complete | — |
| `/api/admin/service-quote-items/[id]` | PATCH, DELETE | Single service quote item | Complete | — |

### 1.15 Cron & scheduled

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/cron/email-journey` | GET | Journey emails (reminders, chase, etc.) | Complete | CRON_SECRET recommended. |
| `/api/cron/monday-brief` | GET | Monday brief | Complete | — |
| `/api/cron/send-scheduled-emails` | GET | Send scheduled emails | Complete | — |
| `/api/cron/sync-emails` | GET | Sync emails | Complete | — |

### 1.16 Integrations

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/whatsapp/send` | POST | Send WhatsApp message | Complete | — |
| `/api/whatsapp/webhook` | POST | WhatsApp webhook | Complete | Verify signature. |
| `/api/send-email` | POST | Send email (generic) | Complete | — |
| `/api/rescue/[id]/extend-retention` | POST | Extend retention (lead rescue) | Complete | — |
| `/api/track-download` | (GET/POST?) | Track download | Present | Verify method and auth. |

### 1.17 Test / debug (consider disabling in production)

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/debug-env` | GET | Debug env | Present | Disable or protect in prod. |
| `/api/debug-folders` | GET | Debug folders | Present | Disable or protect in prod. |
| `/api/test/create-test-booking` | POST | Create test booking | Present | Disable in prod. |
| `/api/test-booking-creation` | POST | Test booking creation | Present | Disable in prod. |
| `/api/test-db` | GET? | Test DB | Present | Disable in prod. |
| `/api/test-email` | GET | Test email | Present | Disable in prod. |
| `/api/test-resend` | GET, POST | Test Resend | Present | Disable in prod. |
| `/api/check-email-status` | GET | Check email status | Present | — |
| `/api/demo/guest-requests-links` | GET | Demo guest request links | Present | Restrict to dev/demo. |

### 1.18 Other

| Route path | HTTP method | Purpose | Status | Fixes / recommendations |
|------------|-------------|---------|--------|-------------------------|
| `/api/inquiries/new` | POST | New inquiry form | Complete | — |

---

## 2. Summary: Missing or Incomplete Endpoints

| Item | Type | Action | Done |
|------|------|--------|------|
| `/api/client/bookings/[id]/items` GET/POST | ~~No auth~~ | Add token or session check. | ✅ Fixed |
| `/api/client/bookings/[id]/payment-details` GET | ~~No auth~~ | Add token or session check. | ✅ Fixed |
| `/api/client/bookings/[id]/confirm-hire-request` POST | ~~No auth~~ | Add token or session check. | ✅ Fixed |
| `/api/client/bookings/[id]/tasks` PATCH | ~~Session only~~ | Add portal token support. | ✅ Fixed |
| `/api/client/bookings/[id]/addons` | **Missing** | Implement with auth or remove AddOnConcierge usage. | — |
| `/api/client/bookings/[id]/music` | **Missing** | Wire MusicPlaylistManager to `music-preferences` + booking GET, or add thin GET/PATCH. |
| `/api/client/bookings/[id]/budget` | **Missing** | Add GET/PATCH with auth or expose budget in booking GET + final-details. |
| `/api/client/bookings/[id]/timeline` | **Missing** | Add GET with auth or derive from booking + staffAssignments. |
| `/api/client/bookings/[id]/guests` | **Missing** | Add GET/PATCH with auth or use numberOfGuests from booking + final-details. |

---

## 3. Consistency: Request/Response & Error Handling

### 3.1 Success response shape

- **Inconsistent:** Some routes return `{ success: true }`, others `{ ok: true }`, others `{ booking }` / `{ items }` without a top-level success flag.
- **Recommendation:** Standardise success as `{ success: true, ...data }` for mutations; for GET, `{ ...data }` is fine. Optionally add a small shared helper.

### 3.2 Error response shape

- Most routes use `NextResponse.json({ error: "..." }, { status })`. Some add `details` or `message`.
- **Recommendation:** Use a single shape, e.g. `{ error: string, details?: unknown }` for 4xx/5xx, and document it for the front-end.

### 3.3 Validation

- **Good:** `/api/bookings` POST and `/api/cart` use Zod. Many admin routes validate required body fields manually.
- **Gaps:** Some client PATCH routes accept partial bodies without schema; consider Zod for critical payloads (e.g. final-details, music-preferences) for consistent validation and error messages.

### 3.4 Params handling

- Many dynamic routes use `params instanceof Promise ? await params : params` for Next 15 compatibility. Consistent and correct.

---

## 4. Auth consistency (client portal)

- **Mixed usage:** `auth()` (NextAuth), `getServerSession(request)`, `getServerSession()` (no request), `getToken()`.
- **Client booking routes:** Most use `auth()` and allow either `?token=portalToken` or session (user owns booking or admin). Good.
- **Gaps (remaining):**  
  - `client/bookings/route.ts` and `client/profile/route.ts` use `getToken()` + `getServerSession()` without passing `request` in some places. Prefer passing `request` where available.  
  - **Fixed:** `client/bookings/[id]/tasks`, `items`, `payment-details`, and `confirm-hire-request` now use token-or-session auth.

---

## 5. Client portal ↔ API verification

| Client action | Route used | Status |
|---------------|------------|--------|
| Load booking (countdown, details) | GET `/api/client/bookings/[id]` | OK |
| Accept terms | POST `/api/client/bookings/[id]/accept-terms` | OK |
| Load guest requests | GET `/api/client/bookings/[id]/guest-requests` | OK |
| Toggle guest requests / update request / move to official | PATCH/POST as above | OK |
| Send guest invites | POST `/api/client/bookings/[id]/send-guest-invites` | OK |
| Music preferences | PATCH `/api/client/bookings/[id]/music-preferences` | OK (component may call non-existent `/music`) |
| Upload music file | POST `/api/client/bookings/[id]/upload-music-file` | OK |
| Hero image upload/delete | POST/DELETE `/api/client/bookings/[id]/upload-hero-image` | OK |
| Final details submit | PATCH `/api/client/bookings/[id]/final-details` | OK |
| Final payment sent | POST `/api/client/bookings/[id]/final-payment-sent` | OK |
| Payment details (staff bank) | GET `/api/client/bookings/[id]/payment-details` | OK (auth added; PortalView passes token). |
| Hire shop – list/add items | GET/POST `/api/client/bookings/[id]/items` | OK (auth added; HireShop accepts `portalToken`). |
| Confirm hire request | POST `/api/client/bookings/[id]/confirm-hire-request` | OK (auth added; HireShop passes token). |
| Tasks (complete/undo) | PATCH `/api/client/bookings/[id]/tasks` | OK (portal token support added). |
| Add-ons (concierge) | GET/POST `/api/client/bookings/[id]/addons` | **Missing** – implement or remove |
| Music playlist (alternate UI) | `/api/client/bookings/[id]/music` | **Missing** – use music-preferences + booking |
| Budget | `/api/client/bookings/[id]/budget` | **Missing** – implement or use booking.budget |
| Timeline | GET `/api/client/bookings/[id]/timeline` | **Missing** – implement or derive |
| Guest count | GET/PATCH `/api/client/bookings/[id]/guests` | **Missing** – implement or use numberOfGuests |

---

## 6. Admin / backend ↔ API verification

- **Dashboard:** Uses `/api/admin/dashboard-summary`, `/api/admin/activity`, `/api/admin/bookings`, `/api/admin/sync-emails`, `/api/admin/bookings/[id]/send-first-touch`. OK.
- **Booking detail:** Uses GET/PATCH `/api/admin/bookings/[id]`, handoff, send-resource, flexible-update, finalize-and-invite, send-deposit-invoice, dispatch, venues, venues/details. OK.
- **Email/notifications:** Dispatch uses `notifyAdminSignificantEvent`; final-details (client) uses Pushover + `notifyAdminSignificantEvent`. Email journey cron sends reminders and chase emails. OK.
- **Staff/crew:** Staff confirm, cancel, freelance-crew, search, add. OK.
- **Enquiries / new enquiries:** List, status, talent-status, convert, review. OK.
- **Inbox:** Threads, move, email-templates, send, sync. OK.
- **Warehouse/technical:** Warehouse-items, hire-items. OK.
- **Conflict resolution:** check-conflicts, link-email, resolve-conflict. OK.

Data flows into admin dashboards and email/notification triggers are in place for the audited flows.

---

## 7. Recommended fix order

1. **Security (high):** Add auth (token or session) to:
   - `GET/POST /api/client/bookings/[id]/items`
   - `GET /api/client/bookings/[id]/payment-details`
   - `POST /api/client/bookings/[id]/confirm-hire-request`
2. **Portal parity:** Add portal token support to `PATCH /api/client/bookings/[id]/tasks`.
3. **Missing routes:** Implement or replace:
   - addons (or remove component),
   - budget/timeline/guests (or derive from existing booking GET + final-details),
   - music (wire to music-preferences + booking).
4. **Consistency:** Standardise success/error response shape and use Zod where useful for client mutations.
5. **Production:** Restrict or remove test/debug routes (debug-env, debug-folders, test-booking-creation, test-email, test-resend, demo, etc.) in production.

---

## 8. Checklist for developer

- [x] Add auth to client booking items (GET/POST). **Done**
- [x] Add auth to client payment-details (GET). **Done**
- [x] Add auth to client confirm-hire-request (POST). **Done**
- [x] Add portal token support to client tasks (PATCH). **Done**
- [ ] Implement or remove addons, budget, timeline, guests, and music (or wire to existing APIs).
- [ ] Standardise API success/error response format.
- [ ] Ensure all client mutation routes use Zod or explicit validation and return consistent errors.
- [ ] Disable or protect test/debug endpoints in production.
- [ ] Document cron endpoints (email-journey, monday-brief, etc.) and ensure CRON_SECRET is set where used.

This audit gives a full, actionable map of API routes with clear fixes and improvements so the client portal and admin workflows can be made fully reliable and secure.

---

## 9. Implementation status (security fixes applied)

| Fix | Route(s) | Status |
|-----|----------|--------|
| Auth (token or session) | `GET/POST /api/client/bookings/[id]/items` | ✅ Implemented |
| Auth (token or session) | `GET /api/client/bookings/[id]/payment-details` | ✅ Implemented |
| Auth (token or session) | `POST /api/client/bookings/[id]/confirm-hire-request` | ✅ Implemented |
| Portal token support | `PATCH /api/client/bookings/[id]/tasks` | ✅ Implemented |
| Front-end: pass token | PortalView payment-details fetch | ✅ URL includes `?token=` when in portal with token |
| Front-end: pass token | HireShop: items + confirm-hire-request | ✅ `portalToken` prop added; callers should pass it when rendering HireShop in portal |
