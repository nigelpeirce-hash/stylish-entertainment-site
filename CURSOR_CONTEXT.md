# Cursor Context

This is a Next.js 15 App Router project.

## Development & Build
- Uses Turbopack in development (`next dev --turbo -p 3001`)
- Production builds use `next build` (no --webpack flag)
- TypeScript with strict type checking (build errors ignored in config for flexibility)

## Key Dependencies
- **Next.js**: 15.1.11
- **React**: 18.3.1
- **NextAuth**: 5.0.0 (beta)
- **Prisma**: 7.2.0

## Routing
- Routing is entirely in `/app` (no `/pages` directory)
- File-based routing with nested layouts
- Admin and client portals use nested layouts (`/app/admin/layout.tsx`, `/app/client/layout.tsx`)
- API routes in `/app/api`

## Architecture
- **Business logic** lives in `/lib`:
  - Server actions in `/lib/actions`
  - Authentication: `lib/auth.ts`, `lib/admin-auth.ts`
  - Email system: `lib/email/` (renderer, templates)
  - Database: `lib/prisma.ts`
  - Utilities: Cloudinary, Supabase admin, Spotify, YouTube APIs
- **Shared utilities** in `/utils`
- **Reusable components** in `/components`

## Database & Services
- **Prisma** connects to **Supabase Postgres**
- **Email** handled via **Resend**
- **Image hosting** via **Cloudinary**
- **Authentication** via **NextAuth v5.0.0** (beta)

## Hosting and Deployment
- This project is deployed on **Vercel**
- Vercel uses environment variables from the dashboard and `.vercel` folder
- `AZURE_DEPLOYMENT.md` is legacy documentation only, not active

## Key Features
- Event booking and management system
- Admin dashboard for staff management
- Client portal for booking access
- Email automation and templates
- Integration with external APIs (Spotify, YouTube, Monday.com)
