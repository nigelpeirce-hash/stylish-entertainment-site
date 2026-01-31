"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const VIBE_TILES = [
  {
    id: "dj",
    headline: "The Anti-Cheesy DJ",
    vibe: "No cringey banter, no \"Macarena,\" just incredible mixing and a packed floor. Career DJs who have held residencies at places like Babington House for 20+ years.",
    buttonText: "Meet the DJs",
    href: "/wedding-dj/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg",
    imageAlt: "Hedsor House dance floor with DJ and sax – sophisticated wedding entertainment",
  },
  {
    id: "musicians",
    headline: "Live Musicians & Sax",
    vibe: "Elevate the energy. Whether it's a soulful acoustic duo for your ceremony or a high-octane Sax and Bongos player to jam alongside your DJ.",
    buttonText: "Explore Live Music",
    href: "/artists/musicians/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163839/Jade-and-Emma-0062_fz8ujk.jpg",
    imageAlt: "Live musicians performing at a wedding, showcasing saxophone and percussion",
  },
  {
    id: "lighting",
    headline: "Bespoke Lighting Design",
    vibe: "Lighting is the difference between a \"room\" and a \"vibe.\" We transform barns, marquees, and estates into Instagram-worthy masterpieces.",
    buttonText: "See the Glow",
    href: "/weddings/wedding-lighting/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg",
    imageAlt: "Fairy light tunnel – luxury wedding lighting transforming a venue",
  },
  {
    id: "extras",
    headline: "Fire-Pits & Styling",
    vibe: "For the moments off the dancefloor. Professional-grade fire-pit hire and venue styling that ties the whole aesthetic together.",
    buttonText: "View Extras",
    href: "/services/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163596/STYLISH-babs-july2016_ria-mishaal-photography_006_qmds40.jpg",
    imageAlt: "Babington House – fire pit and atmospheric wedding styling",
  },
];

const VENUE_PROOF = [
  { name: "Babington House", url: "https://www.sohohouse.com/houses/babington-house" },
  { name: "The Newt in Somerset", url: "https://www.thenewtinsomerset.com/" },
  { name: "Euridge Manor", url: null },
];

export default function WeddingEntertainmentClient() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163781/Emma-Conrad-2-9-23-682_utvftj.jpg"
            alt="Emma and Conrad's wedding with professional entertainment, elegant lighting design, and beautiful wedding atmosphere captured by The Falkenburgs Photography"
            fill
            className="object-cover object-center brightness-75"
            style={{ objectPosition: "center center" }}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-gray-950" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Wedding Entertainment
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Creating amazing memories with entertainment, styling and production
          </p>
        </motion.div>
      </section>

      {/* Choose Your Vibe – 4-tile grid */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Vibe</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              DJs, musicians, lighting, fire-pits—everything you need for a STYLISH celebration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {VIBE_TILES.map((tile, index) => (
              <motion.div
                key={tile.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={tile.href} className="block group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all duration-300">
                    <Image
                      src={tile.image}
                      alt={tile.imageAlt}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                        {tile.headline}
                      </h3>
                      <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-2 drop-shadow-md">
                        {tile.vibe}
                      </p>
                      <span className="inline-flex items-center gap-2 text-champagne-gold font-semibold group-hover:gap-3 transition-all">
                        {tile.buttonText}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Gold Standard – Venue proof */}
      <section className="py-16 px-4 md:px-8 bg-gray-900/50 border-y border-champagne-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-champagne-gold tracking-widest uppercase mb-4"
          >
            The Gold Standard
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-200"
          >
            Preferred suppliers at{" "}
            {VENUE_PROOF.map((v, i) => (
              <span key={v.name}>
                {v.url ? (
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-champagne-gold hover:text-gold-light underline transition-colors"
                  >
                    {v.name}
                  </a>
                ) : (
                  <span className="text-champagne-gold">{v.name}</span>
                )}
                {i < VENUE_PROOF.length - 1 ? ", " : "."}
              </span>
            ))}
          </motion.p>
        </div>
      </section>
    </div>
  );
}
