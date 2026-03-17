-- Batch 1: Pre-launch token hardening
-- R1.1: Add portal token expiry to Booking
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "portalTokenExpiresAt" TIMESTAMP(3);

-- R1.2: Add secure invite token fields to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "inviteToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "inviteTokenExpiresAt" TIMESTAMP(3);
