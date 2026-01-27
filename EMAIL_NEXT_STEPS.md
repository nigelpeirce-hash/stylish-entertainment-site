# Email Setup - Next Steps

## ✅ What You've Done

1. Added `RESEND_API_KEY` to `.env.local`
2. Removed Mailgun configuration (simplified setup)

## 🔄 Step 1: Restart Your Dev Server

**Important:** Environment variables are only loaded when the server starts.

```bash
# Stop your current dev server (Ctrl+C or Cmd+C)
# Then restart:
npm run dev
```

## 🧪 Step 2: Test Email Sending

### Option A: Use the Test Email Endpoint

Visit in your browser:
```
http://localhost:3001/api/test-email
```

You should see:
```json
{
  "success": true,
  "message": "Test email sent! Check your inbox."
}
```

### Option B: Test from Admin Panel

1. Go to any booking page
2. Try sending a test email or deposit confirmation
3. Check your inbox (and spam folder)

## 🚀 Step 3: Set Up in Vercel (For Production)

**Before deploying to production, add the API key to Vercel:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (same one from `.env.local`)
   - **Environment:** Select all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your app (Vercel → Deployments → Redeploy)

## 🌐 Step 4: Verify Your Domain (Optional but Recommended)

**Why?** Without domain verification, emails come from `onboarding@resend.dev`. With verification, they come from `info@stylishentertainment.co.uk` (better deliverability).

### Quick Domain Verification:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **Add Domain**
3. Enter: `stylishentertainment.co.uk`
4. Resend will show DNS records to add:
   - **SPF Record** (TXT)
   - **DKIM Records** (2-3 TXT records)
   - **DMARC Record** (TXT - optional)

5. Add these to your domain registrar (where you manage DNS for stylishentertainment.co.uk)
6. Wait 5-10 minutes for verification
7. Once verified, emails will use `info@stylishentertainment.co.uk`

**Note:** You can send emails immediately without verification - they'll just come from `onboarding@resend.dev` until verified.

## ✅ Verification Checklist

- [ ] Restarted dev server after adding `RESEND_API_KEY`
- [ ] Test email endpoint works (`/api/test-email`)
- [ ] Received test email in inbox
- [ ] Added `RESEND_API_KEY` to Vercel environment variables
- [ ] (Optional) Domain verified in Resend dashboard

## 🎯 What Works Now

Once `RESEND_API_KEY` is set, these automatically use Resend:
- ✅ Artist quote emails (Quote Centre)
- ✅ DJ inquiry replies
- ✅ Staff confirmation emails
- ✅ Staff cancellation emails
- ✅ Booking dispatch emails
- ✅ Portal invitation emails
- ✅ Deposit confirmation emails
- ✅ All other email sending

## 🐛 Troubleshooting

**"RESEND_API_KEY not set" error:**
- Make sure you restarted the dev server
- Check `.env.local` has the key (no quotes, no spaces)
- Key should start with `re_`

**Emails not arriving:**
- Check spam/junk folder
- Check Resend dashboard → Logs: https://resend.com/emails
- Wait 2-3 minutes (can be delayed)
- Verify API key is correct in Resend dashboard

**Domain verification issues:**
- DNS changes can take up to 48 hours (usually 5-10 minutes)
- Make sure TXT records are added correctly
- Check Resend dashboard for verification status

## 📚 Need More Help?

- Resend Docs: https://resend.com/docs
- Resend Dashboard: https://resend.com
- Check email logs: https://resend.com/emails
