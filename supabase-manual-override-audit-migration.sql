-- Manual Override & Audit Panel Migration
-- Adds fields for manual overrides and audit logging system

-- Add deposit received fields
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "depositReceived" BOOLEAN DEFAULT false;

ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "depositReceivedManual" BOOLEAN DEFAULT false;

-- Add final details confirmed fields
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "finalDetailsConfirmed" BOOLEAN DEFAULT false;

ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "finalDetailsConfirmedManual" BOOLEAN DEFAULT false;

-- Add DJ worksheet approved fields
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "djWorksheetApproved" BOOLEAN DEFAULT false;

ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "djWorksheetApprovedManual" BOOLEAN DEFAULT false;

-- Create AuditLog table
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "bookingId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "performedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "AuditLog_bookingId_idx" 
ON "AuditLog"("bookingId");

CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" 
ON "AuditLog"("createdAt");

-- Add foreign key constraint
ALTER TABLE "AuditLog" 
ADD CONSTRAINT "AuditLog_bookingId_fkey" 
FOREIGN KEY ("bookingId") 
REFERENCES "Booking"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

COMMENT ON COLUMN "Booking"."depositReceived" IS 'Deposit received status';
COMMENT ON COLUMN "Booking"."depositReceivedManual" IS 'True if manually overridden (orange/warning color)';
COMMENT ON COLUMN "Booking"."finalDetailsConfirmed" IS 'Final details confirmed status';
COMMENT ON COLUMN "Booking"."finalDetailsConfirmedManual" IS 'True if manually overridden (orange/warning color)';
COMMENT ON COLUMN "Booking"."djWorksheetApproved" IS 'DJ worksheet approved status';
COMMENT ON COLUMN "Booking"."djWorksheetApprovedManual" IS 'True if manually overridden (orange/warning color)';

COMMENT ON TABLE "AuditLog" IS 'Audit trail for manual overrides and system actions';
COMMENT ON COLUMN "AuditLog"."action" IS 'Action type (e.g., deposit_received_manual)';
COMMENT ON COLUMN "AuditLog"."description" IS 'Human-readable description';
COMMENT ON COLUMN "AuditLog"."performedBy" IS 'Admin name who performed the action';
