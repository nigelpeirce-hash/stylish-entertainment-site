# Supabase Connection Setup Guide

This guide will help you connect your Next.js application to your Supabase database.

## Step 1: Get Your Supabase Connection String

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Database Settings**
   - Click on **Settings** (gear icon) in the left sidebar
   - Click on **Database** in the settings menu

3. **Get Your Connection String**
   - Scroll down to **Connection string** section
   - Select **URI** tab (not "Session mode" or "Transaction mode")
   - Copy the connection string - it will look like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```

4. **Replace the password placeholder**
   - The connection string will have `[YOUR-PASSWORD]` placeholder
   - Replace it with your actual database password
   - If you don't know your password, click **Reset database password** in the same settings page

## Step 2: Set Up Local Development (.env.local)

1. **Create or edit `.env.local` file** in your project root:
   ```bash
   cd "/Users/nigel/Desktop/Local Sites/Stylish New Webiste"
   ```

2. **Add your DATABASE_URL**:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
   ```

   **Important:** 
   - Replace `YOUR_ACTUAL_PASSWORD` with your real database password
   - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
   - Add `?sslmode=require` at the end for secure connection

3. **Example** (don't use this, use your own):
   ```env
   DATABASE_URL="postgresql://postgres:MySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require"
   ```

## Step 3: Set Up Production (Vercel)

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project: `stylish-entertainment-site`

2. **Navigate to Environment Variables**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left menu

3. **Add DATABASE_URL**
   - Click **Add New**
   - **Key:** `DATABASE_URL`
   - **Value:** Your Supabase connection string (same as in Step 2)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy**
   - After adding the environment variable, go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**

## Step 4: Test the Connection

### Local Development:
1. **Restart your dev server** (if running):
   ```bash
   # Stop the server (Ctrl+C), then:
   npm run dev
   ```

2. **Test the connection** by visiting:
   - `http://localhost:3001/admin` (should load without database errors)
   - Or check the terminal for any connection errors

### Production:
1. **Wait for redeploy to complete**
2. **Visit your production site**
3. **Check for errors** in Vercel logs:
   - Go to Vercel Dashboard → Your Project → **Deployments**
   - Click on the latest deployment
   - Check **Logs** tab for any database connection errors

## Troubleshooting

### Error: "DATABASE_URL environment variable is required"
- **Solution:** Make sure `.env.local` exists and contains `DATABASE_URL`
- **Solution:** Restart your dev server after adding the variable

### Error: "Connection timeout" or "Connection refused"
- **Solution:** Check that your Supabase project is active (not paused)
- **Solution:** Verify the connection string is correct
- **Solution:** Make sure `?sslmode=require` is at the end of the connection string

### Error: "password authentication failed"
- **Solution:** Reset your database password in Supabase Dashboard
- **Solution:** Update `DATABASE_URL` with the new password

### Error: "relation does not exist"
- **Solution:** Run Prisma migrations to create tables:
  ```bash
  npx prisma migrate deploy
  ```
  Or if using Prisma migrations:
  ```bash
  npx prisma migrate dev
  ```

## Security Notes

⚠️ **Never commit `.env.local` to git** - it's already in `.gitignore`

⚠️ **Never share your DATABASE_URL** - it contains your database password

✅ **Use environment variables** in Vercel for production

✅ **Use different passwords** for development and production if possible

## Quick Reference

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Connection String Format:**
  ```
  postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
  ```

## Next Steps

After connecting:
1. ✅ Your app will use Supabase as the database
2. ✅ All Prisma queries will work through Supabase
3. ✅ RLS policies we set up will protect your data
4. ✅ You can use Supabase Dashboard to view/edit data
