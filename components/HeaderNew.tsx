"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "@/lib/motion";
import { useSession } from "next-auth/react";
import { AuthButtonSimple } from "@/components/AuthButton";
import styles from "./HeaderNew.module.css";

const galleriesLinks = [
  { href: "/galleries/", label: "Images" },
  { href: "/galleries/videos/", label: "Videos" },
  { href: "/galleries/instagram/", label: "Instagram" },
];

const artistsLinks = [
  { href: "/artists/djs/", label: "DJs" },
  { href: "/artists/musicians/", label: "Musicians" },
];

const weddingLinks = [
  { href: "/weddings/wedding-lighting/", label: "Wedding Lighting" },
  { href: "/weddings/wedding-entertainment/", label: "Wedding Entertainment" },
];

const partiesLinks = [
  { href: "/parties/private-parties/", label: "Private Parties" },
  { href: "/parties/party-lighting/", label: "Party Lighting" },
  { href: "/parties/corporate/", label: "Corporate" },
  { href: "/parties/christmas/", label: "Christmas" },
];

const whatWeOfferLinks = [
  { href: "/party-planning-and-organising/", label: "Party Planning" },
  { href: "/services/venue-styling/", label: "Venue Styling" },
  { href: "/what-we-do/lighting/", label: "Lighting" },
  { href: "/what-we-do/equipment-dj-band-sound-kit/", label: "Sound" },
  { href: "/services/fire-pit-hire/", label: "Fire Pit Hire" },
  { href: "/hire/", label: "Hire Shop" },
];

const venuesLinks = [
  { href: "/venues/", label: "All Venues" },
  { href: "/venues/babington-house/", label: "Babington House" },
  { href: "/venues/mells-barn/", label: "Mells Barn" },
  { href: "/venues/pennard-house/", label: "Pennard House" },
  { href: "/kin-house-wiltshire/", label: "Kin House" },
];

const aboutLinks = [
  { href: "/testi/", label: "Testimonials" },
  { href: "/about/faq/", label: "FAQ" },
  { href: "/about/", label: "About Us" },
  { href: "/about/blog/", label: "Journal" },
];

export default function HeaderNew() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const isLoggedIn = mounted && status === "authenticated" && !!session;
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const [weddingsOpen, setWeddingsOpen] = useState(false);
  const [partiesOpen, setPartiesOpen] = useState(false);
  const [whatWeOfferOpen, setWhatWeOfferOpen] = useState(false);
  const [venuesOpen, setVenuesOpen] = useState(false);
  const [galleriesOpen, setGalleriesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const closeBurger = () => setIsBurgerOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isBurgerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBurgerOpen]);

  return (
    <header
      className={`${styles.header} ${styles.menuComponent} fixed left-0 right-0 z-50 top-0`}
      role="banner"
    >
      <div className={styles.megaMenuContainer}>
        {/* Column 1 (Left): Logo */}
        <div className={styles.wordmarkContainer}>
          <Link href="/" className={styles.wordmarkLinkBlock} prefetch={false}>
            <div className={styles.wordmarkWrapper}>
              <span className={`${styles.approvalsLogoText} ${styles.approvalsLogoTextMobile}`}>Stylish</span>
              <span className={`${styles.logoSubTxt} ${styles.logoSubTxtMobile}`}>Entertainment</span>
            </div>
          </Link>
        </div>

        {/* Column 2 (Center): Enquire – dead-center via justify-self-center */}
        <div className={styles.headerCenterColumn}>
          {!isLoggedIn ? (
            <div className={styles.buttonGroup}>
              <Link href="/contact-us/" className={`${styles.enquireButton} ${styles.enquireButtonMobile}`} prefetch={false}>
                Enquire
              </Link>
            </div>
          ) : (
            <div className={`${styles.buttonGroup} hidden sm:block`}>
              <AuthButtonSimple />
            </div>
          )}
        </div>

        {/* Column 3 (Right): Burger – justify-self-end, 44px hitbox */}
        <button
          type="button"
          className={`${styles.burgerMenuPlaceholder} ${styles.burgerMenuMobile}`}
          onClick={() => setIsBurgerOpen(!isBurgerOpen)}
          aria-label="Toggle menu"
        >
          {isBurgerOpen ? (
            <X className={styles.burgerIcon} aria-hidden />
          ) : (
            <Menu className={styles.burgerIcon} aria-hidden />
          )}
        </button>
      </div>

      {/* Strapline – direct child of header, absolute center via inline styles */}
      <div
        className={`${styles.centreStraplineTxt} ${styles.hideTablet} ${styles.hideMobilePortrait}`}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        Every Gathering Deserves To Be{" "}
        <span className={styles.textSpanExtraordinary}>Extraordinary</span>
      </div>

      {/* Dropdown: absolute under header, only when menu open; full width */}
      <AnimatePresence>
        {isBurgerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full max-h-[80vh] overflow-y-auto bg-black border-t-2 border-[#d4af37]/30 shadow-xl z-50"
          >
            {/* Column on mobile (<768px), row on larger screens */}
            <div className="flex flex-col md:flex-row gap-y-6 md:gap-y-0 md:justify-between md:items-center px-10 py-6">
              <BurgerDropdown
                label="Artists"
                links={artistsLinks}
                isOpen={artistsOpen}
                onToggle={() => setArtistsOpen(!artistsOpen)}
                onLinkClick={closeBurger}
                onCloseSub={() => setArtistsOpen(false)}
              />
              <BurgerDropdown
                label="Weddings"
                links={weddingLinks}
                isOpen={weddingsOpen}
                onToggle={() => setWeddingsOpen(!weddingsOpen)}
                onLinkClick={closeBurger}
                onCloseSub={() => setWeddingsOpen(false)}
              />
              <BurgerDropdown
                label="Parties"
                links={partiesLinks}
                isOpen={partiesOpen}
                onToggle={() => setPartiesOpen(!partiesOpen)}
                onLinkClick={closeBurger}
                onCloseSub={() => setPartiesOpen(false)}
              />
              <BurgerDropdown
                label="What We Offer"
                links={whatWeOfferLinks}
                isOpen={whatWeOfferOpen}
                onToggle={() => setWhatWeOfferOpen(!whatWeOfferOpen)}
                onLinkClick={closeBurger}
                onCloseSub={() => setWhatWeOfferOpen(false)}
              />
              <BurgerDropdown
                label="Venues"
                links={venuesLinks}
                isOpen={venuesOpen}
                onToggle={() => setVenuesOpen(!venuesOpen)}
                onLinkClick={closeBurger}
                onCloseSub={() => setVenuesOpen(false)}
              />
              <BurgerDropdown
                label="Galleries"
                links={galleriesLinks}
                isOpen={galleriesOpen}
                onToggle={() => setGalleriesOpen(!galleriesOpen)}
                onLinkClick={closeBurger}
                onCloseSub={() => setGalleriesOpen(false)}
              />
              <BurgerDropdown
                label="About Us"
                links={aboutLinks}
                isOpen={aboutOpen}
                onToggle={() => setAboutOpen(!aboutOpen)}
                onLinkClick={closeBurger}
                onCloseSub={() => setAboutOpen(false)}
              />
              <Link
                href="/contact-us/"
                className="text-base text-white hover:text-[#d4af37] transition-all duration-300 font-medium py-4 px-3 rounded-lg hover:bg-white/10 whitespace-nowrap tracking-widest min-h-[48px] flex items-center"
                onClick={closeBurger}
                prefetch={false}
              >
                Contact
              </Link>
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
        className="text-left text-base text-white hover:text-[#d4af37] transition-all duration-300 font-medium py-4 px-3 rounded-lg hover:bg-white/10 flex items-center gap-1 whitespace-nowrap tracking-widest min-h-[48px]"
      >
        {label}
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
                className="block text-sm text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-normal py-4 px-2 rounded hover:bg-white/10 whitespace-nowrap tracking-wide min-h-[48px] flex items-center"
                onClick={() => {
                  onLinkClick();
                  onCloseSub();
                }}
                prefetch={false}
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
