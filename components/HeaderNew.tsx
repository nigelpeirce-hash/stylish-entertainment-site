"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { AuthButtonSimple } from "@/components/AuthButton";
import styles from "./HeaderNew.module.css";

const galleriesLinks = [
  { href: "/galleries", label: "Images" },
  { href: "/galleries/videos", label: "Videos" },
  { href: "/galleries/instagram", label: "Instagram" },
];

const artistsLinks = [
  { href: "/artists/djs", label: "DJs" },
  { href: "/artists/musicians", label: "Musicians" },
];

const weddingLinks = [
  { href: "/weddings/wedding-lighting", label: "Wedding Lighting" },
  { href: "/weddings/wedding-entertainment", label: "Wedding Entertainment" },
];

const partiesLinks = [
  { href: "/parties/private-parties", label: "Private Parties" },
  { href: "/parties/party-lighting", label: "Party lighting" },
  { href: "/parties/corporate-events", label: "Corporate" },
  { href: "/parties/christmas", label: "Christmas" },
];

const whatWeOfferLinks = [
  { href: "/party-planning-and-organising", label: "Party Planning" },
  { href: "/what-we-do/venue-decoration", label: "Venue Styling" },
  { href: "/what-we-do/lighting", label: "Lighting" },
  { href: "/what-we-do/equipment-dj-band-sound-kit", label: "Sound" },
  { href: "/fire-pit-html", label: "Fire Pit Hire" },
  { href: "/hire", label: "Hire Shop" },
];

const venuesLinks = [
  { href: "/venues", label: "All Venues" },
  { href: "/babington-wedding-info", label: "Babington House" },
  { href: "/venues/mells-barn", label: "Mells Barn" },
  { href: "/pennard-house-lighting", label: "Pennard House" },
  { href: "/kin-house-wiltshire", label: "Kin House" },
];

const aboutLinks = [
  { href: "/testi", label: "Testimonials" },
  { href: "/about/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
  { href: "/about/blog", label: "Blog" },
];

export default function HeaderNew() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session;
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const [weddingsOpen, setWeddingsOpen] = useState(false);
  const [partiesOpen, setPartiesOpen] = useState(false);
  const [whatWeOfferOpen, setWhatWeOfferOpen] = useState(false);
  const [venuesOpen, setVenuesOpen] = useState(false);
  const [galleriesOpen, setGalleriesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const closeBurger = () => setIsBurgerOpen(false);

  return (
    <header
      className={`${styles.header} ${styles.menuComponent} fixed left-0 right-0 z-50 top-0`}
      role="banner"
    >
      <div className={styles.innerGlow} aria-hidden="true" />

      <div className={styles.megaMenuContainer}>
        {/* Wordmark – text only; SE icon used as favicon */}
        <div className={styles.wordmarkContainer}>
          <Link href="/" className={styles.wordmarkLinkBlock}>
            <div className={styles.wordmarkWrapper}>
              <span className={styles.approvalsLogoText}>Stylish</span>
              <span className={styles.logoSubTxt}>Entertainment</span>
            </div>
          </Link>
        </div>

        {/* Centre strapline - hidden on mobile/tablet */}
        <div
          className={`${styles.centreStraplineTxt} ${styles.visible} ${styles.hideTablet} ${styles.hideMobilePortrait}`}
        >
          Every Gathering Deserves To Be{" "}
          <span className={styles.textSpanExtraordinary}>Extraordinary</span>
        </div>

        {/* Right side: when logged out = Enquire + Burger only; when logged in = Admin + Sign Out + Burger */}
        <div className={styles.ctaMenuRight}>
          {!isLoggedIn ? (
            <div className={styles.buttonGroup}>
              <Link href="/request-quote" className={styles.enquireButton}>
                Enquire
              </Link>
            </div>
          ) : (
            <div className={`${styles.buttonGroup} hidden sm:block`}>
              <AuthButtonSimple />
            </div>
          )}

          {/* Burger menu button */}
          <button
            type="button"
            className={styles.burgerMenuPlaceholder}
            onClick={() => setIsBurgerOpen(!isBurgerOpen)}
            aria-label="Toggle menu"
          >
            {isBurgerOpen ? (
              <X className="w-8 h-8" aria-hidden />
            ) : (
              <Menu className="w-8 h-8" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Full burger menu drawer */}
      <AnimatePresence>
        {isBurgerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/95 backdrop-blur-lg border-t-2 border-[#d4af37]/30 shadow-xl relative z-20"
          >
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {/* Artists */}
                <BurgerDropdown
                  label="Artists"
                  links={artistsLinks}
                  isOpen={artistsOpen}
                  onToggle={() => setArtistsOpen(!artistsOpen)}
                  onLinkClick={closeBurger}
                  onCloseSub={() => setArtistsOpen(false)}
                />
                {/* Weddings */}
                <BurgerDropdown
                  label="Weddings"
                  links={weddingLinks}
                  isOpen={weddingsOpen}
                  onToggle={() => setWeddingsOpen(!weddingsOpen)}
                  onLinkClick={closeBurger}
                  onCloseSub={() => setWeddingsOpen(false)}
                />
                {/* Parties */}
                <BurgerDropdown
                  label="Parties"
                  links={partiesLinks}
                  isOpen={partiesOpen}
                  onToggle={() => setPartiesOpen(!partiesOpen)}
                  onLinkClick={closeBurger}
                  onCloseSub={() => setPartiesOpen(false)}
                />
                {/* What We Offer */}
                <BurgerDropdown
                  label="What We Offer"
                  links={whatWeOfferLinks}
                  isOpen={whatWeOfferOpen}
                  onToggle={() => setWhatWeOfferOpen(!whatWeOfferOpen)}
                  onLinkClick={closeBurger}
                  onCloseSub={() => setWhatWeOfferOpen(false)}
                />
                {/* Venues */}
                <BurgerDropdown
                  label="Venues"
                  links={venuesLinks}
                  isOpen={venuesOpen}
                  onToggle={() => setVenuesOpen(!venuesOpen)}
                  onLinkClick={closeBurger}
                  onCloseSub={() => setVenuesOpen(false)}
                />
                {/* Galleries */}
                <BurgerDropdown
                  label="Galleries"
                  links={galleriesLinks}
                  isOpen={galleriesOpen}
                  onToggle={() => setGalleriesOpen(!galleriesOpen)}
                  onLinkClick={closeBurger}
                  onCloseSub={() => setGalleriesOpen(false)}
                />
                {/* About Us */}
                <BurgerDropdown
                  label="About Us"
                  links={aboutLinks}
                  isOpen={aboutOpen}
                  onToggle={() => setAboutOpen(!aboutOpen)}
                  onLinkClick={closeBurger}
                  onCloseSub={() => setAboutOpen(false)}
                />
                {/* Contact */}
                <Link
                  href="/contact-us"
                  className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 relative group"
                  onClick={closeBurger}
                >
                  Contact
                </Link>
                {/* Auth (Mobile) */}
                <div className="sm:hidden pt-2 border-t border-[#d4af37]/20">
                  <div className="px-3 py-2">
                    <AuthButtonSimple />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="pt-4 border-t border-[#d4af37]/30">
                <a
                  href="tel:+447970793177"
                  className="flex items-center justify-center gap-3 text-white hover:text-[#d4af37] transition-all duration-300 font-semibold py-3 px-4 rounded-lg hover:bg-white/10"
                  onClick={closeBurger}
                  aria-label="Call us at +44 7970 793177"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +44 7970 793177
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function BurgerDropdown({
  label,
  links,
  isOpen,
  onToggle,
  onLinkClick,
  onCloseSub,
}: {
  label: string;
  links: { href: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
  onCloseSub: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-full text-left text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 flex items-center justify-between"
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 ml-4 space-y-1 border-l-2 border-[#d4af37]/40 pl-4"
          >
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-medium py-1.5 px-2 rounded hover:bg-white/10 text-sm"
                onClick={() => {
                  onLinkClick();
                  onCloseSub();
                }}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
