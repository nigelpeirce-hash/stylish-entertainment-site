-- Find the actual table name for BookingStaffAssignment
-- Run this first to see what the table is actually called

SELECT 
    table_name,
    table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
AND (
    table_name ILIKE '%booking%staff%assignment%' OR
    table_name ILIKE '%staff%assignment%'
)
ORDER BY table_name;

-- Also list all tables to see the naming convention
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
