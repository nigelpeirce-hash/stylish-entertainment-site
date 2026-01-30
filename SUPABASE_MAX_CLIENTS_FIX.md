# Fix: "MaxClientsInSessionMode: max clients reached"

**Error:** `MaxClientsInSessionMode: max clients reached - in Session mode max clients are limited to pool_size`

This happens when your app uses **Supabase Session mode** (port 5432) and opens more connections than the pool allows. Session mode keeps one connection per client for the whole session, so the limit is low (often 15–20).

## Fix: Use Transaction mode (recommended)

Use Supabase’s **Transaction mode** pooler so connections are released after each query. That avoids hitting the session limit.

### 1. Change your `DATABASE_URL` in `.env.local`

**Current (Session mode – limited connections):**
```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify"
```

**Updated (Transaction mode – recommended):**
- Change port from **5432** to **6543**
- Add **pgbouncer=true** to the query string

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=no-verify"
```

Use your real project ref, password, and region (e.g. `aws-1-eu-west-1`). Get the exact host from **Supabase Dashboard → Settings → Database → Connection string → URI**, then switch the port to **6543** and add `&pgbouncer=true`.

### 2. Update `DATABASE_URL` in Vercel (production)

The 500s on live (e.g. `/api/admin/djs/`, `/api/admin/musicians/`) are from the same limit. Update the env var in Vercel:

1. **Vercel Dashboard** → your project → **Settings** → **Environment Variables**
2. Find **DATABASE_URL**
3. Change the URL so that:
   - Port is **6543** (not 5432)
   - Query string includes **pgbouncer=true** and **sslmode=no-verify**

**Example (replace PROJECT_REF and PASSWORD):**
```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=no-verify"
```

4. **Redeploy** (e.g. trigger a new deployment or push a commit) so the new value is used.

One change fixes all DB-backed routes (admin DJs, musicians, bookings, etc.). No code changes needed.

### 3. Restart the dev server (local)

```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

## Why this happens

- **Session mode (5432):** One connection per client for the whole session → small limit → "max clients reached" when many requests or Turbopack re-imports open connections.
- **Transaction mode (6543):** Connections are returned to the pool after each transaction → many more logical clients can use the same pool.

The app also uses a small pool size (1 in dev, 2 in production) to stay within Supabase limits. If you keep using Session mode, you must use Transaction mode (6543 + pgbouncer=true) to avoid this error.
