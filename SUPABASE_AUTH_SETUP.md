# Supabase Auth URL Configuration Guide

## 🔧 Development Configuration

### Site URL (Development)
```
http://localhost:4000
```
**Note:** Your dev server runs on port **4000** (not 3000), so use port 4000.

### Redirect URLs (Development)
Add these URLs to your Supabase **Redirect URLs** list:

```
http://localhost:4000/auth/callback
http://localhost:4000/auth/setup
http://localhost:4000/api/auth/callback/credentials
```

### Complete Development Setup:
1. **Site URL**: `http://localhost:4000`
2. **Redirect URLs**:
   - `http://localhost:4000/auth/callback`
   - `http://localhost:4000/auth/setup`
   - `http://localhost:4000/api/auth/callback/credentials`

---

## 🚀 Production Configuration

### Site URL (Production)
```
https://stylishentertainment.co.uk
```

### Redirect URLs (Production)
Add these URLs to your Supabase **Redirect URLs** list:

```
https://stylishentertainment.co.uk/auth/callback
https://stylishentertainment.co.uk/auth/setup
https://stylishentertainment.co.uk/api/auth/callback/credentials
```

### Complete Production Setup:
1. **Site URL**: `https://stylishentertainment.co.uk`
2. **Redirect URLs**:
   - `https://stylishentertainment.co.uk/auth/callback`
   - `https://stylishentertainment.co.uk/auth/setup`
   - `https://stylishentertainment.co.uk/api/auth/callback/credentials`

---

## ⚠️ Current Issue

**Your current Supabase config:**
- ✅ Site URL: `http://localhost:3000` → **Change to `http://localhost:4000`**
- ✅ Redirect URL: `https://stylishentertainment.co.uk` → **Good for production**
- ❌ **Missing**: Localhost redirect URLs for development

---

## ✅ Recommended Setup

### Option 1: Separate Dev/Prod Projects (Recommended)
- **Development Project**: Use localhost URLs only
- **Production Project**: Use production URLs only

### Option 2: Single Project with Both URLs (Easier)
Add **ALL** URLs to the Redirect URLs list:

```
http://localhost:4000/auth/callback
http://localhost:4000/auth/setup
http://localhost:4000/api/auth/callback/credentials
https://stylishentertainment.co.uk/auth/callback
https://stylishentertainment.co.uk/auth/setup
https://stylishentertainment.co.uk/api/auth/callback/credentials
```

**Site URL**: Set to production (`https://stylishentertainment.co.uk`) - this is just a default/template.

---

## 🔍 How to Update

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: 
   - For dev: `http://localhost:4000`
   - For prod: `https://stylishentertainment.co.uk`
3. **Redirect URLs**: Click "Add URL" and add all the URLs listed above
4. Click **"Save changes"**

---

## 🧪 Testing

### Test Development:
1. Start dev server: `npm run dev`
2. Try logging in at `http://localhost:4000/login`
3. Check browser console for CORS errors
4. Verify redirects work after login

### Test Production:
1. Deploy to production
2. Try logging in at `https://stylishentertainment.co.uk/login`
3. Check browser console for CORS errors
4. Verify redirects work after login

---

## 📝 Notes

- **Wildcards**: You can use `http://localhost:*` to match any port, but explicit URLs are safer
- **HTTPS Required**: Production URLs must use `https://`
- **Port Mismatch**: Your code defaults to port 3000, but your dev server uses 4000. Consider updating the code defaults or using environment variables.

---

**Last Updated:** January 2026
