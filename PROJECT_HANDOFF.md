# Stylish Entertainment - Project Handoff Document

**Last Updated:** January 2025  
**Project:** Stylish Entertainment Website & Admin System  
**Version:** 1.0

> **📄 To Convert to PDF:**  
> 1. Open this file in a markdown viewer (VS Code, GitHub, etc.)
> 2. Use browser Print (Cmd/Ctrl + P) → Save as PDF
> 3. Or use online tools like: https://www.markdowntopdf.com/
> 4. Or use command line: `pandoc PROJECT_HANDOFF.md -o PROJECT_HANDOFF.pdf`

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Infrastructure & Hosting](#infrastructure--hosting)
4. [Database Configuration](#database-configuration)
5. [API Endpoints](#api-endpoints)
6. [Environment Variables](#environment-variables)
7. [Authentication & Security](#authentication--security)
8. [Email Configuration](#email-configuration)
9. [Deployment Process](#deployment-process)
10. [Troubleshooting](#troubleshooting)
11. [Important Contacts & Links](#important-contacts--links)

---

## Project Overview

**Project Name:** Stylish Entertainment Website  
**Purpose:** High-end entertainment booking and management system for weddings and events  
**Repository:** GitHub (private)  
**Primary Domain:** stylishentertainment.co.uk

### Key Features
- Public-facing website with DJ profiles, services, galleries
- Client portal for booking management
- Admin dashboard for booking management
- Email automation system
- Staff assignment and management
- 90-day command centre for event tracking

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15.1.11 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + Shadcn/UI
- **Animations:** Framer Motion
- **State Management:** SWR for data fetching

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **ORM:** Prisma 7.2.0
- **Database Adapter:** @prisma/adapter-pg
- **Authentication:** NextAuth.js v5 (beta)

### Database
- **Provider:** Supabase (PostgreSQL)
- **Connection:** Session Pooler (recommended) or Direct Connection

### Email Services
- **Provider:** Resend
- **Fallback:** Nodemailer (for IMAP/SMTP)

### Image Hosting
- **Provider:** Cloudinary
- **Account:** drtwveoqo

### Other Services
- **Analytics:** Google Analytics
- **Spam Protection:** Google reCAPTCHA v3
- **Cookie Consent:** CookieYes

---

## Infrastructure & Hosting

### Production Hosting: Vercel

**Project Name:** `stylish-entertainment-site`  
**Dashboard:** https://vercel.com/dashboard  
**Repository:** Connected to GitHub

#### Vercel Configuration
- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 20.x (default)

#### Vercel URLs
- **Production:** https://stylish-entertainment-site-ew61-8wgs1qt75.vercel.app
- **Custom Domain:** stylishentertainment.co.uk (when DNS configured)

#### Deployment Settings
- **Auto-deploy:** Enabled (on git push to main)
- **Preview Deployments:** Enabled for pull requests
- **Build Timeout:** 60 seconds (default)

---

## Database Configuration

### Supabase Setup

**Project Reference:** `qraijuzzktertoujrwat`  
**Dashboard:** https://supabase.com/dashboard/project/qraijuzzktertoujrwat

#### Connection Methods

**1. Session Pooler (Recommended for Production)**
```
postgresql://postgres.qraijuzzktertoujrwat:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

**2. Direct Connection (Development Only)**
```
postgresql://postgres:[PASSWORD]@db.qraijuzzktertoujrwat.supabase.co:5432/postgres
```

#### Database Password
- **Location:** Supabase Dashboard → Settings → Database → Reset database password
- **Security:** Never commit passwords to git
- **Reset:** Can be reset anytime from Supabase dashboard

#### SSL Configuration
- **Required:** Yes (Supabase uses SSL)
- **Mode:** `sslmode=require` or `sslmode=no-verify` (for self-signed certs)
- **Pool Config:** `ssl: { rejectUnauthorized: false }` in Prisma config

#### Database Features
- **Row Level Security (RLS):** Enabled on all public tables
- **Connection Pooling:** Session Pooler (15 connections max)
- **Backups:** Automatic daily backups (Supabase managed)

#### Important Tables
- `User` - Admin and client users
- `Booking` - Event bookings
- `FreelanceCrew` - Staff/DJ profiles
- `BookingStaffAssignment` - Staff assignments to bookings
- `EmailThread` - Email communications
- `EmailInbox` - Email inbox configuration
- `DJ` - DJ profiles for public site
- `HireItem` - Equipment hire items

---

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `POST /api/auth/check-credentials` - Email validation
- `GET /api/auth/session` - Get current session

### Admin APIs
- `GET /api/admin/bookings/90-day-command` - 90-day command centre data
- `PATCH /api/admin/bookings/[id]/manual-override` - Update booking status
- `PATCH /api/admin/bookings/[id]/handoff` - Handoff between admins
- `GET /api/admin/bookings/[id]` - Get booking details

### Client APIs
- `POST /api/client/check-ip-recognition` - IP-based client recognition
- `GET /api/client/bookings` - Get client bookings

### Public APIs
- `GET /api/djs` - Get active DJ profiles
- `POST /api/contact` - Contact form submission

### Email APIs
- `POST /api/email/send` - Send email via Resend
- `POST /api/email/sync` - Sync emails from IMAP

---

## Environment Variables

### Required for Local Development (.env.local)

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify"

# Authentication
NEXTAUTH_SECRET="nPnXf6GcRsfYWdtQi8K1dXAPnKJ3YR0MEI1U3j7lbDw="
NEXTAUTH_URL="http://localhost:3001"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="drtwveoqo"

# Google Services
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6LdXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Email Configuration
EMAIL_FROM="info@stylishentertainment.co.uk"
EMAIL_REPLY_TO="info@stylishentertainment.co.uk"
```

### Required for Production (Vercel)

All the above variables must be set in Vercel Dashboard → Settings → Environment Variables

**Important:** 
- Set for all environments (Production, Preview, Development)
- Use Session Pooler connection string for `DATABASE_URL`
- Use production URL for `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL`

---

## Authentication & Security

### NextAuth Configuration
- **Provider:** Credentials (email/password)
- **Session Strategy:** JWT (no database sessions)
- **Secret:** `NEXTAUTH_SECRET` environment variable
- **URL:** `NEXTAUTH_URL` or `NEXT_PUBLIC_SITE_URL`

### User Roles
- **admin** - Full access to admin dashboard
- **client** - Access to client portal only

### Admin Users
- **Email:** nigel@stylishentertainment.co.uk
- **Email:** ali@stylishentertainment.co.uk
- **Default Password:** `demo123` (change in production!)

### Password Reset
```bash
npm run reset:admin-password
```

### Security Features
- **Row Level Security (RLS):** Enabled on Supabase
- **Password Hashing:** bcryptjs (10 rounds)
- **SSL/TLS:** Required for all database connections
- **CORS:** Configured for production domain

---

## Email Configuration

### Email Provider: Resend

**API Key Location:** Resend Dashboard → API Keys  
**From Address:** info@stylishentertainment.co.uk  
**Reply-To:** info@stylishentertainment.co.uk

### Email Types & Senders

| Email Type | Sender Name | From Address |
|------------|-------------|--------------|
| Booking emails | Ali \| STYLISH | info@stylishentertainment.co.uk |
| DJ Worksheet | Nigel \| STYLISH | info@stylishentertainment.co.uk |
| General | STYLISH Entertainment | info@stylishentertainment.co.uk |

### Email Templates

All email templates are located in:
- `lib/email-journey-templates.tsx` - Customer journey emails
- `lib/email-staff-confirmation.ts` - Staff confirmation emails
- `lib/email-staff-cancellation.ts` - Staff cancellation emails
- `lib/monday-brief-email.ts` - Monday morning brief emails

### Email Journey Stages

1. **enquiry-autoresponder** - Immediate thank you with brochure
2. **gentle-reminder** - 3-day follow-up if no booking
3. **booking-confirmation** - After deposit received
4. **4-week-checkin** - Final details reminder
5. **week-of-excitement** - Week before event
6. **post-wedding-magic** - 3 days after event (feedback request)

---

## Deployment Process

### Local Development Setup

1. **Clone Repository**
   ```bash
   git clone [repository-url]
   cd "Stylish New Webiste"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   # Copy .env.local.example to .env.local
   # Fill in all required values
   ```

4. **Set Up Database**
   ```bash
   # Push Prisma schema to database
   npx prisma db push
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Seed Demo Data (Optional)**
   ```bash
   npm run seed:demo
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   # Server runs on http://localhost:3001
   ```

### Production Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel automatically detects push to main branch
   - Builds and deploys automatically
   - Check Vercel dashboard for deployment status

3. **Manual Redeploy (if needed)**
   - Go to Vercel Dashboard → Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

### Database Migrations

```bash
# Push schema changes (development)
npx prisma db push

# Or use migrations (production)
npx prisma migrate deploy
```

---

## Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`
- **Solution:** Check Supabase project is active (not paused)
- **Solution:** Verify `DATABASE_URL` is correct
- **Solution:** Use Session Pooler URL instead of direct connection

**Error:** `self-signed certificate in certificate chain`
- **Solution:** Add `?sslmode=no-verify` to connection string
- **Solution:** Ensure `ssl: { rejectUnauthorized: false }` in Prisma config

**Error:** `password authentication failed`
- **Solution:** Reset password in Supabase Dashboard
- **Solution:** Update `DATABASE_URL` in both `.env.local` and Vercel

### Build Errors

**Error:** `CSS parsing error (hoverinput)`
- **Solution:** Already fixed - Turbopack disabled in `next.config.js`
- **Solution:** Ensure Next.js version is 15.1.11

**Error:** `Prisma client not generated`
- **Solution:** Run `npx prisma generate`
- **Solution:** Check `postinstall` script in `package.json`

### Authentication Issues

**Error:** `CredentialsSignin`
- **Solution:** Check user exists in database
- **Solution:** Verify password is hashed correctly
- **Solution:** Check `NEXTAUTH_SECRET` is set

**Error:** `Configuration error`
- **Solution:** Ensure `NEXTAUTH_SECRET` is set
- **Solution:** Check `NEXTAUTH_URL` matches current domain

### Email Issues

**Error:** `Resend API key invalid`
- **Solution:** Check `RESEND_API_KEY` in environment variables
- **Solution:** Verify API key in Resend dashboard

---

## Important Contacts & Links

### Service Dashboards

- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://supabase.com/dashboard/project/qraijuzzktertoujrwat
- **Resend:** https://resend.com/dashboard
- **Cloudinary:** https://cloudinary.com/console
- **Google Analytics:** https://analytics.google.com/
- **Google reCAPTCHA:** https://www.google.com/recaptcha/admin

### Documentation

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Supabase:** https://supabase.com/docs
- **Resend:** https://resend.com/docs
- **NextAuth:** https://authjs.dev/

### Repository

- **GitHub:** [Private repository - check with project owner]
- **Branch:** `main` (production)

### Domain & DNS

- **Domain:** stylishentertainment.co.uk
- **DNS Provider:** Check domain registrar
- **SSL:** Managed by Vercel (automatic)

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server (port 4000)
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npx prisma db push             # Push schema changes
npx prisma generate            # Generate Prisma client
npx prisma studio              # Open Prisma Studio (database GUI)

# Seeding
npm run seed:demo              # Seed demo data
npm run seed:djs               # Seed DJ profiles
npm run seed:hire              # Seed hire items
npm run reset:admin-password   # Reset admin passwords

# Deployment
git push origin main           # Deploy to Vercel (auto)
```

---

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly:** Check Vercel deployment logs
2. **Monthly:** Review Supabase usage and costs
3. **Quarterly:** Update dependencies (with caution)
4. **As Needed:** Reset admin passwords if compromised

### Backup Strategy

- **Database:** Automatic daily backups (Supabase)
- **Code:** Git repository (GitHub)
- **Images:** Cloudinary (with versioning)

### Monitoring

- **Vercel:** Built-in analytics and logs
- **Supabase:** Dashboard monitoring
- **Google Analytics:** Website traffic

---

## Notes

- This document should be updated whenever infrastructure changes
- Keep passwords and API keys secure - never commit to git
- Test all changes in development before deploying to production
- Next.js 15.1.11 is locked for security reasons - do not update without approval

---

**End of Document**
