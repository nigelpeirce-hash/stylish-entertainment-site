-- Add depositPaidClickedAt to Booking (client clicked "I've paid" in email; flashes Paid until admin confirms)
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "depositPaidClickedAt" TIMESTAMP(3);
