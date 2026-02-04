# Guest Invite Audit – Client Portal & Wedding-DJ Demo

**Date:** January 2026  
**Scope:** Invite panel, CSV upload, shareable link in client portal and wedding-dj demo

---

## Summary

The invite panel (share link + CSV upload) was **not visible** in the wedding-dj demo because the demo used mock data with `guestRequestToken: null`. The real client portal shows the panel only when `guestRequestToken` exists.

---

## Architecture

### 1. Two Demo Variants

| Route | Component | Purpose |
|-------|-----------|---------|
| `/demo/client-portal` | `PortalDemoModal` | Standalone modal; **custom hardcoded UI** – no invite panel, read-only guest list |
| `/demo/portal-preview` | `PortalView` | Real portal with mock booking; used in wedding-dj iframe |

**Wedding-DJ page** embeds **`/demo/portal-preview`** (iframe at line 612), not `/demo/client-portal`.

### 2. Real Client Portal Flow

- **Page:** `/client/bookings/[id]` (with `?token=...` for magic link)
- **Component:** `PortalView` → `GuestRequestsView`
- **Invite UI:** Share link, Copy, Email, Share, **Upload CSV**, Send invites

### 3. GuestRequestsView Visibility Rules

The invite panel (share link + CSV) is shown only when **all** are true:

```tsx
{mounted && shareableLink && enabled && !eventPassed && (
  // ... invite panel with CSV upload
)}
```

- **shareableLink** = `baseUrl && guestRequestToken` → `guestRequestToken` must be non-null
- **enabled** = `guestRequestsEnabled` (default true)
- **eventPassed** = event date in the past

---

## Root Cause

**`/demo/portal-preview`** mock booking had `guestRequestToken: null`:

```javascript
// app/demo/portal-preview/page.tsx – BEFORE fix
guestRequestToken: null,  // ← Hides invite panel
guestRequestsEnabled: true,
```

With `guestRequestToken: null`, `shareableLink` is falsy, so the entire invite section (including CSV upload) is hidden.

---

## Fix Applied

Set a mock `guestRequestToken` in portal-preview so the invite panel appears:

```javascript
guestRequestToken: "demo-gr-preview",  // Enables share link + CSV UI for demo
```

- The shareable link will be `{origin}/requests/demo-gr-preview` (display-only; the link does not hit a real booking)
- CSV upload UI is visible; sending will fail in demo (no valid token/session) – acceptable for a read-only preview

---

## Production Client Portal Flow

1. **Token creation**
   - Admin sends portal link → `portalToken` created
   - Admin finalizes & invites → `portalToken` + `guestRequestToken` created
   - First CSV send → `guestRequestToken` created if missing

2. **API**
   - `POST /api/client/bookings/[id]/send-guest-invites` (multipart/form-data with CSV)
   - Auth: `?token=` (portalToken) or session

3. **CSV format**
   - "email" column, or emails in the first column
   - Up to 200 addresses
   - Parsed server-side in `parseCsvEmails()`

---

## Verification

| Test | Expected |
|------|----------|
| Wedding-DJ iframe → portal-preview | Invite panel visible (share link, Copy, Email, Upload CSV) |
| Real booking with guestRequestToken | Same UI; CSV send works |
| Real booking without guestRequestToken | Invite panel hidden until token is created |
| Event passed | Invite panel hidden (closed) |

---

## Related Files

- `components/client/GuestRequestsView.tsx` – invite panel, CSV UI
- `app/demo/portal-preview/page.tsx` – mock for wedding-dj demo
- `components/client/PortalView.tsx` – embeds GuestRequestsView
- `app/api/client/bookings/[id]/send-guest-invites/route.ts` – CSV processing and send
