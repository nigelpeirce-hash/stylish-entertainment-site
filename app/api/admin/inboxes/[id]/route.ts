import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const updateInboxSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
  syncEnabled: z.boolean().optional(),
  syncInterval: z.number().int().optional(),
  imapHost: z.string().min(1).optional(),
  imapPort: z.number().int().min(1).max(65535).optional(),
  imapSecure: z.boolean().optional(),
  imapUsername: z.string().min(1).optional(),
  imapPassword: z.string().min(1).optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().int().min(1).max(65535).optional(),
  smtpSecure: z.boolean().optional(),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
});

// Update inbox
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateInboxSchema.parse(body);

    const inbox = await prisma.emailInbox.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        syncEnabled: true,
        lastSyncedAt: true,
        syncInterval: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ inbox });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating inbox:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Delete inbox
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.emailInbox.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Inbox deleted" });
  } catch (error: any) {
    console.error("Error deleting inbox:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
