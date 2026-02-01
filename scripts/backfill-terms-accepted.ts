/**
 * One-time backfill: set termsAccepted = true for existing bookings that are
 * already confirmed or have deposit received (so portal and ContractFooter show
 * "Terms accepted" and the accept T&Cs banner stays hidden).
 *
 * Run: npx tsx scripts/backfill-terms-accepted.ts
 * (Or: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/backfill-terms-accepted.ts)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.booking.updateMany({
    where: {
      termsAccepted: false,
      OR: [
        { status: "confirmed" },
        { depositReceived: true },
        { depositReceivedManual: true },
      ],
    },
    data: {
      termsAccepted: true,
      termsAcceptedAt: new Date(),
    },
  });

  console.log(
    `Backfilled termsAccepted = true for ${updated.count} existing confirmed/deposit-received booking(s).`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
