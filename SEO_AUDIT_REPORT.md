# SEO & Metadata Audit Report

## Date: Current
## Status: Issues Found - Action Required

---

## 1. METADATA ISSUES

### ❌ Critical: Client Components Using `useEffect` for Metadata

**Problem:** Many pages are client components (`"use client"`) that set metadata using `useEffect` with `document.title`. This is problematic because:
- Metadata is not in the initial HTML (bad for SEO crawlers)
- Open Graph tags are missing or incorrect
- Search engines may not see the correct titles/descriptions

**Affected Pages (30 files):**
- `app/page.tsx` (Homepage)
- `app/weddings/wedding-entertainment/page.tsx`
- `app/services/venue-styling/page.tsx`
- `app/artists/djs/page.tsx`
- `app/galleries/page.tsx`
- And 25+ more...

**Solution:** Convert these to use Next.js Metadata API by:
1. Creating a server component wrapper that exports metadata
2. OR using `generateMetadata` function
3. Removing `useEffect` document.title manipulation

### ✅ Good Examples (Using Metadata API):
- `app/weddings/wedding-lighting/page.tsx` - Uses `createMetadata` helper
- `app/services/djs/page.tsx` - Exports metadata object
- `app/what-we-do/page.tsx` - Uses `createMetadata`

---

## 2. OPEN GRAPH TAGS

### ✅ Good: `lib/metadata.ts` Helper Function
- Includes Open Graph tags automatically
- Includes Twitter Card tags
- Has default OG image
- Supports custom OG images per page

### ❌ Problem: Not Applied Everywhere
- Pages using `useEffect` won't have OG tags in HTML
- Some pages use manual metadata without OG

**Recommendation:** Ensure all pages use `createMetadata` helper or include OG tags manually.

---

## 3. UNIQUE TITLES & DESCRIPTIONS

### ✅ Generally Good
- Most pages have unique titles
- Titles follow pattern: `"Page Name | Service Type | STYLISH Entertainment"`
- Descriptions are descriptive and unique

### ⚠️ Potential Issues:
- Some client pages may have duplicate titles if metadata isn't properly set
- Need to verify all 87 pages have unique titles

---

## 4. SEMANTIC HTML

### ✅ Homepage (`app/page.tsx`)
- ✅ Uses `<h1>` for main page title: "Exceptional Entertainment"
- ✅ Uses `<h2>` for sections: "What We Do", "What Our Clients Say", etc.
- ✅ Uses `<h3>` for service items and subsection titles

### ⚠️ Need to Check Other Pages:
- Verify all pages use `<h1>` once for page title
- Verify sections use `<h2>`
- Check for proper heading hierarchy (no skipping h2 → h4)

---

## 5. CANONICAL URLs

### ✅ Good: `lib/metadata.ts` Helper
- Automatically generates canonical URLs
- Includes trailing slash consistency
- Uses base URL from config

### ❌ Issue:
- Pages not using `createMetadata` may lack canonical URLs

---

## PRIORITY FIXES

### High Priority (SEO Impact):
1. ✅ Fix metadata for homepage (`app/page.tsx`)
2. ✅ Fix metadata for `app/weddings/wedding-entertainment/page.tsx`
3. ✅ Fix metadata for main service/artist pages

### Medium Priority:
4. Fix remaining client component pages
5. Verify all pages have unique titles/descriptions
6. Audit semantic HTML structure

### Low Priority:
7. Verify OG images are optimal sizes (1200x630 recommended)
8. Add JSON-LD structured data where beneficial

---

## RECOMMENDATIONS

1. **Standardize on `createMetadata` helper** - All pages should use this
2. **Convert client components to server components where possible** - Or create server wrappers
3. **Remove all `useEffect` document.title calls** - Use proper metadata
4. **Run automated audit** - Check all 87 pages for metadata compliance
5. **Test OG tags** - Use Facebook Debugger and Twitter Card Validator

---

## NEXT STEPS

1. Fix critical pages (homepage, main service pages)
2. Create migration guide for remaining pages
3. Add metadata validation to CI/CD
4. Document metadata best practices
