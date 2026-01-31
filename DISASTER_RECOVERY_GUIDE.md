# Disaster Recovery & Complete Rebuild Guide
## Stylish Entertainment Website

**Last Updated:** January 31, 2026  
**Version:** 1.8  
**Purpose:** Complete technical documentation for rebuilding the system from scratch in case of catastrophic failure

---

## Table of Contents

1. [Quick Recovery Checklist](#quick-recovery-checklist)
2. [System Architecture Overview](#system-architecture-overview)
3. [Prerequisites & Requirements](#prerequisites--requirements)
4. [Step-by-Step Rebuild Process](#step-by-step-rebuild-process)
5. [Environment Variables Reference](#environment-variables-reference)
6. [Database Setup & Migrations](#database-setup--migrations)
7. [Service Configurations](#service-configurations)
8. [Data Backup & Restore](#data-backup--restore)
9. [Testing & Verification](#testing--verification)
10. [Troubleshooting](#troubleshooting)
11. [Emergency Contacts & Resources](#emergency-contacts--resources)

---

## Quick Recovery Checklist

### Immediate Actions (First 30 Minutes)
- [ ] Verify all service accounts are accessible (Supabase, Vercel, Resend, Cloudinary)
- [ ] Check if code repository is accessible (GitHub)
- [ ] Assess data loss (database, images, files)
- [ ] Document current error messages and symptoms
- [ ] Check service status pages for outages

### Deploy (Routine)

```bash
npm run build
git add . && git commit -m "message" && git push origin main
```

Vercel auto-deploys on push to main. Redeploy after env var changes.

**Vercel multi-project:** Env vars are per project. If you have multiple Vercel projects (e.g. ew61, 42ad), each must have `DATABASE_URL` set. Sitemap now uses dynamic Prisma import so build succeeds even when DB is unavailable (returns static-only sitemap).

### Critical Services to Verify
- [ ] **Supabase Database** - https://supabase.com/dashboard
- [ ] **Vercel Hosting** - https://vercel.com/dashboard
- [ ] **Resend Email** - https://resend.com/dashboard
- [ ] **Cloudinary Images** - https://cloudinary.com/console
- [ ] **GitHub Repository** - Verify code access

### Recovery Priority Order
1. **Database** - Restore from backup or recreate schema
2. **Code Repository** - Clone and verify all files
3. **Environment Variables** - Restore all secrets
4. **Hosting** - Reconnect Vercel to repository
5. **Third-Party Services** - Verify API keys and configurations
6. **Testing** - Verify all functionality

---

## System Architecture Overview

### Technology Stack

**Frontend:**
- Next.js 15.1.11 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI + Shadcn/UI components
- Framer Motion (animations)
- SWR (data fetching)

**Backend:**
- Next.js API Routes
- Prisma 6.19.2 (ORM)
- NextAuth.js v5 beta (authentication)
- Node.js runtime

**Database:**
- Supabase PostgreSQL
- Connection: Session Pooler (recommended) or Direct

**External Services:**
- **Hosting:** Vercel
- **Email:** Resend
- **Images:** Cloudinary (account: drtwveoqo)
- **Analytics:** Google Tag Manager (GTM-WB3F6V7), Google Analytics 4 (G-8WGHN47VLM)
- **Cookie Consent:** CookieYes (1246a38a4c6731928c675e0f)
- **Spam Protection:** Google reCAPTCHA v3
- **Video Gallery:** YouTube Data API v3

### Project Structure

```
/
├── app/                    # Next.js App Router pages and API routes
│   └── about/blog/        # Blog pages (use wrapper pattern)
├── components/             # React components
│   └── blog/              # Blog page client wrappers
├── lib/                    # Utility functions and configurations
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client setup (CRITICAL: singleton pattern)
│   └── email/             # Email sending functions
├── prisma/
│   └── schema.prisma      # Database schema
├── scripts/               # Utility scripts (seeding, fixes)
├── public/                # Static assets
├── types/                 # TypeScript type definitions
├── hooks/                 # React hooks
├── data/                  # Static data files
├── utils/                 # Utility functions
├── next.config.js         # Next.js configuration (CRITICAL: build fixes)
├── package.json           # Dependencies and scripts
└── vercel.json            # Vercel deployment configuration
```

---

## Prerequisites & Requirements

### Required Software

1. **Node.js** - Version 20.x or higher
   ```bash
   node --version  # Should show v20.x.x or higher
   ```

2. **npm** - Comes with Node.js
   ```bash
   npm --version  # Should show 9.x.x or higher
   ```

3. **Git** - For version control
   ```bash
   git --version
   ```

4. **PostgreSQL Client** (optional) - For direct database access
   - pgAdmin, DBeaver, or psql command line

### Required Accounts & Access

1. **GitHub** - Code repository access
2. **Vercel** - Hosting platform
3. **Supabase** - Database hosting
4. **Resend** - Email service
5. **Cloudinary** - Image hosting
6. **Google Services** - Analytics and reCAPTCHA

### Required Credentials (Store Securely)

- Supabase database password
- Resend API key
- Cloudinary API keys
- Google Analytics ID
- Google reCAPTCHA keys
- Vercel deployment tokens
- GitHub repository access

---

## Step-by-Step Rebuild Process

### Phase 1: Repository Setup

#### 1.1 Clone Repository

```bash
# Navigate to your workspace
cd ~/Desktop/Local\ Sites/

# Clone the repository (replace with actual URL)
git clone [REPOSITORY_URL] "Stylish New Webiste"

# Navigate into project
cd "Stylish New Webiste"
```

#### 1.2 Verify Files

```bash
# Check critical files exist
ls -la package.json
ls -la prisma/schema.prisma
ls -la next.config.js
ls -la .env.local.example
```

#### 1.3 Install Dependencies

```bash
# Install all npm packages
npm install

# This will automatically run:
# - npm install (installs packages)
# - postinstall script runs: prisma generate
```

**Expected Output:**
- All packages installed
- Prisma client generated in `node_modules/.prisma/client`

**If Errors:**
- Check Node.js version: `node --version` (must be 20.x+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check internet connection

#### 1.4 Verify Critical Build Configuration

**CRITICAL:** The following configurations are essential for successful builds:

**1. Verify `next.config.js` has these settings:**
```javascript
webpack: (config) => config,
experimental: {
  serverSourceMaps: false,  // Prevents minification crashes
},
```
- **Explicit Webpack:** Use `webpack: (config) => config` so Next.js uses Webpack (no Turbopack) for builds.
- **No turbo:** Do not add `turbo` or `experimental.turbo` properties.

**2. Verify `package.json` scripts:**
- `build`: `next build` (no `--turbo` or `--webpack` flags)
- `dev`: `next dev -p 3001` (no `--turbo`)

**3. Verify `vercel.json` buildCommand:**
```json
"buildCommand": "next build"
```
- No extra flags (e.g. no `--turbo`).

**4. Verify `lib/prisma.ts` uses singleton pattern:**
```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient }

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({ ... })
}

export const prisma = globalForPrisma.prisma  // Must export the global instance
```

**5. Verify blog pages use wrapper pattern:**
- Blog page components (`page.tsx`) are server components
- Client wrappers in `components/blog/` handle dynamic imports
- Route segment configs (`dynamic = 'force-dynamic'`) in page.tsx

---

### Phase 2: Environment Configuration

#### 2.1 Create Environment File

```bash
# Copy example file
cp .env.local.example .env.local

# Edit with your values
nano .env.local  # or use your preferred editor
```

#### 2.2 Set Required Environment Variables

See [Environment Variables Reference](#environment-variables-reference) for complete list.

**Minimum Required for Local Development:**

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify"

# Authentication
NEXTAUTH_SECRET="[GENERATE: openssl rand -base64 32]"
NEXTAUTH_URL="http://localhost:3001"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_DEFAULT_FROM="STYLISH Entertainment <info@stylishentertainment.co.uk>"
```

#### 2.3 Generate NEXTAUTH_SECRET

```bash
# Generate a secure secret
openssl rand -base64 32

# Copy the output and paste into .env.local as NEXTAUTH_SECRET
```

---

### Phase 3: Database Setup

#### 3.1 Verify Supabase Connection

**Supabase Project Details:**
- **Project Reference:** `qraijuzzktertoujrwat`
- **Dashboard:** https://supabase.com/dashboard/project/qraijuzzktertoujrwat
- **Region:** `eu-west-1` (AWS)
- **Pooler Hostname:** `aws-1-eu-west-1.pooler.supabase.com`
- **Direct Hostname:** `db.qraijuzzktertoujrwat.supabase.co`

**Current Working Connection Strings (Verified January 28, 2026):**

```env
# For the App (Session Pooler - Port 5432) - PRIMARY CONNECTION
# Note: Username MUST include project reference (postgres.qraijuzzktertoujrwat)
# If DNS resolution fails, check Supabase Dashboard → Settings → Database → Connection Pooling
DATABASE_URL="postgresql://postgres.qraijuzzktertoujrwat:8bYD7LNFFWwPaREy@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify"

# For the CLI/Migrations (Direct - Port 5432) - SECONDARY CONNECTION
# Use this for Prisma migrations and CLI tools
DIRECT_URL="postgresql://postgres:8bYD7LNFFWwPaREy@db.qraijuzzktertoujrwat.supabase.co:5432/postgres"
```

**Important Configuration Notes:**
- ✅ **Pooler Username Format:** Must be `postgres.qraijuzzktertoujrwat` (with project ref) - NOT just `postgres`
- ✅ **Pooler Hostname:** `aws-1-eu-west-1.pooler.supabase.com`
- ✅ **Ports:** Session Pooler = 5432; Transaction Pooler = 6543 (add `?pgbouncer=true` for 6543)
- ✅ **SSL Mode:** `sslmode=no-verify` for pooler (required for Supabase)
- ✅ **Direct Connection:** Use `postgres` (without project ref) for direct connection
- ⚠️ **DNS Issues:** If pooler hostname doesn't resolve, check Supabase Dashboard to verify pooler is enabled

**To Get/Reset Password:**
1. Go to Supabase Dashboard → Settings → Database
2. Click "Reset database password" (if needed)
3. Copy the connection string or password
4. **For Pooler:** Ensure username format is `postgres.[PROJECT_REF]`
5. **For Direct:** Username is just `postgres`

#### 3.2 Prisma Configuration

**Important:** This project uses Prisma with Driver Adapters (PrismaPg) for connection pooling.

**Prisma Config File:** `prisma.config.ts`
```typescript
import { defineConfig } from 'prisma/config';
import "dotenv/config";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Removed datasource - not compatible with Driver Adapters (PrismaPg)
  // Connection is handled by PrismaPg adapter in lib/prisma.ts via the pool
  seed: {
    script: 'tsx prisma/seed.ts',
  },
});
```

**Connection Setup:** The connection pool is configured in `lib/prisma.ts`:
- Uses `@prisma/adapter-pg` (PrismaPg)
- Creates PostgreSQL pool with connection string from `DATABASE_URL`
- Pool configuration optimized for serverless (max: 5 connections)
- Connection timeouts: 30s connection, 25s query/statement
- Automatically validates pooler username format

#### 3.3 Push Database Schema

```bash
# Validate Prisma schema syntax
npx prisma validate

# Generate Prisma Client (ensures client is up to date)
npx prisma generate

# Test database connection
npm run test:prisma
# OR
NODE_TLS_REJECT_UNAUTHORIZED=0 tsx scripts/test-prisma-connection.ts
```

**Note:** This project does NOT use Prisma migrations. Schema is managed via:
- `prisma/schema.prisma` - Schema definition
- Direct SQL migrations in `supabase-*.sql` files (run via Supabase SQL Editor)

**Expected Output:**
- Schema validation: ✅ Valid
- Prisma Client generated successfully
- Connection test: ✅ Connected
- All tables accessible

**If Errors:**
- Check `DATABASE_URL` is correct in `.env.local`
- Verify Supabase project is active (not paused)
- Check network connection
- Verify pooler username format: `postgres.qraijuzzktertoujrwat`
- Try direct connection instead of pooler (use `DIRECT_URL`)

#### 3.4 Verify Database Connection

```bash
# Method 1: Use test script (recommended)
npm run test:prisma

# Method 2: Open Prisma Studio to view database
npx prisma studio
# Should open browser at http://localhost:5555
# You should see all tables listed

# Method 3: Quick connection test
node -e "require('dotenv').config({path:'.env.local'}); const {Pool}=require('pg'); const p=new Pool({connectionString:process.env.DATABASE_URL}); p.query('SELECT version()').then(r=>{console.log('✅ Connected!',r.rows[0].version);p.end()}).catch(e=>{console.error('❌ Failed:',e.message);p.end()})"
```

**Connection Verification Checklist:**
- ✅ `DATABASE_URL` loads from `.env.local`
- ✅ Username format correct for pooler: `postgres.qraijuzzktertoujrwat`
- ✅ Hostname resolves: `aws-1-eu-west-1.pooler.supabase.com`
- ✅ Connection test successful
- ✅ Prisma Client can query database

#### 3.5 Run Database Migrations (If Needed)

If you have SQL migration files, run them in order:

```bash
# Example: Run a specific migration
# Connect to Supabase SQL Editor and run:
# - supabase-migration.sql
# - supabase-user-management-migration.sql
# - supabase-staff-management-migration.sql
# etc.

# Or use psql:
psql [DATABASE_URL] -f supabase-migration.sql
```

**Important Migration Files (if they exist):**
- `supabase-migration.sql` - Core schema
- `supabase-user-management-migration.sql` - User tables
- `supabase-staff-management-migration.sql` - Staff tables
- `supabase-booking-integrity-migration.sql` - Booking constraints
- `supabase-inbox-flagging-migration.sql` - Email features

---

### Phase 4: Seed Initial Data (Optional)

#### 4.1 Seed Demo Data

```bash
# Seed demo bookings and users
npm run seed:demo
```

#### 4.2 Seed DJ Profiles

```bash
# Seed DJ profiles for public site
npm run seed:djs
```

#### 4.3 Seed Hire Items

```bash
# Seed equipment hire items
npm run seed:hire
```

#### 4.4 Seed Venues

```bash
# Seed venue information
npm run seed:venues
```

#### 4.5 Create Admin Users

```bash
# Reset/create admin passwords
npm run reset:admin-password

# Default admin emails:
# - nigel@stylishentertainment.co.uk
# - ali@stylishentertainment.co.uk
# Default password: demo123 (CHANGE IN PRODUCTION!)
```

---

### Phase 5: Local Development Testing

#### 5.1 Start Development Server

```bash
# Start dev server (runs on port 3001)
npm run dev
```

**Expected Output:**
```
▲ Next.js 15.1.11
- Local:        http://localhost:3001
- Ready in X seconds
```

#### 5.2 Verify Application Loads

1. Open browser: http://localhost:3001
2. Check for errors in browser console (F12)
3. Check terminal for server errors

#### 5.3 Test Critical Features

- [ ] Homepage loads
- [ ] Contact form works
- [ ] Admin login works (`/login`)
- [ ] Client portal accessible
- [ ] API routes respond correctly

---

### Phase 6: Production Deployment (Vercel)

#### 6.1 Connect Vercel to Repository

1. Go to https://vercel.com/dashboard
2. Click "Add New Project" (or select existing project)
3. Import from GitHub
4. Select repository: `stylish-entertainment-site`
5. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (root)
   - **Build Command:** `next build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

#### 6.2 Configure Environment Variables in Vercel

**⚠️ CRITICAL: DATABASE_URL Must Use Pooler Connection**

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

**Step-by-Step DATABASE_URL Setup:**

1. Click **Add New** (or **Edit** if `DATABASE_URL` already exists)
2. **Key:** `DATABASE_URL`
3. **Value:** Copy this EXACT connection string:
   ```
   postgresql://postgres.qraijuzzktertoujrwat:8bYD7LNFFWwPaREy@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify
   ```
4. **Environment:** Select **ALL** (Production, Preview, Development)
5. Click **Save**

**Critical Requirements for DATABASE_URL:**
- ✅ Username MUST be `postgres.qraijuzzktertoujrwat` (with project ref) - NOT just `postgres`
- ✅ Hostname MUST be `aws-1-eu-west-1.pooler.supabase.com` (pooler endpoint, not direct)
- ✅ Port: `5432` (Session Pooler)
- ✅ SSL mode: `sslmode=no-verify` (required for Supabase pooler)
- ⚠️ **DO NOT use direct connection** - causes `ETIMEDOUT` errors in production

**Why Pooler is Required:**
- Direct connection (`db.qraijuzzktertoujrwat.supabase.co`) causes timeout errors on Vercel
- Pooler connection is optimized for serverless environments
- Better connection handling and timeout management

**Other Critical Variables:**
```env
NEXTAUTH_SECRET=[Generated secret - see Environment Variables Reference]
NEXTAUTH_URL=https://stylishentertainment.co.uk
NEXT_PUBLIC_SITE_URL=https://stylishentertainment.co.uk
RESEND_API_KEY=[Resend API key]
RESEND_DEFAULT_FROM=STYLISH Entertainment <info@stylishentertainment.co.uk>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drtwveoqo
CLOUDINARY_API_SECRET=[From Cloudinary Dashboard]
```

**Important:**
- Set for **all environments** (Production, Preview, Development)
- Use production URLs for `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL`
- After updating `DATABASE_URL`, **MUST redeploy** (see 6.3)

#### 6.3 Deploy / Redeploy

**⚠️ IMPORTANT: After Updating DATABASE_URL, You MUST Redeploy**

**Manual Redeploy (Required After Environment Variable Changes):**
1. Go to Vercel Dashboard → **Deployments** tab
2. Find the latest deployment
3. Click **⋯** (three dots) menu
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete
6. Verify deployment logs show successful connection

**Automatic Deployment:**
- Push to `main` branch triggers automatic deployment
- Vercel builds and deploys automatically
- Environment variables are included in build

**Verify Deployment Success:**
- Check deployment logs for "✅ Database connection test successful"
- No `ETIMEDOUT` errors in logs
- Production site loads without database errors

#### 6.4 Verify Deployment

1. Check deployment logs in Vercel dashboard
2. Verify build completes successfully
3. Test production URL
4. Check for runtime errors in Vercel logs

---

## Environment Variables Reference

### Complete Environment Variables List

#### Database (Required)
```env
# Primary connection - Session Pooler (for application)
DATABASE_URL="postgresql://postgres.qraijuzzktertoujrwat:8bYD7LNFFWwPaREy@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify"

# Secondary connection - Direct (for CLI/migrations)
DIRECT_URL="postgresql://postgres:8bYD7LNFFWwPaREy@db.qraijuzzktertoujrwat.supabase.co:5432/postgres"
```

**Critical Configuration:**
- Username for pooler MUST include project reference: `postgres.qraijuzzktertoujrwat`
- Username for direct connection is just: `postgres`
- Pooler hostname: `aws-1-eu-west-1.pooler.supabase.com:5432`
- Direct hostname: `db.qraijuzzktertoujrwat.supabase.co:5432`
- SSL mode for pooler: `sslmode=no-verify` (required)

#### Authentication (Required)
```env
NEXTAUTH_SECRET="[Generate with: openssl rand -base64 32]"
AUTH_SECRET="[Same as NEXTAUTH_SECRET]"
NEXTAUTH_URL="https://stylishentertainment.co.uk"
NEXT_PUBLIC_SITE_URL="https://stylishentertainment.co.uk"
```

#### Email - Resend (Required)
```env
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_DEFAULT_FROM="STYLISH Entertainment <info@stylishentertainment.co.uk>"
```

#### Cloudinary (Required for Images)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="drtwveoqo"
CLOUDINARY_API_KEY="[From Cloudinary Dashboard]"
CLOUDINARY_API_SECRET="[From Cloudinary Dashboard]"
```

#### Google Services (Optional but Recommended)
```env
# Analytics – use one; GTM loads GA via container
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-8WGHN47VLM"
# or NEXT_PUBLIC_GA_MEASUREMENT_ID="G-8WGHN47VLM"

# reCAPTCHA v3 (contact forms)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="[From recaptcha.admin.google.com]"
RECAPTCHA_SECRET_KEY="[From recaptcha.admin.google.com]"

# YouTube (video gallery /galleries/videos)
NEXT_PUBLIC_YOUTUBE_API_KEY="[From Google Cloud Console]"
# Optional: NEXT_PUBLIC_YOUTUBE_CHANNEL_ID="@stylishentertainment937"
```

**GTM:** Google Tag Manager container GTM-WB3F6V7 is loaded via `components/GoogleTagManager.tsx`. GA4 events (e.g. form_submission on thank-you page) are configured in GTM. See `GTM_CONTAINER_QUALITY_FIX.md`.

#### Google Places API (Optional)
```env
GOOGLE_PLACES_API_KEY="[From Google Cloud Console]"
GOOGLE_PLACE_ID="[From Google Places]"
```

#### Cron Jobs (Optional)
```env
CRON_SECRET="[For scheduled tasks]"
```

#### Supabase (If using Supabase Auth)
```env
NEXT_PUBLIC_SUPABASE_URL="https://qraijuzzktertoujrwat.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[From Supabase Dashboard]"
```

### Complete .env.local Template (Current Working Configuration)

**Last Verified:** January 28, 2026

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================

# For the App (Session Pooler - Port 5432)
# Note: If DNS resolution fails, check Supabase Dashboard → Settings → Database → Connection Pooling
# Ensure "Session Pooler" is enabled and the hostname matches
DATABASE_URL="postgresql://postgres.qraijuzzktertoujrwat:8bYD7LNFFWwPaREy@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify"

# For the CLI/Migrations (Direct - Port 5432)
DIRECT_URL="postgresql://postgres:8bYD7LNFFWwPaREy@db.qraijuzzktertoujrwat.supabase.co:5432/postgres"

# ============================================
# AUTHENTICATION
# ============================================

NEXTAUTH_SECRET="kViy49P1rzlNOz45VNzWIW89lTM+wR9hapwNElvoiJc="
NEXTAUTH_URL="http://localhost:3001"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"

# ============================================
# CLOUDINARY (Image Hosting)
# ============================================

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="drtwveoqo"
NEXT_PUBLIC_CLOUDINARY_API_KEY="384481647798187"
CLOUDINARY_API_SECRET="kaBkK8W140kIHJCaL859erzGYcs"

# ============================================
# ANALYTICS
# ============================================

NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-8WGHN47VLM"

# ============================================
# ENVIRONMENT
# ============================================

NODE_ENV="development"
NEXT_PUBLIC_DEBUG=true

# ============================================
# YOUTUBE API (video gallery)
# ============================================

NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSy...
# Optional: NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=@stylishentertainment937

# ============================================
# GOOGLE RECAPTCHA (contact forms)
# ============================================

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...

# ============================================
# EMAIL (Resend)
# ============================================

RESEND_API_KEY=re_xxxxx
```

**Important Notes:**
- Replace passwords/keys with actual values from service dashboards
- For production, update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to production domain
- Keep `.env.local` in `.gitignore` (never commit secrets)
- Use `DATABASE_URL` for application, `DIRECT_URL` for CLI tools

### Where to Find Credentials

**Supabase:**
- Dashboard: https://supabase.com/dashboard/project/qraijuzzktertoujrwat
- Settings → Database → Connection string
- Settings → Database → Connection Pooling (for pooler hostname)
- Settings → API → Service role key

**Resend:**
- Dashboard: https://resend.com/dashboard
- API Keys section

**Cloudinary:**
- Dashboard: https://cloudinary.com/console
- Settings → Account Details

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Project → Settings → Environment Variables

**Google Services:**
- Analytics: https://analytics.google.com/
- reCAPTCHA: https://www.google.com/recaptcha/admin
- Cloud Console: https://console.cloud.google.com/

---

## Database Setup & Migrations

### Database Schema

The complete schema is defined in `prisma/schema.prisma`. Key models:

- **User** - Admin and client users
- **Booking** - Event bookings
- **FreelanceCrew** - Staff/DJ profiles
- **BookingStaffAssignment** - Staff assignments
- **EmailThread** - Email communications
- **EmailInbox** - Email inbox configuration
- **DJ** - DJ profiles for public site
- **Musician** - Musician profiles
- **HireItem** - Equipment hire items
- **Venue** - Venue information
- **Task** - Task management
- **Note** - Booking notes
- **GuestRequest** - Guest song requests

### Database Commands

```bash
# Push schema to database (development)
npx prisma db push

# Generate Prisma client
npx prisma generate

# Open database GUI
npx prisma studio

# Create migration (production)
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (DANGER - deletes all data)
npx prisma migrate reset
```

### Database Backups

**Supabase Automatic Backups:**
- Daily automatic backups
- Access via Supabase Dashboard → Database → Backups
- Can restore to point-in-time

**Manual Backup:**
```bash
# Export database
pg_dump [DATABASE_URL] > backup.sql

# Restore database
psql [DATABASE_URL] < backup.sql
```

### Important Database Constraints

- **Row Level Security (RLS):** Enabled on Supabase
- **Connection Pooling:** Use Session Pooler (15 connections max)
- **SSL Required:** All connections must use SSL
- **Indexes:** Many tables have indexes for performance

---

## Service Configurations

### Vercel Configuration

**Project:** `stylish-entertainment-site`  
**Dashboard:** https://vercel.com/dashboard

**Build Settings:**
- Framework: Next.js
- Build Command: `next build` (no flags; do not use `--turbo`)
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 20.x

**vercel.json:** Use `"buildCommand": "next build"` with no extra flags.

**Cron Jobs (vercel.json):**
```json
{
  "crons": [
    {
      "path": "/api/cron/email-journey",
      "schedule": "0 9 * * *"  // Daily at 9 AM
    },
    {
      "path": "/api/cron/monday-brief",
      "schedule": "0 8 * * 1"  // Mondays at 8 AM
    }
  ]
}
```

### Resend Email Configuration

**Dashboard:** https://resend.com/dashboard

**Required Settings:**
- API Key: From Resend dashboard
- From Address: `info@stylishentertainment.co.uk`
- Domain: Must be verified in Resend

**Email Templates:**
- Located in `lib/email-journey-templates.tsx`
- Customer journey emails
- Staff confirmation emails
- Monday brief emails

### Cloudinary Configuration

**Account:** `drtwveoqo`  
**Dashboard:** https://cloudinary.com/console

**Settings:**
- Cloud Name: `drtwveoqo`
- API Key: From dashboard
- API Secret: From dashboard

**Image Configuration (next.config.js):**
- Remote patterns configured for `res.cloudinary.com`
- Formats: AVIF, WebP
- Device sizes configured

### Supabase Configuration

**Project:** `qraijuzzktertoujrwat`  
**Dashboard:** https://supabase.com/dashboard/project/qraijuzzktertoujrwat

**Connection:**
- Use Session Pooler for production
- Direct connection for development only
- SSL required: `sslmode=no-verify` or `sslmode=require`

**Features:**
- Row Level Security (RLS) enabled
- Automatic daily backups
- Connection pooling (15 max connections)

---

## Data Backup & Restore

### What to Backup

1. **Database** - All PostgreSQL data
2. **Code Repository** - Git repository
3. **Environment Variables** - All secrets (store securely)
4. **Images** - Cloudinary (automatic versioning)
5. **Configuration Files** - Service configurations

### Database Backup Procedures

**Automatic (Supabase):**
- Daily backups managed by Supabase
- Access via Dashboard → Database → Backups
- Can restore to any point in time

**Manual Backup:**
```bash
# Export entire database
pg_dump [DATABASE_URL] > backup_$(date +%Y%m%d).sql

# Export specific table
pg_dump [DATABASE_URL] -t "Booking" > bookings_backup.sql

# Compress backup
pg_dump [DATABASE_URL] | gzip > backup_$(date +%Y%m%d).sql.gz
```

**Restore Database:**
```bash
# Restore from backup
psql [DATABASE_URL] < backup_20260127.sql

# Or from compressed
gunzip < backup_20260127.sql.gz | psql [DATABASE_URL]
```

### Code Backup

**Git Repository:**
```bash
# Clone repository (backup)
git clone [REPOSITORY_URL] backup-repo

# Create archive
tar -czf code-backup-$(date +%Y%m%d).tar.gz "Stylish New Webiste"
```

### Environment Variables Backup

**Important:** Store securely (password manager, encrypted file)

```bash
# Export Vercel environment variables
vercel env pull .env.production

# Or manually document all variables
# Store in secure location (1Password, LastPass, etc.)
```

### Image Backup (Cloudinary)

- Cloudinary maintains version history
- Can restore deleted images via dashboard
- Export via API if needed

---

## Testing & Verification

### Pre-Deployment Testing Checklist

#### Local Testing
- [ ] Application starts without errors
- [ ] Database connection works
- [ ] Admin login works
- [ ] Client portal accessible
- [ ] Contact form submits
- [ ] Email sending works
- [ ] Image uploads work (if applicable)
- [ ] API routes respond correctly
- [ ] No console errors in browser

#### Production Testing
- [ ] Site loads on production URL
- [ ] HTTPS redirects work
- [ ] Authentication works
- [ ] Email sending works
- [ ] Database queries work
- [ ] Cron jobs execute (check logs)
- [ ] No 500 errors in logs
- [ ] Performance is acceptable

### Verification Commands

```bash
# Check Node.js version
node --version  # Should be 20.x+

# Check npm version
npm --version

# Verify Prisma client generated
ls node_modules/.prisma/client

# Test database connection
npx prisma db execute --stdin <<< "SELECT 1"

# Build for production
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

### Critical Functionality Tests

**1. Authentication:**
- Admin login: `/login`
- Client portal access
- Session persistence
- Logout functionality

**2. Booking System:**
- Create booking
- View booking details
- Update booking status
- Staff assignment

**3. Email System:**
- Send test email
- Verify Resend API key works
- Check email templates render

**4. Database:**
- Read operations work
- Write operations work
- Relationships load correctly

---

## Critical Build Configuration

### Next.js 15 Build Fixes (REQUIRED)

These configurations are **essential** for successful builds in Next.js 15. Use Webpack explicitly (no Turbopack) for production builds.

#### 1. next.config.js Configuration

**File:** `next.config.js`

**Required Settings:**
```javascript
webpack: (config) => config,
experimental: {
  serverSourceMaps: false,  // Prevents minification crashes
},
```

**Rules:**
- **Explicit Webpack:** `webpack: (config) => config` ensures Next.js uses Webpack for builds.
- **No turbo:** Do not add `turbo` or `experimental.turbo` properties.
- `serverSourceMaps: false` – Prevents source map generation issues during minification.

#### 2. package.json Scripts

- **build:** `next build` (no `--turbo` or `--webpack` flags)
- **dev:** `next dev -p 3001` (no `--turbo`)

#### 3. vercel.json buildCommand

```json
"buildCommand": "next build"
```
No extra flags (e.g. no `--turbo`).

#### 4. Prisma Singleton Pattern

**File:** `lib/prisma.ts`

**Required Pattern:**
```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient }

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// CRITICAL: Must export the global instance, not a new one
export const prisma = globalForPrisma.prisma
```

**Why This Is Needed:**
- Prevents multiple PrismaClient instances during build
- Ensures single instance across all module loads
- Prevents "Collecting page data" phase crashes

#### 5. Blog Page Wrapper Pattern

**Problem:** Blog pages use client-only libraries (`framer-motion`, `yet-another-react-lightbox`) that cannot be evaluated during server-side build/prerendering.

**Solution:** Use client component wrappers.

**Structure:**
```
app/about/blog/[blog-name]/page.tsx          # Server component
components/blog/[BlogName]Wrapper.tsx        # Client component wrapper
app/about/blog/[blog-name]/[BlogName]Content.tsx  # Client content component
```

**Example - page.tsx (Server Component):**
```typescript
// Route segment configs at the very top
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export async function generateStaticParams() {
  return [];  // Skip static generation
}

import BlogWrapper from "@/components/blog/BlogWrapper";

export default async function BlogPage() {
  return <BlogWrapper />;
}
```

**Example - BlogWrapper.tsx (Client Component):**
```typescript
"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr: false in client component
const BlogContent = dynamic(
  () => import("@/app/about/blog/blog-name/BlogContent"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default function BlogWrapper() {
  return <BlogContent />;
}
```

**Why This Pattern:**
- Separates server route config from client dynamic imports
- Prevents naming conflicts (`dynamic` route config vs `dynamic()` function)
- Keeps SEO benefits (route configs in server component)
- Prevents build-time evaluation of client-only code

#### 6. Client-Only Library Handling

**yet-another-react-lightbox:**
- Must be dynamically imported in client components
- CSS import must be in `useEffect` hook:
  ```typescript
  useEffect(() => {
    import("yet-another-react-lightbox/styles.css");
  }, []);
  ```

**framer-motion:**
- Can be directly imported in client components
- Components using `motion` must have `"use client"` directive

**Components Affected:**
- `components/ImageCarousel.tsx` - Uses lightbox (dynamically imported)
- `components/BlogImage.tsx` - Uses lightbox (dynamically imported)
- Blog content components - Use `framer-motion` (direct import OK in client components)

#### 7. Route Segment Configuration

For pages that cannot be statically generated (blog pages with client-only code):

```typescript
// At the very top of page.tsx (before imports)
export const dynamic = 'force-dynamic';        // Force dynamic rendering
export const dynamicParams = true;             // Allow dynamic params
export const revalidate = 0;                   // No revalidation
export const fetchCache = 'force-no-store';    // No fetch caching
export const runtime = 'nodejs';              // Use Node.js runtime
export async function generateStaticParams() {
  return [];  // Skip static generation entirely
}
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: Vercel Production - ETIMEDOUT Database Errors

**Symptoms:**
- Production site shows `ETIMEDOUT` errors in Vercel logs
- Error: `Connection timeout - check network/DATABASE_URL`
- Error: `Prisma error code: ETIMEDOUT`
- API routes timing out on database queries
- Works locally but fails in production

**Root Cause:**
Vercel is using the **direct connection** instead of the **pooler connection**. Direct connections are not optimized for serverless environments and cause timeout issues.

**Solution (CRITICAL):**

1. **Update Vercel DATABASE_URL Environment Variable:**
   - Go to: Vercel Dashboard → Project → Settings → Environment Variables
   - Find `DATABASE_URL`
   - Click **Edit**
   - Replace with pooler connection string:
     ```
     postgresql://postgres.qraijuzzktertoujrwat:8bYD7LNFFWwPaREy@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify
     ```
   - **Critical:** Username MUST be `postgres.qraijuzzktertoujrwat` (with project ref)
   - **Critical:** Hostname MUST be `aws-1-eu-west-1.pooler.supabase.com` (pooler)
   - Select **ALL** environments (Production, Preview, Development)
   - Click **Save**

2. **Redeploy Immediately:**
   - Go to Deployments tab
   - Click **⋯** on latest deployment
   - Click **Redeploy**
   - Wait 2-3 minutes

3. **Verify Fix:**
   - Check deployment logs for "✅ Database connection test successful"
   - No more `ETIMEDOUT` errors
   - Production site works correctly

**Why This Happens:**
- Direct connection: `postgresql://postgres:password@db.qraijuzzktertoujrwat.supabase.co:5432/postgres`
  - ❌ Not optimized for serverless
  - ❌ Connection limits
  - ❌ Timeout issues on Vercel

- Pooler connection: `postgresql://postgres.qraijuzzktertoujrwat:password@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify`
  - ✅ Optimized for serverless
  - ✅ Connection pooling
  - ✅ Better timeout handling
  - ✅ Required for Vercel production

**Prevention:**
- Always use pooler connection string in Vercel
- Never use direct connection for production
- Document connection string in disaster recovery guide (this file)

#### Issue: Database Connection Failed

**Symptoms:**
- Error: `Can't reach database server`
- Error: `P1001: Can't reach database server`

**Solutions:**
1. Check Supabase project is active (not paused)
2. Verify `DATABASE_URL` is correct
3. Try Session Pooler instead of direct connection
4. Check network/firewall settings
5. Verify SSL mode: `?sslmode=no-verify`

**Connection String Format:**
```
# Session Pooler (Recommended - REQUIRED for Vercel)
postgresql://postgres.qraijuzzktertoujrwat:8bYD7LNFFWwPaREy@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify

# Direct (Development Only - DO NOT use in Vercel)
postgresql://postgres:8bYD7LNFFWwPaREy@db.qraijuzzktertoujrwat.supabase.co:5432/postgres
```

#### Issue: Prisma Client Not Generated

**Symptoms:**
- Error: `@prisma/client did not initialize yet`
- Error: `Cannot find module '.prisma/client'`

**Solutions:**
```bash
# Regenerate Prisma client
npx prisma generate

# Or reinstall dependencies
rm -rf node_modules .next
npm install
```

#### Issue: Build Fails

**Symptoms:**
- Build errors in Vercel
- TypeScript errors
- Module resolution errors
- `TypeError: d is not a function` (minification errors)
- `TypeError: o is not a function` (Prisma minification bug)
- `TypeError: dynamic is not a function` (naming conflicts)

**Solutions:**

**1. Verify Next.js Configuration (CRITICAL):**
```javascript
// next.config.js MUST have:
webpack: (config) => config,
experimental: {
  serverSourceMaps: false,
},
// No turbo or experimental.turbo. package.json build: "next build" (no flags).
// vercel.json: "buildCommand": "next build"
```

**2. Verify Prisma Singleton Pattern:**
```typescript
// lib/prisma.ts MUST export the global instance:
const globalForPrisma = global as unknown as { prisma: PrismaClient }
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({ ... })
}
export const prisma = globalForPrisma.prisma  // Must be the global instance
```

**3. Verify Blog Page Wrapper Pattern:**
- Blog `page.tsx` files are server components
- Client wrappers in `components/blog/` handle dynamic imports with `ssr: false`
- Route segment configs at top of page.tsx:
  ```typescript
  export const dynamic = 'force-dynamic';
  export const revalidate = 0;
  export const fetchCache = 'force-no-store';
  export const runtime = 'nodejs';
  export const dynamicParams = true;
  export async function generateStaticParams() { return []; }
  ```

**4. Verify Client-Only Libraries:**
- `yet-another-react-lightbox` must be dynamically imported in client components
- CSS imports for lightbox must be in `useEffect` hooks
- `framer-motion` can be directly imported in client components (they have `"use client"`)

**5. General Build Fixes:**
1. Check Node.js version (must be 20.x+)
2. Clear cache: `rm -rf .next node_modules`
3. Reinstall: `npm install`
4. Check for missing dependencies
5. Verify no naming conflicts (e.g., `dynamic` import vs `dynamic` route config)

#### Issue: Authentication Not Working

**Symptoms:**
- Login fails
- Session not persisting
- Configuration errors

**Solutions:**
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches current domain
3. Verify `AUTH_SECRET` is set (NextAuth v5)
4. Check database connection (auth queries database)
5. Verify user exists in database

#### Issue: Email Not Sending

**Symptoms:**
- Emails not received
- Resend API errors

**Solutions:**
1. Verify `RESEND_API_KEY` is correct
2. Check `RESEND_DEFAULT_FROM` format
3. Verify domain is verified in Resend
4. Check Resend dashboard for errors
5. Test with simple email first

#### Issue: Environment Variables Not Loading

**Symptoms:**
- `undefined` values
- Variables not accessible

**Solutions:**
1. Restart dev server after adding variables
2. In Vercel: Redeploy after adding variables
3. Check variable names (case-sensitive)
4. Verify `NEXT_PUBLIC_` prefix for client-side vars
5. Check `.env.local` file exists and is in root

#### Issue: Images Not Loading

**Symptoms:**
- Images broken
- Cloudinary errors

**Solutions:**
1. Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
2. Check image URLs are correct
3. Verify Cloudinary account is active
4. Check `next.config.js` remote patterns
5. Verify image paths in code

### Debugging Commands

```bash
# Check environment variables (local)
cat .env.local

# Check Prisma connection
npx prisma db execute --stdin <<< "SELECT version()"

# Test email sending (create test script)
node -e "require('./lib/email/send-email.ts').sendEmail({...})"

# Check build output
npm run build 2>&1 | tee build.log

# View Prisma Studio
npx prisma studio

# Check Vercel logs
vercel logs [deployment-url]
```

### Getting Help

1. **Check Logs:**
   - Browser console (F12)
   - Terminal output
   - Vercel deployment logs
   - Supabase logs

2. **Verify Configuration:**
   - Environment variables
   - Service accounts
   - API keys

3. **Test Incrementally:**
   - Start with basic functionality
   - Add features one at a time
   - Test after each change

---

## Emergency Contacts & Resources

### Service Dashboards

- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://supabase.com/dashboard/project/qraijuzzktertoujrwat
- **Resend:** https://resend.com/dashboard
- **Cloudinary:** https://cloudinary.com/console
- **GitHub:** [Repository URL]

### Documentation Links

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Supabase:** https://supabase.com/docs
- **Resend:** https://resend.com/docs
- **NextAuth:** https://authjs.dev/
- **Vercel:** https://vercel.com/docs

### Support Channels

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Resend Support:** support@resend.com
- **GitHub Issues:** [Repository Issues]

### Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server (port 3001)
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npx prisma db push             # Push schema changes
npx prisma generate            # Generate Prisma client
npx prisma studio              # Open database GUI
npx prisma migrate deploy      # Apply migrations

# Seeding
npm run seed:demo              # Seed demo data
npm run seed:djs               # Seed DJ profiles
npm run seed:hire              # Seed hire items
npm run seed:venues            # Seed venues
npm run reset:admin-password   # Reset admin passwords

# Utilities
npm run fix:babington-spelling  # Fix "Babington Houe" etc. typos
npm run fix:babington-variants # Consolidate Babington House variants (contact form autocomplete)
npm run cleanup:test-bookings  # Clean test data

# Deployment
git push origin main           # Deploy to Vercel (auto)
```

### Important File Locations

- **Schema:** `prisma/schema.prisma`
- **Auth Config:** `lib/auth.ts`
- **Prisma Client:** `lib/prisma.ts` (CRITICAL: singleton pattern)
- **Email Config:** `lib/email/send-email.ts`
- **Next Config:** `next.config.js` (CRITICAL: build fixes)
- **Vercel Config:** `vercel.json`
- **Package Config:** `package.json`
- **Blog Wrappers:** `components/blog/*Wrapper.tsx` (client components)
- **Blog Pages:** `app/about/blog/*/page.tsx` (server components)

### Critical Secrets Storage

**Store these securely (password manager):**
- Supabase database password
- Resend API key
- Cloudinary API keys
- NEXTAUTH_SECRET
- Google API keys
- Vercel deployment tokens

**Never commit to git:**
- `.env.local`
- `.env.production`
- Any file with secrets

---

## Recovery Scenarios

### Scenario 1: Complete Server Loss

**Steps:**
1. Verify code repository is accessible
2. Clone repository to new machine
3. Set up environment variables
4. Connect to Supabase (database intact)
5. Deploy to Vercel
6. Verify all services

**Time Estimate:** 2-4 hours

### Scenario 2: Database Corruption/Loss

**Steps:**
1. Restore from Supabase backup (point-in-time)
2. Or recreate schema: `npx prisma db push`
3. Restore data from backup file (if available)
4. Re-seed essential data
5. Verify data integrity

**Time Estimate:** 1-3 hours (with backup) or 4-8 hours (recreate)

### Scenario 3: Code Repository Loss

**Steps:**
1. Check for local backups
2. Recreate from Vercel deployment (if available)
3. Or rebuild from documentation
4. Restore environment variables
5. Verify functionality

**Time Estimate:** 4-8 hours

### Scenario 4: Service Account Compromise

**Steps:**
1. Rotate all API keys immediately
2. Update environment variables
3. Revoke old keys
4. Redeploy application
5. Monitor for unauthorized access

**Time Estimate:** 1-2 hours

### Scenario 5: Partial Functionality Loss

**Steps:**
1. Identify affected features
2. Check service status pages
3. Review error logs
4. Test individual services
5. Fix or work around issues

**Time Estimate:** 30 minutes - 2 hours

---

## Maintenance Schedule

### Daily
- [ ] Check Vercel deployment status
- [ ] Monitor error logs
- [ ] Verify email sending works

### Weekly
- [ ] Review Supabase usage
- [ ] Check for dependency updates
- [ ] Review security logs

### Monthly
- [ ] Update dependencies (with caution)
- [ ] Review and optimize database
- [ ] Backup environment variables
- [ ] Review service costs

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Update documentation
- [ ] Test disaster recovery procedures

---

## Final Notes

### Important Reminders

1. **Always test locally before deploying**
2. **Keep environment variables secure**
3. **Document any custom configurations**
4. **Test backups regularly**
5. **Keep this document updated**

### Related Documentation

- **CURSOR_CONTEXT.md** – Agent familiarisation, tech stack, conventions
- **TERMS_PORTAL_MODULE_PLAN.md** – T&C portal (planned): personalised T&Cs, e-sign, deposit clause, gating
- **BREADCRUMB_AUDIT.md** – Breadcrumb refactor notes
- **GTM_CONTAINER_QUALITY_FIX.md** – GTM setup, Google tag, conversion triggers
- **YOUTUBE_LIVE_TROUBLESHOOTING.md** – YouTube API on production
- **COOKIEYES_GTM_403_FIX.md** – CookieYes 403 when loaded via GTM
- **PAGE_SPEED_MOBILE_NOTES.md** – Mobile performance optimisations
- **ADMIN_401_LIVE.md** – Admin 401 Unauthorized troubleshooting

### Version History

- **v1.8** (January 31, 2026) - Admin fix, sitemap resilience, image cleanup:
  - **Middleware:** `x-pathname` now passed on request headers (not response) so layout can read pathname. Fixes admin 500; layout correctly hides Footer and SiteWideCTA on `/admin`.
  - **Sitemap:** Dynamic Prisma import – build no longer fails when `DATABASE_URL` is missing/invalid (e.g. some Vercel projects). Returns static-only sitemap if DB unavailable.
  - **Kin House:** Removed 404 Cloudinary image from gallery (`app/kin-house-wiltshire/KinHouseClient.tsx`).
  - **Page CTA:** SiteWideCTA at bottom of every page (non-sticky); hidden on `/admin`, `/contact`, `/thank-you`.
- **v1.7** (January 30, 2026) - T&C, footer, breadcrumbs, demos:
  - **T&C Portal Module:** Planned (not implemented). See `TERMS_PORTAL_MODULE_PLAN.md`. Portal will require personalised T&C acceptance before other features. Demo: `/terms-portal-flow-demo` or Admin → Sandbox → Terms portal demo.
  - **Terms content:** `lib/terms-content.ts` – Added `COMPANY_*`, `DEPOSIT_CLAUSE`, `TERMS_ABRIDGED`. Existing `TERMS_SECTIONS` unchanged.
  - **Footer:** Postal address and "All rights reserved" removed. `FooterRefactored.tsx` available; demo at `/admin/sandbox/footer-demo`.
  - **Breadcrumbs:** Refactored to `lib/breadcrumb-config.ts`, `lib/breadcrumb-utils.ts`. See `BREADCRUMB_AUDIT.md`.
  - **T&C at first touch:** Contact form and client portal new booking – no T&C (enquiry only). Book DJ and Book from quote – T&C required.
- **v1.6** (January 30, 2026) - Performance & accessibility:
  - **LCP:** Homepage hero preload in `app/layout.tsx` (w_640, q_60, fetchPriority high); first slider image uses same URL and `unoptimized` so preload is reused. Mobile LCP improved.
  - **Images:** `app/page.tsx` – `smallerCloudinaryUrl()` for below-fold (services, team; w_800,q_60); `sliderCloudinaryUrl()` for non-LCP slider images (w_1080,q_60). Reduces image delivery on mobile.
  - **Fonts:** `app/layout.tsx` – Bebas Neue, Dancing Script, Playfair Display use `display: "optional"` and `preload: false` to reduce render blocking. Raleway stays `display: "swap"`, `preload: true`.
  - **Cache:** `next.config.js` – long-lived cache headers for static assets (favicon, .svg, .png, .ico, .jpg, .jpeg, .webp in `public/`).
  - **Hero:** Homepage hero section no longer uses framer-motion (plain divs) for faster first paint.
  - **CookieYes:** Contrast overrides in `app/globals.css` and injected `<style>` after load in `components/CookieYes.tsx` for WCAG AA. Accessibility 100.
  - **Slider:** `components/ui/slider.tsx` – dot buttons have 48×48px min touch target for mobile accessibility.
  - **Deploy:** Run `npm run build` before deploy; commit then `git push` (Vercel builds from repo). PageSpeed: Desktop ~98 Performance, 100 Accessibility/Best Practices/SEO; Mobile ~83 Performance, 100 elsewhere.
- **v1.5** (January 2026) - Added GTM, CookieYes, YouTube API, reCAPTCHA; updated env vars; added related doc references
- **v1.4** (January 28, 2026) - Build config alignment (Webpack, no Turbopack):
  - `next.config.js`: Explicit `webpack: (config) => config`; no `turbo` or `experimental.turbo`
  - `experimental.serverSourceMaps: false` only (removed webpackBuildWorker, server minification overrides)
  - `package.json` scripts: `next build` / `next dev -p 3001` with no `--turbo` or `--webpack` flags
  - `vercel.json`: `buildCommand`: `"next build"` (no flags)
- **v1.1** (January 27, 2026) - Added critical build configuration fixes:
  - Next.js 15 build fixes (webpackBuildWorker, serverSourceMaps, server minification)
  - Prisma singleton pattern requirements
  - Blog page wrapper pattern
  - Client-only library handling
  - Route segment configuration guide
- **v1.0** (January 27, 2026) - Initial disaster recovery guide

### Document Maintenance

This document should be updated whenever:
- New services are added
- Configuration changes
- Dependencies are updated
- Architecture changes
- New credentials are required

---

**End of Disaster Recovery Guide**

For questions or updates, refer to the main project documentation or contact the development team.
