# Supabase Security Fix - Row Level Security (RLS)

## Problem
Supabase detected that Row Level Security (RLS) is not enabled on 27 tables in the `public` schema. This means all tables are exposed via Supabase's PostgREST API without access control, which is a critical security vulnerability.

## Important Note
**Your application uses Prisma to connect directly to PostgreSQL**, which bypasses Supabase's PostgREST API. However, Supabase still exposes tables via REST API by default, which could allow unauthorized access if someone discovers your Supabase project URL.

## Solution
We've created a SQL migration script (`supabase-enable-rls-security.sql`) that:

1. **Enables RLS on all tables** - Prevents unauthorized access via PostgREST API
2. **Creates public read policies** for tables that need public access:
   - `DJ` - Public can read active DJs (for `/api/djs` endpoint)
   - `Musician` - Public can read active musicians
   - `HireItem` - Public can read active hire items
   - `VenueAsset` - Public can read venue assets (brochures)
   - `FormSubmission` - Public can insert (for contact forms)

3. **Denies all public access** to sensitive tables:
   - `User` (contains passwords)
   - `Account` (contains OAuth tokens)
   - `VerificationToken` (contains reset tokens)
   - `Booking`, `EmailThread`, `Email`, etc. (all admin data)

## How to Apply the Fix

### Option 1: Via Supabase Dashboard (Recommended - Run in 3 Steps)

**IMPORTANT:** Supabase SQL Editor may have issues with large files. Run these in order:

**Step 1:** Enable RLS on all tables
1. Go to Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `supabase-enable-rls-security-step1.sql`
4. Click **Run**

**Step 2:** Create public read policies
1. Create a new query in SQL Editor
2. Copy and paste the contents of `supabase-enable-rls-security-step2.sql`
3. Click **Run**

**Step 3:** Create deny policies for sensitive tables
1. Create a new query in SQL Editor
2. Copy and paste the contents of `supabase-enable-rls-security-step3.sql`
3. Click **Run**

### Option 2: Via Supabase CLI
```bash
supabase db execute --file supabase-enable-rls-security.sql
```

### Option 3: Via psql
```bash
psql $DATABASE_URL -f supabase-enable-rls-security.sql
```

## What This Fixes

✅ **Security Issues Resolved:**
- Prevents unauthorized access to sensitive data via PostgREST API
- Protects user passwords, tokens, and personal information
- Secures booking data, email threads, and admin-only tables

✅ **Public Access Maintained:**
- DJs API (`/api/djs`) still works - public can read active DJs
- Musicians API still works - public can read active musicians
- Contact form still works - public can submit forms
- Hire items still visible - public can browse available items

## Verification

After running the migration, you can verify RLS is enabled:

```sql
-- Check if RLS is enabled on a table
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'DJ';

-- Should return: rowsecurity = true
```

## Impact on Your Application

**No impact on your Next.js application** - Prisma connections bypass PostgREST and RLS policies. Your application will continue to work exactly as before.

**Only impact:** Prevents unauthorized access via Supabase's REST API endpoints.

## Alternative: Disable PostgREST API (If Not Needed)

If you're not using Supabase's REST API at all, you can disable it entirely:

1. Go to Supabase Dashboard → **Settings** → **API**
2. Disable **PostgREST API** (if available)
3. Or restrict API access to specific IPs/domains

However, **enabling RLS is still recommended** as a defense-in-depth security measure.
