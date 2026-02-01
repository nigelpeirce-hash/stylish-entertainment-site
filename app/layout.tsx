import type { Metadata, Viewport } from "next";
import { Raleway, Bebas_Neue, Dancing_Script, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { headers } from "next/headers";
import "./globals.css";

/** Avoid static prerender for app; framer-motion triggers useState-null during prerender. */
export const dynamic = "force-dynamic";

/** Safe-area insets (notch/home indicator) work when viewport extends into safe areas. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
import Navigation from "@/components/Navigation";
import FooterRefactored from "@/components/FooterRefactored";
import SiteWideCTA from "@/components/SiteWideCTA";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleTagManager from "@/components/GoogleTagManager";
import CookieYes from "@/components/CookieYes";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Providers } from "@/components/Providers";
import WelcomeBackBanner from "@/components/WelcomeBackBanner";
import PrefetchErrorHandler from "@/components/PrefetchErrorHandler";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundaryWrapper";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "600", "700"], // Reduced from 7 weights to 3 most used
  preload: true,
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-artdeco",
  display: "optional", // Non-critical; reduces render blocking (~130ms)
  weight: "400",
  preload: false,
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "optional", // Non-critical; don't block first paint
  weight: ["400", "600", "700"],
  preload: false,
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "optional", // Non-critical; don't block first paint
  weight: ["400", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.stylishentertainment.co.uk"),
  title: {
    default: "STYLISH Entertainment | DJs, Lighting & Events for Weddings, Parties & Celebrations",
    template: "%s | STYLISH Entertainment"
  },
  description: "Premium entertainment for weddings, parties and events across the UK. Professional DJs, lighting design and venue styling.",
  keywords: ["West Country DJs", "London Event DJs", "Somerset Wedding DJs", "Party DJs Bath", "Bristol Event Entertainment", "Dorset Wedding DJs", "Devon Party DJs", "DJs Cornwall", "Stylish Entertainment", "Luxury Event Lighting Hire", "Wedding Entertainment", "Party Entertainment", "Corporate Event DJs", "Private Party DJs", "Event Lighting Design", "Venue Styling", "Event Musicians", "Babington House DJ", "Professional DJs", "Event Sound Systems", "LED Event Lighting", "Celebration Entertainment"],
  authors: [{ name: "Stylish Entertainment" }],
  creator: "Stylish Entertainment",
  publisher: "Stylish Entertainment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.stylishentertainment.co.uk",
    siteName: "STYLISH Entertainment",
    title: "STYLISH Entertainment | DJs, Lighting & Events for Weddings, Parties & Celebrations",
    description: "Premium entertainment for weddings, parties and events across the UK. Professional DJs, lighting design and venue styling.",
    images: [
      {
        url: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
        width: 1200,
        height: 630,
        alt: "Stylish Entertainment & Production - Professional DJs, Lighting Design and Venue Styling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STYLISH Entertainment | DJs, Lighting & Events for Weddings, Parties & Celebrations",
    description: "Premium entertainment for weddings, parties and events across the UK. Professional DJs, lighting design and venue styling.",
    images: ["https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw"],
    creator: "@stylishentertainment",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "3eb19029808b92e4",
  },
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isHome = pathname === "/" || pathname === "";

  return (
    <html lang="en" className={`${raleway.variable} ${bebasNeue.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}>
      <head>
        {/* Preconnect to critical origins for faster LCP */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Homepage-only LCP preload (avoids "preloaded but not used" on admin/other pages) */}
        {isHome && (
          <link
            rel="preload"
            as="image"
            href="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_60,dpr_auto,w_1080/v1768741948/Saltburn_231005__0020_0640_nmzjp6.jpg"
            fetchPriority="high"
          />
        )}
      </head>
      <body className="relative min-h-screen" style={{
        background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
      }}>
        {/* Decorative Light Leaks */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-champagne-gold opacity-20 rounded-full blur-3xl pointer-events-none z-0" style={{ transform: 'translate(30%, -30%)' }}></div>
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-champagne-gold opacity-20 rounded-full blur-3xl pointer-events-none z-0" style={{ transform: 'translate(-30%, 30%)' }}></div>
        
        <Providers>
          {/* Early error handler for prefetch failures - runs before React */}
          <Script
            id="prefetch-error-handler"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Handle unhandled promise rejections (prefetch errors)
                  window.addEventListener('unhandledrejection', function(event) {
                    var reason = event.reason;
                    var errorMessage = reason?.message || reason?.toString() || '';
                    var errorStack = reason?.stack || '';
                    
                    // Check if this is a prefetch-related fetch error
                    if (
                      errorMessage.includes('Failed to fetch') ||
                      errorMessage.includes('fetch') ||
                      errorStack.includes('fetch-server-response') ||
                      errorStack.includes('prefetch-cache-utils') ||
                      errorStack.includes('router-reducer') ||
                      errorStack.includes('navigate-reducer')
                    ) {
                      // Prevent the error from showing in console
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }, true);
                  
                  // Handle regular errors
                  window.addEventListener('error', function(event) {
                    var error = event.error;
                    var errorMessage = error?.message || event.message || '';
                    var errorStack = error?.stack || event.filename || '';
                    
                    // Check if this is a prefetch-related fetch error
                    if (
                      errorMessage.includes('Failed to fetch') ||
                      errorMessage.includes('fetch') ||
                      errorStack.includes('fetch-server-response') ||
                      errorStack.includes('prefetch-cache-utils') ||
                      errorStack.includes('router-reducer') ||
                      errorStack.includes('navigate-reducer')
                    ) {
                      // Prevent the error from showing in console
                      event.preventDefault();
                      event.stopPropagation();
                      return true;
                    }
                  }, true);
                })();
              `,
            }}
          />
          <PrefetchErrorHandler />
          <GoogleTagManager />
          <GoogleAnalytics />
          <CookieYes />
          <Suspense fallback={null}>
            <WelcomeBackBanner />
          </Suspense>
          <Suspense fallback={<nav className="h-20 bg-gray-900" />}>
            <Navigation />
          </Suspense>
          <Breadcrumbs />
          <ErrorBoundaryWrapper>
            <div className="relative z-10 block safe-area-x">
              <main className="min-h-screen">{children}</main>
              {/* Page CTA – hidden on admin, client portal, and demo (demo ends on T&C/Privacy; peace of mind follows) */}
              {!pathname.startsWith("/admin") && !pathname.startsWith("/client") && !pathname.startsWith("/demo") && <SiteWideCTA />}
              {/* No marketing footer on admin, client portal, or demo – portal has Terms/Privacy in content */}
              {!pathname.startsWith("/admin") && !pathname.startsWith("/client") && !pathname.startsWith("/demo") && <FooterRefactored />}
            </div>
          </ErrorBoundaryWrapper>
        </Providers>
      </body>
    </html>
  );
}
