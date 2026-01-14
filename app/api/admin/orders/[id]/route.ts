import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import * as z from "zod";

const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  notes: z.string().optional(),
});

// Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const orderId = resolvedParams.id;

    const order = await prisma.hireOrder.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            hireItem: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        confirmedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update order (confirm/cancel/etc)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const orderId = resolvedParams.id;

    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    const updateData: any = {
      ...validatedData,
    };

    // If confirming order, set confirmedAt and confirmedById
    if (validatedData.status === "confirmed") {
      updateData.confirmedAt = new Date();
      updateData.confirmedById = admin.id;
    }

    const order = await prisma.hireOrder.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            hireItem: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        confirmedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
