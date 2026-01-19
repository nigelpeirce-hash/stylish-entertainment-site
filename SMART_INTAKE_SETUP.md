# Smart Intake & Conflict Detection System Setup Guide

## Overview

The Smart Intake & Conflict Detection system automatically processes new inquiries, detects potential booking conflicts (same date + postcode), sends automated emails, and triggers mobile notifications.

## Features

### 1. **Public Inquiry Form**
- Simple form at `/new-inquiry`
- Captures: Name, Email, Phone (optional), Event Date, Venue Postcode
- Validates required fields
- Shows success/error messages

### 2. **Automated First Touch Email**
- Sent immediately upon submission
- Personal message: "Hi [Name], thanks for reaching out about [Date]!"
- Confirms inquiry received and checking availability
- Uses Resend API

### 3. **Conflict Detection Engine**
- Automatically checks for matching **Date + Postcode** in existing bookings
- Flags enquiries as `isConflict: true` if match found
- Links to original booking via `originalBookingId`
- Records conflict detection timestamp

### 4. **New Enquiries Dashboard**
- Accessible at `/admin/new-enquiries`
- Prominent amber/red warning banner for conflicts
- Displays all new enquiries
- Shows conflict details with link to original booking
- Quick "Review" buttons

### 5. **Mobile Notifications**
- Supports Pushover, Slack, or generic webhooks
- Sends alert when new enquiry arrives
- High priority for conflicts
- Includes deep link to enquiry detail page

## Database Schema

### NewEnquiry Model

```prisma
model NewEnquiry {
  id                String   @id @default(cuid())
  name              String
  email             String
  phoneAreaCode     String?
  phoneNumber       String?
  eventDate         DateTime
  venuePostcode     String
  venueName         String?
  
  // Conflict Detection
  isConflict        Boolean  @default(false)
  originalBookingId String?
  originalBooking   Booking? @relation("ConflictBooking", ...)
  conflictDetectedAt DateTime?
  conflictResolved  Boolean  @default(false)
  
  // Processing Status
  status            String   @default("new") // "new", "reviewed", "converted", "rejected"
  reviewedAt        DateTime?
  reviewedBy        String?
  
  // Email & Notification Tracking
  firstTouchEmailSent Boolean @default(false)
  firstTouchEmailSentAt DateTime?
  notificationSent  Boolean  @default(false)
  notificationSentAt DateTime?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([eventDate, venuePostcode]) // For conflict detection
  @@index([isConflict])
  @@index([status])
}
```

## Setup Instructions

### 1. Database Migration

Run Prisma migration:

```bash
npx prisma migrate dev --name add_new_enquiry_model
```

Or if using Supabase directly:

```sql
-- Create NewEnquiry table
CREATE TABLE IF NOT EXISTS "NewEnquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneAreaCode" TEXT,
    "phoneNumber" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "venuePostcode" TEXT NOT NULL,
    "venueName" TEXT,
    "isConflict" BOOLEAN NOT NULL DEFAULT false,
    "originalBookingId" TEXT,
    "conflictDetectedAt" TIMESTAMP(3),
    "conflictResolved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "firstTouchEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "firstTouchEmailSentAt" TIMESTAMP(3),
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewEnquiry_pkey" PRIMARY KEY ("id")
);

-- Add foreign key
ALTER TABLE "NewEnquiry" ADD CONSTRAINT "NewEnquiry_originalBookingId_fkey" 
    FOREIGN KEY ("originalBookingId") REFERENCES "Booking"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS "NewEnquiry_eventDate_venuePostcode_idx" 
    ON "NewEnquiry"("eventDate", "venuePostcode");
CREATE INDEX IF NOT EXISTS "NewEnquiry_isConflict_idx" 
    ON "NewEnquiry"("isConflict");
CREATE INDEX IF NOT EXISTS "NewEnquiry_status_idx" 
    ON "NewEnquiry"("status");
```

### 2. Environment Variables

Add to `.env.local`:

```env
# Resend (for automated emails)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@stylishentertainment.co.uk

# App URL (for deep links)
NEXT_PUBLIC_APP_URL=https://stylishentertainment.co.uk

# Mobile Notifications (optional)
# Pushover
MOBILE_NOTIFICATION_TYPE=pushover
PUSHOVER_API_TOKEN=your_pushover_api_token
PUSHOVER_USER_KEY=your_pushover_user_key

# OR Slack
MOBILE_NOTIFICATION_TYPE=slack
MOBILE_NOTIFICATION_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# OR Generic Webhook
MOBILE_NOTIFICATION_TYPE=webhook
MOBILE_NOTIFICATION_WEBHOOK_URL=https://your-webhook-url.com/notify
```

### 3. Access Routes

**Public Form:**
- `/new-inquiry` - Submit new inquiry

**Admin Dashboard:**
- `/admin/new-enquiries` - View all new enquiries
- `/admin/new-enquiries/[id]` - View enquiry detail

## API Routes

### `POST /api/inquiries/new`
Processes new inquiry submission:
- Validates input
- Detects conflicts (Date + Postcode)
- Sends first touch email
- Sends mobile notification
- Returns enquiry ID and conflict status

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneAreaCode": "+44",
  "phoneNumber": "1234567890",
  "eventDate": "2024-12-31",
  "venuePostcode": "SW1A1AA"
}
```

### `GET /api/admin/new-enquiries`
Fetches all new enquiries for dashboard.

### `GET /api/admin/new-enquiries/[id]`
Fetches single enquiry details.

### `PATCH /api/admin/new-enquiries/[id]/review`
Marks enquiry as reviewed.

### `POST /api/admin/new-enquiries/[id]/convert`
Converts enquiry to booking.

## Conflict Detection Logic

The system checks for conflicts using:
1. **Exact Date Match**: Same event date
2. **Postcode Match**: Normalized postcode (uppercase, no spaces)
3. **Status Filter**: Excludes cancelled bookings

If match found:
- Sets `isConflict: true`
- Links `originalBookingId`
- Records `conflictDetectedAt` timestamp
- Sends high-priority mobile notification

## Mobile Notification Setup

### Pushover Setup
1. Sign up at [pushover.net](https://pushover.net)
2. Get API token from your application
3. Get your user key
4. Add to environment variables
5. Notifications will include deep link to enquiry

### Slack Setup
1. Create Slack webhook in your workspace
2. Add webhook URL to environment variables
3. Set `MOBILE_NOTIFICATION_TYPE=slack`
4. Notifications will include button to view enquiry

### Generic Webhook
1. Set `MOBILE_NOTIFICATION_TYPE=webhook`
2. Add your webhook URL
3. System will POST JSON payload:
```json
{
  "message": "New Inquiry: John Doe - 31 Dec 2024 at SW1A1AA",
  "title": "📧 New Inquiry",
  "url": "https://yourapp.com/admin/new-enquiries/123",
  "priority": 0
}
```

## Usage

### For Clients
1. Visit `/new-inquiry`
2. Fill out form (Name, Email, Event Date, Venue Postcode)
3. Submit inquiry
4. Receive immediate confirmation email
5. Wait for response from team

### For Admins
1. Receive mobile notification when new enquiry arrives
2. Click deep link to view enquiry
3. Review conflict warnings if present
4. Convert to booking or mark as reviewed
5. Handle conflicts by reviewing original booking

## Troubleshooting

### Emails not sending
- Verify `RESEND_API_KEY` is set
- Check `RESEND_FROM_EMAIL` is valid
- Review Resend dashboard for errors

### Notifications not arriving
- Verify webhook URL is correct
- Check notification type matches service
- For Pushover: verify API token and user key

### Conflicts not detecting
- Check date format matches exactly
- Verify postcode normalization (uppercase, no spaces)
- Review database indexes are created

## Next Steps

1. Run database migration
2. Set environment variables
3. Test inquiry submission
4. Verify email delivery
5. Configure mobile notifications
6. Test conflict detection with duplicate dates

The system is ready to automatically process and flag potential booking conflicts!
