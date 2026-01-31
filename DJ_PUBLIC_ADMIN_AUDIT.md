# DJ & Musicians Public Page vs Admin – Audit

## Data flow (admin is master, no fallbacks)

- **Admin DJ** (`/admin/djs/`): Fetches from `GET /api/admin/djs/`, saves via `POST /api/admin/djs/` or `PUT /api/admin/djs/[id]`. Prisma `DJ` table is the single source of truth.
- **Public DJ** (`/artists/djs/`): Fetches from `GET /api/djs` (active DJs only). Displays only what comes from the API; **no legacy or hardcoded fallbacks**.
- **Admin Musicians** (`/admin/musicians/`): Same pattern; Prisma `Musician` is master.
- **Public Musicians** (`/artists/musicians/`): Fetches from `GET /api/musicians`; API-only, no fallbacks.

## Field-by-field (DJs)

| Field | In DB / API | Admin form | Public page source |
|-------|-------------|------------|---------------------|
| **name** | Yes | Yes | API only |
| **bio** | Yes | Yes (single textarea) | `dj.bio`; same value used for short and “Read more” (fullBio) |
| **imageUrl** | Yes | Yes | `dj.imageUrl` only |
| **youtubeEmbed** | Yes | Yes | `dj.youtubeEmbed` (normalized) only |
| **mixcloudEmbeds** | Yes | Yes (2+ URLs) | `dj.mixcloudEmbeds` or `[dj.mixcloudUrl]` only |
| **mixingStyle** | No | No | Default label “Professional DJ Services” |
| **alt** | No | No | Generated from `dj.name` |

## Changes made

1. **Legacy DJs removed**: The hardcoded `legacyDJs` object and all fallbacks were removed from `/artists/djs/page.tsx`. Public page shows only API data.
2. **Empty state**: When the API returns no DJs (empty DB or error), the page shows “No DJs available” and does not show any fallback list.
3. **Musicians**: Public musicians page was already API-only with no legacy; no code change. Admin remains the master for musicians as well.
