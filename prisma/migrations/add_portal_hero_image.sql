-- Add portalHeroImageUrl for client-uploaded hero photo (venue or couple) in portal
ALTER TABLE "Booking"
ADD COLUMN IF NOT EXISTS "portalHeroImageUrl" TEXT;
