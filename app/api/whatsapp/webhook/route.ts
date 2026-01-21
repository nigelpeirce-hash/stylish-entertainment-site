import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize Supabase client for storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface WhatsAppWebhookPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          id: string;
          from: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; caption?: string; mime_type?: string };
          video?: { id: string; caption?: string; mime_type?: string };
          document?: { id: string; filename: string; mime_type?: string };
        }>;
        contacts?: Array<{
          profile: { name: string };
        }>;
      };
    }>;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: WhatsAppWebhookPayload = await request.json();

    // Verify webhook secret if configured
    const webhookSecret = request.headers.get("x-hub-signature-256");
    const expectedSecret = process.env.WHATSAPP_WEBHOOK_SECRET;
    
    if (expectedSecret && webhookSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Process incoming messages
    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      const messages = body.entry[0].changes[0].value.messages;
      const contacts = body.entry[0].changes[0].value.contacts || [];
      const contactName = contacts[0]?.profile?.name || null;

      for (const message of messages) {
        const phoneNumber = message.from;
        const messageId = message.id;
        const timestamp = message.timestamp;

        // Check if this phone number exists in any booking
        let booking = await prisma.booking.findFirst({
          where: {
            OR: [
              { phoneNumber: { contains: phoneNumber.slice(-10) } }, // Last 10 digits
              { phoneAreaCode: { contains: phoneNumber.slice(0, -10) } }, // Area code
            ],
          },
          orderBy: { createdAt: "desc" },
        });

        // If no booking exists, create a draft enquiry
        if (!booking) {
          booking = await prisma.booking.create({
            data: {
              name: contactName || "WhatsApp Contact",
              email: `whatsapp-${phoneNumber}@temp.stylishentertainment.co.uk`,
              phoneNumber: phoneNumber.slice(-10),
              phoneAreaCode: phoneNumber.slice(0, -10) || "+44",
              eventType: "wedding",
              eventDate: new Date(), // Placeholder date
              venueName: "TBD",
              status: "pending",
              priority: "high",
              flaggedFor: "wife", // Flag for wife to review
              assignedTo: "wife",
              handoffStatus: "action_needed",
              message: "Draft enquiry created from WhatsApp message",
            },
          });
        }

        // Handle media (images, videos, documents)
        let mediaUrl: string | null = null;
        let mediaType: string | null = null;
        let mediaFileName: string | null = null;

        if (message.image) {
          mediaType = "image";
          // Download image from WhatsApp API and upload to Supabase
          mediaUrl = await downloadAndStoreMedia(message.image.id, "image", booking.id);
        } else if (message.video) {
          mediaType = "video";
          mediaUrl = await downloadAndStoreMedia(message.video.id, "video", booking.id);
        } else if (message.document) {
          mediaType = "document";
          mediaFileName = message.document.filename;
          mediaUrl = await downloadAndStoreMedia(message.document.id, "document", booking.id);
        }

        // Save message to CommsLog
        await prisma.commsLog.create({
          data: {
            bookingId: booking.id,
            platform: "whatsapp",
            direction: "inbound",
            phoneNumber,
            contactName,
            message: message.text?.body || message.image?.caption || message.video?.caption || null,
            mediaUrl,
            mediaType,
            mediaFileName,
            whatsappMessageId: messageId,
            whatsappTimestamp: timestamp,
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function downloadAndStoreMedia(
  mediaId: string,
  mediaType: "image" | "video" | "document",
  bookingId: string
): Promise<string | null> {
  if (!supabase) {
    console.warn("Supabase not configured, skipping media storage");
    return null;
  }

  try {
    // Download media from WhatsApp API
    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!whatsappToken || !whatsappPhoneNumberId) {
      console.warn("WhatsApp API credentials not configured");
      return null;
    }

    // Get media URL from WhatsApp
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
        },
      }
    );

    if (!mediaResponse.ok) {
      throw new Error("Failed to get media URL from WhatsApp");
    }

    const mediaData = await mediaResponse.json();
    const mediaUrl = mediaData.url;

    // Download the actual media file
    const fileResponse = await fetch(mediaUrl, {
      headers: {
        Authorization: `Bearer ${whatsappToken}`,
      },
    });

    if (!fileResponse.ok) {
      throw new Error("Failed to download media from WhatsApp");
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file extension
    const extension = mediaType === "image" ? "jpg" : mediaType === "video" ? "mp4" : "pdf";
    const fileName = `${bookingId}/${Date.now()}.${extension}`;
    const filePath = `whatsapp-media/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("whatsapp-media")
      .upload(filePath, buffer, {
        contentType: fileResponse.headers.get("content-type") || `application/${extension}`,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("whatsapp-media")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error storing media:", error);
    return null;
  }
}
