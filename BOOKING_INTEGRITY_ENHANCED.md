# Booking Integrity & Email Threading - Enhanced Module

This document explains the enhanced Booking Integrity & Email Threading module for STYLISH ENTERTAINMENT with fingerprint checks, fuzzy matching, conflict resolution UI, and admin notifications.

## Overview

The enhanced system includes:
- **Fingerprint Check**: Core function `findExistingBooking(date, postcode)` for exact matching
- **Enhanced Conflict Detection**: 
  - `POTENTIAL_DUPLICATE`: Date + Postcode match but different Email
  - `NAME_MATCH_WARNING`: Name similar (fuzzy match) but different Postcode
- **Conflict Resolution UI**: Side-by-side comparison with merge/keep separate actions
- **Authorized Senders**: Array of emails authorized for each booking
- **Email Threading**: Thread-ID footer in all emails for inbound threading
- **Admin Notifications**: Badge showing unresolved conflict count

## Features

### 1. Fingerprint Check

**Function**: `findExistingBooking(eventDate, venuePostcode)`

Core fingerprint check that searches for bookings with:
- Same event date (any time on that day)
- Same venue postcode (normalized and case-insensitive)

Returns the first matching booking with full details including `authorizedSenders` array.

### 2. Enhanced Conflict Detection

**Function**: `checkForBookingConflicts(incomingEmail, incomingName, eventDate, venuePostcode)`

**Conflict Types**:

#### POTENTIAL_DUPLICATE
- **Trigger**: Date + Postcode match an existing booking
- **Condition**: Incoming email is NOT in authorized senders list
- **Action**: Shows conflict resolver UI

#### NAME_MATCH_WARNING
- **Trigger**: Name similarity > 70% (fuzzy match)
- **Condition**: Same event date but different postcode
- **Action**: Shows conflict resolver UI with similarity score

#### OK
- **Condition**: Same email or email in authorized senders
- **Action**: No conflict, proceed normally

**Fuzzy Matching**: Uses Fuse.js with 0.6 threshold (60% similarity required, displayed as 70%+ match)

### 3. Conflict Resolution UI

**Component**: `ConflictResolver.tsx`

**Features**:
- **Side-by-Side Comparison**: 
  - Left: Existing Booking (blue theme)
  - Right: New Incoming Data (yellow theme)
- **Displays**:
  - Name, Email, Event Date
  - Venue Name & Postcode
  - Phone, Event Type
  - Booking Reference (existing only)
  - Authorized Senders list (existing only)
  - Name Similarity Score (if applicable)

**Actions**:

1. **Link Email to Booking**:
   - Adds new email to `authorizedSenders` array
   - Marks existing booking conflict as "resolved"
   - Marks new booking as "merged" and cancels it
   - Both bookings can now receive emails for the same event

2. **Keep Separate**:
   - Marks new booking conflict as "kept_separate"
   - Acknowledges these are different events
   - Both bookings remain active and separate

**API Routes**:
- `POST /api/admin/bookings/[id]/link-email` - Link email to existing booking
- `POST /api/admin/bookings/[id]/resolve-conflict` - Mark as kept separate

### 4. Authorized Senders Array

**Database**: `authorizedSenders` field (String array)

**Purpose**: Allows multiple email addresses to send/receive for the same booking

**Use Cases**:
- Couple uses different emails (bride/groom)
- Corporate events with multiple contacts
- Venue coordinators added to booking

**Logic**:
- Primary email is always authorized
- Additional emails added via "Link Email" action
- All emails in array can receive booking-related emails
- Conflict detection checks both primary and authorized emails

### 5. Email Threading (Inbound)

**Thread-ID Footer**: Invisible HTML footer added to all outgoing emails

**Format**:
```html
<div style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; font-size: 0; line-height: 0; overflow: hidden;">
  Thread-ID: SE-2024-A1B2C3
  Booking-Reference: SE-2024-A1B2C3
</div>
```

**Benefits**:
- Email clients can thread emails by Thread-ID
- Hidden from users but visible to email systems
- Allows inbound email matching to bookings
- Maintains thread grouping even if headers are lost

**Implementation**:
- Added to all email sending functions:
  - Template emails (`/api/admin/email-templates/[id]/send`)
  - Resource emails (`/api/admin/send-resource`)
  - DJ dispatch emails (`/api/admin/bookings/[id]/dispatch`)
- Generated via `generateThreadIdFooter(bookingReference)`

### 6. Admin Notification Badge

**Component**: `ConflictCountBadge.tsx`

**Features**:
- Floating badge in bottom-right corner of admin dashboard
- Shows count of unresolved conflicts (`conflictStatus = "pending"`)
- Updates every 30 seconds
- Clickable - links to `/admin/bookings?filter=conflicts`
- Red background with pulsing animation when count > 0
- Hidden when count = 0

**API Route**: `GET /api/admin/bookings/conflicts/count`

**Styling**:
- Fixed position (bottom: 24px, right: 24px)
- z-index: 50 (above content)
- Responsive design
- Hover animation (scale up)

## Database Schema

### New Fields

```prisma
model Booking {
  // ... existing fields ...
  
  // Authorized Email Senders (for conflict resolution)
  authorizedSenders String[] // Array of email addresses authorized for this booking
  
  // Conflict Resolution
  conflictStatus    String?  // "pending", "resolved", "merged", "kept_separate"
  conflictResolvedAt DateTime?
  
  // ... rest of fields ...
}
```

### Indexes

```sql
CREATE INDEX "Booking_conflictStatus_idx" ON "Booking"("conflictStatus");
```

## API Routes

### 1. Link Email to Booking

**POST** `/api/admin/bookings/[id]/link-email`

**Request**:
```json
{
  "newEmail": "new@example.com",
  "newBookingId": "new_booking_id"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email linked successfully",
  "authorizedSenders": ["original@example.com", "new@example.com"]
}
```

**Action**:
- Adds `newEmail` to `authorizedSenders` array
- Marks existing booking conflict as "resolved"
- Marks new booking as "merged" and cancels it

### 2. Resolve Conflict (Keep Separate)

**POST** `/api/admin/bookings/[id]/resolve-conflict`

**Request**:
```json
{
  "action": "keep_separate"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Conflict resolved - booking kept separate"
}
```

**Action**:
- Marks booking conflict as "kept_separate"
- Updates `conflictResolvedAt` timestamp

### 3. Get Conflict Count

**GET** `/api/admin/bookings/conflicts/count`

**Response**:
```json
{
  "success": true,
  "count": 3
}
```

### 4. Enhanced Conflict Check

**POST/GET** `/api/admin/bookings/check-conflicts`

**Request**:
```json
{
  "email": "client@example.com",
  "name": "Sarah & Tom",
  "eventDate": "2024-06-15T00:00:00Z",
  "venuePostcode": "BA3 3RW"
}
```

**Response**:
```json
{
  "success": true,
  "status": "POTENTIAL_DUPLICATE" | "NAME_MATCH_WARNING" | "OK" | "NO_MATCH",
  "existingBooking": {
    "id": "...",
    "bookingReference": "SE-2024-A1B2C3",
    "email": "...",
    "name": "...",
    "authorizedSenders": ["..."]
  },
  "nameSimilarity": 0.85
}
```

## Component Architecture

### ConflictResolver.tsx

**Props**:
- `conflictStatus`: "POTENTIAL_DUPLICATE" | "NAME_MATCH_WARNING"
- `existingBooking`: Full existing booking details
- `newBooking`: New incoming booking data
- `newBookingId`: Optional ID of new booking
- `nameSimilarity`: Optional similarity score (0-1)
- `onResolve`: Callback when conflict resolved
- `onDismiss`: Callback to dismiss warning

**Layout**:
- Two-column grid (left: existing, right: new)
- Color-coded (blue for existing, yellow for new)
- Action buttons at bottom
- Success message after resolution

### BookingIntegrityWarning.tsx

**Updates**:
- Now uses `ConflictResolver` component
- Fetches conflicts with name parameter
- Handles both POTENTIAL_DUPLICATE and NAME_MATCH_WARNING
- Shows similarity score if available

### ConflictCountBadge.tsx

**New Component**:
- Floating badge in bottom-right
- Shows unresolved conflict count
- Auto-updates every 30 seconds
- Links to filtered bookings page

## Email Threading Implementation

### Headers

All outgoing emails include:
- **In-Reply-To**: Parent message ID (if replying)
- **References**: Thread starter message ID
- **Thread-ID**: Booking reference (custom header)

### Footer

All email HTML includes invisible Thread-ID footer:
```html
<div style="display: none !important; ...">
  Thread-ID: SE-2024-A1B2C3
  Booking-Reference: SE-2024-A1B2C3
</div>
```

**Benefits**:
- Inbound email parsing can match by Thread-ID
- Email clients thread properly
- Maintains thread context even if headers lost
- Hidden from users but machine-readable

## Usage Flow

### 1. Booking Creation (Contact Form)

1. User submits contact form
2. System checks for conflicts using `checkForBookingConflicts()`
3. If conflict found:
   - Booking created with `conflictStatus = "pending"`
   - Response includes conflict warning
   - Admin dashboard shows conflict badge
4. If no conflict:
   - Booking created normally
   - Booking reference generated

### 2. Admin Conflict Resolution

1. Admin sees conflict badge (if conflicts exist)
2. Clicks badge → filters bookings to conflicts
3. Or sees `BookingIntegrityWarning` banner on dashboard
4. Clicks conflict → `ConflictResolver` modal appears
5. Reviews side-by-side comparison
6. Chooses action:
   - **Link Email**: Adds email to authorized senders
   - **Keep Separate**: Marks as different event
7. Conflict resolved → Badge count decreases

### 3. Email Threading

1. Email sent with booking reference
2. Thread-ID footer added to HTML
3. In-Reply-To/References headers set
4. Client receives email with threading metadata
5. Future emails for same booking thread together
6. Inbound emails can match by Thread-ID

## Files Created/Modified

### New Files:
1. `components/ConflictResolver.tsx` - Conflict resolution UI
2. `components/ConflictCountBadge.tsx` - Admin notification badge
3. `app/api/admin/bookings/[id]/link-email/route.ts` - Link email API
4. `app/api/admin/bookings/[id]/resolve-conflict/route.ts` - Resolve conflict API
5. `app/api/admin/bookings/conflicts/count/route.ts` - Conflict count API
6. `supabase-booking-integrity-enhancement-migration.sql` - Database migration
7. `BOOKING_INTEGRITY_ENHANCED.md` - This documentation

### Modified Files:
1. `lib/booking-integrity.ts` - Enhanced with fingerprint check, fuzzy matching
2. `components/BookingIntegrityWarning.tsx` - Now uses ConflictResolver
3. `app/admin/page.tsx` - Added ConflictCountBadge
4. `app/api/contact/route.ts` - Enhanced conflict detection with name
5. `app/api/admin/bookings/check-conflicts/route.ts` - Enhanced with name parameter
6. `app/api/admin/email-templates/[id]/send/route.ts` - Added Thread-ID footer
7. `app/api/admin/send-resource/route.ts` - Added Thread-ID footer
8. `app/api/admin/bookings/[id]/dispatch/route.ts` - Added Thread-ID footer
9. `lib/email-template-utils.ts` - Added bookingReference to template variables
10. `prisma/schema.prisma` - Added authorizedSenders, conflictStatus, conflictResolvedAt

## Key Functions

### `findExistingBooking(date, postcode)`
Core fingerprint check - finds booking by exact date + postcode match.

### `checkForBookingConflicts(email, name, date, postcode)`
Enhanced conflict detection with fuzzy name matching.

### `fuzzyMatchNames(name1, name2)`
Fuse.js-based name similarity scoring (0-1 scale).

### `getUnresolvedConflictsCount()`
Returns count of bookings with `conflictStatus = "pending"`.

### `generateThreadIdFooter(bookingReference)`
Generates invisible HTML footer with Thread-ID for email threading.

### `getThreadingHeaders(bookingReference, parentMessageId?)`
Generates In-Reply-To, References, and Thread-ID headers.

## Notes

1. **Fuzzy Matching**: Uses Fuse.js with 0.6 threshold. Names with 70%+ similarity trigger warnings.

2. **Authorized Senders**: Primary email is always authorized. Additional emails must be explicitly linked.

3. **Thread-ID Footer**: Invisible to users but machine-readable. Email clients and inbound parsers can use it.

4. **Conflict Resolution**: Once resolved, conflicts don't reappear. Admins can still manually link emails later.

5. **Performance**: Conflict checks only run on recent bookings (last 30 days) to avoid performance issues.

6. **Email Threading**: All emails for a booking share the same Thread-ID, ensuring proper threading even if headers are lost.

## Next Steps

1. Run database migration:
   ```sql
   -- Run supabase-booking-integrity-enhancement-migration.sql
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Test conflict detection:
   - Create booking with same date + postcode, different email
   - Verify conflict badge appears
   - Test "Link Email" action
   - Test "Keep Separate" action

4. Verify email threading:
   - Send emails from system
   - Check email source for Thread-ID footer
   - Verify emails thread in client inbox

The enhanced Booking Integrity & Email Threading module is now complete!
