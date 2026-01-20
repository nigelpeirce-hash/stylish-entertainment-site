import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { getEmailUrl } from "@/lib/get-base-url";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Always return success to prevent email enumeration
    // Don't reveal whether the email exists or not
    if (!user) {
      // User doesn't exist, but return success anyway for security
      return NextResponse.json({
        message: "If an account exists with that email, we've sent you a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

    // Store reset token in VerificationToken table (used by NextAuth)
    // Delete any existing tokens for this email first
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: `password-reset:${user.email}`,
      },
    });

    // Create new verification token for password reset
    await prisma.verificationToken.create({
      data: {
        identifier: `password-reset:${user.email}`,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    });

    // Create reset URL (full URL for email)
    const resetUrl = getEmailUrl(`/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`, request);

    // Send reset email
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password - Stylish Entertainment",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                  color: #d4af37;
                  padding: 30px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
                }
                .content {
                  background: #ffffff;
                  padding: 30px;
                  border-radius: 0 0 8px 8px;
                  border: 1px solid #e5e5e5;
                }
                .button {
                  display: inline-block;
                  background: #d4af37;
                  color: #000000;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                  margin: 20px 0;
                }
                .button:hover {
                  background: #c4a027;
                }
                .footer {
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e5e5;
                  font-size: 12px;
                  color: #666;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Stylish Entertainment</h1>
              </div>
              <div class="content">
                <h2>Reset Your Password</h2>
                <p>Hi ${user.name || "there"},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <p style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </p>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <div class="footer">
                  <p>Stylish Entertainment<br>88 Weymouth Road, Frome, Somerset BA11 1HJ</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
          Reset Your Password - Stylish Entertainment

          Hi ${user.name || "there"},

          We received a request to reset your password. Click the link below to create a new password:

          ${resetUrl}

          This link will expire in 1 hour.

          If you didn't request a password reset, you can safely ignore this email.

          ---
          Stylish Entertainment
          88 Weymouth Road, Frome, Somerset BA11 1HJ
        `,
      });
    } catch (emailError) {
      console.error("Error sending reset email:", emailError);
      // Still return success to prevent email enumeration
      return NextResponse.json({
        message: "If an account exists with that email, we've sent you a password reset link.",
      });
    }

    return NextResponse.json({
      message: "If an account exists with that email, we've sent you a password reset link.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: "If an account exists with that email, we've sent you a password reset link.",
    });
  }
}
