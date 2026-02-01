# Google Analytics Audit – Hardcoded Code & Strange Realtime Data

**Audit date:** January 2026

---

## Findings

### 1. Hardcoded GA Measurement ID (Critical)

**File:** `components/GoogleAnalytics.tsx` line 7

```tsx
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-349239221";
```

**Issue:** When `NEXT_PUBLIC_GA_MEASUREMENT_ID` is not set, the component falls back to hardcoded `G-349239221`. This can cause:

- **Strange realtime data:** If env var is missing in production, you may be sending data to a test/demo property or an old property.
- **Inconsistent IDs across docs:** 
  - `G-349239221` appears in: GoogleAnalytics.tsx, AZURE_DEPLOYMENT.md, FREE_HOSTING_OPTIONS.md, GTM_CONTAINER_QUALITY_FIX.md
  - `G-8WGHN47VLM` appears in: CURSOR_CONTEXT.md, DISASTER_RECOVERY_GUIDE.md
- **Silent misuse:** The `if (!GA_MEASUREMENT_ID)` check never triggers because of the fallback, so GA always loads even when “not configured”.

**Fix:** Remove the fallback. Use env var only; if unset, return `null` and do not load GA.

---

### 2. Hardcoded GTM ID

**File:** `components/GoogleTagManager.tsx` line 6

```tsx
const GTM_ID = "GTM-WB3F6V7";
```

**Issue:** GTM container ID is hardcoded. Less critical for strange data, but prevents environment-specific containers (e.g. dev vs prod). Consider `NEXT_PUBLIC_GTM_ID`.

---

### 3. Dual GA Loading (Potential Double-Counting)

**Files:** `app/layout.tsx` loads both:

- `GoogleAnalytics` (gtag.js with GA4)
- `GoogleTagManager` (GTM)

**Issue:** If GTM also has a GA4 tag configured for your site, page views and events can be double-counted. This can produce inflated or odd realtime data.

**Recommendation:** See `GTM_CONTAINER_QUALITY_FIX.md` – either:

- Use only GTM for GA (add GA4 tag in GTM, remove `GoogleAnalytics` component), or  
- Use only `GoogleAnalytics` (gtag) and do not configure GA in GTM.

---

### 4. Analytics Event Logging

**File:** `lib/analytics.ts` lines 39–45

```ts
console.log(`[Analytics] BLOCKED (internal): ${eventName}`, params);
// ...
console.log(`[Analytics] Event tracked: ${eventName}`, params);
```

**Issue:** Every GA event is logged to the console. This does not affect GA data but adds noise. Consider removing or gating behind `NODE_ENV === 'development'`.

---

## Correct GA4 Measurement ID

Documentation conflicts:

- **G-349239221** – used in code and some docs
- **G-8WGHN47VLM** – used in CURSOR_CONTEXT and DISASTER_RECOVERY

**Action:** Decide the correct production GA4 property and set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel/production env. Ensure `.env.local` and `.env.example` match.

---

## Summary

| Item                     | Status    | Action                                           |
|--------------------------|-----------|--------------------------------------------------|
| GA hardcoded fallback    | **Fix**   | Remove fallback; use env only                    |
| GTM hardcoded            | Optional  | Move to `NEXT_PUBLIC_GTM_ID` if desired          |
| Dual GA + GTM            | Review    | Avoid duplicate GA; choose GTM or gtag           |
| Console logging          | Optional  | Remove or restrict to development                |
| GA ID inconsistency      | **Fix**   | Decide correct ID; update all env and docs       |
