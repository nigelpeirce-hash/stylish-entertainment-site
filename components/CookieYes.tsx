"use client";

import Script from "next/script";

/**
 * CookieYes Cookie Consent Banner Component
 * 
 * Website Key: 1246a38a4c6731928c675e0f
 */
export default function CookieYes() {
  // CookieYes website key
  const cookieYesId = "1246a38a4c6731928c675e0f";

  return (
    <>
      <Script
        id="cookieyes"
        type="text/javascript"
        strategy="afterInteractive"
        src={`https://cdn-cookieyes.com/client_data/${cookieYesId}/script.js`}
        onLoad={() => {
          console.log("CookieYes script loaded");
        }}
        onError={(e) => {
          console.error("CookieYes script failed to load:", e);
        }}
      />
    </>
  );
}
