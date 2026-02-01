# Image Guide - Adding New Images to Stylish Entertainment Website

## Required Format for All Images

Every image MUST include:
1. **Cloudinary URL with optimization** (`f_auto,q_auto` or `f_auto,q_auto,dpr_auto`)
2. **Descriptive alt text** (for accessibility and SEO)
3. **Caption** (if applicable, for galleries)

## Cloudinary URL Format

**Use `lib/cloudinary-urls.ts`** for centralized presets:
- `cloudinaryUrl(path, "gallery")` – f_auto,q_85,dpr_auto,w_1200
- `cloudinaryUrl(path, "card")` – f_auto,q_75,dpr_auto,w_800
- `cloudinaryUrl(path, "hero")` – f_auto,q_75,dpr_auto,w_1920
- `cloudinaryUrl(path, "thumbnail")` – f_auto,q_75,w_400

**Standard format (display / gallery):**
```
https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v[VERSION]/[FILENAME]_[HASH].[EXT]
```

**Below-fold (services, cards):** Use `smallerCloudinaryUrl()` in `app/page.tsx` → w_800,q_75.

**Parameters:**
- `f_auto` - Automatic format selection (WebP, AVIF when supported)
- `q_85` - High quality for gallery/display; `q_75` for cards/slider
- `dpr_auto` - Device Pixel Ratio – 2x/3x for Retina
- `w_800` / `w_1200` - Width cap for responsive delivery

## Image Object Template

### For Gallery Images (Photo[] array):
```typescript
{
  src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v[VERSION]/[FILENAME]_[HASH].[EXT]",
  width: 1200,
  height: 900,
  alt: "Descriptive alt text describing the image content, venue, couple names if applicable, and context",
}
```
**Next/Image in masonry:** Add `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"` (or match column width) for responsive loading.

### For Homepage Slider Images:
```typescript
{
  src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v[VERSION]/[FILENAME]_[HASH].[EXT]",
  alt: "Descriptive alt text describing the image content, venue, couple names if applicable, and context",
}
```

### For Service/Page Hero Images:
```typescript
<img
  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v[VERSION]/[FILENAME]_[HASH].[EXT]"
  alt="Descriptive alt text describing the image content, venue, and context"
  className="w-full h-full object-cover object-center brightness-110"
  style={{ objectPosition: 'center center' }}
  loading="eager"
  fetchPriority="high"
/>
```

## Alt Text Guidelines

**DO:**
- Describe what's actually in the image
- Include venue names when visible
- Include couple names if it's a specific wedding
- Include photographer credits if known
- Be specific: "Wedding reception for [Couple Names] at [Venue] with [specific details]"
- Keep it concise but descriptive (50-125 characters ideal)

**DON'T:**
- Use generic text like "wedding image" or "photo"
- Start with "Image of" or "Picture of"
- Use file names as alt text
- Leave alt text empty

## Examples

### Good Alt Text:
- "DJ Nige performing at Mirjam and Ben's wedding at Babington House, Somerset, showcasing professional wedding DJ services with elegant lighting"
- "Emily and Tom's wedding reception with stunning atmospheric lighting design, captured by Jonny Barratt Photography, creating a magical evening ambiance"
- "Babington House wedding venue exterior with beautiful green LED mood lighting, showcasing luxury wedding lighting design in Somerset"

### Bad Alt Text:
- "wedding"
- "image"
- "photo-123"
- "DJ"

## Caption Guidelines (for galleries)

If you need captions in addition to alt text, add a `caption` property:
```typescript
{
  src: "...",
  width: 1200,
  height: 900,
  alt: "Descriptive alt text",
  caption: "Optional caption text that appears below the image in galleries"
}
```

## Steps to Add a New Image

1. **Upload to Cloudinary:**
   - Go to Cloudinary Media Library
   - Upload your image
   - Copy the full URL (including version number and hash)

2. **Add optimization parameters:**
   - Insert `f_auto,q_auto,dpr_auto` after `/upload/` for display contexts (hero, gallery, lightbox)
   - Example: `.../upload/f_auto,q_auto,dpr_auto/v1768162661/...`

3. **Write descriptive alt text:**
   - Describe what's in the image
   - Include venue/couple names if applicable
   - Be specific and SEO-friendly

4. **Add to code:**
   - Use the appropriate template above
   - Ensure all required properties are included

## Quick Reference

**Cloudinary Base URL:**
```
https://res.cloudinary.com/drtwveoqo/image/upload/
```

**Required Optimization:**
```
f_auto,q_85,dpr_auto,w_1200   (gallery / display – high-res, retina)
f_auto,q_75,dpr_auto,w_800    (cards / below-fold – responsive)
```

**Full Example:**
```
https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162661/Exterior-LED-mood-Lighting_jjuuar.jpg
```
