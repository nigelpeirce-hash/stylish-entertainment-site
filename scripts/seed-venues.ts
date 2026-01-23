/**
 * Seed Venue table with default timings and notes for Venue Intelligence.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-venues.ts
 * Or: npx tsx scripts/seed-venues.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const venues = [
  {
    venueName: "Babington House",
    defaultCeremonyTime: "14:00",
    defaultFinishTime: "00:00",
    venueNotes:
      "Babington House: Bar area for reception, Orangery for dinner. Sound limiter in main spaces. Early access typically from 2pm. DJ setup in Orangery or Bar as agreed.",
  },
  {
    venueName: "Kin House",
    defaultCeremonyTime: "14:30",
    defaultFinishTime: "00:00",
    venueNotes:
      "Kin House: Barn and courtyard. Confirm setup location with venue. Sound limiter in place.",
  },
  {
    venueName: "North Cadbury Court",
    defaultCeremonyTime: "14:00",
    defaultFinishTime: "23:30",
    venueNotes:
      "North Cadbury Court: Multiple spaces. Confirm ceremony and reception rooms with venue.",
  },
  {
    venueName: "Cripps Barn",
    defaultCeremonyTime: "14:00",
    defaultFinishTime: "00:00",
    venueNotes: "Cripps Barn: Barn venue. Sound limiter. Confirm setup and power.",
  },
  {
    venueName: "Orchardleigh",
    defaultCeremonyTime: "14:00",
    defaultFinishTime: "00:00",
    venueNotes: "Orchardleigh: House and estate. Confirm exact location for ceremony and reception.",
  },
  {
    venueName: "Coombe Lodge",
    defaultCeremonyTime: "14:00",
    defaultFinishTime: "23:30",
    venueNotes: "Coombe Lodge: Confirm setup area and timings with venue.",
  },
];

async function main() {
  console.log("Seeding Venues (default timings & notes)...");
  const now = new Date();
  for (const v of venues) {
    await prisma.venue.upsert({
      where: { venueName: v.venueName },
      create: { ...v, updatedAt: now },
      update: {
        defaultCeremonyTime: v.defaultCeremonyTime,
        defaultFinishTime: v.defaultFinishTime,
        venueNotes: v.venueNotes,
        updatedAt: now,
      },
    });
    console.log(`  ✓ ${v.venueName}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
