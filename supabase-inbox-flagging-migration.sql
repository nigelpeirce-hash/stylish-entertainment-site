-- Simple Inbox Flagging System Migration
-- Adds flaggedFor field for priority flagging in inbox view

-- Add flaggedFor column (for simple inbox flagging system)
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "flaggedFor" TEXT;

-- Create index on flaggedFor for faster filtering
CREATE INDEX IF NOT EXISTS "Booking_flaggedFor_idx" 
ON "Booking"("flaggedFor");

COMMENT ON COLUMN "Booking"."flaggedFor" IS 'Priority flag for inbox: "user1" or "user2" (for simple inbox flagging system)';
