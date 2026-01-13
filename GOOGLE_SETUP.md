# Google Analytics & reCAPTCHA Setup Guide

## What's Been Added

✅ **Google Analytics** - Added to `app/layout.tsx` to track website visitors
✅ **Google reCAPTCHA v3** - Added to contact form to prevent spam

## Setup Instructions

### 1. Google Analytics Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Create a `.env.local` file in your project root (if it doesn't exist)
5. Add your Measurement ID:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
6. Replace `G-XXXXXXXXXX` with your actual Measurement ID

### 2. Google reCAPTCHA Setup

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click **"+"** to create a new site
3. Choose **reCAPTCHA v3**
4. Add your domain (e.g., `stylishentertainment.co.uk`)
5. Accept the terms and submit
6. Copy your **Site Key** (format: `6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
7. Add your Site Key to `.env.local`:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
8. Replace the placeholder with your actual Site Key

**Note:** For testing on localhost, add `localhost` as an allowed domain in reCAPTCHA settings.

### 3. Environment Variables File

Create a `.env.local` file in your project root with both variables:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_RECAPTCHA_SITE_KEY
```

### 4. Restart Your Development Server

After adding the environment variables:
```bash
npm run dev
```

## Important Notes

- **`.env.local`** should NOT be committed to git (it's already in `.gitignore`)
- The scripts will only load if the keys are configured (no errors if keys are missing)
- For production, set these as environment variables in your hosting platform (Azure, Vercel, etc.)

## Verification

1. **Google Analytics**: Check the Google Analytics dashboard for real-time visitors
2. **reCAPTCHA**: Check the browser console - you should see no errors when submitting the contact form

## Need Help?

- [Google Analytics Help](https://support.google.com/analytics)
- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
