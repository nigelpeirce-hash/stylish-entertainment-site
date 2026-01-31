# Wedding Entertainment – DJ Section Audit

## Current State (BEFORE) – `/weddings/wedding-entertainment/`

### Wedding DJs Section (lines 188–331)

| Aspect | Current | Issue |
|--------|---------|-------|
| **Data source** | Hardcoded `const djs = [...]` (lines 22–58) | Not connected to Admin; never updates |
| **Layout** | `<Slider>` – horizontal carousel | Old slider UX; not tiled |
| **Card structure** | 3-column: Image \| Bio + Read More \| YouTube+Mixcloud on card | Embeds visible on card; different from wedding-dj |
| **DJ fields** | name, image, alt, mixingStyle, genres, bio, fullBio, youtubeEmbed, mixcloudEmbeds | `genres` not in DB; static data |
| **Read More modal** | Shows fullBio only | No YouTube/Mixcloud in modal |
| **Theme** | Light (from-white to-gray-50/30) | Inconsistent with wedding-dj |
| **Loading/empty** | None | No states |
| **See all DJs** | None | No link to /artists/djs/ |

### Dependencies
- `Slider` component
- Hardcoded DJ data

---

## Target State (AFTER) – Match wedding-dj module

### Wedding DJs Section – Aligned with `/wedding-dj/`

| Aspect | Target |
|--------|--------|
| **Data source** | `GET /api/djs` – Admin is source of truth |
| **Layout** | Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` – tiled cards |
| **Card structure** | Image + overlay (name, strapLine) \| Bio excerpt \| Read More |
| **Read More modal** | fullBio + YouTube + Mixcloud (same as wedding-dj) |
| **Theme** | Dark (bg-gray-900) to match wedding-dj |
| **Loading** | "Loading DJs..." |
| **Empty** | "No DJs available" + link to /artists/djs/ |
| **See all DJs** | Link to /artists/djs/ |

### Shared logic with wedding-dj
- `normalizeYouTubeUrl()` for YouTube
- `mixcloudEmbeds` from API (with mixcloudUrl fallback)
- `allow="encrypted-media; ..."` on Mixcloud LazyIframe

---

## Implementation Plan

1. Remove hardcoded `djs` array from WeddingEntertainmentClient.
2. Add `useState` / `useEffect` to fetch from `/api/djs`.
3. Add `normalizeYouTubeUrl` (inline or extract shared util).
4. Replace `<Slider>` + Card layout with grid of cards (same as wedding-dj Meet Our DJs).
5. Update Read More modal: fullBio, YouTube, Mixcloud.
6. Add loading and empty states.
7. Add "See all DJs" link.
8. Remove `Slider` import if no longer used.
9. Add `ArrowRight` icon import for Read More.
10. Match wedding-dj card styling (dark theme).
