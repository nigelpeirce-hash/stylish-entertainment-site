# Book-from-Quote UX – Plan

## Problem

When a **DJ** or **Musician** quote email is sent, the **"Book Your DJ"** / **"Book Your Musician"** CTA currently opens a **mailto** link (client’s email client). We want:

- The CTA to go to a **dedicated Book-from-Quote page** on the site.
- The page to be **pre-filled** with their details (from the quote).
- The client to **edit** any fields (e.g. typo in name, wrong date).
- On submit: **confirm the quote** → update the booking, assign artist, trigger notifications, and have it **logged** (audit, 90‑day countdown, etc.).

---

## Current Flow

| Step | What happens |
|------|----------------|
| 1 | Enquiry arrives → **Booking** created (e.g. via contact form / manual). |
| 2 | Admin sends **DJ reply** (`send-dj-inquiry-reply`) or **Artist quote** (`send-artist-quote`) to client. |
| 3 | Email contains **"Book Your DJ"** / **"Book Your Musician"** → `mailto:info@...?subject=...`. |
| 4 | Client clicks → **email client** opens. No structured confirmation on the website. |

**Existing assets:**

- **DJ reply**: `DJInquiryReply` → `POST /api/admin/send-dj-inquiry-reply`. Uses `bookingId`, `clientEmail`, `clientName`, `venueName`, `eventDate`, `djName`, `djFee`, etc.
- **Artist quote**: `MultiArtistReply` → `POST /api/admin/send-artist-quote`. Uses `bookingId`, `clientEmail`, `clientName`, `venueName`, `eventDate`, `artistType` (dj/musician), `options` (artists + fees).
- **Book DJ page**: `/book-dj` → `POST /api/bookings` creates a **new** booking. No quote/prefill flow.

---

## Proposed Flow

| Step | What happens |
|------|----------------|
| 1 | Admin sends DJ reply or Artist quote (unchanged). |
| 2 | When sending, we **generate a secure quote token** (e.g. JWT) and **replace the mailto CTA** with a link:  
     `https://yoursite.com/book-from-quote?token=...` |
| 3 | Client clicks **"Book Your DJ"** / **"Book Your Musician"** → lands on **Book-from-Quote** page. |
| 4 | Page loads → `GET /api/book-from-quote?token=...` validates token, returns **booking + quote** data for prefill. |
| 5 | Form is **pre-filled** (name, email, phone, event date, venue, chosen artist). All fields **editable**. |
| 6 | Client submits → `POST /api/bookings/confirm-from-quote` (token + form). Backend **updates** the existing booking, assigns staff, sends notifications. |
| 7 | Success → e.g. “Thanks, we’ve confirmed your booking” + optional link to portal/countdown. |
| 8 | Booking **stays in 90‑day** (already exists); **audit** / **notifications** record the confirmation. |

---

## Create New vs Update Existing Booking?

You mentioned **“creates a new booking”**. The quote is tied to an **existing** booking (`bookingId`). Two options:

- **A. Update existing booking (recommended)**  
  Confirm the quote on the **same** booking: update details if edited, set staff assignment, maybe move status to e.g. `quote_accepted` or `confirmed`. No duplicate rows. 90‑day, audit, notifications all work as today.

- **B. Create new “confirmed” booking**  
  Create a **new** `Booking` row when they confirm, and link or supersede the original (e.g. enquiry → confirmed booking). More logic and data duplication.

**Recommendation:** **A (update existing)**. If you prefer B, we can switch and add a supersede/link strategy.

---

## Implementation Outline

### 1. Quote token

- **When:** Generated **inside** `send-dj-inquiry-reply` and `send-artist-quote` when the email is sent.
- **Payload (e.g. JWT):**  
  `{ bookingId, clientEmail, artistType: "dj" | "musician", staffId?: string, exp }`  
  - For **DJ reply**: single DJ → include `staffId` (or DJ id) if we have it.  
  - For **Artist quote**: we have multiple options; we can either store “chosen” in token after they pick on the page, or not and let them choose on the form.
- **Expiry:** e.g. 60 days.
- **Usage:** CTA link = `{NEXT_PUBLIC_SITE_URL}/book-from-quote?token={jwt}`.

### 2. `GET /api/book-from-quote?token=...`

- Verify JWT, decode `bookingId`, `clientEmail`, `artistType`.
- Load **Booking** (and related data) from DB. Ensure it matches `clientEmail` (or at least booking exists and token is valid).
- Return **prefill** payload:  
  `{ name, email, phone, eventType, eventDate, venueName, venueAddress, venuePostcode, artistType, staffOptions?, selectedStaffId?, fee? }`  
  so the front end can pre-populate the form.

### 3. Book-from-Quote page (`/book-from-quote`)

- **Route:** e.g. `app/book-from-quote/page.tsx`.
- **Behaviour:**
  - Read `token` from `?token=...`.
  - Call `GET /api/book-from-quote?token=...`. If 401 → “Link expired or invalid, please contact us.”
  - Render a form **pre-filled** from the API response. All fields **editable** (name, email, phone, date, venue, etc.).
  - For **Artist quote** with multiple options: show a selector (or pre-select recommended) and pass `selectedStaffId` on submit.
- **Terms & Conditions (required before submit):**
  - Use the **`AcceptTermsModule`** component (see below). Submit is **disabled** until the user accepts T&Cs (checkbox only).
  - **Download quote summary PDF (optional):** When `showDownloadPdf` + `quoteSummary` are passed, the module shows an optional “Download quote summary (PDF)” button. The PDF includes **date, event, venue, DJ/musician** (and optional fee) for the client’s records. This feature is **optional** and **not** part of acceptance; acceptance is solely the T&C checkbox.
  - Flow: **accept T&Cs** (checkbox + link to view full terms) → **Submit**. Optionally **download PDF** at any time, independent of acceptance.
- **Submit:**  
  `POST /api/bookings/confirm-from-quote`  
  Body: `{ token, ...formFields, termsAccepted: true }` (including any `selectedStaffId`).

### 4. `POST /api/bookings/confirm-from-quote`

- Verify token again, load booking.
- **Update** booking with form data (name, email, phone, venue, etc.) where provided.
- **Create/update** `BookingStaffAssignment` for the chosen DJ/musician (from quote or form).
- Update **status** if desired (e.g. `quote_accepted` or `confirmed`).
- **Notify:** e.g. Pushover / internal email (“Client X confirmed quote for [venue] on [date]”).
- **Audit:** Use existing `AuditLog` or equivalent so the confirmation is logged.
- Return success (+ optional portal/countdown URL).

### 5. Email template changes

- **`send-dj-inquiry-reply`:**  
  - Generate token before sending.  
  - Replace mailto CTA with `{baseUrl}/book-from-quote?token={token}`.  
  - Button text: **“Book Your DJ”**.
- **`send-artist-quote`:**  
  - Same: generate token, replace mailto with `{baseUrl}/book-from-quote?token={token}`.  
  - Button text: **“Book Your DJ”** or **“Book Your Musician”** based on `artistType`.

### 6. 90‑day countdown & logging

- **90‑day:** Booking already exists; countdown stays as-is.
- **Logging:** Confirmation is recorded via audit + notifications. No extra 90‑day logic needed.

---

## Deposit invoice → Finalize & Invite → Portal

Book-from-Quote connects to your **finalize-and-invite** workflow:

1. **Client confirms** on `/book-from-quote` → we update the booking, assign staff, set terms, notify admin (Pushover).
2. **We send a deposit invoice** (admin sends manually, or we add auto-send when a deposit-invoice template exists). Client pays.
3. **Admin marks deposit received** (existing “Deposit Received” checkbox on the booking).
4. **Admin clicks “Finalize & Send Invite”** → we set status `confirmed`, ensure `portalToken`, send **PORTAL_INVITATION** email with magic link.
5. **Client uses portal** → booking portal (`/client/bookings/[id]?token=...`) for countdown, music details, etc. Same for **wedding, private party, corporate** — all rules already applied to those clients.

**UX implications:**

- **Success page** after confirm: we **do not** show “View your countdown” or a portal link. Portal access comes only **after** deposit is paid and you’ve run **Finalize & Invite**. Success copy: *“Thanks, we’ve confirmed your booking. We’ll send you a deposit invoice shortly. Once you’ve paid, we’ll invite you to your booking portal to add music details and more.”*
- **Confirm-from-quote API** does **not** return a `portalUrl` or trigger finalize-and-invite. It only updates the booking, staff, terms, and notifies admin.
- **Admin:** After a book-from-quote confirmation, next steps are **Send deposit invoice** (when available) → **Mark deposit received** → **Finalize & Send Invite**. The existing Finalize & Invite and Deposit Received UI remain the source of truth.

**Deposit invoice:** The current “Send Deposit Confirmation Email” is used *after* payment (“you’re in”, “date secured”, countdown link). A **deposit invoice** (amount, bank details, “please pay”) is implemented as a new template + `POST /api/admin/bookings/[id]/send-deposit-invoice`. It is **auto-sent** when the client confirms from Book-from-Quote; admin can also send or resend it manually. Event-type aware (wedding, private party, corporate) with the same rules as other client emails.

---

## Terms & Conditions and Quote Summary PDF

### General “Accept our T&Cs” module

- **`AcceptTermsModule`** (`components/AcceptTermsModule.tsx`): reusable component used at the point of **Book** / **Submit**.
- **Behaviour:**
  - **Checkbox:** “I accept the Terms & Conditions.” Must be checked to enable submit. **Acceptance is only this** — nothing else is required.
  - **Link:** “Terms & Conditions” opens a **dialog** with full T&C text (from `lib/terms-content.ts`). Dialog includes “View full terms (opens in new tab)” → `/terms-and-conditions`.
  - **Optional “Download quote summary (PDF)”:** When `showDownloadPdf` and `quoteSummary` are provided, show an **optional** button above the checkbox. The PDF is generated client-side via `lib/quote-summary-pdf.ts` and includes **date, event, venue, DJ/musician** (and optionally fee, client name). The PDF is **not** part of acceptance; it’s a separate, optional feature for the client’s records.
- **Props:** `accepted`, `onAcceptChange`, `disabled`, `showDownloadPdf`, `quoteSummary`, `error`, `variant` (dark/light).
- **Usage:** Book-from-Quote form, and optionally **secure-booking**, **book-dj**, or any flow that requires T&C acceptance before submit.

### Quote summary PDF

- **`lib/quote-summary-pdf.ts`:** `generateQuoteSummaryPdf(data)`.
- **Input:** `{ eventDate, eventType, venueName, artistName, clientName?, fee? }`.
- **Output:** Browser download of a PDF titled e.g. `Quote-Summary-{venue}-{date}.pdf`. Content: STYLISH header, “Quote Summary”, then date, event, venue, artist, optional client/fee. Footer: “By confirming your booking you agree to our Terms & Conditions” and “View full terms: {siteUrl}/terms-and-conditions”. The PDF is **optional**; acceptance is only via the T&C checkbox in the form.

### Shared terms content

- **`lib/terms-content.ts`:** Single source of truth for T&C sections. Used by `AcceptTermsModule` (dialog) and can be used by the `/terms-and-conditions` page to avoid duplication.

---

## UX Copy (optional)

- **Page title:** “Confirm your booking” or “Book your DJ” / “Book your Musician”.
- **Intro:** “Your details from the quote are below. You can edit anything that’s wrong, then confirm.”
- **Submit:** “Confirm and book” or “Confirm my booking”.

---

## Open Questions

1. **Create vs update:** Confirm we use **update existing booking** (Option A). If you want a new booking (Option B), we’ll adjust.
2. **Booking status:** Do we have (or want) a status like `quote_accepted` or `confirmed` for “client confirmed via book-from-quote”?
3. **Staff assignment:** For **Artist quote** with multiple options, does the client **choose on the form** (we then set `BookingStaffAssignment` from that), or is one artist pre-chosen in the email?
4. **Success behaviour:** We **do not** link to the portal or countdown after confirm. Portal access is granted only **after** deposit is paid and admin runs **Finalize & Send Invite**. Success message explains: deposit invoice → pay → we’ll invite you to the portal.

---

## Summary

| Item | Action |
|------|--------|
| Quote token | Add JWT (or signed token) in send-dj-inquiry-reply + send-artist-quote |
| CTA link | Replace mailto with `/book-from-quote?token=...` in both emails |
| `GET /api/book-from-quote` | Validate token, return prefill data |
| `/book-from-quote` page | Pre-filled, editable form; **AcceptTermsModule** (T&C + optional PDF); submit to confirm-from-quote |
| `AcceptTermsModule` | T&C checkbox + dialog (acceptance only). Optional “Download quote summary (PDF)” — not part of acceptance |
| Quote summary PDF | `lib/quote-summary-pdf.ts` – date, event, venue, DJ; **optional** feature for client’s records |
| `POST /api/bookings/confirm-from-quote` | Update booking, assign staff, set `termsAccepted` / `termsAcceptedAt`, `confirmedViaBookFromQuote`, notify, **auto-send deposit invoice**. No portal link or finalize-and-invite. |
| Success page | “Thanks, we’ve confirmed…” + deposit-invoice → pay → **booking** portal copy. Generic for all event types. **No** “View your countdown” CTA. |
| `POST /api/admin/bookings/[id]/send-deposit-invoice` | Admin send or resend deposit invoice. Event-type aware (wedding, corporate, private). |
| Deposit → Finalize → Portal | Confirm → **auto-send** deposit invoice → client pays → admin marks received → **Finalize & Send Invite** → client gets **booking portal** (Wedding or Booking Portal by event type). |
| Admin UX | **Confirmed via Book-from-Quote** badge; next-steps note; **Send Deposit Invoice** button + **Last sent**. |
| 90‑day / logging | Use existing booking + audit + notifications |

Once you confirm the open points (especially create vs update, status, and multi-option behaviour), we can implement this step by step.

---

## Sandbox (implemented)

The Book-from-Quote flow is **sandboxed**:

- **Email CTAs unchanged.** DJ reply and Artist quote emails still use **mailto** links. No production emails are modified.
- **Sandbox:** Admin-only page at **`/admin/sandbox/book-from-quote`** (linked from Admin dashboard → “Book-from-Quote sandbox”).
  - Enter a **booking ID**, choose **artist type** (DJ / musician), optionally **staff** and **fee**.
  - Click **Generate link** → calls `POST /api/admin/sandbox/book-from-quote` → returns a **`/book-from-quote?token=...`** link.
  - **Open in new tab** to test the full client flow (prefill, edit, T&C, optional PDF, confirm).
- **Token APIs:** `GET /api/book-from-quote`, `POST /api/bookings/confirm-from-quote` are live and used by the sandbox + client page. No mailto bypass until you enable it (e.g. via `ENABLE_BOOK_FROM_QUOTE` and email template changes).
