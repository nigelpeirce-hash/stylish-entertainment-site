# “What your guests want to hear” – Audit & Report

**Last updated:** March 2026  
**Scope:** Guest song-request link, email invites, CSV/Excel upload. Marketing tool for Stylish Entertainment.

---

## Summary

The **“What your guests want to hear”** section in the client portal lets couples share a guest-request link and send invite emails so guests can suggest songs (with client approval). This is an important marketing and engagement tool. An audit was done and gaps were fixed so that:

1. **The link is always available** – no “no link” case for valid portal access.
2. **Emails are sent to guests** – branded invite email with the request link (unchanged; confirmed present).
3. **Excel upload is supported** – clients can upload CSV or Excel (.xlsx, .xls) with guest emails.

---

## Current behaviour (after fixes)

### 1. Link

- **Where:** Client portal → **Guest requests** card → “What your guests want to hear”.
- **Shareable URL:** `{baseUrl}/requests/{guestRequestToken}` (e.g. `https://stylishentertainment.co.uk/requests/gr_abc123...`).
- **Visibility:** The link + Copy / Email / Share + uploader are shown when:
  - `mounted && shareableLink && enabled && !eventPassed`
  - `shareableLink` = `baseUrl && guestRequestToken`, so a non-null **guestRequestToken** is required.
- **Token creation:**  
  - **Before:** Token was only created when admin sent the portal link or when the client first used “Send invites” (CSV). Many bookings had `guestRequestToken: null`, so the whole invite block (link + upload) was hidden.  
  - **After:** The token is created automatically when:
    - The client opens the portal page (server-rendered `app/client/bookings/[id]/page.tsx`), or
    - Any authorised GET to `GET /api/client/bookings/[id]` runs.  
  So the link (and invite panel) is **always** available once the client has access to the portal.

### 2. Email to guests

- **Flow:** Client uploads a file (CSV or Excel) with guest emails → clicks “Send invites to N guests” → API sends one branded email per address.
- **API:** `POST /api/client/bookings/[id]/send-guest-invites/` (multipart form with `file`). Auth: `?token=` (portalToken) or session.
- **Email content:** Stylish Entertainment branding, “Add your song requests!”, couple/event/venue/date, CTA button to the guest request URL. Link expires after the event.
- **Limits:** Up to 200 addresses per send; Resend batch.

No change to the email itself; the audit confirmed it exists and is sent when the client uses the uploader.

### 3. Excel uploader

- **Before:** Only CSV was accepted (`accept=".csv"`, server rejected non-CSV).
- **After:**
  - **UI:** File input accepts `.csv,.xlsx,.xls`. Label/copy: “Upload CSV or Excel” and “Upload a CSV or Excel file with an ‘email’ column…”.
  - **Client:** Preview uses the same logic for CSV and Excel (parse, find “email” column or first column, validate addresses, show “N valid emails found” and “Send invites to N guests”).
  - **Server:** `send-guest-invites` accepts CSV or Excel; parses with `xlsx` (SheetJS); extracts emails from first sheet (header “email” / “e-mail” / “guest_email” / “guest email” or first column); same validation and send as CSV.

So the **marketing tool** is intact: one shareable link, one email flow, and clients can use either CSV or Excel guest lists.

---

## Files touched

| Area | File | Change |
|------|------|--------|
| Link always present | `app/api/client/bookings/[id]/route.ts` | Include `guestRequestToken`, `guestRequestsEnabled` in GET response; if `guestRequestToken` is null, create it and return it. |
| Link always present | `app/client/bookings/[id]/page.tsx` | After loading booking, if `guestRequestToken` is null, create it and pass updated booking to `PortalView`. |
| Excel support | `app/api/client/bookings/[id]/send-guest-invites/route.ts` | Accept `.xlsx`/`.xls`; add `parseExcelEmails(buffer)`; use same email validation and send. |
| Excel support | `components/client/GuestRequestsView.tsx` | Accept `.csv,.xlsx,.xls`; add `parseExcelForPreview(ArrayBuffer)`; handle Excel in `handleCsvChange`; copy “CSV or Excel”. |
| Dependency | `package.json` | Added `xlsx` (SheetJS) for server and client parsing. |

---

## Verification

| Check | Expected |
|-------|----------|
| Open portal (first time, no token in DB) | Link and “Upload CSV or Excel” appear; token created in DB. |
| Refetch booking via API | Response includes `guestRequestToken` (created if was null). |
| Upload CSV | Preview count; Send invites; emails sent. |
| Upload Excel (.xlsx) | Preview count; Send invites; emails sent. |
| Copy link / Email / Share | Same as before; link is `.../requests/{guestRequestToken}`. |

---

## Related docs

- `GUEST_REQUEST_IMPLEMENTATION.md` – Guest request feature overview.
- `GUEST_INVITE_AUDIT.md` – Earlier audit (visibility when token was null); superseded by this report for link/email/upload behaviour.
