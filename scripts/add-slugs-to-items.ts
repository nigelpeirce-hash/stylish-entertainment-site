import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error", "warn"] });

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const items = await prisma.hireItem.findMany({
    where: { slug: null },
  });

  for (const item of items) {
    const slug = createSlug(item.name);
    await prisma.hireItem.update({
      where: { id: item.id },
      data: { slug },
    });
    console.log(`✓ Added slug to ${item.name}: ${slug}`);
  }

  console.log(`\n✅ Complete!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
