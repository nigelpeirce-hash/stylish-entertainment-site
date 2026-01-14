import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

// Create PostgreSQL connection pool
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
  console.log("Adding Crooks item...");

  // Check if it already exists
  const existing = await prisma.hireItem.findFirst({
    where: { name: { contains: "Crook", mode: "insensitive" } },
  });

  if (existing) {
    // Update existing
    await prisma.hireItem.update({
      where: { id: existing.id },
      data: {
        imageUrl: "https://res.cloudinary.com/drtwveoqo/image/upload/v1768163599/Shepherds-Crook-and-Lantern-2_lpvqru.jpg",
      },
    });
    console.log(`✓ Updated existing: ${existing.name}`);
  } else {
    // Create new
    const crooks = await prisma.hireItem.create({
      data: {
        name: "Crooks",
        description: "Shepherd's crooks for decorative displays and floral arrangements",
        price: 50.00,
        stockAvailable: 999,
        category: "decor",
        isActive: true,
        imageUrl: "https://res.cloudinary.com/drtwveoqo/image/upload/v1768163599/Shepherds-Crook-and-Lantern-2_lpvqru.jpg",
      },
    });
    console.log(`✓ Created: ${crooks.name}`);
  }

  console.log(`\n✅ Complete!`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
