import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Legacy guest request page — was served at /request/[portalToken]
 *
 * The old system used the booking's portalToken (the client's private access
 * credential) as the public-facing guest URL. This conflates two separate
 * access scopes and is retired.
 *
 * This server component resolves the portalToken to the booking's
 * guestRequestToken and permanently redirects to the modern guest request
 * page at /requests/[guestRequestToken].
 *
 * If the token cannot be resolved, returns 404.
 */
interface LegacyGuestPageProps {
  params: Promise<{ token: string }> | { token: string };
}

export default async function LegacyGuestRequestPage({ params }: LegacyGuestPageProps) {
  const resolved = params instanceof Promise ? await params : params;
  const portalToken = resolved.token;

  if (!portalToken) {
    return notFound();
  }

  const booking = await prisma.booking.findFirst({
    where: { portalToken },
    select: { guestRequestToken: true },
  });

  if (!booking?.guestRequestToken) {
    return notFound();
  }

  redirect(`/requests/${booking.guestRequestToken}/`);
}
