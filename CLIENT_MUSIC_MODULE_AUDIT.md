# Client Music Module Audit

## Current State (Before Changes)

### 1. MusicPlaylistManager (`components/MusicPlaylistManager.tsx`)
- **Used in:** `app/client/dashboard/page.tsx`, `app/client/dashboard/SingleEventHero.tsx`
- **Features:** First dance, last song, must-plays (add-one-by-one), do-not-plays, notes, Spotify links (array), PDF/Word upload
- **Issues:**
  - File upload stores data URLs locally only – does NOT upload to Cloudinary
  - Saves to `/api/client/bookings/${id}/music` – **this API does not exist**
  - Spotify links and uploaded files stored as JSON string – not persisted to booking schema (booking has single `musicFileUrl`)

### 2. PortalView inline music (`components/client/PortalView.tsx`)
- **"Your Music" card (new):** Must-plays, do-not-plays, Save – always visible
- **Final Details form (3-week window):** First dance, must-plays, last song, dislikes, notes, Spotify/PDF URL + file upload
- **Issues:** Duplicated across two sections; Spotify/file upload gated to 3-week window

### 3. APIs
- **`/api/client/bookings/[id]/music-preferences`** – PATCH musicRequests, musicDislikes only
- **`/api/client/bookings/[id]/upload-music-file`** – POST PDF/Word upload; **21-day restriction**; **no auth**
- **`/api/client/bookings/[id]/upload-hero-image`** – POST/DELETE; uses Cloudinary; day-1 access
- **`/api/client/bookings/[id]/final-details`** – PATCH full details; 21-day restriction

### 4. Cloudinary
- **Hero image:** `upload-hero-image` returns 503 + alert if `isCloudinaryConfigured()` is false
- **Check:** `CLOUDINARY_CLOUD_NAME` (or `NEXT_PUBLIC_`) + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`
- **Note:** If vars are in `.env.local`, ensure dev server was restarted. API_KEY and API_SECRET must be server-side only (no NEXT_PUBLIC).
- **If alert still shows with vars set:** Verify `.env.local` is loaded (e.g. `console.log` in API route), check for typos, ensure no trailing spaces. Hero photo and music file upload both use the same Cloudinary config.

## Changes Applied

1. **New `ClientMusicModule`** – Single unified component: must-plays, do-not-plays, Spotify link, PDF/Word upload, first dance, last song, notes
2. **`upload-music-file`** – Auth added (token/session), 21-day restriction removed (day-1 access)
3. **`music-preferences`** – Expanded to accept musicFileUrl, firstDance, lastSong, musicNotesToDJ
4. **PortalView** – Replaced fragmented music UI with ClientMusicModule
5. **Dashboard / SingleEventHero** – Replaced MusicPlaylistManager with ClientMusicModule
