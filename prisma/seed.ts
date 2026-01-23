import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import "dotenv/config";
import { v4 as uuidv4 } from 'uuid';

// 1. Setup the connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Initialize the client with the adapter
const prisma = new PrismaClient({ adapter });

const staffMembers = [
  { name: "Betty", email: "dj@nigelpeirce.co.uk", phone: "07970793177", roles: ["Lighting"] },
  { name: "Brett", email: "brett@stylishentertainment.co.uk", phone: "", roles: ["DJ"] },
  { name: "DJ Betty", email: "nigelpeircedj@gmail.com", phone: "", roles: ["DJ"] },
  { name: "DJ Nige", email: "nige@stylishentertainment.co.uk", phone: "+447700900123", roles: ["DJ"] },
  { name: "James H", email: "james@stylishentertainment.co.uk", phone: "+447700900125", roles: ["DJ"] },
  { name: "Mike Thompson", email: "mike@stylishentertainment.co.uk", phone: "+447700900127", roles: ["Styling"] },
  { name: "Rich S", email: "rich@stylishentertainment.co.uk", phone: "+447700900124", roles: ["DJ"] },
  { name: "Sarah Johnson", email: "sarah@stylishentertainment.co.uk", phone: "+447700900126", roles: ["Musician"] },
  { name: "Kate", email: "pending_kate@stylishentertainment.co.uk", phone: "", roles: [] },
  { name: "Lachlan, Kate, Ali", email: "pending_group@stylishentertainment.co.uk", phone: "", roles: [] },
  { name: "NIGE (Pending)", email: "pending_nige@stylishentertainment.co.uk", phone: "", roles: [] },
  { name: "TONY", email: "pending_tony@stylishentertainment.co.uk", phone: "", roles: [] },
];

async function main() {
  console.log('🌱 Seeding Stylish Entertainment Crew...');
  console.log('⚠️  NOTE: This uses upsert logic - it will NOT create duplicates');
  console.log('    It checks for existing staff by email before creating new records.');

  for (const staff of staffMembers) {
    try {
      // SAFEGUARD: Check for existing staff by email to prevent duplicates
      const existing = staff.email 
        ? await prisma.freelanceCrew.findFirst({ where: { email: staff.email } })
        : null;

      if (existing) {
        // Update existing record instead of creating duplicate
        await prisma.freelanceCrew.update({
          where: { id: existing.id },
          data: {
            name: staff.name,
            phone: staff.phone,
            roles: staff.roles,
            isActive: true,
            // REMOVED updatedAt: new Date() to stop the "new" column error
          },
        });
        console.log(`✅ Updated: ${staff.name}`);
      } else {
        // Only create if no existing record found
        await prisma.freelanceCrew.create({
          data: {
            id: uuidv4(),
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            roles: staff.roles,
            isActive: true,
            updatedAt: new Date(),
          },
        });
        console.log(`🆕 Created: ${staff.name}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${staff.name}:`, error);
    }
  }

  console.log('🏁 Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
