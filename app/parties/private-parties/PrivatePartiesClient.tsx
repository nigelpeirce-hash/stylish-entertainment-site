"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WaveDivider from "@/components/WaveDivider";
import { Map, Sparkles, Music, Video, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

const privatePartyPhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg",
    alt: "Professional lighting design at Kings Weston House creating an elegant atmosphere for a private party",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163141/IMG_6712-1-e1444841687100_wakppz.jpg",
    alt: "Elegant private party setup with beautiful lighting and sophisticated decor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162844/Orangery1_dpfega.jpg",
    alt: "Orangery venue with stunning party lighting and elegant private party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    alt: "Pool party with colourful lighting reflecting on the water for a stylish summer celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163299/Nigel-DJ-Babs-House-0009-1_hmbsn3.jpg",
    alt: "DJ Nige performing at Babington House with professional party lighting and entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163181/IMG_6095_fo6lhk.jpg",
    alt: "Private party with atmospheric lighting and elegant decor creating a memorable celebration",
  },
];

const serviceAreas = [
  {
    region: "Somerset",
    towns: ["Frome", "Bruton", "Castle Cary", "Glastonbury", "Wells", "Taunton"],
    isHomeBase: true,
  },
  {
    region: "Wiltshire",
    towns: ["Warminster", "Westbury", "Trowbridge", "Salisbury", "Bradford-on-Avon"],
    isHomeBase: false,
  },
  {
    region: "Bath & BANES",
    towns: ["Bath", "Midsomer Norton", "Chew Valley"],
    isHomeBase: false,
  },
  {
    region: "Bristol",
    towns: ["Clifton", "Chew Magna", "City Centre"],
    isHomeBase: false,
  },
  {
    region: "Dorset",
    towns: ["Sherborne", "Gillingham", "Shaftesbury"],
    isHomeBase: false,
  },
  {
    region: "Mendip",
    towns: ["Shepton Mallet", "Oakhill", "Street"],
    isHomeBase: false,
  },
];

export default function PrivatePartiesClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163810/image2_l1hxxx.jpg"
            alt="Private party celebration with professional entertainment, lighting, and party planning"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Private Parties
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Bespoke Party Planning & Technical Production
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <WaveDivider />
        </div>
      </section>

      {/* Content */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        {/* Welcome Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-6 text-white font-bold">
                Welcome to STYLISH
              </h2>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                Planning a party? We&apos;re here to help. We provide creative DJs, bands, and entertainment, beautiful lighting, and full party planning and production. With years of experience, we offer honest advice to help you create the best event possible.
              </p>
            </motion.div>

            {/* Three Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-16">
              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300">
                <CardHeader>
                  <Map className="w-10 h-10 text-champagne-gold mb-4" />
                  <CardTitle className="text-white">Planning & Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Expert logistics, theme development, and honest advice. From initial concept to final floor plan, we guide you through every decision to ensure your party vision becomes reality.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300">
                <CardHeader>
                  <Sparkles className="w-10 h-10 text-champagne-gold mb-4" />
                  <CardTitle className="text-white">Production & Lighting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Transform any space—from pool parties to marquees. Dynamic lighting designs, technical production, and atmospheric staging that elevates your celebration to extraordinary heights.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300">
                <CardHeader>
                  <Music className="w-10 h-10 text-champagne-gold mb-4" />
                  <CardTitle className="text-white">Entertainment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Curated DJs, bands, and performers who understand the &apos;Babington Standard&apos;. Whether it&apos;s sophisticated background music or an energetic dance floor, we deliver entertainment excellence.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Planning Journey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">The Planning Journey</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex-1 max-w-xs">
                  <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-champagne-gold text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                        1
                      </div>
                      <h4 className="text-white font-semibold mb-2">Discovery Consultation</h4>
                      <p className="text-gray-300 text-sm">Initial consultation to understand your vision and requirements</p>
                    </CardContent>
                  </Card>
                </div>
                <ArrowRight className="text-champagne-gold w-8 h-8 rotate-90 md:rotate-0" />
                <div className="flex-1 max-w-xs">
                  <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-champagne-gold text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                        2
                      </div>
                      <h4 className="text-white font-semibold mb-2">Site Visit & Design</h4>
                      <p className="text-gray-300 text-sm">On-site assessment and bespoke design proposal</p>
                    </CardContent>
                  </Card>
                </div>
                <ArrowRight className="text-champagne-gold w-8 h-8 rotate-90 md:rotate-0" />
                <div className="flex-1 max-w-xs">
                  <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-champagne-gold text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                        3
                      </div>
                      <h4 className="text-white font-semibold mb-2">Flawless Execution</h4>
                      <p className="text-gray-300 text-sm">Event day coordination and seamless production delivery</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>

            {/* Featured Images Grid - Moved Higher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {privatePartyPhotos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all duration-300"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="relative aspect-[4/3]" style={{ minHeight: "300px" }}>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index < 3 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trusted by Babington */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/30">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">⭐</div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                        Trusted by the Best
                      </h3>
                      <p className="text-gray-200 text-lg leading-relaxed">
                        For over 20 years we have been the sole supplier of entertainment and party production at the legendary{" "}
                        <Link
                          href="https://www.babingtonhouse.co.uk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-champagne-gold hover:text-gold-light underline font-semibold"
                        >
                          Babington House (Soho House & Co)
                        </Link>{" "}
                        where celebs hang-out and party.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Service Area - Expanded */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Subtle SVG Map Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Simplified South West England outline */}
              <path
                d="M 120 150 Q 150 120 180 130 Q 220 140 260 130 Q 300 120 320 140 Q 340 160 350 200 Q 360 240 340 280 Q 320 300 280 310 Q 240 320 200 310 Q 160 300 140 280 Q 110 260 100 220 Q 110 180 120 150 Z"
                fill="url(#mapGradient)"
                stroke="#d4af37"
                strokeWidth="2"
                opacity="0.3"
              />
              {/* Bristol marker */}
              <circle cx="240" cy="200" r="8" fill="#d4af37" opacity="0.5" />
              {/* Bath marker */}
              <circle cx="220" cy="220" r="6" fill="#d4af37" opacity="0.5" />
              {/* Frome marker (home base) */}
              <circle cx="200" cy="240" r="10" fill="#d4af37" opacity="0.7">
                <animate
                  attributeName="opacity"
                  values="0.7;1;0.7"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <MapPin className="h-8 w-8 text-champagne-gold" />
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Service Area</h2>
                </div>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  We offer party planning and production across the West Country
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {serviceAreas.map((area, idx) => (
                  <Card
                    key={idx}
                    className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-champagne-gold flex-shrink-0" />
                        <CardTitle className="text-white text-xl">{area.region}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {area.towns.map((town, townIdx) => (
                          <div key={townIdx} className="flex items-center gap-2">
                            {area.isHomeBase && town === "Frome" ? (
                              <>
                                <div className="relative">
                                  <div className="w-2 h-2 rounded-full bg-champagne-gold animate-pulse"></div>
                                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-champagne-gold animate-ping opacity-75"></div>
                                </div>
                                <span className="text-gray-200 font-semibold">{town}</span>
                                <span className="text-xs text-champagne-gold/70">(Home Base)</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-champagne-gold/60 flex-shrink-0" />
                                <span className="text-gray-200">{town}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Destination SEO Text */}
              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 mt-8">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-200 leading-relaxed max-w-3xl mx-auto">
                    Planning a destination wedding from London or overseas? We specialize in remote planning for venues across the West Country, acting as your local technical partners and on-the-ground experts.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Perfection in Every Detail
                  </h3>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    We have created hundreds of weddings, parties and events at Babington where every detail has to be perfect. As a company they certainly do not carry any dead wood and we are proud to be part of the Soho House family.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Your Vision, Our Expertise
                  </h3>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    Whether you want a themed fancy-dress or a stylish Gatsbyesque party, find out how we can help you deliver the best party possible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/20 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <CardContent className="p-8 sm:p-12 text-center">
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-6">
                    So please contact us about your party plans on{" "}
                    <a
                      href="tel:+447970793177"
                      className="text-champagne-gold hover:text-gold-light underline font-bold text-xl"
                    >
                      07970793177
                    </a>
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <Button
                      asChild
                      size="lg"
                      className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    >
                      <Link href="/contact-us">Get in Touch</Link>
                    </Button>
                  </div>
                  <p className="text-champagne-gold font-semibold text-lg mt-6">
                    Regards,<br />
                    <span className="text-white font-cursive">Ali & Nige</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={privatePartyPhotos.map((photo) => ({ src: photo.src }))}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        render={{
          buttonPrev: () => (
            <button
              className="yarl__button yarl__button_prev"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.9)",
                color: "#1a1a1a",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                padding: "16px",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} strokeWidth={3} />
            </button>
          ),
          buttonNext: () => (
            <button
              className="yarl__button yarl__button_next"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.9)",
                color: "#1a1a1a",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                padding: "16px",
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} strokeWidth={3} />
            </button>
          ),
        }}
      />
    </div>
  );
}
