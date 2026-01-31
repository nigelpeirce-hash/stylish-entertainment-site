/**
 * One-off script: populate strapLine and fullBio for DJs (and optionally Musicians).
 * Run after deploying the strap_line/full_bio migration.
 * Existing strapLine/fullBio are left unchanged; only null/empty are set.
 *
 * Usage: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-dj-musician-full-bios.ts
 * Or: npx tsx scripts/seed-dj-musician-full-bios.ts
 */

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

let connectionString = process.env.DATABASE_URL!;
if (connectionString.includes("supabase.com") && !connectionString.includes("sslmode=")) {
  connectionString += (connectionString.includes("?") ? "&" : "?") + "sslmode=require";
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("supabase.com") ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error", "warn"] });

// Optional: default strap lines per DJ name (only applied when strapLine is currently null/empty)
const DJ_STRAP_LINES: Record<string, string> = {
  "DJ Nige": "Over 20 years as resident DJ at Babington House",
  "Rich S": "Seamless mixing across Oxford and London",
  "James H": "From Chiltern FM to Topshop TV and high-end brand events",
  "James H DJ": "From Chiltern FM to Topshop TV and high-end brand events",
};

async function main() {
  console.log("Seeding strapLine / fullBio for DJs and Musicians...\n");

  const djs = await prisma.dJ.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }] });
  for (const dj of djs) {
    const updates: { strapLine?: string | null; fullBio?: string | null } = {};
    if (dj.strapLine == null || dj.strapLine.trim() === "") {
      const defaultStrap = DJ_STRAP_LINES[dj.name];
      if (defaultStrap) {
        updates.strapLine = defaultStrap;
      }
    }
    if (Object.keys(updates).length > 0) {
      await prisma.dJ.update({
        where: { id: dj.id },
        data: { ...updates, updatedAt: new Date() },
      });
      console.log(`✓ DJ: ${dj.name} – strapLine set`);
    } else {
      console.log(`- DJ: ${dj.name} – no update (already has content)`);
    }
  }

  const musicians = await prisma.musician.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }] });
  for (const m of musicians) {
    if ((m.strapLine == null || m.strapLine.trim() === "") && (m.fullBio == null || m.fullBio.trim() === "")) {
      console.log(`- Musician: ${m.name} – add strapLine/fullBio via admin if needed`);
    }
  }

  console.log("\nDone. Edit strapLine and fullBio in Admin (DJs & Musicians) as needed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
