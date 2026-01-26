# Stylish Entertainment - Project Documentation

> Last updated: January 2026  
> Production Next.js website for wedding and event entertainment services

---

## 1. Project Overview

### Purpose
Stylish Entertainment is a professional wedding and event entertainment company website featuring:
- Service showcases (DJs, musicians, lighting, venue styling)
- Contact and booking system with venue autocomplete
- Client portal for event management
- Admin dashboard for booking and staff management
- Email notification system

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15.1.11 (App Router) |
| Language | TypeScript 5.5.4 |
| Styling | Tailwind CSS 3.4.7 |
| Database | PostgreSQL via Prisma 7.2.0 |
| Auth | NextAuth 5.0.0-beta.30 |
| UI Components | Radix UI, Framer Motion |
| Forms | React Hook Form + Zod |
| Email | Nodemailer, Resend |
| Image CDN | Cloudinary |
| Hosting | Vercel (assumed) |

### Key Dependencies
- `@dnd-kit` - Drag and drop functionality
- `cmdk` - Command palette
- `fuse.js` - Fuzzy search
- `ical-generator` / `node-ical` - Calendar integration
- `jspdf` / `html2canvas` - PDF generation
- `swr` - Data fetching

---

## 2. Implemented Features

### Contact Form (`/contact-us`)
- **Location:** `app/contact-us/ContactForm.tsx`
- **Features:**
  - Full name, email, phone, event date fields
  - Venue autocomplete with database search
  - DJ selection modal with visual cards
  - Upsell options (lighting, styling, etc.)
  - Google reCAPTCHA v3 integration
  - Form validation via Zod schema

#### Venue Autocomplete
- **Component:** `components/VenueAutocomplete.tsx`
- **API Endpoint:** `app/api/venues/search/route.ts`
- **Behavior:** 
  - Debounced search (300ms)
  - Prefix matching (venues starting with typed characters)
  - Displays venue name with postcode
  - Minimum 2 characters to trigger search

### Hero Sections
All major pages feature full-width hero sections with:
- Background images from Cloudinary
- Gradient overlays for text readability
- Framer Motion entrance animations
- Responsive typography

**Opacity settings (updated):**
- Hero images: `opacity-50` (increased from 25%)
- Blog heroes: `opacity-40` (increased from 15%)
- Gradient overlay: `from-black/50 via-black/30 to-gray-900`

### Event-Specific Pages

| Page | Route | Description |
|------|-------|-------------|
| Weddings | `/weddings/*` | Wedding entertainment, lighting |
| Babington House | `/babington-wedding-info`, `/venues/babington-house` | Venue-specific info |
| Parties | `/parties/*` | Corporate, private, Christmas parties |
| Services | `/services/*` | DJs, lighting design, venue styling |
| Galleries | `/galleries/*` | Photo galleries, videos, Instagram |

### Notification System
- **Component:** `components/NewSubmissionNotifier.tsx`
- **Features:**
  - Browser push notifications for new submissions
  - Custom icon/badge from Cloudinary logo
  - Real-time polling for new enquiries

### Schema.org / SEO
- Structured data implemented in:
  - `app/babington-wedding-info/page.tsx`
  - `app/venues/babington-house/page.tsx`
- Includes organization logo, business info
- Dynamic sitemap: `app/sitemap.ts`
- Robots configuration: `app/robots.ts`

### Admin Dashboard (`/admin`)
- Booking management with calendar view
- DJ and musician management
- Email template editor
- Staff scheduling and assignments
- Enquiry inbox with email threading
- 90-day command center

### Client Portal (`/client`)
- Dashboard with event countdown
- Booking details and timeline
- Music playlist manager
- Guest count tracker
- Budget tracker
- Messaging system

---

## 3. Image Optimizations

### Cloudinary Setup
- **Account:** `drtwveoqo`
- **Base URL:** `https://res.cloudinary.com/drtwveoqo/image/upload/`

### Transformation Strategy

| Transformation | Purpose |
|----------------|---------|
| `f_auto` | Automatic format (WebP/AVIF for supported browsers) |
| `q_auto` | Automatic quality optimization |
| `dpr_auto` | Device pixel ratio for retina displays |
| `w_X,h_Y` | Explicit dimensions where needed |
| `c_auto,g_auto` | Smart cropping with auto gravity |

### Priority 1 Optimizations (Applied)
Images that had **no transformations** - now fixed:

```
✅ components/Navigation.tsx - Logo
✅ app/page.tsx - Hero card image  
✅ app/weddings/.../WeddingEntertainmentClient.tsx - Fairy-light-Tunnel
✅ components/NewSubmissionNotifier.tsx - icon, badge
✅ app/babington-wedding-info/page.tsx - Schema.org logos (2x)
✅ app/venues/babington-house/page.tsx - Schema.org logos (2x)
✅ app/api/contact/route.ts - Email logo
✅ lib/email-journey-templates.ts - Email logo
✅ lib/email-templates.ts - Email logos (3x)
✅ lib/email/renderer.ts - Default logo
✅ app/api/admin/send-dj-inquiry-reply/route.ts - Email logo
✅ lib/email-staff-confirmation.ts - Email logo
✅ lib/email-staff-cancellation.ts - Email logo
```

### Priority 2 Optimizations (Pending)
~300 images have `f_auto,q_auto` but lack `dpr_auto` for retina support.

**Bulk fix (when ready):**
```
Find:    f_auto,q_auto/v
Replace: f_auto,q_auto,dpr_auto/v
```

### Example Optimized URL
```
Before: /upload/v1768162584/Rev-New-SE-Logo0_ow03mn.png
After:  /upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png

Before: /upload/v1768163613/IMG_3400_twcvbw.jpg
After:  /upload/f_auto,q_auto,dpr_auto/v1768163613/IMG_3400_twcvbw.jpg
```

---

## 4. Known Issues & Fixes Applied

### Venue Autocomplete - Prefix Matching Fix
**File:** `app/api/venues/search/route.ts`

**Problem:** Autocomplete used `contains` which matched venues with the query anywhere in the name (e.g., typing "b" matched "Newbury Hall").

**Fix:** Changed to `startsWith` for prefix matching.

```typescript
// Before
venueName: { contains: venueNamePart, mode: "insensitive" }

// After  
venueName: { startsWith: venueNamePart, mode: "insensitive" }
```

**Locations changed:**
- Line 47: Primary booking venue search
- Line 133: VenueAsset primary search
- Line 139: VenueAsset postcode fallback search

### Hero Image Visibility Fix
**Problem:** Hero images were too dark (opacity-15 to opacity-25).

**Fix:** Increased opacity across all hero sections:
- `opacity-15` → `opacity-40`
- `opacity-25` → `opacity-50`
- Reduced gradient overlay darkness

**Files updated:** 28 files across `/app` directory

### Contact-Us Hero Image Update
**File:** `app/contact-us/ContactUsClient.tsx`

Updated hero image to new Cloudinary URL with optimizations:
```
https://res.cloudinary.com/drtwveoqo/image/upload/w_1200,h_600,f_auto,q_auto/IMG_2866_zhs5sz.jpg
```

---

## 5. Testing

### Venue Search Test Script
**File:** `scripts/test-venue-search.ts`

```bash
# Run (requires dev server on port 3001)
npx tsx scripts/test-venue-search.ts
```

**What it tests:**
- Verifies prefix matching behavior
- Tests multiple query strings ("b", "ba", "the", "k")
- Confirms all results start with the typed prefix

---

## 6. Recommended Future Improvements

### Testing
- [ ] Add Jest or Vitest for unit testing
- [ ] Create integration tests for API routes
- [ ] Add E2E tests with Playwright/Cypress

### Image Optimization
- [ ] Apply Priority 2 bulk `dpr_auto` optimization
- [ ] Implement responsive `srcset` for hero images
- [ ] Add blur placeholders for images
- [ ] Consider Next.js Image loader for Cloudinary

### Performance
- [ ] Audit bundle size and code splitting
- [ ] Implement ISR for static pages
- [ ] Add caching headers for API routes

### Security
- [ ] Regular dependency audits (`npm audit`)
- [ ] Rate limiting on API routes
- [ ] CSRF protection review

### Code Quality
- [ ] Extract Cloudinary URL builder utility
- [ ] Consolidate email templates
- [ ] Add TypeScript strict mode

---

## 7. Useful Commands

```bash
# Development
npm run dev              # Start dev server on port 3001

# Database
npm run seed:demo        # Seed demo data
npm run seed:djs         # Seed DJ data
npm run seed:venues      # Seed venue data

# Maintenance
npm run lint             # Run ESLint
npm run build            # Production build

# Scripts
npx tsx scripts/test-venue-search.ts    # Test venue autocomplete
npx tsx scripts/reset-admin-password.ts # Reset admin password
```

---

## 8. File Structure (Key Directories)

```
├── app/
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # API routes
│   ├── client/          # Client portal pages
│   ├── contact-us/      # Contact form
│   ├── weddings/        # Wedding service pages
│   ├── parties/         # Party service pages
│   ├── services/        # Service pages
│   ├── venues/          # Venue-specific pages
│   └── galleries/       # Photo/video galleries
├── components/          # Shared React components
├── lib/                 # Utilities, email templates, actions
├── prisma/              # Database schema and migrations
└── scripts/             # Utility scripts (seeding, testing)
```

---

## 9. Environment Variables

Required environment variables (see `.env.example` or `.env.bak`):
- Database connection (Prisma)
- NextAuth secrets
- Cloudinary credentials
- Email service credentials (Nodemailer/Resend)
- reCAPTCHA keys

---

*This document serves as a reference for the current state of the project. Update as features are added or modified.*
