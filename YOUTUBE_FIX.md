# YouTube Videos Not Showing - Quick Fix

## Problem
No videos are showing in the gallery page (`/galleries/videos`).

## Root Cause
The YouTube API key is not configured in `.env.local`.

## Solution

### Option 1: Add YouTube API Key (Recommended - Shows Real Videos)

1. **Get a YouTube API Key:**
   - Go to: https://console.cloud.google.com/
   - Enable "YouTube Data API v3"
   - Create an API key
   - See `YOUTUBE_API_SETUP.md` for detailed instructions

2. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

### Option 2: Use Fallback Videos (Quick Fix - Shows Sample Videos)

The code already has fallback videos that should display when the API key is missing. If they're not showing:

1. **Check browser console** (F12) for errors
2. **Check if videos are loading** - they should show even without API key
3. **Hard refresh** the page (Cmd+Shift+R or Ctrl+Shift+R)

## Current Status

✅ **Fallback videos are configured** - These should show:
- "LED Furniture & Fire Pits" (sDXBCwhMMkM)
- "Venue Transformation" (47yP9a9lEg8)
- "Circus Tent Party" (Nmc1Y_pzWbE)

❌ **YouTube API key not found** in `.env.local`

## What I Fixed

1. ✅ Improved error messages to show when API key is missing
2. ✅ Added more fallback videos
3. ✅ Better console logging for debugging

## Next Steps

1. **Check the gallery page** - Do you see any videos at all?
2. **Check browser console** - What errors do you see?
3. **If no videos show:**
   - Check if the page is loading correctly
   - Check Network tab for failed requests
   - Share the console errors with me

## Quick Test

Visit: `http://localhost:3001/galleries/videos`

You should see:
- At least 2-3 fallback videos (even without API key)
- A message about API key if in development mode

If you see nothing, there might be a different issue (React error, network issue, etc.).
