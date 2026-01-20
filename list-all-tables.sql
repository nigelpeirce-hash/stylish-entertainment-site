-- List ALL tables in the public schema to see naming convention
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Also check for any table with "staff" in the name
SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name ILIKE '%staff%'
ORDER BY table_name;

-- Check for any table with "assignment" in the name
SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name ILIKE '%assignment%'
ORDER BY table_name;
