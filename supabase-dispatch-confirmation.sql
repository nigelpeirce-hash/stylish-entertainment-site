-- Dispatch confirmation for artist (DJ) worksheet emails
-- When we send a worksheet to a DJ (no staff assignment), we store a token here.
-- /api/confirm-brief/[token] checks this table when no BookingStaffAssignment matches.
--
-- Run this in your Supabase SQL editor (or equivalent) before using the "Yes, I accept the booking" flow for DJ dispatches.

CREATE TABLE IF NOT EXISTS "DispatchConfirmation" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "recipientEmail" TEXT NOT NULL,
  "recipientName" TEXT,
  "acknowledgedAt" TIMESTAMP(6),
  CONSTRAINT "DispatchConfirmation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DispatchConfirmation_token_key" UNIQUE ("token"),
  CONSTRAINT "DispatchConfirmation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "DispatchConfirmation_token_idx" ON "DispatchConfirmation"("token");
CREATE INDEX IF NOT EXISTS "DispatchConfirmation_bookingId_idx" ON "DispatchConfirmation"("bookingId");
