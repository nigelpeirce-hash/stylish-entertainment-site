-- Direct fix: Add the missing columns to BookingStaffAssignment
-- This will work regardless of the exact table name format

-- Try each possible table name variation
DO $$
DECLARE
    table_found BOOLEAN := false;
BEGIN
    -- Try BookingStaffAssignment
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'BookingStaffAssignment') THEN
        ALTER TABLE "BookingStaffAssignment" ADD COLUMN IF NOT EXISTS "briefStatus" TEXT DEFAULT 'pending';
        ALTER TABLE "BookingStaffAssignment" ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP;
        ALTER TABLE "BookingStaffAssignment" ADD COLUMN IF NOT EXISTS "briefToken" TEXT;
        CREATE UNIQUE INDEX IF NOT EXISTS "BookingStaffAssignment_briefToken_key" ON "BookingStaffAssignment"("briefToken") WHERE "briefToken" IS NOT NULL;
        UPDATE "BookingStaffAssignment" SET "briefStatus" = 'pending' WHERE "briefStatus" IS NULL;
        RAISE NOTICE 'Added columns to BookingStaffAssignment';
        table_found := true;
    END IF;

    -- Try Booking_Staff_Assignment
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Booking_Staff_Assignment') THEN
        ALTER TABLE "Booking_Staff_Assignment" ADD COLUMN IF NOT EXISTS "briefStatus" TEXT DEFAULT 'pending';
        ALTER TABLE "Booking_Staff_Assignment" ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP;
        ALTER TABLE "Booking_Staff_Assignment" ADD COLUMN IF NOT EXISTS "briefToken" TEXT;
        CREATE UNIQUE INDEX IF NOT EXISTS "Booking_Staff_Assignment_briefToken_key" ON "Booking_Staff_Assignment"("briefToken") WHERE "briefToken" IS NOT NULL;
        UPDATE "Booking_Staff_Assignment" SET "briefStatus" = 'pending' WHERE "briefStatus" IS NULL;
        RAISE NOTICE 'Added columns to Booking_Staff_Assignment';
        table_found := true;
    END IF;

    -- Try booking_staff_assignment
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'booking_staff_assignment') THEN
        ALTER TABLE booking_staff_assignment ADD COLUMN IF NOT EXISTS "briefStatus" TEXT DEFAULT 'pending';
        ALTER TABLE booking_staff_assignment ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP;
        ALTER TABLE booking_staff_assignment ADD COLUMN IF NOT EXISTS "briefToken" TEXT;
        CREATE UNIQUE INDEX IF NOT EXISTS booking_staff_assignment_briefToken_key ON booking_staff_assignment("briefToken") WHERE "briefToken" IS NOT NULL;
        UPDATE booking_staff_assignment SET "briefStatus" = 'pending' WHERE "briefStatus" IS NULL;
        RAISE NOTICE 'Added columns to booking_staff_assignment';
        table_found := true;
    END IF;

    IF NOT table_found THEN
        RAISE EXCEPTION 'BookingStaffAssignment table not found. Please run check-staff-assignment-columns.sql first to find the table name.';
    END IF;
END $$;
