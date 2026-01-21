# Pushover Notification System Setup

## Overview

The STYLISH ENTERTAINMENT admin notification system sends mobile push notifications via Pushover API when:
- **New leads** are created (notifies both Ali and Nigel)
- **Hand-offs** occur (notifies Ali when Nigel passes a booking)

## Setup Instructions

### 1. Get Pushover Account & API Key

1. Go to https://pushover.net/
2. Create an account (or sign in)
3. Go to **Your Applications** → **Create an Application**
4. Name it: "STYLISH ENTERTAINMENT"
5. Copy the **API Token/Key** (this is your `PUSHOVER_API_KEY`)

### 2. Get User Keys for Ali and Nigel

1. Each person needs a Pushover account
2. After signing up, go to **Your User Key**
3. Copy the **User Key** for each person
4. This is the `push_user_key` that goes in the `Staff_Settings` table

### 3. Configure Staff Settings in Database

Run this SQL in Supabase to set up Ali and Nigel's push keys:

```sql
-- Update Ali's push key (replace with her actual Pushover user key)
-- Note: Column names use camelCase to match Prisma schema
UPDATE "Staff_Settings" 
SET "pushUserKey" = 'YOUR_ALI_PUSHOVER_USER_KEY',
    "notificationEnabled" = true
WHERE name = 'Ali';

-- Update Nigel's push key (replace with his actual Pushover user key)
UPDATE "Staff_Settings" 
SET "pushUserKey" = 'YOUR_NIGEL_PUSHOVER_USER_KEY',
    "notificationEnabled" = true
WHERE name = 'Nigel';
```

**Important**: The column names use **camelCase** (`pushUserKey`, `notificationEnabled`) because Prisma uses camelCase. Make sure to use double quotes around the column names in SQL.

### 4. Set Environment Variable

Add to your `.env.local` (development) or hosting platform (production):

```env
PUSHOVER_API_KEY=your_pushover_api_key_here
```

### 5. Install Pushover App

- **iOS**: Download from App Store
- **Android**: Download from Google Play
- Sign in with the same account used to get the User Key

## How It Works

### New Lead Notifications

When a new enquiry is saved to the `Booking` table:
- ✅ Fetches push keys for both Ali and Nigel from `Staff_Settings`
- ✅ Sends notification to both phones
- ✅ Title: `🆕 New Lead: [Client Name]`
- ✅ Message: `[Event Date] at [Venue Name]. Click to view.`
- ✅ Includes deep link to booking detail page

### Hand-off Notifications

When Nigel clicks "🙋‍♀️ For Ali" button:
- ✅ Sends notification only to Ali's phone
- ✅ Title: `📋 Booking Hand-off`
- ✅ Message: `Nigel passed you a booking: [Client Name]`
- ✅ Includes deep link to booking detail page

## Error Handling

- ✅ If notification fails, error is logged to `AuditLog` table
- ✅ Booking creation/handoff still succeeds (notifications don't block operations)
- ✅ Errors are logged with action: `notification_new_lead_failed` or `notification_handoff_failed`

## Testing

### Test New Lead Notification

1. Submit a contact form
2. Check both phones for push notification
3. Click notification to verify deep link works

### Test Hand-off Notification

1. Open a booking in admin dashboard
2. Click "🙋‍♀️ For Ali" button (as Nigel)
3. Check Ali's phone for push notification
4. Click notification to verify deep link works

## Troubleshooting

### No notifications received

1. **Check environment variable**: Verify `PUSHOVER_API_KEY` is set
2. **Check Staff_Settings**: Verify `pushUserKey` (camelCase) is set for Ali/Nigel
3. **Check notificationEnabled**: Should be `true` in database (camelCase column name)
4. **Check Audit Log**: Look for `notification_*_failed` entries
5. **Check Pushover account**: Verify accounts are active and app is installed

### Notifications work but deep links don't

1. Verify `NEXT_PUBLIC_SITE_URL` is set correctly
2. Check that the URL format is correct (https://stylishentertainment.co.uk)
3. Test the booking URL manually in browser

### Only one person receives notifications

1. Check that both have `pushUserKey` (camelCase) set in `Staff_Settings`
2. Verify both have `notificationEnabled = true` (camelCase column name)
3. Check Audit Log for specific error messages

## Notification Priority

- **New Leads**: Priority 1 (High) - Requires acknowledgment
- **Hand-offs**: Priority 1 (High) - Requires acknowledgment

## Cost

Pushover is **free** for up to 7,500 messages per month per user. After that, it's $4.99/month per user.

---

**Last Updated:** January 2026
