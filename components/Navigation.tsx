"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthButton } from "@/components/AuthButton";
import WaveDivider from "@/components/WaveDivider";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [weddingsOpen, setWeddingsOpen] = useState(false);
  const [partiesOpen, setPartiesOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const [whatWeOfferOpen, setWhatWeOfferOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [galleriesOpen, setGalleriesOpen] = useState(false);

  const navLinks = [
    { href: "/contact-us", label: "Contact" },
  ];

  const galleriesLinks = [
    { href: "/galleries", label: "Images" },
    { href: "/galleries/videos", label: "Videos" },
    { href: "/galleries/instagram", label: "Instagram" },
  ];

  const aboutLinks = [
    { href: "/testi", label: "Testimonials" },
    { href: "/about/faq", label: "FAQ" },
    { href: "/about", label: "About Us" },
    { href: "/about/blog", label: "Blog" },
  ];

  const whatWeOfferLinks = [
    { href: "/party-planning-and-organising", label: "Party Planning" },
    { href: "/what-we-do/venue-decoration", label: "Venue Styling" },
    { href: "/what-we-do/lighting", label: "Lighting" },
    { href: "/what-we-do/equipment-dj-band-sound-kit", label: "Sound" },
    { href: "/fire-pit-html", label: "Fire Pit Hire" },
    { href: "/hire", label: "Hire Shop" },
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

  const artistsLinks = [
    { href: "/artists/djs", label: "DJs" },
    { href: "/artists/musicians", label: "Musicians" },
  ];

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[#d4af37]/50 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#2a1f0a] via-[#1a1508] to-[#0f0a05]">
      {/* Base gradient background - More luxurious gold tones */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          zIndex: 0,
          background: `
            radial-gradient(ellipse 1000px 500px at 20% 0%, rgba(212, 175, 55, 0.45) 0%, rgba(212, 175, 55, 0.15) 40%, transparent 70%),
            radial-gradient(ellipse 1000px 500px at 80% 0%, rgba(212, 175, 55, 0.35) 0%, rgba(212, 175, 55, 0.12) 40%, transparent 70%),
            radial-gradient(ellipse 1400px 700px at 50% 100%, rgba(212, 175, 55, 0.2) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 80%),
            linear-gradient(180deg, rgba(42, 31, 10, 0.95) 0%, rgba(26, 21, 8, 0.98) 50%, rgba(15, 10, 5, 1) 100%)
          `,
        }}
      />
      
      {/* Animated shimmer effect - Enhanced gold */}
      <div 
        className="absolute inset-0 pointer-events-none animate-gradient-shift"
        style={{ 
          zIndex: 1,
          background: `
            linear-gradient(
              120deg,
              transparent 0%,
              transparent 35%,
              rgba(212, 175, 55, 0.25) 50%,
              transparent 65%,
              transparent 100%
            )
          `,
          backgroundSize: '300% 300%',
        }}
      />
      
      {/* Animated light sweep - More prominent */}
      <div 
        className="absolute inset-0 pointer-events-none animate-light-sweep"
        style={{ 
          zIndex: 1,
          background: `
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(212, 175, 55, 0.15) 25%,
              rgba(212, 175, 55, 0.3) 50%,
              rgba(212, 175, 55, 0.15) 75%,
              transparent 100%
            )
          `,
          backgroundSize: '200% 100%',
        }}
      />
      
      {/* Subtle backdrop blur for depth - Lighter to show more gold */}
      <div 
        className="absolute inset-0 backdrop-blur-sm pointer-events-none"
        style={{ 
          zIndex: 1,
          background: 'rgba(42, 31, 10, 0.15)',
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-20">
        <div className="flex items-center justify-between h-48 md:h-52 relative">
          <div className="flex flex-col flex-shrink-0">
            <Link href="/" className="relative group z-20 hover:opacity-90 transition-opacity duration-300">
              <img
                src="/logo-header.svg"
                alt="Stylish Entertainment Logo"
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                loading="eager"
                fetchPriority="high"
              />
            </Link>
          </div>

          {/* Centered Tagline - Hidden on Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none px-2"
            style={{ 
              maxWidth: 'calc(100% - 320px)',
              minWidth: '200px'
            }}
          >
            <h2 
              className="text-white font-semibold italic text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap"
              style={{
                fontSize: 'clamp(0.625rem, 1.5vw + 0.25rem, 1.125rem)'
              }}
            >
              Every Gathering Deserves To Be Extraordinary
            </h2>
          </motion.div>

            {/* Auth Button & Menu Button */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:block">
                <AuthButton />
              </div>
              <button
                className="text-white relative z-20 p-2 rounded-lg hover:bg-[#d4af37]/20 hover:text-[#d4af37] transition-all duration-300 hover:scale-110 flex items-center gap-2 backdrop-blur-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={26} className="font-bold" /> : <Menu size={26} className="font-bold" />}
                <span className="hidden sm:inline text-sm font-bold">Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Navigation Menu - All Screen Sizes */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/95 backdrop-blur-lg border-t-2 border-[#d4af37]/30 shadow-xl relative z-20"
            >
              <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4">
                {/* Navigation Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                  {/* Artists Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setArtistsOpen(!artistsOpen)}
                      className="w-full text-left text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 relative group flex items-center justify-between"
                    >
                      <span className="relative z-10 text-sm sm:text-base">Artists</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${artistsOpen ? 'rotate-180' : ''}`}
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                    <AnimatePresence>
                      {artistsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 ml-4 space-y-1 border-l-2 border-[#d4af37]/40 pl-4"
                        >
                          {artistsLinks.map((artist) => (
                            <Link
                              key={artist.href}
                              href={artist.href}
                              className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-medium py-1.5 px-2 rounded hover:bg-white/10 text-sm"
                              onClick={() => {
                                setIsOpen(false);
                                setArtistsOpen(false);
                              }}
                            >
                              {artist.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Weddings Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setWeddingsOpen(!weddingsOpen)}
                      className="w-full text-left text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 relative group flex items-center justify-between"
                    >
                      <span className="relative z-10 text-sm sm:text-base">Weddings</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${weddingsOpen ? 'rotate-180' : ''}`}
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                    <AnimatePresence>
                      {weddingsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 ml-4 space-y-1 border-l-2 border-[#d4af37]/40 pl-4"
                        >
                          {weddingLinks.map((wedding) => (
                            <Link
                              key={wedding.href}
                              href={wedding.href}
                              className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-medium py-1.5 px-2 rounded hover:bg-white/10 text-sm"
                              onClick={() => {
                                setIsOpen(false);
                                setWeddingsOpen(false);
                              }}
                            >
                              {wedding.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Parties Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setPartiesOpen(!partiesOpen)}
                      className="w-full text-left text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 relative group flex items-center justify-between"
                    >
                      <span className="relative z-10 text-sm sm:text-base">Parties</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${partiesOpen ? 'rotate-180' : ''}`}
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                    <AnimatePresence>
                      {partiesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 ml-4 space-y-1 border-l-2 border-[#d4af37]/40 pl-4"
                        >
                          {partiesLinks.map((party) => (
                            <Link
                              key={party.href}
                              href={party.href}
                              className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-medium py-1.5 px-2 rounded hover:bg-white/10 text-sm"
                              onClick={() => {
                                setIsOpen(false);
                                setPartiesOpen(false);
                              }}
                            >
                              {party.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* What We Offer Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setWhatWeOfferOpen(!whatWeOfferOpen)}
                      className="w-full text-left text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 relative group flex items-center justify-between"
                    >
                      <span className="relative z-10 text-sm sm:text-base">What We Offer</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${whatWeOfferOpen ? 'rotate-180' : ''}`}
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                    <AnimatePresence>
                      {whatWeOfferOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 ml-4 space-y-1 border-l-2 border-[#d4af37]/40 pl-4"
                        >
                          {whatWeOfferLinks.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-medium py-1.5 px-2 rounded hover:bg-white/10 text-sm"
                              onClick={() => {
                                setIsOpen(false);
                                setWhatWeOfferOpen(false);
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Galleries Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setGalleriesOpen(!galleriesOpen)}
                      className="w-full text-left text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 relative group flex items-center justify-between"
                    >
                      <span className="relative z-10 text-sm sm:text-base">Galleries</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${galleriesOpen ? 'rotate-180' : ''}`}
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                    <AnimatePresence>
                      {galleriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 ml-4 space-y-1 border-l-2 border-[#d4af37]/40 pl-4"
                        >
                          {galleriesLinks.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-medium py-1.5 px-2 rounded hover:bg-white/10 text-sm"
                              onClick={() => {
                                setIsOpen(false);
                                setGalleriesOpen(false);
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* About Us & FAQs Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setAboutOpen(!aboutOpen)}
                      className="w-full text-left text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 relative group flex items-center justify-between"
                    >
                      <span className="relative z-10 text-sm sm:text-base">About Us</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-300 ${aboutOpen ? 'rotate-180' : ''}`}
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                    <AnimatePresence>
                      {aboutOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 ml-4 space-y-1 border-l-2 border-[#d4af37]/40 pl-4"
                        >
                          {aboutLinks.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-medium py-1.5 px-2 rounded hover:bg-white/10 text-sm"
                              onClick={() => {
                                setIsOpen(false);
                                setAboutOpen(false);
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Contact Link */}
                  <Link
                    href="/contact-us"
                    className="block text-white hover:text-[#d4af37] hover:translate-x-2 transition-all duration-300 font-semibold py-2 sm:py-3 px-3 rounded-lg hover:bg-white/10 relative group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10 text-sm sm:text-base">Contact</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </Link>
                  
                  {/* Auth Link (Mobile) */}
                  <div className="sm:hidden pt-2 border-t border-[#d4af37]/20">
                    <div className="px-3 py-2">
                      <AuthButton />
                    </div>
                  </div>
                </div>
                
                {/* Phone Number */}
                <div className="pt-4 border-t border-[#d4af37]/30">
                  <a
                    href="tel:+447970793177"
                    className="flex items-center justify-center gap-3 text-white hover:text-[#d4af37] transition-all duration-300 font-semibold py-3 px-4 rounded-lg hover:bg-white/10 relative group"
                    onClick={() => setIsOpen(false)}
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
                    <span className="relative z-10 text-base sm:text-lg font-bold">+44 7970 793177</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Wave Divider at bottom of header */}
        <WaveDivider />
      </nav>

    </>
  );
}
