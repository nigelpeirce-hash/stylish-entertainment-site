-- Booking Integrity Enhancement Migration
-- Adds authorized_senders array and conflict resolution fields

-- Add authorizedSenders array column (String array)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "authorizedSenders" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add conflictStatus column
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "conflictStatus" TEXT; -- 'pending', 'resolved', 'merged', 'kept_separate'

-- Add conflictResolvedAt timestamp
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "conflictResolvedAt" TIMESTAMP WITH TIME ZONE;

-- Create index on conflictStatus for faster queries
CREATE INDEX IF NOT EXISTS "Booking_conflictStatus_idx" 
ON "Booking"("conflictStatus");

-- Update existing bookings to have empty authorizedSenders array
UPDATE "Booking" 
SET "authorizedSenders" = ARRAY[]::TEXT[] 
WHERE "authorizedSenders" IS NULL;

-- Function to check if email is authorized for a booking
CREATE OR REPLACE FUNCTION is_email_authorized(booking_id UUID, email_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  booking_email TEXT;
  authorized_list TEXT[];
BEGIN
  -- Get booking email and authorized senders
  SELECT email, "authorizedSenders" 
  INTO booking_email, authorized_list
  FROM "Booking" 
  WHERE id = booking_id;
  
  -- Check if email matches primary email
  IF LOWER(TRIM(booking_email)) = LOWER(TRIM(email_address)) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if email is in authorized list (case-insensitive)
  IF authorized_list IS NOT NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM unnest(authorized_list) AS auth_email
      WHERE LOWER(TRIM(auth_email)) = LOWER(TRIM(email_address))
    );
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON COLUMN "Booking"."authorizedSenders" IS 'Array of email addresses authorized to send/receive for this booking';
COMMENT ON COLUMN "Booking"."conflictStatus" IS 'Conflict resolution status: pending, resolved, merged, kept_separate';
COMMENT ON COLUMN "Booking"."conflictResolvedAt" IS 'Timestamp when conflict was resolved';
