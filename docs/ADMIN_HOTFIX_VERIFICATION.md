# Admin 500 Hotfix – Verification Plan

**Context:** Prisma P2022 ("column does not exist") on live DB missing `services`, `upsellItems`, `termsAcceptedVersion`. Hotfix uses safe select + fallbacks; no DB migrations.

**Base URL:** `https://www.stylishentertainment.co.uk`

All requests below require a valid admin session (cookie or Bearer token as your app expects). Replace `YOUR_AUTH` with your auth header or use a session cookie.

---

## 1. Dashboard summary (critical path)

```bash
curl -s -o /dev/null -w "%{http_code}" "https://www.stylishentertainment.co.uk/api/admin/dashboard-summary" -H "Cookie: YOUR_SESSION"
```

- **Expect:** `200`
- **Response:** JSON with `unreadThreads`, `recentThreads`, `pendingBookings`, `conflictCount`, `timestamp`
- **Check:** Each item in `pendingBookings` has `services` (array), `upsellItems` (array), and no missing-field errors

---

## 2. Bookings list

```bash
curl -s -o /dev/null -w "%{http_code}" "https://www.stylishentertainment.co.uk/api/admin/bookings" -H "Cookie: YOUR_SESSION"
```

- **Expect:** `200`
- **Response:** `{ "bookings": [ ... ] }`
- **Check:** Each booking has `services`, `upsellItems` (arrays); optional `artistQuoteSentAt`

---

## 3. 90-day command

```bash
curl -s -o /dev/null -w "%{http_code}" "https://www.stylishentertainment.co.uk/api/admin/bookings/90-day-command" -H "Cookie: YOUR_SESSION"
```

- **Expect:** `200`
- **Response:** `{ "success": true, "bookings": [ ... ], "count": N }`
- **Check:** Each booking has `daysRemaining`, `unreadPortalMessages`, `staffPendingAction`; no P2022

---

## 4. Single booking (GET) – replace `BOOKING_ID`

```bash
curl -s -o /dev/null -w "%{http_code}" "https://www.stylishentertainment.co.uk/api/admin/bookings/BOOKING_ID" -H "Cookie: YOUR_SESSION"
```

- **Expect:** `200`
- **Response:** `{ "booking": { ... } }` (sanitized via `transformBooking`)
- **Check:** `booking.services` and `booking.upsellItems` are arrays; `booking.termsAcceptedVersion` is string or null

---

## 5. Enquiries list

```bash
curl -s -o /dev/null -w "%{http_code}" "https://www.stylishentertainment.co.uk/api/admin/enquiries" -H "Cookie: YOUR_SESSION"
```

- **Expect:** `200`
- **Response:** Array of enquiries; booking-sourced items include `services` (array)

---

## 6. Check recent bookings

```bash
curl -s -o /dev/null -w "%{http_code}" "https://www.stylishentertainment.co.uk/api/admin/check-recent-bookings" -H "Cookie: YOUR_SESSION"
```

- **Expect:** `200`
- **Response:** JSON with recent/alison/all/pending booking lists (no full-row select, so no P2022)

---

## 7. Internal brief – replace `BOOKING_ID`

```bash
curl -s -o /dev/null -w "%{http_code}" "https://www.stylishentertainment.co.uk/api/admin/bookings/BOOKING_ID/internal-brief" -H "Cookie: YOUR_SESSION"
```

- **Expect:** `200` or `404` if not found
- **Check:** No P2022; response has booking + warehouse/staff/guest data

---

## 8. Enquiry talent status (GET then PATCH) – replace `ENQUIRY_ID` and `BOOKING_ID`

```bash
# GET
curl -s -o /dev/null -w "%{http_code}" "https://www.stylishentertainment.co.uk/api/admin/enquiries/ENQUIRY_ID/talent-status?bookingId=BOOKING_ID" -H "Cookie: YOUR_SESSION"

# PATCH (minimal select; no full row)
curl -s -X PATCH "https://www.stylishentertainment.co.uk/api/admin/enquiries/ENQUIRY_ID/talent-status" \
  -H "Content-Type: application/json" -H "Cookie: YOUR_SESSION" \
  -d '{"bookingId":"BOOKING_ID","talentId":"t1","contacted":true}' -o /dev/null -w "%{http_code}"
```

- **Expect:** `200` for both (or `400` if body invalid)
- **Check:** PATCH no longer does full `findUnique`; only selects `id`, `talentStatus`

---

## 9. Email send (POST – optional)

Uses safe select (name, venueName, eventType, eventDate, djStartTime, djFinishTime, preferredDJ, numberOfGuests) only. No need to hit live if you don’t use this flow; if you do, ensure template variables resolve.

---

## 10. Create booking from email (POST – optional)

`findFirst` now uses `select: { id, name, email, status, createdAt }`. Create still writes `services`/`upsellItems`; if those columns are missing in DB, create will still 500 until migrations are run. Hotfix only fixes the “already exists” read.

---

## 11. Split WhatsApp thread (POST – optional) – replace IDs

```bash
curl -s -X POST "https://www.stylishentertainment.co.uk/api/admin/bookings/BOOKING_ID/split-whatsapp-thread" \
  -H "Content-Type: application/json" -H "Cookie: YOUR_SESSION" \
  -d '{"newBookingId":"NEW_BOOKING_ID"}' -o /dev/null -w "%{http_code}"
```

- **Expect:** `200` or `404`
- **Check:** Verification of new booking uses `select: { id: true }` only; no P2022

---

## Quick status-only check (all critical GETs)

Run from a machine with auth; exit code 0 if all return 200:

```bash
BASE="https://www.stylishentertainment.co.uk"
AUTH="Cookie: YOUR_SESSION"
for path in "/api/admin/dashboard-summary" "/api/admin/bookings" "/api/admin/bookings/90-day-command" "/api/admin/enquiries" "/api/admin/check-recent-bookings"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$path" -H "$AUTH")
  echo "$path → $code"
  [ "$code" = "200" ] || exit 1
done
```

---

## Response shape (after hotfix)

- **Admin booking objects** (from dashboard-summary, bookings list, 90-day-command, bookings/[id] GET): Always include `services: string[]`, `upsellItems: string[]`, and `termsAcceptedVersion: string | null` via `addBookingFallbacks()` or `transformBooking()`.
- **transformBooking:** Already resilient: uses `Array.isArray(booking?.services)` and `Array.isArray(booking?.upsellItems)` so missing/undefined becomes `[]`.
