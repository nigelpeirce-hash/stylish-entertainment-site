"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * CookieYes Cookie Consent Banner Component
 * 
 * Website Key: 1246a38a4c6731928c675e0f
 * Only loads in production to avoid localhost domain errors
 */
export default function CookieYes() {
  // CookieYes website key
  const cookieYesId = "1246a38a4c6731928c675e0f";
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load CookieYes in production (not on localhost)
    const isLocalhost = 
      typeof window !== "undefined" && 
      (window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.includes("192.168."));
    
    setShouldLoad(!isLocalhost);
  }, []);

  if (!shouldLoad) {
    return null; // Don't load CookieYes on localhost
  }

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
