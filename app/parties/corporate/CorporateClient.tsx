"use client";

import type { ReactNode } from "react";
import { motion } from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  ClipboardCheck,
  FileCheck,
  Gift,
  Lightbulb,
  Mic,
  Rocket,
  Shield,
  Sun,
  Trophy,
  Users,
  Volume2,
  Wine,
} from "lucide-react";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const corporatePhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/DJ-Decks_mlezxe.jpg",
    width: 1200,
    height: 900,
    alt: "Professional DJ and sound production for a corporate brand event",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/IMG_2048_vpuugy.jpg",
    width: 1200,
    height: 900,
    alt: "Corporate event production with lighting, sound and guest experience",
  },
];

const corporateEventTypes: Array<{ Icon: typeof Rocket; title: string; copy: string }> = [
  {
    Icon: Rocket,
    title: "Product launches",
    copy: "Sound, lighting and atmosphere around a reveal or brand moment — production that supports the story, not entertainment bolted on at the end.",
  },
  {
    Icon: Wine,
    title: "Client entertaining",
    copy: "Sophisticated background, polished production and entertainment that supports conversation — discreet when the room needs it, confident when energy lifts.",
  },
  {
    Icon: Trophy,
    title: "Awards nights",
    copy: "Presentations, speeches, walk-up music, sound, lighting and celebration — timings and technical delivery handled so the programme runs smoothly.",
  },
  {
    Icon: Sun,
    title: "Summer parties",
    copy: "Outdoor atmosphere, DJs, live musicians, festoon, fire pits and relaxed brand hospitality — guest flow from garden to dancefloor without losing the company tone.",
  },
  {
    Icon: Gift,
    title: "Christmas parties",
    copy: "Dancefloor-focused entertainment, lighting and production for end-of-year celebrations — music and guest experience that feels considered, not generic office party.",
  },
  {
    Icon: Users,
    title: "Staff celebrations",
    copy: "Rewarding teams properly with music, lighting and production that reflects how much the occasion matters — energetic without feeling unprofessional.",
  },
];

const productionScaleItems = [
  "Corporate event DJ only",
  "DJ and corporate party lighting",
  "PA and microphones for speeches and presentations",
  "Awards-night sound and lighting",
  "Live musicians for corporate events",
  "Festival-style DJ, sax and percussion",
  "Full corporate event production — entertainment, sound, lighting and crew together",
];

const typicalCorporateBriefPhases = [
  {
    label: "The brief",
    detail:
      "A luxury automotive brand wants to host a summer event for 200 guests — client hospitality, staff and partners, with presentations, dinner and a proper celebration afterwards. One team needs to own sound, lighting and entertainment throughout.",
  },
  {
    label: "Arrival",
    detail:
      "Guests arrive to acoustic music and drinks — background that feels considered, not empty silence or a full dance set too early.",
  },
  {
    label: "Presentations",
    detail:
      "Presentations run through a branded lighting scheme — clear speech reinforcement, reliable playback and lighting that supports the brand without overpowering the room.",
  },
  {
    label: "Dinner",
    detail:
      "Dinner transitions smoothly — music, lighting and timing adjusted so the room shifts naturally from formal to celebratory.",
  },
  {
    label: "Live entertainment",
    detail:
      "Live entertainment lifts the energy when the programme allows — curated for the audience, not added for the sake of it.",
  },
  {
    label: "The dancefloor",
    detail:
      "The evening ends with DJs and a full dancefloor — corporate entertainment that suits the crowd, managed by the same production team that ran the presentations.",
  },
  {
    label: "One team",
    detail:
      "Sound, lighting and entertainment managed as one experience — not separate suppliers coordinating on the night.",
  },
];

const after20YearsPoints = [
  "Corporate guests behave differently to wedding guests. They do not always arrive expecting to dance.",
  "The atmosphere has to be earned — through timing, music choice and production that respects the room.",
  "Presentations and speeches matter as much as the party. Technical confidence keeps hosts and organisers calm.",
  "The best events balance professionalism and personality. Too stiff and guests leave early. Too loud and the brand feels wrong.",
  "When that balance is right, guests stay longer, conversations happen naturally and the event feels effortless — even when the production behind it is substantial.",
];

const CORPORATE_FAQ_ITEMS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Do you provide DJs for corporate events?",
    answer: (
      <>
        Yes. Our{" "}
        <Link href="/artists/djs/" className={linkClass}>
          corporate event DJs
        </Link>{" "}
        are selected for audience, tone and brand fit — not simply a roster of performers. Music,
        sound and guest experience are planned for the event purpose, whether that is client
        entertaining or a Christmas party dancefloor.
      </>
    ),
  },
  {
    question: "Can you provide PA and microphones for speeches?",
    answer:
      "Yes. Clear speech reinforcement, reliable playback and balanced music levels are standard — from boardroom presentations to awards-night programmes with multiple speakers and walk-up music.",
  },
  {
    question: "Can you support awards nights and presentations?",
    answer:
      "Yes. We regularly support awards nights with sound, lighting, walk-up music and technical coordination — so presentations feel polished and the celebration afterwards has proper production behind it.",
  },
  {
    question: "Can you provide lighting in brand colours?",
    answer: (
      <>
        Yes. Intelligent lighting can support presentations, brand colours, dinner atmosphere and
        party energy — see our{" "}
        <Link href="/parties/party-lighting/" className={linkClass}>
          corporate party lighting
        </Link>{" "}
        approach. The brief determines whether lighting stays discreet or becomes part of the
        celebration.
      </>
    ),
  },
  {
    question: "Do you provide live musicians as well as DJs?",
    answer:
      "Yes. Live musicians, sax and percussion can be added where the audience and setting suit them — curated for the event purpose, not added for the sake of it.",
  },
  {
    question: "Can you work with our event planner or agency?",
    answer:
      "Yes. We coordinate with in-house teams, agencies and venues regularly — providing RAMS, technical riders and professional crews so production slots into a wider event plan without friction.",
  },
  {
    question: "Are you insured and able to provide RAMS?",
    answer:
      "Yes. We carry £10m public liability insurance, PAT-tested equipment, detailed RAMS and professional technical riders for every corporate booking.",
  },
  {
    question: "Do you travel outside the South West?",
    answer:
      "Yes. We are based in Somerset and work across London, the Home Counties and UK-wide for corporate events, product launches and brand hospitality.",
  },
];

const LogoMarquee = () => {
  const brands = [
    "Soho House & Co",
    "Aston Martin",
    "Red Bull",
    "Sony",
    "Tesco",
    "Sotheby's",
    "Orange",
    "T-Mobile",
    "Direct Wines",
    "Top Shop",
  ];

  const duplicated = [...brands, ...brands];

  return (
    <section
      aria-label="Trusted by leading brands"
      className="relative overflow-hidden bg-gray-950/60 border-y border-champagne-gold/20 py-10 sm:py-12"
    >
      <div
        className="marquee-mask"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div className="flex animate-marquee items-center whitespace-nowrap">
          {duplicated.map((brand, index) => (
            <span
              key={index}
              aria-hidden={index >= brands.length}
              className="inline-flex items-center px-6 sm:px-10 md:px-14 text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide text-white/90"
            >
              {brand}
              <span
                aria-hidden="true"
                className="ml-6 sm:ml-10 md:ml-14 text-champagne-gold/40 text-base sm:text-lg select-none"
              >
                •
              </span>
            </span>
          ))}
        </div>
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
          animation: marquee 18s linear infinite;
          will-change: transform;
        }
        .marquee-mask:hover .animate-marquee {
          animation-play-state: paused;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 14s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation-duration: 60s;
          }
        }
      `}</style>
    </section>
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
            alt="Corporate event production — sound, lighting and entertainment for brand events"
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
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52 pb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Corporate Event Production &amp; Entertainment
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md mb-8 max-w-3xl mx-auto leading-relaxed">
            Sound, lighting, DJs, live entertainment and production for brand events, client
            entertaining, awards nights and company celebrations — delivered by a team trusted by
            leading brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Request a Corporate Proposal</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <a href="tel:+447970793177">Call 07970 793177</a>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 drop-shadow-md px-4">
            Trusted by Soho House &amp; Co, Aston Martin, Red Bull, Sony, Sotheby&apos;s and more
          </p>
        </motion.div>
      </section>

      <div
        style={{
          background:
            "radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)",
        }}
      >
        {/* What Corporate Clients Actually Need */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
                What Corporate Clients Actually Need
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                Corporate events carry different pressures to weddings and private parties. Timings
                matter. Presentations must work. The brand has to be represented properly. Guests
                need to feel looked after.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Entertainment must suit the audience — not dominate the room.",
                  "Production should feel invisible when it works and instantly supported when something is needed.",
                  "Sound, lighting and guest experience should reflect the company — polished for luxury clients, energetic for team celebrations.",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-gray-300 leading-relaxed pl-4 border-l-2 border-champagne-gold/40"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-gray-200 text-lg leading-relaxed">
                That is why many clients ask us to manage entertainment, lighting and production
                together — brand event production delivered by one experienced team, not a directory
                of suppliers left to coordinate themselves.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Simple Support To Full Production — high on page for scope qualification */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                Simple Support To Full Production
              </h2>
              <p className="text-gray-300 text-center mb-8 leading-relaxed">
                Not every corporate brief needs the same scope — and we are not only for full
                production. We scale up or down, from a corporate event DJ and PA for speeches to
                complete event sound and lighting with crew, styling and supplier coordination.
              </p>
              <ul className="space-y-2">
                {productionScaleItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-300 text-sm sm:text-base leading-relaxed p-3 rounded-lg bg-gray-900/40 border border-champagne-gold/10"
                  >
                    <span className="text-champagne-gold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-400 text-sm mt-8 text-center">
                Explore{" "}
                <Link href="/parties/party-lighting/" className={linkClass}>
                  party lighting
                </Link>
                ,{" "}
                <Link href="/services/venue-styling/" className={linkClass}>
                  venue styling
                </Link>{" "}
                and{" "}
                <Link href="/parties/private-parties/" className={linkClass}>
                  private event production
                </Link>{" "}
                for related services.
              </p>
            </motion.div>
          </div>
        </section>

        {/* A Typical Corporate Brief — illustration, not a case study */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-10">
                <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
                  <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">
                    Illustration
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  A Typical Corporate Brief
                </h2>
                <p className="text-gray-400 text-base max-w-xl mx-auto">
                  Not a named case study — just how a summer corporate event might unfold when sound,
                  lighting and entertainment are planned as one production.
                </p>
              </div>
              <div className="space-y-4">
                {typicalCorporateBriefPhases.map((phase, idx) => (
                  <div
                    key={phase.label}
                    className="flex gap-4 p-4 sm:p-5 rounded-lg bg-gray-900/70 border border-champagne-gold/15"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-champagne-gold/15 border border-champagne-gold/40 flex items-center justify-center text-champagne-gold text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-champagne-gold font-semibold mb-1">{phase.label}</p>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {phase.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trusted By Brands That Care About Experience */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Trusted By Brands That Care About Experience
              </h2>
              <p className="text-gray-300 leading-relaxed">
                From luxury hospitality and automotive brands to product launches, staff celebrations
                and client events, successful corporate events depend on atmosphere, professionalism
                and flawless delivery. We have supplied entertainment and production for events
                chosen by brands including{" "}
                <span className="text-champagne-gold/90">
                  Soho House &amp; Co, Aston Martin, Red Bull, Sony, Sotheby&apos;s, Tesco, Orange,
                  T-Mobile, Direct Wines and Top Shop
                </span>
                .
              </p>
              <p className="text-gray-400 leading-relaxed mt-6 max-w-2xl mx-auto">
                Many of our corporate clients return year after year because they know the
                production, entertainment and guest experience will be handled professionally —
                whether that is an annual summer party, a Christmas celebration or repeat client
                hospitality.
              </p>
            </motion.div>
          </div>
          <LogoMarquee />
        </section>

        {/* What 20 Years Of Corporate Events Taught Us */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                What 20 Years Of Corporate Events Taught Us
              </h2>
              <ul className="space-y-4">
                {after20YearsPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="text-base sm:text-lg leading-relaxed text-gray-300 pl-4 border-l-2 border-champagne-gold/40"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Production pillars — reframed feature blocks */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-champagne-gold/10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300">
                <CardHeader>
                  <Volume2 className="w-10 h-10 text-champagne-gold mb-4" />
                  <CardTitle className="text-white">Professional Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Clear speeches, reliable playback, balanced music levels and technical support
                    that keeps the room confident — from intimate client dinners to awards-night
                    programmes and summer party sound systems.
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
                    Lighting that supports presentations, brand colours, dinner atmosphere and party
                    energy — corporate party lighting that adapts to the brief without feeling like a
                    nightclub unless that is what the event needs.
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
                    <Link href="/artists/djs/" className={linkClass}>
                      DJs
                    </Link>
                    , musicians and live acts selected for the audience and event purpose — product
                    launch energy, client entertaining discretion or Christmas party momentum — not
                    simply a list of performers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Types Of Corporate Events We Produce */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950/50">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Types Of Corporate Events We Produce
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Corporate entertainment and production across product launches, hospitality, awards
                nights and company celebrations — scaled to the brief.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {corporateEventTypes.map(({ Icon, title, copy }) => (
                <Card
                  key={title}
                  className="bg-gray-900/70 border border-champagne-gold/20 hover:border-champagne-gold/40 transition-colors"
                >
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-champagne-gold mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Great Corporate Events Reflect The Brand */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
                Great Corporate Events Reflect The Brand
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                The right entertainment and production should feel like an extension of the company
                — polished for luxury clients, energetic for team celebrations, discreet for client
                entertaining, bold for product launches.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Music choice that suits the audience and occasion",
                  "Lighting tone that supports the brand, not fights it",
                  "Presentation quality that keeps hosts confident",
                  "Staff and guest experience that feels considered",
                  "Guest flow from arrival through to the dancefloor",
                  "Production that reflects brand values in the room",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-gray-300 text-sm leading-relaxed p-3 rounded-lg bg-gray-900/50 border border-champagne-gold/15"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
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

        {/* Popular Entertainment Option — Festival Trio moved down */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/40">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Mic className="w-6 h-6 text-champagne-gold" />
                    Popular Entertainment Option
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Festival Trio: DJ, Sax &amp; Bongos
                  </h3>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    For the right brief, DJ, sax and percussion can bring a high-energy festival feel
                    to product launches, summer parties and staff celebrations. Live energy alongside
                    professional mixing — popular where the audience and setting suit it.
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    It is not right for every event, so we recommend it only where the room, brand
                    and guest profile fit. Client entertaining and awards nights often need a
                    different approach — and we will say so upfront.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Peace of Mind */}
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
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Corporate venues and procurement teams need documentation, insurance and
                    professional standards — not last-minute surprises on the day.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          £10m Public Liability Insurance
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Full coverage for corporate venues, agencies and in-house event teams.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileCheck className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">PAT-Tested Equipment</h4>
                        <p className="text-gray-300 text-sm">
                          All sound and lighting equipment tested and certified to required standards.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ClipboardCheck className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Detailed RAMS</h4>
                        <p className="text-gray-300 text-sm">
                          Risk Assessment Method Statements supplied for venue and agency approval.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Technical Riders</h4>
                        <p className="text-gray-300 text-sm">
                          Professional technical specifications for seamless venue integration.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Professional Crews</h4>
                        <p className="text-gray-300 text-sm">
                          Experienced technicians and production staff on site — not equipment dropped
                          off without support.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Volume2 className="w-5 h-5 text-champagne-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Venue Coordination</h4>
                        <p className="text-gray-300 text-sm">
                          We work with venue teams, agencies and in-house planners so load-in, timings
                          and technical handovers run smoothly.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950/50 border-t border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {CORPORATE_FAQ_ITEMS.map((item, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-champagne-gold/20 bg-gray-900/60 overflow-hidden"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 text-white font-semibold hover:bg-champagne-gold/5 transition-colors [&::-webkit-details-marker]:hidden flex justify-between items-center gap-4">
                      {item.question}
                      <span className="text-champagne-gold text-xl shrink-0 group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-300 leading-relaxed text-sm sm:text-base border-t border-champagne-gold/10 pt-4">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
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
                    Ready to discuss your corporate event?
                  </h3>
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                    Tell us about the event, audience and brand tone. We will reply with honest
                    recommendations and a clear production scope — corporate event production for
                    teams who need confidence, professionalism and guest experience delivered
                    together.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <Button
                      asChild
                      size="lg"
                      className="min-h-[48px] bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    >
                      <Link href="/contact-us/">Request a Corporate Proposal</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="min-h-[48px] border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300"
                    >
                      <a href="tel:+447970793177">Call 07970 793177</a>
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Or email{" "}
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
