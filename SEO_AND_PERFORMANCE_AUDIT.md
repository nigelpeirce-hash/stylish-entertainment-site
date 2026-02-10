# SEO & Performance Audit – Stylish Entertainment (Next.js)

**Audit date:** January 2026  
**Scope:** Legacy → Next.js transition; Core Web Vitals, metadata, redirects, content hierarchy, images, schema, 404 prevention, font loading.

---

## 1. Core Web Vitals (LCP, INP/FID, CLS)

### Current setup

| Metric | Implementation | Notes |
|--------|----------------|-------|
| **LCP** | Hero images use `priority` + `fetchPriority="high"` on key routes; layout preloads for `/`, `/artists/djs`, `/parties/party-lighting`, `/weddings/wedding-lighting`, `/party-planning-and-organising`, `/contact-us`, `/artists/party-djs`, `/dj-nige`. Cloudinary URLs use `w_1200` (or equivalent) for above-the-fold. | Preload is pathname-based (`x-pathname` header). |
| **INP/FID** | Google replaced FID with INP (Interaction to Next Paint). No explicit INP optimisation; TBT reduced by dynamic imports (e.g. `DJsVideoGallery`, party-lighting Lightbox). | Third-party (GTM, CookieYes) still contributes to main-thread time. |
| **CLS** | Root layout uses `display: "swap"` for Raleway (primary font); Bebas Neue, Dancing Script, Playfair use `display: "optional"`. Hero sections use `fill` + `object-cover` with fixed aspect containers. | Font swap minimises layout shift; optional fonts avoid FOUT for non-critical type. |

### Hero slider & layout shift

- **Party lighting** (`/parties/party-lighting/`): Hero is a single LCP image (first slide) with `priority` and `fetchPriority="high"`; carousel advances after load. No CLS risk from slider if the first image is in the DOM immediately.
- **Home**: No hero “slider” in the traditional sense; hero is a static section with one CTA. No slider-induced CLS.
- **Artists/DJs**: Single hero image with priority; video gallery below the fold is dynamically loaded.

**Recommendation:** Keep hero images as single LCP candidate per page (first frame only with priority). Avoid lazy-loading the LCP image; ensure no layout shift by using fixed-height or aspect-ratio containers (already in place).

### Custom fonts and mobile

- **Raleway:** `display: "swap"` – text visible immediately with fallback, then swap when font loads (minimal FOUT).
- **Bebas Neue, Dancing Script, Playfair Display:** `display: "optional"` – only use custom font if already cached; otherwise fallback. Reduces render-blocking and layout shift.
- **Preload:** Only Raleway has `preload: true`; others `preload: false` to prioritise LCP.

**Verdict:** Font strategy is sound for stability and speed. Optional fonts may not show on first visit; acceptable trade-off for “no flash of unstyled text” and lower blocking time.

---

## 2. Metadata & Social Graph

### Root layout (`app/layout.tsx`)

- **Default title:** `"STYLISH Entertainment | DJs, Lighting & Events for Weddings, Parties & Celebrations"`.
- **Template:** `"%s | STYLISH Entertainment"` for child pages.
- **Description, keywords, authors, creator, publisher:** Set.
- **OpenGraph:** type, locale, url, siteName, title, description, default image (1200×630).
- **Twitter:** card, title, description, images, creator.
- **Robots:** index, follow; googleBot options set.
- **Canonical (root):** `alternates.canonical: "./"` (resolved per route).

### HeaderNew and indexability

- **Wordmark:** Text-based: “Stylish” + “Entertainment” in `<span>` elements (no logo image for brand text). Fully crawlable and indexable.
- **Strapline:** No separate “Extraordinary” strapline in the header; tagline appears in hero/content. If “Extraordinary” is a key brand phrase, consider adding it to default meta description or a visible strapline for richer snippets.

### Page-level metadata (createMetadata)

`lib/metadata.ts` provides:

- `generateCanonicalUrl(pathname)` → `https://www.stylishentertainment.co.uk/{pathname}/` (trailing slash).
- `createMetadata({ title, description, pathname?, keywords?, openGraph? })` → title, description, `alternates.canonical`, full OpenGraph (type, locale, url, siteName, title, description, images), Twitter card.

**Artists, Weddings, Parties:**

| Route | Metadata | Canonical | OG |
|-------|----------|-----------|-----|
| **Weddings** (e.g. wedding-lighting) | ✅ `createMetadata` with pathname `weddings/wedding-lighting` | ✅ | ✅ |
| **Parties** (e.g. party-lighting) | ✅ `createMetadata` with pathname `parties/party-lighting` | ✅ | ✅ |
| **Artists – DJs** (`/artists/djs/`) | ⚠️ **Missing** – page is `"use client"`; no static metadata. Only `document.title` in `useEffect`. | ❌ Uses root canonical | ❌ Uses root OG |

**Recommendation:** Add server-side metadata for `/artists/djs/` so crawlers get correct title/description/canonical/OG without relying on client JS. Options: (1) `app/artists/djs/layout.tsx` that exports `metadata` or `generateMetadata`, or (2) a small server wrapper page that exports metadata and renders the client component. Same consideration for `/artists/` (redirect to `/artists/djs/`) if you want an “Artists” index page in search.

---

## 3. Link Integrity (Redirects & Canonicals)

### next.config.js

- **trailingSlash: true** – site uses trailing-slash URLs; Next.js will redirect `/path` → `/path/` when applicable.
- **Redirect order:** Comment states “Redirects run top-to-bottom; put specific/wildcard rules before broader ones.” Wildcards (e.g. `/team-view/:path*`, `/blog/venue-decoration-styling/:path*`) are at the top; consistent with intent.

### Canonical URLs

- All redirect **destinations** use a **trailing slash** (e.g. `/parties/party-lighting/`, `/artists/djs/`, `/about/faq/`, `/weddings/wedding-lighting/`).
- `generateCanonicalUrl` and `createMetadata` produce canonicals with trailing slash.
- Root metadata uses `alternates.canonical: "./"`; Next resolves per page.

**Verdict:** Redirects resolve to the correct canonical form (with trailing slash).

### Chained redirects

- No redirect in the list points to a path **without** trailing slash that would then be redirected again by Next.js to add the slash. So there is **no 301→301 chain** from the current config.
- Legacy URLs (e.g. `/party-lighting`, `/wedding-lighting`, `/dj-nige`) go in one hop to the final URL.

**Verdict:** No chained redirects identified.

### Optional check

- In GSC or Analytics, confirm “Page Not Found” or 404 reports for known legacy paths (e.g. from ANALYTICS_PAGE_AUDIT.md) are no longer occurring after deploy.

---

## 4. Content Hierarchy (H1–H3)

### Home page (`app/HomeClient.tsx`)

- **H1:** “Exceptional *Entertainment*” (with gradient styling on “Entertainment”).
- **Supporting line (below H1):** “Professional DJs, musicians, lighting design and venue styling for weddings, parties and events…”

**Search intent:** The audit asked whether the home page prioritises “Professional DJs and Musicians” as the **primary H1**. Currently the H1 is “Exceptional Entertainment”; “Professional DJs and Musicians” is in the paragraph. So the primary H1 does **not** literally match that phrase.

**Recommendation (optional):** If the main search intent is “professional DJs and musicians”, consider either (a) changing the H1 to e.g. “Professional DJs & Musicians for Weddings & Events” and keeping “Exceptional Entertainment” as a subline, or (b) keeping the current H1 and relying on the strong supporting line and metadata (title/description already include “Professional DJs”).

### Other pages

- **Artists/DJs:** H1 “Our DJs”; H2 “What Sets Our DJs Apart”; then H3s (e.g. “Frequently Asked Questions”, “Ready to book…”). Good hierarchy.
- **Party lighting / Wedding lighting / Contact / Party planning:** H1 per page, then H2/H3 without skips (recent fixes applied). Consistent.

---

## 5. Image Optimization (next/image, Galleries, Artists)

### next.config.js

- **Formats:** `formats: ['image/avif', 'image/webp']` – Next.js will serve AVIF/WebP where supported.
- **Remote:** Cloudinary (and others) allowed via `remotePatterns`.
- **deviceSizes / imageSizes:** Sensible set for responsive `srcset`.

### Where next/image is used

- **Artists/DJs:** Hero uses `next/image` with `priority`, `fetchPriority="high"`, Cloudinary `w_1200`, and `sizes="(max-width: 768px) 100vw, 1200px"`. DJ cards use `next/image` with `fill` and appropriate `sizes`. ✅
- **Party lighting:** Hero uses `next/image` with LCP URL and priority; Lightbox lazy-loaded via dynamic import. ✅
- **Wedding lighting:** Hero and gallery use `next/image`; gallery URLs use `w_1200`. ✅
- **Contact, party-planning, party-djs:** Hero images use `next/image` with priority and optimised URLs. ✅

### Galleries (`components/Gallery.tsx` and `app/galleries/page.tsx`)

- **Gallery.tsx** uses raw **`<img>`** (not `next/image`): `src={photo.src}`, `loading="lazy"`, `decoding="async"`, fixed width/height.
- **Galleries page** passes Cloudinary URLs with `f_auto,q_auto,dpr_auto` (and some with `c_auto,g_auto,h_667,w_1000`). So **format** (WebP/AVIF) is handled by Cloudinary, but:
  - No Next.js `srcset`/sizes (no responsive image optimisation).
  - No built-in blur placeholder or priority for above-the-fold gallery images if any.

**Recommendation:** For the main Galleries page and any other gallery that uses `Gallery.tsx`, consider switching to `next/image` (e.g. pass the same `Photo` shape and render with `Image fill sizes={...}`) so mobile gets responsive sizes and AVIF/WebP from Next when beneficial. Alternatively, keep Cloudinary `f_auto` and add Cloudinary `w_*` in URLs for responsive widths (e.g. `sizes="(max-width:768px) 100vw, 50vw"` and pass corresponding URLs or use a single responsive Cloudinary URL).

### Artists pages

- **Artists/DJs:** Hero and cards use `next/image`; video gallery is below the fold and dynamically loaded. ✅
- **Artists/party-djs:** Hero uses `next/image` with optimised URL. ✅

---

## 6. Audit Checklist & Focus Areas

### Page Speed (Mobile > 90)

- **Current:** Multiple PageSpeed runs (party-lighting, wedding-lighting, contact-us, party-planning, party-djs, dj-nige) show mobile Performance in the 72–78 range; desktop higher (e.g. 96). LCP improvements (preload, `fetchPriority`, `w_1200`) have been applied on key routes.
- **Remaining levers:** Reduce render-blocking CSS (e.g. critical CSS inlined or deferred); reduce unused JS/CSS (code-splitting, dynamic imports); consider deferring or lazy-loading GTM/CookieYes where policy allows; ensure all above-the-fold images use `priority`/`fetchPriority` and appropriate `sizes`.

### Schema.org (LocalBusiness, Event)

- **Present:** `LocalBusiness` (with `AggregateRating` where applicable) on: testi, about, private-parties, babington-house, babington-wedding-info, mells-barn-weddings, venues/mells-barn, hire/[slug] (product/offer). Testi includes address and review count for rich results.
- **Gap:** Home page and key landing pages (e.g. artists/djs, weddings/wedding-lighting, parties/party-lighting) do not appear to have LocalBusiness or Event schema in the codebase. Adding LocalBusiness (and optionally Event for key offerings) on the homepage could help “Extraordinary” strapline and ratings in search.

**Recommendation:** Add a single LocalBusiness (and optionally Event) JSON-LD on the homepage (e.g. in root layout or `app/page.tsx`) with name, url, description, address, and aggregateRating if you have a global rating.

### 404 Prevention

- **Redirect audit:** ANALYTICS_PAGE_AUDIT.md documents legacy paths and redirects; high-value paths (e.g. `/party-lighting/`, `/wedding-lighting/`, `/dj-nige/`, `/my-account/`, etc.) have been given explicit redirects.
- **Action:** Continue to monitor GSC (or Analytics) “Page Not Found” reports and add redirects for any new legacy or typo URLs that still receive traffic.

### UX / Vibe – Font loading

- **Raleway:** `display: "swap"` – avoids invisible text; short FOUT acceptable.
- **Other fonts:** `display: "optional"` – avoids layout shift and render blocking; custom font may not appear on first load.
- **Verdict:** Configuration is suitable for visual stability and premium feel; no change required unless you want to guarantee custom font on first visit (at the cost of blocking or layout shift).

---

## 7. Summary Table

| Area | Status | Action |
|------|--------|--------|
| **LCP** | Improved on key routes (preload, priority, w_1200) | Extend preload to any other high-traffic hero pages |
| **CLS** | Good (fonts + stable hero containers) | None |
| **Metadata – Weddings/Parties** | OK (createMetadata, canonical, OG) | None |
| **Metadata – Artists/DJs** | Gap (client-only, no static meta) | Add layout or server wrapper with metadata for `/artists/djs/` |
| **Wordmark / strapline** | Wordmark indexable (text); strapline not in header | Optionally add “Extraordinary” to meta or visible strapline |
| **Redirects** | Correct canonicals (trailing slash); no chains | Monitor 404s |
| **Home H1** | “Exceptional Entertainment”; “Professional DJs…” in paragraph | Optionally make H1 more search-intent focused |
| **next/image** | Used on Artists, party/wedding lighting, contact, etc. | Use next/image in Gallery.tsx (or Cloudinary responsive URLs) for Galleries |
| **Schema** | LocalBusiness on testi, about, venues, hire | Add LocalBusiness (and optionally Event) on homepage |
| **Font loading** | swap + optional; stable | None |

---

*Audit based on codebase review and existing PageSpeed/analytics context. Re-run PageSpeed and GSC after changes to confirm impact.*
