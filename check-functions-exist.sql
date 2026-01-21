-- Check if functions exist in your database
-- Run this in Supabase SQL Editor first

SELECT 
  proname AS function_name,
  pg_get_function_identity_arguments(oid) AS arguments,
  pg_get_functiondef(oid) AS definition
FROM pg_proc
WHERE proname IN ('generate_booking_fingerprint', 'log_booking_change')
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;
