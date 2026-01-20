-- Simple table existence check
-- Run this first to see what tables you have

SELECT 
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
