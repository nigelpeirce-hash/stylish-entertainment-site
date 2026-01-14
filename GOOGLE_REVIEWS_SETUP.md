# Google Reviews Integration Setup Guide

## Overview

Google Reviews have been integrated into the website using an elegant carousel component that matches the site's design. The component displays Google reviews in a rotating carousel format, similar to the existing testimonials section.

## What's Been Added

✅ **GoogleReviews Component** (`components/GoogleReviews.tsx`) - Elegant component to display Google reviews
✅ **Google Reviews API Route** (`app/api/google-reviews/route.ts`) - API endpoint to fetch reviews from Google Places API
✅ **Integration** - Added to testimonials page (`/testi`)

## Setup Instructions

### Option 1: Using Google Places API (Recommended for Automatic Updates)

1. **Get your Google Place ID:**
   - Go to https://developers.google.com/maps/documentation/places/web-service/place-id
   - Use the Place ID finder tool to find your business Place ID
   - Alternatively, search for your business on Google Maps and look at the URL for the Place ID

2. **Get your Google Places API Key:**
   - Go to https://console.cloud.google.com/
   - Create a new project or select an existing one
   - Enable "Places API (New)" in the API Library
   - Go to "Credentials" and create an API key
   - **Important:** Restrict the API key to "Places API (New)" for security

3. **Add to `.env.local`:**
   ```env
   GOOGLE_PLACES_API_KEY=your_api_key_here
   GOOGLE_PLACE_ID=your_place_id_here
   ```

4. **For production:** Add these as environment variables in your hosting platform (Vercel, Azure, etc.)

**Note:** Google Places API (New) has costs associated with it. See pricing: https://developers.google.com/maps/documentation/places/web-service/pricing

### Option 2: Manual Reviews (For Free Alternative)

If you prefer not to use the API (to avoid costs), you can manually add reviews to the component:

1. Edit `components/GoogleReviews.tsx`
2. Pass reviews as props directly:
   ```tsx
   <GoogleReviews 
     reviews={[
       {
         author_name: "John Doe",
         rating: 5,
         text: "Amazing service!",
         time: Date.now() / 1000,
         relative_time_description: "2 weeks ago"
       },
       // ... more reviews
     ]}
   />
   ```

3. Or create a static data file and import it

## Usage

The Google Reviews component is already integrated into the testimonials page. It will:

- Automatically fetch reviews if `GOOGLE_PLACE_ID` and `GOOGLE_PLACES_API_KEY` are set
- Display reviews in an elegant carousel format matching the site's design
- Show star ratings, review text, author names, and timestamps
- Rotate through reviews every 6 seconds
- Include a link to view the review on Google

## Component Features

- **Elegant Design:** Matches the existing testimonials carousel style
- **Star Ratings:** Visual 5-star rating display
- **Profile Photos:** Shows reviewer profile photos when available
- **Auto-Rotate:** Automatically cycles through reviews
- **Manual Navigation:** Click dots to jump to specific reviews
- **Responsive:** Works on all device sizes
- **Error Handling:** Gracefully handles API errors and missing data

## Customization

You can customize the component by:

- Changing `maxReviews` prop to show more/fewer reviews
- Modifying the styling in `components/GoogleReviews.tsx`
- Adjusting the rotation interval (currently 6 seconds)
- Adding additional fields from the Google Reviews API response

## Troubleshooting

**Reviews not showing?**
- Check that `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are set in your environment variables
- Verify the API key has "Places API (New)" enabled
- Check the browser console for error messages
- Ensure your Google Business Profile has reviews

**API errors?**
- Verify your API key is correct and not restricted incorrectly
- Check that you have billing enabled in Google Cloud Console
- Ensure "Places API (New)" is enabled for your project
- Check API quota limits

**Component not visible?**
- The component will not display if there are no reviews or if there's an error
- Check the browser console for error messages
- Ensure reviews exist on your Google Business Profile

## Next Steps

1. Set up the Google Places API (Option 1) or manually add reviews (Option 2)
2. Test the integration on the testimonials page (`/testi`)
3. Optionally add the component to other pages (homepage, about page, etc.)
4. Monitor API usage and costs if using the Places API
