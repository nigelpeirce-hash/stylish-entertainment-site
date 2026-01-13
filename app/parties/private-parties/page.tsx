"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";

const privatePartyPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg",
    width: 1200,
    height: 900,
    alt: "Professional lighting design at Kings Weston House creating an elegant atmosphere for a private party",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163141/IMG_6712-1-e1444841687100_wakppz.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant private party setup with beautiful lighting and sophisticated decor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162844/Orangery1_dpfega.jpg",
    width: 1200,
    height: 900,
    alt: "Orangery venue with stunning party lighting and elegant private party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party with colourful lighting reflecting on the water for a stylish summer celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163299/Nigel-DJ-Babs-House-0009-1_hmbsn3.jpg",
    width: 1200,
    height: 900,
    alt: "DJ Nige performing at Babington House with professional party lighting and entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163181/IMG_6095_fo6lhk.jpg",
    width: 1200,
    height: 900,
    alt: "Private party with atmospheric lighting and elegant decor creating a memorable celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163790/Party-dj-with-lazer_wnhreb.jpg",
    width: 1200,
    height: 900,
    alt: "Party DJ with laser lighting effects creating an energetic dance floor atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163764/IMG_1811_qctvz4.jpg",
    width: 1200,
    height: 900,
    alt: "Private party venue with professional lighting design and elegant party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163673/455_yjyind.jpg",
    width: 1200,
    height: 900,
    alt: "Private party celebration with beautiful lighting and festive atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163670/Light-Curtains_hvgvry.jpg",
    width: 1200,
    height: 900,
    alt: "Light curtains creating a dramatic backdrop for a private party with stunning visual effects",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Stretch marquee with professional party lighting and festoon lights creating a warm evening atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163545/Circus-Tent-interior-for-themed-party-300x200_i1wpfz.jpg",
    width: 1200,
    height: 900,
    alt: "Circus tent interior with themed party lighting and decorations for a unique celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163452/IMG_3390_ezzchl.jpg",
    width: 1200,
    height: 900,
    alt: "Private party with elegant lighting design and sophisticated party atmosphere",
  },
];

export default function PrivateParties() {
  useEffect(() => {
    document.title = "Private Parties | Party Planning & Production | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Full party planning and production services. Creative DJs, bands, entertainment, and beautiful lighting for private parties across Somerset, Wiltshire, Dorset, BANES, Mendip, and Bristol."
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163810/image2_l1hxxx.jpg"
            alt="Private party celebration with professional entertainment, lighting, and party planning"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Private Parties</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Full party planning and production for unforgettable celebrations
          </p>
        </motion.div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-6 text-champagne-gold font-bold">
              Welcome to STYLISH
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Planning a party? We&apos;re here to help. We provide creative DJs, bands, and entertainment, beautiful lighting, and full party planning and production. With years of experience, we offer honest advice to help you create the best event possible.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              We&apos;re trusted by many venues, including <a href="https://www.babingtonhouse.co.uk" target="_blank" rel="noopener noreferrer" className="text-champagne-gold hover:text-gold-light underline">Babington House Hotel</a>, where we&apos;ve created memorable parties for the last 20 years.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed font-semibold text-champagne-gold">
              We offer party planning and production across <span className="text-white">Somerset, Wiltshire, Dorset, BANES, Mendip, and Bristol</span>.
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
            className="flex justify-center"
          >
            <ImageCarousel images={privatePartyPhotos} />
          </motion.div>
        </div>
      </section>

      {/* Text Block Below Gallery - Broken into interesting sections */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            {/* Babington House Highlight Card */}
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">⭐</div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-champagne-gold mb-3">
                      Trusted by the Best
                    </h3>
                    <p className="text-white text-lg leading-relaxed">
                      For over 20 years we have been the sole supplier of entertainment and party production at the legendary <a href="https://www.babingtonhouse.co.uk" target="_blank" rel="noopener noreferrer" className="text-champagne-gold hover:text-gold-light underline font-semibold">Babington House (Soho House & Co)</a> where celebs hang-out and party.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Perfection in Every Detail
                  </h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    We have created hundreds of weddings, parties and events at Babington where every detail has to be perfect. As a company they certainly do not carry any dead wood and we are proud to be part of the Soho House family.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Your Vision, Our Expertise
                  </h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    Whether you want a themed fancy-dress or a stylish Gatsbyesque party, find out how we can help you deliver the best party possible.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-champagne-gold/20 via-yellow-400/20 to-champagne-gold/20 border-2 border-champagne-gold/40">
              <CardContent className="p-6 sm:p-8 text-center">
                <p className="text-white text-lg md:text-xl leading-relaxed mb-6">
                  So please contact us about your party plans on{" "}
                  <a 
                    href="tel:+447970793177" 
                    className="text-champagne-gold hover:text-gold-light underline font-bold text-xl"
                  >
                    07970793177
                  </a>
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-block px-8 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Get in Touch
                  </Link>
                </div>
                <p className="text-champagne-gold font-semibold text-lg mt-6">
                  Regards,<br />
                  <span className="text-white">Ali & Nige</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
