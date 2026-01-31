# DJ Module – Full Audit

## Data Flow

```
Admin (/admin/djs)                    Public API (/api/djs)                 Consumers
     │                                       │                                    │
     │  GET /api/admin/djs/                  │  GET /api/djs                      │
     │  PUT /api/admin/djs/[id]              │  (returns active DJs only)         │
     │  POST /api/admin/djs/                 │                                    │
     │         │                             │         │                          │
     ▼         ▼                             ▼         ▼                          ▼
┌─────────────────────┐            ┌─────────────────────┐            ┌──────────────────────────┐
│   Prisma DJ table   │◄───────────│  Same database      │───────────►│ /wedding-dj (Read More)  │
│   (source of truth) │            │                     │            │ /artists/djs (profile)   │
└─────────────────────┘            └─────────────────────┘            └──────────────────────────┘
```

## Schema (Prisma DJ model)

| Field           | Type    | Notes                                             |
|-----------------|---------|---------------------------------------------------|
| id              | String  | @id                                               |
| name            | String  |                                                   |
| slug            | String? | @unique                                           |
| bio             | String? | Short bio (card, SEO)                             |
| strapLine       | String? | Card tagline (e.g. "Seamless Mixing")             |
| fullBio         | String? | Long bio for Read More modal                      |
| imageUrl        | String? |                                                   |
| youtubeEmbed    | String? | YouTube embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID) |
| mixcloudUrl     | String? | Legacy single Mixcloud URL                        |
| mixcloudEmbeds  | Json?   | Array of Mixcloud embed URLs                      |
| seoTitle        | String? |                                                   |
| seoDescription  | String? |                                                   |
| displayOrder    | Int     |                                                   |
| isActive        | Boolean |                                                   |

## Migrations (run on Supabase)

These SQL files must be run if the columns don't exist:

1. **supabase-add-youtube-embed-migration.sql** – adds `youtubeEmbed` to DJ
2. **prisma/migrations/add_dj_mixcloud_embeds.sql** – adds `mixcloudEmbeds` (JSONB)
3. **prisma/migrations/add_strap_line_full_bio_dj_musician.sql** – adds `strapLine`, `fullBio`

**Consolidated migration** (use if unsure): `prisma/migrations/dj_full_media_migration.sql`

## Admin ↔ API Wiring

| Admin Form Field | API Payload | DB Column      | Persisted? |
|------------------|-------------|----------------|------------|
| youtubeEmbed     | youtubeEmbed| youtubeEmbed   | ✅ PUT, ✅ POST (via rest) |
| mixcloudEmbeds   | mixcloudEmbeds | mixcloudEmbeds | ✅ Both |
| fullBio          | fullBio     | fullBio        | ✅ Both |
| strapLine        | strapLine   | strapLine      | ✅ Both |

**Note:** Admin POST create spreads `...rest` which includes `youtubeEmbed`; explicit handling added for robustness.

## Public API (/api/djs)

- **Selects:** id, name, slug, bio, strapLine, fullBio, imageUrl, mixcloudUrl, mixcloudEmbeds, youtubeEmbed, etc.
- **Returns:** active DJs only; `mixcloudEmbeds` normalized from `mixcloudEmbeds` or `[mixcloudUrl]`.
- **Cache:** `s-maxage=60, stale-while-revalidate=300` – responses may be cached for up to 5 min.

## Wedding-dj Read More Modal

- **Fetches:** `/api/djs`
- **Uses:** fullBio, youtubeEmbed, mixcloudEmbeds
- **Fixes applied:**
  1. YouTube URL normalization (watch/short → embed)
  2. Filter empty strings from mixcloudEmbeds
  3. Same mapping logic as /artists/djs

## Artists/djs Profile Page

- **Fetches:** `/api/djs`
- **Uses:** normalizeYouTubeUrl(), mixcloudEmbeds, fullBio
- **Behavior:** Same API, same data; wedding-dj now uses the same normalization.

## Common Causes of Empty YouTube/Mixcloud

1. **DB columns missing** – run the migrations above.
2. **Records created before columns existed** – edit and save the DJ again in Admin.
3. **API caching** – hard refresh (Cmd+Shift+R) or wait for cache expiry.
4. **Zod validation failure** – URL format must pass `z.string().url()`; watch for trailing spaces or invalid formats.
5. **Empty Mixcloud URLs in array** – Admin form can have `["", "https://..."]`; frontend now filters empties.

## Verification Steps

1. In Supabase SQL editor, run:  
   `SELECT id, name, "youtubeEmbed", "mixcloudEmbeds" FROM "DJ";`
2. Edit DJ Nige in Admin, add YouTube/Mixcloud, click Update DJ.
3. Re-run the SELECT; values should be non-null.
4. Open `/api/djs` in browser; response should include `youtubeEmbed` and `mixcloudEmbeds`.
5. Hard refresh `/wedding-dj` and click Read More on DJ Nige.
