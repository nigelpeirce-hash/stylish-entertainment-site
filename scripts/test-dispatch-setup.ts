#!/usr/bin/env tsx
/**
 * Test DispatchConfirmation / worksheet "I accept" setup
 *
 * Verifies:
 * 1. Prisma connects and DispatchConfirmation model exists
 * 2. DispatchConfirmation table exists in DB
 * 3. Can create and query a test row (then delete it)
 */

import { prisma } from "../lib/prisma";
import { generateBriefToken } from "../lib/brief-token";

async function run() {
  console.log("🔍 Testing dispatch confirmation setup...\n");

  try {
    await prisma.$connect();
    console.log("1. ✅ Prisma connected\n");

    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name::text
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      AND table_name = 'DispatchConfirmation'
    `;
    if (tables.length === 0) {
      console.error("2. ❌ DispatchConfirmation table not found.");
      console.error("   Run supabase-dispatch-confirmation.sql in your Supabase SQL editor.\n");
      process.exit(1);
    }
    console.log("2. ✅ DispatchConfirmation table exists\n");

    const token = generateBriefToken();
    const testId = `test-dc-${Date.now()}`;

    const booking = await prisma.booking.findFirst({
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });
    if (!booking) {
      console.log("3. ⏭️  No bookings in DB; skipping create/delete test.\n");
      console.log("✅ Setup OK. Run migration if you haven't: supabase-dispatch-confirmation.sql\n");
      return;
    }

    await prisma.dispatchConfirmation.create({
      data: {
        id: testId,
        token,
        bookingId: booking.id,
        recipientEmail: "test@example.com",
        recipientName: "Test Artist",
      },
    });
    console.log("3. ✅ Created test DispatchConfirmation row\n");

    const found = await prisma.dispatchConfirmation.findUnique({
      where: { token },
      include: { booking: { select: { venueName: true } } },
    });
    if (!found) {
      console.error("4. ❌ Could not find created row.\n");
      process.exit(1);
    }
    console.log("4. ✅ Queried row (booking:", found.booking?.venueName ?? "—", ")\n");

    await prisma.dispatchConfirmation.delete({ where: { id: testId } });
    console.log("5. ✅ Deleted test row\n");

    console.log("✅ All dispatch setup tests passed.\n");
  } catch (e: any) {
    console.error("❌ Test failed:", e?.message ?? e);
    if (e?.code === "P2003") {
      console.error("   DispatchConfirmation table may exist but FK to Booking failed.");
    }
    if (e?.message?.includes("does not exist") || e?.code === "P2021") {
      console.error("   Run: supabase-dispatch-confirmation.sql in Supabase SQL editor.");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
