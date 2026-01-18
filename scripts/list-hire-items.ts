import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

async function main() {
  const items = await prisma.hireItem.findMany({
    orderBy: { name: "asc" },
  });

  console.log("\n📋 Current Hire Items with Images:\n");
  console.log("Copy these into bulk-update-hire-images.ts to update:\n");
  console.log("=".repeat(80));

  items.forEach((item) => {
    const url = item.imageUrl || "NO IMAGE";
    const urlPreview = url.length > 70 ? url.substring(0, 67) + "..." : url;
    
    console.log(`\n// ${item.name} (slug: ${item.slug})`);
    console.log(`{ name: "${item.name}", newImageUrl: "YOUR_NEW_CLOUDINARY_URL" },`);
    console.log(`  // Current: ${urlPreview}`);
  });

  console.log("\n" + "=".repeat(80));
  console.log(`\nTotal items: ${items.length}\n`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
