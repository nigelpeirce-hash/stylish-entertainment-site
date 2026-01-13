# Email Automation Setup Guide

## Overview

The email automation system sends scheduled emails to clients based on their booking dates:
- **Welcome Email**: Sent immediately after booking
- **Booking Confirmation**: Sent 2 days after booking
- **Final Details Reminder**: Sent 3 weeks (21 days) before the event
- **Payment Reminder**: Sent 2 weeks (14 days) before the event

## Setup Instructions

### 1. Email Configuration (SMTP)

Create or update your `.env.local` file with SMTP credentials:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Site URL (for email links)
NEXT_PUBLIC_SITE_URL=https://stylishentertainment.co.uk

# Cron Secret (for scheduled email endpoint security)
CRON_SECRET=your-secret-key-here
```

### 2. Gmail Setup (if using Gmail)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Stylish Entertainment"
   - Copy the generated 16-character password
   - Use this as `SMTP_PASSWORD` in `.env.local`

### 3. Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

### 4. Scheduled Email Execution

The system includes a cron endpoint at `/api/cron/send-scheduled-emails` that checks for bookings and sends appropriate emails.

#### Option A: Vercel Cron (Recommended for Vercel deployment)

Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-scheduled-emails",
      "schedule": "0 9 * * *"
    }
  ]
}
```

This runs daily at 9 AM UTC.

#### Option B: Azure Functions (For Azure deployment)

Create an Azure Function with a timer trigger that calls the endpoint.

#### Option C: Local Testing

For local development, you can:
1. Call the endpoint manually: `GET http://localhost:3000/api/cron/send-scheduled-emails?auth=your-secret`
2. Set up a local cron job
3. Use a service like EasyCron or cron-job.org to call your production endpoint

### 5. Manual Email Sending

You can manually trigger emails via API:

```bash
POST /api/bookings/send-email
Content-Type: application/json

{
  "bookingId": "booking-id-here",
  "emailType": "confirmation" // or "welcome", "final-details", "payment-reminder"
}
```

## Email Templates

All email templates are in `lib/email-templates.ts` and can be customized:
- `welcomeEmail()` - Sent immediately after booking
- `bookingConfirmationEmail()` - Sent 2 days after booking
- `finalDetailsReminderEmail()` - Sent 3 weeks before event
- `paymentReminderEmail()` - Sent 2 weeks before event

## Email Tracking

The system tracks which emails have been sent in the `emailsSent` JSON field on each booking:
```json
{
  "welcome": { "sent": true, "sentAt": "2024-01-01T00:00:00Z", "messageId": "..." },
  "confirmation": { "sent": true, "sentAt": "2024-01-03T00:00:00Z", "messageId": "..." },
  "finalDetails": { "sent": false },
  "paymentReminder": { "sent": false }
}
```

## Testing

1. **Test email configuration:**
   ```bash
   # The email transporter will verify on server startup
   npm run dev
   ```

2. **Test sending an email:**
   - Create a test booking
   - Call the send-email API endpoint manually
   - Check that the email was received

3. **Test scheduled emails:**
   - Create bookings with dates in the past/future
   - Call the cron endpoint
   - Verify emails were sent and tracked

## Troubleshooting

**Email not sending:**
- Check SMTP credentials in `.env.local`
- Verify SMTP host and port are correct
- Check spam/junk folders
- Review server logs for errors

**Scheduled emails not running:**
- Verify cron job is set up correctly
- Check cron endpoint is accessible
- Verify CRON_SECRET matches (if set)
- Check server logs for errors

**Emails marked as sent but not received:**
- Check spam/junk folders
- Verify recipient email address is correct
- Check email provider's sending limits
- Review SMTP error logs

## Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Use App Passwords, not your main password for Gmail
- Set a strong CRON_SECRET for production
- Consider adding IP whitelisting for cron endpoint in production
