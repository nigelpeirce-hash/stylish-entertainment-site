# Venue Finding & Load-in (Private House, What3words, Load-in Notes)

## Rule: tie venue with full postal details for artist/crew

- **Venue** is always tied to full address (Address, Address 2, Town, County, Post Code) plus Venue Contact and Venue Phone where available.
- **Private house**: often only a postcode. We offer:
  1. **Address block** – full address fields (always available).
  2. **What3words** – optional; pinpoints exact location (e.g. `filled.count.soap` → [what3words.com](https://what3words.com)).
  3. **Load-in / access notes** – free text for specifics: “163 steps to the beach”, “no vehicle access”, “load-in horrible”, etc.

**We need to know if load-in is horrible** – stairs, distance, narrow paths, vehicle access, etc. – so artists and crew are prepared.

---

## Schema (Booking)

- `venueIsPrivateHouse` (Boolean?) – when true, we stress address / What3words / load-in.
- `venueWhat3Words` (String?) – e.g. `filled.count.soap`.
- `venueLoadInNotes` (String?) – access and load-in specifics.

**Migration**: run `supabase-venue-finding-loadin.sql` in the Supabase SQL editor.

---

## Worksheet (Artist Dispatch)

- **Private house?** checkbox. When checked, helper text: “Often just a postcode – add full address, What3words, and/or load-in notes.”
- **What3words** – optional input; link to what3words.com in hint.
- **Load-in / access notes** – textarea; placeholder e.g. “163 steps to beach, no vehicle access, load-in difficult”.

Save worksheet persists these fields. **Pre-fill from venue** also fills What3words and load-in notes when a prior booking for that venue has them.

---

## Dispatch email

- **Finding the venue / Load-in** section (amber accent):
  - **Private house: Yes** (when set).
  - **What3words**: link to `https://what3words.com/{words}`.
  - **Load-in / access**: plain text, pre-wrap.

Venue section already includes full postal (address, town, county, postcode), venue contact, and venue phone.

---

## Client portal (Final Details)

- **What3words (optional)** – same as worksheet.
- **Load-in / access notes (optional)** – e.g. “163 steps to the beach, load-in difficult”.

Clients can submit these; they flow into the booking and then into the worksheet and dispatch.

---

## Admin

- Venue card on booking detail shows **Finding the venue / Load-in** when any of private house, What3words, or load-in notes is set.
- PATCH whitelist includes `venueIsPrivateHouse`, `venueWhat3Words`, `venueLoadInNotes`.
