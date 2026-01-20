-- Create BookingStaffAssignment table if it doesn't exist, or add missing columns
-- This handles both cases: table doesn't exist OR table exists but columns are missing

DO $$
DECLARE
    table_exists BOOLEAN;
    table_name TEXT := 'BookingStaffAssignment'; -- Try this name first
    alt_table_name TEXT;
BEGIN
    -- Check if BookingStaffAssignment exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND information_schema.tables.table_name = 'BookingStaffAssignment'
    ) INTO table_exists;

    -- If not found, try alternative names
    IF NOT table_exists THEN
        SELECT pg_tables.tablename INTO alt_table_name
        FROM pg_tables
        WHERE pg_tables.schemaname = 'public'
        AND (
            pg_tables.tablename = 'Booking_Staff_Assignment' OR
            pg_tables.tablename = 'booking_staff_assignment' OR
            pg_tables.tablename = 'bookingstaffassignment'
        )
        LIMIT 1;

        IF alt_table_name IS NOT NULL THEN
            table_name := alt_table_name;
            table_exists := TRUE;
            RAISE NOTICE 'Found table with alternative name: %', table_name;
        END IF;
    END IF;

    -- If table doesn't exist, create it
    IF NOT table_exists THEN
        RAISE NOTICE 'Table does not exist. Creating BookingStaffAssignment table...';
        
        CREATE TABLE "BookingStaffAssignment" (
            id                    TEXT PRIMARY KEY,
            "bookingId"            TEXT NOT NULL,
            "staffId"              TEXT NOT NULL,
            role                   TEXT NOT NULL,
            "agreedFee"            DOUBLE PRECISION NOT NULL,
            status                 TEXT NOT NULL DEFAULT 'held',
            "confirmationEmailSent" BOOLEAN NOT NULL DEFAULT false,
            "confirmationSentAt"    TIMESTAMP,
            "cancellationReason"   TEXT,
            "cancelledAt"          TIMESTAMP,
            "briefStatus"          TEXT DEFAULT 'pending',
            "acknowledgedAt"       TIMESTAMP,
            "briefToken"           TEXT,
            "createdAt"            TIMESTAMP NOT NULL DEFAULT NOW(),
            "updatedAt"            TIMESTAMP NOT NULL DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS "BookingStaffAssignment_bookingId_idx" ON "BookingStaffAssignment"("bookingId");
        CREATE INDEX IF NOT EXISTS "BookingStaffAssignment_staffId_idx" ON "BookingStaffAssignment"("staffId");
        CREATE INDEX IF NOT EXISTS "BookingStaffAssignment_status_idx" ON "BookingStaffAssignment"(status);
        CREATE UNIQUE INDEX IF NOT EXISTS "BookingStaffAssignment_briefToken_key" 
            ON "BookingStaffAssignment"("briefToken") 
            WHERE "briefToken" IS NOT NULL;

        -- Try to add foreign keys if parent tables exist (optional, won't fail if they don't)
        BEGIN
            EXECUTE 'ALTER TABLE "BookingStaffAssignment" ADD CONSTRAINT "BookingStaffAssignment_bookingId_fkey" 
                FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON DELETE CASCADE';
            RAISE NOTICE 'Added foreign key to Booking table';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key to Booking table (may not exist or already exists)';
        END;

        BEGIN
            EXECUTE 'ALTER TABLE "BookingStaffAssignment" ADD CONSTRAINT "BookingStaffAssignment_staffId_fkey" 
                FOREIGN KEY ("staffId") REFERENCES "FreelanceCrew"(id) ON DELETE CASCADE';
            RAISE NOTICE 'Added foreign key to FreelanceCrew table';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key to FreelanceCrew table (may not exist or already exists)';
        END;

        RAISE NOTICE 'Successfully created BookingStaffAssignment table with all columns including briefStatus, acknowledgedAt, and briefToken';
    ELSE
        -- Table exists, just add the missing columns
        RAISE NOTICE 'Table exists. Adding missing columns to: %', table_name;
        
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "briefStatus" TEXT DEFAULT ''pending''', table_name);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP', table_name);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "briefToken" TEXT', table_name);

        -- Create unique index on briefToken if it doesn't exist
        EXECUTE format('CREATE UNIQUE INDEX IF NOT EXISTS %I ON %I ("briefToken") WHERE "briefToken" IS NOT NULL', 
            table_name || '_briefToken_key', table_name);

        -- Update existing records
        EXECUTE format('UPDATE %I SET "briefStatus" = ''pending'' WHERE "briefStatus" IS NULL', table_name);

        RAISE NOTICE 'Successfully added briefStatus, acknowledgedAt, and briefToken columns to existing table: %', table_name;
    END IF;
END $$;
