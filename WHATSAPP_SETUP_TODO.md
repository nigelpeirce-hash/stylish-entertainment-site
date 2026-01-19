# WhatsApp Business API Setup TODO

## 🔧 Setup Tasks

### 1. Environment Variables
- [ ] Get WhatsApp Business API credentials from Meta
- [ ] Add `WHATSAPP_ACCESS_TOKEN` to `.env.local`
- [ ] Add `WHATSAPP_PHONE_NUMBER_ID` to `.env.local`
- [ ] Add `WHATSAPP_WEBHOOK_SECRET` to `.env.local` (optional but recommended)
- [ ] Verify Supabase credentials are set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

### 2. Database Migration
- [ ] Run Prisma migration: `npx prisma migrate dev --name add_comms_log`
- [ ] Or if using Supabase directly, run SQL migration (see `WHATSAPP_SETUP.md`)

### 3. Supabase Storage Setup
- [ ] Create storage bucket named `whatsapp-media` in Supabase
- [ ] Configure bucket access policies (public read recommended for images)
- [ ] Test upload/download permissions

### 4. Meta Business Account Setup
- [ ] Verify WhatsApp Business API account is active
- [ ] Get access token and phone number ID from Meta dashboard
- [ ] Set up webhook URL: `https://yourdomain.com/api/whatsapp/webhook`
- [ ] Subscribe to `messages` event in webhook settings
- [ ] Test webhook verification (Meta will ping it)
- [ ] Verify phone number is active and can receive messages

### 5. Testing
- [ ] Send a test WhatsApp message to your business number
- [ ] Verify it appears in the Booking Detail page
- [ ] Test sending a reply from admin panel
- [ ] Test image upload/download
- [ ] Test draft inquiry creation for new contacts
- [ ] Test split thread functionality
- [ ] Verify messages auto-refresh every 5 seconds

### 6. Production Deployment
- [ ] Add all environment variables to production (Vercel/Azure/etc.)
- [ ] Verify webhook URL is production URL
- [ ] Test end-to-end in production
- [ ] Monitor error logs for any issues

## 📝 Notes

- Webhook must be HTTPS (no localhost in production)
- WhatsApp Business API has rate limits - be aware
- Media files stored in Supabase Storage - monitor storage usage
- Draft inquiries are automatically flagged for review
- Split thread feature useful when clients discuss multiple dates

## 🐛 Common Issues

- **Messages not appearing**: Check webhook is configured and active
- **Images not uploading**: Verify Supabase bucket exists and has correct permissions
- **Messages not sending**: Check WhatsApp API credentials and rate limits
- **Webhook verification fails**: Ensure route is accessible and returns correct format

## 🔗 Resources

- Meta WhatsApp Business API Docs: https://developers.facebook.com/docs/whatsapp
- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- See `WHATSAPP_SETUP.md` for detailed setup instructions
