-- Book-from-Quote: confirmedViaBookFromQuote, depositInvoiceSentAt
-- Run in Supabase SQL Editor if using Supabase. Matches Prisma schema.

ALTER TABLE "Booking"
  ADD COLUMN IF NOT EXISTS "confirmedViaBookFromQuote" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "depositInvoiceSentAt" TIMESTAMP(3);
