# Email Journey System

## Overview

The Email Journey Manager provides a complete customer lifecycle email system with 5 key stages, integrated with Resend for email delivery.

## Journey Stages

1. **Inquiry Auto-Responder** - Immediate thank you with PDF brochure link
2. **Booking Confirmation** - Sent after deposit, includes Client Admin link
3. **4-Week Check-in** - Automation for final song choices/logistics
4. **Week-of Excitement** - Short "We're ready for you" note
5. **Post-Wedding Magic** - Sent 3 days after event, asks for feedback/testimonials

## Features

- ✨ Luxe Gatsby branding with champagne-gold accents
- 📧 Responsive HTML email templates
- 🇬🇧 British English spelling throughout
- 📄 PDF generation for each template
- 🔗 Integration with Resend email service

## Setup

### 1. Environment Variables

Add to your `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=info@stylishentertainment.co.uk
RESEND_FROM_NAME=Stylish Entertainment
```

### 2. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create an API key in the dashboard
3. Add it to your `.env.local` file

## Usage

### Preview Emails

Visit `/admin/emails` to:
- Preview all 5 email templates
- Download PDFs of each template
- See placeholder data examples

### Send Emails via API

**Endpoint:** `POST /api/send-email`

**Authentication:** Requires admin role

**Request Body:**
```json
{
  "stage": "inquiry-autoresponder",
  "clientEmail": "client@example.com",
  "bookingId": "optional-booking-id",
  "clientData": {
    "clientName": "Sarah & James",
    "eventType": "Wedding",
    "eventDate": "Saturday, 15 June 2025",
    "venueName": "Babington House",
    "clientAdminUrl": "https://stylishentertainment.co.uk/client/dashboard",
    "brochureUrl": "https://stylishentertainment.co.uk/brochure.pdf"
  }
}
```

**Example with bookingId:**
```json
{
  "stage": "booking-confirmation",
  "clientEmail": "client@example.com",
  "bookingId": "clxxxxxxxxxxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "re_xxxxxxxxxxxxx",
  "message": "Email sent successfully"
}
```

### Valid Stages

- `inquiry-autoresponder`
- `booking-confirmation`
- `4-week-checkin`
- `week-of-excitement`
- `post-wedding-magic`

## Generating Demo PDFs

To generate a demo PDF:

1. Navigate to `/admin/emails`
2. Select any journey stage from the sidebar
3. Click the "Download PDF" button
4. PDF will download with:
   - Stage title heading
   - Subject line
   - Champagne-gold divider
   - Full email content

## Email Template Variables

Templates support the following variables:
- `{{clientName}}` - Client/couple name
- `{{eventType}}` - Wedding, Corporate Event, etc.
- `{{eventDate}}` - Formatted event date
- `{{venueName}}` - Venue name
- `{{clientAdminUrl}}` - Link to client dashboard
- `{{brochureUrl}}` - Link to PDF brochure

## Branding

All emails feature:
- White background
- Single-line 'S' logo at top
- Champagne-gold divider (#D4AF37)
- Playfair Display serif for headings
- Inter sans-serif for body text
- British English spelling (specialise, organise, colour, etc.)

## Notes

- Inquiry email explicitly mentions Nigel and Ali
- All CTAs link to appropriate pages
- Post-wedding email includes Google Review and Instagram links
- Templates are mobile-responsive
