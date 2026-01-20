-- Drop all triggers on Booking table to fix venue_fingerprint error
DROP TRIGGER IF EXISTS update_booking_venue_fingerprint ON "Booking";
DROP TRIGGER IF EXISTS set_booking_venue_fingerprint ON "Booking";
DROP TRIGGER IF EXISTS update_booking_updated_at ON "Booking";
DROP TRIGGER IF EXISTS set_venue_fingerprint_trigger ON "Booking";

-- Drop any functions that might be causing issues
DROP FUNCTION IF EXISTS set_venue_fingerprint() CASCADE;
DROP FUNCTION IF EXISTS update_venue_fingerprint() CASCADE;
