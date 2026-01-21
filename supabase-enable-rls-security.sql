-- Enable Row Level Security (RLS) on all public tables
-- This prevents unauthorized access via Supabase's PostgREST API
-- Note: Prisma connections bypass PostgREST, but RLS is still a security best practice

-- Enable RLS on all tables
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FormSubmission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailInbox" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailThread" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Email" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Note" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DJ" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Musician" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingStaffAssignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FreelanceCrew" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewEnquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CommsLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Staff_Settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HireItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HireOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HireOrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VenueAsset" ENABLE ROW LEVEL SECURITY;

-- Create policies for tables that need public read access
-- DJ table: Allow public read access for active DJs only (for /api/djs endpoint)
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

-- VenueAsset table: Allow public read access (brochures, etc.)
CREATE POLICY "Allow public read access to venue assets"
  ON "VenueAsset"
  FOR SELECT
  USING (true);

-- FormSubmission: Allow public insert (for contact forms)
CREATE POLICY "Allow public insert to form submissions"
  ON "FormSubmission"
  FOR INSERT
  WITH CHECK (true);

-- All other tables: Deny all public access
-- These should only be accessible via Prisma with proper authentication
-- Admin access is handled through NextAuth in the application layer

-- Account: Deny all public access (sensitive OAuth tokens)
CREATE POLICY "Deny all public access to accounts"
  ON "Account"
  FOR ALL
  USING (false);

-- VerificationToken: Deny all public access (sensitive tokens)
CREATE POLICY "Deny all public access to verification tokens"
  ON "VerificationToken"
  FOR ALL
  USING (false);

-- Session: Deny all public access
CREATE POLICY "Deny all public access to sessions"
  ON "Session"
  FOR ALL
  USING (false);

-- User: Deny all public access (contains passwords)
CREATE POLICY "Deny all public access to users"
  ON "User"
  FOR ALL
  USING (false);

-- EmailInbox: Deny all public access
CREATE POLICY "Deny all public access to email inboxes"
  ON "EmailInbox"
  FOR ALL
  USING (false);

-- EmailThread: Deny all public access
CREATE POLICY "Deny all public access to email threads"
  ON "EmailThread"
  FOR ALL
  USING (false);

-- Email: Deny all public access
CREATE POLICY "Deny all public access to emails"
  ON "Email"
  FOR ALL
  USING (false);

-- Note: Deny all public access
CREATE POLICY "Deny all public access to notes"
  ON "Note"
  FOR ALL
  USING (false);

-- Task: Deny all public access
CREATE POLICY "Deny all public access to tasks"
  ON "Task"
  FOR ALL
  USING (false);

-- BookingStaffAssignment: Deny all public access
CREATE POLICY "Deny all public access to booking staff assignments"
  ON "BookingStaffAssignment"
  FOR ALL
  USING (false);

-- EmailTemplate: Deny all public access
CREATE POLICY "Deny all public access to email templates"
  ON "EmailTemplate"
  FOR ALL
  USING (false);

-- FreelanceCrew: Deny all public access
CREATE POLICY "Deny all public access to freelance crew"
  ON "FreelanceCrew"
  FOR ALL
  USING (false);

-- NewEnquiry: Deny all public access
CREATE POLICY "Deny all public access to new enquiries"
  ON "NewEnquiry"
  FOR ALL
  USING (false);

-- AuditLog: Deny all public access
CREATE POLICY "Deny all public access to audit logs"
  ON "AuditLog"
  FOR ALL
  USING (false);

-- CommsLog: Deny all public access
CREATE POLICY "Deny all public access to comms logs"
  ON "CommsLog"
  FOR ALL
  USING (false);

-- CartItem: Deny all public access
CREATE POLICY "Deny all public access to cart items"
  ON "CartItem"
  FOR ALL
  USING (false);

-- Cart: Deny all public access
CREATE POLICY "Deny all public access to carts"
  ON "Cart"
  FOR ALL
  USING (false);

-- Staff_Settings: Deny all public access
CREATE POLICY "Deny all public access to staff settings"
  ON "Staff_Settings"
  FOR ALL
  USING (false);

-- Booking: Deny all public access
CREATE POLICY "Deny all public access to bookings"
  ON "Booking"
  FOR ALL
  USING (false);

-- HireOrder: Deny all public access
CREATE POLICY "Deny all public access to hire orders"
  ON "HireOrder"
  FOR ALL
  USING (false);

-- HireOrderItem: Deny all public access
CREATE POLICY "Deny all public access to hire order items"
  ON "HireOrderItem"
  FOR ALL
  USING (false);

-- FormSubmission: Deny public read/update/delete (only allow insert)
CREATE POLICY "Deny public read access to form submissions"
  ON "FormSubmission"
  FOR SELECT
  USING (false);

CREATE POLICY "Deny public update access to form submissions"
  ON "FormSubmission"
  FOR UPDATE
  USING (false);

CREATE POLICY "Deny public delete access to form submissions"
  ON "FormSubmission"
  FOR DELETE
  USING (false);
