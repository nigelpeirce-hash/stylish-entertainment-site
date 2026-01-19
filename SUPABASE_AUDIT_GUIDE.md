# Supabase Database Audit Guide

This guide helps you audit your Supabase database to ensure it matches your Prisma schema.

## 🎯 Quick Audit Steps

### Step 1: Run the Audit SQL Script

1. **Open Supabase SQL Editor**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Click **SQL Editor** → **New Query**

2. **Copy and Run the Audit Script**
   - Open `supabase-audit.sql` from this project
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

3. **Review the Results**
   - Check each query result
   - Compare with your Prisma schema (`prisma/schema.prisma`)

### Step 2: Compare Prisma Schema with Database

#### Key Tables to Verify:

**Booking Table** - Should have these fields:
- ✅ `priority` (TEXT, default 'medium') - **Recently added**
- ✅ `termsAccepted` (BOOLEAN)
- ✅ `termsAcceptedAt` (TIMESTAMP)
- ✅ `emailsSent` (JSON)
- ✅ `musicRequests` (TEXT)
- ✅ `status` (TEXT, default 'pending')
- ✅ `eventDate` (TIMESTAMP)
- ✅ `venueName` (TEXT)
- ✅ All other fields from schema

**FreelanceCrew Table** - Should exist if you've run the staff migration:
- ✅ `id` (TEXT, PRIMARY KEY)
- ✅ `name` (TEXT)
- ✅ `email` (TEXT, optional)
- ✅ `roles` (TEXT[])
- ✅ `isActive` (BOOLEAN)

**BookingStaffAssignment Table** - Should exist if you've run the staff migration:
- ✅ `id` (TEXT, PRIMARY KEY)
- ✅ `bookingId` (TEXT, FOREIGN KEY)
- ✅ `staffId` (TEXT, FOREIGN KEY)
- ✅ `role` (TEXT)
- ✅ `agreedFee` (TEXT)
- ✅ `status` (TEXT, default 'held')

**venue_assets Table** - Should exist for venue brochure feature:
- ✅ `id` (TEXT, PRIMARY KEY)
- ✅ `venue_name` (TEXT)
- ✅ `pdf_url` (TEXT)
- ✅ `is_active` (BOOLEAN)

## 🔍 What to Look For

### Missing Fields
If a field exists in Prisma schema but not in the database:
- You'll see it missing in the column list query
- Add it using `ALTER TABLE` statements

### Missing Tables
If a table exists in Prisma schema but not in the database:
- It won't appear in the table list
- Run the appropriate migration SQL

### Type Mismatches
Compare data types:
- Prisma `String` → PostgreSQL `TEXT` or `VARCHAR`
- Prisma `Int` → PostgreSQL `INTEGER`
- Prisma `Boolean` → PostgreSQL `BOOLEAN`
- Prisma `DateTime` → PostgreSQL `TIMESTAMP`
- Prisma `Json` → PostgreSQL `JSONB` or `JSON`

## 🛠️ Common Fixes

### Fix 1: Missing Priority Field
```sql
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "priority" TEXT DEFAULT 'medium';
```

### Fix 2: Missing venue_assets Table
```sql
CREATE TABLE IF NOT EXISTS "venue_assets" (
    "id" TEXT PRIMARY KEY,
    "venue_name" TEXT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "venue_assets_venue_name_key" 
ON "venue_assets"("venue_name") 
WHERE "is_active" = true;
```

### Fix 3: Missing FreelanceCrew Table
Run the migration from `supabase-migration.sql`

### Fix 4: Missing BookingStaffAssignment Table
Run the migration from `supabase-migration.sql`

## 📊 Expected Results

After running the audit, you should see:

1. **Tables List**: All tables from your Prisma schema
2. **Booking Columns**: ~30+ columns including `priority`
3. **Indexes**: Indexes on `userId`, `email`, `status`, `eventDate`
4. **Foreign Keys**: Relations between tables
5. **Record Counts**: Number of records in each table

## ⚠️ Troubleshooting

### "relation does not exist"
- The table hasn't been created yet
- Run the appropriate migration SQL

### "column does not exist"
- The field is missing from the table
- Add it using `ALTER TABLE` statement

### "duplicate key value"
- The column already exists
- Use `IF NOT EXISTS` in your ALTER statements

## 📝 Next Steps After Audit

1. **Document Missing Items**: List any missing fields/tables
2. **Create Migration Scripts**: Write SQL to add missing items
3. **Test Locally First**: If possible, test on a dev database
4. **Run Migrations**: Apply fixes in Supabase SQL Editor
5. **Verify Again**: Re-run the audit to confirm fixes

## 🔗 Related Files

- `prisma/schema.prisma` - Your Prisma schema (source of truth)
- `supabase-audit.sql` - This audit script
- `supabase-migration.sql` - Staff assignment migration
- `supabase-add-priority-migration.sql` - Priority field migration

---

**Last Updated**: After adding priority field to Booking model
