import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    if (!token || !token.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: any = {
      userId: token.id as string,
    };

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { fromEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const threads = await prisma.emailThread.findMany({
      where,
      include: {
        booking: {
          select: { id: true, eventType: true, eventDate: true },
        },
        _count: {
          select: { emails: true },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Error fetching client threads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
