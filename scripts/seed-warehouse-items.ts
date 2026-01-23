/**
 * Seed WarehouseItem table with common technical equipment.
 * Run: npx tsx scripts/seed-warehouse-items.ts
 */

import { prisma } from '../lib/prisma'; // 👈 Point it to your fixed client
import "dotenv/config";

const warehouseItems = [
  // Sound
  { name: "Bose L1 Pro32", category: "Sound", weight: 15.5, size: "120x40x40cm", description: "Portable PA system" },
  { name: "Bose L1 Compact", category: "Sound", weight: 8.2, size: "90x30x30cm", description: "Compact PA system" },
  { name: "Wireless Microphone Set", category: "Sound", weight: 2.5, size: "40x30x15cm", description: "2x handheld, 2x lapel" },
  { name: "DJ Mixer", category: "Sound", weight: 5.0, size: "50x40x10cm", description: "4-channel mixer" },
  { name: "Subwoofer", category: "Sound", weight: 25.0, size: "60x60x60cm", description: "Active subwoofer" },
  
  // Lighting
  { name: "Uplighter", category: "Lighting", weight: 3.5, size: "30x30x80cm", description: "LED uplighter with stand" },
  { name: "Fairy Light Tunnel", category: "Lighting", weight: 8.0, size: "300x200x200cm (packed)", description: "Decorative tunnel" },
  { name: "Pinspot", category: "Lighting", weight: 2.0, size: "25x25x40cm", description: "Pinspot with stand" },
  { name: "Gobo Projector", category: "Lighting", weight: 4.5, size: "35x35x50cm", description: "Pattern projector" },
  { name: "LED Par Can", category: "Lighting", weight: 2.8, size: "30x30x30cm", description: "RGB LED par can" },
  
  // Effects
  { name: "Mirror Ball", category: "Effects", weight: 5.0, size: "40x40x40cm", description: "30cm mirror ball with motor" },
  { name: "Confetti Cannon", category: "Effects", weight: 8.0, size: "50x30x30cm", description: "CO2 confetti cannon" },
  { name: "Smoke Machine", category: "Effects", weight: 6.5, size: "40x30x30cm", description: "Haze machine" },
  { name: "Bubble Machine", category: "Effects", weight: 3.0, size: "35x25x25cm", description: "Automatic bubble machine" },
  
  // Rigging
  { name: "Truss Section", category: "Rigging", weight: 12.0, size: "200x20x20cm", description: "2m truss section" },
  { name: "T-Bar Stand", category: "Rigging", weight: 8.0, size: "150x30x30cm", description: "T-bar lighting stand" },
  { name: "Safety Chain", category: "Rigging", weight: 1.5, size: "50x10x5cm", description: "Safety chain set (x4)" },
  { name: "Gaffa Tape", category: "Rigging", weight: 0.5, size: "10x10x5cm", description: "Roll of gaffa tape" },
  { name: "Cable Reel", category: "Rigging", weight: 4.0, size: "40x40x15cm", description: "50m extension cable reel" },
];

async function main() {
  console.log("🚀 Seeding Warehouse for Stylish Entertainment...");
  const now = new Date();
  for (const item of warehouseItems) {
    // Check if item exists by name
    const existing = await prisma.warehouseItem.findFirst({
      where: { name: item.name },
    });
    
    if (existing) {
      await prisma.warehouseItem.update({
        where: { id: existing.id },
        data: {
          category: item.category,
          weight: item.weight,
          size: item.size,
          description: item.description,
          updatedAt: now,
        },
      });
    } else {
      await prisma.warehouseItem.create({
        data: { ...item, updatedAt: now },
      });
    }
    console.log(`  ✓ ${item.name} (${item.category})`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
