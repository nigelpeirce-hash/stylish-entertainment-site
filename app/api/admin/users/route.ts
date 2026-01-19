import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllUsers } from "@/lib/supabase-admin";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Get all users from Prisma
    const prismaUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Try to get Supabase Auth users (if configured) to merge invite status
    let supabaseUsers: any[] = [];
    try {
      const supabaseResult = await getAllUsers();
      if (supabaseResult.success) {
        supabaseUsers = supabaseResult.users || [];
      }
    } catch (supabaseError) {
      // Supabase not configured, continue with Prisma users only
      console.warn("Supabase users not available:", supabaseError);
    }

    // Merge Prisma users with Supabase Auth data
    const users = prismaUsers.map((prismaUser) => {
      const supabaseUser = supabaseUsers.find(
        (su) => su.email === prismaUser.email
      );

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        role: prismaUser.role,
        image: prismaUser.image,
        emailVerified: prismaUser.emailVerified !== null,
        inviteStatus: prismaUser.emailVerified
          ? "accepted"
          : supabaseUser?.invited_at
          ? "pending"
          : "not_invited",
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
        lastSignIn: supabaseUser?.last_sign_in_at || null,
      };
    });

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["admin", "user", "client"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin', 'user', or 'client'" },
        { status: 400 }
      );
    }

    // Prevent users from changing their own role
    if (userId === admin.id && role !== admin.role) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 403 }
      );
    }

    // Update user role in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    // Try to update in Supabase if configured
    try {
      const { updateUserRole } = await import("@/lib/supabase-admin");
      await updateUserRole(userId, role as "admin" | "user" | "client");
    } catch (supabaseError) {
      // Supabase not configured, continue
      console.warn("Supabase role update not available:", supabaseError);
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      {
        error: "Failed to update user role",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
