# GSC "Crawled - currently not indexed" (43 URLs) – Audit

Google has crawled these URLs but not indexed them. For **legacy/duplicate** URLs we rely on **301 redirects** so the canonical page is the only one that could be indexed. For **one real page** in the list, indexing is a Google choice (crawl budget / priority).

## Coverage: all 43 example URLs

| URL pattern / example | Handled by |
|-----------------------|------------|
| `stylishentertainment.co.uk/babington-house-wedding-info/` | Redirect → www, then path → `/venues/babington-house/` |
| `/?wordfence_lh=1&hid=...` | **Middleware:** strips `wordfence_lh`, `hid` → 301 to same path (e.g. `/`) |
| `/?wc-ajax=%%endpoint%%` | **Middleware:** strips `wc-ajax` → 301 to `/` |
| `/testimonial-view/*` (e.g. hotel-du-vin-poole-dorset, queen-mary-university-london) | **Redirect:** `/testimonial-view/:path*` → `/testi/` |
| `/slide-view/*` (e.g. slide-1/attachment/430-2) | **Redirect:** `/slide-view/:path*` → `/testi/` |
| `/testi/page/16/` | **Redirect:** `/testi/page/:path*` → `/testi/` |
| `/category/blog/`, `/category/blog/lighting/` | **Redirect:** `/category/blog`, `/category/blog/:path*` → `/about/blog/` |
| `/artists/musicians-html/attachment/*` | **Redirect:** → `/artists/musicians/` |
| `/ngg_tag/*` (incl. …/nggallery/slideshow, …/nggallery/thumbnails) | **Redirect:** `/ngg_tag/:path*` → `/services/lighting-design/` |
| `/party-lighting-hire/attachment/*` | **Redirect:** → `/parties/party-lighting/` |
| `/babington-house-wedding-info/attachment/*` | **Redirect:** → `/venues/babington-house/` |
| `/kin-house-wiltshire/attachment/*` | **Redirect:** → `/kin-house-wiltshire/` |
| `/blog/*/attachment/*` | **Redirect:** → `/about/blog/` |
| `/?attachment_id=2803` | **Middleware:** strips `attachment_id` → 301 to `/` |
| **`www.stylishentertainment.co.uk/weddings/wedding-lighting/`** | **Real page** – canonical URL. No redirect. “Crawled not indexed” is an indexing decision (priority/crawl budget). Ensure it’s in sitemap and linked internally. |

## Summary

- **42 of 43** are legacy or query-param URLs: already redirected (next.config.js) or normalized (middleware). No code changes needed.
- **1 of 43** is the live page `/weddings/wedding-lighting/`. Keep it in the sitemap and linked from the site; indexing will follow Google’s crawl/priority.

After the next crawl, the legacy URLs should be seen as 301s; you can use **Validate fix** in GSC for the “Crawled - currently not indexed” report if you want Google to re-check.
