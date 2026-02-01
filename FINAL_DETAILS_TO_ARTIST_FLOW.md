# Final Details to Artist Flow – Full Audit & Artist/Staff Guide

**Purpose:** Map how client final details flow from the portal through admin notifications into the full artist/staff document and email. Use this as the reference for artists and staff.

---

## 1. Flow Overview

```
Client Portal (21-day window)
       │
       │ PATCH /api/client/bookings/[id]/final-details
       ▼
   Booking updated (finalDetailsConfirmed = true)
       │
       ├──► Pushover notification (Ali & Nigel)
       ├──► Admin email (Resend) + AuditLog
       ├──► Auto-dispatch (if enabled): full brief → staff with status "held"
       │
       ▼
   Admin reviews Artist Worksheet (pre-filled from Booking)
       │
       │ Admin: Review Complete → Send to Artist (manual)
       ▼
   POST /api/admin/bookings/[id]/dispatch
       │
       ├──► DJ dispatch: comprehensive HTML email → artist
       └──► Staff dispatch (staffAssignmentId): same email → staff member
```

---

## 2. Client Portal Final Details

**When:** Within 21 days of the event (3-week window).

**Where:** Client portal at `/client/bookings/[id]` (via session or `?token=`).

**What the client submits:**
- **Music:** First dance, last song, must-plays, do-not-plays, notes to DJ, Spotify/PDF link
- **Logistics:** Venue What3words, load-in notes, number of guests
- **Contact:** Client phone (for emergency on the day)
- **Address (non-wedding):** Client home address (line 1, 2, town, county, postcode)
- **Notes:** General message/notes

**API:** `PATCH /api/client/bookings/[id]/final-details` (or `?token=` for magic-link access).

**Database fields updated:**
- `firstDance`, `lastSong`, `musicRequests`, `musicDislikes`, `musicNotesToDJ`, `musicFileUrl`
- `message` (notes)
- `venueWhat3Words`, `venueLoadInNotes`, `numberOfGuests`
- `phoneAreaCode`, `phoneNumber`
- `clientAddress`, `clientAddress2`, `clientTown`, `clientCounty`, `clientPostcode` (non-wedding)
- `finalDetailsConfirmed = true`

---

## 3. Admin Notifications (When Client Confirms)

### 3.1 Pushover

- **Recipients:** Ali and Nigel (from `PUSHOVER_ALI_KEY`, `PUSHOVER_NIGEL_KEY`)
- **Title:** "Final details confirmed"
- **Message:** `{name} @ {venue} ({date}). Ready to dispatch.`
- **Link:** Admin booking page

### 3.2 Email to Admin

- **Recipient:** `CONTACT_FORM_EMAIL` / `NOTIFICATION_EMAIL`
- **Subject:** `[Stylish] Final details confirmed`
- **Body:** Client name, venue, event date; link to view booking
- **AuditLog:** `final_details_confirmed` action recorded

---

## 4. Where Final Details Populate

| Destination | Source | When |
|-------------|--------|------|
| **Booking record** | Client portal PATCH | Immediately on confirm |
| **Artist Worksheet (admin UI)** | Booking (pre-fill) | Admin opens booking |
| **Dispatch email (auto)** | Booking (buildFdFromBooking) | Client confirms – sent to staff with status "held" |
| **Dispatch email (manual)** | Artist Worksheet form (`editableDetails`) + Booking | Admin clicks "Send to Artist" |

The Artist Worksheet form is initialised from the booking. So once the client confirms final details, the next time admin opens the booking the worksheet is pre-filled with that data. Admin can edit before dispatching.

**Auto-dispatch:** When the client confirms final details, the system automatically sends the full brief to any assigned staff who have status "held" (assigned but not yet received the full brief). Controlled by `AUTO_DISPATCH_ON_FINAL_DETAILS` env (default: true). Set to `"false"` to disable.

---

## 5. Artist/Staff Dispatch Email

**Triggers:**
- **Auto:** Client confirms final details → full brief sent to staff with status "held" (if `AUTO_DISPATCH_ON_FINAL_DETAILS` enabled).
- **Manual:** Admin marks "Review Complete" and clicks "Send to Artist" in the Artist Worksheet card.

**API:** `POST /api/admin/bookings/[id]/dispatch`

**Payload:**
- `assignedDJName`, `assignedDJEmail` (or `staffAssignmentId` for staff)
- `finalDetails` – the editable worksheet fields (client name, email, phone, venue, timings, music, etc.)

**Email content (comprehensive event summary):**

1. **Client information:** Name, email, phone (emergency on the day)
2. **Event:** Type, date, number of guests
3. **Venue:** Name, full address, postcode, contact, phone
4. **Finding the venue / load-in:** What3words link, load-in notes, private house flag
5. **Event timings:** Arrival, start, finish
6. **Technical setup:** Setup location, parking, sound limiter
7. **Music preferences (from client portal):** First dance, last song, must-plays, do-not-plays, notes, Spotify/PDF link
8. **Musician-specific (if applicable):** PA, staging, power, audio connection
9. **Kit provided (warehouse items):** Equipment list if any
10. **Guest song requests:** If enabled and any exist

**Recipients:**
- **DJ dispatch:** `assignedDJEmail` (free-text or from booking)
- **Staff dispatch:** `staff.staff.email` from `BookingStaffAssignment`

---

## 6. Staff Confirmation vs Dispatch

| Email | When | Content |
|-------|------|---------|
| **Staff Confirmation** | When admin assigns staff (hold date) | Date, venue, role, agreed fee. "Full production details and timings will follow closer to the date." |
| **Dispatch email** | When admin sends final brief | Full event summary (client, venue, timings, music, kit, etc.) |

Staff get a simple confirmation first; full final details come later via the dispatch.

---

## 7. Files Reference

| File | Purpose |
|------|---------|
| `app/api/client/bookings/[id]/final-details/route.ts` | Client PATCH; updates booking, triggers notifications + auto-dispatch |
| `components/client/PortalView.tsx` | Client final details form |
| `components/ArtistDispatch.tsx` | Admin worksheet; pre-fill from booking, dispatch to artist |
| `app/api/admin/bookings/[id]/dispatch/route.ts` | Sends comprehensive email to artist/staff |
| `lib/dispatch-email.ts` | Shared dispatch email HTML builder |
| `lib/auto-dispatch-on-final-details.ts` | Auto-dispatch when client confirms |
| `lib/admin-notifications.ts` | Admin email + AuditLog |
| `lib/pushover-notifications.ts` | Pushover to Ali/Nigel |
| `lib/email-staff-confirmation.ts` | Staff hold-date confirmation (simple) |

---

## 8. Artist/Staff Guide (Summary)

1. **Hold confirmation:** You receive a short email confirming date, venue, role and fee.
2. **Final brief:** Once the client has completed their final details in the portal, you typically receive the full brief automatically. Admin may also send it manually via the Artist Worksheet.
3. **Full brief includes:**
   - Client contact (including emergency phone)
   - Full venue address and postcode
   - What3words and load-in notes
   - Arrival, start and finish times
   - Setup location and parking
   - Music preferences (first dance, must-plays, do-not-plays, notes)
   - Kit being provided (if any)
   - Guest song requests (if any)
4. **“I accept” link:** The email may include a link to confirm receipt; that is recorded in the system.

---

## 9. Gaps & Edge Cases

- **Auto-dispatch:** When client confirms final details, staff with status "held" receive the full brief automatically (unless `AUTO_DISPATCH_ON_FINAL_DETAILS=false`).
- **DJ (free-text):** Auto-dispatch only sends to staff assignments. For DJs entered as free-text in the Artist Worksheet, admin must still dispatch manually.
- **Manual override:** Admin can set `finalDetailsConfirmed` manually (Flexible Operator sidebar) if the client does not use the portal. Auto-dispatch does not run on manual override.
- **Staff vs DJ:** Dispatch supports both a free-text DJ (name + email) and a staff assignment (`staffAssignmentId`); the latter uses the staff member’s email from the team directory.
