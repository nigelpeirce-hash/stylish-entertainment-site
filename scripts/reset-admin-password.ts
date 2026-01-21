import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";
import bcrypt from "bcryptjs";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false, // Supabase uses self-signed certificates
  },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error", "warn"] });

// Helper to hash passwords
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("🔐 Resetting admin passwords...\n");

  const newPassword = "demo123";
  const hashedPassword = await hashPassword(newPassword);

  // Reset Nigel's password
  const nigel = await prisma.user.update({
    where: { email: "nigel@stylishentertainment.co.uk" },
    data: { password: hashedPassword },
  });
  console.log(`✓ Reset password for: ${nigel.email}`);

  // Reset Ali's password
  const ali = await prisma.user.update({
    where: { email: "ali@stylishentertainment.co.uk" },
    data: { password: hashedPassword },
  });
  console.log(`✓ Reset password for: ${ali.email}`);

  console.log("\n✅ Password reset complete!");
  console.log("\n🔐 Login credentials:");
  console.log(`   Email: nigel@stylishentertainment.co.uk`);
  console.log(`   Password: ${newPassword}`);
  console.log(`\n   Email: ali@stylishentertainment.co.uk`);
  console.log(`   Password: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Error resetting passwords:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
