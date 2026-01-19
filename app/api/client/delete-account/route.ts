import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    let userId: string | null = null;

    if (token) {
      userId = (token.id as string) || (token.sub as string);
    } else {
      const session = await getServerSession();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = (session.user as any).id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get deletion metadata from request
    const body = await request.json();
    const deletionIp = body.deletion_ip || "Unknown";
    const deletionTimestamp = body.deletion_timestamp || new Date().toISOString();

    // Get user data for logging before anonymization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has active or upcoming bookings
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        eventDate: true,
        status: true,
      },
    });

    // Check for upcoming bookings (eventDate >= today)
    const upcomingBookings = bookings.filter((booking) => {
      const eventDate = new Date(booking.eventDate);
      return eventDate >= new Date();
    });

    // Determine event status
    const eventStatus = upcomingBookings.length > 0 ? 'UPCOMING' : null;

    // 1. Check if event status is UPCOMING - prevent deletion
    if (eventStatus === 'UPCOMING') {
      return NextResponse.json(
        {
          error: "Cannot delete account with an active booking.",
        },
        { status: 400 }
      );
    }

    // 2. Record the final metadata for GDPR compliance
    // Log deletion request with structured data
    console.log("USER_DELETION_REQUEST:", {
      action: 'USER_DELETION_REQUEST',
      userId: user.id,
      email: user.email,
      name: user.name,
      ip: deletionIp,
      timestamp: deletionTimestamp,
      eventStatus: eventStatus || 'NONE',
    });

    // 3. Anonymize personal data (soft delete with GDPR compliance)
    // Replace name with 'Deleted User', clear phone and address
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: 'Deleted User',
        phone: null,
        address: null,
        // Note: Email is kept as unique identifier but can be hashed/anonymized if needed
        // Password is cleared for security
        password: null,
        // Mark as deleted using updatedAt timestamp (requires is_deleted field in schema for proper soft delete)
        // For now, we rely on name === 'Deleted User' as the soft delete marker
      },
    });

    // Log successful anonymization
    console.log("Account anonymized successfully:", {
      userId: user.id,
      originalEmail: user.email,
      deletionIp,
      deletionTimestamp,
    });

    return NextResponse.json({
      message: "Account deleted successfully",
      deletedAt: deletionTimestamp,
    });
  } catch (error: any) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
