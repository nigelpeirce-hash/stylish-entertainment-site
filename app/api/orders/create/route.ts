import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const createOrderSchema = z.object({
  cartId: z.string(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  eventDate: z.string().optional(), // ISO date string
  eventType: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  notes: z.string().optional(),
});

// Generate order number
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `ORD-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: validatedData.cartId },
      include: {
        items: {
          include: {
            hireItem: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or not found" },
        { status: 400 }
      );
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await prisma.hireOrder.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone || undefined,
        customerAddress: validatedData.customerAddress || undefined,
        eventDate: validatedData.eventDate
          ? new Date(validatedData.eventDate)
          : undefined,
        eventType: validatedData.eventType || undefined,
        venueName: validatedData.venueName || undefined,
        venueAddress: validatedData.venueAddress || undefined,
        notes: validatedData.notes || undefined,
        totalAmount,
        status: "pending",
        userId: (token?.id as string) || undefined,
        items: {
          create: cart.items.map((item) => ({
            hireItemId: item.hireItemId,
            quantity: item.quantity,
            price: item.price,
            itemName: item.hireItem.name,
          })),
        },
      },
      include: {
        items: {
          include: {
            hireItem: true,
          },
        },
      },
    });

    // Mark cart as completed
    await prisma.cart.update({
      where: { id: cart.id },
      data: { status: "completed" },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
