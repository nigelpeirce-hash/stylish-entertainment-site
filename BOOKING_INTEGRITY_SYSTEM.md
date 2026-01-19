# Booking Integrity System

This document explains the Booking Integrity System for STYLISH ENTERTAINMENT that ensures email consistency and data integrity.

## Overview

The Booking Integrity System:
- Generates unique booking references (SE-YYYY-ShortID format)
- Detects conflicts when the same event date and venue postcode match different emails
- Displays high-priority warnings on the Admin Dashboard
- Ensures all outgoing emails use proper threading headers (In-Reply-To, References) to keep email threads grouped

## Features

### 1. Booking Reference Generation

**Format**: `SE-YYYY-ShortID` (e.g., `SE-2024-A1B2C3`)

**Function**: `generateBookingReference()`

Generates a unique booking reference for each booking:
- `SE` - STYLISH Entertainment prefix
- `YYYY` - Current year (e.g., 2024)
- `ShortID` - 6-character alphanumeric ID (e.g., A1B2C3)

**Database**: 
- Added `bookingReference` column to Booking table
- Unique constraint ensures no duplicates
- Auto-generated when bookings are created

### 2. Conflict Detection

**Function**: `checkForBookingConflicts(incomingEmail, eventDate, venuePostcode)`

Searches for bookings with:
- Same event date (any time on that day)
- Same venue postcode (normalized and case-insensitive)

**Return Status**:
- `OK` - Same email found (likely same client)
- `CONFLICT` - Different email found (potential duplicate booking)
- `NO_MATCH` - No matching booking found

**API Route**: 
- `POST /api/admin/bookings/check-conflicts`
- `GET /api/admin/bookings/check-conflicts?email=...&eventDate=...&venuePostcode=...`

**Example Response**:
```json
{
  "status": "CONFLICT",
  "existingBooking": {
    "id": "...",
    "bookingReference": "SE-2024-A1B2C3",
    "email": "existing@example.com",
    "name": "Existing Client",
    "eventDate": "2024-06-15T00:00:00Z",
    "venueName": "Babington House",
    "venuePostcode": "BA3 3RW"
  }
}
```

### 3. Admin Dashboard Warning Banner

**Component**: `BookingIntegrityWarning`

**Features**:
- High-priority red warning banner at top of admin dashboard
- Automatically polls for conflicts every 30 seconds
- Shows conflicts for recent bookings (last 30 days)
- Displays:
  - Warning message with conflicting email
  - Existing booking details (name, email, date, venue)
  - Booking reference
  - Actions:
    - "View Existing Booking" - Opens booking detail page
    - "Merge Records" - Triggers merge action
    - "Dismiss" - Hides warning for that conflict

**Styling**:
- Red background with pulsing alert icon
- Fixed position at top of page (z-index: 50)
- Animated entrance/exit with Framer Motion
- Responsive design for mobile/tablet

**Example Warning**:
```
⚠️ Data Integrity Warning
Warning: This event details match an existing booking under a different email 
(existing@example.com). Merge records?

Existing Booking:
  Name: Existing Client
  Email: existing@example.com
  Date: Saturday, 15 June 2024
  Venue: Babington House, BA3 3RW
  Ref: SE-2024-A1B2C3
```

### 4. Email Threading Headers

**Function**: `getThreadingHeaders(bookingReference, parentMessageId?)`

Generates proper email threading headers:
- **In-Reply-To**: Parent message ID (if replying)
- **References**: Thread starter message ID (mapped to booking reference)

**Message ID Format**: `<SE-YYYY-ShortID@stylishentertainment.co.uk>`

**Implementation**:
All outgoing emails now include threading headers:
- Template emails (`/api/admin/email-templates/[id]/send`)
- Resource emails (`/api/admin/send-resource`)
- DJ dispatch emails (`/api/admin/bookings/[id]/dispatch`)
- Contact form autoresponder (planned)

**Benefits**:
- All emails for a booking thread together in client inbox
- Clients can easily find all communication for their event
- Professional email threading behavior

## Database Changes

### Prisma Schema Updates

```prisma
model Booking {
  // ... existing fields ...
  
  // Booking Reference (for email threading and conflict detection)
  bookingReference  String?  @unique // Format: SE-YYYY-ShortID (e.g., SE-2024-A1B2C3)
  
  // ... rest of fields ...
  
  @@index([bookingReference])
  @@index([eventDate, venuePostcode])
}
```

### SQL Migration

**File**: `supabase-booking-integrity-migration.sql`

Includes:
- `booking_reference` column with unique constraint
- Indexes for performance:
  - `booking_reference` index
  - Composite index on `eventDate, venuePostcode`
  - Email index for faster conflict checks
- PostgreSQL function for generating booking references (optional)

## API Routes

### 1. Check Conflicts

**POST** `/api/admin/bookings/check-conflicts`

**GET** `/api/admin/bookings/check-conflicts?email=...&eventDate=...&venuePostcode=...`

**Request**:
```json
{
  "email": "client@example.com",
  "eventDate": "2024-06-15T00:00:00Z",
  "venuePostcode": "BA3 3RW"
}
```

**Response**:
```json
{
  "success": true,
  "status": "CONFLICT" | "OK" | "NO_MATCH",
  "existingBooking": {
    "id": "...",
    "bookingReference": "SE-2024-A1B2C3",
    "email": "...",
    "name": "...",
    "eventDate": "...",
    "venueName": "...",
    "venuePostcode": "..."
  }
}
```

## Usage

### 1. Automatic Conflict Detection

When a booking is created via contact form:
1. System checks for conflicts before creating booking
2. If conflict found, booking is still created but response includes warning
3. Admin dashboard automatically detects and displays warning banner

### 2. Manual Conflict Check

Admins can manually check for conflicts:
1. Go to `/admin/bookings/check-conflicts`
2. Enter email, event date, and venue postcode
3. System returns conflict status

### 3. Booking Reference

- Automatically generated when booking is created
- Used for all email threading
- Displayed in admin UI and booking details
- Can be manually referenced in communications

### 4. Email Threading

All outgoing emails automatically:
1. Check if booking has a reference
2. Generate reference if missing
3. Add In-Reply-To and References headers
4. Thread properly in client inbox

## Files Created/Modified

### New Files

1. `lib/booking-integrity.ts` - Core utilities
2. `app/api/admin/bookings/check-conflicts/route.ts` - Conflict check API
3. `components/BookingIntegrityWarning.tsx` - Warning banner component
4. `supabase-booking-integrity-migration.sql` - Database migration
5. `BOOKING_INTEGRITY_SYSTEM.md` - This documentation

### Modified Files

1. `prisma/schema.prisma` - Added bookingReference field and indexes
2. `app/api/contact/route.ts` - Added conflict checking and reference generation
3. `app/api/admin/email-templates/[id]/send/route.ts` - Added threading headers
4. `app/api/admin/send-resource/route.ts` - Added threading headers
5. `app/api/admin/bookings/[id]/dispatch/route.ts` - Added threading headers
6. `app/admin/page.tsx` - Added BookingIntegrityWarning component

## Key Functions

### `generateBookingReference()`
Generates unique booking reference in SE-YYYY-ShortID format.

### `checkForBookingConflicts(email, eventDate, venuePostcode)`
Checks for bookings with same date and postcode, returns conflict status.

### `ensureBookingReference(bookingId)`
Ensures booking has a reference, generates one if missing.

### `getThreadingHeaders(bookingReference, parentMessageId?)`
Generates In-Reply-To and References headers for email threading.

### `generateMessageId(bookingReference)`
Generates message ID from booking reference for email threading.

## Notes

1. **Conflict Detection**: Only checks for conflicts when venue postcode is provided. Without postcode, system cannot reliably detect conflicts.

2. **Email Threading**: All emails for a booking use the same message ID pattern (`<SE-YYYY-ShortID@stylishentertainment.co.uk>`), ensuring proper threading.

3. **Reference Generation**: Uses cryptographically secure random bytes to generate short IDs, ensuring uniqueness.

4. **Performance**: Indexes on `eventDate` and `venuePostcode` ensure fast conflict checks even with many bookings.

5. **Admin Dashboard**: Warning banner only shows for recent bookings (last 30 days) to avoid clutter. Admins can dismiss warnings for known conflicts.

6. **Threading Headers**: If a parent message ID is provided (e.g., when replying), the In-Reply-To header is set to that message ID. Otherwise, References header points to the booking reference message ID.

## Future Enhancements

- Add merge booking functionality
- Bulk conflict detection for multiple bookings
- Email threading visualization in admin dashboard
- Conflict resolution workflow
- Automatic duplicate detection on booking creation
- Email thread grouping in admin inbox
