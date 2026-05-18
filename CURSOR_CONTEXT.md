# Cursor Context – Stylish Entertainment

Agent familiarisation for the Stylish Entertainment website project.

**Last updated:** May 18, 2026 (legacy-domain consolidation rules added — dormant until DNS swap)

---

## Development & Build

- **Dev:** `npm run dev` → Next.js on port 3001 with Turbopack
- **Build:** `npm run build` → `next build` (no extra flags)
- **Deploy:** Commit changes, then `git push`; Vercel builds from repo. Run `npm run build` locally first to verify.
- **Production builds** use Webpack (see `next.config.js` webpack config)
- TypeScript strict; build errors ignored in config for flexibility
- **Root layout** has `export const dynamic = "force-dynamic"` (framer-motion prerender workaround; affects performance)

---

## Key Dependencies

- **Next.js:** 15.x
- **React:** 18.x
- **NextAuth:** 5.0.0 (beta)
- **Prisma:** 6.x with Driver Adapters (PrismaPg)
- **Framer Motion**, **Radix UI**, **Tailwind**, **SWR**

---

## Routing

- App Router only: `/app` (no `/pages`)
- Admin: `/app/admin/*` with layout
- Client portal: `/app/client/*` with layout
- API: `/app/api/*`
- **Trailing slash:** `trailingSlash: true` in `next.config.js`. All canonical URLs end with `/`. `/foo` issues a 308 to `/foo/`. Sitemap, redirect destinations, internal links, and canonical tags must all use trailing slash.
- **Trailing slash applies to `/api/*` too.** External webhooks (e.g. WhatsApp Cloud API webhook → `/api/whatsapp/webhook`) MUST be configured with the trailing slash. NextAuth, Vercel cron, and browser `fetch` calls follow the 308 fine, but third-party webhook senders may not.

---

## Architecture

### Business Logic (`/lib`)
- **auth.ts**, **admin-auth.ts** – authentication
- **prisma.ts** – database client (singleton, pool-based)
- **email/** – Resend templates and sending
- **actions/** – server actions (e.g. booking)
- **cloudinary.ts** – uploads
- **spotify.ts**, **youtube.ts** – external APIs

### Components (`/components`)
- Shared UI, forms, admin components
- **HeaderNew.tsx** – Main site header (CRITICAL). Layout imports it directly; no HeaderSwitcher. Dark bg, gold accents, wordmark "Stylish"/"Entertainment", strapline (hidden ≤991px), Enquire (mobile visible, 15% smaller), burger nav. Uses AuthButtonSimple. Styles: `HeaderNew.module.css` with `!important` on colours (overrides globals.css base). Demo: `/demo/header-preview`. Legacy `Navigation.tsx` unused.
- **CookieYes.tsx** – consent banner (delayed 2.5s for LCP); injects contrast-override `<style>` after load for WCAG AA. Contrast rules also in `app/globals.css`.
- **GoogleTagManager.tsx**, **GoogleAnalytics.tsx** – analytics
- **ui/slider.tsx** – hero slider; dot buttons use 48×48px min touch target for accessibility

### Data (`/data`)
- `reviews.ts`, `testimonials.ts` – static content

---

## Database & Services

| Service    | Purpose                                      |
|-----------|-----------------------------------------------|
| **Supabase** | PostgreSQL via pooler; prefer Transaction mode (port 6543 + pgbouncer) – see SUPABASE_MAX_CLIENTS_FIX.md |
| **Resend**   | Transactional email                           |
| **Cloudinary** | Images (account: drtwveoqo)                 |
| **NextAuth**  | Sessions, admin/client auth                  |
| **Google**    | Analytics (GA4 G-8WGHN47VLM), GTM, reCAPTCHA, YouTube API, Maps |
| **CookieYes** | Cookie consent banner                        |

---

## Sandbox Demos (Admin)

- `/demo/header-preview` – Header design reference (same as production header)
- `/admin/sandbox/footer-demo` – Footer original vs refactored
- `/admin/sandbox/terms-portal-demo` – Link to T&C portal flow demo
- `/admin/sandbox/book-from-quote` – Book-from-quote token
- `/admin/sandbox/client-portal` – Client portal magic link
- `/admin/sandbox/client-portal-hero-demo` – Client portal hero image demo
- `/admin/sandbox/client-portal-sarah-tim` – Client portal demo (Sarah/Tim)

## Key Features

- Event booking and admin management
- **Team Directory** – `/admin/staff-management` (FreelanceCrew, edit/delete)
- **DJs** and **Musicians** – public artist pages + admin CRUD
- Client portal for bookings
- Email automation (Resend, journey templates)
- Video gallery – YouTube Data API v3 (`/galleries/videos`); embeds use `vq=hd1080`
- Before/after transformations – `components/BeforeAfter.tsx`; featured on venue decoration, galleries; standalone `/room-transformation`
- Contact forms – reCAPTCHA v3
- **Babington DJ final details** – `/babington-dj-final-details` — public form (honeypot), `POST /api/public/babington-dj-final-details` → Resend to `CONTACT_FORM_EMAIL` (default info@), optional attachment (PDF/Word/txt, 10MB)
- **DJ worksheet** – `/dj-worksheet` — public worksheet (light layout per legacy form): venue, DJ timings, payment, music, file upload; Save = localStorage draft, Print, Submit → `POST /api/public/dj-worksheet` (Resend, Excel/Word/PDF/txt up to 10MB)
- Hire shop, venue styling, blog

---

## Environment Variables

- **Database:** `DATABASE_URL` (pooler), `DIRECT_URL` (CLI)
- **Auth:** `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`
- **Email:** `RESEND_API_KEY`, `RESEND_DEFAULT_FROM`
- **Cloudinary:** `NEXT_PUBLIC_CLOUDINARY_*`, `CLOUDINARY_*`
- **Google:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`, reCAPTCHA keys
- **YouTube:** `NEXT_PUBLIC_YOUTUBE_API_KEY`, optional `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID`
- **Email journey:** `NEXT_PUBLIC_GOOGLE_REVIEW_URL` (optional) – Google Maps review link for post-wedding thank-you email "Leave a Google Review" button; if unset, button is hidden

See `.env.local.example` and `DISASTER_RECOVERY_GUIDE.md` for full list.

---

## Known Issues / Future Work

- **Root `force-dynamic` blocking page caching (logged May 15, 2026 — DO NOT touch without dedicated effort):** `app/layout.tsx` exports `dynamic = "force-dynamic"` which cascades to every route. Experiment in May 2026 showed removing it lets ~100 of 134 routes prerender as static (big TTFB/cost win), BUT:
  1. `/babington-dj-final-details/` crashes during prerender (react-hook-form + framer-motion on a noindex private form) — needs per-page `dynamic = "force-dynamic"` opt-out.
  2. Next's auto-generated `/500` page crashes during prerender with `Cannot read properties of undefined (reading 'getCurrentStack')` from legacy pages-runtime — needs `app/global-error.tsx`.
  3. **LCP regression risk:** root layout has 7 conditional `<link rel="preload">` blocks driven by `headers().get("x-pathname")` (home, `/artists/djs`, `/parties/party-lighting`, `/weddings/wedding-lighting`, `/party-planning-and-organising`, `/contact-us`, `/artists/party-djs`). When pages go static, `pathname = ""` at build time so **all 7 preloads vanish from cached HTML**. Direct Core Web Vitals hit.
  - **Required work (do in a dedicated session, verify on Vercel after each step):**
    1. Move each of the 7 per-route LCP preloads into per-route `layout.tsx` (e.g. `app/(home)/layout.tsx`, `app/artists/djs/layout.tsx`, etc.) or per-page `<head>` injection.
    2. Add `app/global-error.tsx` to fix the `/500` prerender path.
    3. Mark `/babington-dj-final-details/` (and audit any other private/form routes) as `dynamic = "force-dynamic"` individually.
    4. Remove `force-dynamic` from `app/layout.tsx`.
    5. Build, then verify on Vercel that previously-affected pages still hit their LCP targets via PageSpeed Insights before considering it done.
  - Alternative: enable `experimental.ppr` (Partial Prerendering) in `next.config.js` — lets layout stay dynamic while pages cache, no LCP preload refactor needed, but PPR is experimental in Next 15.

## Recent Work

- **Legacy-domain consolidation rules added — dormant (May 18, 2026):** Added a host-guarded redirect block at the top of `redirects()` in `next.config.js` to consolidate the old WP Engine site `stylishweddingdisco.co.uk` into this Next.js site. Every rule uses `has: [{ type: "host", value: "(www\\.)?stylishweddingdisco\\.co\\.uk" }]` so it ONLY fires when the Host header matches the legacy apex or `www`. Destinations are absolute `https://www.stylishentertainment.co.uk/...` URLs (cross-domain). Mapping drawn from the 2025 GA4 export: top traffic 1:1 maps (`/wedding-djs/` → `/artists/djs/`, `/wedding-lighting-design/` → `/weddings/wedding-lighting/`, `/mells-barn-weddings/` → `/venues/mells-barn/`, `/blogs/babington-house-weddings/` → `/venues/babington-house/`, etc.), wildcard families (`/testimonial-view/:path*` → `/testi/`, `/team-view/:path*` → `/about/`, `/blogs/:path*` → `/about/blog/`, `/category/:path*` → `/about/blog/`, `/about-stylish/:path*` → `/about/`, `/wp-content/:path*` → `/`, etc.), and a final `/:path*` → `/` catch-all so nothing 404s. **Block is fully inert on `stylishentertainment.co.uk`** — verified locally with both `Host:` headers (main domain falls through to existing rules; legacy domain returns 308 with absolute new-domain URL). **Activation requires (NOT YET DONE):** 1) add `stylishweddingdisco.co.uk` + `www.stylishweddingdisco.co.uk` as domains in Vercel, 2) point DNS A/CNAME at Vercel (cancel WP Engine once 200s confirmed), 3) wait for Let's Encrypt SSL, 4) file GSC Change of Address from old → new property. After activation, `curl -sIL -H "Host: www.stylishweddingdisco.co.uk" .../wedding-djs/` should show 308 → `https://www.stylishentertainment.co.uk/artists/djs/`.
- **Hire item pages server-rendered (May 15, 2026):** `app/hire/[slug]/page.tsx` was fully `"use client"` — `useEffect` set `document.title`, JSON-LD was only in the rendered JSX (post-JS), and the parent `/hire/layout.tsx`'s canonical `/hire/` was leaking into children. Converted to a server component that fetches by slug directly via Prisma, uses `generateMetadata` with `seoTitle`/`seoDescription` (fallbacks to `${name} Hire | Stylish Entertainment` and a locations-rich default), self-references `/hire/${slug}/` as canonical, and emits `Product` JSON-LD in the initial HTML. DB error throws (5xx → retry); slug not found → `notFound()` → 404. Interactive bits ("Add to Basket" button + framer-motion) moved into a small `HireItemDetails` client island; cart logic preserved verbatim. No items currently active in prod DB, so this is preparatory; no sitemap change.
- **lighting-hire-2 retired (May 15, 2026):** Deleted `app/lighting-hire-2/` (page + layout) and removed `lighting-hire-2` from `app/sitemap.ts` and `lib/breadcrumb-config.ts`. Added 308 redirect (slash + no-slash) to `/services/lighting-design/` in `next.config.js` — duplicate of that page's H1 "Lighting Design" with overlapping content; the "-2" slug was legacy WordPress.
- **Metadata layouts for client-rendered pages (May 15, 2026):** Three `"use client"` pages were setting `document.title` from `useEffect` — unreliable for SEO and they fell back to the homepage default at HTML response time. Added sibling `layout.tsx` files using `createMetadata` for `/room-transformation/`, `/galleries/videos/`, `/galleries/instagram/` — each now ships unique server-rendered `<title>`, `<meta description>`, self-referencing canonical and OG tags. Stripped the redundant `useEffect`/`document.title` blocks from each page; fixed `/contact` → `/contact-us/` and `/galleries` → `/galleries/` links in `room-transformation`. Note: `/galleries/*` children don't inherit the root `title.template` (their `galleries/layout.tsx` uses a plain string title), so children render their own title without ` | STYLISH Entertainment` suffix. Acceptable for now.
- **Corporate page consolidation (May 15, 2026):** Deleted client-rendered duplicate `app/parties/corporate-events/page.tsx`. Kept `app/parties/corporate/page.tsx` as canonical; added `createMetadata` so its self-canonical is `/parties/corporate/` (was inheriting `/parties/`). Updated nav links (`HeaderNew`, legacy `Navigation`, `app/parties/page.tsx`) to `/parties/corporate/`. Added 308 redirects (slash + no-slash) for `/parties/corporate-events` → `/parties/corporate/` in `next.config.js`. Removed `corporate-events` from sitemap.
- **DJ profile pages (May 15, 2026):** New route `app/artists/djs/[slug]/page.tsx` — server component, DB-backed via Prisma (`DJ` model, `isActive: true`). `generateMetadata` falls back `seoTitle` → `${name} | Wedding & Event DJ`, `seoDescription` → `strapLine` → first 160 chars of `bio`. Person JSON-LD with `worksFor` Organization. Canonical/OG URL use trailing slash. DB error throws (5xx → Google retries) instead of `notFound()` (404 → de-index risk). Removed 8 redirect rules in `next.config.js` (`/artists/djs/{dj-nige,dj-james,james-h,rich-s}` ± slash) so the sitemap's DJ slug URLs now resolve 200 instead of 308 → listing.
- **HeaderNew production (Feb 5, 2026):** Main header is HeaderNew; layout imports it directly. HeaderSwitcher removed. Gold/light-gray colours require `!important` in `HeaderNew.module.css` to override `globals.css` base (`p, span, div, a, li`). Enquire visible on mobile. Cache clear: `rm -rf .next node_modules/.cache` then rebuild if MODULE_NOT_FOUND.
- **API security (Jan 29):** Client portal routes now enforce `portalToken` or session auth: `/api/client/bookings/[id]/items` (GET/POST), `/api/client/bookings/[id]/payment-details` (GET), `/api/client/bookings/[id]/confirm-hire-request` (POST). `PATCH /api/client/bookings/[id]/tasks` supports portal token (magic-link users). See `API_ROUTES_AUDIT.md`.
- **Link audit (Jan 29):** Internal `<a>` → `<Link>` on client portal access-denied pages; `tel:` standardised to `+44`; `rel="noopener noreferrer"` on external links; `NEXT_PUBLIC_GOOGLE_REVIEW_URL` for post-wedding email. See `LINK_AUDIT.md`.
- **Page layouts (Jan 29):** Venue decoration – featured before/after (2 sliders). Galleries – before/after moved up, wider YouTube for HD, `vq=hd1080`. Lighting – gallery moved up after hero. New `/room-transformation` page.
- **YouTube embeds:** Add `?vq=hd1080` to embed URLs; use wider containers (max-w-6xl / max-w-7xl) for HD on desktop.
- **Prisma:** No startup connection test; pool max 1 dev / 2 prod. Transaction mode (6543) recommended for MaxClientsInSessionMode.
- **Middleware:** `x-pathname` passed on request headers so layout reads pathname. Fixes admin 500; Footer and SiteWideCTA hidden on `/admin`.
- **Sitemap:** Dynamic Prisma import – build succeeds when `DATABASE_URL` missing/invalid (returns static-only sitemap). Vercel env vars are per project.
- **Page CTA:** `SiteWideCTA` at bottom of every page (non-sticky). Hidden on `/admin`, `/contact`, `/thank-you`, `/wedding-dj`, `/demo/client-portal`. Demo: `public/page-cta-demo.html`.
- **Kin House:** Removed 404 Cloudinary image from gallery.
- **T&C Portal:** Planned, not implemented. `TERMS_PORTAL_MODULE_PLAN.md` – personalised T&Cs in client portal, e-sign, deposit non-refundable, gating. Demo: Admin → Sandbox → Terms portal demo.
- **Terms content:** `lib/terms-content.ts` – `TERMS_ABRIDGED`, `DEPOSIT_CLAUSE`, `COMPANY_*`. Full terms: `TERMS_SECTIONS`.
- **Footer:** Address and "All rights reserved" removed. `FooterRefactored.tsx`; demo at `/admin/sandbox/footer-demo`.
- **Breadcrumbs:** Centralised in `lib/breadcrumb-config.ts`, `lib/breadcrumb-utils.ts`.

---

## Documentation

| File                        | Purpose                                      |
|----------------------------|----------------------------------------------|
| **API_ROUTES_AUDIT.md**    | Full API route inventory, auth status, security fixes |
| **LINK_AUDIT.md**          | Link audit: internal/external hrefs, tel/mailto, rel, recommended fixes |
| **DISASTER_RECOVERY_GUIDE.md** | Full rebuild, env vars, DB, deployments     |
| **TERMS_PORTAL_MODULE_PLAN.md** | T&C portal (planned): personalised T&Cs, e-sign |
| **GTM_CONTAINER_QUALITY_FIX.md** | GTM setup, Google tag, thank-you trigger   |
| **YOUTUBE_LIVE_TROUBLESHOOTING.md** | YouTube API on production                |
| **COOKIEYES_GTM_403_FIX.md** | CookieYes 403 when loaded via GTM          |
| **PAGE_SPEED_MOBILE_NOTES.md** | Mobile performance, LCP, deferred scripts |
| **ADMIN_401_LIVE.md**      | Admin 401 troubleshooting                    |
| **VERCEL_DATABASE_TIMEOUT_FIX.md** | DB connection timeouts on Vercel          |
| **SUPABASE_MAX_CLIENTS_FIX.md** | MaxClientsInSessionMode; use Transaction mode (6543) |

---

## Hosting

- **Vercel** – production
- Custom domain: `stylishentertainment.co.uk` / `www.stylishentertainment.co.uk`
- `AZURE_DEPLOYMENT.md` is legacy, not in use

---

## Conventions

- **Blog pages:** Server `page.tsx` + client wrapper in `components/blog/` (framer-motion, lightbox)
- **Prisma:** Singleton in `lib/prisma.ts`; use pooler for app, direct for CLI
- **Images:** Next/Image + Cloudinary URLs; `next.config.js` remote patterns. Homepage: LCP hero uses preload URL (w_640,q_60) and `unoptimized`; `smallerCloudinaryUrl()` for below-fold (services, team); `sliderCloudinaryUrl()` for non-LCP slider images.
- **Cookies:** CookieYes not loaded on `/admin` or localhost; contrast overrides in globals.css + injected style after load
- **GTM:** Container GTM-WB3F6V7; GA4 Measurement ID G-8WGHN47VLM

---

## Performance & PageSpeed

- **Layout:** LCP preload in `<head>` (hero image w_640,q_60, fetchPriority high). Preconnect/dns-prefetch to Cloudinary. Fonts: Raleway swap+preload; Bebas, Dancing Script, Playfair optional, no preload.
- **Homepage (`app/page.tsx`):** Hero section is static (no framer-motion). First slider image matches preload URL; other slider images use `sliderCloudinaryUrl()` (w_1080,q_60). Services/team use `smallerCloudinaryUrl()` (w_800,q_60).
- **Cache:** `next.config.js` sets long-lived Cache-Control for static assets (svg, png, ico, jpg, jpeg, webp).
- **Scores (as of Jan 2026):** Desktop ~98 Performance, 100 Accessibility/Best Practices/SEO; Mobile ~83 Performance, 100 elsewhere. Further gains: render blocking (~460ms mobile), unused JS/CSS, long main-thread tasks.
