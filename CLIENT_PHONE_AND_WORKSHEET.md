# Client Phone & Worksheet UX

## Client phone – flow

Client phone is **collected and stored** in these places, and **used** in dispatch:

1. **Contact form** – Phone Number * → stored as `phoneAreaCode` + `phoneNumber` on the booking.
2. **Book-from-quote** – Phone is pre-filled from the quote; confirm-from-quote saves it to the booking.
3. **Client portal → Final details** – New field: **“Your phone (in case of emergency on the day)”**. Clients can view/edit it; it’s persisted via `PATCH /api/client/bookings/[id]/final-details` (same 21‑day window as other final details).
4. **Admin booking** – Phone is shown and editable (e.g. manual communication / edit modal).
5. **Artist dispatch** – In the email we send to the artist:
   - **“Client phone (in case of emergency on the day)”** with the client’s number.
   - Uses worksheet `clientPhone` if set, otherwise falls back to `booking.phoneAreaCode` + `booking.phoneNumber`.

## Worksheet (Artist Dispatch)

- **Layout** aligned with your structure:
  - **Venue**: Venue Contact → Venue Name (with **Pre-fill from venue**) → Address * → Address 2 → Town → County → Post Code → Venue Phone (Area Code / Number).
  - **Timing**: DJ Arrival Time * → Start / Finish.
  - **Technical**: DJ Setup Location → DJ Parking → **Is there a sound limiter?**
- **Client phone** in the worksheet is labeled **“Client phone (in case of emergency on the day)”**.
- **Save worksheet** – New button. Persists all worksheet fields (client, venue, timing, parking, sound limiter, music, etc.) to the booking via `PATCH /api/admin/bookings/[id]`. Use before marking “Review complete” and dispatching.
- **Pre-fill from venue** – Uses current **Venue Name** (and **Postcode** if set). Calls `GET /api/admin/venues/details?venueName=…&venuePostcode=…`, loads the most recent matching booking’s venue details, and fills Venue Contact, Address, Town, County, Postcode, Venue Phone. Edit as needed, then **Save worksheet**.

## APIs

- `PATCH /api/client/bookings/[id]/final-details` – Accepts `phone` (optional). Parses UK-style and stores `phoneAreaCode` / `phoneNumber`. Clearing the field saves `null`.
- `GET /api/admin/venues/details?venueName=…&venuePostcode=…` – Admin-only. Returns `{ venue: { venueContact, venueAddress, … } }` from the latest matching booking, or `{ venue: null }`.

## DB

- `Booking.phoneAreaCode`, `Booking.phoneNumber` – already in schema; used everywhere above.
- Venue fields (`venueContact`, `venueAddress`, …), `djParking`, `soundLimiter`, etc. – unchanged; worksheet reads/writes them via the existing booking PATCH.
