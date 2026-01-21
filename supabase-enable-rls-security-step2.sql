-- Step 2: Create public read policies for tables that need public access
-- Run this second in Supabase SQL Editor

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to active DJs" ON "DJ";
DROP POLICY IF EXISTS "Allow public read access to active musicians" ON "Musician";
DROP POLICY IF EXISTS "Allow public read access to active hire items" ON "HireItem";
DROP POLICY IF EXISTS "Allow public read access to venue assets" ON "VenueAsset";
DROP POLICY IF EXISTS "Allow public insert to form submissions" ON "FormSubmission";

-- DJ table: Allow public read access for active DJs only
CREATE POLICY "Allow public read access to active DJs"
  ON "DJ"
  FOR SELECT
  USING (isActive = true);

-- Musician table: Allow public read access for active musicians
CREATE POLICY "Allow public read access to active musicians"
  ON "Musician"
  FOR SELECT
  USING (isActive = true);

-- HireItem table: Allow public read access for active hire items
CREATE POLICY "Allow public read access to active hire items"
  ON "HireItem"
  FOR SELECT
  USING (isActive = true);

-- VenueAsset table: Allow public read access
CREATE POLICY "Allow public read access to venue assets"
  ON "VenueAsset"
  FOR SELECT
  USING (true);

-- FormSubmission: Allow public insert (for contact forms)
CREATE POLICY "Allow public insert to form submissions"
  ON "FormSubmission"
  FOR INSERT
  WITH CHECK (true);
