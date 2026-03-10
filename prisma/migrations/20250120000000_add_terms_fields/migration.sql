-- Add termsAcceptedByUserId: which user accepted terms (audit trail)
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "termsAcceptedByUserId" TEXT;
ALTER TABLE "HireOrder" ADD COLUMN IF NOT EXISTS "termsAcceptedByUserId" TEXT;

-- Add termsAcceptedVersion: which version of terms was accepted
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "termsAcceptedVersion" TEXT;
