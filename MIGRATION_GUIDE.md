# Site Migration Guide: stylishweddingdisco.co.uk → stylishentertainment.co.uk

## What I Need From You

To properly set up the migration, please provide:

1. **List of all main pages/URLs from stylishweddingdisco.co.uk**
   - Example: `/wedding-djs`, `/lighting-hire`, `/contact`, etc.
   - You can get this from:
     - Google Search Console (if you have access)
     - The old site's sitemap.xml
     - Your hosting provider's file list
     - Or just list the main pages you remember

2. **URL Mapping** (which old URLs should redirect to which new URLs)
   - Example:
     - `stylishweddingdisco.co.uk/wedding-djs` → `stylishentertainment.co.uk/artists/djs`
     - `stylishweddingdisco.co.uk/lighting` → `stylishentertainment.co.uk/services/lighting-design`

3. **Any unique content** from the old site that doesn't exist on the new site
   - Pages, blog posts, testimonials, etc.

## Migration Steps

### 1. 301 Redirects (Permanent Redirects)
✅ **Status: COMPLETED** - Redirects have been added to `next.config.js` based on Google Analytics data
- See `URL_MAPPING.md` for the complete mapping
- All redirects are 301 (permanent) to preserve SEO value
- Highest priority: `/wedding-djs/` → `/artists/djs/` (96 users, 50.79% of sessions)

### 2. Sitemap
✅ **Status: Created** - `app/sitemap.ts` is ready and will be accessible at `/sitemap.xml`

### 3. Robots.txt
✅ **Status: Created** - `app/robots.ts` is ready and will be accessible at `/robots.txt`

### 4. Google Search Console Setup (NEXT STEPS)
After deploying to production:

1. **Add new property** (if not already added):
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add `stylishentertainment.co.uk` as a property

2. **Submit sitemap**:
   - Go to Sitemaps section
   - Submit: `https://stylishentertainment.co.uk/sitemap.xml`

3. **Request re-indexing** of important pages:
   - Use URL Inspection tool to request indexing for key pages:
     - `/artists/djs/` (most important - was `/wedding-djs/`)
     - `/services/lighting-design/`
     - `/services/venue-styling/`
     - `/mells-barn-weddings/`
     - `/about/blog/`

4. **Monitor redirect status**:
   - Check "Coverage" section to see if redirects are working
   - Monitor search performance for the new URLs

5. **Update old property** (stylishweddingdisco.co.uk):
   - In Google Search Console for the old site, use "Change of Address" tool
   - Point to the new domain: `stylishentertainment.co.uk`
   - This tells Google the site has moved permanently

### 5. Domain-Level Redirect (Recommended)
✅ **Status: Ready to configure** - You have access to set this up!
- See `DOMAIN_REDIRECT_SETUP.md` for detailed instructions
- Set up a domain-level 301 redirect from `stylishweddingdisco.co.uk` → `stylishentertainment.co.uk`
- This catches all URLs automatically and provides a fallback for URLs not in the redirect list
- **Important**: Keep the path when redirecting (so `/wedding-djs/` → `stylishentertainment.co.uk/wedding-djs/`, then our Next.js redirects handle the rest)

## Current New Site Structure

Based on your current site, here are the main pages:

- `/` - Home
- `/artists/djs` - DJs
- `/artists/musicians` - Musicians
- `/weddings/wedding-entertainment` - Wedding Entertainment
- `/parties/private-parties` - Private Parties
- `/services/lighting-design` - Lighting Design
- `/services/venue-styling` - Venue Styling
- `/services/djs` - DJ Services
- `/services/kit-hire` - Kit Hire
- `/services/fire-pit-hire` - Fire Pit Hire
- `/hire` - Hire Shop
- `/galleries` - Galleries
- `/contact-us` - Contact
- `/book-dj` - Book DJ
- `/about` - About
- `/about/blog` - Blog

## Next Steps

1. **Provide the old site URL structure** (see "What I Need From You" above)
2. I'll create the redirect configuration
3. I'll update the sitemap with all pages
4. You'll need to:
   - Update Google Search Console
   - Set up domain redirect (if possible)
   - Monitor redirect status
