-- Client home address (and phone already exist: phoneAreaCode, phoneNumber)
-- Run in Supabase SQL editor. Required for: manual booking, book-from-quote, client portal.

ALTER TABLE "Booking"
  ADD COLUMN IF NOT EXISTS "clientAddress"   text,
  ADD COLUMN IF NOT EXISTS "clientAddress2"  text,
  ADD COLUMN IF NOT EXISTS "clientTown"      text,
  ADD COLUMN IF NOT EXISTS "clientCounty"    text,
  ADD COLUMN IF NOT EXISTS "clientPostcode"  text;

COMMENT ON COLUMN "Booking"."clientAddress"   IS 'Client home address line 1';
COMMENT ON COLUMN "Booking"."clientAddress2"  IS 'Client home address line 2';
COMMENT ON COLUMN "Booking"."clientTown"      IS 'Client home town';
COMMENT ON COLUMN "Booking"."clientCounty"    IS 'Client home county';
COMMENT ON COLUMN "Booking"."clientPostcode"  IS 'Client home postcode';
