# Deployment Prep – Ready to Ship

**Last checked:** Ready for deploy

---

## Build & lint

| Check | Status |
|-------|--------|
| `npm run build` | Passed |
| `npm run lint` | Passed (warnings only, no errors) |

---

## Before you deploy

### 1. Database migration (if not yet run)

Run in Supabase SQL editor if Activity Feed is new:

```sql
-- supabase-activity-log-migration.sql
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "actor" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
```

### 2. Vercel environment variables

Confirm these exist in Vercel → Settings → Environment Variables:

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | `https://www.stylishentertainment.co.uk` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Same as above |
| `CLOUDINARY_CLOUD_NAME` | Yes | For hero image uploads |
| `CLOUDINARY_API_KEY` | Yes | |
| `CLOUDINARY_API_SECRET` | Yes | |
| `CRON_SECRET` | Yes | For email-journey & monday-brief crons |
| `RESEND_API_KEY` | Yes | For transactional email |

See `ENV_SETUP.md` and `PRODUCTION_MIGRATION_GUIDE.md` for full list.

### 3. Cron jobs (Vercel)

Configured in `vercel.json`:

- `/api/cron/email-journey` — daily 9:00 AM UTC
- `/api/cron/monday-brief` — Mondays 8:00 AM UTC

Ensure `CRON_SECRET` is set and matches what Vercel sends.

---

## Deploy

**Git (typical):**
```bash
git add -A
git commit -m "Deploy: wedding-dj updates, demo portal, activity feed"
git push origin main
```

Vercel will build and deploy on push.

**Vercel CLI:**
```bash
vercel --prod
```

---

## Post-deploy checks

1. Visit `https://www.stylishentertainment.co.uk/wedding-dj` – portal preview
2. Visit `https://www.stylishentertainment.co.uk/demo/portal-preview` – Alex & Sam demo (no footer)
3. Admin dashboard – activity feed loads
4. Client portal – hero image upload works (Cloudinary)
