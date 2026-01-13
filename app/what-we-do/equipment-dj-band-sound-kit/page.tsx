"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Volume2, Mic, Radio, Headphones } from "lucide-react";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { useEffect } from "react";

const soundPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
    width: 1200,
    height: 900,
    alt: "Professional DJ sound equipment and sound system setup at Babington House with high-quality audio equipment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162508/Kin-House-Stage-Lighting-and-Sound-supply_j8yln4.jpg",
    width: 1200,
    height: 900,
    alt: "Professional stage lighting and sound system supply at Kin House venue with complete DJ and band sound kit",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163688/Nigel-DJ-Babs-House-0008-1_ol2gkr.jpg",
    width: 1200,
    height: 900,
    alt: "DJ Nige performing with professional sound equipment and live musicians at Babington House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163656/IMG_3148_owtb29.jpg",
    width: 1200,
    height: 900,
    alt: "Live musicians performing with professional sound equipment and audio system for wedding entertainment",
  },
];

export default function SoundEquipment() {
  useEffect(() => {
    document.title = "Sound Equipment | DJ & Band Sound Kit Hire | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Professional sound equipment hire for DJs and bands. High-quality sound systems, microphones, speakers, and complete audio packages for weddings and events across the West Country."
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162508/Kin-House-Stage-Lighting-and-Sound-supply_j8yln4.jpg"
            alt="Professional stage lighting and sound system supply with complete DJ and band sound kit"
            className="w-full h-full object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Sound Equipment</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Professional sound systems and audio equipment for DJs, bands, and live performances
          </p>
        </motion.div>
      </section>

      {/* Service Details */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="h-8 w-8 text-champagne-gold" />
                <CardTitle className="text-3xl md:text-4xl text-white">Professional Sound Equipment</CardTitle>
              </div>
              <CardDescription className="text-lg text-gray-300">
                Crystal-clear audio is essential for any successful event. We provide professional-grade sound equipment including PA systems, microphones, speakers, and complete audio packages for DJs, bands, and live performances.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">What We Offer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-champagne-gold mb-3 flex items-center gap-2">
                      <Radio className="w-5 h-5" />
                      Sound Systems
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "Professional PA systems",
                        "Active and passive speakers",
                        "Subwoofers and bass management",
                        "Sound mixing consoles",
                        "Amplifiers and power management",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <span className="text-champagne-gold mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-champagne-gold mb-3 flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Microphones & Audio
                    </h4>
                    <ul className="space-y-2">
                      {[
                        "Wireless microphones for speeches",
                        "Handheld and lapel microphones",
                        "Instrument microphones",
                        "Audio interfaces and processors",
                        "Monitor speakers for performers",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <span className="text-champagne-gold mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-champagne-gold/20">
                <div className="flex items-center gap-3 text-gray-300">
                  <Headphones className="w-6 h-6 text-champagne-gold" />
                  <p className="text-base">
                    All equipment is professionally maintained, PAT tested, and fully insured. We provide setup, sound checks, and technical support throughout your event.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-center text-white font-bold px-4">Sound Equipment Gallery</h2>
            <p className="text-base sm:text-lg text-gray-300 text-center max-w-2xl mx-auto px-4">
              Professional sound systems in action at our events
            </p>
          </motion.div>
          <div className="flex justify-center">
            <ImageCarousel images={soundPhotos} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Need professional sound equipment for your event?
            </h2>
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/contact-us">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
