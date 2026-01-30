-- Add bookingFee column to Booking (flexible initial fee for confirmation email, e.g. £150)
-- Run this in Supabase SQL Editor or: psql $DATABASE_URL -f prisma/migrations/add_booking_fee_column.sql
ALTER TABLE "Booking"
ADD COLUMN IF NOT EXISTS "bookingFee" TEXT;

COMMENT ON COLUMN "Booking"."bookingFee" IS 'Initial booking fee shown in confirmation email (e.g. £150). Set in admin Flexible Operator.';
