# Deployment Steps - Vercel

## Pre-Deployment Checklist

### ✅ Code Ready
- [x] Next.js 15.1.11 (downgraded from 15.5.10)
- [x] All blog pages fixed with `export const dynamic = 'force-dynamic'`
- [x] Prisma schema configured correctly
- [x] Email system using Resend only
- [x] Build script: `next build` (no --webpack)

### 📝 Git Status
You have uncommitted changes. Before deploying, you should:

1. **Review changes** (optional but recommended):
   ```bash
   git status
   git diff
   ```

2. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Fix build issues: Next.js 15.1.11, blog pages, Prisma config"
   ```

3. **Push to repository**:
   ```bash
   git push origin main
   ```

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import Project** (if new) or **Deploy** (if existing)
3. **Connect your Git repository**
4. **Configure Project**:
   - Framework Preset: **Next.js**
   - Root Directory: `.` (root)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   For production:
   ```bash
   vercel --prod
   ```

## Environment Variables Required

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

### Required for Production

#### Database
- `DATABASE_URL` - PostgreSQL connection string (Supabase)

#### Authentication
- `NEXTAUTH_SECRET` - Secret key for NextAuth
- `NEXTAUTH_URL` - Your production URL (e.g., `https://yourdomain.com`)

#### Email (Resend)
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_DEFAULT_FROM` - Default sender email (e.g., `noreply@yourdomain.com`)

#### Cloudinary (Images)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Your upload preset

#### Supabase (Optional - for user invites)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### Environment Variable Setup in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for **Production**, **Preview**, and **Development** environments
4. Click **Save**

## Post-Deployment Verification

### 1. Check Build Logs
- Go to **Deployments** tab
- Click on the latest deployment
- Verify build completed successfully
- Check for any warnings (should be minimal)

### 2. Test Key Features
- [ ] Homepage loads
- [ ] Contact form works
- [ ] Blog pages load (especially the ones we fixed)
- [ ] Authentication works
- [ ] Email sending works (test contact form)

### 3. Check Environment Variables
- Verify all required env vars are set
- Test that emails are sending (check Resend dashboard)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct
- Check Prisma client generation (should happen automatically via `postinstall`)

### Blog Pages Not Loading
- Verify `export const dynamic = 'force-dynamic'` is in all blog pages
- Check browser console for errors
- Verify Next.js version is 15.1.11

### Email Not Sending
- Verify `RESEND_API_KEY` and `RESEND_DEFAULT_FROM` are set
- Check Resend dashboard for email logs
- Verify domain is verified in Resend (if using custom domain)

## Quick Deploy Command

If you've already set up the project in Vercel:

```bash
# Commit and push changes
git add .
git commit -m "Ready for deployment"
git push origin main

# Vercel will auto-deploy if connected to Git
# Or deploy manually:
vercel --prod
```

## Notes

- **Google Fonts**: Will work on Vercel (has internet access)
- **Prisma**: Client generates automatically via `postinstall` script
- **Build Time**: Should be ~2-5 minutes depending on project size
- **First Deploy**: May take longer as Vercel sets up the project
