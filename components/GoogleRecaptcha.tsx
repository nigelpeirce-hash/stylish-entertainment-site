"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface GoogleRecaptchaProps {
  siteKey: string;
  onVerify?: (token: string) => void;
  onError?: (error: Error) => void;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
  action?: string; // For reCAPTCHA v3
  version?: "v2" | "v3"; // Default to v3
}

/**
 * Google reCAPTCHA Component
 * 
 * Supports both v2 (checkbox) and v3 (invisible) versions
 * 
 * Usage:
 * - v3 (invisible, recommended): <GoogleRecaptcha siteKey="your-site-key" version="v3" action="submit" onVerify={handleVerify} />
 * - v2 (checkbox): <GoogleRecaptcha siteKey="your-site-key" version="v2" onVerify={handleVerify} />
 */
export default function GoogleRecaptcha({
  siteKey,
  onVerify,
  onError,
  theme = "light",
  size = "normal",
  action = "submit",
  version = "v3",
}: GoogleRecaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!siteKey) {
      console.warn("Google reCAPTCHA: Site key is required");
      return;
    }

    if (version === "v2" && containerRef.current) {
      // reCAPTCHA v2 - Checkbox version
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          try {
            if (containerRef.current && !widgetIdRef.current) {
              widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
                sitekey: siteKey,
                theme: theme,
                size: size,
                callback: (token: string) => {
                  if (onVerify) {
                    onVerify(token);
                  }
                },
                "error-callback": (error: Error) => {
                  if (onError) {
                    onError(error);
                  }
                },
              });
            }
          } catch (error) {
            console.error("reCAPTCHA v2 render error:", error);
            if (onError && error instanceof Error) {
              onError(error);
            }
          }
        });
      }
    } else if (version === "v3") {
      // reCAPTCHA v3 - Invisible version
      // Token is generated automatically on page load and form submission
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(siteKey, { action })
            .then((token: string) => {
              if (onVerify) {
                onVerify(token);
              }
            })
            .catch((error: Error) => {
              console.error("reCAPTCHA v3 execute error:", error);
              if (onError) {
                onError(error);
              }
            });
        });
      }
    }
  }, [siteKey, theme, size, action, version, onVerify, onError]);

  // Load reCAPTCHA script
  const scriptSrc =
    version === "v3"
      ? `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      : `https://www.google.com/recaptcha/api.js`;

  return (
    <>
      <Script
        src={scriptSrc}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Google reCAPTCHA script loaded");
        }}
        onError={(e) => {
          console.error("Google reCAPTCHA script failed to load:", e);
        }}
      />
      {version === "v2" && (
        <div
          ref={containerRef}
          className="g-recaptcha"
          data-sitekey={siteKey}
          data-theme={theme}
          data-size={size}
        />
      )}
      {version === "v3" && (
        <div className="g-recaptcha-v3" style={{ display: "none" }} />
      )}
    </>
  );
}

/**
 * Helper function to verify reCAPTCHA token on the server
 * This should be called from your API route
 */
export async function verifyRecaptchaToken(
  token: string,
  secretKey: string
): Promise<boolean> {
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
