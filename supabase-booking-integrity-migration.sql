-- Booking Integrity Migration
-- Adds booking_reference column and indexes for conflict detection

-- Add booking_reference column with format SE-YYYY-ShortID
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "booking_reference" TEXT UNIQUE;

-- Create index on booking_reference for faster lookups
CREATE INDEX IF NOT EXISTS "Booking_booking_reference_idx" 
ON "Booking"("booking_reference");

-- Create composite index for conflict detection (eventDate + venuePostcode)
CREATE INDEX IF NOT EXISTS "Booking_eventDate_venuePostcode_idx" 
ON "Booking"("eventDate", "venuePostcode");

-- Add index on email for faster conflict checks
CREATE INDEX IF NOT EXISTS "Booking_email_idx" 
ON "Booking"("email");

-- Function to generate booking reference (SE-YYYY-ShortID)
-- Format: SE-2024-A1B2C3 (where A1B2C3 is a 6-character alphanumeric short ID)
CREATE OR REPLACE FUNCTION generate_booking_reference() RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  short_id TEXT;
  reference TEXT;
  exists_check INTEGER;
BEGIN
  -- Get current year
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Generate unique short ID (6 characters, alphanumeric)
  LOOP
    short_id := UPPER(
      SUBSTRING(
        MD5(RANDOM()::TEXT || CURRENT_TIMESTAMP::TEXT) 
        FROM 1 FOR 6
      )
    );
    
    -- Create reference
    reference := 'SE-' || year_part || '-' || short_id;
    
    -- Check if it already exists
    SELECT COUNT(*) INTO exists_check 
    FROM "Booking" 
    WHERE "booking_reference" = reference;
    
    -- Exit loop if unique
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN reference;
END;
$$ LANGUAGE plpgsql;

-- Update existing bookings with generated references (one-time migration)
-- Note: Run this separately if needed for existing bookings
-- UPDATE "Booking" SET "booking_reference" = generate_booking_reference() WHERE "booking_reference" IS NULL;

COMMENT ON COLUMN "Booking"."booking_reference" IS 'Unique booking reference in format SE-YYYY-ShortID for email threading and conflict detection';
