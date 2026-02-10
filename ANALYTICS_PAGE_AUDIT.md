# Analytics Page Audit (Old Site → New Site)

Audit of page paths from Analytics (old site) to ensure no 404s. Redirects are in `next.config.js` (301 permanent where applicable).

**Key fix:** `/party-lighting/` (289 views, top page) was returning 404. It now redirects to `/parties/party-lighting/`.

---

## Summary

| Status | Count | Meaning |
|--------|--------|--------|
| OK | Page exists on new site or already had redirect | No change needed |
| Redirect added | New redirect added in this audit | 404 avoided |
| Redirect existed | Already in next.config.js | No change |
| N/A | Invalid or attachment/query URL | Ignored or handled by wildcard |

---

## Path-by-path audit

| # | Old path (Analytics) | New destination | Status |
|---|----------------------|-----------------|--------|
| 1 | `/party-lighting/` | `/parties/party-lighting/` | **Redirect added** (was 404) |
| 2 | `/` | `/` | OK |
| 3 | `/wedding-lighting/` | `/weddings/wedding-lighting/` | Redirect existed |
| 4 | `/party-planning-and-organising/` | Same | OK |
| 5 | `/contact-us/` | Same | OK |
| 6 | `/lighting-hire-2/` | Same | OK |
| 7 | `/my-account/` | `/login/` | **Redirect added** (WooCommerce legacy) |
| 8 | `/artists/party-djs/` | Same | OK |
| 9 | `/dj-nige/` | `/artists/djs/` | Redirect existed |
| 10 | `/what-we-do/venue-decoration/` | `/services/venue-styling/` | Redirect existed |
| 11 | `/parties/private/` | `/parties/private-parties/` | Redirect existed |
| 12 | `/fire-pit-html/` | `/services/fire-pit-hire/` | Redirect existed |
| 13 | `/artists/musicians-html/` | `/artists/musicians/` | Redirect existed |
| 14 | `/team-view/nigel-peirce/` | `/about/` | **Redirect added** (`/team-view/:path*`) |
| 15 | `/what-we-do/party-planning-production/` | `/party-planning-and-organising/` | Redirect existed |
| 16 | `/testi/` | Same | OK |
| 17 | `/weddings/` | Same | OK (app/weddings/page.tsx) |
| 18 | `/galleries/venue-decoration/` | `/services/venue-styling/` | Redirect existed |
| 19 | `/christmas/` | `/parties/christmas/` | Redirect existed |
| 20 | `/fire-pit-html/fire-pit-html/` | `/services/fire-pit-hire/` | **Redirect added** |
| 21 | `/babington-house-wedding-info/` | `/venues/babington-house/` | Redirect existed |
| 22 | `/dj-booking-confirmation/` | `/book-dj/` | Redirect existed |
| 23 | `/what-we-do/djs-discos/` | `/artists/djs/` | **Redirect added** |
| 24 | `/babington-house/the-orangery-at-babington-house/` | `/venues/babington-house/` | **Redirect added** |
| 25 | `/what-we-do/equipment-dj-band-sound-kit/` | Same | OK |
| 26 | `/about/faqs/` | `/about/faq/` | **Redirect added** (faq vs faqs) |
| 27 | `/babington-dj-final-details/` | `/venues/babington-house/` | **Redirect added** |
| 28 | `/work-for-us/` | `/contact-us/` | **Redirect added** |
| 29 | `/galleries/images-html/` | `/galleries/` | **Redirect added** |
| 30 | `/what-we-do/hire/attachment/:path*` | Handled by /what-we-do/hire → /hire/ | Redirect existed (hire); attachment may 404 to /hire/ |
| 31 | `/dj-worksheet/` | Same | OK |
| 32 | `/galleries/video/` | `/galleries/videos/` | **Redirect added** (video vs videos) |
| 33 | `/parties/corporate-events/` | Same | OK |
| 34 | `/spring-ball/bristol-spring-ball/attachment/...` | `/about/blog/bristol-university-spring-ball/` | **Redirect added** (`/spring-ball/:path*`) |
| 35 | `/testi/page/2/`, `/testi/page/3/` | `/testi/` | Redirect existed (`/testi/page/:path*`) |
| 36 | `/what-we-do/led-lighting-php/` | `/services/lighting-design/` | Redirect existed |
| 37 | `/blog/venue-decoration-styling/magic-mirror-photo-booth/` | `/about/blog/` | **Redirect added** (`/blog/venue-decoration-styling/:path*`) |
| 38 | `/christmas/data:text/javascript;...` | N/A (invalid URL) | Ignored |
| 39 | `/team-view/alison-peirce/` | `/about/` | **Redirect added** |
| 40 | `/blog/.../attachment/...` | `/about/blog/` | Redirect existed |
| 41 | `/category/babington-house/`, `page/2/` | `/venues/babington-house/` | **Redirect added** |
| 42 | `/lighting-hire/` | `/parties/party-lighting/` | Redirect existed |
| 43 | `/pennard-house-lighting/` | `/venues/pennard-house/` | Redirect existed |
| 44 | `/testimonial-view/...` | `/testi/` | Redirect existed |
| 45 | `/what-we-do/hire/` | `/hire/` | Redirect existed |
| 46 | `/what-we-do/venue-decoration/attachment/...` | `/services/venue-styling/` | Redirect existed |
| 47 | `/2014/12/` | No specific page | Consider redirect to `/about/blog/` if desired |

---

## Redirects added in this audit

- **`/party-lighting`** → `/parties/party-lighting/` (fixes 404 for top-traffic path)
- **`/party-lighting/`** → `/parties/party-lighting/`
- **`/about/faqs`** → `/about/faq/`
- **`/about/faqs/`** → `/about/faq/`
- **`/galleries/images-html`** → `/galleries/`
- **`/galleries/images-html/`** → `/galleries/`
- **`/galleries/video`** → `/galleries/videos/`
- **`/galleries/video/`** → `/galleries/videos/`
- **`/what-we-do/djs-discos`** → `/artists/djs/`
- **`/what-we-do/djs-discos/`** → `/artists/djs/`
- **`/babington-house/the-orangery-at-babington-house`** → `/venues/babington-house/`
- **`/babington-dj-final-details`** → `/venues/babington-house/`
- **`/work-for-us`** → `/contact-us/`
- **`/team-view/:path*`** → `/about/`
- **`/fire-pit-html/fire-pit-html`** → `/services/fire-pit-hire/`
- **`/blog/venue-decoration-styling/:path*`** → `/about/blog/`
- **`/spring-ball/:path*`** → `/about/blog/bristol-university-spring-ball/`
- **`/category/babington-house`** (and `/page/:path*`) → `/venues/babington-house/`
- **`/my-account`** → `/login/`

---

## Optional follow-up

- **`/2014/12/`** (old date archive): Add `{ source: '/2014/:path*', destination: '/about/blog/', permanent: true }` if you want to capture legacy date URLs.
- **Attachment URLs** under other paths (e.g. `/what-we-do/hire/attachment/...`) currently land on `/hire/` via the existing `/what-we-do/hire` redirect; no separate attachment rule was added.

All redirects use `permanent: true` (301) so search engines and Analytics can update to the new URLs over time.

---

## Refinements applied

### Consistency (faqs → faq, video → videos)
- **`/faqs`** and **`/faqs/`** → `/about/faq/` (root-level; plus existing `/about/faqs` → `/about/faq/`).
- **`/video`** and **`/video/`** → `/galleries/videos/` (root-level; plus existing `/galleries/video` → `/galleries/videos/`).
- Avoids "did I type it right?" 404s when users guess the path.

### Redirect order (next.config.js)
- Redirects run **top to bottom**. Wildcard/specific rules are placed **before** broader ones.
- **Moved near the top** (right after "Parties / weddings"):  
  `team-view/:path*`, `blog/venue-decoration-styling/:path*`, `spring-ball/:path*`, `category/babington-house`, `category/babington-house/page/:path*`, `2014/:path*`.
- Comment in config: *"Redirects run top-to-bottom: put specific/wildcard rules before broader ones."*

### Legacy date archive
- **`/2014/:path*`** → `/about/blog/` (covers legacy date archives from old blog; common from Pinterest/old social).

### Trailing slash
- **`trailingSlash: true`** is set globally in `next.config.js`, so the app consistently uses trailing slashes.  
- Redirect rules still list both `/path` and `/path/` as sources so incoming links with or without a trailing slash are caught.
