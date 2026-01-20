-- ============================================
-- SUPABASE DATABASE AUDIT
-- Compares Prisma Schema vs Actual Database
-- ============================================

-- PART 1: List ALL tables in the database
SELECT 
    '=== ALL TABLES IN DATABASE ===' as section;

SELECT 
    table_name,
    'EXISTS' as status
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- PART 2: Check for expected Prisma tables
SELECT 
    '=== EXPECTED PRISMA TABLES CHECK ===' as section;

-- List of expected tables from Prisma schema
WITH expected_tables AS (
    SELECT unnest(ARRAY[
        'Account',
        'Session',
        'VerificationToken',
        'User',
        'Booking',
        'NewEnquiry',
        'FreelanceCrew',
        'BookingStaffAssignment',
        'AuditLog',
        'CommsLog',
        'Email',
        'EmailThread',
        'EmailTemplate',
        'Task',
        'Note',
        'FormSubmission',
        'Cart',
        'CartItem',
        'HireItem',
        'HireOrder',
        'HireOrderItem',
        'Venue',
        'VenueAsset',
        'Staff_Settings'
    ]) AS table_name
)
SELECT 
    et.table_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND information_schema.tables.table_name = et.table_name
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END AS status
FROM expected_tables et
ORDER BY et.table_name;

-- PART 3: Check BookingStaffAssignment columns (the one causing issues)
SELECT 
    '=== BookingStaffAssignment COLUMNS AUDIT ===' as section;

-- Expected columns for BookingStaffAssignment
WITH expected_columns AS (
    SELECT unnest(ARRAY[
        'id',
        'bookingId',
        'staffId',
        'role',
        'agreedFee',
        'status',
        'confirmationEmailSent',
        'confirmationSentAt',
        'cancellationReason',
        'cancelledAt',
        'briefStatus',
        'acknowledgedAt',
        'briefToken',
        'createdAt',
        'updatedAt'
    ]) AS column_name
)
SELECT 
    ec.column_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND information_schema.columns.column_name = ec.column_name
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END AS status,
    COALESCE(
        (SELECT data_type FROM information_schema.columns 
         WHERE table_schema = 'public' 
         AND table_name = 'BookingStaffAssignment'
         AND information_schema.columns.column_name = ec.column_name),
        'N/A'
    ) AS data_type
FROM expected_columns ec
ORDER BY ec.column_name;

-- PART 4: Check actual BookingStaffAssignment columns (if table exists)
SELECT 
    '=== ACTUAL BookingStaffAssignment COLUMNS ===' as section;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'BookingStaffAssignment'
ORDER BY column_name;

-- PART 5: Check for tables with similar names (in case of naming mismatch)
SELECT 
    '=== TABLES WITH "staff" OR "assignment" IN NAME ===' as section;

SELECT 
    table_name,
    'FOUND' as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND (
    table_name ILIKE '%staff%' OR
    table_name ILIKE '%assignment%'
)
ORDER BY table_name;

-- PART 6: Check Booking table structure (parent table)
SELECT 
    '=== Booking TABLE COLUMNS (Sample) ===' as section;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'Booking'
ORDER BY column_name
LIMIT 20;

-- PART 7: Check FreelanceCrew table structure (parent table)
SELECT 
    '=== FreelanceCrew TABLE COLUMNS (Sample) ===' as section;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'FreelanceCrew'
ORDER BY column_name
LIMIT 20;

-- PART 8: Summary of missing critical columns
SELECT 
    '=== SUMMARY: MISSING CRITICAL COLUMNS ===' as section;

SELECT 
    'BookingStaffAssignment.briefStatus' as missing_column,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND column_name = 'briefStatus'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING - NEEDS MIGRATION'
    END AS status
UNION ALL
SELECT 
    'BookingStaffAssignment.acknowledgedAt',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND column_name = 'acknowledgedAt'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING - NEEDS MIGRATION'
    END
UNION ALL
SELECT 
    'BookingStaffAssignment.briefToken',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'BookingStaffAssignment'
            AND column_name = 'briefToken'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING - NEEDS MIGRATION'
    END;
