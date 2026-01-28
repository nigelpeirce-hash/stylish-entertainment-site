# Contact Form Email Audit Guide

## Problem
Contact form shows success message, but no emails are received in the business inbox.

## Quick Audit Steps

### 1. Check Recent Submissions via API
Visit this URL in your browser (or use curl):
```
https://stylish-entertainment-site-nbm4-br1gvo39e.vercel.app/api/contact/audit?limit=10
```

This will show:
- Recent contact form submissions (last 24 hours)
- Email send status for each submission
- Environment variable configuration
- Summary of successes/failures

### 2. Check Vercel Environment Variables

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

**Required Variables:**
- ✅ `RESEND_API_KEY` - Must be set (check if it exists)
- ✅ `CONTACT_FORM_EMAIL` - Should be set to your inbox (defaults to `info@stylishentertainment.co.uk` if not set)

**Verify:**
1. `RESEND_API_KEY` exists and is valid
2. `CONTACT_FORM_EMAIL` is set to the correct email address
3. Both are set for **ALL** environments (Production, Preview, Development)

### 3. Check Vercel Function Logs

Go to: **Vercel Dashboard → Deployments → Latest → Functions → `/api/contact`**

**Look for these log messages:**

✅ **Success indicators:**
```
📧 Attempting to send business email: { hasResendClient: true, recipient: '...', from: '...' }
📤 Sending via Resend...
✅ Business email sent via Resend: { messageId: '...', result: {...} }
```

❌ **Failure indicators:**
```
❌ Error sending business email via Resend: ...
❌ RESEND_API_KEY not set - email cannot be sent
⚠️ Business email failed but continuing with autoresponder
```

### 4. Check Resend Dashboard

1. Go to: https://resend.com/emails
2. Check the **Logs** tab
3. Look for emails sent to your `CONTACT_FORM_EMAIL` address
4. Check for any bounces, rejections, or failures

### 5. Common Issues & Solutions

#### Issue: Business Email Not Sending

**Symptoms:**
- Autoresponder works (client receives email)
- Business notification email not received
- Logs show `messageId: undefined` for business email

**Possible Causes:**

1. **RESEND_API_KEY not set in Vercel**
   - **Solution:** Add `RESEND_API_KEY` to Vercel environment variables
   - **Redeploy** after adding

2. **Resend domain not verified**
   - **Solution:** Go to Resend Dashboard → Domains
   - Verify `stylishentertainment.co.uk` is verified
   - Check DNS records are correct

3. **Email address not allowed**
   - **Solution:** Check Resend dashboard for domain restrictions
   - Ensure `CONTACT_FORM_EMAIL` is using a verified domain

4. **Silent failure in code**
   - **Solution:** Check Vercel logs for error messages
   - Look for `❌ Error sending business email via Resend` messages

#### Issue: Both Emails Failing

**Symptoms:**
- No emails received at all
- Logs show `RESEND_API_KEY not set`

**Solution:**
1. Verify `RESEND_API_KEY` is set in Vercel
2. Check API key is valid in Resend dashboard
3. Redeploy after updating environment variables

### 6. Test Email Configuration

**Option 1: Use Audit Endpoint**
```
GET /api/contact/audit?limit=10
```

**Option 2: Check Response from Contact Form**
The contact form API returns email status in the response:
```json
{
  "success": true,
  "emailDetails": {
    "businessEmailSent": true/false,
    "businessEmailMessageId": "...",
    "businessEmailError": "...",
    "businessEmailTo": "info@stylishentertainment.co.uk",
    "confirmationEmailSent": true/false,
    "confirmationEmailMessageId": "..."
  }
}
```

### 7. Immediate Fix Steps

1. **Check Vercel Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `RESEND_API_KEY` exists
   - Verify `CONTACT_FORM_EMAIL` is set (or will default to `info@stylishentertainment.co.uk`)

2. **Check Resend Dashboard:**
   - Verify domain is verified
   - Check API key is active
   - Review email logs for recent sends

3. **Redeploy if needed:**
   - After updating environment variables, redeploy
   - Go to Deployments → Latest → ⋯ → Redeploy

4. **Test Again:**
   - Submit a test contact form
   - Check audit endpoint: `/api/contact/audit?limit=1`
   - Verify emails in Resend dashboard

### 8. Debugging Code Location

The business email is sent in:
- **File:** `app/api/contact/route.ts`
- **Lines:** 380-435
- **Recipient:** `process.env.CONTACT_FORM_EMAIL || "info@stylishentertainment.co.uk"`
- **Service:** Resend API

The autoresponder is sent in:
- **File:** `app/api/contact/route.ts`
- **Lines:** 489-534
- **Recipient:** Client's email (from form)
- **Service:** Resend API

### 9. Expected Log Flow

**Successful submission should show:**
```
📧 Contact form submission received: {...}
📧 Attempting to send business email: { hasResendClient: true, recipient: 'info@...', from: '...' }
📤 Sending via Resend...
✅ Business email sent via Resend: { messageId: '...', result: {...} }
📧 Attempting to send autoresponder email: { hasResendClient: true, recipient: 'client@...', from: '...' }
📤 Sending autoresponder via Resend...
✅ Autoresponder sent via Resend: { messageId: '...' }
```

**If business email fails:**
```
📧 Attempting to send business email: { hasResendClient: true, recipient: '...', from: '...' }
📤 Sending via Resend...
❌ Error sending business email via Resend: [error details]
⚠️ Business email failed but continuing with autoresponder
[autoresponder continues...]
```

## Next Steps

1. Run the audit endpoint to see current status
2. Check Vercel environment variables
3. Check Resend dashboard for email logs
4. Review Vercel function logs for error messages
5. Update environment variables if needed and redeploy
