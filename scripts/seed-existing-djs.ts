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
  console.log("Seeding existing DJs...");

  const djs = [
    {
      name: "DJ Nige",
      slug: createSlug("DJ Nige"),
      bio: "An adaptable and accomplished wedding DJ with a deep knowledge of music past and present. Known for keeping dance floors full across all age groups, creating energetic but well-judged sets tailored to each couple.",
      mixcloudUrl: null, // Add Mixcloud URL if available
      imageUrl: null, // Add image URL if available
      isActive: true,
      displayOrder: 1,
    },
    {
      name: "Rich S",
      slug: createSlug("Rich S"),
      bio: "An adaptable and accomplished wedding DJ with a deep knowledge of music past and present. He has played extensively across Oxford and London and is also a radio presenter on JACK FM. Rich is known for keeping dance floors full across all age groups, creating energetic but well-judged sets tailored to each couple. Selected venues include: Babington House, Brympton, Cripps Barn, Orchardleigh, Coombe Lodge, North Cadbury Court and many more.",
      mixcloudUrl: null, // Add Mixcloud URL if available
      imageUrl: null, // Add image URL if available
      isActive: true,
      displayOrder: 2,
    },
    {
      name: "James H",
      slug: createSlug("James H"),
      bio: "James is a highly sought-after DJ and presenter with a career spanning from Chiltern FM and Heart FM to being the face of Topshop TV. He has performed alongside major names like Judge Jules and Chase & Status, James is a regular choice for high-end brands like Reiss and Jack Wills. With over five decades of music knowledge, James is an expert at packing dance floors across any genre - from House and Kisstory to Chart and Indie. His extensive venue credits include Heaven, Embassy, Chilfest, The Royal Yacht Club and North Cadbury Court.",
      mixcloudUrl: null, // Add Mixcloud URL if available
      imageUrl: null, // Add image URL if available
      isActive: true,
      displayOrder: 3,
    },
    {
      name: "Brett",
      slug: createSlug("Brett"),
      bio: "Our youngest DJ, Brett is an energetic and versatile performer who started his career in Mallorca. He can adapt to any style, from Motown to Deep House. Selected venues include: Brympton House, Priston Mill, Tall Johns and many more.",
      mixcloudUrl: null, // Add Mixcloud URL if available
      imageUrl: null, // Add image URL if available
      isActive: true,
      displayOrder: 4,
    },
  ];

  for (const djData of djs) {
    // Check if DJ already exists
    const existing = await prisma.dJ.findFirst({
      where: { 
        OR: [
          { name: djData.name },
          { slug: djData.slug }
        ]
      },
    });

    if (existing) {
      // Update existing
      await prisma.dJ.update({
        where: { id: existing.id },
        data: djData,
      });
      console.log(`✓ Updated: ${djData.name}`);
    } else {
      // Create new
      await prisma.dJ.create({
        data: djData,
      });
      console.log(`✓ Created: ${djData.name}`);
    }
  }

  console.log(`\n✅ Seeding complete!`);
}

main()
  .catch((e) => {
    console.error("Error seeding DJs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
