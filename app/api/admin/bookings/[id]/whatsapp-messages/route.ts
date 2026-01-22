import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Fetch all WhatsApp messages for this booking
    const messages = await prisma.commsLog.findMany({
      where: {
        bookingId,
        platform: "whatsapp",
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching WhatsApp messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
