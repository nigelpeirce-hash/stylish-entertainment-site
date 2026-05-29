# Hydration safety (Stylish Entertainment)

React hydration requires **identical HTML** on the server and the **first client render**.

## Never during render (SSR or first client pass)

- `Math.random()`, `Date.now()`, `new Date()` for display
- `shuffle` / `getRandomReviews` without a fixed seed
- `typeof window`, `window.*`, `navigator`, `localStorage`, `sessionStorage`
- Locale-dependent `toLocaleDateString()` / `toLocaleString()` without `suppressHydrationWarning`
- Client-only branches (`if (mounted) …`) that change **tag structure** vs server
- Framer Motion `initial={{ opacity: 0 }}` (use `@/lib/motion` or plain elements)

## Safe patterns

| Need | Pattern |
|------|---------|
| Random order | `deterministicShuffle(items, "page-seed")` from `@/lib/deterministic-shuffle` |
| Random after mount | `useHasMounted()` + `useEffect` only |
| Client-only widget | `<ClientOnly fallback={…}>` with matching fallback markup |
| Reviews on homepage | `getDeterministicReviews(3, "homepage-featured")` |

## Homepage (`app/HomeClient.tsx`)

- Hero slider order: fixed array for SSR; optional reorder in `useEffect` after mount only.
- Featured testimonials: seeded pick — **not** skeleton → random swap.

## Regression check

Before merging UI work on marketing pages:

```bash
npm run check:hydration
```

Fix any reported `Math.random` / render-time `new Date()` in `app/` or `components/`.

Last updated: 2026-05-29
