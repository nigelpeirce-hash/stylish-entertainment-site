"use client";

/**
 * Page CTA: "Ready to create something extraordinary?" + Get in Touch / Call.
 * In-flow (not sticky). Renders above Footer on every page except contact/admin.
 * To disable: set SHOW_PAGE_CTA = false in app/layout.tsx or remove the component.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const HIDE_ON_PATHS = ["/contact", "/contact-us", "/admin", "/thank-you"];

export default function SiteWideCTA() {
  const pathname = usePathname();
  const hide = pathname && HIDE_ON_PATHS.some((p) => pathname.startsWith(p));
  if (hide) return null;

  return (
    <section
      className="site-wide-cta block w-full py-10 md:py-14 bg-gray-900 border-t border-champagne-gold/20"
      style={{ background: "rgb(17 24 39)", position: "static" }}
      aria-label="Get in touch"
      data-in-flow="true"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <div className="bg-gray-800/60 border border-champagne-gold/20 rounded-lg p-6 md:p-10 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-champagne-gold mb-3">
            Ready to create something extraordinary?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Professional DJs, musicians, lighting design and venue styling across the UK.
            Get in touch to discuss your wedding, party or event—we&apos;ll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-champagne-gold hover:bg-champagne-gold/80 text-gray-900 font-semibold px-6 py-5 text-base"
            >
              <Link href="/contact-us">Get in Touch</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-gray-900 font-semibold px-6 py-5 text-base"
            >
              <a href="tel:+447970793177">Call 07970 793177</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
