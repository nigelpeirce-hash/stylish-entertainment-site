import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize Supabase client for storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || process.env.NODE_ENV === "development";

    if (!admin && !isLocalhost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const message = formData.get("message") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const bookingId = formData.get("bookingId") as string;
    const mediaFile = formData.get("media") as File | null;

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!whatsappToken || !whatsappPhoneNumberId) {
      return NextResponse.json(
        { error: "WhatsApp API not configured" },
        { status: 500 }
      );
    }

    let mediaUrl: string | null = null;
    let mediaType: string | null = null;
    let mediaFileName: string | null = null;
    let whatsappMediaId: string | null = null;

    // Handle media upload if provided
    if (mediaFile) {
      try {
        // Upload to Supabase Storage first
        const arrayBuffer = await mediaFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const extension = mediaFile.name.split(".").pop() || "jpg";
        const fileName = `${bookingId || "temp"}/${Date.now()}.${extension}`;
        const filePath = `whatsapp-media/${fileName}`;

        if (supabase) {
          const { data, error } = await supabase.storage
            .from("whatsapp-media")
            .upload(filePath, buffer, {
              contentType: mediaFile.type,
              upsert: false,
            });

          if (error) {
            throw error;
          }

          const { data: urlData } = supabase.storage
            .from("whatsapp-media")
            .getPublicUrl(filePath);

          mediaUrl = urlData.publicUrl;
          mediaType = mediaFile.type.startsWith("image/") ? "image" : "video";
          mediaFileName = mediaFile.name;

          // Upload media to WhatsApp
          const uploadResponse = await fetch(
            `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/media`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${whatsappToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                type: mediaFile.type,
                url: urlData.publicUrl,
              }),
            }
          );

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            whatsappMediaId = uploadData.id;
          }
        }
      } catch (error) {
        console.error("Error uploading media:", error);
        // Continue without media if upload fails
      }
    }

    // Send message via WhatsApp API
    const payload: any = {
      messaging_product: "whatsapp",
      to: phoneNumber,
    };

    if (whatsappMediaId && mediaType === "image") {
      payload.type = "image";
      payload.image = {
        id: whatsappMediaId,
        caption: message || undefined,
      };
    } else if (whatsappMediaId && mediaType === "video") {
      payload.type = "video";
      payload.video = {
        id: whatsappMediaId,
        caption: message || undefined,
      };
    } else if (message) {
      payload.type = "text";
      payload.text = {
        body: message,
      };
    } else {
      return NextResponse.json({ error: "Message or media is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("WhatsApp API error:", error);
      return NextResponse.json(
        { error: error.error?.message || "Failed to send WhatsApp message" },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    const whatsappMessageId = responseData.messages?.[0]?.id;

    // Save to CommsLog
    if (bookingId) {
      await prisma.commsLog.create({
        data: {
          bookingId,
          platform: "whatsapp",
          direction: "outbound",
          phoneNumber,
          message: message || null,
          mediaUrl,
          mediaType,
          mediaFileName,
          whatsappMessageId: whatsappMessageId || null,
          sentByUserId: admin?.id || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      messageId: whatsappMessageId,
    });
  } catch (error: any) {
    console.error("Error sending WhatsApp message:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
