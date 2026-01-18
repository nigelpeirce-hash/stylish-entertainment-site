-- Supabase Migration: Add FreelanceCrew and BookingStaffAssignment tables
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. Create FreelanceCrew table
-- ============================================

CREATE TABLE IF NOT EXISTS "FreelanceCrew" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create indexes for FreelanceCrew
CREATE INDEX IF NOT EXISTS "FreelanceCrew_name_idx" ON "FreelanceCrew"("name");
CREATE INDEX IF NOT EXISTS "FreelanceCrew_isActive_idx" ON "FreelanceCrew"("isActive");

-- ============================================
-- 2. Create BookingStaffAssignment table
-- ============================================

CREATE TABLE IF NOT EXISTS "BookingStaffAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "agreedFee" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'held',
    "confirmationEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "confirmationSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    -- Foreign key constraints
    CONSTRAINT "BookingStaffAssignment_bookingId_fkey" 
        FOREIGN KEY ("bookingId") 
        REFERENCES "Booking"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT "BookingStaffAssignment_staffId_fkey" 
        FOREIGN KEY ("staffId") 
        REFERENCES "FreelanceCrew"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Create unique constraint for bookingId + staffId combination
-- This ensures one staff member can only be assigned once per booking
CREATE UNIQUE INDEX IF NOT EXISTS "BookingStaffAssignment_bookingId_staffId_key" 
    ON "BookingStaffAssignment"("bookingId", "staffId");

-- Create indexes for BookingStaffAssignment
CREATE INDEX IF NOT EXISTS "BookingStaffAssignment_bookingId_idx" 
    ON "BookingStaffAssignment"("bookingId");
CREATE INDEX IF NOT EXISTS "BookingStaffAssignment_staffId_idx" 
    ON "BookingStaffAssignment"("staffId");
CREATE INDEX IF NOT EXISTS "BookingStaffAssignment_status_idx" 
    ON "BookingStaffAssignment"("status");

-- ============================================
-- 3. Enable Row Level Security (RLS) - Optional
-- ============================================

-- Uncomment these if you want to enable RLS policies
-- ALTER TABLE "FreelanceCrew" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "BookingStaffAssignment" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Create updatedAt trigger function (if not exists)
-- ============================================

-- This function automatically updates the "updatedAt" timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt on both tables
DROP TRIGGER IF EXISTS update_freelance_crew_updated_at ON "FreelanceCrew";
CREATE TRIGGER update_freelance_crew_updated_at
    BEFORE UPDATE ON "FreelanceCrew"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_booking_staff_assignment_updated_at ON "BookingStaffAssignment";
CREATE TRIGGER update_booking_staff_assignment_updated_at
    BEFORE UPDATE ON "BookingStaffAssignment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verification Queries (optional - run to check)
-- ============================================

-- Check if tables were created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('FreelanceCrew', 'BookingStaffAssignment');

-- Check indexes
-- SELECT indexname, tablename FROM pg_indexes 
-- WHERE tablename IN ('FreelanceCrew', 'BookingStaffAssignment');
