# Portal URL Environment Setup

## Overview
This guide explains how to configure environment variables for portal links that work in both local development and production.

## Environment Variables

### Local Development (.env.local)
```bash
# Portal URL for local development
NEXT_PUBLIC_APP_URL="http://localhost:3001"

# Alternative: Use NEXT_PUBLIC_SITE_URL (already configured)
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

### Production (Vercel/DigitalOcean)
```bash
# Portal URL for production
NEXT_PUBLIC_APP_URL="https://stylishentertainment.co.uk"

# Or use NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SITE_URL="https://stylishentertainment.co.uk"
```

## How It Works

The booking portal link generation uses this priority:
1. `NEXT_PUBLIC_APP_URL` (if set)
2. `NEXT_PUBLIC_SITE_URL` (if set)
3. `http://localhost:3001` (fallback for development)

**Location**: `lib/actions/booking-actions.ts` (line 88)

```typescript
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
const portalUrl = `${baseUrl}/client/bookings/${booking.id}`;
```

## Portal Link Format

Portal links are generated as:
```
{baseUrl}/client/bookings/{bookingId}
```

Example:
- Local: `http://localhost:3001/client/bookings/abc123`
- Production: `https://stylishentertainment.co.uk/client/bookings/abc123`

## Dev Bypass for Portal Authentication

When creating the portal page (`app/client/bookings/[id]/page.tsx`), you can add a dev bypass like this:

```typescript
"use client";

export default function BookingPortalPage({ params }: { params: { id: string } }) {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    console.log("🛠️ Dev Mode: Bypassing strict portal authentication for testing");
    // Add your dev bypass logic here
    // For example: auto-session the user or skip token check
  }
  
  // ... rest of portal page code
}
```

## Testing

1. **Local Testing**: 
   - Set `NEXT_PUBLIC_APP_URL="http://localhost:3001"` in `.env.local`
   - Portal links in emails will point to localhost

2. **Production Testing**:
   - Set `NEXT_PUBLIC_APP_URL="https://stylishentertainment.co.uk"` in production environment
   - Portal links in emails will point to production

## Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser
- Changes require server restart
- Use `.env.local` for local development (git-ignored)
- Set environment variables in Vercel/DigitalOcean dashboard for production
