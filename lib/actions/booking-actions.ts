"use server";

import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { sendEmailFromCRM } from "@/lib/email-send";
import { auth } from "@/auth";

interface CreateBookingInput {
  title: string;
  clientEmail: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  sendPortalInvite?: boolean;
}

export async function createBooking(input: CreateBookingInput) {
  try {
    // Get current user for sentByUserId
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const userId = (session.user as any).id || (session.user as any).sub;

    // Generate booking reference
    const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Format endTime as string for djFinishTime field (since it's String? in schema)
    const endTimeString = input.endTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        name: input.title,
        email: input.clientEmail.toLowerCase(),
        eventDate: input.startTime,
        djFinishTime: endTimeString, // Store end time as formatted string
        eventType: "wedding", // Default, can be changed later
        venueName: "TBD", // Placeholder, can be updated
        status: "pending",
        adminNotes: input.notes || null,
        bookingReference,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Auto-link EmailThreads: Find threads with matching client email
    const emailThreads = await prisma.emailThread.findMany({
      where: {
        OR: [
          { fromEmail: input.clientEmail.toLowerCase() },
          { toEmail: input.clientEmail.toLowerCase() },
        ],
        bookingId: null, // Only link unlinked threads
      },
    });

    if (emailThreads.length > 0) {
      // Update all matching threads to link to this booking
      await prisma.emailThread.updateMany({
        where: {
          id: { in: emailThreads.map((t) => t.id) },
        },
        data: {
          bookingId: booking.id,
        },
      });
    }

    // Send portal invite if requested
    if (input.sendPortalInvite) {
      try {
        // Get the first active inbox for sending
        const inbox = await prisma.emailInbox.findFirst({
          where: { isActive: true, syncEnabled: true },
        });

        if (inbox) {
          // Generate portal link (adjust URL based on your actual portal route)
          const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://stylishentertainment.co.uk"}/client/bookings/${booking.id}`;
          
          const portalInviteHtml = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; max-width: 600px; margin: 0 auto;">
              <div style="border-top: 2px solid #000000; padding-top: 20px; margin-top: 20px;"></div>
              <h1 style="font-size: 24px; font-weight: 600; color: #1A1A1A; margin: 20px 0;">Manage Your Booking</h1>
              <p style="color: #1A1A1A; line-height: 1.6; margin: 16px 0;">
                Hello,
              </p>
              <p style="color: #1A1A1A; line-height: 1.6; margin: 16px 0;">
                Your booking has been created. You can now manage your booking details, view updates, and communicate with us through your personal portal.
              </p>
              <p style="color: #1A1A1A; line-height: 1.6; margin: 16px 0;">
                <strong>Event:</strong> ${input.title}<br>
                <strong>Date:</strong> ${input.startTime.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}<br>
                <strong>Time:</strong> ${input.startTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} - ${input.endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${portalUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #FFFFFF; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 2px;">
                  Access Your Booking Portal
                </a>
              </div>
              <p style="color: #1A1A1A; line-height: 1.6; margin: 16px 0; font-size: 14px;">
                If you have any questions, please don't hesitate to get in touch.
              </p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                <p style="color: #555555; font-size: 14px; margin: 0;">
                  <strong>Ali & Nige</strong><br>
                  Stylish Entertainment
                </p>
                <p style="color: #555555; font-size: 14px; margin-top: 10px;">
                  <a href="https://stylishentertainment.co.uk" style="color: #D4AF37; text-decoration: underline;">Visit our website</a>
                </p>
              </div>
            </div>
          `;

          const portalInviteText = `
Manage Your Booking

Hello,

Your booking has been created. You can now manage your booking details, view updates, and communicate with us through your personal portal.

Event: ${input.title}
Date: ${input.startTime.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
Time: ${input.startTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} - ${input.endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}

Access your booking portal: ${portalUrl}

If you have any questions, please don't hesitate to get in touch.

Ali & Nige
Stylish Entertainment
https://stylishentertainment.co.uk
          `;

          await sendEmailFromCRM({
            inboxId: inbox.id,
            to: input.clientEmail,
            subject: `Manage Your Booking - ${input.title}`,
            html: portalInviteHtml,
            text: portalInviteText,
            sentByUserId: userId,
          });
        }
      } catch (emailError) {
        console.error("Error sending portal invite:", emailError);
        // Don't fail the booking creation if email fails
      }
    }

    return {
      success: true,
      booking,
      linkedThreads: emailThreads.length,
    };
  } catch (error: any) {
    console.error("Error creating booking:", error);
    throw new Error(error.message || "Failed to create booking");
  }
}
