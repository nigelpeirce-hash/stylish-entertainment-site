"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ImagePhoto } from "@/components/ImageCarousel";
import HorizontalImageCarousel from "@/components/HorizontalImageCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeforeAfter from "@/components/BeforeAfter";
import { Button } from "@/components/ui/button";
import WaveDivider from "@/components/WaveDivider";
import { Calendar, Users, Sparkles, CheckCircle2, Video, Lightbulb, Music2, ChevronLeft, ChevronRight } from "lucide-react";

const processSteps = [
  {
    id: "vision",
    title: "The Vision (Consultation)",
    Icon: Video,
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg",
    imageAlt: "Initial consultation meeting for event planning",
    description: "Every extraordinary event begins with understanding your vision. Through comprehensive consultations, we explore your ideas, preferences, and goals to create a bespoke plan that reflects your unique style.",
    bullets: [
      "Comprehensive event consultation to understand your vision",
      "Budget planning and cost management",
      "Venue selection and site visits",
    ],
  },
  {
    id: "design",
    title: "The Design (Production)",
    Icon: Lightbulb,
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733254/Babington-House-in-Green_oms0ws.jpg",
    imageAlt: "Lighting design and production setup in progress",
    description: "From concept to reality, we transform your vision into a meticulously planned production. Our technical expertise ensures every element—from lighting design to sound systems—is perfectly orchestrated.",
    bullets: [
      "Lighting design and installation",
      "Sound system setup and management",
      "Venue styling and decoration",
    ],
  },
  {
    id: "night",
    title: "The Night (Execution)",
    Icon: Music2,
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163815/Highcliffe-Castle-Wedding-2-web_pgsbaa.jpg",
    imageAlt: "Party in full swing with flawless execution",
    description: "On the day, our experienced team executes every detail flawlessly. With seamless coordination and dedicated on-site management, you can relax and enjoy your celebration while we handle everything behind the scenes.",
    bullets: [
      "Day-of event coordination and management",
      "Supplier liaison and coordination",
      "Problem-solving and on-the-day support",
    ],
  },
];

// Before and After – 2-row layout: Barn transformation + Party room transformation (matches galleries)
const beforeAfterTransforms = [
  {
    title: "Barn Transformation",
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163654/IMG_1070_pelq7j.jpg",
      alt: "Barn before transformation - empty space ready for styling and lighting design",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163716/IMG_1098_hqiw3d.jpg",
      alt: "Barn after transformation - elegant outdoor terrace with professional venue styling and festoon lighting",
    },
  },
  {
    title: "Party Room Transformation",
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768753000/IMG_2530_njx41m.jpg",
      alt: "Party room before transformation - empty space ready for styling and lighting design",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768751155/IMG_3188_zviff5.jpg",
      alt: "Party room after transformation - fun and creative party styling with vibrant decorations and lighting design",
    },
  },
];

function ProcessCarousel() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = processSteps[stepIndex];
  const Icon = step.Icon;

  const goPrev = () => setStepIndex((i) => (i === 0 ? processSteps.length - 1 : i - 1));
  const goNext = () => setStepIndex((i) => (i === processSteps.length - 1 ? 0 : i + 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-xl border border-champagne-gold/30 bg-gray-900 shadow-xl"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image - compact aspect */}
        <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-[4/3] shrink-0">
          <Image
            src={step.image}
            alt={step.imageAlt}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={stepIndex === 0}
          />
          {/* Step labels on image */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <span className="text-white/90 text-sm font-medium drop-shadow-lg">
              Step {stepIndex + 1} of {processSteps.length}
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="p-0 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="h-6 w-6 text-champagne-gold shrink-0" />
                <CardTitle className="text-white text-xl md:text-2xl">{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-200 leading-relaxed mb-4">{step.description}</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                {step.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-champagne-gold mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Nav arrows + dots */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-champagne-gold/20">
            <button
              onClick={goPrev}
              className="flex items-center gap-1 text-champagne-gold hover:text-gold-light transition-colors"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Previous</span>
            </button>
            <div className="flex gap-2">
              {processSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStepIndex(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === stepIndex ? "w-8 h-2 bg-champagne-gold" : "w-2 h-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              className="flex items-center gap-1 text-champagne-gold hover:text-gold-light transition-colors"
              aria-label="Next step"
            >
              <span className="text-sm font-medium">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const partyPlanningPhotos: ImagePhoto[] = [
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
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768754478/IMG_2866_zhs5sz.jpg",
    width: 1200,
    height: 900,
    alt: "Professional party planning and event styling creating an extraordinary celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742320/IMG_1871_161201_n88x5z.jpg",
    width: 1200,
    height: 900,
    alt: "Bespoke event organization with lighting design and venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741619/IMG_0487_aoaxho.jpg",
    width: 1200,
    height: 900,
    alt: "Complete party planning from concept to execution in the South West",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768729861/798D06F8-3A1A-464B-B222-219CFFB7888D_1_105_c_leivu1.jpg",
    width: 1200,
    height: 900,
    alt: "Event coordination and styling for memorable celebrations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768649763/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw.jpg",
    width: 1200,
    height: 900,
    alt: "Party planning and organization delivering extraordinary events",
  },
];

export default function PartyPlanningClient() {
  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Hero – LCP: w_1200 + fetchPriority high, preloaded in layout */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden max-w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768754478/IMG_2866_zhs5sz.jpg"
            alt="Professional party planning and event organization services"
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
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
            Bespoke celebrations in Somerset, Wiltshire, and beyond
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <WaveDivider />
        </div>
      </section>

      {/* Before and After – 2-row layout (matches galleries) */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-gray-900 max-w-full overflow-x-hidden">
        <div className="w-full max-w-[1700px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-14 text-center"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Featured</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-3 text-white font-bold">
              Before and After
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Drag the slider or click anywhere to compare
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-16">
            {beforeAfterTransforms.map((transform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-2 border-champagne-gold/30 shadow-xl overflow-hidden hover:border-champagne-gold/60 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <BeforeAfter
                      before={transform.before}
                      after={transform.after}
                      aspectRatio="16/9"
                      fullWidth
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        {/* Introduction */}
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
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
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
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

        {/* Gallery - Horizontal Carousel */}
        <section className="py-16 px-4 bg-gray-950/50 max-w-full overflow-x-hidden">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <HorizontalImageCarousel
                images={partyPlanningPhotos}
                aspectRatio="standard"
                autoplayMs={5000}
                showDots
              />
            </motion.div>
          </div>
        </section>

        {/* The Process - Compact Carousel */}
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
          <div className="container mx-auto max-w-6xl">
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

            <ProcessCarousel />
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
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
                    className="min-h-[48px] h-[48px] sm:h-auto sm:min-h-[48px] bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)] mb-4"
                  >
                    <Link href="/contact-us/" className="flex items-center justify-center min-h-[48px] py-3">Request an Event Proposal</Link>
                  </Button>
                  <p className="text-gray-300 text-sm mt-6">
                    Not sure where to start?{" "}
                    <Link
                      href="/babington-wedding-info/"
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
