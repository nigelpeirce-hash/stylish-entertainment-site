-- Add termsAcceptedByUserId to Booking and HireOrder
-- Run: psql $DATABASE_URL -f prisma/migrations/add_terms_accepted_by_user_id.sql

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "termsAcceptedByUserId" TEXT;
ALTER TABLE "HireOrder" ADD COLUMN IF NOT EXISTS "termsAcceptedByUserId" TEXT;
