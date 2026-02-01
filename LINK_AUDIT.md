# Full Link Audit – Production Next.js Site

**Date:** 2025-01-29  
**Scope:** All `href` and `<Link>` usage across app, components, lib (email templates, API-generated HTML).

---

## 1. Summary Table: Issues and Recommended Fixes

| href / pattern | location(s) | type | issue | recommended fix |
|----------------|-------------|------|--------|------------------|
| `/login` | `app/client/bookings/[id]/page.tsx` | internal | Uses `<a href>` instead of `next/link` | Use `<Link href="/login">` |
| `/client/dashboard` | `app/client/bookings/[id]/page.tsx` | internal | Uses `<a href>` instead of `next/link` | Use `<Link href="/client/dashboard">` |
| `tel:07970793177` | `app/services/lighting-design/page.tsx`, `components/AcceptTermsModule.tsx`, `app/terms-and-conditions/page.tsx` | tel | Missing `+44`; inconsistent with rest of site | Use `tel:+447970793177` |
| `Link ... target="_blank"` (no rel) | `app/demo-booking-form/page.tsx`, `app/mobile-preview/page.tsx` | external | Missing `rel="noopener noreferrer"` for security | Add `rel="noopener noreferrer"` |
| `rel="noopener"` only | `lib/dispatch-email.ts` (what3words link) | external | Missing `noreferrer` | Use `rel="noopener noreferrer"` |
| `https://g.page/r/YOUR_GOOGLE_REVIEW_LINK` | `lib/email-journey-templates.ts` | external | Placeholder URL; will 404 | Replace with real Google review URL or env var |
| `href="#"` | `app/admin/email-previews/page.tsx` (preview HTML) | internal | Placeholder; not a real link | Use `#` with `aria-disabled` or replace with real confirm URL in preview copy |
| `/contact` vs `/contact-us` | Multiple pages | internal | Both routes exist; mix of usage | No change (both valid). Optional: standardise to `/contact-us` for main CTA. |
| Trailing slash | Various (e.g. `/contact-us/` vs `/contact-us`) | internal | Inconsistent | Optional: pick one (e.g. no trailing slash) and normalise. Next.js accepts both. |

---

## 2. Internal Links Audit

### 2.1 Internal navigation – use `next/link`

- **Correct:** Most internal links use `<Link href="...">` from `next/link`.
- **Must-fix:**  
  - `app/client/bookings/[id]/page.tsx`: two `<a href="/login">` and `<a href="/client/dashboard">` — convert to `<Link>` for client-side navigation and consistency.

### 2.2 Routes checked

- `/`, `/contact`, `/contact-us`, `/login`, `/client/dashboard`, `/client/bookings/new`, `/client/profile`, `/client/messages`, `/terms-and-conditions`, `/privacy-policy`, `/artists/djs`, `/hire`, `/admin/*`, `/demo/*`, `/wedding-dj`, `/book-dj`, `/book-from-quote`, `/thank-you`, `/galleries`, `/request-quote`, `/parties`, `/services/*`, `/what-we-do/*`, `/venues/*`, `/babington-wedding-info`, `/request/[token]`, `/requests/[token]`, `/rescue/[id]`, `/forgot-password`, `/reset-password`, `/auth/setup`, etc. — all match existing `app/` routes. No 404s from path mismatch.

### 2.3 Hardcoded absolute URLs

- Email/API code (e.g. `lib/admin-notifications.ts`, `lib/client-login-notifications.ts`, `app/api/client/portal-message/route.ts`) correctly use `process.env.NEXTAUTH_URL` or `NEXT_PUBLIC_SITE_URL` with fallback `https://stylishentertainment.co.uk`. No hardcoded localhost in client-facing links.

### 2.4 Trailing slash

- Mix of `/contact-us` and `/contact-us/` (and similar). Next.js resolves both. Optional: standardise in one direction site-wide.

### 2.5 Hash links

- `#gallery?cat=...` used in party-lighting pages — ensure target section exists; no change if IDs match.

---

## 3. External Links Audit

### 3.1 target="_blank" and rel="noopener noreferrer"

- **Correct:** Most external `<a>` and many external `<Link>` use `target="_blank"` and `rel="noopener noreferrer"` (e.g. PortalView, galleries/instagram, AboutClient, FooterRefactored, TestimonialsClient, ArtistDispatch, AcceptTermsModule, GoogleReviews, WhatsAppThread, EnquiryDrawer).
- **Must-fix:**  
  - `app/demo-booking-form/page.tsx`: `<Link href={demo.url} target="_blank">` — add `rel="noopener noreferrer"`.  
  - `app/mobile-preview/page.tsx`: `<Link href={page.href} target="_blank">` — add `rel="noopener noreferrer"`.  
  - `lib/dispatch-email.ts`: what3words link uses `rel="noopener"` only — change to `rel="noopener noreferrer"`.

### 3.2 mailto: and tel:

- **mailto:** Used with booking/admin emails and static addresses (e.g. `nigel@stylishentertainment.co.uk`, `ali@stylishent.co.uk`, `info@stylishentertainment.co.uk`). Format valid.
- **tel:** Most use `tel:+447970793177`. **Fix:** `tel:07970793177` (no +44) in `app/services/lighting-design/page.tsx`, `components/AcceptTermsModule.tsx`, `app/terms-and-conditions/page.tsx` → use `tel:+447970793177` for consistency and international behaviour.

### 3.3 Placeholder / broken URLs

- **Must-fix:** `lib/email-journey-templates.ts`: `https://g.page/r/YOUR_GOOGLE_REVIEW_LINK` — replace with real Google review URL or env (e.g. `NEXT_PUBLIC_GOOGLE_REVIEW_URL`).
- **Nice-to-have:** `app/admin/email-previews/page.tsx`: preview HTML uses `href="#"` for “I have received…” — clarify in UI that it’s preview-only, or use a real confirmation URL in the template.

---

## 4. UX & Accessibility

- **Meaningful text:** CTAs use “Get in Touch”, “Check Availability”, “See the Portal”, “Go to login”, etc. No “click here” only.
- **Buttons vs links:** Primary actions use `<Button>` with `<Link>` or `<a>` where appropriate; no obvious link-inside-button nesting in critical paths.
- **Focus / tap targets:** Not fully audited; recommend checking focus rings and min 44px tap targets on key CTAs (especially mobile).

---

## 5. SEO

- **nofollow:** Not applied to UGC or untrusted external links; add `rel="nofollow"` to user-generated or third-party URLs if required by policy.
- **Duplicated CTAs:** Multiple “Get in Touch” / “Contact” links to `/contact-us` or `/contact` — intentional; no change unless consolidating.
- **JS-only handlers:** No critical internal routes found that rely only on `preventDefault` without a fallback href.

---

## 6. Security & Environment

- **localhost / staging:** Used only in API/middleware for dev bypass or env detection (e.g. `get-base-url.ts` fallback). Email links use `NEXT_PUBLIC_SITE_URL` or production fallback. No client-facing href to localhost/staging in production build if env is set.
- **Admin/portal:** Admin and client portal links are normal app routes; protection is via auth/middleware, not link hiding. No change needed for link audit.

---

## 7. Must-Fix Before Launch (Exact Changes)

### 7.1 Internal `<a>` → `<Link>` (client/bookings/[id]/page.tsx)

- Replace `<a href="/login" ...>` with `<Link href="/login" ...>`.
- Replace `<a href="/client/dashboard" ...>` with `<Link href="/client/dashboard" ...>`.
- Ensure `Link` is imported from `next/link`.

### 7.2 tel: format (use +44)

- `app/services/lighting-design/page.tsx`: `tel:07970793177` → `tel:+447970793177`.
- `components/AcceptTermsModule.tsx`: `tel:07970793177` → `tel:+447970793177`.
- `app/terms-and-conditions/page.tsx`: `tel:07970793177` → `tel:+447970793177`.

### 7.3 External Link security (rel="noopener noreferrer")

- `app/demo-booking-form/page.tsx`: on `<Link href={demo.url} target="_blank">` add `rel="noopener noreferrer"`.
- `app/mobile-preview/page.tsx`: on `<Link href={page.href} target="_blank">` add `rel="noopener noreferrer"`.
- `lib/dispatch-email.ts`: what3words `<a ... rel="noopener">` → `rel="noopener noreferrer"`.

### 7.4 Placeholder URL (email journey)

- `lib/email-journey-templates.ts`: Replace `https://g.page/r/YOUR_GOOGLE_REVIEW_LINK` with actual Google review URL or `process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL` (with fallback or omit link if unset).

---

## 8. Nice-to-Have Cleanup

- Standardise trailing slash for internal links (e.g. no trailing slash site-wide).
- Standardise “contact” CTA to either `/contact` or `/contact-us` and update all CTAs accordingly.
- In admin email preview, replace `href="#"` with a note or real URL in the template copy.
- Add `rel="nofollow"` to any UGC or paid/external links per SEO policy.
- Quick pass on focus styles and tap target size for main nav and CTAs on mobile.

---

## 9. Inventory Snapshot (Unique href patterns)

- **Internal (examples):** `/`, `/contact`, `/contact-us`, `/contact-us/`, `/login`, `/client/dashboard`, `/client/bookings/new`, `/client/profile`, `/client/messages`, `/terms-and-conditions`, `/terms-and-conditions/`, `/privacy-policy`, `/privacy-policy/`, `/artists/djs`, `/artists/djs/`, `/hire`, `/hire/`, `/admin`, `/admin/bookings`, `/wedding-dj`, `/book-dj`, `/book-from-quote`, `/thank-you`, `/galleries`, `/request-quote`, `/parties`, `/services/venue-styling`, `/services/lighting-design`, `/services/djs`, `/what-we-do/*`, `/hire/[slug]`, `/request/[token]`, `/requests/[token]/thank-you`, `/rescue/[id]`, `/demo/client-portal`, `/demo/guest-requests-workflow`, `/admin/sandbox/*`, `/forgot-password`, `/reset-password`, `/auth/setup`, `/client-portal-demo.html`, `/terms-portal-flow-demo`, etc.
- **External (examples):** `https://res.cloudinary.com/...`, `https://www.instagram.com/stylishentertainment/`, `https://www.youtube.com/@stylishentertainment937`, `https://cheeseandgrain.com`, `https://factory.uk.com`, `https://www.babingtonhouse.co.uk`, `https://what3words.com/...`, `https://www.northcadburycourt.co.uk/`, `https://stylishentertainment.co.uk` (in emails), `https://g.page/r/YOUR_GOOGLE_REVIEW_LINK` (placeholder).
- **tel:** `tel:+447970793177`, `tel:+447711117916`, `tel:07970793177` (fix to +44).
- **mailto:** Various; format valid.

---

**Success criteria:** Zero broken internal links; secure external linking (target="_blank" + rel="noopener noreferrer"); consistent tel format; no placeholder URLs in production emails.

---

## 10. Implementation Status (Must-Fix Applied)

| Fix | Status |
|-----|--------|
| Internal `<a>` → `<Link>` in `app/client/bookings/[id]/page.tsx` (login + dashboard) | ✅ Applied |
| `tel:07970793177` → `tel:+447970793177` (lighting-design, AcceptTermsModule, terms-and-conditions) | ✅ Applied |
| `rel="noopener noreferrer"` on demo-booking-form and mobile-preview `Link` with `target="_blank"` | ✅ Applied |
| `lib/dispatch-email.ts` what3words link: `rel="noopener"` → `rel="noopener noreferrer"` | ✅ Applied |
| `lib/email-journey-templates.ts` Google review: use `NEXT_PUBLIC_GOOGLE_REVIEW_URL`; button omitted if unset | ✅ Applied |

**Note:** Set `NEXT_PUBLIC_GOOGLE_REVIEW_URL` in production (e.g. your Google Maps review link) to show the "Leave a Google Review" button in the post-wedding thank-you email. If unset, the button is hidden and only "Share on Instagram" is shown.
