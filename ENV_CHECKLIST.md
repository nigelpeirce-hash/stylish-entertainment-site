# Environment Variables Checklist

## ✅ What You Have (Good!)

- ✅ `SMTP_FROM_EMAIL` - Email sender address
- ✅ `GOOGLE_PLACES_API_KEY` - Google Places API
- ✅ `GOOGLE_PLACE_ID` - Google Place ID
- ✅ `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics
- ✅ `CRON_SECRET` - For scheduled tasks

## ❌ CRITICAL - Missing Required Variables

### 🔴 **URGENT - Add These Immediately:**

```env
# Domain Configuration (REQUIRED for HTTPS redirects & Auth)
NEXT_PUBLIC_SITE_URL=https://stylishentertainment.co.uk
NEXTAUTH_URL=https://stylishentertainment.co.uk

# Database Connection (REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication (REQUIRED - App won't work without this)
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Supabase (REQUIRED for Auth callbacks - prevents CORS errors)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 🟡 **IMPORTANT - Add These for Full Functionality:**

```env
# Email Configuration (for sending emails)
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=stylishentertainment.co.uk
MAILGUN_API_URL=https://api.eu.mailgun.net/v3
SMTP_HOST=smtp.eu.mailgun.org
SMTP_USER=info@stylishentertainment.co.uk
SMTP_PASSWORD=your-smtp-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google reCAPTCHA (for contact form)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### 🟢 **OPTIONAL - Nice to Have:**

```env
# Resend (alternative email service)
RESEND_API_KEY=your-resend-api-key

# WhatsApp (if using WhatsApp integration)
WHATSAPP_API_KEY=your-whatsapp-api-key
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_BUSINESS_ACCOUNT_ID=your-business-account-id
WHATSAPP_WEBHOOK_SECRET=your-webhook-secret

# Mobile Notifications
MOBILE_NOTIFICATION_TYPE=pushover
MOBILE_NOTIFICATION_WEBHOOK_URL=https://your-webhook-url.com
```

---

## 🚨 Priority Order

### **1. Add These NOW (App Won't Work Without Them):**
1. `NEXT_PUBLIC_SITE_URL` - Your production domain
2. `NEXTAUTH_URL` - Same as NEXT_PUBLIC_SITE_URL
3. `DATABASE_URL` - Your Supabase PostgreSQL connection string
4. `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
5. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
6. `SUPABASE_SERVICE_ROLE_KEY` - From Supabase dashboard

### **2. Add These Next (Email Functionality):**
7. `MAILGUN_API_KEY` - From Mailgun dashboard
8. `MAILGUN_DOMAIN` - stylishentertainment.co.uk
9. `SMTP_USER` - info@stylishentertainment.co.uk
10. `SMTP_PASSWORD` - From Mailgun

### **3. Add These After (Image Uploads):**
11. `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
12. `CLOUDINARY_API_KEY` - From Cloudinary dashboard
13. `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

---

## 📝 Quick Setup Commands

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Find Your Supabase Credentials:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`
   - **Connection String** → `DATABASE_URL`

### Find Your Mailgun Credentials:
1. Go to https://app.mailgun.com
2. Go to **Sending** → **Domain Settings**
3. Copy:
   - **API Key** → `MAILGUN_API_KEY`
   - **Domain** → `MAILGUN_DOMAIN`
   - **SMTP Password** → `SMTP_PASSWORD`

---

## ⚠️ Important Notes

1. **Never commit these to git** - They're already in `.gitignore`
2. **Set in your hosting platform** (Vercel, Azure, etc.) - Not in code
3. **Restart/redeploy** after adding new variables
4. **Use different values** for development vs production
5. **Keep secrets secure** - Don't share in screenshots or logs

---

## ✅ After Adding Variables

1. ✅ Redeploy your application
2. ✅ Test login functionality
3. ✅ Test email sending
4. ✅ Check browser console for errors
5. ✅ Verify HTTPS redirects work

---

**Last Updated:** January 2026
