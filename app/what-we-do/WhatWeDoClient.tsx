"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Lightbulb, Palette, Volume2, Sparkles, Music2, Mic, Calendar, Users } from "lucide-react";
import WaveDivider from "@/components/WaveDivider";

const services = [
  {
    title: "Lighting Design",
    description: "Professional lighting design for weddings, parties, and events. Transform any space with our creative lighting solutions.",
    icon: Lightbulb,
    href: "/what-we-do/lighting",
    color: "from-yellow-400/20 to-amber-500/20",
    borderColor: "border-yellow-400/30",
    hoverBorderColor: "hover:border-yellow-400/50",
  },
  {
    title: "Venue Styling",
    description: "Complete venue transformation with elegant styling, decorations, and design that reflects your personal vision.",
    icon: Palette,
    href: "/what-we-do/venue-decoration",
    color: "from-pink-400/20 to-rose-500/20",
    borderColor: "border-pink-400/30",
    hoverBorderColor: "hover:border-pink-400/50",
  },
  {
    title: "Sound Equipment",
    description: "Professional DJ and band sound equipment, sound systems, and audio solutions for any event size.",
    icon: Volume2,
    href: "/what-we-do/equipment-dj-band-sound-kit",
    color: "from-blue-400/20 to-indigo-500/20",
    borderColor: "border-blue-400/30",
    hoverBorderColor: "hover:border-blue-400/50",
  },
  {
    title: "Wedding Lighting",
    description: "Bespoke wedding lighting design creating romantic atmospheres and elegant ambiance for your special day.",
    icon: Sparkles,
    href: "/weddings/wedding-lighting",
    color: "from-purple-400/20 to-violet-500/20",
    borderColor: "border-purple-400/30",
    hoverBorderColor: "hover:border-purple-400/50",
  },
  {
    title: "Party Lighting",
    description: "Dynamic party lighting with mirror balls, festoons, and atmospheric effects for unforgettable celebrations.",
    icon: Sparkles,
    href: "/parties/party-lighting",
    color: "from-orange-400/20 to-red-500/20",
    borderColor: "border-orange-400/30",
    hoverBorderColor: "hover:border-orange-400/50",
  },
  {
    title: "DJ Services",
    description: "Professional DJs with expert mixing, crowd-pleasing playlists, and seamless entertainment for any event.",
    icon: Music2,
    href: "/artists/djs",
    color: "from-green-400/20 to-emerald-500/20",
    borderColor: "border-green-400/30",
    hoverBorderColor: "hover:border-green-400/50",
  },
  {
    title: "Live Musicians",
    description: "Talented musicians including jazz trios, saxophonists, and percussionists to elevate your event.",
    icon: Mic,
    href: "/artists/musicians",
    color: "from-teal-400/20 to-cyan-500/20",
    borderColor: "border-teal-400/30",
    hoverBorderColor: "hover:border-teal-400/50",
  },
  {
    title: "Party Planning",
    description: "Complete event planning and coordination services handling every detail from concept to execution.",
    icon: Calendar,
    href: "/party-planning-and-organising/",
    color: "from-amber-400/20 to-yellow-500/20",
    borderColor: "border-amber-400/30",
    hoverBorderColor: "hover:border-amber-400/50",
  },
];

export default function WhatWeDoClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg"
            alt="Complete event services - lighting, styling, sound, and entertainment"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-32 md:pt-40"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            What We Do
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Complete event services for unforgettable celebrations
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <WaveDivider />
        </div>
      </section>

      {/* Services Grid */}
      <section
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
        className="py-20 px-3 sm:px-4"
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              From lighting design and venue styling to professional DJs and live musicians, we offer comprehensive event services to bring your vision to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={service.href}>
                    <Card className={`bg-gradient-to-br ${service.color} backdrop-blur-md ${service.borderColor} ${service.hoverBorderColor} hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 h-full cursor-pointer group`}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg bg-white/10 ${service.borderColor} border`}>
                            <Icon className={`w-6 h-6 text-white group-hover:scale-110 transition-transform`} />
                          </div>
                          <CardTitle className="text-white text-lg">
                            {service.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-300 text-sm leading-relaxed">
                          {service.description}
                        </CardDescription>
                        <Button
                          variant="ghost"
                          className="mt-4 text-white hover:text-white hover:bg-white/10 w-full"
                          asChild
                        >
                          <span>Learn More →</span>
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-champagne-gold/20 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <CardContent className="p-8 sm:p-12">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Ready to Create Your Perfect Event?
                </h3>
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                  Whether you need lighting, styling, sound equipment, or entertainment, we're here to make your celebration unforgettable.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                >
                  <Link href="/contact-us/">Check Availability</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
