# GSC "Excluded by noindex tag" (5 URLs) – Feed URLs

All 5 example URLs are **legacy feed** paths. They are already **301-redirected** in `next.config.js`, so they do not serve a page (and no noindex response).

## URLs and redirects

| URL | Redirect in next.config.js | Destination |
|-----|----------------------------|-------------|
| `/artists/musicians-html/feed/` | ✅ | `/artists/musicians/` |
| `/fire-pit-html/feed/` | ✅ | `/services/fire-pit-hire/` |
| `/feed/?attachment_id=2803` | Middleware strips `attachment_id` → `/feed/`, then redirect | `/about/blog/` |
| `/parties/private/feed/` | ✅ | `/parties/private-parties/` |
| `/what-we-do/led-lighting-php/feed/` | ✅ | `/services/lighting-design/` |

## Why GSC still shows "noindex"

- The **last crawl** dates are Nov 2025. That crawl may have hit the old site or an earlier deploy where these URLs still returned 200 + noindex (e.g. WordPress feed pages).
- **Current behaviour:** These paths have no page in the app; `next.config.js` redirects run first, so the response is **301** to the destination, not 200 with noindex.
- **What to do:** Use **Validate fix** for the “Excluded by noindex tag” report so Google re-crawls. After re-crawl, the feed URLs should be seen as redirects and the report count can drop.

No code changes required; redirects and middleware already cover all 5.
