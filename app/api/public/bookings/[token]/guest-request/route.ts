import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * RETIRED — This endpoint previously accepted guest song requests using the
 * booking's portalToken as a public URL parameter, conflating the client's
 * private access credential with a public write surface.
 *
 * The modern guest request system uses a separate guestRequestToken at:
 *   POST /api/guest-requests/[token]/songs
 *   UI:  /requests/[guestRequestToken]
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint has been retired.",
      message: "Guest song requests must be submitted via the link shared by your host.",
    },
    { status: 410 }
  );
}
