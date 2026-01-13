"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import Gallery, { Photo } from "@/components/Gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Music2 } from "lucide-react";

const musicianPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163609/Harpist_rtzc74.jpg",
    width: 1200,
    height: 900,
    alt: "Professional harpist performing at a wedding, showcasing elegant live wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163839/Jade-and-Emma-0062_fz8ujk.jpg",
    width: 1200,
    height: 900,
    alt: "Live musicians performing at Jade and Emma's wedding, showcasing professional wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163730/Cuban-Brothers-at-Private-Party_iuletb.jpg",
    width: 1200,
    height: 900,
    alt: "The Cuban Brothers performing at a private party, showcasing energetic live wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163688/Nigel-DJ-Babs-House-0008-1_ol2gkr.jpg",
    width: 1200,
    height: 900,
    alt: "DJ Nige performing with live musicians at Babington House, showcasing professional wedding entertainment with DJ, saxophone and percussion",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163656/IMG_3148_owtb29.jpg",
    width: 1200,
    height: 900,
    alt: "Live musicians performing at a wedding reception, showcasing professional wedding entertainment with saxophone and percussion",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163624/The-Cocktail-Trio_mxawmy.jpg",
    width: 1200,
    height: 900,
    alt: "The Cocktail Trio performing at a wedding event, showcasing professional live wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163537/incognito_wyoqx5.jpg",
    width: 1200,
    height: 900,
    alt: "Incognito performing at a wedding event, showcasing professional live wedding entertainment with talented musicians",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163484/IMG_1019_arczyx.jpg",
    width: 1200,
    height: 900,
    alt: "Live musicians performing at a wedding celebration, showcasing professional wedding entertainment with talented performers",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163510/The-Travelling-Hands_fmhulk.png",
    width: 1200,
    height: 900,
    alt: "The Travelling Hands performing at a wedding, showcasing unique live wedding entertainment with talented musicians",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163469/steelband_tq5oip.jpg",
    width: 1200,
    height: 900,
    alt: "Steel band performing at a wedding celebration, showcasing vibrant live wedding entertainment",
  },
];

export default function Musicians() {
  useEffect(() => {
    document.title = "Musicians | Live Wedding Musicians | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Professional live musicians for weddings and events. Harpists, bands, duos, trios, and performers across the West Country including Somerset, Bath, Bristol, Dorset, and Devon."
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163609/Harpist_rtzc74.jpg"
            alt="Professional harpist performing at a wedding, showcasing elegant live wedding entertainment"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Musicians</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Elevate your wedding with our talented musicians and live performers
          </p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <Music2 className="w-12 h-12 text-champagne-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-champagne-gold mb-6">
              Live Music for Your Special Day
            </h2>
            <p className="text-white text-lg md:text-xl leading-relaxed">
              From elegant harpists to energetic bands, our roster of talented musicians brings sophistication and energy to your wedding celebration. Whether you want background music for your ceremony or a high-energy performance for your reception, we have the perfect act for your event.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Gallery photos={musicianPhotos} columns={3} />
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="bg-gray-800/50 border-champagne-gold/30">
              <CardContent className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                  Our Musicians
                </h3>
                <p className="text-white text-base sm:text-lg leading-relaxed mb-4">
                  We offer a diverse range of live entertainment including harpists, bands, duos, trios, singing waiters, and cabaret acts. Our popular festival trio of DJ, sax and bongos brings a unique energy to any celebration.
                </p>
                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Each performer is carefully selected for their professionalism, talent, and ability to create the perfect atmosphere for your event.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-champagne-gold/30">
              <CardContent className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                  Versatile Performances
                </h3>
                <p className="text-white text-base sm:text-lg leading-relaxed mb-4">
                  Whether you need elegant background music for your ceremony, sophisticated entertainment for your drinks reception, or high-energy performances to get your guests dancing, our musicians adapt to your needs.
                </p>
                <p className="text-white text-base sm:text-lg leading-relaxed">
                  We work closely with you to understand your vision and recommend the perfect musical acts to complement your celebration.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to add live music to your celebration?
            </h2>
            <Link
              href="/contact-us"
              className="inline-block px-8 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
