# Pre-push checklist

Run these before `git push` to catch issues early.

## 1. Automated checks (recommended)

```bash
npm run check
```

This runs `lint` then `build`. Both must pass (exit 0). Lint may show warnings; those are OK as long as it doesn’t error.

Or run them separately:

```bash
npm run lint    # ESLint
npm run build   # Next.js production build
```

## 2. Optional manual checks

- **Dev server:** `npm run dev` → open http://localhost:3001 and click through:
  - `/` (home)
  - `/about`, `/about/faq`, `/about/blog`
  - `/contact-us`, `/artists/djs`, `/services`
- **Prisma/DB (if you use it):** `npm run test:prisma`
- **Git:** `git status` and `git diff --stat` to confirm what you’re committing.

## 3. Quick reference

| Check        | Command           | Must pass? |
|-------------|-------------------|------------|
| Lint        | `npm run lint`    | Yes        |
| Build       | `npm run build`   | Yes        |
| Both        | `npm run check`   | Yes        |
| Dev smoke   | `npm run dev` + browse | Optional |

## 4. Current status (last run)

- **Lint:** Passes (warnings only, no errors).
- **Build:** Passes.

You’re good to push after `npm run check` succeeds.
