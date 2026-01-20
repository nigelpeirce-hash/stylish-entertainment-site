-- ============================================
-- SIMPLE SUPABASE AUDIT
-- Checks critical tables and columns
-- ============================================

-- 1. Check if BookingStaffAssignment table exists
SELECT 
    'BookingStaffAssignment Table' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END AS status;

-- 2. Check for missing columns in BookingStaffAssignment
SELECT 
    'briefStatus column' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND column_name = 'briefStatus'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END AS status;

SELECT 
    'acknowledgedAt column' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND column_name = 'acknowledgedAt'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END AS status;

SELECT 
    'briefToken column' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND column_name = 'briefToken'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END AS status;

-- 3. List all tables (to see naming convention)
SELECT 
    'All Tables' as info_type,
    table_name as value
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 4. Show actual columns in BookingStaffAssignment (if it exists)
SELECT 
    'BookingStaffAssignment Columns' as info_type,
    column_name as value,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'BookingStaffAssignment'
ORDER BY column_name;
