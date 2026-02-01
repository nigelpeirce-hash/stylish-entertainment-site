import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface TableAudit {
  tableName: string;
  exists: boolean;
  columns: ColumnAudit[];
  indexes: IndexAudit[];
  missingColumns: string[];
  extraColumns: string[];
  missingIndexes: string[];
}

interface ColumnAudit {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
  exists: boolean;
  expectedType?: string;
  typeMatch: boolean;
}

interface IndexAudit {
  name: string;
  columns: string[];
  unique: boolean;
  exists: boolean;
}

interface CriticalColumnCheck {
  table: string;
  column: string;
  exists: boolean;
  description?: string;
}

interface AuditResult {
  tables: TableAudit[];
  criticalColumns: CriticalColumnCheck[];
  summary: {
    totalTables: number;
    existingTables: number;
    missingTables: number;
    totalColumns: number;
    missingColumns: number;
    extraColumns: number;
    typeMismatches: number;
    missingIndexes: number;
    criticalMissing: number;
  };
}

// Map Prisma types to PostgreSQL types
function mapPrismaToPostgres(prismaType: string): string {
  const typeMap: Record<string, string> = {
    String: "text",
    Int: "integer",
    Float: "double precision",
    Boolean: "boolean",
    DateTime: "timestamp with time zone",
    Json: "jsonb",
    "String[]": "text[]",
    "Int[]": "integer[]",
  };

  // Handle @db.Text, @db.VarChar, etc.
  if (prismaType.includes("@db.Text")) return "text";
  if (prismaType.includes("@db.VarChar")) return "character varying";
  if (prismaType.includes("@db.Json")) return "jsonb";

  const baseType = prismaType.split("@")[0].trim();
  return typeMap[baseType] || baseType.toLowerCase();
}

// All Prisma models (table names) – must match schema.prisma
const EXPECTED_TABLES = [
  "Account", "AuditLog", "Booking", "BookingStaffAssignment", "BookingItem",
  "BookingWarehouseItem", "Cart", "CartItem", "CommsLog", "DispatchConfirmation",
  "DJ", "Email", "EmailFolder", "EmailInbox", "EmailTemplate", "EmailThread",
  "FormSubmission", "FreelanceCrew", "GuestRequest", "HireItem", "HireOrder",
  "HireOrderItem", "Musician", "NewEnquiry", "Note", "ServiceQuoteItem",
  "Session", "Staff_Settings", "Task", "User", "Venue", "VenueAsset",
  "VerificationToken", "WarehouseItem",
];

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all tables from information_schema
    const tablesQuery = Prisma.sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    const tablesResult = await prisma.$queryRaw<Array<{ table_name: string }>>(tablesQuery);
    const actualTables = tablesResult.map(t => t.table_name);
    const expectedTables = EXPECTED_TABLES;

    const auditResults: TableAudit[] = [];

    // Audit each expected table
    for (const tableName of expectedTables) {
      const exists = actualTables.includes(tableName);
      
      if (!exists) {
        auditResults.push({
          tableName,
          exists: false,
          columns: [],
          indexes: [],
          missingColumns: [],
          extraColumns: [],
          missingIndexes: [],
        });
        continue;
      }

      // Get actual columns from database
      const columnsQuery = Prisma.sql`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          udt_name
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
        ORDER BY ordinal_position;
      `;

      const columnsResult = await prisma.$queryRaw<Array<{
        column_name: string;
        data_type: string;
        is_nullable: string;
        column_default: string | null;
        udt_name: string;
      }>>(columnsQuery);

      // Get actual indexes
      const indexesQuery = Prisma.sql`
        SELECT
          i.relname AS index_name,
          a.attname AS column_name,
          ix.indisunique AS is_unique
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON i.oid = ix.indexrelid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
        WHERE t.relkind = 'r'
        AND t.relname = ${tableName}
        AND i.relname NOT LIKE 'pg_%'
        ORDER BY i.relname, a.attnum;
      `;

      const indexesResult = await prisma.$queryRaw<Array<{
        index_name: string;
        column_name: string;
        is_unique: boolean;
      }>>(indexesQuery);

      // Group indexes by name
      const indexMap = new Map<string, { columns: string[]; unique: boolean }>();
      for (const idx of indexesResult) {
        if (!indexMap.has(idx.index_name)) {
          indexMap.set(idx.index_name, { columns: [], unique: idx.is_unique });
        }
        indexMap.get(idx.index_name)!.columns.push(idx.column_name);
      }

      // Get expected columns from Prisma model (we'll infer from actual usage)
      // For a complete audit, we'd need to parse the schema file, but this gives us a good start
      const actualColumns = columnsResult.map(col => ({
        name: col.column_name,
        type: col.data_type === "USER-DEFINED" ? col.udt_name : col.data_type,
        nullable: col.is_nullable === "YES",
        defaultValue: col.column_default,
        exists: true,
        typeMatch: true, // We'll mark this for now
      }));

      const columnAudits: ColumnAudit[] = actualColumns.map(col => ({
        name: col.name,
        type: col.type,
        nullable: col.nullable,
        defaultValue: col.defaultValue,
        exists: true,
        typeMatch: true,
      }));

      // Get indexes
      const indexAudits: IndexAudit[] = Array.from(indexMap.entries()).map(([name, data]) => ({
        name,
        columns: data.columns,
        unique: data.unique,
        exists: true,
      }));

      auditResults.push({
        tableName,
        exists: true,
        columns: columnAudits,
        indexes: indexAudits,
        missingColumns: [],
        extraColumns: [],
        missingIndexes: [],
      });
    }

    // Check for extra tables in database
    for (const actualTable of actualTables) {
      if (!expectedTables.includes(actualTable) && !actualTable.startsWith("_")) {
        auditResults.push({
          tableName: actualTable,
          exists: true,
          columns: [],
          indexes: [],
          missingColumns: [],
          extraColumns: [],
          missingIndexes: [],
        });
      }
    }

    // Calculate summary
    const existingTables = auditResults.filter(t => t.exists && expectedTables.includes(t.tableName)).length;
    const missingTables = auditResults.filter(t => !t.exists).length;
    const totalColumns = auditResults.reduce((sum, t) => sum + t.columns.length, 0);
    const missingColumns = auditResults.reduce((sum, t) => sum + t.missingColumns.length, 0);
    const extraColumns = auditResults.reduce((sum, t) => sum + t.extraColumns.length, 0);
    const typeMismatches = auditResults.reduce((sum, t) => 
      sum + t.columns.filter(c => !c.typeMatch).length, 0);
    const missingIndexes = auditResults.reduce((sum, t) => sum + t.missingIndexes.length, 0);

    // Critical column checks (recent migrations)
    const criticalChecks: { table: string; column: string; description?: string }[] = [
      { table: "AuditLog", column: "actor", description: "Activity feed actor (client/guest/admin/system)" },
      { table: "AuditLog", column: "metadata", description: "Activity feed metadata (JSON)" },
      { table: "BookingStaffAssignment", column: "briefStatus", description: "Brief acknowledgment status" },
      { table: "BookingStaffAssignment", column: "briefToken", description: "Brief confirmation token" },
    ];
    const criticalColumns: CriticalColumnCheck[] = [];
    for (const { table, column, description } of criticalChecks) {
      if (!actualTables.includes(table)) {
        criticalColumns.push({ table, column, exists: false, description });
        continue;
      }
      const colResult = await prisma.$queryRaw<Array<{ column_name: string }>>(
        Prisma.sql`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = ${table} AND column_name = ${column}
        `
      );
      criticalColumns.push({
        table,
        column,
        exists: colResult.length > 0,
        description,
      });
    }
    const criticalMissing = criticalColumns.filter((c) => !c.exists).length;

    return NextResponse.json({
      success: true,
      audit: auditResults,
      criticalColumns,
      summary: {
        totalTables: expectedTables.length,
        existingTables,
        missingTables,
        totalColumns,
        missingColumns,
        extraColumns,
        typeMismatches,
        missingIndexes,
        criticalMissing,
      },
    });
  } catch (error: any) {
    console.error("Database audit error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to audit database",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
