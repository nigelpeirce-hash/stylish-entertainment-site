-- Add portalHeroImageUrl: client-uploaded hero photo (venue or couple) shown in client portal
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "portalHeroImageUrl" TEXT;
