import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { inviteUserByEmail } from "@/lib/supabase-admin";
import { prisma } from "@/lib/prisma";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";
import { Resend } from "resend";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy Resend initialization
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
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
    const { email, role = "user" } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
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

    // Check if user already exists in Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Try to invite via Supabase Admin Auth (if configured)
    let inviteResult;
    let supabaseInviteUrl: string | null = null;

    try {
      inviteResult = await inviteUserByEmail(email, role as "admin" | "user", {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        data: {
          role,
          invited_by: admin.id,
        },
      });

      if (inviteResult.success && inviteResult.inviteUrl) {
        supabaseInviteUrl = inviteResult.inviteUrl;
      }
    } catch (supabaseError) {
      // If Supabase is not configured, we'll create a user invitation manually
      console.warn("Supabase invite failed, falling back to manual invite:", supabaseError);
    }

    // Create or update user in Prisma with invite status
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: role,
        updatedAt: new Date(),
      },
      create: {
        email,
        name: email.split("@")[0], // Default name from email
        role: role,
        password: null, // No password until they accept invite
        emailVerified: null,
      },
    });

    // Send invite email via Resend
    const emailConfig = getResendConfig("general");
    const inviteUrl =
      supabaseInviteUrl ||
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/setup?email=${encodeURIComponent(email)}&token=${Buffer.from(`${email}:${Date.now()}`).toString("base64")}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #D4AF37;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-family: 'Playfair Display', serif;
              font-size: 32px;
              font-weight: 600;
              color: #1a1a1a;
              letter-spacing: 2px;
              margin-bottom: 10px;
            }
            h1 {
              color: #1a1a1a;
              font-size: 24px;
              margin: 0;
            }
            p {
              color: #666;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              background-color: #D4AF37;
              color: #1a1a1a;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #c9a030;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">S</div>
              <h1>You've been invited</h1>
            </div>
            <p>Hello,</p>
            <p>You've been invited by <strong>${admin.name || admin.email}</strong> to join the STYLISH Entertainment admin panel with <strong>${role}</strong> access.</p>
            <p>Click the button below to accept the invitation and set up your account:</p>
            <div style="text-align: center;">
              <a href="${inviteUrl}" class="button">Accept Invitation</a>
            </div>
            <p style="font-size: 12px; color: #999;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">${inviteUrl}</p>
            <p style="font-size: 12px; color: #999;">This invitation will expire in 7 days.</p>
            <div class="footer">
              <p>STYLISH Entertainment</p>
              <p>West Country | London | Nationwide</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await getResend().emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [email],
        subject: `You've been invited to STYLISH Entertainment Admin Panel`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Error sending invite email:", emailError);
      // Continue even if email fails - the user is created
    }

    return NextResponse.json({
      success: true,
      message: "User invited successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      inviteUrl: supabaseInviteUrl || inviteUrl,
    });
  } catch (error: any) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      {
        error: "Failed to invite user",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
