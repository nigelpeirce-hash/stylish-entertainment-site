import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(
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
    const enquiryId = resolvedParams.id;

    if (!enquiryId) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    const updatedEnquiry = await prisma.newEnquiry.update({
      where: { id: enquiryId },
      data: {
        status: "reviewed",
        reviewedAt: new Date(),
        reviewedBy: admin?.id || null,
      },
    });

    return NextResponse.json({ enquiry: updatedEnquiry });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
