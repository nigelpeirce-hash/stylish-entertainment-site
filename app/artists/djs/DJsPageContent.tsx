"use client";

import dynamic from "next/dynamic";
import { motion } from "@/lib/motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Clock, Sparkles, Music, Shield, Search, Eye, MicOff } from "lucide-react";
import DJRosterSection from "@/components/DJRosterSection";

/** Below-the-fold video gallery – loaded after initial paint to improve LCP/TBT on mobile */
const DJsVideoGallery = dynamic(() => import("./DJsVideoGallery"), {
  ssr: true,
  loading: () => (
    <section className="py-20 px-3 sm:px-4 bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 h-32 animate-pulse rounded-lg bg-gray-800/50" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[9/16] rounded-lg bg-gray-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
});
import YMCACheck from "@/components/YMCACheck";
import { Input } from "@/components/ui/input";
import { getVenuesWeveWorkedAt } from "@/lib/venues-weve-worked-at";
import { getEditorialServiceRegions, EDITORIAL_SERVICE_HEADLINE } from "@/lib/service-areas";
import type { DJCardData } from "@/lib/dj-data";

const allVenues = getVenuesWeveWorkedAt();

const linkClass =
  "text-champagne-gold hover:text-champagne-gold/80 underline underline-offset-2 transition-colors";

const djApartCards = [
  {
    icon: Eye,
    title: "Reading the room",
    copy: "The best DJs watch more than they talk. They notice who is dancing, who is at the bar, when energy is building and when to hold back.",
  },
  {
    icon: Music,
    title: "Music knowledge",
    copy: "Deep crates across decades and genres — not a wedding playlist on shuffle. The right track at the right moment, for mixed-age crowds who want to share the same dancefloor.",
  },
  {
    icon: Clock,
    title: "Energy management",
    copy: "Great parties are built gradually. Knowing when to lift the room, when to let conversation breathe and when to push into peak-time moments.",
  },
  {
    icon: Sparkles,
    title: "Elegant presentation",
    copy: "Discreet setup, polished presence and music that feels curated — wedding DJs and party DJs who fit luxury venues, not novelty acts.",
  },
  {
    icon: Shield,
    title: "Professional production",
    copy: "Sound and lighting planned as one atmosphere — often alongside our wedding lighting and venue styling teams, not a DJ who turns up with a speaker.",
  },
  {
    icon: MicOff,
    title: "Confidence without ego",
    copy: "No mic-hype, no forced interaction, no YMCA. Non-cheesy wedding DJs who let the music do the talking.",
  },
];

const dancefloorFlow = [
  {
    phase: "Arrival music",
    detail:
      "Background that feels considered from the first guest — not silence, not a full dance set. The tone is set long before anyone expects to dance.",
  },
  {
    phase: "Early evening transition",
    detail:
      "As the room fills and speeches finish, energy shifts naturally. Must-plays land at the right moment; the floor begins to gather without being forced.",
  },
  {
    phase: "Peak-time moments",
    detail:
      "When the room is ready, momentum builds — mixed generations on the same floor, energy rising without gimmicks or shouty DJ banter.",
  },
  {
    phase: "Late-night momentum",
    detail:
      "The hours after midnight matter. A packed dancefloor is maintained by judgement, not volume — keeping people who do not want to leave.",
  },
];

const djStyles = [
  {
    name: "DJ Nige",
    slug: "dj-nige",
    summary: "Luxury weddings, Babington House and sophisticated mixed-age crowds.",
    traits: ["Luxury weddings", "Babington House", "Sophisticated mixed-age crowds"],
  },
  {
    name: "Rich S",
    slug: "rich-s",
    summary: "Broad musical knowledge, radio background and an adaptable wedding specialist.",
    traits: ["Broad musical knowledge", "Radio background", "Adaptable wedding specialist"],
  },
  {
    name: "James H",
    slug: "james-h",
    summary: "Corporate events, big-room confidence and an experienced presenter.",
    traits: ["Corporate events", "Big-room confidence", "Experienced presenter"],
  },
  {
    name: "DJ James",
    slug: "dj-james",
    summary: "Modern weddings, party-focused and energetic celebrations.",
    traits: ["Modern weddings", "Party-focused", "Energetic celebrations"],
  },
];

export default function DJsPageContent({ djs }: { djs: DJCardData[] }) {
  const [venueSearch, setVenueSearch] = useState("");

  return (
    <div>
      <YMCACheck />
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768163785/Nigel-DJ-Babs-House-0002-1_ktgbaf.jpg"
            alt="DJ performing at Babington House with elegant lighting—wedding and event entertainment"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-40 pb-12 sm:pt-48 md:pt-52">
          <div className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30 backdrop-blur-sm">
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">
              Trusted at Babington House since 2003
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            DJs Who Read The Room
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-champagne-gold/90 font-medium italic px-4 drop-shadow-md mb-4 max-w-3xl mx-auto">
            For people who care about atmosphere.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed px-4 drop-shadow-md mb-8 max-w-3xl mx-auto">
            Wedding, party and corporate DJs who manage energy, know when to build and when to hold
            back — reading the room rather than running through a playlist. No gimmicks. No forced
            interaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Check Availability</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Link href="/artists/djs/dj-nige/">Meet DJ Nige</Link>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 drop-shadow-md">
            22+ years · Luxury wedding DJs who read the room · UK-wide
          </p>
        </div>
      </section>

      {/* Residency credential strip — anchors the team in the Babington House
          relationship (DJ Nige has been resident since 2003) without singling
          out one DJ on the listing page. Links to the venue page. */}
      <aside
        aria-label="Resident DJ at Babington House since 2003"
        className="bg-gray-950 border-y border-champagne-gold/20 py-4 sm:py-5 px-4"
      >
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center">
          <span
            aria-hidden="true"
            className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-champagne-gold/80"
          >
            Resident DJ
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-champagne-gold/40">
            •
          </span>
          <p className="text-sm sm:text-base text-gray-200">
            <Link
              href="/venues/babington-house/"
              className="text-champagne-gold font-semibold hover:text-champagne-gold/80"
            >
              Babington House
            </Link>{" "}
            <span className="text-gray-400">
              since 2003 — over 22 years of weddings, parties &amp; corporate events
            </span>
          </p>
        </div>
      </aside>

      {/* What 22 Years At Babington House Taught Me */}
      <section className="py-16 md:py-20 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              What 22 Years At Babington House Taught Me
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                The best DJs watch more than they talk. They notice when the room is ready, when to
                hold back and when one more track will keep people on the floor — not drive them to
                the bar.
              </p>
              <p>
                Great parties are built gradually. Guests remember how a night felt, not which songs
                played. Reading the room matters more than playlists — and different generations can
                share the same dancefloor when the DJ has judgement, not just a crate of hits.
              </p>
              <p>
                That is what twenty-two years at{" "}
                <Link href="/venues/babington-house/" className={linkClass}>
                  Babington House
                </Link>{" "}
                teaches you. Avoid mic-hype and forced interaction. Let the music and the energy do
                the work — whether it is a luxury wedding, a{" "}
                <Link href="/parties/private-parties/" className={linkClass}>
                  private party
                </Link>{" "}
                or a corporate celebration.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Sets Our DJs Apart */}
      <section className="py-16 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/20 rounded-full border border-champagne-gold/40">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Why We&apos;re Different</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-6 text-white font-bold px-4">
              What Sets Our <span className="text-gradient">DJs Apart</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto px-4">
              Not equipment lists — judgement. Luxury wedding DJs and party DJs held to the same
              standard: atmosphere, flow and guest experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {djApartCards.map((item, index) => (
              <motion.div
                key={item.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                        <item.icon className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.copy}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Build A Dancefloor */}
      <section className="py-16 md:py-20 px-3 sm:px-4 bg-gray-950">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              How We Build A Dancefloor
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A packed dancefloor is created long before the first dance — through arrival music,
              timing and energy management across the whole evening.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {dancefloorFlow.map((step, index) => (
              <motion.div
                key={step.phase}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="h-full border-champagne-gold/30 bg-gray-900/80">
                  <CardContent className="p-6">
                    <h3 className="text-champagne-gold font-semibold text-lg mb-3">{step.phase}</h3>
                    <p className="text-gray-300 leading-relaxed">{step.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-gray-300 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            DJs are one part of the overall atmosphere. We often plan music alongside{" "}
            <Link href="/weddings/wedding-entertainment/" className={linkClass}>
              wedding entertainment
            </Link>
            ,{" "}
            <Link href="/weddings/wedding-lighting/" className={linkClass}>
              wedding lighting
            </Link>
            ,{" "}
            <Link href="/parties/private-parties/" className={linkClass}>
              private parties
            </Link>{" "}
            and{" "}
            <Link href="/services/venue-styling/" className={linkClass}>
              venue styling
            </Link>{" "}
            — so the dancefloor, the room and the outdoor spaces feel like one experience.
          </p>
        </div>
      </section>

      {/* Not All DJs Are The Same */}
      <section className="py-16 md:py-20 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Not All DJs Are The Same
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Personality and style matter as much as music taste. Here is how to think about our
              roster — wedding DJs who read the room, party DJs and corporate DJs held to the same
              standard.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {djStyles.map((dj, index) => (
              <motion.div
                key={dj.slug}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:border-champagne-gold/50 transition-all">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-white mb-2">
                      <Link href={`/artists/djs/${dj.slug}/`} className={linkClass}>
                        {dj.name}
                      </Link>
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">{dj.summary}</p>
                    <ul className="space-y-2">
                      {dj.traits.map((trait) => (
                        <li key={trait} className="text-gray-400 text-sm">
                          — {trait}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Couples Choose Stylish Entertainment — bridge to roster */}
      <section className="py-16 md:py-20 px-3 sm:px-4 bg-gray-950 border-y border-champagne-gold/20">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Why Couples Choose Stylish Entertainment
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>Most people don&apos;t book us because they want a DJ.</p>
              <p>They book us because they want a party that feels effortless.</p>
              <p>
                For more than twenty years we&apos;ve learned that packed dancefloors are rarely
                created by bigger speakers, brighter lights or longer playlists. They happen when
                music, timing, lighting and atmosphere work together.
              </p>
              <p>
                That&apos;s why many couples choose us for more than just a DJ.{" "}
                <Link href="/weddings/wedding-lighting/" className={linkClass}>
                  Lighting design
                </Link>
                ,{" "}
                <Link href="/services/venue-styling/" className={linkClass}>
                  venue styling
                </Link>
                , musicians and production can all be planned together by one experienced team — the
                same approach behind our{" "}
                <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                  wedding entertainment
                </Link>{" "}
                and{" "}
                <Link href="/parties/private-parties/" className={linkClass}>
                  private party
                </Link>{" "}
                work.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DJ Roster — cards and profiles unchanged */}
      <DJRosterSection djs={djs} />

      <DJsVideoGallery />

      {/* How Does It Work */}
      <section className="py-20 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Booking Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-6 text-white font-bold px-4">
              How Does It <span className="text-gradient">Work?</span>
            </h2>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-champagne-gold/30 bg-gray-800 shadow-lg mb-8">
              <CardContent className="p-8 sm:p-10 md:p-12">
                <ol className="space-y-6 text-gray-100 leading-relaxed list-none pl-0">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold/20 border border-champagne-gold/50 flex items-center justify-center text-champagne-gold font-bold text-lg">1</span>
                    <div>
                      <span className="font-semibold text-white">Enquire.</span> Share your date, venue and timings—we&apos;ll send a tailored quote and confirm availability.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold/20 border border-champagne-gold/50 flex items-center justify-center text-champagne-gold font-bold text-lg">2</span>
                    <div>
                      <span className="font-semibold text-white">Secure your date.</span> Pay the booking fee; balance due two weeks before the event.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold/20 border border-champagne-gold/50 flex items-center justify-center text-champagne-gold font-bold text-lg">3</span>
                    <div>
                      <span className="font-semibold text-white">Plan.</span> Use our digital worksheet to add your playlist, must-plays and run-of-show—and connect with your DJ as the date approaches.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold/20 border border-champagne-gold/50 flex items-center justify-center text-champagne-gold font-bold text-lg">4</span>
                    <div>
                      <span className="font-semibold text-white">Celebrate.</span> We handle setup, flow and the dance floor—you enjoy the night.
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Complete the experience */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-8 text-center"
          >
            <p className="text-gray-300 text-base sm:text-lg">
              Complete the experience:{" "}
              <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                Wedding Entertainment
              </Link>{" "}
              ·{" "}
              <Link href="/weddings/wedding-lighting/" className={linkClass}>
                Wedding Lighting
              </Link>{" "}
              ·{" "}
              <Link href="/parties/private-parties/" className={linkClass}>
                Private Parties
              </Link>{" "}
              ·{" "}
              <Link href="/services/venue-styling/" className={linkClass}>
                Venue Styling
              </Link>
            </p>
          </motion.div>

          {/* Nationwide Reach – Editorial Region Tiles */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                {EDITORIAL_SERVICE_HEADLINE.headline}
              </h3>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                {EDITORIAL_SERVICE_HEADLINE.subheadline}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {getEditorialServiceRegions().map((tile, index) => (
                <motion.div
                  key={tile.region}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="h-full border-champagne-gold/30 bg-gray-800/80 backdrop-blur-sm hover:border-champagne-gold/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 sm:p-8">
                      <h4 className="text-lg sm:text-xl font-bold text-champagne-gold mb-3 tracking-tight">
                        {tile.region}
                      </h4>
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {tile.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Venues We've Played At */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-8"
          >
            <Card className="border-champagne-gold/30 bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 sm:p-10 md:p-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                  Venues We&apos;ve Played At
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center mb-6">
                  We&apos;ve performed at hundreds of venues across the UK. Search below by venue name or location.
                </p>
                
                {/* Search Input */}
                <div className="relative mb-6 max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search venues..."
                    value={venueSearch}
                    onChange={(e) => setVenueSearch(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-champagne-gold/30 text-white placeholder:text-gray-500 focus:border-champagne-gold/60"
                  />
                </div>

                {/* Venues List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allVenues
                    .filter((venue) => 
                      venue.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
                      venue.location.toLowerCase().includes(venueSearch.toLowerCase())
                    )
                    .map((venue, index) => (
                      <motion.div
                        key={`${venue.name}-${index}`}
                        initial={false}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.01 }}
                        className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-champagne-gold/20 hover:border-champagne-gold/40 hover:bg-gray-900/70 transition-all"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{venue.name}</p>
                          {venue.location && (
                            <p className="text-gray-400 text-sm">{venue.location}</p>
                          )}
                        </div>
                        {venue.url && (
                          <Link
                            href={venue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-champagne-gold hover:text-champagne-gold/80 text-sm font-medium ml-4 transition-colors"
                            aria-label={`View ${venue.name} website`}
                          >
                            View →
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  {allVenues.filter((venue) => 
                    venue.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
                    venue.location.toLowerCase().includes(venueSearch.toLowerCase())
                  ).length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      No venues found. Try a different search term.
                    </p>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 text-center mt-6 italic">
                  Don't see your venue? We'd love to play there! Contact us to discuss your date.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Card className="border-2 border-champagne-gold/50 bg-gray-800 shadow-xl">
              <CardContent className="p-8 sm:p-10">
                <p className="text-xl sm:text-2xl font-bold text-white mb-6">
                  Enquire to secure your date—we&apos;ll tailor the right Artist and setup to your venue and timings.
                </p>
                <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
                  <Link href="/contact-us/" aria-label="Enquire and check availability for your DJ or live act">Enquire &amp; Check Availability</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
