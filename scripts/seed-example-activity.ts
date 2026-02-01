/**
 * Seed example activity entries for testing the Admin Recent Activity feed.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-example-activity.ts
 * Or: npx tsx scripts/seed-example-activity.ts
 *
 * Requires: A valid booking ID. Use the first pending booking from your DB.
 */

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const prisma = new PrismaClient();

async function main() {
  const booking = await prisma.booking.findFirst({
    where: { archivedAt: null },
    select: { id: true, name: true, venueName: true },
  });

  if (!booking) {
    console.error("No booking found. Create a booking first.");
    process.exit(1);
  }

  const examples = [
    { action: "booking_request_received", description: "New enquiry received", actor: "client" as const },
    { action: "quote_sent", description: "Quote sent to client", actor: "admin" as const, metadata: { emailSubject: "Your Wedding Quote" } },
    { action: "terms_accepted", description: "Client accepted T&Cs", actor: "client" as const },
    { action: "playlist_updated", description: "Client updated music preferences", actor: "client" as const, metadata: { firstDance: "At Last - Etta James" } },
    { action: "guest_request_submitted", description: "Guest submitted song request", actor: "guest" as const, metadata: { songTitle: "Dancing Queen", songArtist: "ABBA" } },
    { action: "deposit_paid", description: "Client marked deposit paid", actor: "client" as const },
    { action: "email_sent", description: "Deposit confirmation email sent", actor: "admin" as const, metadata: { emailSubject: "Your Wedding is Confirmed!" } },
    { action: "portal_link_sent", description: "Portal access link sent", actor: "admin" as const },
    { action: "final_details_confirmed", description: "Client confirmed final details", actor: "client" as const },
    { action: "hire_request_confirmed", description: "Client confirmed hire request", actor: "client" as const, metadata: { amount: "£240.00", itemCount: 3 } },
    { action: "dispatched", description: "Brief dispatched to DJ", actor: "admin" as const, performedBy: "Nigel" },
  ];

  for (const ex of examples) {
    await prisma.auditLog.create({
      data: {
        bookingId: booking.id,
        action: ex.action,
        description: ex.description,
        actor: ex.actor,
        performedBy: (ex as { performedBy?: string }).performedBy ?? undefined,
        metadata: (ex as { metadata?: object }).metadata ?? undefined,
      },
    });
    console.log(`✓ Created: ${ex.action}`);
  }

  console.log(`\n✅ Seeded ${examples.length} example activity entries for booking ${booking.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
