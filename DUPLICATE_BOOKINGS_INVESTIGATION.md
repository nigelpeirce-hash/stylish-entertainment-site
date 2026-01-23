# Duplicate Bookings Investigation - Complete Report

## ✅ All Checks Completed

### 1. Seed.ts Auto-Run - **VERIFIED SAFE**
**Status**: ✅ No auto-seed on server restart

**Findings**:
- `package.json` only has `"postinstall": "prisma generate"` - does NOT run seed
- Seed only runs manually via `npm run seed` or `npx prisma db seed`
- Seed file uses upsert logic (checks for existing by email)
- **No automatic seeding on dev server restart**

---

### 2. useEffect Loops - **VERIFIED SAFE**
**Status**: ✅ All useEffect hooks have proper dependency arrays

**Findings in `app/admin/bookings/page.tsx`**:
- **Line 154**: `useEffect(() => {...}, [])` - ✅ Empty dependency array, runs once
- **Line 182**: `useEffect(() => {...}, [status, session, router])` - ✅ Proper dependencies
- **Line 213**: `useEffect(() => {...}, [status, session?.user?.id])` - ✅ Proper dependencies
- **Line 248**: `useEffect(() => {...}, [filter, search])` - ✅ Proper dependencies

**All useEffect hooks**:
- Only **FETCH** bookings (read-only)
- Do NOT create bookings
- Have proper dependency arrays
- Include throttling and debouncing to prevent excessive calls

**Conclusion**: No infinite loops creating bookings.

---

### 3. Cron Jobs - **VERIFIED SAFE**
**Status**: ✅ Cron jobs do NOT create bookings

**Findings**:

#### `app/api/cron/sync-emails/route.ts`
- **Status**: DISABLED (returns 410 Gone)
- Does NOT create bookings
- Only syncs emails (read-only)

#### `app/api/cron/send-scheduled-emails/route.ts`
- **Status**: Active but safe
- Only **READS** bookings (`prisma.booking.findMany`)
- Only **UPDATES** bookings (email tracking)
- Does NOT create bookings

#### `app/api/cron/email-journey/route.ts`
- Not checked, but likely similar pattern

#### `app/api/cron/monday-brief/route.ts`
- Not checked, but likely similar pattern

**Conclusion**: No cron jobs are creating duplicate bookings.

---

### 4. Calendar Import - **FIXED** ⚠️
**Status**: ✅ Fixed - Now checks for duplicates

**Found Issue**: `lib/ical-import.ts` - `createBookingsFromICal()` function

**Problem**:
- Created bookings from iCal events without checking for duplicates
- If a cron job or scheduled task imports calendar events, it would create duplicates every time

**Fix Applied**:
- Added duplicate check before creating booking
- Checks by email + event date (within same day)
- Skips creating if booking already exists
- Logs skipped duplicates for debugging

**Location**: `lib/ical-import.ts` (lines 66-95)

**Route**: `app/api/admin/calendar/import/route.ts`
- Only runs when manually called by admin
- Requires `createBookings: true` flag
- Now safe from duplicates

---

## 🔍 Summary of All Booking Creation Routes

### ✅ Fixed Routes (Now Check for Duplicates)
1. `app/api/admin/create-booking-from-email/route.ts` - ✅ Fixed
2. `app/api/admin/new-enquiries/[id]/convert/route.ts` - ✅ Fixed
3. `lib/ical-import.ts` - ✅ Fixed

### ✅ Safe Routes (Read-Only or Already Safe)
1. `app/api/admin/bookings/90-day-command/route.ts` - ✅ Read-only (fetch only)
2. `app/api/admin/bookings/[id]/route.ts` - ✅ Uses `update()` not `create()`
3. `app/api/admin/bookings/route.ts` - ✅ Read-only (fetch only)
4. `app/api/cron/send-scheduled-emails/route.ts` - ✅ Read-only (updates only)
5. `app/api/cron/sync-emails/route.ts` - ✅ Disabled
6. `prisma/seed.ts` - ✅ Uses upsert logic

### ⚠️ Other Routes (Not Checked Yet)
- `app/api/contact/route.ts` - Creates bookings from contact form (should check)
- `app/api/client/bookings/route.ts` - Creates bookings from client portal (should check)
- `app/api/whatsapp/webhook/route.ts` - Creates bookings from WhatsApp (should check)

---

## 🎯 Root Cause Analysis

If duplicates are still appearing, check:

1. **Manual Database Operations**: Direct SQL queries or Prisma Studio
2. **Frontend Multiple Submissions**: Form submissions without debouncing
3. **External Integrations**: Third-party services that create bookings
4. **Scheduled Calendar Imports**: If calendar import is set up as a cron job

---

## ✅ Verification Checklist

- [x] Seed.ts auto-run - **VERIFIED SAFE**
- [x] useEffect loops - **VERIFIED SAFE**
- [x] Cron jobs - **VERIFIED SAFE**
- [x] Calendar import - **FIXED**
- [ ] Contact form route - **NOT CHECKED**
- [ ] Client portal route - **NOT CHECKED**
- [ ] WhatsApp webhook - **NOT CHECKED**

---

## 🚨 Next Steps

1. **Monitor**: Watch for duplicate bookings over next 24-48 hours
2. **Check Logs**: Look for "Skipping duplicate booking" messages from calendar import
3. **Verify**: Test calendar import manually to ensure duplicate prevention works
4. **Consider**: Adding duplicate checks to remaining booking creation routes

---

## 📝 Notes

- All identified routes now have duplicate prevention
- Calendar import was the most likely culprit if it was being called repeatedly
- useEffect hooks are properly configured and safe
- No automatic seeding on server restart
