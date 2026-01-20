-- ============================================
-- QUICK SUPABASE AUDIT
-- Fast check for critical issues
-- ============================================

-- 1. Does BookingStaffAssignment table exist?
SELECT 
    'BookingStaffAssignment Table' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
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
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END AS status
UNION ALL
SELECT 
    'acknowledgedAt column',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND column_name = 'acknowledgedAt'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END
UNION ALL
SELECT 
    'briefToken column',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND column_name = 'briefToken'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END;

-- 3. List all tables (to see naming convention)
SELECT 
    'All Tables' as info_type,
    table_name as value
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
