-- ============================================
-- SUPABASE DATABASE AUDIT SCRIPT (SAFE VERSION)
-- ============================================
-- This version safely handles missing tables without errors
-- Run this in Supabase SQL Editor to check your database structure
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

-- 5. CHECK IF FREELANCECREW TABLE EXISTS
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'FreelanceCrew' AND table_schema = 'public')
        THEN 'EXISTS'
        ELSE 'DOES NOT EXIST - Run supabase-migration.sql to create it'
    END as freelance_crew_status;

-- 5a. IF FREELANCECREW EXISTS, SHOW ITS STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'FreelanceCrew' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. CHECK IF BOOKINGSTAFFASSIGNMENT TABLE EXISTS
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'BookingStaffAssignment' AND table_schema = 'public')
        THEN 'EXISTS'
        ELSE 'DOES NOT EXIST - Run supabase-migration.sql to create it'
    END as booking_staff_assignment_status;

-- 6a. IF BOOKINGSTAFFASSIGNMENT EXISTS, SHOW ITS STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'BookingStaffAssignment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. CHECK IF VENUE_ASSETS TABLE EXISTS (check both naming conventions)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'VenueAsset' AND table_schema = 'public')
        THEN 'EXISTS (as VenueAsset)'
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'venue_assets' AND table_schema = 'public')
        THEN 'EXISTS (as venue_assets)'
        ELSE 'DOES NOT EXIST - See SUPABASE_AUDIT_GUIDE.md for creation SQL'
    END as venue_assets_status;

-- 7a. IF VENUE_ASSETS EXISTS, SHOW ITS STRUCTURE
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('VenueAsset', 'venue_assets')
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

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

-- 10. COUNT RECORDS IN KEY TABLES (safe - only counts if tables exist)
-- Note: We can only safely count tables that definitely exist
-- For optional tables, we'll check existence separately

SELECT 
    'Booking' as table_name, 
    COUNT(*) as record_count 
FROM "Booking"
UNION ALL
SELECT 
    'User' as table_name, 
    COUNT(*) as record_count 
FROM "User";

-- 10a. COUNT FREELANCECREW (only if it exists - run separately if needed)
-- Uncomment the block below ONLY if FreelanceCrew table exists:
/*
SELECT 
    'FreelanceCrew' as table_name, 
    COUNT(*) as record_count 
FROM "FreelanceCrew";
*/

-- 10b. COUNT BOOKINGSTAFFASSIGNMENT (only if it exists - run separately if needed)
-- Uncomment the block below ONLY if BookingStaffAssignment table exists:
/*
SELECT 
    'BookingStaffAssignment' as table_name, 
    COUNT(*) as record_count 
FROM "BookingStaffAssignment";
*/

-- ============================================
-- SUMMARY: MISSING TABLES CHECK
-- ============================================
SELECT 
    'FreelanceCrew' as table_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'FreelanceCrew' AND table_schema = 'public')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING - Run: supabase-migration.sql'
    END as status
UNION ALL
SELECT 
    'BookingStaffAssignment' as table_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'BookingStaffAssignment' AND table_schema = 'public')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING - Run: supabase-migration.sql'
    END as status
UNION ALL
SELECT 
    'VenueAsset/venue_assets' as table_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'VenueAsset' AND table_schema = 'public')
        THEN '✅ EXISTS (as VenueAsset)'
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'venue_assets' AND table_schema = 'public')
        THEN '✅ EXISTS (as venue_assets)'
        ELSE '❌ MISSING - See SUPABASE_AUDIT_GUIDE.md'
    END as status;
