-- Add bookingFee: flexible initial fee shown in confirmation email (e.g. £150)
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "bookingFee" TEXT;

-- Add depositPaidClickedAt: client clicked "I've paid" in email; flashes Paid until admin confirms
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "depositPaidClickedAt" TIMESTAMP(3);
