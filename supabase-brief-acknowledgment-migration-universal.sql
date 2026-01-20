-- Universal Migration: Add briefStatus, acknowledgedAt, and briefToken
-- This will work with any table name by finding it dynamically

DO $$
DECLARE
    table_name TEXT;
    index_name TEXT;
BEGIN
    -- Find the table (try common naming conventions)
    SELECT tablename INTO table_name
    FROM pg_tables
    WHERE schemaname = 'public'
    AND (
        tablename = 'BookingStaffAssignment' OR
        tablename = 'Booking_Staff_Assignment' OR
        tablename = 'booking_staff_assignment' OR
        tablename = 'bookingstaffassignment' OR
        tablename = 'Booking_StaffAssignment' OR
        tablename = 'bookingStaffAssignment'
    )
    LIMIT 1;

    -- If not found, try to find any table with "staff" and "assignment" in the name
    IF table_name IS NULL THEN
        SELECT tablename INTO table_name
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename ILIKE '%staff%'
        AND tablename ILIKE '%assignment%'
        LIMIT 1;
    END IF;

    -- If still not found, raise an error with helpful message
    IF table_name IS NULL THEN
        RAISE EXCEPTION 'Table BookingStaffAssignment not found. Please run the "list-all-tables.sql" query first to see available tables.';
    END IF;

    RAISE NOTICE 'Found table: %', table_name;
    index_name := table_name || '_briefToken_key';

    -- Add columns
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "briefStatus" TEXT DEFAULT ''pending''', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "briefToken" TEXT', table_name);

    -- Create unique index
    EXECUTE format('CREATE UNIQUE INDEX IF NOT EXISTS %I ON %I ("briefToken") WHERE "briefToken" IS NOT NULL', 
        index_name, table_name);

    -- Update existing records
    EXECUTE format('UPDATE %I SET "briefStatus" = ''pending'' WHERE "briefStatus" IS NULL', table_name);

    RAISE NOTICE 'Successfully added briefStatus, acknowledgedAt, and briefToken columns to table: %', table_name;
END $$;
