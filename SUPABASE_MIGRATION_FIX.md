# Supabase Migration - Where to Run SQL

## ✅ Correct Location: SQL Editor

The migration SQL should be run in the **SQL Editor** in Supabase Dashboard:

1. Go to Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Paste the SQL from `supabase-migration.sql`
5. Click **Run** or press `Ctrl+Enter` / `Cmd+Enter`

## ❌ Wrong Locations (Don't Use)

- **Row Level Security (RLS) Policies** - This is for security rules, not table creation
- **API Documentation** - This is for viewing APIs, not running SQL
- **Table Editor** - This is for viewing/editing data, not creating tables
- **Database Settings** - This is for configuration, not SQL execution

## 🔍 How to Check if Migration Already Ran

If you're not sure if the migration already ran, check in Supabase:

### Option 1: Check Tables Exist
Run this in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('FreelanceCrew', 'BookingStaffAssignment');
```

**If you see both tables listed**, the migration already ran successfully ✅

**If you see "0 rows" or only one table**, you need to run the migration.

### Option 2: Check in Table Editor
1. Go to **Table Editor** in Supabase Dashboard
2. Look for `FreelanceCrew` and `BookingStaffAssignment` in the table list
3. If they exist, migration is complete ✅

## 🔧 If Migration Ran in Wrong Place

If you accidentally pasted the SQL in the wrong location (like RLS policies):

1. **Check if tables exist** using the SQL above
2. If tables exist, you're good - ignore the wrong location ✅
3. If tables don't exist, run it correctly in **SQL Editor**

## 🚨 Common Issues

### "Table already exists" Error
- This means the migration already ran successfully
- Safe to ignore or skip

### "Permission denied" Error
- Make sure you're logged in as project owner
- Or ensure your user has CREATE TABLE permissions

### "Foreign key constraint" Error
- Check that the `Booking` table exists
- Make sure you're running against the correct database

## ✅ Verification After Migration

Once migration runs successfully, you should see:

1. **Two new tables** in Table Editor:
   - `FreelanceCrew`
   - `BookingStaffAssignment`

2. **Tables have the correct columns**:
   - FreelanceCrew: id, name, email, phone, roles, isActive, createdAt, updatedAt
   - BookingStaffAssignment: id, bookingId, staffId, role, agreedFee, status, etc.

3. **Foreign keys work**:
   - You can link staff assignments to bookings

---

**If you need help verifying, let me know and I can help you check!**
