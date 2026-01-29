-- Venue finding & load-in: private house, What3words, load-in notes
-- Run in Supabase SQL editor.

ALTER TABLE "Booking"
  ADD COLUMN IF NOT EXISTS "venueIsPrivateHouse" boolean,
  ADD COLUMN IF NOT EXISTS "venueWhat3Words" text,
  ADD COLUMN IF NOT EXISTS "venueLoadInNotes" text;

COMMENT ON COLUMN "Booking"."venueIsPrivateHouse" IS 'If true: often just postcode; offer address block, What3words, load-in notes';
COMMENT ON COLUMN "Booking"."venueWhat3Words" IS 'e.g. filled.count.soap – pinpoints exact location for crew';
COMMENT ON COLUMN "Booking"."venueLoadInNotes" IS 'Access/load-in specifics: 163 steps to beach, load-in horrible, etc.';
