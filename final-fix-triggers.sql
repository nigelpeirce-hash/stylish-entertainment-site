-- Final fix for venue_fingerprint trigger error
-- This will drop ALL triggers on the Booking table

-- Method 1: Drop triggers by name (common ones)
DROP TRIGGER IF EXISTS update_booking_venue_fingerprint ON "Booking" CASCADE;
DROP TRIGGER IF EXISTS set_booking_venue_fingerprint ON "Booking" CASCADE;
DROP TRIGGER IF EXISTS update_venue_fingerprint ON "Booking" CASCADE;
DROP TRIGGER IF EXISTS calculate_venue_fingerprint ON "Booking" CASCADE;

-- Method 2: Use a DO block to drop all triggers
DO $$
DECLARE
    trig_name TEXT;
BEGIN
    FOR trig_name IN 
        SELECT tgname::TEXT
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        WHERE c.relname = 'Booking'
        AND NOT t.tgisinternal
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON "Booking" CASCADE', trig_name);
        RAISE NOTICE 'Dropped trigger: %', trig_name;
    END LOOP;
END $$;

-- Drop any functions that reference venue_fingerprint
DROP FUNCTION IF EXISTS set_venue_fingerprint() CASCADE;
DROP FUNCTION IF EXISTS update_venue_fingerprint() CASCADE;
DROP FUNCTION IF EXISTS calculate_venue_fingerprint() CASCADE;
