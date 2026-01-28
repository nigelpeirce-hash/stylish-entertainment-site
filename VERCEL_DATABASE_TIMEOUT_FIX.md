# Vercel Database Timeout Fix

**Date:** January 28, 2026  
**Issue:** `ETIMEDOUT` errors in production Vercel deployments  
**Status:** Fixed

## Problem

Production logs showed Prisma connection timeout errors:
```
PrismaClientKnownRequestError: Invalid `prisma.user.findUnique()` invocation
code: 'ETIMEDOUT'
```

This was happening on:
- `/api/contact` - Contact form submissions
- `/api/venues/search` - Venue autocomplete
- `/api/client/check-ip-recognition` - IP recognition

## Root Cause

Vercel serverless functions have:
1. **Cold starts** - First request takes longer to establish connection
2. **Network latency** - Additional latency between Vercel and Supabase
3. **Connection pooling** - Each function instance creates its own pool
4. **Timeout too short** - 20 second timeout wasn't enough for cold starts

## Solution Applied

### 1. Increased Connection Timeout
- **Before:** `connectionTimeoutMillis: 20000` (20 seconds)
- **After:** `connectionTimeoutMillis: 30000` (30 seconds)

### 2. Added Query Timeouts
- **query_timeout:** 25000ms (25 seconds)
- **statement_timeout:** 25000ms (25 seconds)
- Added to both pool config and connection string

### 3. Optimized Pool Settings for Serverless
- **Pool size:** Reduced from 10 to 5 (serverless functions are stateless)
- **Idle timeout:** 20000ms (20 seconds)
- **Keep-alive:** Enabled for better connection reuse

### 4. Enhanced Connection String
Added timeout parameters to connection string:
```
?connect_timeout=30&statement_timeout=25000
```

## Files Changed

- `lib/prisma.ts` - Updated pool configuration and timeouts

## Verification

After deployment, check Vercel logs:
- ✅ No more `ETIMEDOUT` errors
- ✅ API routes respond successfully
- ✅ Database queries complete within timeout

## If Issues Persist

1. **Check Vercel Environment Variables:**
   - Verify `DATABASE_URL` is set correctly
   - Ensure using Session Pooler (not direct connection)
   - Format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify`

2. **Check Supabase Status:**
   - Verify project is active (not paused)
   - Check connection pooler is enabled
   - Verify no IP bans

3. **Monitor Connection Pool:**
   - Check Supabase dashboard for connection usage
   - Ensure not hitting connection limits

## Additional Recommendations

### For High Traffic:
- Consider using Supabase's Transaction Pooler (port 6543) instead of Session Pooler
- Transaction Pooler is better for serverless (stateless connections)

### Connection String Format:
```
# Session Pooler (Current)
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify

# Transaction Pooler (Alternative - better for serverless)
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=no-verify&pgbouncer=true
```

---

**Last Updated:** January 28, 2026
