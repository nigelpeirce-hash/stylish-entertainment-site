import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { randomUUID } from 'crypto';

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const inboxSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  imapHost: z.string().min(1),
  imapPort: z.number().int().min(1).max(65535),
  imapSecure: z.boolean(),
  imapUsername: z.string().min(1),
  imapPassword: z.string().min(1),
  smtpHost: z.string().optional(),
  smtpPort: z.number().int().min(1).max(65535).optional(),
  smtpSecure: z.boolean().optional(),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
  syncEnabled: z.boolean().optional(),
  syncInterval: z.number().int().optional(),
  assignedUsers: z.array(z.string().email()).optional(),
});

// Get all inboxes
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseSelect = {
      id: true,
      name: true,
      email: true,
      isActive: true,
      syncEnabled: true,
      lastSyncedAt: true,
      syncInterval: true,
      createdAt: true,
      updatedAt: true,
      // IMAP (no password)
      imapHost: true,
      imapPort: true,
      imapSecure: true,
      imapUsername: true,
      // SMTP (no password)
      smtpHost: true,
      smtpPort: true,
      smtpSecure: true,
      smtpUsername: true,
      // Never return passwords
      imapPassword: false,
      smtpPassword: false,
    };

    // Try to fetch with assignedUsers first, fall back if column doesn't exist
    let inboxes;
    try {
      // First attempt: try with assignedUsers (if migration has been run)
      inboxes = await prisma.emailInbox.findMany({
        orderBy: { createdAt: "desc" },
        select: ({ ...baseSelect, assignedUsers: true } as any),
      });
    } catch (error: any) {
      // If assignedUsers column doesn't exist, fetch without it
      if (error?.message?.includes("assignedUsers") || error?.code === "P2009" || error?.message?.includes("Unknown field")) {
        inboxes = await prisma.emailInbox.findMany({
          orderBy: { createdAt: "desc" },
          select: baseSelect,
        });
        // Add default empty array for assignedUsers
        inboxes.forEach((inbox: any) => {
          (inbox as any).assignedUsers = [];
        });
      } else {
        // Re-throw if it's a different error
        throw error;
      }
    }

    return NextResponse.json({ inboxes });
  } catch (error: any) {
    console.error("Error fetching inboxes:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// Create new inbox
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = inboxSchema.parse(body);
    const inboxId = randomUUID();

    const baseSelect = {
      id: true,
      name: true,
      email: true,
      isActive: true,
      syncEnabled: true,
      lastSyncedAt: true,
      syncInterval: true,
      // IMAP (no password)
      imapHost: true,
      imapPort: true,
      imapSecure: true,
      imapUsername: true,
      // SMTP (no password)
      smtpHost: true,
      smtpPort: true,
      smtpSecure: true,
      smtpUsername: true,
      createdAt: true,
      updatedAt: true,
    };

    let inbox;
    try {
      // Try to create with assignedUsers in select (if migration has been run)
      inbox = await prisma.emailInbox.create({
        data: {
          id: inboxId,
          ...validatedData,
          isActive: true,
          syncEnabled: validatedData.syncEnabled ?? true,
          syncInterval: validatedData.syncInterval ?? 5,
        },
        select: ({ ...baseSelect, assignedUsers: true } as any),
      });
    } catch (error: any) {
      // If assignedUsers column doesn't exist, create without it
      if (error?.message?.includes("assignedUsers") || error?.code === "P2009" || error?.message?.includes("Unknown field")) {
        inbox = await prisma.emailInbox.create({
          data: {
            id: inboxId,
            ...validatedData,
            isActive: true,
            syncEnabled: validatedData.syncEnabled ?? true,
            syncInterval: validatedData.syncInterval ?? 5,
          },
          select: baseSelect,
        });
        // Add default empty array
        (inbox as any).assignedUsers = [];
      } else {
        // Re-throw if it's a different error
        throw error;
      }
    }

    return NextResponse.json({ inbox }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating inbox:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
