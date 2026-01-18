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
    if (typeof window === "undefined") {
      return; // Server-side, don't load
    }

    const hostname = window.location.hostname;
    const isLocalhost = 
      hostname === "localhost" || 
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("10.0.") ||
      hostname.includes("localhost");
    
    // Also check for development environment variables
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (isLocalhost || isDevelopment) {
      console.log("CookieYes: Skipping load on localhost/development");
      setShouldLoad(false);
      return;
    }
    
    setShouldLoad(true);
  }, []);

  // Don't render anything if we shouldn't load
  if (!shouldLoad) {
    return null;
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
