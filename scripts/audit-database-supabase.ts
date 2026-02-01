#!/usr/bin/env tsx
/**
 * Database & Supabase Audit
 *
 * Compares Prisma schema expectations with the actual PostgreSQL/Supabase database.
 * Run: npx tsx scripts/audit-database-supabase.ts
 *
 * Requires: DATABASE_URL in .env.local
 */

import { PrismaClient, Prisma } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

const EXPECTED_TABLES = [
  "Account",
  "AuditLog",
  "Booking",
  "BookingStaffAssignment",
  "BookingItem",
  "BookingWarehouseItem",
  "Cart",
  "CartItem",
  "CommsLog",
  "DispatchConfirmation",
  "DJ",
  "Email",
  "EmailFolder",
  "EmailInbox",
  "EmailTemplate",
  "EmailThread",
  "FormSubmission",
  "FreelanceCrew",
  "GuestRequest",
  "HireItem",
  "HireOrder",
  "HireOrderItem",
  "Musician",
  "NewEnquiry",
  "Note",
  "ServiceQuoteItem",
  "Session",
  "Staff_Settings",
  "Task",
  "User",
  "Venue",
  "VenueAsset",
  "VerificationToken",
  "WarehouseItem",
];

interface ColumnCheck {
  table: string;
  column: string;
  exists: boolean;
  type?: string;
}

interface TableAudit {
  name: string;
  exists: boolean;
  columns: number;
  missingColumns: string[];
  extraColumns?: string[];
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Database & Supabase Audit");
  console.log("  Prisma schema vs PostgreSQL (Supabase)");
  console.log("═══════════════════════════════════════════════════════════\n");

  try {
    await prisma.$connect();

    // 1. List all tables
    const dbTables = await prisma.$queryRaw<Array<{ table_name: string }>>(
      Prisma.sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `
    );
    const actualTables = dbTables.map((t) => t.table_name);

    // 2. Check expected tables
    const missing: string[] = [];
    const extra = actualTables.filter(
      (t) => !EXPECTED_TABLES.includes(t) && !t.startsWith("_")
    );

    for (const t of EXPECTED_TABLES) {
      if (!actualTables.includes(t)) missing.push(t);
    }

    console.log("📋 TABLES");
    console.log("───────────────────────────────────────────────────────────");
    console.log(`Expected (from Prisma): ${EXPECTED_TABLES.length}`);
    console.log(`In database:           ${actualTables.length}`);
    if (missing.length > 0) {
      console.log(`\n❌ MISSING TABLES (in schema, not in DB):`);
      missing.forEach((t) => console.log(`   - ${t}`));
    }
    if (extra.length > 0) {
      console.log(`\n⚠️  EXTRA TABLES (in DB, not in schema):`);
      extra.forEach((t) => console.log(`   - ${t}`));
    }
    if (missing.length === 0 && extra.length === 0) {
      console.log(`\n✅ All expected tables present. No unexpected tables.`);
    }

    // 3. Critical column checks (recent migrations, common issues)
    const criticalChecks: { table: string; column: string }[] = [
      { table: "AuditLog", column: "actor" },
      { table: "AuditLog", column: "metadata" },
      { table: "Booking", column: "priority" },
      { table: "BookingStaffAssignment", column: "briefStatus" },
      { table: "BookingStaffAssignment", column: "acknowledgedAt" },
      { table: "BookingStaffAssignment", column: "briefToken" },
      { table: "GuestRequest", column: "sessionId" },
      { table: "GuestRequest", column: "trackName" },
    ];

    console.log("\n📋 CRITICAL COLUMNS (recent migrations)");
    console.log("───────────────────────────────────────────────────────────");

    const columnResults: ColumnCheck[] = [];
    for (const { table, column } of criticalChecks) {
      if (!actualTables.includes(table)) {
        columnResults.push({ table, column, exists: false });
        continue;
      }
      const result = await prisma.$queryRaw<
        Array<{ column_name: string; data_type: string }>
      >(
        Prisma.sql`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = ${table}
          AND column_name = ${column}
        `
      );
      const exists = result.length > 0;
      columnResults.push({
        table,
        column,
        exists,
        type: exists ? result[0].data_type : undefined,
      });
    }

    let allCriticalOk = true;
    for (const r of columnResults) {
      const status = r.exists ? "✅" : "❌";
      const typeStr = r.type ? ` (${r.type})` : "";
      console.log(`   ${status} ${r.table}.${r.column}${typeStr}`);
      if (!r.exists) allCriticalOk = false;
    }
    if (allCriticalOk) {
      console.log("\n   ✅ All critical columns present.");
    } else {
      console.log("\n   ⚠️  Run the relevant migration SQL (see supabase-*.sql files).");
    }

    // 4. Index check (sample: Booking)
    console.log("\n📋 INDEXES (sample: Booking)");
    console.log("───────────────────────────────────────────────────────────");
    try {
      const indexRows = await prisma.$queryRaw<
        Array<{ index_name: string; column_name: string }>
      >(
        Prisma.sql`
          SELECT i.relname AS index_name, a.attname AS column_name
          FROM pg_class t
          JOIN pg_index ix ON t.oid = ix.indrelid
          JOIN pg_class i ON i.oid = ix.indexrelid
          JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey) AND a.attnum > 0
          WHERE t.relkind = 'r' AND t.relname = 'Booking' AND i.relname NOT LIKE 'pg_%'
          ORDER BY i.relname, a.attnum
        `
      );
      const byIndex = new Map<string, string[]>();
      for (const r of indexRows) {
        if (!byIndex.has(r.index_name)) byIndex.set(r.index_name, []);
        byIndex.get(r.index_name)!.push(r.column_name);
      }
      for (const [name, cols] of byIndex) {
        console.log(`   - ${name}: (${cols.join(", ")})`);
      }
      if (byIndex.size === 0) console.log("   (No indexes found)");
    } catch (e: any) {
      console.log(`   (Error: ${e?.message})`);
    }

    // 5. Row counts (optional, for health check)
    console.log("\n📋 ROW COUNTS (sample)");
    console.log("───────────────────────────────────────────────────────────");
    const countFns: [string, () => Promise<number>][] = [
      ["Booking", () => prisma.booking.count()],
      ["User", () => prisma.user.count()],
      ["AuditLog", () => prisma.auditLog.count()],
      ["EmailThread", () => prisma.emailThread.count()],
      ["HireItem", () => prisma.hireItem.count()],
    ];
    for (const [name, fn] of countFns) {
      try {
        const n = await fn();
        console.log(`   ${name}: ${n}`);
      } catch (e: any) {
        console.log(`   ${name}: (${e?.code || "error"})`);
      }
    }

    // 6. Connection info (masked)
    const dbUrl = process.env.DATABASE_URL || "";
    const host = dbUrl.includes("@") ? dbUrl.split("@")[1]?.split("/")[0] : "—";
    console.log("\n📋 CONNECTION");
    console.log("───────────────────────────────────────────────────────────");
    console.log(`   Host: ${host || "—"}`);
    console.log(`   Schema: public`);

    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("  Audit complete");
    console.log("═══════════════════════════════════════════════════════════\n");
  } catch (error: any) {
    console.error("❌ Audit failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
