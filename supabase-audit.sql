-- ============================================
-- SUPABASE DATABASE AUDIT SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor to check your database structure
-- Compare results with your Prisma schema to find any missing fields/tables
-- ============================================

-- 1. LIST ALL TABLES IN YOUR DATABASE
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. CHECK BOOKING TABLE STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'Booking' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. CHECK IF PRIORITY FIELD EXISTS IN BOOKING
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Booking' 
AND column_name = 'priority';

-- 4. CHECK USER TABLE STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'User' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. CHECK FREELANCECREW TABLE (if it exists)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'FreelanceCrew' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- If no results, the table doesn't exist yet. Run supabase-migration.sql to create it.

-- 6. CHECK BOOKINGSTAFFASSIGNMENT TABLE (if it exists)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'BookingStaffAssignment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- If no results, the table doesn't exist yet. Run supabase-migration.sql to create it.

-- 7. CHECK VENUE_ASSETS TABLE (if it exists)
-- Note: This table might be named "VenueAsset" (PascalCase) or "venue_assets" (snake_case)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('VenueAsset', 'venue_assets')
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- If no results, the table doesn't exist yet. See SUPABASE_AUDIT_GUIDE.md for creation SQL.

-- 8. LIST ALL INDEXES
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 9. CHECK FOREIGN KEY CONSTRAINTS
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 10. CHECK FOR MISSING COLUMNS IN BOOKING TABLE
-- Compare this with your Prisma schema to see what's missing
-- Expected columns based on recent changes:
-- - priority (TEXT, default 'medium')
-- - termsAccepted (BOOLEAN)
-- - termsAcceptedAt (TIMESTAMP)
-- - emailsSent (JSON)
-- - musicRequests (TEXT)
-- - staffAssignments relation

-- 11. COUNT RECORDS IN KEY TABLES (core tables only)
-- Note: We can only safely count tables that definitely exist
-- For optional tables (FreelanceCrew, BookingStaffAssignment), check existence first using queries above

SELECT 
    'Booking' as table_name, 
    COUNT(*) as record_count 
FROM "Booking"
UNION ALL
SELECT 
    'User' as table_name, 
    COUNT(*) as record_count 
FROM "User";

-- 11a. COUNT OPTIONAL TABLES (run these separately ONLY if tables exist)
-- To count FreelanceCrew, first verify it exists (see query 5), then run:
-- SELECT 'FreelanceCrew' as table_name, COUNT(*) as record_count FROM "FreelanceCrew";

-- To count BookingStaffAssignment, first verify it exists (see query 6), then run:
-- SELECT 'BookingStaffAssignment' as table_name, COUNT(*) as record_count FROM "BookingStaffAssignment";

-- ============================================
-- QUICK FIXES FOR COMMON MISSING FIELDS
-- ============================================

-- If priority is missing from Booking:
-- ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "priority" TEXT DEFAULT 'medium';

-- If venue_assets table is missing:
-- CREATE TABLE IF NOT EXISTS "venue_assets" (
--     "id" TEXT PRIMARY KEY,
--     "venue_name" TEXT NOT NULL,
--     "pdf_url" TEXT NOT NULL,
--     "is_active" BOOLEAN DEFAULT true,
--     "created_at" TIMESTAMP DEFAULT now(),
--     "updated_at" TIMESTAMP DEFAULT now(),
--     UNIQUE("venue_name", "is_active")
-- );
