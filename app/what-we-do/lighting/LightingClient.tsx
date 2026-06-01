"use client";

import { motion } from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";
import HorizontalImageCarousel from "@/components/HorizontalImageCarousel";
import type { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Home,
  Lightbulb,
  Music2,
  Sparkles,
  Sun,
  Trees,
} from "lucide-react";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const HERO_IMAGE =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162978/ITALLIAN-VILLA-02_jgy3tx.jpg";

const lightingPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg",
    width: 1200,
    height: 900,
    alt: "Soft amber lighting for dinner before the party begins",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    width: 1200,
    height: 900,
    alt: "Barn reception with fairy-light canopy and mirror ball over a packed dancefloor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
    width: 1200,
    height: 900,
    alt: "Dancefloor lighting and production at Babington House after dark",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg",
    width: 1200,
    height: 900,
    alt: "Evening reception with warm ambient light across the dining room",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768734499/Jade-and-Emma-0059-1_wddnet.jpg",
    width: 1200,
    height: 900,
    alt: "Mirror ball shimmer over a wedding dancefloor at Babington House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162978/ITALLIAN-VILLA-02_jgy3tx.jpg",
    width: 1200,
    height: 900,
    alt: "Warm uplighting around an Italian villa exterior after dark",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    width: 1200,
    height: 900,
    alt: "Mirror ball clusters over a packed dancefloor",
  },
];

const experienceSections = [
  {
    Icon: Sun,
    title: "Arrival",
    copy: "First impressions, entrances, pathways and exterior lighting — fairy-light tunnels, lit routes and a welcome that already feels considered before guests reach the room.",
  },
  {
    Icon: Lightbulb,
    title: "Dining",
    copy: "Warm uplighting, table atmosphere, architectural lighting and a soft ambient glow — the kind of atmospheric lighting that flatters florals, faces and the room itself.",
  },
  {
    Icon: Sparkles,
    title: "Transition",
    copy: "How lighting helps a space move from dinner to party — dimming the formality, lifting energy gradually and preparing the room for celebration without a jarring switch.",
  },
  {
    Icon: Music2,
    title: "Celebration",
    copy: "Dancefloor lighting, mirror balls, moving heads and controlled energy — club-standard when the brief suits, never tacky, always timed to how the room actually feels.",
  },
  {
    Icon: Trees,
    title: "After Dark",
    copy: (
      <>
        Terraces, courtyards, tree lighting, festoon and outdoor spaces that stay connected to the
        event — including{" "}
        <Link href="/services/fire-pit-hire/" className={linkClass}>
          fire pits
        </Link>{" "}
        and exterior washes so the party does not end at the door.
      </>
    ),
  },
];

const pathwayCards: Array<{
  Icon: typeof Home;
  title: string;
  copy: string;
  href: string;
  cta: string;
}> = [
  {
    Icon: Sparkles,
    title: "Wedding Lighting Design",
    copy: "For couples planning wedding uplighting, fairy-light canopies, festoon, dancefloor lighting and venue transformation.",
    href: "/weddings/wedding-lighting/",
    cta: "Plan wedding lighting",
  },
  {
    Icon: Music2,
    title: "Party Lighting",
    copy: "For private parties, birthdays, corporate celebrations, garden parties, courtyard lighting, mirror balls and dancefloor lighting.",
    href: "/parties/party-lighting/",
    cta: "Plan party lighting",
  },
  {
    Icon: Home,
    title: "Venue Styling & Transformation",
    copy: "For styling, finishing touches, table styling, backdrops, fire pits and lighting planned as one visual story.",
    href: "/services/venue-styling/",
    cta: "Discuss venue styling",
  },
  {
    Icon: Building2,
    title: "Private Event Production",
    copy: "For clients who want creative direction, lighting, DJs, styling and production managed together.",
    href: "/party-planning-and-organising/",
    cta: "Private event production",
  },
];

export default function LightingClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt="Warm uplighting around an Italian villa exterior after dark"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/55 to-gray-950/90" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-56 pb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            The Art of the Atmosphere
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto px-4 drop-shadow-md leading-relaxed mb-8">
            A lighting inspiration gallery showing how we use uplighting, festoon, fairy lights,
            mirror balls and exterior lighting to transform weddings, parties and events after dark.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center items-center max-w-3xl mx-auto">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90"
            >
              <Link href="/weddings/wedding-lighting/">Wedding Lighting Design</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 backdrop-blur-sm"
            >
              <Link href="/parties/party-lighting/">Party Lighting</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold/60 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Link href="/party-planning-and-organising/">Private Event Production</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold/60 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Link href="/contact-us/">Check Availability</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <div
        style={{
          background:
            "radial-gradient(circle at center, rgb(17 24 39) 0%, rgb(3 7 18) 50%, rgb(2 6 23) 100%)",
        }}
      >
        {/* Gallery */}
        <section className="py-16 px-4 bg-gray-950/40 border-b border-champagne-gold/10">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 text-center"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-4">
                Lighting Inspiration Gallery
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed mb-2">
                Use this page for inspiration. When you are ready to plan, choose the page that
                matches your event.
              </p>
              <p className="text-sm text-gray-400 max-w-xl mx-auto px-4">
                Dining rooms, dancefloors, courtyards, terraces, trees and outdoor spaces — venue
                lighting ideas from twenty years of events after dark.
              </p>
            </motion.div>
            <div className="flex justify-center">
              <HorizontalImageCarousel
                images={lightingPhotos}
                aspectRatio="wide"
                showDots
                autoplayMs={5000}
              />
            </div>
          </div>
        </section>

        {/* Why Lighting Matters */}
        <section className="py-16 px-3 sm:px-4 lg:px-8 border-b border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Why Lighting Matters
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                Most venues look beautiful during the day. The challenge begins after sunset.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Lighting changes how a room feels, how guests move through a space and how different
                parts of an event connect together.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From warm dining rooms and candlelit terraces to packed dancefloors and illuminated
                trees, the right lighting helps shape the atmosphere long before anyone notices the
                fixtures themselves.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Experience-led sections */}
        <section className="py-20 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                How Lighting Shapes The Evening
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Not equipment categories — guest experience. The same uplighting, festoon, fairy
                lights and mirror balls feel different depending on where you are in the night.
              </p>
            </motion.div>
            <div className="space-y-4">
              {experienceSections.map(({ Icon, title, copy }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 rounded-xl bg-gray-900/70 border border-champagne-gold/15"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-champagne-gold/10 border border-champagne-gold/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-champagne-gold font-bold mb-2">{title}</h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Choose The Right Lighting Page */}
        <section className="py-20 px-3 sm:px-4 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Choose The Right Lighting Page
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                This gallery is designed to inspire. These pages help you plan the right lighting
                for your event — wedding lighting design, party lighting and venue styling each have
                their own path.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pathwayCards.map(({ Icon, title, copy, href, cta }) => (
                <Card
                  key={title}
                  className="bg-gray-900/70 border border-champagne-gold/20 hover:border-champagne-gold/40 transition-colors"
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <Icon className="w-8 h-8 text-champagne-gold mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">{copy}</p>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-2 text-champagne-gold font-semibold text-sm hover:text-gold-light transition-colors"
                    >
                      {cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Credibility — brief */}
        <section className="py-16 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-champagne-gold mb-4">
                Less Tech, More Taste
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Twenty years in prestigious venues teaches you that lighting should be felt, not
                just seen — sleek setups, hidden cables and designs tailored to the room, not a
                generic rig.
              </p>
              <p className="text-gray-400 text-sm italic">
                Trusted at{" "}
                <Link href="/venues/babington-house/" className={linkClass}>
                  Babington House
                </Link>{" "}
                and leading estates across the South West and UK-wide.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-3 sm:px-4 lg:px-8 bg-gray-950/50 border-t border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-4">
                Ready to plan your lighting?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Start with the page that matches your event — or{" "}
                <Link href="/contact-us/" className={linkClass}>
                  get in touch
                </Link>{" "}
                if you are not sure where to begin.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90"
                >
                  <Link href="/weddings/wedding-lighting/">Wedding Lighting</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                >
                  <Link href="/parties/party-lighting/">Party Lighting</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-h-[48px] border-champagne-gold/60 text-white hover:bg-white/10"
                >
                  <Link href="/contact-us/">Check Availability</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
