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

    // Delay CookieYes until after LCP (~2.5s) to reduce initial JS and improve mobile Performance
    const t = setTimeout(() => setShouldLoad(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Don't render anything if we shouldn't load
  if (!shouldLoad) {
    return null;
  }

  // WCAG AA contrast overrides – injected after CookieYes so they win over inline styles (mobile & desktop)
  const contrastOverrides = `
    .cky-consent-bar, div.cky-consent-bar[data-cky-tag="notice"] { background-color: #ffffff !important; border-color: #e5e5e5 !important; color: #1a1a1a !important; }
    .cky-title, p.cky-title[data-cky-tag="title"], [data-cky-tag="notice"] .cky-title, .cky-consent-bar .cky-title, .cky-consent-bar p, .cky-consent-bar span { color: #1a1a1a !important; }
    .cky-consent-bar a { color: #0d47a1 !important; text-decoration: underline; }
    .cky-consent-bar button.cky-btn-accept, .cky-consent-bar [data-cky-tag="accept-button"] { background-color: #1a1a1a !important; color: #ffffff !important; }
    .cky-consent-bar button.cky-btn-reject, .cky-consent-bar [data-cky-tag="reject-button"] { background-color: #424242 !important; color: #ffffff !important; border-color: #424242 !important; }
  `;

  return (
    <>
      <Script
        id="cookieyes"
        type="text/javascript"
        strategy="afterInteractive"
        src={`https://cdn-cookieyes.com/client_data/${cookieYesId}/script.js`}
        onLoad={() => {
          const style = document.createElement("style");
          style.id = "cookieyes-contrast-override";
          style.textContent = contrastOverrides;
          document.head.appendChild(style);
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
