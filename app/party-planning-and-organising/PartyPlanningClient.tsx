"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WaveDivider from "@/components/WaveDivider";
import { Calendar, Users, Sparkles, CheckCircle2, Video, Lightbulb, Music2, Award } from "lucide-react";

const partyPlanningPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    width: 1200,
    height: 900,
    alt: "Professional party planning and event organization at Kin House with elegant mirrorball clusters and sophisticated lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg",
    width: 1200,
    height: 900,
    alt: "Complete party planning service at Kings Weston House with professional lighting design and event coordination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party planning and organization with professional event management and entertainment coordination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163790/Party-dj-with-lazer_wnhreb.jpg",
    width: 1200,
    height: 900,
    alt: "Full party planning service including DJ entertainment, lighting, and complete event coordination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Marquee party planning with professional lighting installation and complete event styling",
  },
];

export default function PartyPlanningClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163267/IMG_0740_rcczi9.jpg"
            alt="Professional party planning and event organization services"
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
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Professional Party Planning & Event Organization
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Bespoke celebrations in Somerset, Wiltshire, and the West Country
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <WaveDivider />
        </div>
      </section>

      {/* Content */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        {/* Introduction */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* 20 Years of Excellence Badge */}
              <div className="absolute -top-4 -right-4 md:-right-8 z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-champagne-gold to-gold-dark border-4 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.5)] flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-black">20</div>
                    <div className="text-xs md:text-sm font-semibold text-black">Years</div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-champagne-gold/30 animate-ping opacity-20"></div>
                </motion.div>
              </div>

              <div className="text-center mb-12 relative">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                  Stress-Free Event Planning
                </h2>
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-6 max-w-3xl mx-auto">
                  Planning a party or event can be overwhelming, but it doesn&apos;t have to be. With over 20 years of experience creating unforgettable celebrations, we offer complete party planning and event organization services that handle every detail, so you can relax and enjoy your own event.
                </p>
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                  From intimate gatherings to grand celebrations, we work closely with you to understand your vision and bring it to life with professional expertise, attention to detail, and seamless coordination.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Planning Pillars Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card className="bg-white/5 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                  <h3 className="text-xl font-bold text-white mb-3">Event Coordination</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Complete timeline management and day-of coordination to ensure everything runs smoothly
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                  <h3 className="text-xl font-bold text-white mb-3">Supplier Management</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Coordinate with all suppliers including caterers, florists, photographers, and venues
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                  <h3 className="text-xl font-bold text-white mb-3">Design & Styling</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Create cohesive design themes and styling that reflects your personal vision
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                  <h3 className="text-xl font-bold text-white mb-3">Full Service</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Entertainment, lighting, styling, and production all managed under one roof
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 px-4 bg-gray-950/50">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <ImageCarousel images={partyPlanningPhotos} />
            </motion.div>
          </div>
        </section>

        {/* The Process - Z-Pattern Layout */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                The Process
              </h2>
            </motion.div>

            {/* Section 1: The Vision (Consultation) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row items-center gap-8"
            >
              <div className="flex-1 relative h-80 lg:h-96 rounded-lg overflow-hidden border border-champagne-gold/30">
                <Image
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163267/IMG_0740_rcczi9.jpg"
                  alt="Initial consultation meeting for event planning"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <Card className="flex-1 bg-white/5 backdrop-blur-md border-champagne-gold/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="h-6 w-6 text-champagne-gold" />
                    <CardTitle className="text-white">The Vision (Consultation)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    Every extraordinary event begins with understanding your vision. Through comprehensive consultations, we explore your ideas, preferences, and goals to create a bespoke plan that reflects your unique style.
                  </p>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Comprehensive event consultation to understand your vision</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Budget planning and cost management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Venue selection and site visits</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 2: The Design (Production) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row-reverse items-center gap-8"
            >
              <div className="flex-1 relative h-80 lg:h-96 rounded-lg overflow-hidden border border-champagne-gold/30">
                <Image
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg"
                  alt="Lighting design and production setup in progress"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <Card className="flex-1 bg-white/5 backdrop-blur-md border-champagne-gold/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="h-6 w-6 text-champagne-gold" />
                    <CardTitle className="text-white">The Design (Production)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    From concept to reality, we transform your vision into a meticulously planned production. Our technical expertise ensures every element—from lighting design to sound systems—is perfectly orchestrated.
                  </p>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Lighting design and installation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Sound system setup and management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Venue styling and decoration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 3: The Night (Execution) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row items-center gap-8"
            >
              <div className="flex-1 relative h-80 lg:h-96 rounded-lg overflow-hidden border border-champagne-gold/30">
                <Image
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg"
                  alt="Party in full swing with flawless execution"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <Card className="flex-1 bg-white/5 backdrop-blur-md border-champagne-gold/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Music2 className="h-6 w-6 text-champagne-gold" />
                    <CardTitle className="text-white">The Night (Execution)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    On the day, our experienced team executes every detail flawlessly. With seamless coordination and dedicated on-site management, you can relax and enjoy your celebration while we handle everything behind the scenes.
                  </p>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Day-of event coordination and management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Supplier liaison and coordination</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Problem-solving and on-the-day support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/20 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <CardContent className="p-8 sm:p-12 text-center">
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    Ready to Plan Your Perfect Event?
                  </h3>
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                    Let us take the stress out of planning your celebration. Contact us today to discuss your event and discover how we can make it truly unforgettable.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)] mb-4"
                  >
                    <Link href="/contact-us">Request an Event Proposal</Link>
                  </Button>
                  <p className="text-gray-300 text-sm mt-6">
                    Not sure where to start?{" "}
                    <Link
                      href="/babington-wedding-info"
                      className="text-champagne-gold hover:text-gold-light underline"
                    >
                      View our Venue Guides
                    </Link>
                    {" "}(Babington, Kin House, Mells).
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
