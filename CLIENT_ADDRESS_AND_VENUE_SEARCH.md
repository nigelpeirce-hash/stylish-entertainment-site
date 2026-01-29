# Client address, phone & venue search – summary

## 1. Venue search “not connected to DB” / no selections

**Changes:**
- **`/api/venues/search`**: Now queries **Booking** (venue name + postcode), **Venue** (venue intelligence), and **VenueAsset**. Name matching uses `contains` (e.g. “ton” → “Babington House”) so partial typing still returns results.
- **`VenueAutocomplete`**: Uses `/api/venues/search/?q=...` (trailing slash). Suggestions show whenever there are results (no strict focus check).

**Note:** If you have no bookings and no rows in `Venue` / `VenueAsset`, you’ll still get no suggestions. Once there is data in any of those, typing 2+ characters should show matches.

---

## 2. Client home address & phone

**Schema:** New `Booking` fields:
- `clientAddress`, `clientAddress2`, `clientTown`, `clientCounty`, `clientPostcode`

**Migration:** Run `supabase-client-address.sql` in the Supabase SQL editor, then `npx prisma generate`.

---

### Manual entry (admin)

- **New Booking modal:** Client phone + full client home address (Address, Address 2, Town, County, Postcode). Optional. Phone is parsed into area code + number.
- **Edit Booking modal:** Same client address block plus name, email, phone. “Save” updates venue/timing via flexible-update and client fields via `PATCH /api/admin/bookings/[id]`.

---

### Client adds it (book-from-quote / book direct)

- **Book-from-quote page:** “Your details” has **Phone \*** (required). “Your home address” has **Address \***, Address 2, **Town \***, **County**, **Postcode \*** (required where marked). Prefill comes from the booking; client can edit.
- **Confirm-from-quote API:** Accepts phone + client address, parses phone into `phoneAreaCode` / `phoneNumber`, stores everything on the booking.

---

### Client portal Final Details

- **Final Details form:** “Your phone” (already there) plus **“Your home address”** (Address, Address 2, Town, County, Postcode). Optional; clients can correct pre-filled data.
- **PATCH final-details API:** Accepts and stores client address fields.

---

### Data flow

| Source              | Phone | Client address |
|---------------------|-------|----------------|
| New Booking modal   | ✅    | ✅             |
| Book-from-quote     | ✅    | ✅             |
| Edit Booking modal  | ✅    | ✅             |
| Client portal Final Details | ✅ | ✅       |

All of the above persist to `Booking` (phone as `phoneAreaCode` + `phoneNumber`, address as `clientAddress`, …).

---

## 3. Files touched

- `prisma/schema.prisma` – new client address fields
- `supabase-client-address.sql` – migration
- `app/api/venues/search/route.ts` – Venue + VenueAsset, `contains` matching
- `components/VenueAutocomplete.tsx` – URL + suggestion display
- `components/admin/bookings/add-booking-modal.tsx` – client phone + address
- `lib/actions/booking-actions.ts` – createBooking accepts and stores them
- `app/book-from-quote/page.tsx` – phone + “Your home address” section
- `app/api/book-from-quote/route.ts` – prefill includes client address
- `app/api/bookings/confirm-from-quote/route.ts` – accepts and stores phone + address
- `app/admin/bookings/[id]/page.tsx` – edit modal client address + save logic
- `app/api/admin/bookings/[id]/route.ts` – PATCH allowlist for client fields
- `lib/transformers/booking-transformer.ts` – client address in sanitized booking
- `app/client/bookings/[id]/page.tsx` – select client address for portal
- `components/client/PortalView.tsx` – Final Details client address UI + submit
- `app/api/client/bookings/[id]/final-details/route.ts` – PATCH client address

---

## 4. What to do next

1. Run `supabase-client-address.sql` in Supabase.
2. Run `npx prisma generate`.
3. Smoke-test:
   - Venue autocomplete (New Booking, contact form, etc.) with some venue data.
   - New Booking → client phone + address → create → check DB.
   - Book-from-quote → phone + address → confirm → check DB.
   - Admin Edit modal → client address → save.
   - Client portal → Final Details → update address → send.
