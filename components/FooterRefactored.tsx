"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

/**
 * Refactored Footer - More compact layout
 *
 * Changes from original:
 * - Shortened company description (1 paragraph instead of 3)
 * - Postal address removed
 * - Streamlined Contact column (Get in touch + Follow Us only)
 * - Reduced vertical space while keeping all key links
 *
 * Use in sandbox: /admin/sandbox/footer-demo
 */
export default function FooterRefactored() {
  const socialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/StylishEntertainment", icon: Facebook },
    { name: "Instagram", url: "https://www.instagram.com/stylishentertainment/", icon: Instagram },
    { name: "YouTube", url: "https://www.youtube.com/@stylishentertainment937/playlists", icon: Youtube },
  ];

  const footerText = "text-black/90 drop-shadow-sm";
  const linkStyles = "hover:text-black font-medium transition-colors";

  return (
    <footer className="relative z-10 bg-champagne-gold !text-black py-5 sm:py-6 mt-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent backdrop-blur-md pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent backdrop-blur-sm pointer-events-none" />
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Main grid - 3 columns, more compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Company - shortened to 1 paragraph */}
          <div>
            <h3 className="font-sans text-lg sm:text-xl mb-3 font-bold text-black">
              Stylish Entertainment Ltd
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed ${footerText}`}>
              Professional DJs, live musicians, lighting design and venue styling for weddings, parties and corporate events. Trusted by prestigious venues across the UK.{" "}
              <Link href="/artists/djs/" className={`${linkStyles} underline`}>DJs</Link>
              {" · "}
              <Link href="/artists/musicians/" className={`${linkStyles} underline`}>Musicians</Link>
              {" · "}
              <Link href="/services/lighting-design/" className={`${linkStyles} underline`}>Lighting</Link>
              {" · "}
              <Link href="/services/venue-styling/" className={`${linkStyles} underline`}>Venue styling</Link>
              {" · "}
              <Link href="/hire/" className={`${linkStyles} underline`}>Hire shop</Link>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-base sm:text-lg mb-3 font-bold text-black">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {[
                { href: "/artists/djs/", label: "Artists" },
                { href: "/services/", label: "Services" },
                { href: "/galleries/", label: "Galleries" },
                { href: "/contact-us/", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`text-sm sm:text-base ${linkStyles} ${footerText}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Follow - no postal address (moved to bottom) */}
          <div>
            <h4 className="font-sans text-base sm:text-lg mb-3 font-bold text-black">
              Contact
            </h4>
            <p className={`text-sm sm:text-base mb-4 ${footerText}`}>
              <Link href="/contact-us/" className={`${linkStyles} underline`}>
                Get in touch →
              </Link>
            </p>
            <h4 className="font-sans text-base sm:text-lg mb-3 font-bold text-black">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-black transition-all duration-300 hover:scale-110"
                    aria-label={`Visit our ${social.name} page`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar - copyright, legal links */}
        <div className="border-t border-black/20 mt-4 pt-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 text-center text-sm">
          <p className={footerText}>
            © {new Date().getFullYear()} Stylish Entertainment Ltd
          </p>
          <span className="hidden sm:inline text-black/50">·</span>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link href="/privacy-policy/" className={`${linkStyles} underline`}>
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions/" className={`${linkStyles} underline`}>
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
