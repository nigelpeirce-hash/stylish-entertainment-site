# YouTube API Key Setup Guide

## Environment Variable Name

The correct environment variable is:
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your-api-key-here
```

## How to Get Your YouTube API Key

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Create a new project or select an existing one

### Step 2: Enable YouTube Data API v3

1. Go to **APIs & Services** → **Library**
2. Search for "YouTube Data API v3"
3. Click on it and press **Enable**

### Step 3: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy the generated API key (format: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 4: Configure API Key Restrictions (Recommended)

1. Click on your newly created API key to edit it
2. Under **API restrictions**, select **Restrict key**
3. Choose **YouTube Data API v3**
4. Under **Application restrictions**:
   - For development: Add `localhost` and `127.0.0.1`
   - For production: Add your domain `stylishentertainment.co.uk`
5. Click **Save**

### Step 5: Add to Environment Variables

Add to your `.env.local` file:
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UCXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Note**: The `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID` is optional. If not set, it defaults to `@stylishentertainment937`.

## Channel ID vs Handle

The system can use either:
- **Channel Handle**: `@stylishentertainment937` (default)
- **Channel ID**: `UCXXXXXXXXXXXXXXXXXXXXXXXXX` (starts with "UC")

To find your Channel ID:
1. Visit: https://commentpicker.com/youtube-channel-id.php
2. Enter your channel handle: `@stylishentertainment937`
3. Copy the Channel ID (starts with "UC")

## API Key Format

A valid YouTube API key:
- Starts with `AIzaSy`
- Is approximately 39 characters long
- Example: `AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz`

## Verification

After adding the API key:

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3001/galleries/videos

3. Check browser console:
   - Should see: "YouTube API Key found, fetching videos..."
   - Should NOT see: "YouTube API Key not configured"

4. If you see errors:
   - **403 Forbidden**: API key restrictions are too strict
   - **400 Bad Request**: Channel ID format is incorrect
   - **401 Unauthorized**: API key is invalid or expired

## Troubleshooting

### "API key error (403)"

**Solution**: 
1. Check API key restrictions in Google Cloud Console
2. Ensure "YouTube Data API v3" is enabled
3. Add your domain/localhost to allowed referrers

### "Channel not found"

**Solution**:
1. Use Channel ID instead of handle: `UCXXXXXXXXXXXXXXXXXXXXXXXXX`
2. Get Channel ID from: https://commentpicker.com/youtube-channel-id.php

### "Quota exceeded"

**Solution**:
- YouTube Data API has a daily quota (10,000 units/day by default)
- Each video fetch uses 1 unit
- If you hit the limit, wait 24 hours or request quota increase

## Production Setup

In your hosting platform (Vercel, Azure, etc.):

1. Add environment variable:
   - **Name**: `NEXT_PUBLIC_YOUTUBE_API_KEY`
   - **Value**: Your API key

2. Add channel ID (optional):
   - **Name**: `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID`
   - **Value**: `UCXXXXXXXXXXXXXXXXXXXXXXXXX`

3. Redeploy your application

## Security Notes

- ✅ **DO**: Restrict API key to YouTube Data API v3 only
- ✅ **DO**: Add domain restrictions for production
- ❌ **DON'T**: Commit API key to git (already in `.gitignore`)
- ❌ **DON'T**: Share API key in screenshots or logs

---

**Last Updated**: 2026-01-20
