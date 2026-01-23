# Hire Shop – 3-Point Verification Checklist

Use this checklist to confirm the Hire Shop is correctly wired to the booking and database.

---

## 1. The Identification

**Test:** Does the Hire Shop show **"Items for your Wedding at [Venue]"**?

**How to verify:**
- Open the client portal for a booking: `/client/bookings/[id]` (or use the magic link with `?token=...`).
- Scroll to the **Hire Shop** section.
- If `eventType` is **wedding** and the booking has a **venue**, the title must be:
  - **"Items for your Wedding at [Venue Name]"** (e.g. "Items for your Wedding at Babington House").
- If not wedding, you’ll see **"Items for your Event at [Venue]"**.
- If there’s no venue, it falls back to **"Items for your Event at your venue"**.

**Pass:** The title includes the correct venue and event type → token/booking context is working.

---

## 2. The Persistence

**Test:** Add an item, refresh the page. Is it still in the **"Selected"** list?

**How to verify:**
1. In the Hire Shop, click **"Add to booking"** on any hire item.
2. Confirm it appears under **"Selected"** with name, quantity, and price.
3. **Refresh the page** (F5 or Cmd+R).
4. Scroll back to the Hire Shop.

**Pass:** The item is still listed under **"Selected"** after refresh → database and `GET /api/client/bookings/[id]/items` are working.

---

## 3. The Notification

**Test:** Click **"Confirm Request"**. Do you receive an email? Do the items show on the Admin Booking page?

**How to verify:**
1. Add one or more items to the booking (see step 2).
2. Click **"Confirm Request"**.
3. You should see: **"Request Sent! Nigel will update your final invoice shortly."**
4. **Email:** Check **hello@stylishambience.co.uk**. You should receive an email with:
   - Client name, email, event date, venue.
   - List of requested items (name × quantity, line total).
   - Total amount.
5. **Admin:** Go to **Admin → Bookings → [this booking]**.
6. In the **Financials & Status** section, find **"Pending Approval"**.
7. The same requested items should be listed there with quantities and totals.

**Pass:** Email received and items visible in Admin **"Pending Approval"** → Confirm Request and admin visibility are working.

---

## Quick reference

| Check       | What to look for                                               |
|------------|-----------------------------------------------------------------|
| Identification | Title: "Items for your Wedding at [Venue]" (or Event at [Venue]) |
| Persistence    | Added items remain under "Selected" after page refresh          |
| Notification   | Confirm Request → email to hello@… + Admin "Pending Approval"   |
