/**
 * Fix Babington House variants → single "Babington House" (optional: + "BA11 3RW")
 * Consolidates typos, extra text, and postcode variations so contact form autocomplete
 * shows one option instead of three.
 *
 * Run: npx tsx scripts/fix-babington-house-variants.ts
 * Dry run: npx tsx scripts/fix-babington-house-variants.ts --dry-run
 */

import { prisma } from "@/lib/prisma";

const STANDARD_NAME = "Babington House";
const STANDARD_POSTCODE = "BA11 3RW";

/** Matches any venue name that refers to Babington House */
function isBabingtonVariant(name: string): boolean {
  const n = name.trim().toLowerCase();
  if (!n.includes("babington")) return false;
  // Babington House, Babington Houe, Babington House Somerset, etc.
  return /babington\s*(house|houe|hiouse)/i.test(n) || n.startsWith("babington");
}

/** Normalize to "Babington House" only */
function normalizeVenueName(name: string): string {
  const out = name
    .replace(/Babington\s+Houe/gi, "Babington House")
    .replace(/babington\s+hiouse/gi, "Babington House")
    .replace(/\bBabington\s+House\b.*/i, "Babington House") // "Babington House, Somerset" etc.
    .trim();
  return isBabingtonVariant(out) ? STANDARD_NAME : out;
}

/** For Babington House bookings: use standard postcode so autocomplete shows one option. */
function normalizedPostcodeForBabington(pc: string | null): string {
  return STANDARD_POSTCODE;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("🔍 DRY RUN – no changes will be made\n");

  let bookingUpdates = 0;
  let venueAssetUpdates = 0;
  let venueUpdates = 0;

  // --- Booking ---
  const bookings = await prisma.booking.findMany({
    where: {
      venueName: { contains: "babington", mode: "insensitive" },
    },
    select: { id: true, venueName: true, venuePostcode: true },
  });

  for (const b of bookings) {
    const newName = normalizeVenueName(b.venueName);
    const newPostcode = normalizedPostcodeForBabington(b.venuePostcode);
    const nameChange = newName !== b.venueName;
    const currentPc = (b.venuePostcode ?? "").trim();
    const postcodeChange = currentPc !== newPostcode;

    if (!nameChange && !postcodeChange) continue;

    if (dryRun) {
      console.log(`[Booking ${b.id}] "${b.venueName}" ${currentPc || "(no postcode)"}`);
      console.log(`         → "${newName}" ${newPostcode}\n`);
    } else {
      await prisma.booking.update({
        where: { id: b.id },
        data: {
          venueName: newName,
          venuePostcode: newPostcode, // standardize so autocomplete shows one "Babington House, BA11 3RW"
        },
      });
      console.log(`✅ Booking ${b.id}: "${b.venueName}" → "${newName}", postcode → ${newPostcode}`);
    }
    bookingUpdates++;
  }

  // --- VenueAsset ---
  const assets = await prisma.venueAsset.findMany({
    where: {
      venueName: { contains: "babington", mode: "insensitive" },
    },
    select: { id: true, venueName: true },
  });

  for (const a of assets) {
    const newName = normalizeVenueName(a.venueName);
    if (newName === a.venueName) continue;

    if (dryRun) {
      console.log(`[VenueAsset ${a.id}] "${a.venueName}" → "${newName}"\n`);
    } else {
      await prisma.venueAsset.update({
        where: { id: a.id },
        data: { venueName: newName },
      });
      console.log(`✅ VenueAsset ${a.id}: "${a.venueName}" → "${newName}"`);
    }
    venueAssetUpdates++;
  }

  // --- Venue ---
  try {
    const venues = await prisma.venue.findMany({
      where: {
        venueName: { contains: "babington", mode: "insensitive" },
      },
      select: { id: true, venueName: true },
    });

    for (const v of venues) {
      const newName = normalizeVenueName(v.venueName);
      if (newName === v.venueName) continue;

      if (dryRun) {
        console.log(`[Venue ${v.id}] "${v.venueName}" → "${newName}"\n`);
      } else {
        await prisma.venue.update({
          where: { id: v.id },
          data: { venueName: newName },
        });
        console.log(`✅ Venue ${v.id}: "${v.venueName}" → "${newName}"`);
      }
      venueUpdates++;
    }
  } catch {
    // Venue table may not exist
  }

  console.log("\n📊 Summary:");
  console.log(`   Booking: ${bookingUpdates} updated`);
  console.log(`   VenueAsset: ${venueAssetUpdates} updated`);
  console.log(`   Venue: ${venueUpdates} updated`);
  if (dryRun && (bookingUpdates || venueAssetUpdates || venueUpdates)) {
    console.log("\n   Run without --dry-run to apply changes.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
