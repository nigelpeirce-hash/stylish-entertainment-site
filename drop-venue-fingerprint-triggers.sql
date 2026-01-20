-- Drop all triggers on Booking table that might reference venue_fingerprint
-- This fixes the error: record "new" has no field "venue_fingerprint"

DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    -- Find and drop all triggers on Booking table
    FOR trigger_record IN 
        SELECT tgname, oid
        FROM pg_trigger
        WHERE tgrelid = '"Booking"'::regclass
        AND NOT tgisinternal
    LOOP
        -- Drop the trigger
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON "Booking"', trigger_record.tgname);
        RAISE NOTICE 'Dropped trigger: %', trigger_record.tgname;
    END LOOP;
END $$;

-- Also drop any functions that might reference venue_fingerprint
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Find functions that reference venue_fingerprint
    FOR func_record IN
        SELECT p.proname, p.oid
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND pg_get_functiondef(p.oid) LIKE '%venue_fingerprint%'
    LOOP
        -- Drop the function
        EXECUTE format('DROP FUNCTION IF EXISTS %I CASCADE', func_record.proname);
        RAISE NOTICE 'Dropped function: %', func_record.proname;
    END LOOP;
END $$;
