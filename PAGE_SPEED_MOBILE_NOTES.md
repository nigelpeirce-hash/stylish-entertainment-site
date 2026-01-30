# Mobile PageSpeed Notes

**Context:** Lab report showed Performance **57**, Accessibility **96**, Best Practices **100**. “Discover what your real users are experiencing” showed **No Data** (not enough real-user traffic yet for Core Web Vitals).

**Latest metrics (Moto G, Slow 4G, Jan 30 2026):** FCP **4.0 s**, LCP **12.2 s**, TBT **160 ms**, CLS **0**, Speed Index **7.0 s**. CLS is good; FCP/LCP/SI are the main targets.

**Desktop (Jan 29, 2026):** Performance **89**, FCP **0.3 s**, LCP **2.0 s**, TBT **60 ms**, CLS **0**, SI **1.6 s**. Lighthouse called out: **Improve image delivery** (~627 KiB est. savings), **Render-blocking CSS** (~240 ms), **LCP “fetchpriority=high”** on the slider img, **Preconnected origins** (none), **Responsive images** (slider 2048×1326 vs displayed 1335×890; services grid over-sized).

---

## Changes made (quick wins)

1. **Prefetch-error-handler script** (`app/layout.tsx`)  
   - Switched from `strategy="beforeInteractive"` → `afterInteractive`.  
   - Stops that inline script from blocking initial parse; prefetch errors happen on navigation, not first load.

2. **Homepage slider LCP** (`app/page.tsx`)  
   - `fetchPriority="high"` on the **first** slider image, `"auto"` on the rest.  
   - `sizes="(max-width: 1920px) 100vw, 1920px"` to avoid over-fetching on large desktops.  
   - `quality={78}` (was 90) to reduce LCP image bytes.  
   - Keeps `priority` + `loading="eager"` for the first two images.

3. **Services grid images** (`app/page.tsx`)  
   - `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"` (cap at 400px to match card width).  
   - `quality={75}` to reduce bytes.

4. **Resource hints** (`app/layout.tsx` `<head>`)  
   - `rel="preconnect"` + `rel="dns-prefetch"` for `https://res.cloudinary.com`.  
   - `rel="dns-prefetch"` for `https://www.googletagmanager.com`.  
   - LCP **preload** removed: LCP is served via `/_next/image` (same-origin); preloading raw Cloudinary URL could double-fetch.

5. **Defer slider shuffle** (`app/page.tsx`)  
   - Shuffle delayed 2.5s so first image stays priority; preload is used; LCP improves.

6. **Delay CookieYes** (`components/CookieYes.tsx`)  
   - CookieYes loads 2.5s after page load to reduce initial JS on mobile.

7. **Slider image quality**  
   - Reduced from 78 to 72, then to 65 to save bytes (PageSpeed Jan 30: 78 KiB est. savings).

8. **GTM + GA deferred** (Jan 30, 2026)  
   - Changed `strategy="afterInteractive"` → `strategy="lazyOnload"` for GoogleTagManager and GoogleAnalytics.  
   - Defers ~395 KiB and ~385 ms main-thread work until after page idle; improves LCP and TBT.

9. **Nav animations on mobile**  
   - Disabled `animate-gradient-shift` and `animate-light-sweep` below 768px (non-composited `background-position` animations).

10. **Logo dimensions**  
    - Added `width={200} height={80}` to Navigation logo to prevent layout shift.

11. **Services images**  
    - Quality 75 → 65; tightened `sizes` to `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px`.

12. **Cloudinary preconnect**  
    - Added `crossOrigin="anonymous"` for image preconnect.

---

## Already in good shape

- **GTM, GA, CookieYes:** All use `strategy="afterInteractive"` (non–render-blocking).
- **Fonts:** `display: "swap"`; Raleway + Bebas preloaded; Dancing + Playfair not preloaded.
- **Images:** Next/Image + Cloudinary `f_auto,q_auto,dpr_auto`; hero/slider use `priority`, capped `sizes`, `quality` 75–78; services grid capped `sizes` + `quality` 75.
- **next.config:** AVIF/WebP, sensible `deviceSizes` / `imageSizes`.

---

## Likely impact on Performance score

- **`force-dynamic`** in root layout disables static optimisation for the whole app. Every request is server-rendered on demand → higher TTFB and worse LCP on mobile. Reverting would require fixing the framer-motion prerender issue (see layout comment).
- **Third-party scripts:** GTM, GA, CookieYes, reCAPTCHA add JS and network cost. Consider loading CookieYes only after user interaction or after a short delay if legally acceptable.
- **Framer-motion:** Used widely; adds JS. Could reduce animations on mobile or lazy-load the library for below-the-fold content.
- **Slider:** Multiple images in one view; only the first is the LCP. Shuffling is client-side, so LCP is consistent.

---

## What to do next

1. **Redeploy** and re-run [PageSpeed Insights](https://pagespeed.web.dev/) (mobile) on the live URL.  
2. **Use the report** to confirm:
   - LCP (usually the hero/slider image)
   - TBT / main-thread work (JS, especially third-party)
   - CLS (likely fine; images are sized).
3. **Optional deeper work:**
   - Revisit `force-dynamic` and framer-motion so more routes can be statically generated.
   - Lazy-load or defer non-critical third-party scripts (e.g. CookieYes, GTM).
   - Consider reducing font weights/subsets if only a subset is used.
   - **Render-blocking CSS:** Lighthouse reports ~240 ms from Next.js CSS. Hard to change without touching the build; critical CSS inlining or async loading would require custom setup.

---

## “No Data” for real users

- Lab data (the 57/96/100) is simulated.  
- “Discover what your real users are experiencing” needs **enough** Chrome UX Report traffic for your origin.  
- After the site gets more traffic, that section will start to show real-user Core Web Vitals.
