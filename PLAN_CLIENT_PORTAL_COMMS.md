# Client Portal: Email Threads (Comms Record)

## Goal
Clients see a **record of all communications** for their booking **inside** the client portal (`/client/bookings/[id]`), whether they use magic link or login.

## Current State
- **Portal** (`PortalView`): booking details, music, final details, guest requests, hire shop — **no comms**.
- **Messages** (`/client/messages`): email threads for **logged-in** users only; **all** threads, not booking-scoped.
- **Auth**: Portal uses magic link (`?token=`) or session; threads API uses session only.

## Implementation Plan

### Phase 1: Read-only comms in portal ✅

| Step | Task | Status |
|------|------|--------|
| 1.1 | **API** `GET /api/client/bookings/[id]/threads` | Done |
| | Returns threads with `bookingId = [id]`. Auth: `?token=` (portalToken) **or** session (user owns booking / admin). | |
| 1.2 | **PortalView** Add "Communication history" section | Done |
| | Fetch from threads API, render threads + emails chronologically. Empty state when none. | |
| 1.3 | **Sandbox** Update client-portal sandbox copy to mention comms | Done |
| | "…Music details, final details, guest requests, **and communication history**." | |

### Phase 2: Optional follow-ups (not in scope here)
- **Send from portal**: `POST /api/client/bookings/[id]/messages` with token/session auth; "Send message" in portal.
- **Audit** `bookingId` on thread creation (portal-message, email-journey, etc.) so all relevant comms are linked.

## API Contract

### `GET /api/client/bookings/[id]/threads`
- **Auth**: Same as `GET /api/client/bookings/[id]` — `?token=` matching `booking.portalToken` **or** session (user owns booking or admin).
- **Response**: `{ threads: Array<{ id, subject, lastMessageAt, emails: Array<Email> }> }`. Emails ordered by `receivedAt` asc.

## Sandbox Verification
1. Go to **Admin → Sandbox → Client portal** (`/admin/sandbox/client-portal`).
2. Enter a booking ID. Use one that has linked email threads (`EmailThread.bookingId` = that booking) to see comms; otherwise you’ll see **"No messages yet"**.
3. Generate link, open in incognito.
4. In the portal, find **"Communication history"**; confirm threads/emails appear or the empty state.

## Files Touched
- `app/api/client/bookings/[id]/threads/route.ts` (new)
- `components/client/PortalView.tsx` (Communication history section)
- `app/admin/sandbox/client-portal/page.tsx` (sandbox copy)
- `PLAN_CLIENT_PORTAL_COMMS.md` (this plan)
