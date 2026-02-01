# Wedding DJ Client Portal ↔ Admin/Booking System – Touch Point Audit

**Scope:** Client portal for wedding DJ bookings. Couples: playlists, do-not-play, guest song requests, finalise details. Admin/booking team and DJ receive alerts, emails, dashboard updates.

**Purpose:** Map every user action to triggers, recipients, methods, and status so developers/product can verify plumbing and fix gaps.

---

## 1. Audit table: Actions → Triggers → Recipients → Method → Status

| # | Action | Trigger (what should happen) | Recipient(s) | Method | Status / verification |
|---|--------|------------------------------|--------------|--------|------------------------|
| **Portal: Couple actions** |
| 1 | Couple updates **music preferences** (must-plays, do-not-plays, first/last dance, Spotify/PDF link) | Booking record updated; admin/DJ aware so brief is accurate | Admin, DJ (via brief) | DB update only; admin sees on booking/brief | **⚠️ GAP** – No email or in-portal notification to admin when playlist is updated. DJ only sees when brief is sent. |
| 2 | Couple **approves or declines** a guest song request | GuestRequest status updated; optional: notify admin that couple acted | Admin (optional), DJ (via brief) | DB update | **⚠️ GAP** – No notification to admin when couple approves/declines. Data flow to booking record is **complete**. |
| 3 | Couple toggles **guest requests on/off** | Booking.guestRequestsEnabled updated | Admin (optional) | DB update | **Complete** – No notification expected unless product wants “guest requests closed” alert. |
| 4 | Couple **submits final details** (music + venue + load-in + address, within 21 days) | Booking updated, marked “ready to dispatch”; admin alerted; optional auto-dispatch | Admin, DJ (after dispatch) | Pushover, AuditLog, email (notifyAdminSignificantEvent), optional auto-dispatch | **✅ Complete** – Pushover + admin email + AuditLog; auto-dispatch can send brief to DJ. |
| 5 | Couple **accepts T&Cs** in portal | termsAccepted + termsAcceptedAt set on booking | Admin (optional) | DB update | **⚠️ GAP** – No email or AuditLog. Optional: add notifyAdminSignificantEvent(type: `terms_accepted`) if admin must know. |
| 6 | Couple confirms **“I’ve sent final payment”** | finalDetailsConfirmed set; DJ notified so they know client has paid | Admin, DJ | Email to DJ(s) | **⚠️ GAP** – DJ gets email ✅. Admin does **not** get AuditLog or email – add notifyAdminSignificantEvent for visibility. |
| 7 | Couple **sends message** via portal (contact office) | Message delivered to office inbox; admin notified | Admin | Email to inbox + AuditLog (notifyAdminSignificantEvent) | **✅ Complete** – Email + AuditLog. |
| 8 | Couple **sends guest request link** (invites) to guests | Emails sent to guest list with link to /requests/[token] | Guests | Email (Resend batch) | **✅ Complete** – send-guest-invites creates/sets guestRequestToken, sends emails. |
| 9 | Couple **confirms hire request** (kit/hire items) | Admin gets list of requested items to add to invoice | Admin | Email to ADMIN_EMAIL | **⚠️ GAP** – Email fires ✅. No AuditLog/activity feed entry – admin dashboard activity won’t show “Hire request from portal”. Add notifyAdminSignificantEvent. |
| 10 | Client clicks **“I’ve paid” (deposit)** from email link | depositPaidClickedAt set; admin notified | Admin | Pushover (sendDepositPaidNotification) + AuditLog (notifyAdminSignificantEvent) | **✅ Complete** – Pushover + AuditLog + redirect to thank-you. |
| **Guest actions (public link)** |
| 11 | **Guest submits a song request** (public /requests/[token]) | GuestRequest created, status pending; couple sees in portal | Couple (portal only), Admin (optional) | DB insert | **⚠️ GAP** – No email to couple (“You have a new song request”) and no notification to admin. Consider: in-portal badge + optional email to couple; optional admin digest. |
| 12 | Guest **removes** own song request | GuestRequest deleted | — | DB delete | **Complete** – No notification needed. |
| **Admin → Client** |
| 13 | Admin **finalises booking and sends portal invite** | Portal link (magic link) emailed to couple; booking status confirmed | Couple | Email (portal URL + token) | **✅ Complete** – finalize-and-invite sends PORTAL_INVITATION email, stores portalToken. |
| 14 | Admin **sends portal link** only (no status change) | Same as above, link only | Couple | Email | **✅ Complete** – send-portal-link. |
| 15 | Admin **confirms deposit received** (flexible update) | depositReceivedManual set; optional portalToken; deposit-confirmation email to client | Couple | Email (DEPOSIT_CONFIRMED) | **✅ Complete** – flexible-update sends deposit email when deposit first marked received. |
| 16 | Admin **dispatches** booking (sends brief to DJ) | Brief to DJ; booking marked dispatched; admin notified | DJ, Admin | Email to DJ, AuditLog | **✅ Complete** – dispatch route + notifyAdminSignificantEvent. |
| **Scheduled / system** |
| 17 | **Email journey** (e.g. 4-week check-in, week-of, final chase) | Cron sends tokenised emails with portal link | Couple | Email (Resend) | **✅ Complete** – cron/email-journey. |
| 18 | **Monday brief** (weekly summary to admin) | Cron sends summary of upcoming bookings | Admin | Email | **✅ Complete** – cron/monday-brief. |

---

## 2. Data flow: Booking record updates

| Action | Booking (or related) field(s) updated | API route | Verified |
|--------|--------------------------------------|-----------|----------|
| Music preferences (playlist, do-not-play, etc.) | musicRequests, musicDislikes, firstDance, lastSong, musicNotesToDJ, musicFileUrl | PATCH `/api/client/bookings/[id]/music-preferences` | ✅ |
| Guest request approve/decline | GuestRequest.status | PATCH `/api/client/bookings/[id]/guest-requests/[requestId]` | ✅ |
| Guest requests on/off | guestRequestsEnabled | PATCH `/api/client/bookings/[id]/guest-requests` | ✅ |
| Final details | finalDetailsConfirmed, venue*, clientAddress*, music*, etc. | PATCH `/api/client/bookings/[id]/final-details` | ✅ |
| Accept T&Cs | termsAccepted, termsAcceptedAt | POST `/api/client/bookings/[id]/accept-terms` | ✅ |
| “Final payment sent” | finalDetailsConfirmed, finalDetailsConfirmedManual | POST `/api/client/bookings/[id]/final-payment-sent` | ✅ |
| Deposit “I’ve paid” click | depositPaidClickedAt | GET `/api/client/bookings/[id]/marked-deposit-paid?sig=...` | ✅ |
| Guest submits song | GuestRequest (new row) | POST `/api/guest-requests/[token]/songs` | ✅ |
| Admin finalise + invite | status, portalToken, emailsSent | POST `/api/admin/bookings/[id]/finalize-and-invite` | ✅ |
| Admin confirm deposit | depositReceivedManual, portalToken (if missing) | PATCH `/api/admin/bookings/[id]/flexible-update` | ✅ |

All listed data flows that the portal and admin use are implemented; the main gaps are **notifications**, not persistence.

---

## 3. Gaps and inconsistencies (summary)

- **Music preferences (playlist) updated** – No admin or DJ notification. Admin only sees when they open the booking; DJ sees when brief is sent. **Recommendation:** Optional “Playlist updated” AuditLog + optional digest or in-dashboard indicator so admin can chase incomplete briefs.
- **Couple approves/declines guest request** – No admin notification. **Recommendation:** Optional AuditLog (e.g. `guest_request_approved` / `guest_request_declined`) or low-priority in-app only so admin isn’t spammed.
- **Couple accepts T&Cs** – No admin notification. **Recommendation:** If compliance/audit matters, add `notifyAdminSignificantEvent({ type: "terms_accepted", ... })`.
- **“Final payment sent” by couple** – DJ gets email; admin gets no AuditLog/email. **Recommendation:** Call `notifyAdminSignificantEvent` in `final-payment-sent` route so activity feed shows “Client confirmed final payment sent”.
- **Confirm hire request (portal)** – Email to admin only; no AuditLog. **Recommendation:** Add `notifyAdminSignificantEvent` (e.g. type `portal_hire_request`) so it appears in admin activity and is tied to the booking.
- **New guest song request** – No email to couple, no admin notification. **Recommendation:** Optional email to couple (“A guest suggested a song – approve in your portal”) and/or optional admin notification for high-value weddings.

---

## 4. Recommendations for missing email/data flows

1. **final-payment-sent**  
   - After updating booking and emailing DJs, call:  
     `notifyAdminSignificantEvent({ type: "final_details_confirmed", title: "Client confirmed final payment sent", description: "...", bookingId, ... })`  
   - (Reuse existing type or add `client_final_payment_confirmed` if you want a distinct activity label.)

2. **confirm-hire-request**  
   - After sending email to admin, call:  
     `notifyAdminSignificantEvent({ type: "portal_message", title: "Hire request from portal", description: "...", bookingId, ... })`  
   - Or add a dedicated type e.g. `portal_hire_request` and use it in the activity feed.

3. **accept-terms**  
   - If admin needs to know:  
     `notifyAdminSignificantEvent({ type: "terms_accepted", title: "T&Cs accepted", description: "Couple accepted booking T&Cs", bookingId, ... })`.  
   - Extend `SignificantEventType` in `lib/admin-notifications.ts` if you add `terms_accepted`.

4. **music-preferences (PATCH)**  
   - Optional: first time music is filled (e.g. was empty, now has must-plays or do-not-plays), create AuditLog only (no email) so admin can see “Music preferences added” in activity. Reduces email noise.

5. **Guest submits song (POST /api/guest-requests/[token]/songs)**  
   - Optional: send one email to couple: “A guest suggested [song] – log in to approve or decline.”  
   - Optional: notify admin (AuditLog or low-priority notification) for “New guest request” on that booking.

6. **Couple approves/declines guest request**  
   - Optional: AuditLog entry only, e.g. “Guest request approved/declined” so admin has a trail without extra email.

---

## 5. UX improvements (workflow transparency)

- **Portal:** After couple submits final details, show a clear success message: “We’ve notified the office. Your DJ will receive the full brief once we’ve dispatched your booking.”
- **Portal:** After “I’ve sent final payment”, confirm: “We’ve let your DJ know. The office will confirm when payment is received.”
- **Admin dashboard:** Ensure “Final details confirmed” and “Client confirmed final payment sent” are clearly labelled in the activity feed (and that both appear once the two flows are implemented).
- **Admin booking view:** Consider a small “Music last updated” or “Playlist updated at [date]” so staff know when couple last changed preferences.
- **Guest request link:** On the public guest-request page, show “Your request will be seen by [Couple names]. They’ll approve or decline – you won’t get an email when that happens.” (Manage expectations; optional: add email to guest when couple approves/declines later.)
- **Couple:** Optional in-portal notification or badge when there are new pending guest requests (“3 new song suggestions – approve or decline”).

---

## 6. Quick verification checklist (developer/PM)

- [ ] Every client portal action that changes booking or guest-request data has a defined trigger (email/notification or “DB only” by design).
- [ ] All routes that should call `notifyAdminSignificantEvent` do so (final-details ✅, marked-deposit-paid ✅, portal-message ✅; add final-payment-sent, confirm-hire-request, optionally accept-terms and music-preferences).
- [ ] Emails: portal invite, deposit confirmed, final-payment-sent (to DJ), guest invites, portal message to office, hire request to admin – all fire from the correct routes.
- [ ] Pushover: final-details and marked-deposit-paid both send; no other client actions require Pushover unless product adds them.
- [ ] Activity feed: AuditLog types and titles are consistent and visible in admin dashboard so staff can verify “client did X” without opening every booking.

---

**Document version:** 1.0  
**Last updated:** From codebase audit (client portal + admin APIs).  
**Files referenced:** `app/api/client/bookings/[id]/*`, `app/api/guest-requests/[token]/*`, `lib/admin-notifications.ts`, `lib/pushover-notifications.ts`, `components/client/PortalView.tsx`, `components/client/GuestRequestsView.tsx`, `components/client/ClientMusicModule.tsx`.
