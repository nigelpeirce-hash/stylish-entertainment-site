import { PrismaClient } from "@prisma/client";
import * as pg from "pg";

// Configure SSL for Supabase
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function cleanupTestBookings() {
  try {
    console.log("🧹 Cleaning up test bookings...\n");

    // Find all bookings with test/demo email patterns
    const testBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { email: { contains: "@example.com" } },
          { email: { contains: "demo" } },
          { email: { contains: "test" } },
          { name: { contains: "Demo" } },
          { name: { contains: "Test" } },
        ],
      },
      include: {
        staffAssignments: true,
        emailThreads: true,
      },
    });

    console.log(`Found ${testBookings.length} test bookings to delete\n`);

    // Delete each test booking and its related data
    for (const booking of testBookings) {
      // Delete email threads
      if (booking.emailThreads && booking.emailThreads.length > 0) {
        await prisma.emailThread.deleteMany({
          where: { bookingId: booking.id },
        });
        console.log(`  - Deleted ${booking.emailThreads.length} email threads for ${booking.name}`);
      }

      // Delete staff assignments
      if (booking.staffAssignments && booking.staffAssignments.length > 0) {
        await prisma.bookingStaffAssignment.deleteMany({
          where: { bookingId: booking.id },
        });
        console.log(`  - Deleted ${booking.staffAssignments.length} staff assignments for ${booking.name}`);
      }

      // Delete the booking
      await prisma.booking.delete({
        where: { id: booking.id },
      });
      console.log(`  ✓ Deleted: ${booking.name} - ${booking.venueName}`);
    }

    console.log(`\n✨ Cleanup complete! Deleted ${testBookings.length} test bookings.`);
  } catch (error) {
    console.error("❌ Error cleaning up test bookings:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

cleanupTestBookings()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
