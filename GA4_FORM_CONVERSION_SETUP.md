# GA4 Form Submission Conversion Setup

## What We Track

- **form_start** – Fires automatically via GA4 Enhanced Measurement (first form interaction)
- **Form_Submission** – Custom event fired on thank-you page (our primary conversion)
- **generate_lead** – GA4 recommended event, fired on thank-you page

## GA4 Admin Configuration

### 1. Mark the conversion in GA4

1. Go to **Admin** → **Data display** → **Events**
2. Find **generate_lead** (and optionally **Form_Submission**)
3. Toggle **Mark as key event** (conversion) for one or both

### 2. Verify Enhanced Measurement

1. Go to **Admin** → **Data streams** → select your web stream
2. Click **Enhanced measurement**
3. Ensure **Form interactions** is ON (form_start and form_submit from Enhanced Measurement)

### 3. Why form_submit (Enhanced) may not fire

Our contact form uses JavaScript `fetch` + `router.push` instead of a native form submit. The page navigates away immediately, so GA4’s automatic form_submit can be lost before the beacon sends. We rely on the **thank-you page** to fire the conversion instead.

## Code Flow

1. User submits contact form → `router.push("/thank-you/")`
2. Thank-you page loads → `trackEnquiryComplete()` runs in useEffect
3. Events **Form_Submission** and **generate_lead** are sent (via gtag or dataLayer fallback)
4. GA4 receives and counts them

## Troubleshooting

- **Events not appearing**: Check Realtime report in GA4; allow 24–48 hours for standard reports
- **Conversion not counting**: Confirm the event is marked as a key event in Admin → Events
- **DataLayer fallback**: If gtag loads late, events are queued in dataLayer and sent when gtag is ready
