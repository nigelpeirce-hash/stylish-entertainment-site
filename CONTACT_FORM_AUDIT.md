# Contact Form Audit: First-Time Visitor & Pre-Fill Behaviour

**Audit date:** January 2026  
**Purpose:** Ensure clients who have not visited before can add their own fields, rather than having fields pre-filled from initial enquiry.

---

## Executive Summary

**Main contact forms (`/contact-us`, `/contact`):** ✅ **No pre-filling from enquiry.**  
First-time visitors see blank fields and add their own data. The forms do not read URL params, sessionStorage, or localStorage for prefill.

**Other enquiry-related forms:** Pre-fill only when explicitly intended (e.g. returning clients with quote links).

---

## 1. `/contact-us` (ContactForm)

**Location:** `app/contact-us/ContactForm.tsx`

| Check | Result | Details |
|-------|--------|---------|
| URL search params | ✅ Not used | No `useSearchParams`. Form ignores `?subject=`, `?message=`, etc. |
| sessionStorage | ✅ Write-only | Writes `recentBookingTimestamp`, `recentBookingId`, etc. **after** submit. Never reads for prefill. |
| localStorage | ✅ Not used | No reads for form data. |
| defaultValues | ✅ Minimal | Only `eventType: ""`, `preferredDJ: ""`, `upsells: []`. Core fields (name, email, phone, eventDate, venueName, message) start empty. |
| Props / parent prefill | ✅ None | `ContactForm` accepts no props. Rendered as `<ContactForm />` with no prefill source. |

**Conclusion:** First-time visitors see a blank form. No enquiry data pre-fills any field.

---

## 2. `/contact` (Legacy Contact Page)

**Location:** `app/contact/page.tsx`

| Check | Result | Details |
|-------|--------|---------|
| URL search params | ✅ Not used | No `useSearchParams`. |
| sessionStorage | ✅ Not used | No reads or writes for form prefill. |
| localStorage | ✅ Not used | No reads for form data. |
| defaultValues | ✅ Minimal | `services: []`, `contactPreference: undefined`. All text fields start empty. |

**Conclusion:** First-time visitors see a blank form. No pre-filling from enquiry.

---

## 3. `/book-dj` (Booking Form)

**Location:** `app/book-dj/page.tsx`

This is a booking form, not the main contact form. Pre-fill behaviour:

| Source | When | Fields affected |
|--------|------|-----------------|
| Session (logged-in user) | Always when logged in | `name`, `email` |
| `?type=` URL param | When present | `eventType` |
| `?quote=` URL param | When present (quote/DJ reply email link) | Name, email, phone, eventType, eventDate, venue, etc. |

**First-time visitor, no login, no URL params:** Only `eventType` defaults to `"wedding"` in `defaultValues`. Name and email stay blank.

**Recommendation:** If this form is considered part of “contact” and you want zero pre-fill for first-timers, you could stop defaulting `eventType` from `searchParams?.get("type")` and use a neutral default (e.g. empty or “Select…”). The `?quote=` prefill is for returning clients and is intentionally retained.

---

## 4. `/book-from-quote`

**Location:** `app/book-from-quote/page.tsx`

This flow is **only** for returning clients with a quote link (`?token=...`). Pre-fill is intentional: the API returns booking details and the form populates from them. First-time visitors without a token see an error (“Missing link”). This is expected and separate from the main contact form.

---

## 5. ServiceQuoteGenerator → Contact Link

**Location:** `components/ServiceQuoteGenerator.tsx`

Builds a link:

```ts
const contactUrl = "/contact-us?" + new URLSearchParams({
  subject: "Lighting quote request" | "Venue styling quote request",
  message: summaryText.replace(/\n/g, "%0A"),
}).toString();
```

**Behaviour:** `ContactForm` does **not** read `subject` or `message` from the URL. The form is shown blank. The quote text in the URL is effectively ignored.

**UX note:** If you ever want returning quote users to have the quote pre-filled in the message field, you would need to add URL param reading in `ContactForm`. Your current requirement is the opposite: ensure clients can add their own fields, not pre-fill from enquiry. The current behaviour matches that.

---

## 6. `/request-quote`

**Location:** `app/request-quote/RequestQuoteClient.tsx`

Uses its own form with `useState`. Defaults:

```ts
form: { name: "", email: "", eventDate: "", venue: "", message: "" }
```

`localStorage` is only used for the hire basket, not for contact details. No pre-fill from enquiry.

---

## Summary Table

| Form | Pre-fill from enquiry? | First-time visitor experience |
|------|------------------------|-------------------------------|
| `/contact-us` | ❌ No | Blank fields |
| `/contact` | ❌ No | Blank fields |
| `/request-quote` | ❌ No | Blank fields |
| `/book-dj` | ⚠️ Only when `?quote=` or logged in | Blank except `eventType` default |
| `/book-from-quote` | ✅ Yes (intentional) | Requires token; prefill expected |

---

## Recommendations

1. **Keep current behaviour for `/contact-us` and `/contact`** – no changes needed for first-time visitor behaviour.
2. **Avoid adding prefill without explicit intent** – Do not read `searchParams`, `sessionStorage`, or `localStorage` for contact form fields unless there is a clear, user-facing reason (e.g. quote/token flows).
3. **Optional:** Add a short code comment in `ContactForm.tsx` that the form deliberately does not pre-fill from URL params or storage so future changes respect that behaviour.
4. **Optional:** For `/book-dj`, if you want it to feel like a pure “first-time” form when there is no quote link, consider:
   - Not defaulting `eventType` from `?type=`, or
   - Using a neutral `eventType` default (e.g. empty) until the user chooses.

---

## Files Audited

- `app/contact-us/ContactForm.tsx`
- `app/contact-us/ContactUsClient.tsx`
- `app/contact-us/page.tsx`
- `app/contact/page.tsx`
- `app/request-quote/RequestQuoteClient.tsx`
- `app/book-dj/page.tsx`
- `app/book-from-quote/page.tsx`
- `components/ServiceQuoteGenerator.tsx`
- `lib/contact-schema.ts`
