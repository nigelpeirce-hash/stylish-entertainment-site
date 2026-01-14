# Email Troubleshooting Guide

## Issues Fixed
1. ✅ EventDatePrompt now delays 6 seconds after page load
2. ✅ Contact form success message now more visible (green on dark background)
3. ⚠️ Email not sending - need to check Mailgun configuration

## Checking Email Settings in Vercel

### Step 1: Verify Environment Variables
Go to your Vercel project → **Settings → Environment Variables** and ensure these are set:

**Required for Mailgun API (preferred):**
- `MAILGUN_API_KEY` - Your Mailgun API key
- `MAILGUN_DOMAIN` - Should be `stylishentertainment.co.uk`
- `MAILGUN_API_URL` - Should be `https://api.eu.mailgun.net/v3` (for EU) or `https://api.mailgun.net/v3` (for US)

**Fallback SMTP (if Mailgun API not working):**
- `SMTP_HOST` - e.g., `smtp.gmail.com` or `smtp.eu.mailgun.org`
- `SMTP_PORT` - `587` or `465`
- `SMTP_SECURE` - `true` for port 465, `false` for 587
- `SMTP_USER` - Your email username
- `SMTP_PASSWORD` - Your email password (App Password for Gmail)
- `SMTP_FROM_EMAIL` - Default sender email

**Contact Form Recipient:**
- `CONTACT_FORM_EMAIL` - Where contact form emails should be sent (defaults to `info@stylishentertainment.co.uk`)

### Step 2: Check Mailgun Dashboard
1. Log into your Mailgun account: https://app.mailgun.com/
2. Go to **Sending → Domains**
3. Verify `stylishentertainment.co.uk` is verified and active
4. Go to **Sending → API Keys** to verify your API key
5. Check **Logs → Events** to see if emails are being received/sent

### Step 3: Test Email Configuration
You can test the email setup by:
1. Submitting the contact form on your live site
2. Check Vercel function logs: **Deployments → Latest → Functions → `/api/contact`**
3. Look for console logs showing:
   - `Attempting to send email to: ...`
   - `Email send result: ...`
   - Any error messages

### Step 4: Common Issues

**Issue: "Email not configured"**
- **Solution**: Ensure `MAILGUN_API_KEY` is set in Vercel environment variables

**Issue: "Mailgun API error: 401"**
- **Solution**: Your API key is incorrect or expired. Get a new one from Mailgun dashboard

**Issue: "Mailgun API error: 403"**
- **Solution**: Domain not verified in Mailgun. Verify your domain in Mailgun dashboard

**Issue: "Mailgun API error: Domain not found"**
- **Solution**: Check `MAILGUN_DOMAIN` matches exactly what's in Mailgun (case-sensitive)

**Issue: Emails sent but not received**
- **Solution**: 
  - Check Mailgun logs for delivery status
  - Check spam/junk folders
  - Verify recipient email address is correct
  - Check if domain is in Mailgun's sandbox mode (only allows sending to authorized recipients)

### Step 5: Enable Mailgun Logging
The code already logs email attempts. Check Vercel function logs for:
- `sendEmail called - To: ... Subject: ...`
- `Using Mailgun REST API` or `Using SMTP`
- `✅ Email sent via Mailgun API: ...` or error messages

### Step 6: Verify Domain in Mailgun
1. Go to Mailgun → **Sending → Domains**
2. Click on `stylishentertainment.co.uk`
3. Ensure status shows "Active" (not "Unverified" or "Sandbox")
4. If in Sandbox mode, you can only send to authorized recipients

### Step 7: Check DNS Records (if domain not verified)
If your domain isn't verified, Mailgun will provide DNS records to add:
- TXT record for domain verification
- MX records (optional, for receiving)
- CNAME records for tracking

## Quick Test
After updating environment variables:
1. **Redeploy** your Vercel project (or wait for auto-deploy)
2. Submit the contact form on your live site
3. Check Vercel function logs immediately after submission
4. Check Mailgun logs for the email

## Need Help?
If emails still aren't working:
1. Share the error message from Vercel function logs
2. Share what you see in Mailgun logs
3. Verify which environment variables are set in Vercel
