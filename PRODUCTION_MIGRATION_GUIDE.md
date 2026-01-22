# Production Migration Guide: WP Engine → Custom Next.js Stack

This guide will help you migrate from WP Engine to your custom Next.js stack with proper HTTPS redirects and Supabase Auth configuration.

## 🎯 Overview

After completing this migration, you'll have:
- ✅ Automatic HTTPS redirects for all HTTP traffic
- ✅ Proper Supabase Auth callback URLs configured
- ✅ No SSL/CORS errors
- ✅ Secure headers for production

---

## 📋 Step 1: Environment Variables Setup

### 1.1 Create Production Environment File

Create a `.env.production` file (or set these in your hosting platform):

```bash
# Copy from .env.example and update with production values
cp .env.example .env.production
```

### 1.2 Required Production Variables

**Critical - Update these with your production domain:**

```env
# Your production domain (REQUIRED)
NEXT_PUBLIC_SITE_URL=https://stylishentertainment.co.uk
NEXTAUTH_URL=https://stylishentertainment.co.uk

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
NEXTAUTH_SECRET=your-production-secret-here

# Supabase (REQUIRED for Auth callbacks)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 1.3 Generate NEXTAUTH_SECRET

```bash
# Generate a secure secret
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

---

## 🔐 Step 2: Supabase Auth Callback URLs

### 2.1 Configure Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add these URLs to **Redirect URLs**:

```
https://stylishentertainment.co.uk/auth/callback
https://stylishentertainment.co.uk/auth/setup
https://stylishentertainment.co.uk/api/auth/callback/credentials
```

### 2.2 Site URL Configuration

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `https://stylishentertainment.co.uk`
- **Redirect URLs**: (Add the URLs above)

### 2.3 Additional Callback URLs (if using OAuth)

If you plan to use OAuth providers (Google, GitHub, etc.), add:

```
https://stylishentertainment.co.uk/api/auth/callback/google
https://stylishentertainment.co.uk/api/auth/callback/github
```

---

## 🔒 Step 3: HTTPS Redirect Configuration

### 3.1 Middleware (Already Configured)

The `middleware.ts` file has been updated to:
- ✅ Automatically redirect HTTP → HTTPS in production
- ✅ Preserve query parameters and paths
- ✅ Skip redirect for localhost (development)

### 3.2 Next.js Headers (Already Configured)

The `next.config.js` has been updated with:
- ✅ HSTS (Strict-Transport-Security)
- ✅ Security headers (X-Content-Type-Options, X-Frame-Options, etc.)

### 3.3 Hosting Platform Configuration

**For Vercel:**
- HTTPS is automatically enabled
- No additional configuration needed
- The middleware will handle redirects

**For Azure App Service:**
- Enable HTTPS in Azure Portal
- Configure custom domain with SSL certificate
- The middleware will handle HTTP → HTTPS redirects

**For Other Platforms:**
- Ensure SSL certificate is installed
- The middleware will handle redirects automatically

---

## 🧪 Step 4: Testing

### 4.1 Test HTTPS Redirect

```bash
# Test HTTP redirect (should redirect to HTTPS)
curl -I http://stylishentertainment.co.uk

# Should return:
# HTTP/1.1 301 Moved Permanently
# Location: https://stylishentertainment.co.uk
```

### 4.2 Test Supabase Auth

1. Try logging in via `/login`
2. Check browser console for CORS errors
3. Verify callback URLs in Supabase logs

### 4.3 Test Environment Variables

Create a test endpoint to verify (remove after testing):

```typescript
// app/api/test-env/route.ts
export async function GET() {
  return Response.json({
    hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  });
}
```

---

## 🚀 Step 5: Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set in hosting platform
- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] Supabase callback URLs configured
- [ ] SSL certificate installed and valid
- [ ] `NEXTAUTH_SECRET` is set and secure

### Post-Deployment

- [ ] Test HTTP → HTTPS redirect
- [ ] Test login functionality
- [ ] Test Supabase Auth callbacks
- [ ] Check browser console for errors
- [ ] Verify security headers with: https://securityheaders.com

---

## 🔧 Troubleshooting

### Issue: CORS Errors with Supabase

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
2. Check Supabase dashboard → Authentication → URL Configuration
3. Ensure callback URLs match exactly (including trailing slashes)

### Issue: HTTP Not Redirecting to HTTPS

**Solution:**
1. Check middleware is running (check logs)
2. Verify `NODE_ENV=production` is set
3. Some platforms handle redirects at the load balancer level (check platform settings)

### Issue: NextAuth Callback Failing

**Solution:**
1. Verify `NEXTAUTH_URL` matches your production domain exactly
2. Check `NEXTAUTH_SECRET` is set
3. Ensure `trustHost: true` is in `lib/auth.ts` (already configured)

### Issue: Environment Variables Not Loading

**Solution:**
1. Restart your hosting platform after setting env vars
2. For Vercel: Redeploy after adding env vars
3. For Azure: Restart the app service
4. Check variable names match exactly (case-sensitive)

---

## 📝 Additional Notes

### Domain Configuration

If you're using a subdomain or different domain:
- Update `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` accordingly
- Update Supabase callback URLs
- Update any hardcoded URLs in the codebase

### Development vs Production

- **Development**: Use `http://localhost:3001` (or your dev port)
- **Production**: Use `https://stylishentertainment.co.uk`

The middleware automatically skips HTTPS redirects for localhost.

### Security Best Practices

1. ✅ Never commit `.env` files to git
2. ✅ Use different secrets for dev/prod
3. ✅ Rotate secrets periodically
4. ✅ Use environment variables in hosting platform (not in code)
5. ✅ Enable 2FA on Supabase account

---

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs
3. Verify all environment variables are set
4. Test Supabase connection separately
5. Verify SSL certificate is valid

---

## ✅ Final Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Supabase callback URLs added
- [ ] HTTPS redirects working
- [ ] Login functionality tested
- [ ] No CORS errors in console
- [ ] Security headers verified
- [ ] SSL certificate valid
- [ ] Domain DNS configured correctly

---

**Last Updated:** January 2026
**Version:** 1.0
