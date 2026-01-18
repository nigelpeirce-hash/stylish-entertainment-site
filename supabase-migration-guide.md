# Supabase Migration Guide - FreelanceCrew & BookingStaffAssignment

## 📋 Overview

This migration adds two new tables to support the **Quick Staff Confirm** feature:
- `FreelanceCrew` - Stores staff members (lighting, sound, etc.)
- `BookingStaffAssignment` - Links staff to bookings with role, fee, and status

## 🚀 How to Run

### Option 1: Supabase SQL Editor (Recommended)

1. **Open Supabase Dashboard**
   - Go to your Supabase project: https://supabase.com/dashboard
   - Navigate to **SQL Editor**

2. **Copy the SQL**
   - Open `supabase-migration.sql`
   - Copy all the SQL code

3. **Paste and Run**
   - Paste into the SQL Editor
   - Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify**
   - Check the **Table Editor** to see the new tables
   - Or run the verification queries at the bottom of the SQL file

### Option 2: Supabase CLI

If you're using Supabase CLI locally:

```bash
# Create a new migration
supabase migration new add_freelance_crew_and_staff_assignments

# Copy the SQL from supabase-migration.sql into the new migration file
# Then apply it
supabase db push
```

## ✅ What Gets Created

### 1. **FreelanceCrew Table**
- Stores staff member information
- Fields: `id`, `name`, `email`, `phone`, `roles[]`, `isActive`
- Indexes on `name` and `isActive` for fast searches

### 2. **BookingStaffAssignment Table**
- Links staff to bookings
- Fields: `id`, `bookingId`, `staffId`, `role`, `agreedFee`, `status`, `confirmationEmailSent`, etc.
- Unique constraint on `bookingId + staffId` (one assignment per staff per booking)
- Foreign keys to `Booking` and `FreelanceCrew` with CASCADE delete

### 3. **Indexes**
- Performance indexes on frequently queried fields
- Unique index for `bookingId + staffId` combination

### 4. **Triggers**
- Automatic `updatedAt` timestamp updates
- Runs on every UPDATE operation

## 🔒 Security (Optional)

The SQL includes commented-out RLS (Row Level Security) commands. If you want to enable RLS:

```sql
ALTER TABLE "FreelanceCrew" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingStaffAssignment" ENABLE ROW LEVEL SECURITY;

-- Then create policies as needed
```

## 📊 After Migration

### Verify Tables Were Created

Run in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('FreelanceCrew', 'BookingStaffAssignment');
```

### Check Indexes

```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('FreelanceCrew', 'BookingStaffAssignment');
```

### Test Insert (Optional)

```sql
-- Insert a test staff member
INSERT INTO "FreelanceCrew" ("id", "name", "roles", "isActive")
VALUES ('test-123', 'John Doe', ARRAY['Lighting', 'Sound'], true);

-- Check it was created
SELECT * FROM "FreelanceCrew" WHERE "id" = 'test-123';
```

## ⚠️ Important Notes

1. **IF NOT EXISTS**: The SQL uses `IF NOT EXISTS` clauses, so it's safe to run multiple times
2. **CASCADE DELETE**: Deleting a Booking will automatically delete its staff assignments
3. **CASCADE DELETE**: Deleting a FreelanceCrew member will delete their assignments
4. **Default Values**: Status defaults to `'held'`, `isActive` defaults to `true`

## 🐛 Troubleshooting

### Error: "relation already exists"
- Tables may already exist - check in Table Editor first
- Or use `DROP TABLE IF EXISTS` before creating (be careful!)

### Error: "foreign key constraint"
- Ensure the `Booking` table exists first
- Check that referenced columns have matching types

### Error: "permission denied"
- Make sure you're using a user with CREATE TABLE permissions
- In Supabase, this should work automatically for the project owner

## 📝 Next Steps

After running the migration:

1. **Sync Prisma** (if using Prisma with Supabase):
   ```bash
   npx prisma generate
   ```

2. **Test the Feature**:
   - Go to Admin Dashboard → Booking Detail page
   - Use "Quick Staff Confirm" button
   - Add a staff member and verify it saves

3. **Add Sample Data** (Optional):
   ```sql
   INSERT INTO "FreelanceCrew" ("id", "name", "email", "roles", "isActive")
   VALUES 
   ('crew-001', 'Lighting Technician', 'tech@example.com', ARRAY['Lighting'], true),
   ('crew-002', 'Sound Engineer', 'sound@example.com', ARRAY['Sound'], true);
   ```

---

**Migration File:** `supabase-migration.sql`  
**Status:** Ready to run ✅
