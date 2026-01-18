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
  console.log("Updating Mirroballs image...");

  const newImageUrl = "https://res.cloudinary.com/drtwveoqo/image/upload/v1768730094/Mirrorball-with-spotlights-and-amber-up-lighting_vyrl8r.jpg";

  // Find by slug first (most reliable), then try name
  const item = await prisma.hireItem.findFirst({
    where: {
      OR: [
        { slug: "mirroballs" },
        { name: { contains: "Mirroball", mode: "insensitive" } },
      ],
    },
  });

  if (!item) {
    console.log("⚠️  No Mirroballs item found");
    return;
  }

  const updated = await prisma.hireItem.update({
    where: { id: item.id },
    data: { imageUrl: newImageUrl },
  });

  console.log(`✅ Updated "${updated.name}" with new image URL`);
  console.log(`   Old URL: ${item.imageUrl || "none"}`);
  console.log(`   New URL: ${newImageUrl}`);
}

main()
  .catch((e) => {
    console.error("Error updating image:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
