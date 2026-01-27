# Cloudinary Issues - Common Fixes

## Current Status
✅ Cloudinary is responding (HTTP 200)
✅ Cloudinary URLs are configured in `next.config.js`
✅ Cloudinary package is installed

## Common Issues & Fixes

### Issue 1: Next.js Image Optimization Errors

**Problem:** Next.js tries to optimize Cloudinary images, which can cause errors.

**Solution:** Add `unoptimized` prop to Image components OR use a custom loader.

**Option A: Use unoptimized (Quick Fix)**
```tsx
<Image
  src="https://res.cloudinary.com/..."
  alt="..."
  width={800}
  height={600}
  unoptimized // Add this
/>
```

**Option B: Custom Cloudinary Loader (Better)**
Add to `next.config.js`:
```js
images: {
  loader: 'custom',
  loaderFile: './lib/cloudinary-loader.js',
  // ... rest of config
}
```

Create `lib/cloudinary-loader.js`:
```js
export default function cloudinaryLoader({ src, width, quality }) {
  // If already a Cloudinary URL with transformations, use as-is
  if (src.includes('cloudinary.com')) {
    return src;
  }
  // Otherwise, build Cloudinary URL
  const params = [`w_${width}`, `q_${quality || 'auto'}`, 'f_auto'];
  return `https://res.cloudinary.com/drtwveoqo/image/upload/${params.join(',')}/${src}`;
}
```

### Issue 2: Images Not Loading

**Check:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "Img"
4. Look for failed requests (red)

**Common causes:**
- CORS issues
- Invalid URLs
- Missing `width`/`height` props (for non-fill images)

### Issue 3: CORS Errors

If you see CORS errors in console:
- Cloudinary should allow all origins by default
- Check Cloudinary dashboard settings
- Ensure URLs are using HTTPS

## Quick Debug Steps

1. **Check browser console** for errors
2. **Check Network tab** for failed image requests
3. **Test a Cloudinary URL directly** in browser
4. **Check if images load with regular `<img>` tag** (bypasses Next.js optimization)

## Current Configuration

Your `next.config.js` has:
```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    { protocol: 'https', hostname: 'collection.cloudinary.com', pathname: '/**' },
  ],
}
```

This should work, but if you're still having issues, try adding `unoptimized` to Image components.

## What Error Are You Seeing?

Please share:
1. Browser console errors
2. Network tab errors
3. What page/component is affected
4. Screenshot if possible
