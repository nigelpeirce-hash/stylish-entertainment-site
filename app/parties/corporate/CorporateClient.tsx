"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Lightbulb, Users, Shield, FileCheck, ClipboardCheck, Award } from "lucide-react";

const corporatePhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/DJ-Decks_mlezxe.jpg",
    width: 1200,
    height: 900,
    alt: "Professional DJ decks setup for corporate entertainment at a high-end corporate event",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/IMG_2048_vpuugy.jpg",
    width: 1200,
    height: 900,
    alt: "Corporate event with professional entertainment, lighting, and sophisticated atmosphere",
  },
];

// Logo Marquee Component
const LogoMarquee = () => {
  const logos = [
    { name: "Aston Martin", placeholder: "AM" },
    { name: "Red Bull", placeholder: "RB" },
    { name: "Sony", placeholder: "Sony" },
    { name: "Tesco", placeholder: "Tesco" },
    { name: "Sotheby's", placeholder: "Sotheby's" },
    { name: "Orange", placeholder: "Orange" },
    { name: "T-Mobile", placeholder: "T-Mobile" },
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden bg-gray-950/50 border-y border-champagne-gold/20 py-8">
      <div className="flex animate-marquee whitespace-nowrap">
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="mx-12 flex items-center justify-center h-16 px-8 border border-champagne-gold/20 rounded-lg bg-white/5 backdrop-blur-sm"
          >
            <span className="text-gray-300 font-semibold text-lg tracking-wider">{logo.placeholder}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default function CorporateClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/ABS-Preview-50-percent0006_c51xsl.jpg"
            alt="Professional corporate event with sophisticated entertainment and lighting"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/60 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Corporate Event Production & Entertainment
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Professional entertainment that elevates your brand and leaves a lasting impression
          </p>
        </motion.div>
      </section>

      {/* Trusted By Logo Marquee */}
      <LogoMarquee />

      {/* Content */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        {/* Introduction */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                Elevate your corporate events to new heights with our roster of talented DJs, curated specifically for corporate entertainment. Whether you&apos;re hosting a gala, conference, product launch, or team-building event, our skilled DJs will set the perfect tone to enhance your company&apos;s brand and message.
              </p>
            </motion.div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300">
                <CardHeader>
                  <Volume2 className="w-10 h-10 text-champagne-gold mb-4" />
                  <CardTitle className="text-white">Professional Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    State-of-the-art sound systems and professional audio engineering ensure crystal-clear sound quality that matches the prestige of your brand. From intimate boardroom presentations to grand ballroom celebrations.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300">
                <CardHeader>
                  <Lightbulb className="w-10 h-10 text-champagne-gold mb-4" />
                  <CardTitle className="text-white">Intelligent Lighting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Dynamic lighting designs that enhance your brand identity. Programmable LED systems, architectural uplighting, and atmospheric mood lighting that adapts to every moment of your event.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300">
                <CardHeader>
                  <Users className="w-10 h-10 text-champagne-gold mb-4" />
                  <CardTitle className="text-white">Curated Talent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Expertly selected DJs, live musicians, and entertainment acts who understand corporate culture. Professional, adaptable, and skilled at reading the room to deliver the perfect atmosphere.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Brand Narrative & Featured Package - Split Layout */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Brand Narrative */}
              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Award className="w-6 h-6 text-champagne-gold" />
                    Trusted by Leading Brands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    We supply entertainment to many corporate events, working with brands such as <span className="font-semibold text-champagne-gold">Aston Martin, Red Bull, Tesco, Orange, T-Mobile, Direct Wines, Top Shop, Sotheby&apos;s, Sony</span> and many more.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    Our reputation for reliability, professionalism, and exceptional service means you can focus on your guests while we handle every detail of your corporate event production.
                  </p>
                </CardContent>
              </Card>

              {/* Featured Package */}
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Users className="w-6 h-6 text-champagne-gold" />
                    Featured Package
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="text-xl font-bold text-champagne-gold mb-3">
                    Festival Trio: DJ, Sax & Bongos
                  </h4>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    A popular option that brings a slice of Glastonbury festival to your corporate event. Our dynamic trio combines professional DJ mixing with live saxophone and bongo percussion, creating an energetic and unique entertainment experience.
                  </p>
                  <p className="text-gray-300 text-sm">
                    Perfect for product launches, team celebrations, and brand events where you want to make a memorable impact.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950/50">
          <div className="container mx-auto max-w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <ImageCarousel images={corporatePhotos} />
            </motion.div>
          </div>
        </section>

        {/* Peace of Mind Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-6 w-6 text-champagne-gold" />
                    <CardTitle className="text-white">Peace of Mind</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Full £10m Public Liability Insurance</h4>
                        <p className="text-gray-300 text-sm">Comprehensive coverage for your complete peace of mind.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileCheck className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">PAT Testing Certified</h4>
                        <p className="text-gray-300 text-sm">All equipment is tested and certified to the highest safety standards.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ClipboardCheck className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Detailed RAMS</h4>
                        <p className="text-gray-300 text-sm">Comprehensive Risk Assessment Method Statements for every event.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Professional Grade Technical Riders</h4>
                        <p className="text-gray-300 text-sm">Detailed technical specifications and requirements for seamless integration.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Ready to Elevate Your Corporate Event?
                  </h3>
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                    Let us create a bespoke production package that perfectly aligns with your brand and objectives. Contact us to discuss your corporate event requirements.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <Button
                      asChild
                      size="lg"
                      className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    >
                      <Link href="/contact-us">Request a Corporate Proposal</Link>
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
                  <p className="text-gray-400 text-sm">
                    Or email us at{" "}
                    <a
                      href="mailto:info@stylishentertainment.co.uk"
                      className="text-champagne-gold hover:text-gold-light underline"
                    >
                      info@stylishentertainment.co.uk
                    </a>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
