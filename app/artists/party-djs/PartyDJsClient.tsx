"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Music, Speaker, Mic, Disc, Music2, Shield, CheckCircle } from "lucide-react";
import WaveDivider from "@/components/WaveDivider";

/** FAQ section loaded below the fold to reduce initial JS/CSS and improve LCP */
const PartyDJsFAQ = dynamic(() => import("./PartyDJsFAQ"), {
  ssr: true,
  loading: () => (
    <div className="min-h-[320px] flex items-center justify-center text-gray-400">Loading…</div>
  ),
});

const features = [
  {
    icon: Speaker,
    title: "Premium Sound",
    description: "Crystal-clear audio with state-of-the-art sound systems",
  },
  {
    icon: Mic,
    title: "Wireless Microphones",
    description: "Professional wireless mics for speeches and announcements",
  },
  {
    icon: Disc,
    title: "Professional Equipment",
    description: "Top-tier DJ equipment and seamless mixing technology",
  },
  {
    icon: Music2,
    title: "Music Consultation",
    description: "Personalized playlist creation and music consultation",
  },
  {
    icon: Music,
    title: "MC Services",
    description: "Professional MC services available for your event",
  },
  {
    icon: CheckCircle,
    title: "Extended Performance",
    description: "Extended performance times available upon request",
  },
  {
    icon: CheckCircle,
    title: "Early Setup",
    description: "Early setup to minimize disruption to your event",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Fully insured and PAT tested equipment for peace of mind",
  },
];

export default function PartyDJsClient() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768163790/Party-dj-with-lazer_wnhreb.jpg"
            alt="Party DJ with laser lighting effects creating a vibrant and energetic dance floor atmosphere"
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-800" />
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            DJ Services
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Professional DJ services with state-of-the-art equipment and seamless mixing
          </p>
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <WaveDivider />
        </div>
      </section>

      {/* Service Details */}
      <section 
        className="py-20 px-4"
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Music className="h-8 w-8 text-champagne-gold" aria-hidden />
                <h2 className="text-3xl md:text-4xl text-white font-semibold leading-none tracking-tight">Professional DJ Services</h2>
              </div>
              <p className="text-lg text-gray-200">
                Transform your wedding reception with our professional DJ services. We bring state-of-the-art equipment, seamless mixing, and an unparalleled ability to read the crowd and keep your guests dancing all night long.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Feature Grid */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6">What We Offer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                      >
                        <Card className="bg-gray-900/50 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/60 transition-all h-full">
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="p-2 bg-champagne-gold/20 rounded-lg flex-shrink-0">
                              <Icon className="h-5 w-5 text-champagne-gold" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-1">{feature.title}</h4>
                              <p className="text-sm text-gray-200">{feature.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Peace of Mind Section */}
              <div className="pt-6 border-t border-champagne-gold/20">
                <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-champagne-gold/20 rounded-lg flex-shrink-0">
                      <Shield className="h-8 w-8 text-champagne-gold" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Peace of Mind</h4>
                      <p className="text-gray-200 leading-relaxed">
                        <strong>Fully Insured:</strong> Stylish Entertainment carries £10 million public liability insurance, meeting the requirements of premium venues like Babington House.
                      </p>
                      <p className="text-gray-200 leading-relaxed mt-2">
                        <strong>PAT Tested Equipment:</strong> All our equipment is regularly PAT tested to ensure safety and compliance with venue standards.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Buttons */}
              <div className="pt-6 border-t border-champagne-gold/20 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <Link href="/artists/djs" aria-label="Meet our DJs and view their profiles">Meet Our DJs</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                  <Link href="/contact-us/" aria-label="Check availability and send an enquiry">Check Availability</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section – dynamic to reduce initial JS/CSS and improve LCP */}
      <section
        className="py-20 px-4"
        style={{
          background:
            "radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)",
        }}
      >
        <div className="container mx-auto max-w-4xl">
          <PartyDJsFAQ />
        </div>
      </section>

      {/* CTA */}
      <section 
        className="pt-20 pb-8 px-4"
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to book your perfect DJ?
            </h3>
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <Link href="/contact-us/" aria-label="Get in touch to book your DJ">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
