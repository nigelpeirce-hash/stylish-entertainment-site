import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { sendEmailFromCRM } from "@/lib/email-send";
import { prisma } from "@/lib/prisma";
import { processTemplate, extractBookingVariables, formatDJFee } from "@/lib/email-templates";
import * as z from "zod";

const sendEmailSchema = z.object({
  inboxId: z.string(),
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1).optional(),
  text: z.string().optional(),
  html: z.string().optional(),
  replyToMessageId: z.string().optional(),
  threadId: z.string().optional(),
  templateId: z.string().optional(),
  bookingId: z.string().optional(),
  djFee: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    if (!token || (token.role as string) !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = sendEmailSchema.parse(body);

    let subject = validatedData.subject || "";
    let html = validatedData.html || "";
    let text = validatedData.text || "";

    // If template is provided, process it
    if (validatedData.templateId) {
      const template = await prisma.emailTemplate.findUnique({
        where: { id: validatedData.templateId },
      });

      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      // Get booking if provided
      let booking = null;
      if (validatedData.bookingId) {
        booking = await prisma.booking.findUnique({
          where: { id: validatedData.bookingId },
        });
      }

      // Prepare template variables
      const variables: any = {};
      if (booking) {
        const bookingVars = extractBookingVariables(booking);
        Object.assign(variables, bookingVars);
      }
      if (validatedData.djFee) {
        variables.djFee = validatedData.djFee;
      }

      // Process template
      subject = processTemplate(template.subject, variables);
      html = processTemplate(template.bodyHtml, variables);
      text = template.bodyText
        ? processTemplate(template.bodyText, variables)
        : html.replace(/<[^>]*>/g, ""); // Strip HTML for text version
    }

    const result = await sendEmailFromCRM({
      inboxId: validatedData.inboxId,
      to: validatedData.to,
      subject: subject || "Re: Your inquiry",
      text: text || html.replace(/<[^>]*>/g, ""),
      html: html || undefined,
      replyToMessageId: validatedData.replyToMessageId,
      threadId: validatedData.threadId,
      sentByUserId: (token.id as string) || (token.sub as string),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: (result as any).error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
