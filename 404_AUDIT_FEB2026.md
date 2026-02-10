# 404 / Page-with-redirect audit (Feb 2026) – GSC

All reported URLs are handled via redirects in `next.config.js` or middleware (HTTP→HTTPS, non-www→www).

## Redirects added (latest batch – GSC “Page with redirect” 114 URLs)

| Pattern | Destination |
|--------|-------------|
| `/category/spring-ball`, `/category/spring-ball/` | `/about/blog/bristol-university-spring-ball/` |
| `/category/:path*` (catch-all) | `/about/blog/` |
| `/galleries/images`, `/galleries/images/` | `/galleries/` |
| `/galleries/images-html/nggallery/:path*` | `/galleries/` |
| `/about/testi`, `/about/testi/` | `/testi/` |
| `/author/:path*` | `/about/` |
| `/stylishweddingdisco_wp/:path*`, `/stylishweddingdisco.co.uk/:path*` | `/` |
| `/party-lighting-hire`, `/party-lighting-hire/` | `/parties/party-lighting/` |
| `/artists/djs/attachment/:path*` | `/artists/djs/` |
| `/artists/partydjs`, `/artists/partydjs/`, `/artists/partydjs/attachment/:path*` | `/artists/party-djs/` |
| `/what-we-do/equipment-dj-band-sound-kit`, `/` | `/services/kit-hire/` |
| `/what-we-do/musicians-bands-entertainers`, `/` | `/artists/musicians/` |
| `/artist/djs`, `/artist/djs/` (singular) | `/artists/djs/` |
| `/equipment/fire-pit.html`, `/equipment/led-lighting.php`, `/equipment/led-lighting` (+ trailing) | `/services/fire-pit-hire/` or `/services/lighting-design/` |

## Earlier 404 batch

| Reported URL | Fix |
|--------------|-----|
| `/what-we-do/attachment/dj-decks/` | `/what-we-do/attachment/:path*` → `/artists/djs/` |
| `/party-lighting/` | → `/parties/party-lighting/` |
| `/pennard-house-lighting/attachment/...` | `/pennard-house-lighting/` + `/pennard-house-lighting/attachment/:path*` → `/venues/pennard-house/` |
| `/wedding-styling/` | `/wedding-styling` and `/wedding-styling/` → `/services/venue-styling/` |
| Homepage, `/wedding-lighting/`, `/fire-pit-html/`, `/testimonial-view/...`, `/slide-view/...`, `/blog/.../attachment/...`, `/what-we-do/party-planning-production`, `/what-we-do/venue-decoration`, `/babington-wedding-info/`, `/artists/musicians-html/`, `/home/attachment/...`, `/wp-content/...`, `/team-view/...`, `/contact-us`, `/galleries/video`, `/parties/private`, `/parties/weddings`, etc. | Already covered by existing redirects or middleware. |

## Notes

- **Trailing slash:** With `trailingSlash: true`, Next.js redirects paths without trailing slash to the slash version (e.g. `/contact-us` → `/contact-us/`). No extra redirects needed for those.
- **Protocol/host:** Middleware forces HTTPS and redirects `stylishentertainment.co.uk` → `www.stylishentertainment.co.uk`.
- **Query params:** Middleware strips `attachment_id`, `wordfence_lh`, `hid`, `wc-ajax` and redirects to the same path; `?s=` (search) → `/about/blog/`.
- After deploy, use “Validate fix” in GSC for affected URLs so coverage updates.
