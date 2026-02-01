import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getCloudinaryConfigStatus(): { configured: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!process.env.CLOUDINARY_CLOUD_NAME && !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    missing.push("CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  }
  if (!process.env.CLOUDINARY_API_KEY) missing.push("CLOUDINARY_API_KEY");
  if (!process.env.CLOUDINARY_API_SECRET) missing.push("CLOUDINARY_API_SECRET");
  return { configured: missing.length === 0, missing };
}

/**
 * POST: upload hero image (venue or couple photo) for a booking.
 * Auth: ?token= (portalToken) OR session (user owns booking or admin).
 * Available from day 1 until the event.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 }
      );
    }

    const token = request.nextUrl.searchParams.get("token");
    const session = await auth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        eventDate: true,
        portalToken: true,
      },
    });
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (
        u.role === "admin" ||
        (!!u.id && booking.userId === u.id)
      )
        allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const eventDate = new Date(booking.eventDate);
    if (eventDate < new Date()) {
      return NextResponse.json(
        { error: "Photo upload has closed now that your event has passed" },
        { status: 403 }
      );
    }

    const cloudinaryStatus = getCloudinaryConfigStatus();
    if (!cloudinaryStatus.configured) {
      console.warn("[upload-hero-image] Cloudinary not configured – missing:", cloudinaryStatus.missing.join(", "));
      return NextResponse.json(
        {
          error: "Image upload is not configured.",
          missing: cloudinaryStatus.missing,
          hint: "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local",
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 5MB" },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");
    const mime = file.type;
    const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
    const publicId = `portal-hero-${bookingId}-${Date.now()}.${ext}`;

    const { secure_url } = await uploadToCloudinary(base64, publicId, mime);

    await prisma.booking.update({
      where: { id: bookingId },
      data: { portalHeroImageUrl: secure_url, updatedAt: new Date() },
    });

    return NextResponse.json({ url: secure_url });
  } catch (err: unknown) {
    console.error("[upload-hero-image]", err);
    return NextResponse.json(
      { error: (err as Error)?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: remove hero image from booking.
 * Auth: same as POST.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = params instanceof Promise ? await params : params;
    const bookingId = resolved.id;
    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 }
      );
    }

    const token = request.nextUrl.searchParams.get("token");
    const session = await auth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, userId: true, portalToken: true },
    });
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    let allowed = false;
    if (token && booking.portalToken && booking.portalToken === token) {
      allowed = true;
    } else if (session?.user) {
      const u = session.user as { id?: string; role?: string };
      if (u.role === "admin" || (!!u.id && booking.userId === u.id))
        allowed = true;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { portalHeroImageUrl: null, updatedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[upload-hero-image DELETE]", err);
    return NextResponse.json(
      { error: (err as Error)?.message ?? "Failed to remove photo" },
      { status: 500 }
    );
  }
}
