# ⚠️ URGENT: Update Vercel DATABASE_URL to Pooler Connection

## Problem
Production is showing `ETIMEDOUT` errors because Vercel is using the old direct connection string instead of the pooler.

## Solution: Update Vercel Environment Variable

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select project: **stylish-entertainment-site**

### Step 2: Update DATABASE_URL
1. Click **Settings** tab
2. Click **Environment Variables** in left menu
3. Find `DATABASE_URL` in the list
4. Click **Edit** (or delete and recreate)

### Step 3: Set Correct Pooler Connection String
**Copy and paste this EXACT value:**

```
postgresql://postgres.qraijuzzktertoujrwat:8bYD7LNFFWwPaREy@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify
```

**Critical Requirements:**
- ✅ Username: `postgres.qraijuzzktertoujrwat` (MUST include project ref)
- ✅ Hostname: `aws-1-eu-west-1.pooler.supabase.com` (pooler, not direct)
- ✅ Port: `5432` (Session Pooler)
- ✅ SSL: `sslmode=no-verify` (required for Supabase pooler)
- ✅ Environment: Select **ALL** (Production, Preview, Development)

### Step 4: Save and Redeploy
1. Click **Save**
2. Go to **Deployments** tab
3. Click **⋯** (three dots) on latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete (2-3 minutes)

### Step 5: Verify
1. Check deployment logs for connection success
2. Test production site - should no longer show ETIMEDOUT errors
3. Check Vercel logs - should see "✅ Database connection test successful"

## Why This Matters

**Direct Connection (OLD - Causes Timeouts):**
```
postgresql://postgres:password@db.qraijuzzktertoujrwat.supabase.co:5432/postgres
```
- ❌ Not optimized for serverless
- ❌ Connection limits
- ❌ Timeout issues on Vercel

**Pooler Connection (NEW - Required for Production):**
```
postgresql://postgres.qraijuzzktertoujrwat:password@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify
```
- ✅ Optimized for serverless
- ✅ Connection pooling
- ✅ Better timeout handling
- ✅ Required for Vercel production

## Current Status
- ✅ Local `.env.local` - Updated with pooler connection
- ❌ Vercel `DATABASE_URL` - Still needs update (causing timeouts)

## After Update
Once Vercel is updated and redeployed, production should work correctly with no timeout errors.
