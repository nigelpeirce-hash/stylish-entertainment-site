# GSC "Discovered - currently not indexed" (439 URLs) – Audit & Redirects

Google found these URLs but did not index them. For **legacy/obsolete** URLs we added **301 redirects** so they resolve to canonical pages; for **real pages** (e.g. /about/, /parties/, /galleries/) the status is expected (crawl budget / indexing choice).

## Redirects added (next.config.js)

### Babington / venues
- `/babington-house/:path*` → `/venues/babington-house/`  
  (covers /babington-house/3387/attachment/..., /babington-house/five-ways..., /babington-house/the-orangery...)

### Attachments (WordPress-style)
- `/christmas/attachment/:path*` → `/parties/christmas/`
- `/dj-nige/attachment/:path*` → `/artists/djs/`
- `/fire-pit-html/attachment/:path*` → `/services/fire-pit-hire/`
- `/lighting-hire/attachment/:path*` → `/parties/party-lighting/`
- `/party-lighting/attachment/:path*` → `/parties/party-lighting/`
- `/party-planning-and-organising/attachment/:path*` → `/party-planning-and-organising/`
- `/parties/attachment/:path*` → `/parties/`
- `/what-we-do/djs-discos/attachment/:path*` → `/artists/djs/`
- `/what-we-do/equipment-dj-band-sound-kit/attachment/:path*` → `/services/kit-hire/`
- `/what-we-do/hire/attachment/:path*` → `/hire/`
- `/what-we-do/musicians-bands-entertainers/attachment/:path*` → `/artists/musicians/`
- `/what-we-do/party-planning-production/attachment/:path*` → `/party-planning-and-organising/`
- `/what-we-do/selfie-mirror-photo-booth-hire` (+ / and /attachment/:path*) → `/galleries/`
- `/zoom-dj/attachment/:path*` → `/artists/djs/`

### Legacy paths (cart, shop, worksheets, galleries, tag, thanks)
- `/cart`, `/cart/` → `/hire/`
- `/shop`, `/shop/` → `/hire/`
- `/image-gallery`, `/image-gallery-2` (+ trailing slash) → `/galleries/`
- `/mirror-balls-anywhere` (+ / and /attachment/:path*) → `/services/lighting-design/`
- `/musicians-bands-worksheet`, `/party-dj-worksheet` (+ /) → `/artists/musicians/`, `/artists/djs/`
- `/tag/:path*` → `/about/blog/`
- `/thanks`, `/thanks/` → `/thank-you/`
- `/testimonials`, `/testimonials/` → `/testi/`
- `/parties/christmas-parties` (+ /) → `/parties/christmas/`
- `/zoom-dj-booking-form`, `/zoom-dj-final-details` (+ /) → `/artists/djs/`
- `/artists/djs/dj-james`, `/artists/djs/dj-nige`, `/artists/djs/james-h`, `/artists/djs/rich-s` (+ /) → `/artists/djs/`

## Already covered (no change)

- `/?attachment_id=*` – middleware strips `attachment_id` and redirects to same path (e.g. `/`).
- `/testimonial-view/:path*`, `/slide-view/:path*`, `/blog/:path*/attachment/:path*`, `/home/attachment/:path*`, `/ngg_tag/:path*`, `/team-view/:path*`, `/spring-ball/:path*`, `/category/blog/:path*`, `/category/:path*`, `/wp-content/:path*`, etc. – already in config.
- `/artists/musicians-html/attachment/:path*`, `/babington-house-wedding-info/attachment/:path*`, `/party-lighting-hire/attachment/:path*`, `/pennard-house-lighting/attachment/:path*`, `/what-we-do/attachment/:path*`, `/what-we-do/venue-decoration/attachment/:path*` – already in config.

## Real pages (no redirect)

These are valid site URLs; “Discovered - currently not indexed” is a choice by Google (crawl budget, low priority), not a 404:

- `/about/`, `/about/blog/...`, `/about/faq/`, `/artists/`, `/contact-us/`, `/galleries/`, `/galleries/instagram/`, `/galleries/videos/`, `/kin-house-wiltshire/`, `/parties/`, `/parties/corporate-events/`, `/pennard-house-lighting/` (redirects to venues/pennard-house), `/privacy-policy/`, `/services/lighting-design/`, `/venues/pennard-house/`, `/what-we-do/`, `/what-we-do/equipment-dj-band-sound-kit/`, `/what-we-do/lighting/`, etc.

Improving indexing for these is about **sitemap, internal links, and content**, not redirects.

## After deploy

1. Legacy URLs in the list should 301 to the targets above; GSC will re-crawl over time.
2. Optionally use **Validate fix** in GSC for the “Discovered - currently not indexed” report.
3. Real pages: ensure they’re in `sitemap.ts` and linked from the site so Google can prioritise them.
