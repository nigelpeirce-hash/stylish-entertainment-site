import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/public/hire-enquiry
 * Public visitor "Request Quote" – creates NewEnquiry with enquiryType 'hire_only',
 * links selected HireItems via selectedHireItems JSON.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      eventDate,
      venue,
      selectedItems,
      eventType,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!eventDate) {
      return NextResponse.json({ error: "Event date is required" }, { status: 400 });
    }

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid event date" }, { status: 400 });
    }

    const venueTrimmed = typeof venue === "string" ? venue.trim() : "";
    const venueName = venueTrimmed || "TBC";
    const venuePostcode = "HIRE-ONLY";

    const items = Array.isArray(selectedItems) ? selectedItems : [];
    const validated: { hireItemId: string; quantity: number }[] = [];
    for (const x of items) {
      const id = typeof x.hireItemId === "string" ? x.hireItemId.trim() : "";
      const qty = typeof x.quantity === "number" ? Math.max(1, Math.floor(x.quantity)) : 1;
      if (id) validated.push({ hireItemId: id, quantity: qty });
    }

    let selectedHireItems: { hireItemId: string; quantity: number; name?: string }[] = validated;
    if (validated.length > 0) {
      const ids = [...new Set(validated.map((v) => v.hireItemId))];
      const hireItems = await prisma.hireItem.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true },
      });
      const byId = Object.fromEntries(hireItems.map((h) => [h.id, h.name]));
      selectedHireItems = validated.map((v) => ({
        ...v,
        name: byId[v.hireItemId] ?? v.hireItemId,
      }));
    }

    const enquiry = await prisma.newEnquiry.create({
      data: {
        id: randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phoneAreaCode: null,
        phoneNumber: null,
        eventDate: parsedDate,
        venuePostcode,
        venueName,
        eventType: eventType || null, // Store event type if provided
        enquiryType: "hire_only",
        selectedHireItems: selectedHireItems.length ? (selectedHireItems as any) : null,
        isConflict: false,
        status: "new",
        updatedAt: new Date(),
      },
    });

    const dateLabel = parsedDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      message: `Thank you! Nigel will check availability for ${dateLabel} and send your custom quote shortly.`,
      dateLabel,
    });
  } catch (e: any) {
    console.error("[hire-enquiry]", e);
    return NextResponse.json(
      { error: e?.message || "Failed to submit hire enquiry" },
      { status: 500 }
    );
  }
}
