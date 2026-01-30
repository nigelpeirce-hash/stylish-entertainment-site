import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  homeAddress: z.string().optional(),
  eventType: z.string(),
  eventDate: z.string(),
  chosenDJ: z.string().optional(),
  musicians: z.string().optional(),
  earlySetup: z.boolean().optional(),
  venueNamePostcode: z.string().optional(),
  musicStartFinishTime: z.string().optional(),
  agreedFee: z.string().optional(),
  otherRequirements: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  venuePostcode: z.string().optional(),
  numberOfGuests: z.number().nullable().optional(),
  services: z.array(z.string()),
  message: z.string().optional(),
  termsAccepted: z.boolean().optional().default(false),
  preferredDJ: z.string().nullable().optional(),
  upsellItems: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await request.json();

    const validatedData = bookingSchema.parse(body);

    // Find user by email if not logged in, or use session user
    let userId = null;
    if (session?.user) {
      userId = (session.user as any).id;
    } else {
      // Try to find user by email
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (user) {
        userId = user.id;
      }
    }

    // Parse venue name and postcode if provided as combined field
    let venueName = validatedData.venueName || "";
    let venuePostcode = validatedData.venuePostcode || "";
    
    if (validatedData.venueNamePostcode) {
      // Try to split venue name and postcode (postcode usually at end)
      const parts = validatedData.venueNamePostcode.trim().split(/\s+(?=[A-Z]{1,2}\d)/);
      if (parts.length > 1) {
        venuePostcode = parts[parts.length - 1];
        venueName = parts.slice(0, -1).join(" ");
      } else {
        venueName = validatedData.venueNamePostcode;
      }
    }

    // Combine all additional requirements into message
    const additionalInfo: string[] = [];
    if (validatedData.chosenDJ) additionalInfo.push(`Chosen DJ: ${validatedData.chosenDJ}`);
    if (validatedData.musicians && validatedData.musicians !== "Please Select") {
      additionalInfo.push(`Musicians: ${validatedData.musicians}`);
    }
    if (validatedData.earlySetup) additionalInfo.push("Early Setup Required: Yes (additional £120)");
    if (validatedData.musicStartFinishTime) additionalInfo.push(`Music Times: ${validatedData.musicStartFinishTime}`);
    if (validatedData.agreedFee) additionalInfo.push(`Agreed Fee: ${validatedData.agreedFee}`);
    if (validatedData.homeAddress) additionalInfo.push(`Home Address: ${validatedData.homeAddress}`);
    if (validatedData.otherRequirements) additionalInfo.push(`Other Requirements: ${validatedData.otherRequirements}`);
    
    const combinedMessage = [
      validatedData.message,
      ...additionalInfo
    ].filter(Boolean).join("\n\n");

    // Terms acceptance is required for booking
    if (!validatedData.termsAccepted) {
      return NextResponse.json(
        { error: "Terms and Conditions must be accepted" },
        { status: 400 }
      );
    }

    // Calculate if event is within 2 weeks (14 days) of today
    const eventDate = new Date(validatedData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    eventDate.setHours(0, 0, 0, 0);
    
    const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isUrgent = daysUntilEvent > 0 && daysUntilEvent <= 14; // Within 2 weeks (14 days)
    
    const priority = isUrgent ? "urgent" : "medium";

    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        userId: userId,
        name: validatedData.name,
        email: validatedData.email,
        phoneNumber: validatedData.phone,
        eventType: validatedData.eventType,
        eventDate: eventDate,
        venueName: venueName || "TBD",
        venuePostcode: venuePostcode,
        numberOfGuests: validatedData.numberOfGuests || null,
        services: validatedData.services || ["DJs"],
        upsellItems: validatedData.upsellItems || [],
        message: combinedMessage,
        preferredDJ: validatedData.preferredDJ || null,
        status: "pending",
        priority: priority,
        termsAccepted: validatedData.termsAccepted,
        termsAcceptedAt: new Date(),
      },
    });

    // TODO: Send confirmation email here

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
