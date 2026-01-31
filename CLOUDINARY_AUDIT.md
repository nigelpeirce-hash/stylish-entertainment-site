# Cloudinary Image Audit

**Goal:** Highest spec for each display – retina Mac gets sharp images, mobile gets appropriately sized delivery (per PAGE_SPEED_MOBILE_NOTES.md).

---

## Current Patterns

### 1. **Cloudinary URL transforms**

| Transform | Purpose |
|-----------|---------|
| `f_auto` | Auto format (WebP, AVIF when supported) |
| `q_auto` | Cloudinary quality optimization |
| `dpr_auto` | Device Pixel Ratio – serves 2x/3x for retina displays |
| `w_XXX` | Width cap (reduces bytes on mobile) |
| `q_60` | Fixed quality (used for below-fold to save ~20 KiB) |

### 2. **Where each pattern is used**

| Location | Pattern | Notes |
|----------|---------|-------|
| Homepage services/team | `smallerCloudinaryUrl()` → w_800, q_60 | Below-fold, mobile-friendly |
| Homepage slider | `sliderCloudinaryUrl()` → w_1080, q_60 | Capped for LCP |
| Homepage LCP hero | w_1080, q_60, dpr_auto | Fixed for first paint |
| Kin House, Pennard, Babington | f_auto,q_auto,dpr_auto | Venue pages, hero/gallery |
| Private Parties | f_auto,q_auto,dpr_auto | Hero + gallery |
| **Party Lighting** | f_auto,q_auto only | **Missing dpr_auto** (lightbox full-size) |
| Wedding Lighting, Wedding Entertainment | Mixed | Some dpr_auto, some not |
| Galleries (general) | Mixed | Many without dpr_auto |

### 3. **Next/Image vs raw URL**

- **Next/Image:** `sizes` controls requested dimensions. Cloudinary URL is the *source*; Next fetches and resizes. `dpr_auto` in the URL has no effect (server fetch has no DPR). Focus on `sizes` and `quality` prop.
- **Raw `<img>` or lightbox:** Uses Cloudinary URL directly. `dpr_auto` *does* help for retina when viewing full-size.

---

## Recommendations

### Gallery / Masonry images (e.g. Party Lighting)

1. **Add `dpr_auto`** to gallery photo URLs – improves lightbox full-size view on retina.
2. **Add `sizes`** to Next/Image in MasonryGrid:
   ```tsx
   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
   ```
   (300px matches column width; avoids over-fetching on mobile.)
3. **Quality:** `q_auto` for thumbnails; lightbox reuses same URL, so dpr_auto gives retina sharpness.

### Hero images

- Keep `f_auto,q_auto,dpr_auto` for hero/full-bleed images.
- Homepage LCP: keep w_1080,q_60 for fast first paint.

### Below-fold (services, team, cards)

- Keep `smallerCloudinaryUrl()` (w_800, q_60) for mobile performance.
- `sizes` on Next/Image: `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px` (or match card width).

### IMAGE_GUIDE.md

- Add `dpr_auto` to standard format for display contexts (galleries, hero, lightbox).
- Document responsive strategy: `sizes` for Next/Image, width caps for mobile.

---

## Files to update

1. **Party Lighting** (`app/parties/party-lighting/PartyLightingClient.tsx`)
   - Add `dpr_auto` to all gallery Cloudinary URLs.
   - Add `sizes` to MasonryGrid `Image` components.
   - Add `sizes` to hero Image.

2. **IMAGE_GUIDE.md**
   - Add `dpr_auto` and responsive guidance.

3. **Other galleries** (Wedding Lighting, About, etc.) – apply same pattern as capacity allows.
