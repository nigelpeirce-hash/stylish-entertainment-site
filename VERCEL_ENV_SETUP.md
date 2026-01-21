# Vercel Environment Variables Setup

After resetting your Supabase database password, you need to update Vercel with the new connection string.

## Steps to Update Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `stylish-entertainment-site`

2. **Navigate to Environment Variables**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left menu

3. **Update DATABASE_URL**
   - Find `DATABASE_URL` in the list
   - Click **Edit** (or delete and recreate if needed)
   - **Value:** Use your new connection string:
     ```
     postgresql://postgres:YOUR_NEW_PASSWORD@db.qraijuzzktertoujrwat.supabase.co:5432/postgres?sslmode=require
     ```
   - Replace `YOUR_NEW_PASSWORD` with the password you just set
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
