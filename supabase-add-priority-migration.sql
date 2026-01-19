-- Migration: Add priority field to Booking table
-- Run this in Supabase SQL Editor

ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "priority" TEXT DEFAULT 'medium';

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'Booking' 
AND column_name = 'priority';
