# Resend Email Setup Guide

## Why Resend?

✅ **Easier Setup** - Just one API key, no SMTP configuration needed  
✅ **Vercel Integration** - Works seamlessly with Vercel  
✅ **Better Deliverability** - Modern email API with great reputation  
✅ **Already Integrated** - Your codebase already uses Resend in many places  
✅ **Free Tier** - 3,000 emails/month free

## Quick Setup (5 minutes)

### Step 1: Sign Up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Sign up with your email (or use GitHub/Google)
3. Verify your email address

### Step 2: Add Your Domain (Optional but Recommended)

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter: `stylishentertainment.co.uk`
4. Resend will give you DNS records to add:
   - **SPF Record** (TXT)
   - **DKIM Records** (TXT)
   - **DMARC Record** (TXT - optional)

5. Add these DNS records to your domain registrar (where you manage stylishentertainment.co.uk)
6. Wait for verification (usually 5-10 minutes)

**Note:** You can start sending emails immediately without domain verification, but emails will come from `onboarding@resend.dev` until your domain is verified.

### Step 3: Get Your API Key

1. Go to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "Production" or "Stylish Entertainment")
4. Copy the API key (you'll only see it once!)

### Step 4: Add to Environment Variables

#### For Local Development (.env.local)

Add to your `.env.local` file:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### For Vercel Production

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add **both** variables (required for password reset, contact form, portal emails, etc.):

   | Name | Value | Environment |
   |------|-------|-------------|
   | `RESEND_API_KEY` | Your Resend API key (e.g. `re_xxx...`) | Production, Preview, Development |
   | `RESEND_DEFAULT_FROM` | `STYLISH Entertainment <info@stylishentertainment.co.uk>` | Production, Preview, Development |

4. Click **Save** and redeploy

### Step 5: Restart Your Server

```bash
# Stop your dev server (Ctrl+C)
# Then restart
npm run dev
```

## Verification

After setup, you should see in your console:
- `✅ Resend configured` (or similar)
- No email errors when sending

## Testing

Send a test email from your admin panel or use the test email endpoint.

## What Gets Updated Automatically?

Your codebase already uses Resend in:
- ✅ Artist quote emails
- ✅ DJ inquiry replies
- ✅ Staff confirmation emails
- ✅ Staff cancellation emails
- ✅ Booking dispatch emails
- ✅ And more...

Once you add `RESEND_API_KEY`, all these will work automatically!

## Troubleshooting

**"RESEND_API_KEY not set"**
- Make sure you added it to `.env.local` (local) or Vercel environment variables (production)
- Restart your dev server after adding

**"Domain not verified"**
- Emails will still send, but from `onboarding@resend.dev`
- Add DNS records to verify your domain for better deliverability

**"Rate limit exceeded"**
- Free tier: 3,000 emails/month
- Upgrade to paid plan if needed

## Need Help?

Check Resend docs: https://resend.com/docs
