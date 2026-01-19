# WhatsApp Business API Integration Setup Guide

## Overview

The WhatsApp Business API integration allows you to:
- View WhatsApp conversations in the Booking Detail page
- Send messages directly from the admin panel
- Automatically create draft inquiries when new contacts message
- Handle images and media files
- Split threads when multiple dates are discussed

## Prerequisites

1. **WhatsApp Business API Account**
   - You need a Meta Business Account
   - WhatsApp Business API access (via Meta or a provider like Twilio)
   - Phone number verified with WhatsApp Business

2. **Environment Variables**
   Add these to your `.env.local` file:

   ```env
   # WhatsApp Business API
   WHATSAPP_ACCESS_TOKEN=your_access_token_here
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
   WHATSAPP_WEBHOOK_SECRET=your_webhook_secret_here (optional, for security)

   # Supabase (for media storage)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Supabase Storage Bucket**
   - Create a storage bucket named `whatsapp-media` in your Supabase project
   - Set it to public or configure proper access policies

## Database Migration

Run the Prisma migration to add the `CommsLog` table:

```bash
npx prisma migrate dev --name add_comms_log
```

Or if using Supabase directly, run the SQL migration:

```sql
-- Create CommsLog table
CREATE TABLE IF NOT EXISTS "CommsLog" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT,
    "platform" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "contactName" TEXT,
    "message" TEXT,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "mediaFileName" TEXT,
    "whatsappMessageId" TEXT,
    "whatsappTimestamp" TEXT,
    "sentByUserId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommsLog_pkey" PRIMARY KEY ("id")
);

-- Add foreign keys and indexes
ALTER TABLE "CommsLog" ADD CONSTRAINT "CommsLog_bookingId_fkey" 
    FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CommsLog" ADD CONSTRAINT "CommsLog_sentByUserId_fkey" 
    FOREIGN KEY ("sentByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "CommsLog_bookingId_idx" ON "CommsLog"("bookingId");
CREATE INDEX IF NOT EXISTS "CommsLog_phoneNumber_idx" ON "CommsLog"("phoneNumber");
CREATE INDEX IF NOT EXISTS "CommsLog_email_idx" ON "CommsLog"("email");
CREATE INDEX IF NOT EXISTS "CommsLog_platform_idx" ON "CommsLog"("platform");
CREATE INDEX IF NOT EXISTS "CommsLog_createdAt_idx" ON "CommsLog"("createdAt");
CREATE INDEX IF NOT EXISTS "CommsLog_whatsappMessageId_idx" ON "CommsLog"("whatsappMessageId");
```

## Webhook Configuration

1. **Set up Webhook URL**
   - In your Meta Business Account, go to WhatsApp > Configuration
   - Set the webhook URL to: `https://yourdomain.com/api/whatsapp/webhook`
   - Subscribe to `messages` events

2. **Verify Webhook**
   - Meta will send a verification request
   - The webhook endpoint handles verification automatically

## Features

### 1. WhatsApp History View
- Displays in the Booking Detail page
- Shows all WhatsApp messages for the booking
- Styled like WhatsApp (green/grey bubbles)
- Auto-refreshes every 5 seconds

### 2. Date Anchor
- Event date prominently displayed at top of chat
- Green gradient background for visibility

### 3. Split Thread
- If multiple dates are discussed, use "Split Thread" button
- Moves messages to a different Booking ID
- Useful when client changes event date

### 4. One-Tap Reply
- Large "Reply via WhatsApp" button
- Type message and click to send
- Supports image attachments
- Messages sent via WhatsApp Business API

### 5. Image Handling
- Images sent by clients are automatically:
  - Downloaded from WhatsApp
  - Uploaded to Supabase Storage
  - Displayed as clickable thumbnails in chat
- Click thumbnails to view full-size images

### 6. Draft Inquiry Creation
- When a new WhatsApp contact messages:
  - System checks if phone number exists
  - If not found, creates a draft inquiry
  - Flags it for review (`flaggedFor: "wife"`)
  - Sets status to "pending" with high priority

## API Endpoints

### GET `/api/admin/bookings/[id]/whatsapp-messages`
Fetches all WhatsApp messages for a booking.

### POST `/api/whatsapp/webhook`
Receives incoming WhatsApp messages from Meta webhook.

### POST `/api/whatsapp/send`
Sends a WhatsApp message to a client.

**Request:**
```typescript
FormData {
  message: string;
  phoneNumber: string;
  bookingId: string;
  media?: File; // Optional image
}
```

### POST `/api/admin/bookings/[id]/split-whatsapp-thread`
Moves WhatsApp messages from one booking to another.

**Request:**
```json
{
  "newBookingId": "booking-id-here"
}
```

## Usage

1. **Viewing WhatsApp Messages**
   - Open any booking with a phone number
   - WhatsApp Thread component appears automatically
   - Messages load and auto-refresh

2. **Sending Messages**
   - Type in the message box
   - Optionally attach an image
   - Click "Reply via WhatsApp"
   - Message is sent and saved to database

3. **Splitting Threads**
   - If client discusses multiple dates
   - Click "Split Thread" button
   - Enter the target Booking ID
   - Messages are moved to that booking

4. **Reviewing Draft Inquiries**
   - New WhatsApp contacts create draft inquiries
   - Check bookings flagged for review
   - Update event date and details as needed

## Troubleshooting

### Messages not appearing
- Check webhook is configured correctly
- Verify `WHATSAPP_ACCESS_TOKEN` is set
- Check browser console for errors

### Images not uploading
- Verify Supabase storage bucket exists
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Ensure bucket is named `whatsapp-media`

### Messages not sending
- Verify `WHATSAPP_PHONE_NUMBER_ID` is correct
- Check WhatsApp Business API status
- Ensure phone number is verified

## Security Notes

- Webhook secret verification is optional but recommended
- All API routes require admin authentication
- Media files are stored securely in Supabase
- Phone numbers are stored but can be redacted if needed
