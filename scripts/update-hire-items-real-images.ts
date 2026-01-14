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
  console.log("Updating hire items with real images...");

  const updates = [
    {
      name: "Lanterns",
      imageUrl: "https://res.cloudinary.com/drtwveoqo/image/upload/v1768163613/IMG_3400_twcvbw.jpg",
    },
  ];

  // Check if "Crooks" exists, if not we might need to create it or update a different item
  const crooksItem = await prisma.hireItem.findFirst({
    where: { name: { contains: "Crook", mode: "insensitive" } },
  });

  if (crooksItem) {
    updates.push({
      name: crooksItem.name,
      imageUrl: "https://res.cloudinary.com/drtwveoqo/image/upload/v1768163599/Shepherds-Crook-and-Lantern-2_lpvqru.jpg",
    });
  } else {
    // If crooks doesn't exist, we might need to create it or the user wants to add it
    console.log("Note: 'Crooks' item not found. You may need to create it first.");
  }

  for (const update of updates) {
    const item = await prisma.hireItem.findFirst({
      where: { name: update.name },
    });

    if (item) {
      await prisma.hireItem.update({
        where: { id: item.id },
        data: {
          imageUrl: update.imageUrl,
        },
      });
      console.log(`✓ Updated: ${update.name}`);
    } else {
      // Try case-insensitive search
      const itemCaseInsensitive = await prisma.hireItem.findFirst({
        where: { name: { contains: update.name, mode: "insensitive" } },
      });
      
      if (itemCaseInsensitive) {
        await prisma.hireItem.update({
          where: { id: itemCaseInsensitive.id },
          data: {
            imageUrl: update.imageUrl,
          },
        });
        console.log(`✓ Updated: ${itemCaseInsensitive.name} (matched ${update.name})`);
      } else {
        console.log(`- Not found: ${update.name}`);
      }
    }
  }

  console.log(`\n✅ Update complete!`);
}

main()
  .catch((e) => {
    console.error("Error updating items:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
