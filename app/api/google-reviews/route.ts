import { NextRequest, NextResponse } from "next/server";

/**
 * Google Reviews API Route
 * 
 * This route fetches Google reviews using the Google Places API (New).
 * 
 * Setup Instructions:
 * 1. Get your Google Place ID:
 *    - Go to https://developers.google.com/maps/documentation/places/web-service/place-id
 *    - Use the Place ID finder tool to find your business Place ID
 * 
 * 2. Get your Google Places API Key:
 *    - Go to https://console.cloud.google.com/
 *    - Create a new project or select an existing one
 *    - Enable "Places API (New)" in the API Library
 *    - Go to "Credentials" and create an API key
 *    - Restrict the API key to "Places API (New)" for security
 * 
 * 3. Add to .env.local:
 *    GOOGLE_PLACES_API_KEY=your_api_key_here
 *    GOOGLE_PLACE_ID=your_place_id_here
 * 
 * 4. For production, add these as environment variables in your hosting platform
 * 
 * Note: Google Places API (New) has costs associated with it.
 * See: https://developers.google.com/maps/documentation/places/web-service/pricing
 */

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
  profile_photo_url?: string;
  author_url?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get("placeId") || process.env.GOOGLE_PLACE_ID;
    const maxReviews = parseInt(searchParams.get("maxReviews") || "5");

    if (!placeId) {
      return NextResponse.json(
        { error: "Place ID is required. Provide it as a query parameter or set GOOGLE_PLACE_ID in environment variables." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Places API key is not configured. Set GOOGLE_PLACES_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    // Use Google Places API (New) to fetch place details including reviews
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,reviews&key=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "id,displayName,reviews",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Google Places API error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch reviews from Google Places API", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reviews: GoogleReview[] = data.reviews?.slice(0, maxReviews) || [];

    return NextResponse.json({
      success: true,
      reviews: reviews.map((review: any) => ({
        author_name: review.authorAttribution?.displayName || "Anonymous",
        rating: review.rating || 0,
        text: review.text?.text || "",
        time: review.publishTime ? new Date(review.publishTime).getTime() / 1000 : Date.now() / 1000,
        relative_time_description: review.publishTime 
          ? getRelativeTime(new Date(review.publishTime))
          : "Recently",
        profile_photo_url: review.authorAttribution?.photoUri,
        author_url: review.authorAttribution?.uri,
      })),
      placeName: data.displayName?.text,
    });
  } catch (error: any) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}
