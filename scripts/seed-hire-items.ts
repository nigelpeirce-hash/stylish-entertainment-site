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
  console.log("Seeding hire items...");

  const items = [
    {
      name: "Lanterns",
      description: "Decorative lanterns for ambient lighting",
      price: 50.00,
      stockAvailable: 999, // Unlimited for now
      category: "decor",
      isActive: true,
    },
    {
      name: "Candlesticks",
      description: "Elegant candlesticks for table settings",
      price: 50.00,
      stockAvailable: 999,
      category: "decor",
      isActive: true,
    },
    {
      name: "Mirroballs",
      description: "Mirror balls for disco lighting effects",
      price: 50.00,
      stockAvailable: 40,
      category: "lighting",
      isActive: true,
    },
    {
      name: "Vases",
      description: "Decorative vases for floral arrangements",
      price: 50.00,
      stockAvailable: 10,
      category: "decor",
      isActive: true,
    },
  ];

  const created = [];
  for (const item of items) {
    // Check if item already exists
    const existing = await prisma.hireItem.findFirst({
      where: { name: item.name },
    });

    if (!existing) {
      const createdItem = await prisma.hireItem.create({
        data: item,
      });
      created.push(createdItem);
      console.log(`✓ Created: ${item.name}`);
    } else {
      console.log(`- Skipped: ${item.name} (already exists)`);
    }
  }

  console.log(`\n✅ Seeding complete! Created ${created.length} new items.`);
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
