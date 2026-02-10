"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HorizontalImageCarousel from "@/components/HorizontalImageCarousel";
import type { ImagePhoto } from "@/components/ImageCarousel";
import { useEffect } from "react";

const EDITORIAL_TILES = [
  {
    group: "The Foundations",
    items: [
      {
        title: "Architectural Uplighting",
        description:
          'We don\'t just "wash" walls; we layer light to add depth, warmth, and texture to your venue\'s unique features.',
      },
      {
        title: "Festoon & Fairy Lights",
        description:
          'The gold standard for barns and marquees. We create a "canopy of stars" effect that brings the outdoors in.',
      },
    ],
  },
  {
    group: "The Energy",
    items: [
      {
        title: "Intelligent Dancefloor Lighting",
        description:
          'No tacky "dots" or cheap lasers. We use club-standard moving heads to sync with the music and drive the energy.',
      },
      {
        title: "Mirror Balls & Disco Glamour",
        description: "For that timeless, high-end shimmer that never goes out of style.",
      },
    ],
  },
  {
    group: "The Details",
    items: [
      {
        title: "Gobo & Texture Projection",
        description: "Transform blank walls into works of art with custom patterns and monogram projections.",
      },
      {
        title: "Outdoor Magic",
        description: "We illuminate trees, walkways, and terraces to ensure your party doesn't end at the door.",
      },
    ],
  },
];

const lightingPhotos = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg",
    width: 1200,
    height: 900,
    alt: "Wedding reception with professional lighting design, elegant table settings, and ambient lighting at a South West venue",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant wedding reception with sophisticated lighting design creating a warm and romantic atmosphere with ambient mood lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
    width: 1200,
    height: 900,
    alt: "Professional DJ setup at Babington House with custom lighting, professional sound equipment, and atmospheric wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg",
    width: 1200,
    height: 900,
    alt: "Emily and Tom's wedding reception with stunning atmospheric lighting design, captured by Jonny Barratt Photography, creating a magical evening ambiance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768734499/Jade-and-Emma-0059-1_wddnet.jpg",
    width: 1200,
    height: 900,
    alt: "Jade and Emma's wedding with elegant dance floor lighting design and romantic ambient lighting creating a beautiful celebration atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162978/ITALLIAN-VILLA-02_jgy3tx.jpg",
    width: 1200,
    height: 900,
    alt: "Italian Villa wedding venue with stunning exterior LED mood lighting and professional wedding lighting design creating an elegant evening atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    width: 1200,
    height: 900,
    alt: "Kin House venue with elegant mirrorball clusters and professional lighting design creating a sophisticated party atmosphere",
  },
];

export default function Lighting() {
  useEffect(() => {
    document.title = "Lighting | The Art of the Atmosphere | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "The art of the atmosphere. Bespoke lighting design for UK weddings and events—uplighting, dance floor, gobo projection, and outdoor magic.");
    }
  }, []);

  return (
    <div>
      {/* Hero – The Hook */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162978/ITALLIAN-VILLA-02_jgy3tx.jpg"
            alt="Italian Villa wedding venue with stunning exterior LED mood lighting"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: "center center" }}
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-56"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            The Art of the Atmosphere
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto px-4 drop-shadow-md leading-relaxed">
            Most venues look incredible during the day, but we make sure they look legendary when the sun goes down. From the first dance to the final track, we use light to hide the ordinary and highlight the extraordinary.
          </p>
        </motion.div>
      </section>

      {/* Gallery – up top so visuals land sooner */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-2 sm:mb-3 text-center text-white font-bold px-4">Lighting Design Gallery</h2>
            <p className="text-base sm:text-lg text-gray-300 text-center max-w-2xl mx-auto px-4">
              See how we transform venues with captivating light installations
            </p>
          </motion.div>
          <div className="flex justify-center">
            <HorizontalImageCarousel
              images={lightingPhotos}
              aspectRatio="wide"
              showDots
              autoplayMs={5000}
            />
          </div>
        </div>
      </section>

      {/* Straight-Talking Service Grid – Editorial Tiles */}
      <section className="py-20 px-3 sm:px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {EDITORIAL_TILES.map((group, groupIdx) => (
              <div key={group.group}>
                <h3 className="text-lg sm:text-xl font-semibold text-champagne-gold mb-6 tracking-wider uppercase">
                  {group.group}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.items.map((item, idx) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (groupIdx * 0.1) + idx * 0.05 }}
                    >
                      <Card className="h-full border-champagne-gold/30 bg-gray-900/80 backdrop-blur-sm hover:border-champagne-gold/50 transition-all duration-300">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
                          <p className="text-gray-300 leading-relaxed">{item.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Stylish? */}
      <section className="py-20 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-champagne-gold mb-6">
              Less Tech, More Taste.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              We&apos;ve spent 20 years in the UK&apos;s most prestigious venues. We know that lighting should be felt, not just seen. Our setups are sleek, our cables are hidden, and our designs are tailored to your specific brand of &quot;extraordinary.&quot;
            </p>
          </motion.div>
        </div>
      </section>

      {/* Babington Proof */}
      <section className="py-12 px-3 sm:px-4 bg-gray-800 border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-base sm:text-lg text-gray-400 italic"
          >
            Preferred lighting partners for Babington House and the UK&apos;s leading estates.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-3 sm:px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to transform your venue?
            </h2>
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/contact-us">Check Availability</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
