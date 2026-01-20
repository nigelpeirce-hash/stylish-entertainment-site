import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error", "warn"] });

// Helper to hash passwords
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Helper to generate booking reference
function generateBookingRef(index: number): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `STY${(timestamp + index * 1000 + random).toString().slice(-8)}`;
}

async function main() {
  console.log("🌱 Seeding demo data for local development...\n");

  // 1. Create Admin Users
  console.log("📝 Creating admin users...");
  const hashedPassword = await hashPassword("demo123");
  
  const now = new Date();
  const nigel = await prisma.user.upsert({
    where: { email: "nigel@stylishentertainment.co.uk" },
    update: {},
    create: {
      id: randomUUID(),
      email: "nigel@stylishentertainment.co.uk",
      name: "Nigel Peirce",
      password: hashedPassword,
      role: "admin",
      emailVerified: now,
      createdAt: now,
      updatedAt: now,
    },
  });
  console.log(`✓ Admin: ${nigel.email}`);

  const ali = await prisma.user.upsert({
    where: { email: "ali@stylishentertainment.co.uk" },
    update: {},
    create: {
      id: randomUUID(),
      email: "ali@stylishentertainment.co.uk",
      name: "Ali Peirce",
      password: hashedPassword,
      role: "admin",
      emailVerified: now,
      createdAt: now,
      updatedAt: now,
    },
  });
  console.log(`✓ Admin: ${ali.email}`);

  // 2. Create Staff Members (FreelanceCrew)
  console.log("\n👥 Creating staff members...");
  const staff = [
    {
      name: "DJ Nige",
      email: "nige@stylishentertainment.co.uk",
      phone: "+447700900123",
      roles: ["dj"],
    },
    {
      name: "Rich S",
      email: "rich@stylishentertainment.co.uk",
      phone: "+447700900124",
      roles: ["dj"],
    },
    {
      name: "James H",
      email: "james@stylishentertainment.co.uk",
      phone: "+447700900125",
      roles: ["dj"],
    },
    {
      name: "Sarah Johnson",
      email: "sarah@stylishentertainment.co.uk",
      phone: "+447700900126",
      roles: ["musician"],
    },
    {
      name: "Mike Thompson",
      email: "mike@stylishentertainment.co.uk",
      phone: "+447700900127",
      roles: ["styling"],
    },
  ];

  const createdStaff = [];
  for (const staffData of staff) {
    const existing = await prisma.freelanceCrew.findFirst({
      where: { email: staffData.email },
    });

    if (!existing) {
      const newStaff = await prisma.freelanceCrew.create({
        data: {
          id: randomUUID(),
          ...staffData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      createdStaff.push(newStaff);
      console.log(`✓ Created: ${staffData.name}`);
    } else {
      console.log(`- Skipped: ${staffData.name} (already exists)`);
      createdStaff.push(existing);
    }
  }

  // 3. Create Test Client Users
  console.log("\n👤 Creating test client users...");
  const clients = [
    {
      email: "john.smith@example.com",
      name: "John Smith",
    },
    {
      email: "emma.wilson@example.com",
      name: "Emma Wilson",
    },
    {
      email: "david.brown@example.com",
      name: "David Brown",
    },
  ];

  const createdClients = [];
  for (const clientData of clients) {
    const existing = await prisma.user.findFirst({
      where: { email: clientData.email },
    });

    if (!existing) {
      const newClient = await prisma.user.create({
        data: {
          id: randomUUID(),
          ...clientData,
          password: hashedPassword,
          role: "client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      createdClients.push(newClient);
      console.log(`✓ Created: ${clientData.name}`);
    } else {
      createdClients.push(existing);
    }
  }

  // 4. Create Bookings (various statuses and dates)
  console.log("\n📅 Creating bookings...");
  const today = new Date();
  const bookings = [
    {
      name: "John & Sarah Smith",
      email: "john.smith@example.com",
      userId: createdClients[0]?.id,
      eventDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      venueName: "Babington House",
      venueTown: "Somerset",
      venuePostcode: "BA11 3RW",
      status: "confirmed",
      priority: "urgent",
      depositReceived: false,
      finalDetailsConfirmed: false,
    },
    {
      name: "Emma & James Wilson",
      email: "emma.wilson@example.com",
      userId: createdClients[1]?.id,
      eventDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      venueName: "Brympton House",
      venueTown: "Yeovil",
      venuePostcode: "BA22 8TD",
      status: "confirmed",
      priority: "high",
      depositReceived: true,
      finalDetailsConfirmed: true,
    },
    {
      name: "David & Lisa Brown",
      email: "david.brown@example.com",
      userId: createdClients[2]?.id,
      eventDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      venueName: "Orchardleigh House",
      venueTown: "Bath",
      venuePostcode: "BA11 2PH",
      status: "pending",
      priority: "medium",
      depositReceived: false,
    },
    {
      name: "Tom & Mary Johnson",
      email: "tom.johnson@example.com",
      eventDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now - URGENT
      venueName: "Priston Mill",
      venueTown: "Bath",
      venuePostcode: "BA2 9EY",
      status: "confirmed",
      priority: "urgent",
      depositReceived: true,
      finalDetailsConfirmed: false,
      djWorksheetApproved: false,
    },
    {
      name: "Sophie & Mark Taylor",
      email: "sophie.taylor@example.com",
      eventDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago - PAST
      venueName: "Cripps Barn",
      venueTown: "Cirencester",
      venuePostcode: "GL7 6BB",
      status: "completed",
      priority: "low",
      depositReceived: true,
      finalDetailsConfirmed: true,
    },
    {
      name: "Rachel & Chris Green",
      email: "rachel.green@example.com",
      eventDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      venueName: "North Cadbury Court",
      venueTown: "Yeovil",
      venuePostcode: "BA22 7DW",
      status: "pending",
      priority: "low",
    },
  ];

  const createdBookings = [];
  for (let i = 0; i < bookings.length; i++) {
    const bookingData = { ...bookings[i], bookingReference: generateBookingRef(i) };
    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        ...bookingData,
        eventType: "wedding",
        numberOfGuests: Math.floor(Math.random() * 150) + 50,
        services: ["DJ", "Lighting"],
        phoneAreaCode: "+44",
        phoneNumber: `7${Math.floor(Math.random() * 100000000)}`,
        createdAt: new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    });
    createdBookings.push(booking);
    console.log(`✓ Created: ${bookingData.name} - ${bookingData.venueName} (${bookingData.status})`);
  }

  // 5. Create Staff Assignments
  console.log("\n🎯 Creating staff assignments...");
  for (let i = 0; i < Math.min(createdBookings.length, createdStaff.length); i++) {
    const booking = createdBookings[i];
    const staff = createdStaff[i % createdStaff.length];

    if (staff.roles.includes("dj")) {
      await prisma.bookingStaffAssignment.create({
        data: {
          id: randomUUID(),
          bookingId: booking.id,
          staffId: staff.id,
          role: staff.roles[0] || "dj",
          agreedFee: 500.0,
          status: booking.status === "confirmed" ? "confirmed" : "held",
          briefStatus: booking.status === "confirmed" && booking.depositReceived ? "sent" : "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(`✓ Assigned: ${staff.name} to ${booking.name}`);
    }
  }

  // 6. Create Demo Email Inbox
  console.log("\n📬 Creating demo email inbox...");
  let demoInbox;
  const existingInbox = await prisma.emailInbox.findFirst({
    where: { email: "info@stylishentertainment.co.uk" },
  });

  if (!existingInbox) {
    demoInbox = await prisma.emailInbox.create({
      data: {
        id: randomUUID(),
        name: "Demo Office Inbox",
        email: "info@stylishentertainment.co.uk",
        isActive: true,
        imapHost: "imap.example.com",
        imapPort: 993,
        imapSecure: true,
        imapUsername: "demo",
        imapPassword: "demo",
        smtpHost: "smtp.example.com",
        smtpPort: 587,
        smtpSecure: true,
        smtpUsername: "demo",
        smtpPassword: "demo",
        syncEnabled: false,
        syncInterval: 5,
        assignedUsers: ["nigel", "ali"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log("✓ Created demo inbox");
  } else {
    demoInbox = existingInbox;
    console.log("✓ Using existing inbox");
  }

  // 7. Create Email Threads (some with portal messages)
  console.log("\n📧 Creating email threads...");
  for (let i = 0; i < 3; i++) {
    const booking = createdBookings[i];
    if (!booking.userId) continue;

    // IMAP email thread
    await prisma.emailThread.create({
      data: {
        id: randomUUID(),
        bookingId: booking.id,
        fromEmail: booking.email,
        toEmail: "info@stylishentertainment.co.uk",
        subject: `Re: Your booking at ${booking.venueName}`,
        source: "imap",
        inboxId: demoInbox.id,
        createdAt: new Date(today.getTime() - i * 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        lastMessageAt: new Date(today.getTime() - i * 2 * 24 * 60 * 60 * 1000),
      },
    });

    // Portal message (for first booking)
    if (i === 0) {
      await prisma.emailThread.create({
        data: {
          id: randomUUID(),
          bookingId: booking.id,
          fromEmail: booking.email,
          toEmail: "info@stylishentertainment.co.uk",
          subject: "Message from Client Portal",
          source: "portal",
          inboxId: demoInbox.id,
          createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          lastMessageAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`✓ Portal message: ${booking.name}`);
    }
  }
  console.log("✓ Created email threads");

  // 8. Summary
  console.log("\n✨ Demo data seeding complete!");
  console.log("\n📊 Summary:");
  console.log(`   - Admin Users: 2`);
  console.log(`   - Staff Members: ${createdStaff.length}`);
  console.log(`   - Client Users: ${createdClients.length}`);
  console.log(`   - Bookings: ${createdBookings.length}`);
  console.log(`   - Email Threads: Created`);
  console.log("\n🔐 Login credentials:");
  console.log(`   Email: nigel@stylishentertainment.co.uk`);
  console.log(`   Password: demo123`);
  console.log(`\n   Email: ali@stylishentertainment.co.uk`);
  console.log(`   Password: demo123`);
  console.log("\n🎉 Ready for development!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding demo data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
