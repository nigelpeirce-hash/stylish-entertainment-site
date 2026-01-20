-- Migration: Add briefStatus, acknowledgedAt, and briefToken to BookingStaffAssignment
-- This migration adds support for the brief acknowledgment system
-- 
-- First, let's find the correct table name by checking common variations

-- Try to find the table name (check multiple possible names)
DO $$
DECLARE
    table_name TEXT;
BEGIN
    -- Check for common table name variations
    SELECT tablename INTO table_name
    FROM pg_tables
    WHERE schemaname = 'public'
    AND (
        tablename = 'BookingStaffAssignment' OR
        tablename = 'Booking_Staff_Assignment' OR
        tablename = 'booking_staff_assignment' OR
        tablename = 'bookingstaffassignment'
    )
    LIMIT 1;

    IF table_name IS NULL THEN
        RAISE EXCEPTION 'Table BookingStaffAssignment not found. Please check the table name in your database.';
    END IF;

    RAISE NOTICE 'Found table: %', table_name;

    -- Add briefStatus column (defaults to 'pending')
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "briefStatus" TEXT DEFAULT ''pending''', table_name);

    -- Add acknowledgedAt column (nullable timestamp)
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP', table_name);

    -- Add briefToken column (nullable, unique token for confirmation links)
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "briefToken" TEXT', table_name);

    -- Create unique index on briefToken (only for non-null values)
    EXECUTE format('CREATE UNIQUE INDEX IF NOT EXISTS %I ON %I ("briefToken") WHERE "briefToken" IS NOT NULL', 
        table_name || '_briefToken_key', table_name);

    -- Update existing records to have 'pending' status if null
    EXECUTE format('UPDATE %I SET "briefStatus" = ''pending'' WHERE "briefStatus" IS NULL', table_name);

    RAISE NOTICE 'Migration completed successfully for table: %', table_name;
END $$;

-- Alternative: If the above doesn't work, try these direct commands (uncomment if needed):
-- ALTER TABLE "Booking_Staff_Assignment" ADD COLUMN IF NOT EXISTS "briefStatus" TEXT DEFAULT 'pending';
-- ALTER TABLE "Booking_Staff_Assignment" ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP;
-- ALTER TABLE "Booking_Staff_Assignment" ADD COLUMN IF NOT EXISTS "briefToken" TEXT;
-- CREATE UNIQUE INDEX IF NOT EXISTS "Booking_Staff_Assignment_briefToken_key" ON "Booking_Staff_Assignment" ("briefToken") WHERE "briefToken" IS NOT NULL;
-- UPDATE "Booking_Staff_Assignment" SET "briefStatus" = 'pending' WHERE "briefStatus" IS NULL;
