import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const addToCartSchema = z.object({
  hireItemId: z.string(),
  quantity: z.number().int().min(1),
  sessionId: z.string().optional(), // For guest carts
});

const updateCartItemSchema = z.object({
  cartItemId: z.string(),
  quantity: z.number().int().min(1),
});

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const userId = token?.id as string | undefined;
    const guestSessionId = sessionId || undefined;

    // Find or create cart
    const whereConditions: any[] = [];
    if (userId) {
      whereConditions.push({ userId, status: "active" });
    }
    if (guestSessionId) {
      whereConditions.push({ sessionId: guestSessionId, status: "active" });
    }

    let cart = null;
    if (whereConditions.length > 0) {
      cart = await prisma.cart.findFirst({
        where: { OR: whereConditions },
        include: {
          items: {
            include: {
              hireItem: true,
            },
          },
        },
      });
    }

    if (!cart) {
      // Create new cart
      cart = await prisma.cart.create({
        data: {
          userId: userId || undefined,
          sessionId: guestSessionId || undefined,
          status: "active",
        },
        include: {
          items: {
            include: {
              hireItem: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    const body = await request.json();
    const validatedData = addToCartSchema.parse(body);

    const userId = token?.id as string | undefined;
    const sessionId = validatedData.sessionId;

    // Get hire item
    const hireItem = await prisma.hireItem.findUnique({
      where: { id: validatedData.hireItemId },
    });

    if (!hireItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (!hireItem.isActive) {
      return NextResponse.json({ error: "Item is not available" }, { status: 400 });
    }

    if (hireItem.stockAvailable < validatedData.quantity) {
      return NextResponse.json(
        { error: `Only ${hireItem.stockAvailable} available` },
        { status: 400 }
      );
    }

    // Find or create cart
    const whereConditions: any[] = [];
    if (userId) {
      whereConditions.push({ userId, status: "active" });
    }
    if (sessionId) {
      whereConditions.push({ sessionId, status: "active" });
    }

    let cart = null;
    if (whereConditions.length > 0) {
      cart = await prisma.cart.findFirst({
        where: { OR: whereConditions },
      });
    }

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId || undefined,
          sessionId: sessionId || undefined,
          status: "active",
        },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        hireItemId: validatedData.hireItemId,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + validatedData.quantity;
      if (hireItem.stockAvailable < newQuantity) {
        return NextResponse.json(
          { error: `Only ${hireItem.stockAvailable} available` },
          { status: 400 }
        );
      }

      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          hireItem: true,
        },
      });

      return NextResponse.json({ cartItem: updated });
    } else {
      // Add new item
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          hireItemId: validatedData.hireItemId,
          quantity: validatedData.quantity,
          price: hireItem.price,
        },
        include: {
          hireItem: true,
        },
      });

      return NextResponse.json({ cartItem }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    const body = await request.json();
    const validatedData = updateCartItemSchema.parse(body);

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: validatedData.cartItemId },
      include: {
        hireItem: true,
        cart: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    // Check authorization
    const userId = token?.id as string | undefined;
    if (cartItem.cart.userId && cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check stock
    if (cartItem.hireItem.stockAvailable < validatedData.quantity) {
      return NextResponse.json(
        { error: `Only ${cartItem.hireItem.stockAvailable} available` },
        { status: 400 }
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: validatedData.cartItemId },
      data: { quantity: validatedData.quantity },
      include: {
        hireItem: true,
      },
    });

    return NextResponse.json({ cartItem: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("cartItemId");

    if (!cartItemId) {
      return NextResponse.json({ error: "cartItemId required" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    // Check authorization
    const userId = token?.id as string | undefined;
    if (cartItem.cart.userId && cartItem.cart.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
