# YouTube API Not Working on Live Site – Investigation

The videos page (`/galleries/videos`) uses the YouTube Data API v3. When it works, it loads real playlists from your channel. When it fails, it falls back to sample videos and may show an error banner.

---

## Step 1: Check the console log

On the live site, open **https://www.stylishentertainment.co.uk/galleries/videos** and open DevTools → **Console**.

Find the line: **`YouTube API Configuration Check: Object`**

Expand the object. You should see:

| Field         | What it tells you |
|---------------|-------------------|
| `hasApiKey`   | `false` = API key not set in Vercel. `true` = key is present. |
| `apiKeyLength`| Should be ~39 if valid. `0` or small = missing or placeholder. |
| `apiKeyPreview` | First 10 chars (e.g. `AIzaSyB123...`). Confirms key format. |
| `channelId`   | `@stylishentertainment937` or `UC...` (Channel ID). |
| `environment` | `client` (expected for this page). |

**Interpretation:**
- **`hasApiKey: false`** → Go to [Step 2](#step-2-api-key-not-in-vercel).
- **`hasApiKey: true`** but videos still fail → Go to [Step 3](#step-3-api-key-present-but-fails).

---

## Step 2: API key not in Vercel

`NEXT_PUBLIC_*` vars are baked in at **build time**. They must exist in Vercel before you deploy.

1. Open [Vercel Dashboard](https://vercel.com) → your project → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `NEXT_PUBLIC_YOUTUBE_API_KEY`
   - **Value:** Your YouTube API key (from Google Cloud Console).
   - **Environment:** Production (and Preview if you use it).
3. Optionally add:
   - **Name:** `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID`
   - **Value:** `UC...` (Channel ID) or `@stylishentertainment937`.
4. **Redeploy** the app (trigger a new deployment). Existing deployments won’t get new env vars.

---

## Step 3: API key present but fails

If `hasApiKey: true` but you still get fallback videos or an error banner, check:

### 3a. 403 Forbidden – HTTP referrer restrictions

403 often means the API key is restricted to domains that don’t include your live site.

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Click your API key.
3. Under **Application restrictions**:
   - If set to **HTTP referrers**, add:
     - `https://www.stylishentertainment.co.uk/*`
     - `https://stylishentertainment.co.uk/*`
     - `https://*.vercel.app/*` (if you use Vercel preview URLs).
   - Or use **None** for testing (less secure).
4. Under **API restrictions**, ensure **YouTube Data API v3** is allowed.
5. Save.

### 3b. YouTube Data API v3 not enabled

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Library**.
2. Search **YouTube Data API v3**.
3. Click it and press **Enable**.

### 3c. Channel ID / handle issues

If you use `@stylishentertainment937`, the API may fail to resolve it. Prefer the **Channel ID** (starts with `UC...`):

1. Get it from: https://commentpicker.com/youtube-channel-id.php
2. In Vercel env vars, set:
   - `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3d. Quota exceeded

YouTube Data API v3 has a daily quota (~10,000 units). If exceeded:

- Wait 24 hours, or
- Request a quota increase in Google Cloud Console.

---

## Step 4: Verify

1. Visit **https://www.stylishentertainment.co.uk/galleries/videos**.
2. You should see real playlists from your channel (not only sample videos).
3. Check the console: no YouTube-related errors; you may see `Successfully loaded X unique videos...`.

---

## Checklist

- [ ] `NEXT_PUBLIC_YOUTUBE_API_KEY` set in Vercel (and redeployed)
- [ ] `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID` set (optional; defaults to `@stylishentertainment937`)
- [ ] YouTube Data API v3 enabled in Google Cloud
- [ ] API key HTTP referrer includes `https://www.stylishentertainment.co.uk/*`
- [ ] New deployment after adding env vars

---

## Related docs

- `YOUTUBE_API_SETUP.md` – How to create and configure the API key.
- `YOUTUBE_FIX.md` – General YouTube gallery troubleshooting.
