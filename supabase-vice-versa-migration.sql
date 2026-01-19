-- Vice Versa Admin Dashboard Migration
-- Adds fields for reciprocal hand-off system and conflict detection

-- Add isTechReady column (technical review complete, ready for quote)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "isTechReady" BOOLEAN DEFAULT false;

-- Add venueFingerprint column (normalized venue identifier for conflict detection)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "venueFingerprint" TEXT;

-- Update assignedTo to use "husband" instead of "you" for consistency
-- Note: This is a data migration - you may need to update existing records
UPDATE "Booking" 
SET "assignedTo" = 'husband' 
WHERE "assignedTo" = 'you';

-- Create index on venueFingerprint for faster conflict detection
CREATE INDEX IF NOT EXISTS "Booking_venueFingerprint_idx" 
ON "Booking"("venueFingerprint");

-- Create composite index on venueFingerprint and eventDate for conflict checking
CREATE INDEX IF NOT EXISTS "Booking_venueFingerprint_eventDate_idx" 
ON "Booking"("venueFingerprint", "eventDate");

-- Create index on isTechReady for filtering
CREATE INDEX IF NOT EXISTS "Booking_isTechReady_idx" 
ON "Booking"("isTechReady");

COMMENT ON COLUMN "Booking"."isTechReady" IS 'Technical review complete, ready for quote (true) or still under review (false)';
COMMENT ON COLUMN "Booking"."venueFingerprint" IS 'Normalized venue identifier for conflict detection (date + venue postcode hash)';
