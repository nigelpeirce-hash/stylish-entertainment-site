# Build Issues Summary - January 27, 2026

## Current Status

### ✅ Fixed
1. **Prisma Schema** - Added `url = env("DATABASE_URL")` back (required for validation)
2. **Prisma Versions** - Aligned `@prisma/adapter-pg` to match CLI version (6.19.2)
3. **ESLint Config** - Reverted to 14.2.5 to match ESLint 8
4. **Email Build Error** - Fixed with build-time detection
5. **_not-found Page** - Fixed React errors
6. **Blog Pages** - Added `export const dynamic = 'force-dynamic'` to all blog pages
7. **BlogImage Component** - Dynamically imported in all blog pages

### ⚠️ Remaining Issues

#### 1. Blog Pages Still Failing Build
**Error**: `TypeError: Cannot read properties of null (reading 'useState')`

**Affected Pages**:
- `/about/blog/bristol-university-spring-ball`
- `/about/blog/five-ways-to-totally-transform-a-venue-2-decor`
- `/about/blog/why-you-should-use-an-experienced-professional-dj`
- `/about/blog/five-ways-to-totally-transform-a-venue-1-lighting`

**Root Cause**: 
- These pages use `framer-motion` which internally uses `useState`
- Even with `export const dynamic = 'force-dynamic'`, Next.js 15.5.10 is still trying to analyze them during build
- The `motion` component from framer-motion can't be dynamically imported (it's used as JSX)

**Possible Solutions**:
1. **Downgrade Next.js** to 15.1.11 (was working before)
2. **Use route segment config** to completely skip static generation
3. **Accept build warnings** - pages will work at runtime, just can't be statically generated
4. **Remove framer-motion animations** from blog pages (not ideal)

#### 2. Google Fonts Network Error
**Error**: `Failed to fetch [font] from Google Fonts`

**Status**: Non-critical - network issue during build
**Solution**: Will work on Vercel (has internet access)

#### 3. React Key Warnings
**Warning**: `Each child in a list should have a unique "key" prop`

**Status**: Warnings only, not blocking
**Location**: Layout.tsx (likely in metadata or head elements)

## Recommendations

### Option 1: Downgrade Next.js (Recommended)
The upgrade from 15.1.11 to 15.5.10 may have introduced stricter build-time analysis. Consider reverting:

```json
"next": "15.1.11"
```

### Option 2: Skip Static Generation for Blog Routes
Add to `next.config.js`:
```js
experimental: {
  skipTrailingSlashRedirect: true,
},
```

Or use route groups to exclude blog pages from static generation.

### Option 3: Accept Runtime-Only Rendering
These pages will work perfectly at runtime, they just can't be statically generated. This is acceptable for blog content that changes infrequently.

## Files Modified Today

### Core Fixes
- `prisma/schema.prisma` - Added URL back
- `package.json` - Version alignments
- `lib/email/send-email.ts` - Build-time detection
- `app/not-found.tsx` - Simplified
- `app/about/blog/*/page.tsx` - Added dynamic exports

### Still Needs Work
- Blog pages with framer-motion (4 pages)
- React key warnings in layout

## Next Steps

1. **Test with Next.js 15.1.11** - See if downgrade fixes blog pages
2. **Or configure route segment** - Use Next.js config to skip blog static generation
3. **Or accept runtime-only** - Pages work, just can't be pre-rendered

**Current blocker**: Blog pages can't be statically generated due to framer-motion + Next.js 15.5.10 behavior.
