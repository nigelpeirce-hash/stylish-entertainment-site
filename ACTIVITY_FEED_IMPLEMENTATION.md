# Admin Dashboard Recent Activity Feed

## Overview

A unified timeline showing client, guest, admin and system actions across the site. Lives on the Admin Dashboard (`/admin`).

## Schema

**AuditLog** (extended with `actor`, `metadata`):
- `bookingId` – linked booking
- `action` – event type (e.g. `terms_accepted`, `playlist_updated`)
- `description` – human-readable summary
- `actor` – `client` | `guest` | `admin` | `system`
- `metadata` – JSON for extra context (emailSubject, amount, songTitle, etc.)
- `performedBy` – name/email of the actor when known

## Migration

Run in Supabase SQL editor:

```sql
-- supabase-activity-log-migration.sql
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "actor" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
```

## Central Helper

**`lib/activity-log.ts`** – `logActivity(options)`:

```ts
await logActivity({
  bookingId,
  action: "terms_accepted",
  description: "Client accepted T&Cs",
  actor: "client",
  performedBy: booking.name,
  metadata: { venueName: booking.venueName },
});
```

## Touchpoints Logging Activity

| Source | Action | Actor |
|--------|--------|-------|
| Contact form | `booking_request_received` | client |
| Client accept-terms | `terms_accepted` | client |
| Client music-preferences | `playlist_updated` | client |
| Guest song request | `guest_request_submitted` | guest |
| Client marked-deposit-paid | `deposit_paid` | client |
| Client final-details | `final_details_confirmed` | client |
| Client final-payment-sent | `final_payment_sent` | client |
| Client confirm-hire-request | `hire_request_confirmed` | client |
| Client portal-message | `portal_message` | client |
| Admin send-deposit-email | `email_sent` | admin |
| Admin send-portal-link | `portal_link_sent` | admin |
| Admin dispatch | `dispatched` | admin |
| Admin handoff | `handoff` | admin |
| Admin staff confirm | `artist_assigned` | admin |
| Admin staff remove | `crew_removed` | admin |
| Admin staff cancel | `crew_cancelled` | admin |
| Admin manual-override | varies | admin |
| Admin send-artist-quote | `quote_sent` | admin |
| Pushover notification fail | `notification_*_failed` | system |

## API

**GET `/api/admin/activity/?limit=50&days=14`**

Returns activity sorted by `createdAt` desc, with booking name/venue joined.

## UI

**`components/admin/RecentActivityFeed.tsx`**

- Scrollable list (max 400px)
- Grouped by day (Today, Yesterday, or date)
- Icons per action type
- Actor badges (client=blue, guest=amber, admin=gold, system=gray)
- Metadata shown when present (amount, song title, email subject)
- Relative time + exact timestamp on hover
- Click through to booking

## Seed Example Activity

```bash
npx tsx scripts/seed-example-activity.ts
```

(Requires at least one booking in the database.)
