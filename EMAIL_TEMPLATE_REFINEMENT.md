# Email Template System Refinement

This document explains the refined Email Template System for STYLISH ENTERTAINMENT that handles 'Locked' event data.

## Overview

The Email Template System has been enhanced to:
- Fetch and display locked event data from confirmed bookings
- Format venue addresses (handling both selected IDs and custom entries)
- Conditionally include T&C links only when terms are accepted
- Display contract data tokens in a sidebar with clear indication they're from signed contracts
- Validate event status before sending emails
- Populate templates with locked data using Mustache

## Features

### 1. Locked Event Data Fetching

**Function**: `fetchLockedEventData(bookingId: string)`

Fetches locked event details from the Booking table, including:
- Event status (locked/confirmed vs pending)
- Contract data (date, formatted venue, fee, talent type, timings)
- Booking information (client name, email, terms acceptance)

**API Route**: `GET /api/admin/bookings/[id]/locked-event-data`

Returns:
```json
{
  "isLocked": true,
  "status": "confirmed",
  "contractData": {
    "date": "Saturday, 15 June 2024",
    "formattedVenue": "Babington House, Babington, Somerset, BA3 3RW",
    "fee": "£1,200",
    "talentType": "DJ Rich",
    "eventTimings": "Arrival: 18:00 | Start: 19:00 | Finish: 00:00"
  },
  "booking": {
    "id": "...",
    "name": "Sarah & Tom",
    "email": "...",
    "termsAccepted": true,
    "termsAcceptedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Venue Formatter

**Function**: `formatVenueAddress(venue: {...})`

Formats venue addresses handling both:
- **Selected Venue IDs**: From VenueAsset table (full address format)
- **Custom Entries**: Client-entered postcode/house/road (simplified format)

Examples:
- Selected venue: "Babington House, Babington, Somerset, BA3 3RW"
- Custom entry: "123 High Street, Bath, BA1 2AB"

### 3. T&C Link Integration

**Function**: `getTCLink(termsAccepted: boolean, termsAcceptedAt: Date | null)`

Only generates `{{tc_link}}` variable if:
- `termsAccepted === true`
- `termsAcceptedAt !== null`

If terms are not accepted, the `{{tc_link}}` token is replaced with an empty string, and any `{{#tc_link}}...{{/tc_link}}` blocks are removed from the template.

### 4. Locked Variables UI

**Component**: `/admin/email-templates/[id]` (Email Template Editor)

**Sidebar Features**:
- **Contract Data Tokens** section displaying:
  - `{{contractDate}}` - Event date from contract
  - `{{formattedVenue}}` - Formatted venue address
  - `{{contractFee}}` - Fee from contract
  - `{{talentType}}` - DJ/artist name
  - `{{eventTimings}}` - Arrival/start/finish times

- **Clear Indication**: 
  - Label states "These values are pulled directly from the signed contract and cannot be changed here"
  - Each token shows its current value from the locked event data
  - Copy-to-clipboard buttons for easy insertion

- **T&C Link Status**:
  - Shows if terms are accepted with date
  - Indicates if `{{tc_link}}` will be empty

- **Standard Variables**:
  - Common variables like `{{clientName}}`, `{{eventDate}}`, etc.
  - All with copy-to-clipboard functionality

### 5. Event Status Validation

**Function**: `validateEventStatus(status: string)`

Before sending an email, validates that event status is "locked" or "confirmed".

**Warning Message**:
```
Event status is "pending" (not "Locked" or "Confirmed"). 
This email may contain preliminary data that could change. 
Proceed anyway?
```

**UI Integration**:
- Status badge shows green for locked/confirmed events
- Yellow warning badge for other statuses
- Confirmation dialog before sending if status is not locked

### 6. Template Population with Mustache

**Function**: `populateEmailTemplate(templateHtml, templateSubject, eventData)`

Uses Mustache to replace tokens in templates:

**Available Tokens**:
- **Contract Data** (Locked):
  - `{{contractDate}}` - Event date
  - `{{formattedVenue}}` - Formatted venue address
  - `{{contractFee}}` - Contract fee
  - `{{talentType}}` - DJ/artist name
  - `{{eventTimings}}` - Event timings

- **Standard Variables**:
  - `{{clientName}}` - Client name
  - `{{clientEmail}}` - Client email
  - `{{eventDate}}` - Event date (same as contractDate)
  - `{{eventType}}` - Event type (wedding, party, etc.)
  - `{{venueName}}` - Venue name
  - `{{djName}}` - DJ name
  - `{{djFee}}` - DJ fee

- **Conditional**:
  - `{{tc_link}}` - T&C link (only if terms accepted)
  - `{{#tc_link}}...{{/tc_link}}` - Conditional block (removed if terms not accepted)

**Example Template**:
```html
Hello {{clientName}},

Your celebration at {{formattedVenue}} on {{contractDate}} is confirmed.

Contract Fee: {{contractFee}}
Talent: {{talentType}}
Timings: {{eventTimings}}

{{#tc_link}}
<p><a href="{{tc_link}}">View Terms & Conditions</a></p>
{{/tc_link}}

Best regards,
Ali & Nige
```

## API Routes

### 1. Fetch Locked Event Data
**GET** `/api/admin/bookings/[id]/locked-event-data`

Returns locked event data for a booking.

### 2. Preview Template
**POST** `/api/admin/email-templates/[id]/preview`

Request:
```json
{
  "bookingId": "...",
  "templateHtml": "...",
  "templateSubject": "..."
}
```

Returns populated HTML preview.

### 3. Send Template Email
**POST** `/api/admin/email-templates/[id]/send`

Request:
```json
{
  "bookingId": "...",
  "recipientEmail": "...",
  "overrideSubject": "...",
  "overrideHtml": "..."
}
```

Returns:
```json
{
  "success": true,
  "messageId": "...",
  "populatedSubject": "...",
  "eventStatus": "confirmed",
  "contractData": {...}
}
```

**Warning Response** (if status not locked):
```json
{
  "success": false,
  "warning": "Event status is 'pending'...",
  "requiresConfirmation": true
}
```

## Usage

### 1. Navigate to Email Template Editor

1. Go to `/admin/email-templates`
2. Click "Edit & Send" on any template
3. Or navigate directly to `/admin/email-templates/[id]`

### 2. Select a Booking

1. Use the booking dropdown to select a booking
2. System automatically loads locked event data
3. Contract data tokens populate in the sidebar

### 3. Edit Template (Optional)

1. Edit subject or body HTML in the editor
2. Use copy-to-clipboard buttons to insert tokens
3. Changes are auto-saved when you click "Save Template"

### 4. Send Email

1. Verify recipient email is correct
2. System validates event status
3. If not locked, shows warning dialog
4. Confirm to send email
5. Template is populated with locked data before sending

## File Structure

```
lib/
  email-template-utils.ts          # Core utilities

app/
  api/admin/
    bookings/
      [id]/
        locked-event-data/
          route.ts                 # Fetch locked event data
    email-templates/
      [id]/
        preview/
          route.ts                 # Preview populated template
        send/
          route.ts                 # Send populated template email

  admin/
    email-templates/
      [id]/
        page.tsx                   # Email template editor with sidebar
```

## Key Functions

### `fetchLockedEventData(bookingId)`
- Joins Booking with staff assignments
- Formats venue address
- Extracts contract data (fee, talent, timings)
- Checks if event is locked/confirmed

### `formatVenueAddress(venue)`
- Handles selected venue IDs (full address)
- Handles custom entries (simplified format)
- Returns clean, formatted string

### `getTCLink(termsAccepted, termsAcceptedAt)`
- Returns T&C URL if terms accepted
- Returns null otherwise

### `populateEmailTemplate(templateHtml, templateSubject, eventData)`
- Uses Mustache to replace tokens
- Handles conditional T&C link
- Returns populated subject and HTML

### `validateEventStatus(status)`
- Checks if status is "locked" or "confirmed"
- Returns validation result with warning message

## Notes

1. **Event Status**: "locked" and "confirmed" are treated as the same - both indicate the event data is final.

2. **Venue Formatting**: The system automatically detects if a venue is from the VenueAsset table (selected ID) or a custom entry (postcode/house/road).

3. **T&C Links**: The `{{tc_link}}` token is only populated if `termsAccepted === true` in the database. Otherwise, it's replaced with an empty string and any conditional blocks are removed.

4. **Template Tokens**: All tokens use Mustache syntax: `{{variableName}}` for simple replacements, `{{#variableName}}...{{/variableName}}` for conditionals.

5. **Preview**: The preview API generates a populated HTML preview without sending the email, useful for testing templates.

6. **Validation**: The system warns (but doesn't block) if event status is not locked/confirmed, allowing admins to send emails with preliminary data if needed.

## Future Enhancements

- Add preview pane in the editor showing populated template
- Support for more complex Mustache conditionals
- Template versioning/history
- Bulk email sending with locked data
- Email template testing with sample data
