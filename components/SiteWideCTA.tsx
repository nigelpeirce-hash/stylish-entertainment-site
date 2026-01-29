"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const HIDE_ON_PATHS = ["/contact", "/contact-us", "/admin"];

export default function SiteWideCTA() {
  const pathname = usePathname();
  const hide = pathname && HIDE_ON_PATHS.some((p) => pathname.startsWith(p));
  if (hide) return null;

  return (
    <section
      className="sticky bottom-0 z-40 py-10 md:py-14 bg-gray-900 border-t border-champagne-gold/20 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] isolate"
      style={{ background: "rgb(17 24 39)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <div className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 rounded-lg p-6 md:p-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-champagne-gold mb-3">
            Ready to create something extraordinary?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Professional DJs, musicians, lighting design and venue styling across the UK and Wales.
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
