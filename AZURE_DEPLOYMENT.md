# LEGACY: Azure Deployment Checklist (Vercel is the primary/active deployment)

> **Note:** This guide is kept for reference only.  
> Your site is designed and configured to run on **Vercel** as the main hosting platform.  
> Only use this Azure guide if you deliberately decide to move away from Vercel in future.

# Azure Deployment Checklist

## ⚠️ Important: Deployment Platform Choice

**You CANNOT use Azure Static Web Apps** because your app has:
- API routes (`/app/api/*`)
- Server-side functionality (NextAuth, Prisma, email sending)
- Database connections

**You MUST use Azure App Service** (supports Next.js server-side rendering and API routes)

---

## Pre-Deployment Checklist

### 1. ✅ Database Setup
- [x] Supabase PostgreSQL database configured
- [x] `DATABASE_URL` connection string ready
- [x] Database tables created via Prisma migrations

### 2. ⚠️ Environment Variables to Configure in Azure

You'll need to set these in Azure App Service Configuration:

#### Required Variables:

```env
# Database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.qraijuzzktertoujrwat.supabase.co:5432/postgres

# NextAuth Authentication
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-domain.azurewebsites.net
AUTH_SECRET=your-secret-key-here-same-as-above

# Mailgun Email (if using)
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_FROM_EMAIL=info@stylishentertainment.co.uk

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-349239221

# Google reCAPTCHA (optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Cron secret for automatic email syncing
CRON_SECRET=some-long-random-string
```

### 3. 🔐 Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Use the output for both `NEXTAUTH_SECRET` and `AUTH_SECRET`.

### 4. 📝 Update NextAuth URL

In production, `NEXTAUTH_URL` must match your actual domain:
- If using Azure default: `https://your-app-name.azurewebsites.net`
- If using custom domain: `https://stylishentertainment.co.uk`

### 5. 🗄️ Database Migrations

Before deploying, ensure your database schema is up to date:
```bash
npx prisma migrate deploy
```

Or if using `prisma db push`:
```bash
npx prisma db push
```

### 6. 🔧 Build Configuration

Your `next.config.js` is already configured correctly (no static export).

### 7. 📦 Build Script

Azure App Service will run:
```bash
npm install
npm run build
npm start
```

Make sure `package.json` has the `start` script (✅ it does).

---

## Azure App Service Deployment Steps

### Option 1: Deploy via Azure Portal

1. **Create Azure App Service:**
   - Go to Azure Portal → Create Resource → Web App
   - Choose:
     - Runtime stack: **Node.js 20 LTS** (or latest)
     - Operating System: **Linux** (recommended) or Windows
     - App Service Plan: **Basic B1** (minimum for Node.js) or higher

2. **Configure Environment Variables:**
   - Go to your App Service → Configuration → Application Settings
   - Add all the environment variables listed above
   - **Important:** URL-encode the password in `DATABASE_URL` (replace `*` with `%2A` and `#` with `%23`)

3. **Deploy Code:**
   - Option A: **GitHub Actions** (Recommended)
     - Go to Deployment Center
     - Connect your GitHub repository
     - Azure will auto-deploy on push
   
   - Option B: **Azure CLI**
     ```bash
     az webapp up --name your-app-name --resource-group your-resource-group --runtime "NODE:20-lts"
     ```
   
   - Option C: **VS Code Azure Extension**
     - Install "Azure App Service" extension
     - Right-click project → Deploy to Web App

4. **Configure Custom Domain (if needed):**
   - Go to Custom domains
   - Add `stylishentertainment.co.uk`
   - Update DNS records as instructed

### Option 2: Deploy via GitHub Actions (Recommended)

1. **Create `.github/workflows/azure-deploy.yml`:**
   ```yaml
   name: Deploy to Azure App Service
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '20'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Generate Prisma Client
           run: npx prisma generate
         
         - name: Build
           run: npm run build
           env:
             DATABASE_URL: ${{ secrets.DATABASE_URL }}
             NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
             NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
         
         - name: Deploy to Azure
           uses: azure/webapps-deploy@v2
           with:
             app-name: 'your-app-name'
             publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
   ```

2. **Add GitHub Secrets:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add all required secrets

---

## Post-Deployment Checklist

### 1. ✅ Test Database Connection
- Visit: `https://your-app.azurewebsites.net/api/test-db`
- Should return success message

### 2. ✅ Test Authentication
- Try registering a new user
- Try logging in
- Check if sessions work

### 3. ✅ Test Email Sending
- Submit contact form
- Check if emails are sent

### 4. ✅ Test API Routes
- Test booking creation
- Test client dashboard
- Test all API endpoints

### 4a. ✅ Enable Automatic Email Inbox Sync (Every 5 Minutes)

- The app already exposes a secure cron endpoint:
  - `GET https://your-domain/api/cron/sync-emails`
- It expects this header:
  - `Authorization: Bearer ${CRON_SECRET}`

To have inboxes auto‑sync approximately every 5 minutes:

1. **Make sure `CRON_SECRET` is set** in Azure App Service Configuration (see env vars section above).
2. **Create a scheduled HTTP job** (you only need one global job):
   - **If using Azure Logic Apps or Azure Functions Timer + HTTP:**
     - Schedule: `Every 5 minutes`
     - Method: `GET`
     - URL: `https://your-domain/api/cron/sync-emails`
     - Header: `Authorization: Bearer YOUR_CRON_SECRET`
3. All inboxes with:
   - `isActive = true`
   - `syncEnabled = true`
   will be synced on each run via `syncAllInboxes()`.

### 5. ✅ Check Logs
- Go to Azure Portal → App Service → Log stream
- Monitor for any errors

### 6. ✅ SSL Certificate
- Azure App Service provides free SSL for `*.azurewebsites.net`
- For custom domain, configure SSL in Custom domains section

---

## Important Notes

### Database Connection
- Make sure Supabase allows connections from Azure IPs
- Check Supabase dashboard → Settings → Database → Connection pooling
- You may need to add Azure IP ranges to allowed IPs

### NextAuth Configuration
- `NEXTAUTH_URL` must be your production URL
- `trustHost: true` is already set in `lib/auth.ts` ✅

### Prisma in Production
- Prisma Client is generated during build
- Make sure `prisma generate` runs in your build process
- Database migrations should run before deployment

### Environment Variables
- **Never commit** `.env.local` to git (already in `.gitignore` ✅)
- Set all variables in Azure App Service Configuration
- Restart app after adding new environment variables

---

## Troubleshooting

### Build Fails
- Check Node.js version (should be 20 LTS)
- Check if all dependencies install correctly
- Check Prisma generation

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check Supabase firewall settings
- Verify password is URL-encoded

### Authentication Not Working
- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set
- Check browser console for errors

### API Routes Return 500
- Check Azure App Service logs
- Verify environment variables are set
- Check database connection

---

## Cost Estimate

- **Azure App Service Basic B1:** ~$13/month (minimum for Node.js)
- **Azure App Service Standard S1:** ~$70/month (recommended for production)
- **Supabase Free Tier:** Free (up to 500MB database, 2GB bandwidth)

**Total:** ~$13-70/month depending on plan

---

## Next Steps

1. ✅ Generate `NEXTAUTH_SECRET`
2. ✅ Prepare all environment variables
3. ✅ Create Azure App Service
4. ✅ Configure environment variables in Azure
5. ✅ Deploy code
6. ✅ Test all functionality
7. ✅ Configure custom domain (if needed)
