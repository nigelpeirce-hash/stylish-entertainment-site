-- Step 3: Create deny policies for sensitive tables
-- Run this third in Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Deny all public access to accounts" ON "Account";
DROP POLICY IF EXISTS "Deny all public access to verification tokens" ON "VerificationToken";
DROP POLICY IF EXISTS "Deny all public access to sessions" ON "Session";
DROP POLICY IF EXISTS "Deny all public access to users" ON "User";
DROP POLICY IF EXISTS "Deny all public access to email inboxes" ON "EmailInbox";
DROP POLICY IF EXISTS "Deny all public access to email threads" ON "EmailThread";
DROP POLICY IF EXISTS "Deny all public access to emails" ON "Email";
DROP POLICY IF EXISTS "Deny all public access to notes" ON "Note";
DROP POLICY IF EXISTS "Deny all public access to tasks" ON "Task";
DROP POLICY IF EXISTS "Deny all public access to booking staff assignments" ON "BookingStaffAssignment";
DROP POLICY IF EXISTS "Deny all public access to email templates" ON "EmailTemplate";
DROP POLICY IF EXISTS "Deny all public access to freelance crew" ON "FreelanceCrew";
DROP POLICY IF EXISTS "Deny all public access to new enquiries" ON "NewEnquiry";
DROP POLICY IF EXISTS "Deny all public access to audit logs" ON "AuditLog";
DROP POLICY IF EXISTS "Deny all public access to comms logs" ON "CommsLog";
DROP POLICY IF EXISTS "Deny all public access to cart items" ON "CartItem";
DROP POLICY IF EXISTS "Deny all public access to carts" ON "Cart";
DROP POLICY IF EXISTS "Deny all public access to staff settings" ON "Staff_Settings";
DROP POLICY IF EXISTS "Deny all public access to bookings" ON "Booking";
DROP POLICY IF EXISTS "Deny all public access to hire orders" ON "HireOrder";
DROP POLICY IF EXISTS "Deny all public access to hire order items" ON "HireOrderItem";
DROP POLICY IF EXISTS "Deny public read access to form submissions" ON "FormSubmission";
DROP POLICY IF EXISTS "Deny public update access to form submissions" ON "FormSubmission";
DROP POLICY IF EXISTS "Deny public delete access to form submissions" ON "FormSubmission";

-- Account: Deny all public access
CREATE POLICY "Deny all public access to accounts"
  ON "Account"
  FOR ALL
  USING (false);

-- VerificationToken: Deny all public access
CREATE POLICY "Deny all public access to verification tokens"
  ON "VerificationToken"
  FOR ALL
  USING (false);

-- Session: Deny all public access
CREATE POLICY "Deny all public access to sessions"
  ON "Session"
  FOR ALL
  USING (false);

-- User: Deny all public access
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
