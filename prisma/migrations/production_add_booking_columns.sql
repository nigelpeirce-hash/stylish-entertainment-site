-- Run this in production if you see: "The column (not available) does not exist" on GET /api/admin/bookings/
-- Adds missing Booking columns used by the app (bookingFee, depositPaidClickedAt).
-- In Supabase: SQL Editor → New query → paste and run.

ALTER TABLE "Booking"
ADD COLUMN IF NOT EXISTS "bookingFee" TEXT;

ALTER TABLE "Booking"
ADD COLUMN IF NOT EXISTS "depositPaidClickedAt" TIMESTAMP(3);
