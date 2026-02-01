"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight, Heart, Sun, Music2, MapPin, Phone } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Hero image – legendary evening atmosphere
const heroImage = {
  src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163797/150730_sami-tammy_ria-mishaal-photography_775_bbo9bb.jpg",
  alt: "Wedding venue transformed by bespoke lighting – legendary atmosphere when the sun goes down",
};

// Gallery – evocative wedding lighting moments
const galleryPhotos = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163840/Fairy-Light-Canopy-with-Shades-e1510835685909_wgdrd3.jpg", alt: "Fairy light canopy with shades – romantic, layered atmosphere" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163739/170504_matthew-pei-san_ria-mishaal-photography_0957_im3era.jpg", alt: "Fairy light tunnel – magical walkway for the first dance" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg", alt: "The Newt Somerset – legendary evening atmosphere" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg", alt: "Festoon walkways and alfresco chill-out zone" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741340/_F4R3275_tukoww.jpg", alt: "Festival vibe – Edison festoon and fairy lights" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163720/A-Big-Lazer-e1430894875463_xgpiil.jpg", alt: "After-party energy – dynamic dance floor lighting" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163596/STYLISH-babs-july2016_ria-mishaal-photography_006_qmds40.jpg", alt: "Babington House – intimate uplighting and pin-spotted tables" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg", alt: "Reception – warm glow that makes floral arrangements pop" },
];

// Lighting Personas – couples "find themselves"
const lightingPersonas = [
  {
    icon: Heart,
    title: "The Modern Romance",
    description: "Soft, layered uplighting and pin-spotted tables that make floral arrangements pop.",
    vibe: "Intimate, editorial, candle-lit",
  },
  {
    icon: Sun,
    title: "The Festival Vibe",
    description: "Festoon walkways, outdoor chill-out zones, and architectural washes on trees and ruins.",
    vibe: "Alfresco, magical, festival energy",
  },
  {
    icon: Music2,
    title: "The After-Party",
    description: "Dynamic, club-style moving heads that sync with the music (and definitely don't look like a school disco).",
    vibe: "Energy, movement, sophisticated nightclub",
  },
];

// Vibe Gallery Table – Choose Your Mood
const vibeTable = [
  {
    mood: "Intimacy",
    approach: "Warm LED Uplighting",
    result: "A cozy, candle-lit glow that makes huge rooms feel personal.",
  },
  {
    mood: "Drama",
    approach: "Texture Projection",
    result: "Patterned light that turns blank walls into works of art.",
  },
  {
    mood: "Energy",
    approach: "Intelligent Dancefloor Lighting",
    result: "Lighting that moves with the beat, not against it.",
  },
];

const westCountryAreas = ["Somerset", "Wiltshire", "Dorset", "Gloucestershire", "Bath", "Bristol", "Devon"];

export default function WeddingLightingDemoClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Demo notice bar */}
      <div className="bg-champagne-gold/20 border-b border-champagne-gold/40 py-2 px-4 text-center text-sm text-champagne-gold">
        <span className="font-medium">Atmosphere-first demo</span>
        {" · "}
        <Link href="/weddings/wedding-lighting/" className="underline hover:no-underline">
          View current page
        </Link>
      </div>

      {/* Hero – Before & After hook */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            className="object-cover brightness-[0.75]"
            priority
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-gray-950" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-36 md:pt-44"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Lighting is the difference between a room and a vibe.
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
            Most venues look great during the day. We make sure they look legendary when the sun goes down. No harsh house lights, no boring setups—just bespoke design that guides the party from &quot;I Do&quot; to the early hours.
          </p>
        </motion.div>
      </section>

      {/* Lighting Personas – Find Yourself */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Find Your Vibe</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We don&apos;t just do barns and marquees—we design atmospheres. Which one sounds like you?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lightingPersonas.map((persona, i) => (
              <motion.div
                key={persona.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border-champagne-gold/30 hover:border-champagne-gold/50 transition-all h-full">
                  <CardContent className="p-8">
                    <persona.icon className="w-12 h-12 text-champagne-gold mb-6" />
                    <h3 className="text-xl font-bold mb-2">{persona.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">{persona.description}</p>
                    <span className="text-champagne-gold/80 text-sm font-medium">{persona.vibe}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Truth About Your Venue */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8">The Truth About Your Venue</h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
              You&apos;ve spent a fortune on the flowers, the dress, and the tablescapes. If you rely on the venue&apos;s standard &quot;dimmer switch,&quot; half that detail disappears by 8:00 PM.
            </p>
            <p className="text-xl font-semibold text-champagne-gold">
              We use lighting to highlight what matters and hide what doesn&apos;t.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vibe Gallery Table – Choose Your Mood */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">Choose Your Mood</h2>
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-champagne-gold/50">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">If you want...</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">We use...</th>
                  <th className="text-left py-4 px-4 text-champagne-gold font-semibold">The Result</th>
                </tr>
              </thead>
              <tbody>
                {vibeTable.map((row, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-5 px-4 font-medium">{row.mood}</td>
                    <td className="py-5 px-4 text-gray-300">{row.approach}</td>
                    <td className="py-5 px-4 text-gray-200 italic">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Gallery – evocative imagery */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Atmosphere</h2>
          <p className="text-gray-400 text-lg">South West weddings, legendary evenings.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryPhotos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* West Country – Service Area + CTA */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 border-champagne-gold/30 backdrop-blur">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-8">
                  <MapPin className="w-10 h-10 text-champagne-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Serving the South West</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Based in Somerset and the Cotswolds. We illuminate weddings across Somerset, Wiltshire, Dorset, Gloucestershire, Bath, Bristol, and Devon.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {westCountryAreas.map((area) => (
                        <span
                          key={area}
                          className="px-4 py-2 bg-white/5 text-gray-300 rounded-full text-sm border border-white/10"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-4">Reach out to Nigel or Ali directly:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:+447970793177"
                      className="flex items-center justify-center gap-3 bg-champagne-gold text-black font-bold py-3 px-6 rounded-lg hover:bg-gold-light transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      07970 793177
                    </a>
                    <Button asChild variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                      <Link href="/contact-us/">Inquire Online</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryPhotos.map((p) => ({ src: p.src, alt: p.alt }))}
        render={{
          buttonPrev: () => <ChevronLeft className="w-8 h-8 text-white" />,
          buttonNext: () => <ChevronRight className="w-8 h-8 text-white" />,
        }}
      />
    </div>
  );
}
