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
  console.log("Updating hire items with images and details...");

  const updates = [
    {
      name: "Lanterns",
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop",
      description: "Decorative lanterns for ambient lighting. Perfect for creating a warm, romantic atmosphere at your event.",
    },
    {
      name: "Candlesticks",
      imageUrl: "https://images.unsplash.com/photo-1606800053802-34c0feccea5c?w=800&h=600&fit=crop",
      description: "Elegant candlesticks for table settings. Add sophistication and charm to your dining tables.",
    },
    {
      name: "Mirroballs",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
      description: "Mirror balls for disco lighting effects. Create that classic dance floor atmosphere with rotating light displays.",
    },
    {
      name: "Vases",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      description: "Decorative vases for floral arrangements. Beautiful vessels to showcase your floral centerpieces.",
    },
  ];

  for (const update of updates) {
    const item = await prisma.hireItem.findFirst({
      where: { name: update.name },
    });

    if (item) {
      await prisma.hireItem.update({
        where: { id: item.id },
        data: {
          imageUrl: update.imageUrl,
          description: update.description,
        },
      });
      console.log(`✓ Updated: ${update.name}`);
    } else {
      console.log(`- Not found: ${update.name}`);
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
