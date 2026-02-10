# Email Automation Suite - Documentation

## ✅ What's Been Built

### 1. **Email Journey Templates**
We have 6 email templates ready for automation:

1. **Enquiry Auto-Responder** ✅ (Already automated - sends immediately on contact form submit)
2. **Gentle Reminder** ✅ (NEW - 3-day follow-up after initial enquiry)
3. **Booking Confirmation** (Manual send after deposit)
4. **4-Week Check-in** (Automated - 4 weeks before event)
5. **Week-of Excitement** (Automated - 7 days before event)
6. **Post-Wedding Magic** (Automated - 3 days after event)

### 2. **Automated Email Cron Job**

**Endpoint:** `/api/cron/email-journey`

This endpoint automatically sends journey emails based on triggers:

#### **Triggers:**
- **3-Day Reminder**: Sent 3 days after enquiry autoresponder if booking status is still "pending" or "inquiry"
- **4-Week Check-in**: Sent 28 days before event date (for confirmed bookings)
- **Week-of Excitement**: Sent 7 days before event date
- **Post-Wedding Magic**: Sent 3 days after event date

#### **How It Works:**
1. Runs daily at 9:00 AM (via Vercel Cron)
2. Queries database for bookings matching trigger conditions
3. Checks if email has already been sent (via `emailsSent` JSON field)
4. Sends email via Resend API
5. Updates `emailsSent` JSON to prevent duplicate sends
6. Logs all activity

### 3. **Email Tracking**

All emails are tracked in the `Booking.emailsSent` JSON field:

```json
{
  "enquiryAutoresponder": { "sentAt": "2024-01-15T10:00:00Z", "messageId": "..." },
  "gentleReminder": { "sentAt": "2024-01-18T09:00:00Z", "messageId": "..." },
  "fourWeekCheckin": { "sentAt": "2024-02-15T09:00:00Z", "messageId": "..." },
  "weekOfExcitement": { "sentAt": "2024-03-01T09:00:00Z", "messageId": "..." },
  "postWeddingMagic": { "sentAt": "2024-03-10T09:00:00Z", "messageId": "..." }
}
```

## 🚀 Setup Instructions

### 1. **Vercel Cron (Recommended)**

The `vercel.json` file is already configured:

```json
{
  "crons": [
    {
      "path": "/api/cron/email-journey",
      "schedule": "0 9 * * *"
    }
  ]
}
```

This runs the automation **daily at 9:00 AM**.

**On Vercel:**
- Cron jobs are automatically enabled when `vercel.json` is detected
- No additional setup required

### 2. **Alternative: External Cron Service**

If not using Vercel, set up an external cron service (e.g., cron-job.org, EasyCron) to call:

```
GET https://stylishentertainment.co.uk/api/cron/email-journey
```

**Security:** Add `CRON_SECRET` to your environment variables and include it in the Authorization header:
```
Authorization: Bearer YOUR_CRON_SECRET
```

### 3. **Manual Trigger (Testing)**

You can manually trigger the automation for testing:

```bash
curl https://stylishentertainment.co.uk/api/cron/email-journey
```

Or visit the URL in your browser (will require authentication if `CRON_SECRET` is set).

## 📋 Email Journey Flow

```
1. Contact Form Submitted
   └─> Enquiry Auto-Responder sent immediately ✅

2. 3 Days Later (if no booking confirmed)
   └─> Gentle Reminder sent automatically 🤖

3. Booking Confirmed (Manual)
   └─> Booking Confirmation email (manual send)

4. 4 Weeks Before Event
   └─> 4-Week Check-in sent automatically 🤖

5. 1 Week Before Event
   └─> Week-of Excitement sent automatically 🤖

6. 3 Days After Event
   └─> Post-Wedding Magic sent automatically 🤖
```

## 🔒 Security

The cron endpoint is protected by:
- Optional `CRON_SECRET` environment variable
- If set, requests must include: `Authorization: Bearer CRON_SECRET`

**Recommendation:** Set `CRON_SECRET` in production for security.

## 📊 Monitoring

The cron endpoint returns a summary:

```json
{
  "success": true,
  "timestamp": "2024-01-15T09:00:00Z",
  "results": {
    "processed": 5,
    "sent": 3,
    "skipped": 2,
    "errors": []
  },
  "summary": {
    "3-day-reminders": 1,
    "4-week-checkins": 1,
    "week-of-excitement": 0,
    "post-wedding": 1
  }
}
```

## ⚠️ Important Notes

1. **Booking Records Required**: The automation only works on bookings in the database. Contact form submissions don't automatically create bookings - bookings are created separately through your booking system.

2. **Email Tracking**: Emails are tracked in `emailsSent` JSON to prevent duplicates. Once sent, an email won't be sent again automatically.

3. **Status Checks**: 
   - 3-day reminders only sent if booking status is "pending" or "inquiry"
   - 4-week check-in requires "confirmed" or "pending" status
   - Week-of and post-wedding emails work with "confirmed" or "completed" status

4. **Time Zone**: Cron runs at 9:00 AM server time. Adjust `vercel.json` schedule if needed.

## 🎨 Email Templates

All templates use:
- ✅ Luxe Gatsby branding (white background, champagne-gold dividers)
- ✅ British English spelling
- ✅ Responsive HTML design
- ✅ Centralized email config (`office@stylishentertainment.co.uk`)

## 📝 Customisation

To modify email timing:
- Edit `app/api/cron/email-journey/route.ts`
- Change the date calculations (e.g., `setDate(threeDaysAgo.getDate() - 3)`)

To modify email content:
- Edit `lib/email-journey-templates.ts`
- All templates follow the same structure and branding

---

**Status:** ✅ Ready for deployment. The automation will start running once deployed to Vercel with cron enabled.
