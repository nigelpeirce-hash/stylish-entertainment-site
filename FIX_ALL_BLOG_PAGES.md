# Fix All Blog Pages - Server/Client Component Split

All blog pages need to be split into server/client components to prevent prerendering errors.

## Pages to Fix:
1. ✅ `/about/blog/bristol-university-spring-ball` - Already fixed
2. ⚠️ `/about/blog/five-ways-to-totally-transform-a-venue-2-decor` - Has `revalidate = 0` (removed)
3. ⚠️ `/about/blog/five-ways-to-totally-transform-a-venue-1-lighting` - Needs split
4. ⚠️ `/about/blog/why-you-should-use-an-experienced-professional-dj` - Needs split

## Solution:
Split each page into:
- `page.tsx` - Server component with `export const dynamic = 'force-dynamic'` that dynamically imports client component
- `[PageName]Content.tsx` - Client component with all the framer-motion and client-side code

This prevents Next.js from trying to prerender pages with client-side hooks during build.
