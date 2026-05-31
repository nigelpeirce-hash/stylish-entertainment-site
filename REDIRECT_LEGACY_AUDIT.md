# Legacy redirect audit — stylishweddingdisco.co.uk → stylishentertainment.co.uk

**Last updated:** 31 May 2026  
**Config:** `next.config.js` — host-guarded block (`LEGACY_HOST`) + same-site rules below it.

---

## How legacy redirects work

1. **Cross-domain (legacy host only)** — Rules with `has: [{ host: stylishweddingdisco.co.uk }]`. Only fire when the request hits the old domain on this Vercel project.
2. **Same-site** — Rules without `has` — apply on `www.stylishentertainment.co.uk` (old bookmarks, GSC URLs, internal typos).

**Order:** Specific legacy maps → wildcard families → `legacy("/:path*", "/:path*")` (preserve path on new domain).  
**Not homepage by default:** Only `wp-content`, `wp-admin`, `wp-login`, and a few stray paths on the *new* domain go to `/`.

---

## GA4 top paths (2025 export) — status

| Legacy URL | Sessions share | Destination | Status |
|------------|----------------|-------------|--------|
| `/wedding-djs/` | ~51% | `/artists/djs/` | OK (legacy + same-site) |
| `/` | — | `/` | OK |
| `/mells-barn-weddings/` | — | `/venues/mells-barn/` | OK |
| `/wedding-lighting-design/` | High | `/weddings/wedding-lighting/` | **Fixed** (was split with same-site → `/services/lighting-design/`) |
| `/what-we-do/venue-styling/` | — | `/services/venue-styling/` | OK |
| `/contact-us/` | — | `/contact-us/` | OK |
| `/blogs/babington-house-weddings` | — | `/venues/babington-house/` | OK |
| `/blogs/mells-barn-wedding/` | — | `/venues/mells-barn/` | OK |
| `/what-we-do/fire-pit-hire/` | — | `/services/fire-pit-hire/` | OK |
| `/artists/djs/` | — | `/artists/djs/` | OK (preserve path) |
| `/galleries/venue-decoration/` | — | `/services/venue-styling/` | OK |
| `/pennard-house-somerset/` | — | `/venues/pennard-house/` | OK |

---

## Fixes applied (31 May 2026)

### 1. Duplicate `/wedding-lighting-design/` (critical)

| Rule | Before | After |
|------|--------|-------|
| Legacy host (lines 157–158) | `/weddings/wedding-lighting/` | unchanged |
| Same-site (was line 510) | `/services/lighting-design/` | **`/weddings/wedding-lighting/`** |

Aligns with wedding content plan and GA4 intent (wedding lighting, not generic services page).

### 2. Legacy host — added specific maps (before `what-we-do/:path*` catch-all)

These used to fall through to `/what-we-do/` hub or preserved path → 404:

| Legacy path | New destination |
|-------------|-----------------|
| `/what-we-do/djs-discos/` | `/artists/djs/` |
| `/what-we-do/musicians-bands-entertainers/` | `/artists/musicians/` |
| `/what-we-do/party-planning-production/` | `/party-planning-and-organising/` |
| `/what-we-do/venue-decoration/` | `/services/venue-styling/` |
| `/what-we-do/selfie-mirror-photo-booth-hire/` | `/galleries/` |
| `/wedding-styling/` | `/services/venue-styling/` |
| `/wedding-lighting/` | `/weddings/wedding-lighting/` |
| `/babington-house/`, `/babington-wedding-info/` | `/venues/babington-house/` |
| Blog slugs (lighting + professional DJ) | Matching `/about/blog/.../` posts |

---

## Intentional → homepage (`/`)

**Legacy host only:**

- `/wp-content/*`, `/wp-admin/*`, `/wp-login.php` — WordPress system URLs (no content equivalent).

**Same-site only (stray paths):**

- `/stylishweddingdisco_wp/*`, `/stylishweddingdisco.co.uk/*` — malformed paths on new domain.
- `/hannah-ross/` — retired one-off page.

---

## Wildcard behaviour (by design)

| Pattern | Destination | Note |
|---------|-------------|------|
| `legacy("/:path*", "/:path*")` | Same path on new domain | Unknown legacy URLs → 404 if no page exists (not homepage). |
| `legacy("/blogs/:path*")` | `/about/blog/` | Unmapped blog slugs → blog hub (not individual post). Known posts have 1:1 rules. |
| `legacy("/category/:path*")` | `/about/blog/` | Except `babington-house` and `venue-decoration-styling` (specific). |
| `legacy("/what-we-do/:path*")` | `/what-we-do/` | Last resort after all specific `what-we-do/*` maps. |
| `legacy("/team-view/:path*")` | `/about/` | Except `nigel-peirce` → `/artists/djs/dj-nige/`. |

---

## Same-site rules (stylishentertainment.co.uk)

Most high-traffic legacy paths are duplicated without the host guard (e.g. `/wedding-djs/`, `/mells-barn-weddings/`, Babington variants). Same-site block is larger (GSC 404 cleanup, attachments, feeds, typos).

**No conflict** with legacy host: host guard ensures legacy domain uses the consolidation block first.

---

## Remaining gaps (low priority / monitor in GSC)

| Scenario | Risk | Action |
|----------|------|--------|
| Unmapped `/blogs/{slug}/` on legacy host | Lands on `/about/blog/` not post | Add 1:1 rules when GSC shows traffic to specific slugs. |
| Preserved path `/:path*` → 404 | Old URL with no new page | Add 1:1 when GSC reports impressions. |
| `/what-we-do/led-lighting-php` → `/services/lighting-design/` | Corporate lighting page, not `/weddings/wedding-lighting/` | Intentional (different legacy URL from `wedding-lighting-design`). |
| `URL_MAPPING.md` | Still says lighting-design for #7 | Update doc to match (optional). |

---

## Pre-approval checklist (wedding page work)

- [x] Audit legacy host 1:1 maps vs GA4 top paths
- [x] Fix `/wedding-lighting-design/` duplicate
- [x] Add missing legacy `what-we-do/*` and wedding/venue/blog maps
- [ ] After deploy: spot-check in GSC “Redirects” + live curl with `Host: stylishweddingdisco.co.uk` if DNS pointed at Vercel
- [ ] Proceed with wedding plan items 1–3 (`/weddings/wedding-lighting/`, `/weddings/wedding-entertainment/`, `/venues/`)

---

## Quick test commands

```bash
# Same-site (new domain)
curl -sI "https://www.stylishentertainment.co.uk/wedding-lighting-design/" | grep -i location

# Legacy host (only works when old domain points at this deployment)
curl -sI -H "Host: stylishweddingdisco.co.uk" "https://www.stylishentertainment.co.uk/wedding-lighting-design/" | grep -i location
```

Expected: `location: https://www.stylishentertainment.co.uk/weddings/wedding-lighting/`
