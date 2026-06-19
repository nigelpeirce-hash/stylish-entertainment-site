"use client";

import Script from "next/script";

/**
 * @deprecated GA4 is loaded via Google Tag Manager only (see app/layout.tsx).
 * Do not mount this component alongside GTM — it double-counts users and page views.
 * GTM container: GTM-WB3F6V7 · Measurement ID: G-8WGHN47VLM
 */

/** Production GA4 web stream (Stylish Entertainment). Override via env in Vercel if needed. */
const DEFAULT_GA4_MEASUREMENT_ID = "G-8WGHN47VLM";

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    DEFAULT_GA4_MEASUREMENT_ID;

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
