"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Music, Users, Calendar } from "lucide-react";

const christmasPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party with mirror ball clusters and festive lighting creating a magical holiday atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Festive marquee with warm lighting and Christmas decorations for a holiday celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163791/Edison-Vintage-Festoon-on-a-hot-night_qlolnk.jpg",
    width: 1200,
    height: 900,
    alt: "Vintage festoon lighting creating a warm and inviting atmosphere for Christmas parties",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162291/Pennard-House-Lighting-with-Amber-Up-lighting_ztldmo.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant venue with amber uplighting perfect for sophisticated Christmas celebrations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162638/IMG_6124_reoaew.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party celebration with professional lighting and festive atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162642/Kilver-Court-3_yyawfu.jpg",
    width: 1200,
    height: 900,
    alt: "Kilver Court venue with elegant Christmas party lighting and sophisticated holiday decorations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162231/IMG_8604_anypjx.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party event with beautiful lighting design and festive entertainment atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162468/IMG_8564_pz0zvq.jpg",
    width: 1200,
    height: 900,
    alt: "Festive Christmas celebration with professional party lighting and elegant venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163055/IMG_8559_mvpels.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party with atmospheric lighting and professional entertainment creating a magical holiday celebration",
  },
];

export default function ChristmasParties() {
  useEffect(() => {
    document.title = "Christmas Parties | Festive Entertainment & Party Planning | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Professional Christmas party planning and entertainment. DJs, lighting, live music, and full event production for unforgettable festive celebrations across the West Country."
      );
    }
  }, []);

  return (
    <div className="relative">
      {/* Festive Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-red-950 via-gray-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 via-transparent to-transparent"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6"
          >
            <Sparkles className="w-16 h-16 mx-auto text-champagne-gold animate-pulse" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            <span className="text-champagne-gold">Christmas</span> Parties
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Festive entertainment and party planning that makes your celebration sparkle
          </p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-800 relative">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-champagne-gold mb-6">
              Make Your Christmas Unforgettable
            </h2>
            <p className="text-white text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              From intimate office parties to grand festive galas, we create magical Christmas celebrations that your guests will remember for years to come. Our expert team handles everything from entertainment and lighting to full event planning and production.
            </p>
          </motion.div>

          {/* Service Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="bg-gradient-to-br from-red-900/20 to-gray-800/50 border-2 border-red-500/30 hover:border-champagne-gold/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Music className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-2">DJs & Music</h3>
                <p className="text-gray-300 text-sm">Professional DJs playing festive hits and party classics</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/20 to-gray-800/50 border-2 border-red-500/30 hover:border-champagne-gold/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-2">Festive Lighting</h3>
                <p className="text-gray-300 text-sm">Magical lighting designs that transform any space</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/20 to-gray-800/50 border-2 border-red-500/30 hover:border-champagne-gold/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-2">Live Entertainment</h3>
                <p className="text-gray-300 text-sm">Bands, singers, and performers for all occasions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/20 to-gray-800/50 border-2 border-red-500/30 hover:border-champagne-gold/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-2">Full Planning</h3>
                <p className="text-gray-300 text-sm">Complete event planning and production services</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-champagne-gold mb-4">
                Complete Christmas Party Solutions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-red-900/10 border-2 border-champagne-gold/30">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <span className="text-3xl">🎄</span>
                    Entertainment Packages
                  </h3>
                  <p className="text-white text-lg leading-relaxed mb-4">
                    Choose from our range of entertainment options including professional DJs, live bands, duos, trios, harpists, singing waiters, and cabaret acts. Our popular <span className="font-semibold text-champagne-gold">festival trio of DJ, sax and bongos</span> brings a unique energy to any Christmas celebration.
                  </p>
                  <p className="text-white text-lg leading-relaxed">
                    Whether you want background music for a sophisticated dinner or a high-energy dance floor, we tailor the entertainment to perfectly match your event&apos;s atmosphere.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-champagne-gold/10 to-red-900/10 border-2 border-champagne-gold/30">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <span className="text-3xl">✨</span>
                    Festive Lighting Design
                  </h3>
                  <p className="text-white text-lg leading-relaxed mb-4">
                    Transform your venue with our bespoke Christmas lighting designs. From warm amber uplighting and fairy light canopies to mirror balls and disco lighting, we create the perfect festive atmosphere.
                  </p>
                  <p className="text-white text-lg leading-relaxed">
                    Our lighting works beautifully in barns, marquees, hotels, and private homes, creating Instagram-worthy moments throughout your celebration.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/20 to-gray-800/50 border-2 border-red-500/30">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <span className="text-3xl">🎁</span>
                    Full Event Planning
                  </h3>
                  <p className="text-white text-lg leading-relaxed mb-4">
                    Let us take the stress out of planning your Christmas party. From initial consultation to event day coordination, we handle every detail to ensure your celebration runs smoothly.
                  </p>
                  <p className="text-white text-lg leading-relaxed">
                    With over 20 years of experience, we understand what makes a successful Christmas event and can guide you through every step of the planning process.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/20 to-gray-800/50 border-2 border-red-500/30">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <span className="text-3xl">🌟</span>
                    Trusted Experience
                  </h3>
                  <p className="text-white text-lg leading-relaxed mb-4">
                    We&apos;ve been creating memorable Christmas celebrations for over two decades, working with prestigious venues including Babington House where we&apos;ve been the sole supplier of entertainment for 20 years.
                  </p>
                  <p className="text-white text-lg leading-relaxed">
                    Our reputation for reliability, professionalism, and exceptional service means you can relax and enjoy your own party, knowing every detail is in expert hands.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <ImageCarousel images={christmasPhotos} />
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-800 via-red-950/20 to-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-r from-red-900/30 via-champagne-gold/20 to-red-900/30 border-2 border-champagne-gold/40 shadow-2xl">
              <CardContent className="p-8 sm:p-12 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block mb-6"
                >
                  <Sparkles className="w-16 h-16 text-champagne-gold" />
                </motion.div>
                <h3 className="text-3xl sm:text-4xl font-bold text-champagne-gold mb-6">
                  Ready to Plan Your Perfect Christmas Party?
                </h3>
                <p className="text-white text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                  Don&apos;t leave your Christmas celebration to chance. Contact us today to discuss your event and let us create a magical experience that your guests will treasure.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="tel:+447970793177"
                    className="inline-block px-10 py-4 bg-champagne-gold text-black font-bold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-110 shadow-xl text-lg"
                  >
                    Call 07970793177
                  </a>
                  <Link
                    href="/contact"
                    className="inline-block px-10 py-4 bg-transparent border-2 border-champagne-gold text-champagne-gold font-bold rounded-lg hover:bg-champagne-gold hover:text-black transition-all duration-300 hover:scale-110 text-lg"
                  >
                    Get in Touch
                  </Link>
                </div>
                <p className="text-champagne-gold/80 text-sm mt-8">
                  Serving Somerset, Wiltshire, Dorset, Devon, Gloucestershire, Bath, Bristol, and beyond
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
