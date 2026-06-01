"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";
import { ImagePhoto } from "@/components/ImageCarousel";
import HorizontalImageCarousel from "@/components/HorizontalImageCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeforeAfter from "@/components/BeforeAfter";
import { Button } from "@/components/ui/button";
import WaveDivider from "@/components/WaveDivider";
import {
  Briefcase,
  Building2,
  Cake,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Lightbulb,
  Music2,
  Palette,
  Sparkles,
  Tent,
  Users,
  Video,
  XCircle,
} from "lucide-react";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const processSteps = [
  {
    id: "dream",
    title: "Dream It",
    Icon: Sparkles,
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg",
    imageAlt: "Consultation for private event production — understanding the celebration and guest list",
    description:
      "We start by understanding what you are celebrating, who is coming and how the night should feel — not with a supplier checklist, but with the atmosphere you want guests to remember.",
    bullets: [
      "What the occasion means and who the party is really for",
      "How you want arrival, dinner, dancing and outdoor spaces to flow",
      "Must-haves, must-nots and the mood you want before the first guest walks in",
    ],
  },
  {
    id: "design",
    title: "Design It",
    Icon: Lightbulb,
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733254/Babington-House-in-Green_oms0ws.jpg",
    imageAlt: "Lighting design and creative direction for a private celebration",
    description:
      "We shape the atmosphere — music, lighting, layout, styling, production and supplier coordination — so every element connects before installation begins.",
    bullets: [
      "Entertainment strategy — DJs, musicians and how energy builds through the night",
      "Lighting design, exterior spaces and room transformation",
      "Production planning — sound, power, staging, timing and crew",
    ],
  },
  {
    id: "deliver",
    title: "Deliver It",
    Icon: Music2,
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163815/Highcliffe-Castle-Wedding-2-web_pgsbaa.jpg",
    imageAlt: "Private celebration in full swing — production managed on the night",
    description:
      "Our team installs, manages and runs the production so the party feels effortless for you. We coordinate suppliers, solve problems quietly and keep the guest experience at the centre.",
    bullets: [
      "Installation, technical checks and on-site production management",
      "Coordination with venue, caterers and trusted suppliers",
      "A team that owns the evening atmosphere — not just individual hire items",
    ],
  },
];

const whatWeDoCards: Array<{ Icon: typeof Sparkles; title: string; copy: ReactNode }> = [
  {
    Icon: Sparkles,
    title: "Creative Direction",
    copy: "Overall vision, atmosphere, flow and style — so the party feels intentional, not assembled from separate suppliers.",
  },
  {
    Icon: Music2,
    title: "Entertainment Strategy",
    copy: (
      <>
        <Link href="/artists/djs/" className={linkClass}>
          DJs
        </Link>
        , musicians, performers and how energy builds from arrival through to the final dancefloor — not
        one flat playlist all night.
      </>
    ),
  },
  {
    Icon: Lightbulb,
    title: "Lighting & Atmosphere",
    copy: (
      <>
        Dancefloor lighting, uplighting, exterior tree lighting, courtyard lighting, festoon, fairy lights
        and room transformation — see our{" "}
        <Link href="/parties/party-lighting/" className={linkClass}>
          party lighting
        </Link>{" "}
        approach.
      </>
    ),
  },
  {
    Icon: Video,
    title: "Production",
    copy: "Sound, power, staging, timing, crew and technical logistics — the infrastructure that lets creative ideas work on the night.",
  },
  {
    Icon: Palette,
    title: "Styling & Finishing Touches",
    copy: (
      <>
        Furniture, props,{" "}
        <Link href="/services/fire-pit-hire/" className={linkClass}>
          fire pits
        </Link>
        , outdoor spaces and guest experience details — plus{" "}
        <Link href="/services/venue-styling/" className={linkClass}>
          venue styling
        </Link>{" "}
        where the room needs more than lights alone.
      </>
    ),
  },
  {
    Icon: Users,
    title: "Supplier Coordination",
    copy: "Working with venues, caterers, florists, photographers and trusted suppliers — without pretending to replace every specialist planner in every category.",
  },
];

const partiesWeProduce: Array<{ Icon: typeof Cake; title: string; copy: ReactNode }> = [
  {
    Icon: Cake,
    title: "Milestone birthdays",
    copy: "40th, 50th, 60th and 70th celebrations where the guest of honour matters and the dancefloor still has to deliver — personal music, lighting and production shaped around the people in the room.",
  },
  {
    Icon: Tent,
    title: "Marquee parties",
    copy: "Empty field to finished venue — structure, flow, lighting that softens the canvas and entertainment that evolves from first drink to peak-time dancing.",
  },
  {
    Icon: Home,
    title: "House and garden parties",
    copy: (
      <>
        Private homes transformed without losing their character — sound, lighting and layout that work
        for intimate rooms and outdoor terraces. More on our{" "}
        <Link href="/parties/private-parties/" className={linkClass}>
          private parties
        </Link>{" "}
        approach.
      </>
    ),
  },
  {
    Icon: Building2,
    title: "Estate celebrations",
    copy: "Multiple spaces, outdoor zones, lighting paths between rooms and entertainment that keeps guests moving — production that connects the whole property, not just one marquee or barn.",
  },
  {
    Icon: Sparkles,
    title: "Themed parties",
    copy: "Wild West, Gatsby, disco, club nights and bespoke concepts — creative direction and production that commits to the theme without feeling like a fancy-dress shop.",
  },
  {
    Icon: Briefcase,
    title: "Corporate and brand celebrations",
    copy: "Polished production, music and guest experience for clients and teams — presenter confidence, room energy and the kind of detail that reflects well on your brand.",
  },
];

const after20YearsPoints = [
  "Guests do not remember supplier lists. They remember moments.",
  "The reveal when they enter the space — lighting, layout and music already working together.",
  "The first drink outside at sunset, with festoon or courtyard lighting doing its job quietly.",
  "The dancefloor suddenly taking off because timing and programming were right, not because someone turned the volume up.",
  "Fire pits or exterior lighting at midnight — outdoor spaces still connected to the party.",
  "Great production creates those moments deliberately. That is what this service is for.",
];

const goodFitItems = [
  "You have a venue, house, barn, marquee or estate and need the whole atmosphere shaped — not just one hire item dropped in.",
  "You want DJs, lighting, styling and production managed together by one experienced team.",
  "You are planning a milestone birthday or serious private celebration with a meaningful budget.",
  "You want creative ideas but also practical delivery — someone who can both imagine the night and run it.",
  "You want one team to own the evening atmosphere from first idea to final dancefloor.",
];

const notFitItems = [
  "You only need a very basic DJ booking with no production or creative input.",
  "You already have a full planner and only need a single lighting or sound hire.",
  "You want the cheapest possible supplier list with no creative direction.",
];

const whatWeDontDoItems = [
  "We are not a wedding planner.",
  "We are not a venue finder.",
  "We are not a directory of suppliers.",
];

const typicalProductionBriefPhases = [
  {
    label: "The brief",
    detail:
      "A client wants to celebrate a 50th birthday for 150 guests at home. The house, garden and marquee all need to work as one celebration — not three separate areas with a DJ dropped in at the end.",
  },
  {
    label: "Where we start",
    detail:
      "We start with the atmosphere — how guests should feel on arrival, where energy builds and how outdoor spaces stay connected after dark.",
  },
  {
    label: "Arrival",
    detail: "Guests arrive through a lit pathway — exterior lighting that sets the tone before anyone reaches the marquee or dancefloor.",
  },
  {
    label: "Garden drinks",
    detail:
      "Drinks are served in the garden — considered background, courtyard lighting and a flow that feels natural, not rushed toward dinner.",
  },
  {
    label: "The marquee",
    detail:
      "The marquee becomes the heart of the celebration — lighting, layout and sound planned so the room feels intentional, not like a tent waiting for a band.",
  },
  {
    label: "Dinner to dancing",
    detail:
      "Dining transitions into dancing — timing, must-plays and programming handled so the floor gathers without a jarring switch.",
  },
  {
    label: "After dark",
    detail: (
      <>
        Fire pits and exterior lighting keep outdoor spaces alive after dark — so guests drift outside for
        one more drink without the party splitting in two. See our{" "}
        <Link href="/services/fire-pit-hire/" className={linkClass}>
          fire pit hire
        </Link>
        .
      </>
    ),
  },
  {
    label: "One experience",
    detail: (
      <>
        <Link href="/artists/djs/" className={linkClass}>
          DJs
        </Link>
        ,{" "}
        <Link href="/parties/party-lighting/" className={linkClass}>
          lighting
        </Link>{" "}
        and production are all managed as one experience — one team owning the evening, not a list of
        suppliers left to coordinate themselves.
      </>
    ),
  },
];

// Before and After – kept as centrepiece of transformation section
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
        <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-[4/3] shrink-0">
          <Image
            src={step.image}
            alt={step.imageAlt}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={stepIndex === 0}
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <span className="text-white/90 text-sm font-medium drop-shadow-lg">
              Step {stepIndex + 1} of {processSteps.length}
            </span>
          </div>
        </div>
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
    alt: "Private event production at Kings Weston House with professional lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party production with lighting and entertainment coordination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163790/Party-dj-with-lazer_wnhreb.jpg",
    width: 1200,
    height: 900,
    alt: "Private event production including DJ entertainment and dancefloor lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Marquee party production with professional lighting installation",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768754478/IMG_2866_zhs5sz.jpg",
    width: 1200,
    height: 900,
    alt: "Private event production and creative direction for a milestone celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742320/IMG_1871_161201_n88x5z.jpg",
    width: 1200,
    height: 900,
    alt: "Event lighting and production with venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741619/IMG_0487_aoaxho.jpg",
    width: 1200,
    height: 900,
    alt: "Private party production from concept to delivery in the South West",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768729861/798D06F8-3A1A-464B-B222-219CFFB7888D_1_105_c_leivu1.jpg",
    width: 1200,
    height: 900,
    alt: "Creative event production and styling for private celebrations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768649763/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw.jpg",
    width: 1200,
    height: 900,
    alt: "Private event production delivering atmosphere and guest experience",
  },
];

export default function PartyPlanningClient() {
  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden max-w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768754478/IMG_2866_zhs5sz.jpg"
            alt="Private event production — creative direction, lighting and entertainment for milestone celebrations"
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-900" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-40 pb-24 sm:pt-48 sm:pb-28 md:pt-52">
          <div className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30 backdrop-blur-sm">
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">
              Milestone · Marquee · Estate
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Private Event Production
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md mb-8 max-w-3xl mx-auto leading-relaxed">
            Creative direction, DJs, lighting, styling and production for milestone birthdays, marquee
            parties, estate celebrations and private events — one experienced team shaping the atmosphere
            from first idea to final dancefloor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Request an Event Proposal</Link>
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
          <p className="text-xs sm:text-sm text-gray-300 drop-shadow-md">
            Trusted at Babington House since 2003 · 20+ years · South West, London &amp; UK-wide
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <WaveDivider />
        </div>
      </section>

      <div
        style={{
          background:
            "radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)",
        }}
      >
        {/* Why Some Parties Feel Different */}
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Why Some Parties Feel Different
              </h2>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-6">
                The most memorable celebrations are rarely just about budget. They are the ones where every
                element works together — arrival, lighting, music, layout, timing, outdoor spaces and the
                final dancefloor.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Extraordinary private celebrations need more than suppliers. They need creative direction,
                atmosphere and production that connects the whole evening — so guests feel something from
                the moment they arrive, not just when the DJ starts.
              </p>
            </motion.div>
          </div>
        </section>

        {/* After 20 Years Of Parties… */}
        <section className="py-20 px-4 bg-gray-950/60 max-w-full overflow-x-hidden border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                After 20 Years Of Parties&hellip;
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

        {/* What We Actually Do */}
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What We Actually Do</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                &ldquo;Party planning&rdquo; can mean many things. This page is about{" "}
                <strong className="text-white font-semibold">private event production</strong> and creative
                direction — shaping atmosphere, entertainment strategy and technical delivery together. The
                same team behind{" "}
                <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                  wedding entertainment
                </Link>{" "}
                and{" "}
                <Link href="/parties/private-parties/" className={linkClass}>
                  private parties
                </Link>
                , applied to serious celebrations with meaningful budgets.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatWeDoCards.map(({ Icon, title, copy }) => (
                <Card
                  key={title}
                  className="bg-white/5 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <Icon className="w-10 h-10 mb-4 text-champagne-gold" />
                    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* A Typical Private Event Production Brief — illustration, not a case study */}
        <section className="py-20 px-4 bg-gray-950/60 max-w-full overflow-x-hidden border-y border-champagne-gold/10">
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
                  A Typical Private Event Production Brief
                </h2>
                <p className="text-gray-400 text-base max-w-xl mx-auto">
                  Not a case study — just how a milestone celebration might unfold when production, creative
                  direction and guest experience are planned as one story.
                </p>
              </div>
              <div className="space-y-4">
                {typicalProductionBriefPhases.map((phase, idx) => (
                  <div
                    key={phase.label}
                    className="flex gap-4 p-4 sm:p-5 rounded-lg bg-gray-900/70 border border-champagne-gold/15"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-champagne-gold/15 border border-champagne-gold/40 flex items-center justify-center text-champagne-gold text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-champagne-gold font-semibold mb-1">{phase.label}</p>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{phase.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* From Empty Space To Finished Party — before/after sliders */}
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
                <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">
                  Venue Transformation
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 text-white font-bold">
                From Empty Space To Finished Party
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Before and after matters because most great parties begin as empty rooms, barns, lawns or
                marquees. Our job is to make the space feel intentional before the first guest arrives —
                creative event production you can see, not just read about.
              </p>
              <p className="text-sm text-gray-400 mt-3">Drag the slider or click anywhere to compare</p>
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

        {/* Gallery */}
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

        {/* Process — Dream It / Design It / Deliver It */}
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How We Work</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Three stages — from the first conversation to the final dancefloor.
              </p>
            </motion.div>
            <ProcessCarousel />
          </div>
        </section>

        {/* The Parties We Produce */}
        <section className="py-20 px-4 bg-gray-950/60 max-w-full overflow-x-hidden border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">The Parties We Produce</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Private party production across Somerset, Bath, Bristol, London and UK-wide — from milestone
                birthdays to marquee party production and house party production at scale.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partiesWeProduce.map(({ Icon, title, copy }) => (
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

        {/* Babington proof */}
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-10 rounded-2xl bg-gray-900/70 border border-champagne-gold/25 backdrop-blur-sm"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                What Babington House Taught Us
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                For more than twenty years we have helped create the atmosphere at{" "}
                <Link href="/venues/babington-house/" className={linkClass}>
                  Babington House
                </Link>
                , one of the UK&apos;s most celebrated private members&apos; clubs. Working at that level
                teaches you that details matter — not louder speakers or bigger lists of suppliers, but
                better guest experiences.
              </p>
              <p className="text-gray-300 leading-relaxed">
                That standard now informs every private event we produce — whether the venue is a members&apos;
                club, a family estate or a marquee in a field. It is one reason couples and hosts trust us
                with milestone birthdays, estate celebrations and party planning Somerset clients ask us to
                lead from concept to delivery.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Don't Do */}
        <section className="py-20 px-4 max-w-full overflow-x-hidden">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
                What We Don&apos;t Do
              </h2>
              <ul className="space-y-4 mb-8">
                {whatWeDontDoItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-400 text-base sm:text-lg leading-relaxed pl-4 border-l-2 border-gray-600"
                  >
                    <XCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg sm:text-xl text-white font-semibold text-center leading-relaxed p-6 rounded-xl bg-champagne-gold/10 border border-champagne-gold/30">
                We are the team responsible for the atmosphere, production and guest experience.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Is This For You? */}
        <section className="py-20 px-4 bg-gray-950/60 max-w-full overflow-x-hidden border-t border-champagne-gold/10">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
                Is This For You?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-champagne-gold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    A good fit if&hellip;
                  </h3>
                  <ul className="space-y-3">
                    {goodFitItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                        <span className="text-champagne-gold mt-1 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 shrink-0" />
                    Not necessarily if&hellip;
                  </h3>
                  <ul className="space-y-3">
                    {notFitItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                        <span className="text-gray-500 mt-1 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
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
                    Ready to shape the atmosphere?
                  </h3>
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                    Tell us what you are celebrating, where and how you want the night to feel. We will reply
                    with honest ideas and a clear next step — private event production for clients who want
                    the whole evening pulled together, not just one supplier booked in isolation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                    <Button
                      asChild
                      size="lg"
                      className="min-h-[48px] bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    >
                      <Link href="/contact-us/">Request an Event Proposal</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                    >
                      <a href="tel:+447970793177">Call 07970 793177</a>
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm mt-6">
                    Explore{" "}
                    <Link href="/parties/private-parties/" className={linkClass}>
                      private parties
                    </Link>
                    ,{" "}
                    <Link href="/parties/party-lighting/" className={linkClass}>
                      party lighting
                    </Link>{" "}
                    and our{" "}
                    <Link href="/artists/djs/" className={linkClass}>
                      DJ roster
                    </Link>
                    .
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
