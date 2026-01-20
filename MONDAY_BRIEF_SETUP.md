# Monday Morning Brief Setup Guide

## Overview

The Monday Morning Brief is an automated email system that scans all bookings and sends a weekly summary every Monday at 08:00 GMT to `office@stylishentertainment.co.uk`.

## What It Does

The brief identifies and categorizes actions into three color-coded sections:

### 🔴 Red Actions (Urgent)
- Events < 14 days out without final details confirmed
- Deposits not received for events < 30 days out
- DJ Worksheets not approved for events < 14 days out (if DJ service is selected)

### 🟡 Gold Actions (Client)
- Unread portal messages from clients

### 🔵 Blue Actions (Staff)
- Staff members who have responded to holds but aren't yet confirmed

## Email Template

The email uses a "Luxe" design with:
- **Playfair Display** font for headings (serif, elegant)
- **Inter** font for body text (clean, readable)
- Color-coded sections matching the action types
- Direct link buttons to each booking in the Admin Dashboard
- Professional "Concierge" tone: "Good morning Ali & Nige, here is your STYLISH briefing..."

## Safety Features

- **All Clear Email**: If there are no actions, sends a short "All Clear" message instead
- **Security**: Requires `CRON_SECRET` environment variable to prevent unauthorized access
- **Error Handling**: Logs errors but doesn't fail silently

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local` (development) and production environment:

```env
# Required: Secret for cron job security
CRON_SECRET=your-secure-random-string-here

# Optional: Override recipient email (defaults to office@stylishentertainment.co.uk)
MONDAY_BRIEF_RECIPIENT=office@stylishentertainment.co.uk

# Required: Base URL for email links
NEXT_PUBLIC_SITE_URL=https://stylishentertainment.co.uk
```

### 2. Vercel Cron (Production)

The cron job is already configured in `vercel.json`:

```json
{
  "path": "/api/cron/monday-brief",
  "schedule": "0 8 * * 1"
}
```

**Security**: Vercel automatically adds an `x-vercel-cron` header to cron requests, which the API verifies. No secret needed in the path.

**Schedule**: `0 8 * * 1` means:
- `0` - minute 0
- `8` - hour 8 (08:00)
- `*` - every day of month
- `*` - every month
- `1` - Monday (0 = Sunday, 1 = Monday, etc.)

### 3. Testing the Cron Job

#### Manual Test (Development)

You can manually trigger the brief by calling the API endpoint with the secret:

```bash
# Replace YOUR_SECRET with your actual CRON_SECRET
curl "http://localhost:4000/api/cron/monday-brief?secret=YOUR_SECRET"
```

#### Production Test (Manual)

For manual testing in production, use the secret parameter:

```bash
# Replace YOUR_SECRET and YOUR_DOMAIN
curl "https://YOUR_DOMAIN/api/cron/monday-brief?secret=YOUR_SECRET"
```

**Note**: Vercel cron jobs automatically include the `x-vercel-cron` header, so no secret is needed when called by Vercel's scheduler.

### 4. External Cron Service (Alternative)

If not using Vercel, you can set up an external cron service (e.g., cron-job.org, EasyCron):

1. **URL**: `https://stylishentertainment.co.uk/api/cron/monday-brief?secret=YOUR_SECRET`
2. **Schedule**: Every Monday at 08:00 GMT
3. **Method**: GET
4. **Headers**: None required

## How It Works

1. **Data Collection**: The `generateMondayBrief()` function scans all bookings within the next 90 days
2. **Action Identification**: Categorizes actions into Red, Gold, and Blue
3. **Email Generation**: Creates a beautiful HTML email with Playfair Display font
4. **Delivery**: Sends via your configured email service (Mailgun/Resend)

## Email Content

### With Actions

- Header with STYLISH Entertainment branding
- Greeting: "Good morning Ali & Nige, here is your STYLISH briefing for the week of [Date]"
- Color-coded sections for each action type
- Each action includes:
  - Client name and venue
  - Event date and days remaining
  - Reason for action
  - Direct link button to booking
- Summary footer with total action count

### All Clear

- Same header and greeting
- Large checkmark icon (✅)
- "All Clear" message
- Note that all bookings are on track

## Troubleshooting

### Email Not Sending

1. **Check CRON_SECRET**: Ensure it matches in both environment and URL
2. **Check Email Configuration**: Verify Mailgun/Resend is configured
3. **Check Logs**: Look for error messages in Vercel logs or server console
4. **Test Manually**: Use curl to test the endpoint directly

### Wrong Actions Showing

1. **Check Booking Status**: Only non-cancelled bookings are included
2. **Check Date Range**: Only bookings within next 90 days are scanned
3. **Check Conditions**: Review the logic in `lib/monday-brief.ts`

### Links Not Working

1. **Check NEXT_PUBLIC_SITE_URL**: Must be set correctly for email links
2. **Check Base URL**: Ensure it includes protocol (https://)

## Customization

### Change Recipient

Set `MONDAY_BRIEF_RECIPIENT` environment variable.

### Change Schedule

Update the cron schedule in `vercel.json`:
- `0 8 * * 1` = Monday 08:00 GMT
- `0 9 * * 1` = Monday 09:00 GMT
- `0 8 * * 1,3,5` = Monday, Wednesday, Friday at 08:00

### Modify Action Criteria

Edit `lib/monday-brief.ts` to change:
- Days thresholds (currently 14 and 30 days)
- Action types and conditions
- Booking filters

### Customize Email Design

Edit `lib/monday-brief-email.ts` to:
- Change colors
- Modify layout
- Update copy/tone
- Add sections

## Security Notes

- **Never commit CRON_SECRET** to git
- Use a strong, random secret (at least 32 characters)
- Rotate secrets periodically
- Monitor cron job access logs

## Support

If you encounter issues:
1. Check server logs for error messages
2. Test the endpoint manually with curl
3. Verify all environment variables are set
4. Check email service configuration

---

**Last Updated**: 2026-01-20
**Status**: ✅ Ready for Production
