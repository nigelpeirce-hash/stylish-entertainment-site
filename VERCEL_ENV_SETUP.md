# Vercel Environment Variables Setup

After resetting your Supabase database password, you need to update Vercel with the new connection string.

## Steps to Update Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `stylish-entertainment-site`

2. **Navigate to Environment Variables**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left menu

3. **Update DATABASE_URL** (CRITICAL - Use Pooler for Production)
   - Find `DATABASE_URL` in the list
   - Click **Edit** (or delete and recreate if needed)
   - **Value:** Use the Session Pooler connection string (REQUIRED for Vercel):
     ```
     postgresql://postgres.qraijuzzktertoujrwat:8bYD7LNFFWwPaREy@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify
     ```
   - ⚠️ **IMPORTANT:** Username MUST be `postgres.qraijuzzktertoujrwat` (with project ref) - NOT just `postgres`
   - ⚠️ **IMPORTANT:** Use pooler hostname `aws-1-eu-west-1.pooler.supabase.com` (not direct connection)
   - ⚠️ **IMPORTANT:** SSL mode must be `sslmode=no-verify` for pooler
   - **Environment:** Make sure all are selected (Production, Preview, Development)
   - Click **Save**

4. **Add NEXTAUTH_SECRET** (if not already set)
   - Click **Add New**
   - **Key:** `NEXTAUTH_SECRET`
   - **Value:** `nPnXf6GcRsfYWdtQi8K1dXAPnKJ3YR0MEI1U3j7lbDw=`
   - **Environment:** All
   - Click **Save**

5. **Redeploy**
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a redeploy

## Required Environment Variables in Vercel

Make sure these are all set:

- ✅ `DATABASE_URL` - Your Supabase connection string (with new password)
- ✅ `NEXTAUTH_SECRET` - Authentication secret
- ✅ `NEXTAUTH_URL` - Your production URL (e.g., `https://your-domain.com`)
- ✅ `NEXT_PUBLIC_SITE_URL` - Your production URL

## Important Notes

⚠️ **After resetting database password:**
- Your local `.env.local` is updated ✅
- **You MUST update Vercel** with the new password, or production will fail to connect

✅ **No other settings need updating** - just the Vercel environment variables
