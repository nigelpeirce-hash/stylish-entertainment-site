# Prisma Production "Invalid Invocation" Error Fix

**Date:** January 28, 2026  
**Issue:** `Invalid prisma.booking.findMany() invocation` in production  
**Status:** Investigating

## Problem

Production logs show:
```
PrismaClientKnownRequestError: Invalid `prisma.booking.findMany()` invocation
```

This happens on:
- `/api/venues/search` - Venue autocomplete
- `/api/contact` - Contact form submissions

## Root Cause Analysis

The "Invalid invocation" error typically means:
1. **Prisma client not properly generated** in Vercel build
2. **Schema mismatch** between Prisma schema and database
3. **Adapter not working** correctly in serverless environment
4. **Prisma client not initialized** before use

## Local Testing Results

✅ **Connection works** - Database connects successfully  
✅ **Simple queries work** - `SELECT 1` executes  
✅ **Schema is in sync** - `npx prisma migrate diff` shows empty migration

## Investigation Steps

### 1. Verify Prisma Client Generation in Vercel

Check Vercel build logs for:
```
✔ Generated Prisma Client (v6.19.2) to ./node_modules/@prisma/client
```

**If missing:** The `postinstall` script might not be running.

### 2. Check Vercel Environment Variables

Verify in Vercel Dashboard → Settings → Environment Variables:
- ✅ `DATABASE_URL` is set
- ✅ Uses Session Pooler format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify`
- ✅ Username includes project ref: `postgres.qraijuzzktertoujrwat` (not just `postgres`)

### 3. Verify Prisma Client Initialization

The Prisma client should be initialized once globally. Check `lib/prisma.ts`:
- ✅ Uses singleton pattern
- ✅ Adapter is passed correctly
- ✅ No `datasources` option (incompatible with adapters)

### 4. Test Database Schema Match

Run locally:
```bash
npm run test:prisma
```

This will verify:
- Connection works
- Booking table exists
- `venueName` and `venuePostcode` columns exist
- Actual query pattern works

## Possible Fixes

### Fix 1: Ensure Prisma Client Generation

**Check:** Vercel build logs show Prisma client generation

**If missing:** Add explicit generation step:
```json
"build": "prisma generate && next build"
```

**Note:** This might be redundant if `postinstall` runs, but ensures it happens.

### Fix 2: Verify Adapter Initialization

The adapter must be initialized before PrismaClient. Current setup:
```typescript
const pool = new pg.Pool({ connectionString, ... })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

**Verify:** Pool and adapter are created before PrismaClient.

### Fix 3: Add Prisma Client Verification

Add a check to ensure Prisma client is ready:
```typescript
// In lib/prisma.ts
if (!globalForPrisma.prisma) {
  // Verify adapter is ready
  if (!adapter) {
    throw new Error('PrismaPg adapter not initialized');
  }
  
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}
```

### Fix 4: Check for Schema Drift

Run schema comparison:
```bash
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script
```

**Expected:** Empty migration (no differences)

## Next Steps

1. **Check Vercel build logs** for Prisma client generation
2. **Verify DATABASE_URL** in Vercel environment variables
3. **Run diagnostic script** locally: `npm run test:prisma`
4. **Check improved error logs** after next deployment (will show error code and meta)

## Diagnostic Commands

```bash
# Test connection locally
npm run test:prisma

# Check schema sync
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script

# Verify Prisma client
npx prisma generate
npx prisma validate
```

## Expected Error Codes

If you see these in Vercel logs after improved logging:
- **P2001** - Table doesn't exist → Run `npx prisma db push`
- **P2010** - Raw query failed → SQL syntax issue
- **P1001** - Can't reach database → Connection issue
- **No code** - "Invalid invocation" → Prisma client not initialized correctly

---

**Last Updated:** January 28, 2026
