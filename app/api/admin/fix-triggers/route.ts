import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Drop all triggers on Booking table
    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN 
              SELECT trigger_name 
              FROM information_schema.triggers 
              WHERE event_object_table = 'Booking'
          LOOP
              EXECUTE format('DROP TRIGGER IF EXISTS %I ON "Booking"', r.trigger_name);
          END LOOP;
      END $$;
    `);

    return NextResponse.json({
      success: true,
      message: "All triggers on Booking table have been dropped",
    });
  } catch (error: any) {
    console.error("Error dropping triggers:", error);
    return NextResponse.json(
      {
        error: "Failed to drop triggers",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
