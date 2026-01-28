# Build Error Troubleshooting

## Current Issue
Build fails during "Collecting page data..." phase on Vercel.

## What to Check

### 1. View Full Build Logs
In Vercel Dashboard:
- Click on the failed deployment
- Scroll down in the build logs
- Look for the actual error message (it's cut off in the summary)

### 2. Common Causes During "Collecting page data"

#### A. Blog Pages with framer-motion
- Check if blog pages are still trying to prerender
- Verify `export const dynamic = 'force-dynamic'` is in all blog pages

#### B. Missing Environment Variables
- Check if any code is trying to access env vars during build
- Verify `RESEND_DEFAULT_FROM` and `RESEND_API_KEY` are set in Vercel

#### C. Database Connection Issues
- Prisma might be trying to connect during build
- Check if `DATABASE_URL` is set correctly

### 3. Quick Fixes to Try

#### Option 1: Check Full Error
Scroll down in Vercel build logs to see the complete error message.

#### Option 2: Add More Error Handling
If it's a specific page failing, we can add try-catch blocks.

#### Option 3: Disable Prerendering for Problematic Pages
Add `export const dynamic = 'force-dynamic'` to any page that's failing.

## Next Steps

1. **Get the full error** from Vercel build logs
2. **Check which page is failing** (if it's a specific page)
3. **Verify environment variables** are set in Vercel
4. **Check if it's the blog pages** (we know those had issues)

## How to View Full Logs

1. Go to Vercel Dashboard
2. Click on the failed deployment (38a9c1f)
3. Click "Build Logs" tab
4. Scroll to the bottom to see the actual error
5. Copy the full error message

The error is likely one of:
- Blog page useState error (framer-motion)
- Missing environment variable
- Database connection issue
- Module resolution issue (vertx or other)
