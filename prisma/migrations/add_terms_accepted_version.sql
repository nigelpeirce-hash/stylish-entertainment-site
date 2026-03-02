-- Add termsAcceptedVersion to Booking (terms version at acceptance for traceability)
-- Run: psql $DATABASE_URL -f prisma/migrations/add_terms_accepted_version.sql

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "termsAcceptedVersion" TEXT;
