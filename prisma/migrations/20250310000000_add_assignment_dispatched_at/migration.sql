-- Add dispatchedAt to BookingStaffAssignment: per-assignment dispatch timestamp
ALTER TABLE "BookingStaffAssignment" ADD COLUMN IF NOT EXISTS "dispatchedAt" TIMESTAMP(3);
