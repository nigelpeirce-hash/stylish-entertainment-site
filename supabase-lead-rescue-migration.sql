-- Lead Rescue Migration
-- Adds purgeAt and rescuedAt fields to Booking table

-- Add purgeAt column (date when booking should be purged/cleaned up if inactive)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "purgeAt" TIMESTAMP WITH TIME ZONE;

-- Add rescuedAt column (date when lead was rescued via rescue link)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "rescuedAt" TIMESTAMP WITH TIME ZONE;

-- Create index on purgeAt for efficient cleanup queries
CREATE INDEX IF NOT EXISTS "Booking_purgeAt_idx" 
ON "Booking"("purgeAt");

-- Create index on rescuedAt for tracking rescue activity
CREATE INDEX IF NOT EXISTS "Booking_rescuedAt_idx" 
ON "Booking"("rescuedAt");

-- Create index on status for filtering rescued leads
CREATE INDEX IF NOT EXISTS "Booking_status_idx" 
ON "Booking"("status");

COMMENT ON COLUMN "Booking"."purgeAt" IS 'Date when booking should be purged/cleaned up if inactive';
COMMENT ON COLUMN "Booking"."rescuedAt" IS 'Date when lead was rescued via rescue link';

-- Function to extend retention (Supabase RPC - optional, can be used instead of API route)
CREATE OR REPLACE FUNCTION extend_retention(booking_id UUID)
RETURNS JSON AS $$
DECLARE
  current_purge_date TIMESTAMP WITH TIME ZONE;
  new_purge_date TIMESTAMP WITH TIME ZONE;
  booking_record RECORD;
BEGIN
  -- Get current booking record
  SELECT id, name, email, "eventDate", "venueName", status, "purgeAt"
  INTO booking_record
  FROM "Booking"
  WHERE id = booking_id;

  -- Check if booking exists
  IF booking_record.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Booking not found'
    );
  END IF;

  -- Calculate new purge date (30 days from now or 30 days from current purge_at)
  current_purge_date := booking_record."purgeAt";
  new_purge_date := COALESCE(
    current_purge_date + INTERVAL '30 days',
    NOW() + INTERVAL '30 days'
  );

  -- Update booking
  UPDATE "Booking"
  SET 
    "purgeAt" = new_purge_date,
    "rescuedAt" = NOW(),
    status = 'Active - Follow Up Requested'
  WHERE id = booking_id;

  -- Return success with booking info
  RETURN json_build_object(
    'success', true,
    'message', 'Retention period extended successfully',
    'booking', json_build_object(
      'name', booking_record.name,
      'eventDate', booking_record."eventDate",
      'venueName', booking_record."venueName",
      'newPurgeDate', new_purge_date
    )
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION extend_retention(UUID) IS 'Extends booking retention by 30 days and sets status to Active - Follow Up Requested';
