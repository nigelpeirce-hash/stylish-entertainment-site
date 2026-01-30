import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check if request is from localhost (development only)
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || 
                       hostname.includes("127.0.0.1") ||
                       process.env.NODE_ENV === "development";
    
    // In development/localhost, allow access even if admin check fails (for dev bypass)
    let admin = await requireAdmin(request);
    
    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const includeArchived = searchParams.get("includeArchived") === "true";
    const archivedOnly = searchParams.get("archivedOnly") === "true";

    const where: any = {};
    
    // Archive filtering: by default exclude archived bookings
    if (archivedOnly) {
      // Show only archived bookings
      where.archivedAt = { not: null };
    } else if (!includeArchived) {
      // Default: exclude archived bookings
      where.archivedAt = null;
    }
    // If includeArchived=true, no filter is applied (shows all)
    
    if (status && status !== "archived") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { venueName: { contains: search, mode: "insensitive" } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        // Include all staff assignments (no role filtering for admin - they need to see everything)
        staffAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                roles: true,
                isActive: true,
              },
            },
          },
        },
        User: {
          select: { id: true, name: true, email: true },
        },
        NewEnquiry: { select: { id: true } },
      },
      orderBy: [
        { priority: "desc" }, // Urgent first (alphabetically "urgent" > "medium" > "low")
        { createdAt: "desc" },
      ],
      take: 100,
    });

    // Sort bookings: New enquiries first (no lastEmailSentAt), then by priority, then by date
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const sortedBookings = bookings.sort((a, b) => {
      // First: New enquiries (no lastEmailSentAt) come first
      const aIsNew = !a.lastEmailSentAt;
      const bIsNew = !b.lastEmailSentAt;
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      
      // Second: Priority (urgent > high > medium > low)
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Third: Date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Add artistQuoteSentAt for each booking (for "pulse until quote sent" UX)
    const bookingsWithQuoteSent = sortedBookings.map((b) => {
      const emailsSent = b.emailsSent as { artistQuotes?: { sentAt: string }[] } | undefined;
      const quotes = emailsSent?.artistQuotes;
      const artistQuoteSentAt =
        Array.isArray(quotes) && quotes.length > 0
          ? (quotes[quotes.length - 1]?.sentAt ?? null)
          : null;
      return { ...b, artistQuoteSentAt };
    });

    return NextResponse.json({ bookings: bookingsWithQuoteSent });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
