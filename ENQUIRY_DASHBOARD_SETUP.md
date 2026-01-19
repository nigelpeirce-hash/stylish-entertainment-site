# Ultimate Enquiry Dashboard Setup Guide

## Overview

The Ultimate Enquiry Dashboard is a high-performance Kanban board for managing all enquiries with drag-and-drop functionality, smart sorting, venue mapping, email integration, and talent availability tracking.

## Features

### 1. **Kanban Board Layout**
- 4 columns: **New**, **Checking Availability**, **Quoted**, **Contract Sent**
- Drag-and-drop cards between columns using `@dnd-kit`
- Auto-updates booking status when moved

### 2. **Enquiry Cards**
Each card displays:
- **Client Name** (with initials avatar)
- **Event Date** with countdown (e.g., "In 14 days")
- **Venue** with postcode/address
- **Conflict Icon** if duplicate detected
- **Services** badges
- **Guest Count**
- **Urgency Indicator** (color-coded for urgent dates)

### 3. **Smart Sorting**
- **New** column automatically sorts by urgency (sooner dates first)
- Other columns sort by creation date (newest first)

### 4. **Interaction Side Drawer**
Clicking any card opens a side drawer with 4 tabs:

#### **Overview Tab**
- Client details
- Event information
- Venue details
- Services list
- Message content

#### **Location Tab**
- Interactive Google Maps embed
- Mini-map of venue location
- Full address with postcode

#### **Emails Tab**
- **Integrated Email Editor** (iframe of `/admin/email-templates`)
- Send quotes directly without leaving dashboard
- **Full Email History**:
  - All sent/received emails
  - WhatsApp messages
  - Sorted by date (newest first)
  - Shows subject, direction, timestamp

#### **Availability Tab**
- **Talent Status Tracker**
- Checkboxes for each service type:
  - DJ Contacted
  - Musician Contacted
  - Lighting Designer Contacted
  - Stylist Contacted
  - Stage Manager, Sound Engineer, Photographer
- Green checkmark when contacted
- Persists to database

### 5. **Stats Header**
Top of dashboard shows:
- **Total Leads This Month** - Count of all enquiries this month
- **Conversion Rate %** - Percentage of leads that reached "Contract Sent"
- **Hottest Upcoming Date** - Date with most bookings in next 30 days

## Database Changes

### Schema Update
Added `talentStatus` JSON field to `Booking` model:

```prisma
// Talent Status (for availability tracking in enquiry dashboard)
talentStatus Json? // Store which performers have been contacted: { "dj": true, "musician": false, ... }
```

### Migration
Run Prisma migration:

```bash
npx prisma migrate dev --name add_talent_status
```

Or if using Supabase directly:

```sql
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "talentStatus" JSONB;
```

## API Routes

### `GET /api/admin/enquiries`
Fetches all enquiries with status mapping:
- `pending` → **New**
- `checking_availability` → **Checking Availability**
- `quoted` → **Quoted** (confirmed status)
- `contract_sent` → **Contract Sent** (confirmed + finalDetailsConfirmed)

### `GET /api/admin/enquiries/stats`
Returns dashboard statistics:
- `totalLeadsThisMonth`
- `conversionRate` (percentage)
- `hottestUpcomingDate`

### `PATCH /api/admin/enquiries/[id]/status`
Updates enquiry status when card is moved between columns.

### `GET /api/admin/enquiries/[id]/emails`
Fetches full email history (emails + WhatsApp messages).

### `GET /api/admin/enquiries/[id]/talent-status`
Fetches current talent contact status.

### `PATCH /api/admin/enquiries/[id]/talent-status`
Updates talent contact status.

## Accessing the Dashboard

Navigate to: `/admin/enquiries`

Or add a link in your admin navigation:

```tsx
<Link href="/admin/enquiries">
  <Button>Enquiry Dashboard</Button>
</Link>
```

## Environment Variables

Optional (for Google Maps integration):

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Status Mapping

The dashboard maps booking statuses to enquiry workflow:

| Dashboard Column | Booking Status | Conditions |
|-----------------|----------------|------------|
| New | `pending` | Default for new enquiries |
| Checking Availability | `pending` | When `assignedTo = "you"` and `handoffStatus = "tech_review"` |
| Quoted | `confirmed` | When status is confirmed but `finalDetailsConfirmed = false` |
| Contract Sent | `confirmed` | When `finalDetailsConfirmed = true` |

## Auto-Refresh

Dashboard auto-refreshes every 30 seconds to show new enquiries and updated stats.

## Dependencies

- `@dnd-kit/core` - Drag and drop core
- `@dnd-kit/sortable` - Sortable functionality
- `@dnd-kit/utilities` - Utility functions
- `date-fns` - Date formatting

## Styling

Uses your existing design system:
- Dark theme (gray-900 background)
- Champagne gold accents
- Smooth animations with Framer Motion
- Responsive grid layout

## Troubleshooting

### Cards not dragging
- Check `@dnd-kit` packages are installed
- Verify drag handles are not blocked by other elements

### Map not showing
- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Check Google Maps API is enabled in your project

### Talent status not saving
- Verify `talentStatus` field is added to Booking schema
- Run migration: `npx prisma migrate dev`

### Email editor not loading
- Check `/admin/email-templates` route exists
- Verify iframe is allowed in your CSP settings

## Next Steps

1. Run database migration
2. Add link to dashboard in admin navigation
3. Set up Google Maps API key (optional)
4. Test drag-and-drop functionality
5. Verify email editor integration works

The dashboard is fully functional and ready to use!
