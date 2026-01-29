"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * CookieYes Cookie Consent Banner Component
 * 
 * Website Key: 1246a38a4c6731928c675e0f
 * Only loads in production to avoid localhost domain errors
 * 
 * Note: If you see "website URL has changed" errors, update the registered URL
 * in CookieYes dashboard: https://app.cookieyes.com/settings/organizations-and-sites
 */
export default function CookieYes() {
  // CookieYes website key
  const cookieYesId = "1246a38a4c6731928c675e0f";
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    const pathname = window.location.pathname ?? "";
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("10.0.") ||
      hostname.includes("localhost");
    const isDevelopment = process.env.NODE_ENV === "development";
    const isAdmin = pathname.startsWith("/admin");

    if (isLocalhost || isDevelopment) {
      setShouldLoad(false);
      return;
    }
    if (isAdmin) {
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
          // CookieYes may show URL configuration warnings, but banner usually still works
          // Update registered URL in dashboard if banner doesn't appear:
          // https://app.cookieyes.com/settings/organizations-and-sites
          console.warn("CookieYes: Script load issue. Check URL configuration in dashboard.");
        }}
      />
    </>
  );
}
