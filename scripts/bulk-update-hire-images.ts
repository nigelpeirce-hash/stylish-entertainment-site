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

/**
 * BULK IMAGE UPDATE SCRIPT
 * 
 * Instructions:
 * Add your image replacements to the 'updates' array below.
 * Each update can use one of these methods:
 * 
 * Method 1: Update by item name/slug
 *   { name: "Item Name", newImageUrl: "https://..." }
 * 
 * Method 2: Find and replace old URL
 *   { oldImageUrl: "https://old-url...", newImageUrl: "https://new-url..." }
 * 
 * Method 3: Update by slug
 *   { slug: "item-slug", newImageUrl: "https://..." }
 */

interface ImageUpdate {
  // Option 1: Update by item name
  name?: string;
  // Option 2: Find and replace by old image URL
  oldImageUrl?: string;
  // Option 3: Update by slug
  slug?: string;
  // The new image URL to set
  newImageUrl: string;
}

const updates: ImageUpdate[] = [
  // ADD YOUR IMAGE REPLACEMENTS HERE
  // Example:
  // { name: "Lanterns", newImageUrl: "https://res.cloudinary.com/..." },
  // { oldImageUrl: "https://old-url.com/image.jpg", newImageUrl: "https://res.cloudinary.com/..." },
  // { slug: "vases", newImageUrl: "https://res.cloudinary.com/..." },
];

async function main() {
  if (updates.length === 0) {
    console.log("⚠️  No updates specified. Add your image replacements to the 'updates' array in the script.");
    return;
  }

  console.log(`Processing ${updates.length} image update(s)...\n`);

  let successCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    try {
      let item = null;

      // Method 1: Find by name
      if (update.name) {
        item = await prisma.hireItem.findFirst({
          where: { name: { equals: update.name, mode: "insensitive" } },
        });
        
        if (!item) {
          console.log(`❌ Not found by name: "${update.name}"`);
          notFoundCount++;
          continue;
        }
      }
      // Method 2: Find by old image URL
      else if (update.oldImageUrl) {
        item = await prisma.hireItem.findFirst({
          where: { imageUrl: update.oldImageUrl },
        });
        
        if (!item) {
          // Try partial match (in case URL has query params or transformations)
          const items = await prisma.hireItem.findMany({
            where: { imageUrl: { contains: update.oldImageUrl.split('?')[0] } },
          });
          
          if (items.length === 1) {
            item = items[0];
          } else if (items.length > 1) {
            console.log(`⚠️  Multiple items found with old URL containing "${update.oldImageUrl.split('?')[0]}":`);
            items.forEach(i => console.log(`   - ${i.name} (${i.slug})`));
            notFoundCount++;
            continue;
          } else {
            console.log(`❌ Not found by old URL: "${update.oldImageUrl}"`);
            notFoundCount++;
            continue;
          }
        }
      }
      // Method 3: Find by slug
      else if (update.slug) {
        item = await prisma.hireItem.findUnique({
          where: { slug: update.slug },
        });
        
        if (!item) {
          console.log(`❌ Not found by slug: "${update.slug}"`);
          notFoundCount++;
          continue;
        }
      } else {
        console.log(`⚠️  Invalid update entry (missing name, oldImageUrl, or slug):`, update);
        errorCount++;
        continue;
      }

      // Update the item
      const oldUrl = item.imageUrl || "none";
      const updated = await prisma.hireItem.update({
        where: { id: item.id },
        data: { imageUrl: update.newImageUrl },
      });

      console.log(`✅ Updated: "${updated.name}" (${updated.slug})`);
      console.log(`   Old: ${oldUrl}`);
      console.log(`   New: ${update.newImageUrl}\n`);
      
      successCount++;
    } catch (error) {
      console.error(`❌ Error updating item:`, update, error);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`Summary:`);
  console.log(`  ✅ Successfully updated: ${successCount}`);
  console.log(`  ❌ Not found: ${notFoundCount}`);
  console.log(`  ⚠️  Errors: ${errorCount}`);
  console.log("=".repeat(60));
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
