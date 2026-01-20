import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { inviteUserByEmail } from "@/lib/supabase-admin";
import { prisma } from "@/lib/prisma";
import { getResendConfig, EMAIL_CONFIG } from "@/lib/email-config";
import { Resend } from "resend";
import { sendEmail } from "@/lib/email";
import { getEmailUrl, getRelativePath } from "@/lib/get-base-url";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy Resend initialization
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Return a mock object that will fail gracefully when used
    return {
      emails: {
        send: async () => {
          throw new Error("RESEND_API_KEY environment variable is not set");
        },
      },
    } as any;
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

    // If user exists, update their role instead of creating new
    if (existingUser) {
      // Update existing user's role and mark as invited
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: role,
          invitedAt: new Date(), // Mark as invited
          updatedAt: new Date(),
        },
      });

      // Try to update in Supabase if configured
      try {
        const { updateUserRole } = await import("@/lib/supabase-admin");
        await updateUserRole(existingUser.id, role as "admin" | "user" | "client");
      } catch (supabaseError: any) {
        // Supabase not configured, continue silently
        if (!supabaseError.message?.includes("Supabase credentials not configured")) {
          console.warn("Supabase role update not available:", supabaseError);
        }
      }

      // Generate invite URL for existing user (full URL for email)
      const inviteUrl = getEmailUrl(
        `/auth/setup?email=${encodeURIComponent(email)}&token=${Buffer.from(`${email}:${Date.now()}`).toString("base64")}`,
        request
      );

      // Send invite email to existing user with updated role
      const emailConfig = getResendConfig("general");
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
              <h1>Your Access Has Been Updated</h1>
            </div>
            <p>Hello,</p>
            <p>Your access to the STYLISH Entertainment admin panel has been updated. You now have <strong>${role}</strong> access.</p>
            <p>Click the button below to access the admin panel:</p>
            <div style="text-align: center;">
              <a href="${inviteUrl}" class="button">Access Admin Panel</a>
            </div>
            <p style="font-size: 12px; color: #999;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">${inviteUrl}</p>
            <div class="footer">
              <p>STYLISH Entertainment</p>
              <p>West Country | London | Nationwide</p>
            </div>
          </div>
        </body>
      </html>
    `;

      // Check if email was actually sent
      let emailSent = false;
      
      // Try Resend first
      try {
        const resend = getResend();
        await resend.emails.send({
          from: emailConfig.from,
          replyTo: emailConfig.replyTo,
          to: [email],
          subject: `Your STYLISH Entertainment Admin Access Has Been Updated`,
          html: emailHtml,
        });
        emailSent = true;
      } catch (resendError: any) {
        // If Resend fails, try fallback email system (Mailgun/SMTP)
        if (resendError.message?.includes("RESEND_API_KEY")) {
          try {
            const result = await sendEmail({
              to: email,
              subject: `Your STYLISH Entertainment Admin Access Has Been Updated`,
              html: emailHtml,
              // Don't pass from - let email.ts use the verified Mailgun domain email
            });
            emailSent = result.success;
          } catch (fallbackError: any) {
            console.warn("Both Resend and fallback email failed:", fallbackError.message);
          }
        } else {
          console.error("Error sending update email via Resend:", resendError);
        }
      }

      return NextResponse.json({
        success: true,
        message: emailSent 
          ? "User role updated and invitation sent" 
          : "User role updated (email not sent - check RESEND_API_KEY)",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        inviteUrl: inviteUrl,
        wasExisting: true,
        emailSent: emailSent,
      });
    }

    // Try to invite via Supabase Admin Auth (if configured)
    let inviteResult;
    let supabaseInviteUrl: string | null = null;

    try {
      inviteResult = await inviteUserByEmail(email, role as "admin" | "user", {
        redirectTo: getEmailUrl("/auth/callback", request),
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
        invitedAt: new Date(), // Mark as invited
        updatedAt: new Date(),
      },
      create: {
        email,
        name: email.split("@")[0], // Default name from email
        role: role,
        password: null, // No password until they accept invite
        emailVerified: null,
        invitedAt: new Date(), // Mark as invited
      },
    });

    // Send invite email via Resend
    const emailConfig = getResendConfig("general");
    const inviteUrl =
      supabaseInviteUrl ||
      getEmailUrl(`/auth/setup?email=${encodeURIComponent(email)}&token=${Buffer.from(`${email}:${Date.now()}`).toString("base64")}`, request);

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

    // Check if email was actually sent
    let emailSent = false;
    
    // Try Resend first
    try {
      const resend = getResend();
      await resend.emails.send({
        from: emailConfig.from,
        replyTo: emailConfig.replyTo,
        to: [email],
        subject: `You've been invited to STYLISH Entertainment Admin Panel`,
        html: emailHtml,
      });
      emailSent = true;
    } catch (resendError: any) {
      // If Resend fails, try fallback email system (Mailgun/SMTP)
      if (resendError.message?.includes("RESEND_API_KEY")) {
        try {
          const result = await sendEmail({
            to: email,
            subject: `You've been invited to STYLISH Entertainment Admin Panel`,
            html: emailHtml,
            from: emailConfig.from,
          });
          emailSent = result.success;
        } catch (fallbackError: any) {
          console.warn("Both Resend and fallback email failed:", fallbackError.message);
        }
      } else {
        console.error("Error sending invite email via Resend:", resendError);
      }
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? "User invited successfully" 
        : "User created (email not sent - check email configuration)",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      inviteUrl: supabaseInviteUrl || inviteUrl,
      emailSent: emailSent,
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
