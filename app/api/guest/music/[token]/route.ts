import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * RETIRED — This endpoint previously served and accepted guest song requests
 * using the booking's portalToken as a public URL parameter.
 *
 * The modern guest request system uses a separate guestRequestToken at:
 *   GET/POST /api/guest-requests/[token]/songs
 *   UI:       /requests/[guestRequestToken]
 */
export async function GET() {
  return NextResponse.json(
    {
      error: "This endpoint has been retired.",
      message: "Please use the link shared by your host to submit a song request.",
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint has been retired.",
      message: "Please use the link shared by your host to submit a song request.",
    },
    { status: 410 }
  );
}
