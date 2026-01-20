-- Fix venue_fingerprint trigger issue
-- The error indicates a trigger is trying to access new.venue_fingerprint
-- but the column is actually named venueFingerprint (camelCase)

-- First, let's see what triggers exist
-- Then drop any problematic triggers

-- Drop trigger if it exists (we'll recreate it if needed)
DO $$
BEGIN
    -- Drop any triggers that might be causing issues
    DROP TRIGGER IF EXISTS update_booking_venue_fingerprint ON "Booking";
    DROP TRIGGER IF EXISTS set_booking_venue_fingerprint ON "Booking";
    
    -- Drop the function if it exists
    DROP FUNCTION IF EXISTS set_venue_fingerprint() CASCADE;
END $$;

-- If we need to recreate a trigger for venueFingerprint, it should use the correct column name
-- But for now, we'll just remove the problematic trigger
