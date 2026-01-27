-- Fix spelling mistake: "Babington Houe" → "Babington House"
-- Run this SQL script in your Supabase SQL editor or via psql

-- Fix in Booking table
UPDATE "Booking"
SET "venueName" = REPLACE("venueName", 'Babington Houe', 'Babington House')
WHERE "venueName" ILIKE '%Babington Houe%';

-- Fix in VenueAsset table
UPDATE "VenueAsset"
SET "venueName" = REPLACE("venueName", 'Babington Houe', 'Babington House')
WHERE "venueName" ILIKE '%Babington Houe%';

-- Fix in Venue table (if it exists)
UPDATE "Venue"
SET "venueName" = REPLACE("venueName", 'Babington Houe', 'Babington House')
WHERE "venueName" ILIKE '%Babington Houe%';

-- Check how many were fixed
SELECT 
  (SELECT COUNT(*) FROM "Booking" WHERE "venueName" ILIKE '%Babington Houe%') as remaining_bookings,
  (SELECT COUNT(*) FROM "VenueAsset" WHERE "venueName" ILIKE '%Babington Houe%') as remaining_assets,
  (SELECT COUNT(*) FROM "Venue" WHERE "venueName" ILIKE '%Babington Houe%') as remaining_venues;
