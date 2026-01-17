"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Music, Users, Calendar, Lightbulb } from "lucide-react";

const christmasPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party with mirror ball clusters and festive lighting creating a magical holiday atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Festive marquee with warm lighting and Christmas decorations for a holiday celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163791/Edison-Vintage-Festoon-on-a-hot-night_qlolnk.jpg",
    width: 1200,
    height: 900,
    alt: "Vintage festoon lighting creating a warm and inviting atmosphere for Christmas parties",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162291/Pennard-House-Lighting-with-Amber-Up-lighting_ztldmo.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant venue with amber uplighting perfect for sophisticated Christmas celebrations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162638/IMG_6124_reoaew.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party celebration with professional lighting and festive atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162642/Kilver-Court-3_yyawfu.jpg",
    width: 1200,
    height: 900,
    alt: "Kilver Court venue with elegant Christmas party lighting and sophisticated holiday decorations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162231/IMG_8604_anypjx.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party event with beautiful lighting design and festive entertainment atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162468/IMG_8564_pz0zvq.jpg",
    width: 1200,
    height: 900,
    alt: "Festive Christmas celebration with professional party lighting and elegant venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163055/IMG_8559_mvpels.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party with atmospheric lighting and professional entertainment creating a magical holiday celebration",
  },
];

// Snowfall animation component
const Snowflake = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full"
    style={{
      left,
      opacity: 0.3,
    }}
    initial={{ y: -10, opacity: 0 }}
    animate={{
      y: "100vh",
      opacity: [0, 0.3, 0.3, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

const SnowfallAnimation = () => {
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    left: `${Math.random() * 100}%`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((snowflake) => (
        <Snowflake
          key={snowflake.id}
          delay={snowflake.delay}
          duration={snowflake.duration}
          left={snowflake.left}
        />
      ))}
    </div>
  );
};

export default function ChristmasClient() {
  return (
    <div className="relative">
      {/* Snowfall Animation */}
      <SnowfallAnimation />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-transparent to-transparent"></div>
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
            <div className="relative inline-block">
              <Sparkles className="w-16 h-16 mx-auto text-champagne-gold" />
              <motion.div
                className="absolute inset-0 bg-champagne-gold/20 rounded-full blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Winter Celebrations & <span className="text-champagne-gold">Christmas Galas</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            High-end luxury entertainment for unforgettable seasonal celebrations
          </p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 relative"
        style={{
          background: 'radial-gradient(circle at center, rgb(17 24 39) 0%, rgb(3 7 18) 50%, rgb(2 6 23) 100%)'
        }}
      >
        <div className="container mx-auto max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Make Your Christmas Unforgettable
            </h2>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              From intimate office parties to grand festive galas, we create magical Christmas celebrations that your guests will remember for years to come. Our expert team handles everything from entertainment and lighting to full event planning and production.
            </p>
          </motion.div>

          {/* Service Features Grid - Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-champagne-gold/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Music className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-2">DJs & Music</h3>
                <p className="text-gray-300 text-sm">Professional DJs playing festive hits and party classics</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-champagne-gold/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-2">Festive Lighting</h3>
                <p className="text-gray-300 text-sm">Magical lighting designs that transform any space</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-champagne-gold/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-2">Live Entertainment</h3>
                <p className="text-gray-300 text-sm">Bands, singers, and performers for all occasions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-champagne-gold/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-2">Full Planning</h3>
                <p className="text-gray-300 text-sm">Complete event planning and production services</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery - Moved Higher */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="container mx-auto max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <ImageCarousel images={christmasPhotos} />
          </motion.div>
        </div>
      </section>

      {/* What We Offer - Z-Pattern Layout */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Complete Christmas Party Solutions
              </h2>
            </div>

            {/* Row 1: Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden border border-champagne-gold/30">
                <Image
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg"
                  alt="Entertainment packages for Christmas parties"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <Music className="w-6 h-6" />
                    Entertainment Packages
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    Choose from our range of entertainment options including professional DJs, live bands, duos, trios, harpists, singing waiters, and cabaret acts. Our popular <span className="font-semibold text-champagne-gold">festival trio of DJ, sax and bongos</span> brings a unique energy to any Christmas celebration.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    Whether you want background music for a sophisticated dinner or a high-energy dance floor, we tailor the entertainment to perfectly match your event&apos;s atmosphere.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Row 2: Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:flex-row-reverse">
              <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden border border-champagne-gold/30 order-2 lg:order-1">
                <Image
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162291/Pennard-House-Lighting-with-Amber-Up-lighting_ztldmo.jpg"
                  alt="Festive lighting design for Christmas parties"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 order-1 lg:order-2">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6" />
                    Festive Lighting Design
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    Transform your venue with our bespoke Christmas lighting designs. From warm amber uplighting and fairy light canopies to mirror balls and disco lighting, we create the perfect festive atmosphere.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    Our lighting works beautifully in barns, marquees, hotels, and private homes, creating Instagram-worthy moments throughout your celebration.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Row 3: Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden border border-champagne-gold/30">
                <Image
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg"
                  alt="Full event planning for Christmas parties"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    Full Event Planning
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    Let us take the stress out of planning your Christmas party. From initial consultation to event day coordination, we handle every detail to ensure your celebration runs smoothly.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    With over 20 years of experience, we understand what makes a successful Christmas event and can guide you through every step of the planning process.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Row 4: Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:flex-row-reverse">
              <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden border border-champagne-gold/30 order-2 lg:order-1">
                <Image
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163679/IMG_3094-1_aiyu5i.jpg"
                  alt="Trusted experience for Christmas celebrations"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 order-1 lg:order-2">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Trusted Experience
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    We&apos;ve been creating memorable Christmas celebrations for over two decades, working with prestigious venues including Babington House where we&apos;ve been the sole supplier of entertainment for 20 years.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    Our reputation for reliability, professionalism, and exceptional service means you can relax and enjoy your own party, knowing every detail is in expert hands.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action - Exclusive Invitation */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 relative"
        style={{
          background: 'radial-gradient(circle at center, rgb(17 24 39) 0%, rgb(3 7 18) 50%, rgb(2 6 23) 100%)'
        }}
      >
        <div className="container mx-auto max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <CardContent className="p-8 sm:p-12 text-center">
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block mb-6"
                >
                  <Sparkles className="w-16 h-16 text-champagne-gold" />
                </motion.div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Ready to Plan Your Perfect Christmas Party?
                </h3>
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                  Don&apos;t leave your Christmas celebration to chance. Request a proposal today and let us create a magical experience that your guests will treasure.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                  >
                    <Link href="/contact-us">Request a Proposal</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300"
                  >
                    <a href="tel:+447970793177">Call 07970793177</a>
                  </Button>
                </div>
                <p className="text-gray-400 text-sm mt-8">
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
