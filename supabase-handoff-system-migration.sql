-- Reciprocal Hand-off System Migration
-- Adds fields for assigning bookings between wife and you

-- Add assignedTo column (who is currently handling this booking)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "assignedTo" TEXT;

-- Add handoffStatus column (current handoff status)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "handoffStatus" TEXT;

-- Add handoffNote column (note from wife when sending to you for technical review)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "handoffNote" TEXT;

-- Create indexes for faster filtering
CREATE INDEX IF NOT EXISTS "Booking_assignedTo_idx" 
ON "Booking"("assignedTo");

CREATE INDEX IF NOT EXISTS "Booking_handoffStatus_idx" 
ON "Booking"("handoffStatus");

COMMENT ON COLUMN "Booking"."assignedTo" IS 'Who is currently handling: "wife" or "you"';
COMMENT ON COLUMN "Booking"."handoffStatus" IS 'Handoff status: "action_needed", "tech_review", "tech_alert", "awaiting_quote"';
COMMENT ON COLUMN "Booking"."handoffNote" IS 'Note from wife when sending to you for technical review';
