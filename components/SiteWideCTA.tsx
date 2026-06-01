"use client";

/**
 * Page CTA: "Ready to create something extraordinary?" + Get in Touch / Call.
 * In-flow (not sticky). Renders above Footer on every page except contact/admin.
 * To disable: set SHOW_PAGE_CTA = false in app/layout.tsx or remove the component.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Pages that have their own prominent CTA section – hide site-wide CTA to avoid doubles.
 * One CTA per page. /what-we-do/venue-decoration uses site-wide CTA (not in list).
 */
const PREFIX_HIDE = ["/admin", "/contact", "/contact-us", "/thank-you"];
const EXACT_HIDE = [
  "/wedding-dj",
  "/wedding-dj-somerset",
  "/wedding-dj-bath",
  "/wedding-dj-bristol",
  "/wedding-production-london",
  "/luxury-wedding-entertainment-south-west",
  "/demo/client-portal",
  "/party-planning-and-organising",
  "/party-planning-and-organising/",
  "/what-we-do",
  "/what-we-do/lighting",
  "/what-we-do/equipment-dj-band-sound-kit",
  "/services",
  "/services/venue-styling",
  "/services/lighting-design",
  "/services/djs",
  "/services/kit-hire",
  "/services/fire-pit-hire",
  "/parties",
  "/parties/private-parties",
  "/parties/christmas",
  "/parties/corporate",
  "/parties/corporate-events",
  "/artists/djs",
  "/artists/musicians",
  "/artists/party-djs",
  "/weddings/wedding-lighting",
  "/weddings/wedding-entertainment",
  "/hire",
  "/kin-house-wiltshire",
  "/mells-barn-weddings",
  "/venues/mells-barn",
  "/babington-wedding-info",
  "/babington-dj-final-details",
  "/dj-worksheet",
  "/pennard-house-lighting",
  "/venues/north-cadbury-court",
  "/venues/babington-house",
  "/testi",
];

function shouldHide(pathname: string | null): boolean {
  if (!pathname) return false;
  if (PREFIX_HIDE.some((p) => pathname.startsWith(p))) return true;
  return EXACT_HIDE.some((p) => pathname === p || pathname === `${p}/`);
}

export default function SiteWideCTA() {
  const pathname = usePathname();
  const hide = shouldHide(pathname);
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
            Artists, lighting, styling and production for weddings, parties and events. Tell us your vision—we&apos;ll reply within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-champagne-gold hover:bg-champagne-gold/80 text-gray-900 font-semibold px-6 py-5 text-base"
            >
              <Link href="/contact-us/">Get in Touch</Link>
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
