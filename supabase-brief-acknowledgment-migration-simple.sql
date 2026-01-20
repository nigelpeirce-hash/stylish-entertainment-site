-- Simple Migration: Add briefStatus, acknowledgedAt, and briefToken
-- Try these table name variations one at a time until one works

-- Option 1: Try with underscores (most common Prisma convention)
ALTER TABLE "Booking_Staff_Assignment"
ADD COLUMN IF NOT EXISTS "briefStatus" TEXT DEFAULT 'pending';

ALTER TABLE "Booking_Staff_Assignment"
ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP;

ALTER TABLE "Booking_Staff_Assignment"
ADD COLUMN IF NOT EXISTS "briefToken" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Booking_Staff_Assignment_briefToken_key" 
ON "Booking_Staff_Assignment" ("briefToken") 
WHERE "briefToken" IS NOT NULL;

UPDATE "Booking_Staff_Assignment"
SET "briefStatus" = 'pending'
WHERE "briefStatus" IS NULL;
