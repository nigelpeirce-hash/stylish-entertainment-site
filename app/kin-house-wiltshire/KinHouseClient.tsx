"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Mic, Disc, Music, Palette, Star } from "lucide-react";

const kinHousePhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163122/Kin-House-Mirroball-Package_gu9htw.jpg",
    alt: "Stage, Band lighting, PA and Glitter Ball at Kin House",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162837/02B12F9E-2B68-4CC9-9222-1CB8636346B5_1_105_c-e1711128118139_etauug.jpg",
    alt: "Fairy-light canopy in Kilvert Hall at Kin House",
    width: 1200,
    height: 900,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163212/Kin-House-Kilvert-Hall-Lighting_htlcbj.jpg",
    alt: "Perfect for winter and autumn weddings and events at Kin House",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162715/Kin-House-Exterior-Terrace-Lighting_lxvlpk.jpg",
    alt: "Exterior terrace lighting at Kin House",
    width: 1200,
    height: 900,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    alt: "Our cluster of Gold and Silver Mirrorballs of multi-size in the bar at Kin House",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163147/Kin-House-Stage-Supply_rj6ipz.jpg",
    alt: "Stage supply from Stylish Entertainment at Kin House",
    width: 1200,
    height: 900,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162617/Kin-House-Stage-and-Lighting-supply_ufpxbl.jpg",
    alt: "Band Lighting and stage supply with retro lights at Kin House",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162262/Kin-House-LED-up-lighting_fr3ypq.jpg",
    alt: "LED mood lighting in use at Kilvert Bar at Kin House",
    width: 1200,
    height: 900,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163012/Kin-House-Violet-Mood-Lighting_i8xos3.jpg",
    alt: "Add some mood lighting at your Kin House Wedding or party",
    width: 1200,
    height: 1600,
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162252/Kin-House-Kilvert-Hall_ukg4ln.jpg",
    alt: "A party in full swing with DJ and Mirrorball lighting at Kin House",
    width: 1200,
    height: 900,
  },
];

const services = [
  {
    icon: Sparkles,
    title: "Mirrorball Packages",
    description: "Kin House specialty - Gold and silver mirrorball clusters",
    featured: true,
  },
  {
    icon: Disc,
    title: "Stage Supply",
    description: "Professional staging and production equipment",
  },
  {
    icon: Music,
    title: "Party Lighting",
    description: "Creative lighting for celebrations",
  },
  {
    icon: Mic,
    title: "Stage Lighting",
    description: "Professional stage and band lighting",
  },
  {
    icon: Palette,
    title: "Creative Lighting",
    description: "Exterior and interior lighting design",
  },
];

export default function KinHouseClient() {
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
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162508/Kin-House-Stage-Lighting-and-Sound-supply_j8yln4.jpg"
            alt="Kin House wedding venue with professional lighting and production"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-800" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Kin House
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-semibold px-4 drop-shadow-md">
            Lighting, Staging & Production
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section
        className="py-20 px-4"
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="text-gray-200 leading-relaxed space-y-6">
                  <p className="text-lg">
                    At Kin House, we&apos;re honoured to be the trusted lighting and production partner for this exceptional venue. With years of experience working alongside the Kin House team, we understand the unique character and charm of this beautiful setting. Our passion lies in crafting bespoke lighting designs that enhance the venue&apos;s natural elegance while bringing your personal vision to life.
                  </p>

                  <p>
                    From intimate ceremonies to grand receptions, we work closely with you to create a seamless production that transforms every space. Our attention to detail and commitment to excellence ensures that your celebration at Kin House will be nothing short of spectacular, leaving you and your guests with memories that will last a lifetime.
                  </p>

                  {/* Venue Insight Quote */}
                  <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 mt-8">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Star className="h-6 w-6 text-champagne-gold flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-gray-200 italic text-lg leading-relaxed mb-2">
                            &quot;Kin House has a unique retro-cool vibe that pairs perfectly with our mirrorball clusters and warm vintage lighting.&quot;
                          </p>
                          <p className="text-champagne-gold font-semibold">
                            — Nigel Peirce, DJ & Production
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Ribbon */}
                  <div className="my-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Our Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {services.map((service, idx) => {
                        const Icon = service.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                          >
                            <Card
                              className={`bg-gray-900/50 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/60 transition-all h-full ${
                                service.featured ? "ring-2 ring-champagne-gold/50" : ""
                              }`}
                            >
                              <CardContent className="p-4 text-center">
                                <div className={`p-3 rounded-lg mb-3 inline-flex ${service.featured ? "bg-champagne-gold/20" : "bg-champagne-gold/10"}`}>
                                  <Icon className={`h-6 w-6 ${service.featured ? "text-champagne-gold" : "text-champagne-gold/80"}`} />
                                </div>
                                <h4 className="text-base font-semibold text-white mb-2">{service.title}</h4>
                                <p className="text-sm text-gray-300 leading-relaxed">{service.description}</p>
                                {service.featured && (
                                  <span className="mt-2 inline-block text-xs text-champagne-gold font-semibold">Kin House Specialty</span>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Masonry Gallery Grid */}
                  <div className="my-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {kinHousePhotos.map((photo, index) => (
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
                          <div className="relative aspect-[3/4] md:aspect-auto" style={{ minHeight: "300px" }}>
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                              loading={index < 3 ? "eager" : "lazy"}
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Premium CTA Box */}
                  <Card className="bg-gradient-to-br from-champagne-gold/20 to-transparent border-2 border-champagne-gold/50 mt-12">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ready to Transform Your Kin House Event?
                      </h3>
                      <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto">
                        Contact Ali or Nigel at Stylish Entertainment about your wedding, party or event at Kin House where we are a trusted local supplier and know the team at Kin well.
                      </p>
                      <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                        <Link href="/contact-us">Get in Touch</Link>
                      </Button>
                      <p className="text-gray-300 text-sm mt-4">
                        Discuss your Kin House lighting and production requirements
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={kinHousePhotos.map((photo) => ({ src: photo.src }))}
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
