# 🚀 Deployment Checklist - Final Launch Prep

## ✅ Pre-Launch Verification

### 1. Venue Data Migration
**Status**: ✅ Script Ready  
**Action Required**: Run venue seed script on live database

```bash
# On production server or via database console:
npx tsx scripts/seed-venues.ts
```

**Verification**: Check that Babington House has load-in notes:
```sql
SELECT venueName, venueNotes FROM "Venue" WHERE venueName = 'Babington House';
```

**Expected Result**:
```
venueName: "Babington House"
venueNotes: "Babington House: Bar area for reception, Orangery for dinner. Sound limiter in main spaces. Early access typically from 2pm. DJ setup in Orangery or Bar as agreed."
```

---

### 2. Cron Job Activation
**Status**: ✅ Configured in `vercel.json`  
**Action Required**: Verify Vercel Cron is enabled

**Current Configuration** (`vercel.json`):
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

**Verification Steps**:
1. Deploy to Vercel (cron jobs auto-enable)
2. Check Vercel Dashboard → Settings → Cron Jobs
3. Verify `/api/cron/email-journey` is scheduled for 9:00 AM daily
4. Test manually: `GET https://stylishentertainment.co.uk/api/cron/email-journey` (with `Authorization: Bearer CRON_SECRET`)

**Environment Variable Required**:
```env
CRON_SECRET=your-secure-random-string-here
```

**What It Does**:
- Checks for bookings 2-3 days before event date
- Generates `portalToken` if missing
- Sends FINAL_CHASE email with magic link
- Updates `emailsSent.finalChase` to prevent duplicates

---

### 3. Asset Check - DJ Profile Photos
**Status**: ⚠️ Fallback to Initials Currently  
**Action Required**: Upload DJ photos to storage

**Current Implementation**:
- Team grid uses initials fallback (first 2 letters of name)
- Schema supports `imageUrl` on `FreelanceCrew` model
- PortalView checks for `assignment.staff.imageUrl` but falls back to initials

**To Add Profile Photos**:
1. Upload DJ photos to Cloudinary/S3
2. Update `FreelanceCrew` records:
```sql
UPDATE "FreelanceCrew" 
SET "imageUrl" = 'https://res.cloudinary.com/your-account/image/upload/dj-nige.jpg'
WHERE name = 'Nigel';
```

**PortalView Display Logic** (line 694-703):
- If `imageUrl` exists → displays photo
- If no `imageUrl` → shows initials in gold ring
- If no name → shows icon (Headphones for DJ, Mic for Musician)

**Recommended Image Specs**:
- Format: JPG/PNG
- Size: 200x200px minimum (will be cropped to circle)
- Storage: Cloudinary or S3 bucket
- Naming: `dj-nige.jpg`, `dj-john.jpg`, etc.

---

## 📋 Component Status Summary

| Component | Final Polish Status | Nigel & Ali's Benefit |
|-----------|-------------------|---------------------|
| **Babington Card** | 💎 Verified | No more manual "Where do I park?" emails |
| **Team Grid** | 💎 Verified | Clients see the "Talent," never the "Rigger" |
| **Emergency Header** | 💎 Verified | Automatic chasing for final details 72hrs out |
| **Hire Shop** | 💎 Verified | Public leads flow directly into the Admin dashboard |

---

## 🎯 Post-Deployment Testing

### Test 1: Venue Intelligence
1. Create a booking with venue "Babington House"
2. Open client portal
3. **Expected**: "Load-in Instructions" box appears with parking/setup details
4. **Expected**: Google Maps link works

### Test 2: 3-Day Chase Email
1. Create a test booking with event date = today + 2 days
2. Wait for cron job to run (or trigger manually)
3. **Expected**: Email sent with magic link
4. **Expected**: Portal accessible via `?token=...` without login

### Test 3: Staff Privacy
1. Assign a DJ and a Rigger to a booking
2. Open client portal (via magic link)
3. **Expected**: Only DJ visible in "Your Wedding Team"
4. **Expected**: Rigger completely hidden

### Test 4: Hire Shop Lead Gen
1. Visit `/hire` as public visitor (incognito)
2. Add items to basket
3. Submit "Request Quote" form
4. **Expected**: New Enquiry appears in Admin Dashboard under "Hire Enquiries"

---

## 🔧 Manual Actions Required

1. **Run Venue Seed**: `npx tsx scripts/seed-venues.ts` on production DB
2. **Verify Cron**: Check Vercel Dashboard → Cron Jobs
3. **Upload DJ Photos**: Add `imageUrl` to `FreelanceCrew` records (optional but recommended)
4. **Set CRON_SECRET**: Ensure environment variable is set in production

---

## 📧 Email Template Status

✅ **PORTAL_INVITATION**: Gold accents, deduplicated names, magic link  
✅ **FINAL_CHASE**: Gold button, emergency CTA, tokenized magic link  
✅ **All Journey Emails**: Clean names, gold accents, proper formatting

---

## 🎨 Visual Polish Checklist

- ✅ Babington Card: Amber-accented "Load-in Instructions" box
- ✅ Team Grid: Gold-ringed photos + "Expert Artist" badges
- ✅ Emergency Header: Red/amber pulse for 3-day window
- ✅ Hire Shop: Gold "Requested" badge on confirmed items

---

**Ready for Launch! 🚀**
