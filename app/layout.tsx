import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleTagManager from "@/components/GoogleTagManager";
import CookieYes from "@/components/CookieYes";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Providers } from "@/components/Providers";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "600", "700"], // Reduced from 7 weights to 3 most used
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://stylishentertainment.co.uk'),
  title: {
    default: "Stylish Entertainment & Production | Professional DJs, Lighting Design & Venue Styling",
    template: "%s | Stylish Entertainment"
  },
  description: "Stylish Entertainment & Production - Exceptional entertainment services. Professional DJs, musicians, lighting design, and venue styling across London, Somerset, Bath, Bristol, Dorset, Devon, and Cornwall. Strictly no YMCA.",
  keywords: ["West Country Wedding DJs", "London Wedding DJs", "Somerset Wedding DJs", "Bath Wedding DJs", "Bristol Wedding DJs", "Dorset Wedding DJs", "Devon Wedding DJs", "Wedding DJs Cornwall", "Stylish Entertainment", "Luxury Wedding Lighting Hire", "Wedding Entertainment", "Wedding Lighting Design", "Venue Styling", "Wedding Musicians", "Babington House DJ", "Professional Wedding DJs", "Wedding Sound Systems", "LED Wedding Lighting"],
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
    url: "https://stylishentertainment.co.uk",
    siteName: "Stylish Entertainment",
    title: "Stylish Entertainment & Production | Professional DJs, Lighting Design & Venue Styling",
    description: "Stylish Entertainment & Production - Exceptional entertainment services. Professional DJs, musicians, lighting design, and venue styling across London, Somerset, Bath, Bristol, Dorset, Devon, and Cornwall.",
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
    title: "Stylish Entertainment & Production | Professional DJs, Lighting Design & Venue Styling",
    description: "Stylish Entertainment & Production - Exceptional entertainment services. Professional DJs, lighting design, and venue styling.",
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
    canonical: "https://stylishentertainment.co.uk",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={raleway.variable}>
      <body className="relative min-h-screen" style={{
        background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
      }}>
        {/* Decorative Light Leaks */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-champagne-gold opacity-20 rounded-full blur-3xl pointer-events-none z-0" style={{ transform: 'translate(30%, -30%)' }}></div>
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-champagne-gold opacity-20 rounded-full blur-3xl pointer-events-none z-0" style={{ transform: 'translate(-30%, 30%)' }}></div>
        
        <Providers>
          <GoogleTagManager />
          <GoogleAnalytics />
          <CookieYes />
          <Navigation />
          <Breadcrumbs />
          <main className="min-h-screen relative z-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
