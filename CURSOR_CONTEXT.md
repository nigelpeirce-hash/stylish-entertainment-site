# Cursor Context – Stylish Entertainment

Agent familiarisation for the Stylish Entertainment website project.

**Last updated:** February 5, 2026

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

## Recent Work

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
