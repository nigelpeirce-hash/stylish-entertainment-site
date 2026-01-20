-- Check if BookingStaffAssignment table exists and has the required columns
-- Run this in Supabase SQL Editor

-- First, find the actual table name
SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND (
    table_name ILIKE '%staff%assignment%' OR
    table_name ILIKE '%booking%staff%'
)
ORDER BY table_name;

-- Then check columns (replace 'BookingStaffAssignment' with actual table name from above)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'BookingStaffAssignment'
ORDER BY column_name;
