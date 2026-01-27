/**
 * Fix spelling mistake: "Babington Houe" → "Babington House"
 * Updates all occurrences in Booking and VenueAsset tables
 */

import { prisma } from "@/lib/prisma";

async function fixBabingtonSpelling() {
  try {
    console.log("🔍 Searching for 'Babington Houe' misspelling...");

    // Fix in Booking table - fetch and update individually
    // Search for both misspellings: "Babington Houe" and "babington hiouse"
    const bookingsWithMisspelling = await prisma.booking.findMany({
      where: {
        OR: [
          {
            venueName: {
              contains: "Babington Houe",
              mode: "insensitive",
            },
          },
          {
            venueName: {
              contains: "babington hiouse",
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        venueName: true,
      },
    });

    let bookingCount = 0;
    for (const booking of bookingsWithMisspelling) {
      // Fix both misspellings
      let correctedName = booking.venueName.replace(/Babington Houe/gi, "Babington House");
      correctedName = correctedName.replace(/babington hiouse/gi, "Babington House");
      
      if (correctedName !== booking.venueName) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { venueName: correctedName },
        });
        bookingCount++;
        console.log(`✅ Fixed booking ${booking.id}: "${booking.venueName}" → "${correctedName}"`);
      }
    }

    // Fix in VenueAsset table
    const venueAssetsWithMisspelling = await prisma.venueAsset.findMany({
      where: {
        OR: [
          {
            venueName: {
              contains: "Babington Houe",
              mode: "insensitive",
            },
          },
          {
            venueName: {
              contains: "babington hiouse",
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        venueName: true,
      },
    });

    let venueAssetCount = 0;
    for (const asset of venueAssetsWithMisspelling) {
      // Fix both misspellings
      let correctedName = asset.venueName.replace(/Babington Houe/gi, "Babington House");
      correctedName = correctedName.replace(/babington hiouse/gi, "Babington House");
      
      if (correctedName !== asset.venueName) {
        await prisma.venueAsset.update({
          where: { id: asset.id },
          data: { venueName: correctedName },
        });
        venueAssetCount++;
        console.log(`✅ Fixed venue asset ${asset.id}: "${asset.venueName}" → "${correctedName}"`);
      }
    }

    // Fix in Venue table (if it exists)
    try {
      const venuesWithMisspelling = await prisma.venue.findMany({
        where: {
          OR: [
            {
              venueName: {
                contains: "Babington Houe",
                mode: "insensitive",
              },
            },
            {
              venueName: {
                contains: "babington hiouse",
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          venueName: true,
        },
      });

      let venueCount = 0;
      for (const venue of venuesWithMisspelling) {
        // Fix both misspellings
        let correctedName = venue.venueName.replace(/Babington Houe/gi, "Babington House");
        correctedName = correctedName.replace(/babington hiouse/gi, "Babington House");
        
        if (correctedName !== venue.venueName) {
          await prisma.venue.update({
            where: { id: venue.id },
            data: { venueName: correctedName },
          });
          venueCount++;
          console.log(`✅ Fixed venue ${venue.id}: "${venue.venueName}" → "${correctedName}"`);
        }
      }

      if (venueCount > 0) {
        console.log(`\n📊 Summary: Fixed ${venueCount} venue(s)`);
      }
    } catch (error) {
      // Venue table might not exist, ignore
      console.log("ℹ️  Venue table not found or not accessible");
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Fixed ${bookingCount} booking(s)`);
    console.log(`   - Fixed ${venueAssetCount} venue asset(s)`);
    console.log(`\n✅ Spelling fix complete!`);
  } catch (error) {
    console.error("❌ Error fixing spelling:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixBabingtonSpelling()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
