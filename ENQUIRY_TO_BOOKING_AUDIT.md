# Enquiry-to-Booking Handoff Audit Report

## 📋 Overview
This audit examines the conversion process from `NewEnquiry` to `Booking` in `app/api/admin/new-enquiries/[id]/convert/route.ts`.

## ✅ What's Working

### Field Mappings (Automatic)
- ✅ `name` → `booking.name`
- ✅ `email` → `booking.email`
- ✅ `phoneAreaCode` → `booking.phoneAreaCode`
- ✅ `phoneNumber` → `booking.phoneNumber`
- ✅ `eventDate` → `booking.eventDate`
- ✅ `venueName` → `booking.venueName` (with "TBD" fallback)
- ✅ `venuePostcode` → `booking.venuePostcode`
- ✅ `isConflict` → `booking.conflictStatus` (as "pending" if true)

### Safety Features
- ✅ Duplicate booking prevention (checks email + eventDate)
- ✅ User creation/lookup (prevents duplicate users)
- ✅ Enquiry status update (marks as "converted")
- ✅ Admin authentication check

## ⚠️ Issues Found

### 1. Missing Field Mappings
**Severity: Medium**

The following fields exist in `Booking` model but are NOT being mapped from enquiry:
- ❌ `services` (String[]) - Available in Booking, not captured from enquiry
- ❌ `numberOfGuests` (Int?) - Available in Booking, not in NewEnquiry
- ❌ `message` (String?) - Available in Booking, not captured from enquiry
- ❌ `budget` (String?) - Available in Booking, not in NewEnquiry

**Impact:** Data loss when converting enquiry to booking. Services, guest count, and other details are not preserved.

**Recommendation:** 
- If these fields are captured in the enquiry form, add them to NewEnquiry model
- Map them during conversion
- If not captured, document that they must be added manually

### 2. Transaction Safety
**Severity: High**

The conversion process is NOT wrapped in a database transaction. If the enquiry status update fails after booking creation, you'll have:
- ✅ Booking created
- ❌ Enquiry still marked as "new" (not "converted")

**Impact:** Data inconsistency, potential duplicate conversions.

**Recommendation:** Wrap both operations in `prisma.$transaction()`.

### 3. Error Handling
**Severity: Medium**

- Generic error messages ("Internal server error")
- No specific error codes for different failure scenarios
- UI shows generic `alert()` instead of proper error handling

**Impact:** Difficult to debug issues, poor user experience.

**Recommendation:** Add specific error types and better error messages.

### 4. Pre-Conversion Validation
**Severity: Low**

No check to prevent converting an already-converted enquiry.

**Impact:** Could attempt to create duplicate bookings if button is clicked multiple times.

**Recommendation:** Check `enquiry.status === "converted"` before processing.

### 5. UI/UX Issues
**Severity: Low**

- When existing booking is found, UI redirects but doesn't show a message explaining why
- Generic `alert()` for errors (not user-friendly)
- No loading state during conversion

**Impact:** Confusing user experience.

**Recommendation:** Add toast notifications and loading states.

### 6. Missing Fields in Booking Creation
**Severity: Low**

Some Booking fields have defaults but aren't explicitly set:
- `eventType` defaults to "wedding" (hardcoded, but could be dynamic)
- `status` defaults to "pending" (explicitly set ✅)
- `priority` defaults to "medium" (explicitly set ✅)

**Impact:** Minor - defaults are fine, but could be more flexible.

## 🔧 Recommended Fixes

### Priority 1: Transaction Safety
```typescript
const booking = await prisma.$transaction(async (tx) => {
  const booking = await tx.booking.create({...});
  await tx.newEnquiry.update({...});
  return booking;
});
```

### Priority 2: Pre-Conversion Check
```typescript
if (enquiry.status === "converted") {
  return NextResponse.json({ 
    error: "Enquiry already converted",
    bookingId: enquiry.originalBookingId 
  }, { status: 400 });
}
```

### Priority 3: Better Error Handling
```typescript
catch (error: any) {
  if (error.code === 'P2002') {
    return NextResponse.json({ 
      error: "Duplicate booking detected" 
    }, { status: 409 });
  }
  // ... more specific errors
}
```

### Priority 4: Field Mapping Audit
- Document which fields are intentionally not mapped
- Add comments for fields that need manual entry
- Consider adding `services` mapping if captured in enquiry

## 📊 Field Mapping Matrix

| NewEnquiry Field | Booking Field | Status | Notes |
|-----------------|---------------|--------|-------|
| `name` | `name` | ✅ Mapped | Automatic |
| `email` | `email` | ✅ Mapped | Automatic |
| `phoneAreaCode` | `phoneAreaCode` | ✅ Mapped | Automatic |
| `phoneNumber` | `phoneNumber` | ✅ Mapped | Automatic |
| `eventDate` | `eventDate` | ✅ Mapped | Automatic |
| `venueName` | `venueName` | ✅ Mapped | Automatic (with fallback) |
| `venuePostcode` | `venuePostcode` | ✅ Mapped | Automatic |
| `isConflict` | `conflictStatus` | ✅ Mapped | Automatic (conditional) |
| N/A | `eventType` | ⚠️ Default | Hardcoded to "wedding" |
| N/A | `ceremonyTime` | 🛠️ Manual | Must be added after conversion |
| N/A | `services` | ❌ Missing | Not in NewEnquiry model |
| N/A | `numberOfGuests` | ❌ Missing | Not in NewEnquiry model |
| N/A | `message` | ❌ Missing | Not in NewEnquiry model |
| N/A | `budget` | ❌ Missing | Not in NewEnquiry model |

## ✅ Conclusion

The conversion process is **functionally working** but has room for improvement in:
1. **Data integrity** (transaction safety)
2. **Data completeness** (missing field mappings)
3. **User experience** (error handling, feedback)
4. **Safety** (prevent duplicate conversions)

**Overall Status:** ⚠️ **Needs Improvement** - Core functionality works, but should address transaction safety and missing fields.
