"use client";

import type { ReactNode } from "react";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "@/lib/motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Lightbulb,
  ExternalLink,
  DoorOpen,
  UtensilsCrossed,
  Trees,
  Music2,
  Moon,
  Check,
} from "lucide-react";
import SiteLightbox from "@/components/SiteLightbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

type EventFilter = "all" | "weddings" | "corporate" | "outdoor";

interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  eventTypes: EventFilter[];
  venue?: string;
  serviceType?: "dance-floor" | "festoon" | "atmospheric";
}

const LCP_HERO_URL =
  "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768162258/Fairy-light-Tunnel_sc40ed.jpg";

const heroMoodImages: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg",
    alt: "Magical fairy light tunnel creating a romantic entrance for weddings and events",
    width: 1920,
    height: 1080,
    eventTypes: ["weddings", "outdoor"],
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163720/A-Big-Lazer-e1430894875463_xgpiil.jpg",
    alt: "Dramatic laser lighting effects on the dance floor for high-energy celebrations",
    width: 1920,
    height: 1080,
    eventTypes: ["corporate", "outdoor"],
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg",
    alt: "The Newt Somerset wedding venue with fairy light tunnel installation – prestigious venue transformation",
    width: 1920,
    height: 1080,
    eventTypes: ["weddings"],
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768731384/Pennard-House-Lighting-with-Amber-Up-lighting_sljvaa.jpg",
    alt: "Pennard House amber uplighting highlighting architectural features for elegant evening events",
    width: 1920,
    height: 1080,
    eventTypes: ["weddings", "corporate"],
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741340/_F4R3275_tukoww.jpg",
    alt: "Chill Out Camp with vintage Edison festoon lighting and fairy lights – alfresco party atmosphere",
    width: 1920,
    height: 1080,
    eventTypes: ["weddings", "outdoor"],
  },
];

const howWeLightParty: Array<{
  icon: typeof DoorOpen;
  title: string;
  copy: ReactNode;
}> = [
  {
    icon: DoorOpen,
    title: "Arrival & first impressions",
    copy: (
      <>
        Exterior lighting, entrance lighting, fairy tunnels and pathway lighting set the tone before
        guests reach the room. First impressions are not decoration — they tell people the evening
        matters.
      </>
    ),
  },
  {
    icon: UtensilsCrossed,
    title: "Dining & conversation",
    copy: (
      <>
        Warm architectural uplighting and soft room light that flatters faces and architecture — not
        harsh overhead glare. Guests talk longer when the room feels considered.
      </>
    ),
  },
  {
    icon: Trees,
    title: "Outdoor spaces",
    copy: (
      <>
        Tree lighting, courtyard lighting, festoon over terraces and garden party lighting keep
        outdoor areas connected after dark — so guests drift outside naturally, not because the music
        stopped.
      </>
    ),
  },
  {
    icon: Music2,
    title: "Dancefloor & energy",
    copy: (
      <>
        Mirror balls, moving heads, DJ lighting and white dancefloor lighting that gives the floor
        momentum without tacky disco effects. We often pair this with our{" "}
        <Link href="/artists/djs/" className={linkClass}>
          private party DJs
        </Link>
        .
      </>
    ),
  },
  {
    icon: Moon,
    title: "Late-night atmosphere",
    copy: (
      <>
        Fire pits, festoon, chill-out spaces and softer outdoor lighting for the hours when energy
        dips but conversation continues. See our{" "}
        <Link href="/services/fire-pit-hire/" className={linkClass}>
          fire pit hire
        </Link>{" "}
        for outdoor gathering spaces.
      </>
    ),
  },
];

const toolkitServices = [
  {
    id: "mirror-ball",
    title: "Mirror Ball Clusters",
    description:
      "Mirror ball hire for dancefloors that feel alive — clusters and glitterballs that catch the light without turning the room into a school disco.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162930/Mirrorball-Cluster-Glitterball-Clusters_mwjd8x.jpg",
    alt: "Mirrorball cluster and glitterball clusters creating disco atmosphere on the dance floor",
    galleryCategory: "dance-floor",
  },
  {
    id: "festoon",
    title: "Edison Vintage Festoons",
    description:
      "Festoon lighting for marquees, courtyards and terraces — warm, nostalgic light that makes outdoor party lighting feel intentional, not improvised.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163791/Edison-Vintage-Festoon-on-a-hot-night_qlolnk.jpg",
    alt: "Edison vintage festoon lighting strung outdoors on a warm summer night",
    galleryCategory: "festoon",
  },
  {
    id: "uplighting",
    title: "LED Architectural Uplighting",
    description:
      "Architectural uplighting that highlights venue features — amber, warm white and considered colour washes that flatter the room and the guests.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162636/IMG_8030_b5un4j.jpg",
    alt: "LED architectural uplighting for venues",
    galleryCategory: "atmospheric",
  },
  {
    id: "fairy-tunnel",
    title: "Fairy Light Tunnels",
    description:
      "Magical entrances and pathways — fairy light tunnels that transform arrival into an experience and guide guests naturally into the party.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg",
    alt: "Fairy light tunnel creating spectacular entrance for weddings and evening events",
    galleryCategory: "festoon",
  },
];

const whatLightingChanges = [
  "Makes empty spaces feel designed, not hired",
  "Helps guests move naturally between areas",
  "Keeps outdoor spaces connected after dark",
  "Makes photos look warmer and more atmospheric",
  "Turns a marquee or barn into a proper party room",
  "Gives the dancefloor energy without tacky disco effects",
];

const setupRange = [
  {
    title: "Simple dancefloor setup",
    detail: "Mirror balls, DJ lighting and white dancefloor lighting — enough to give the floor energy without overcomplicating the room.",
  },
  {
    title: "Architectural uplighting",
    detail: "Warm uplighting for dining rooms, barns and marquees — flattering light that makes architecture and guests look their best.",
  },
  {
    title: "Outdoor festoon & tree lighting",
    detail: "Festoon, tree lighting and courtyard lighting for terraces, gardens and lawns — outdoor party lighting that keeps guests outside.",
  },
  {
    title: "Full venue transformation",
    detail: "Arrival tunnels, dining light, outdoor zones and dancefloor production planned together — event lighting design for estates and marquee weekends.",
  },
];

const venueSpotlights = [
  {
    venue: "Babington House",
    tagline: "Intimate zones across a members' club estate",
    challenge:
      "A Soho House estate with multiple rooms, terraces and outdoor spaces — guests move between areas all evening, and each zone needs to feel connected.",
    approach:
      "Vintage Edison festoons, bush lights and atmospheric uplighting across the grounds — creating intimate pockets rather than one flat wash of light.",
    effect:
      "Spaces feel linked rather than disconnected. Guests stay outside for drinks and drift naturally between areas instead of clustering in one room.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163784/babs-bush-lights_ria-mishaal-photography_01_wvrfst.jpg",
        alt: "Babington House bush lights and festoon lighting – Ria Mishaal Photography",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733527/Babington-House-mini-chill-out-camp_lrjeoi.jpg",
        alt: "Babington House mini chill-out camp with atmospheric lighting and festoons",
      },
    ],
  },
  {
    venue: "Pennard House",
    tagline: "Architecture that glows, alfresco that stays alive",
    challenge:
      "Stunning architecture that needed to feel warm for an evening event — plus alfresco dining areas that would lose atmosphere once the sun dropped.",
    approach:
      "Amber architectural uplighting on the house, festoon lighting for the pizzarova area and tree lighting for outdoor dining — each layer serving a different part of the evening.",
    effect:
      "The house glows warmly from outside. Outdoor dining stays part of the party rather than an add-on people forget about after dark.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768731384/Pennard-House-Lighting-with-Amber-Up-lighting_sljvaa.jpg",
        alt: "Pennard House with amber uplighting highlighting architectural details",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg",
        alt: "Pennard House festoon lighting and pizzarova alfresco dining area",
      },
    ],
  },
  {
    venue: "The Newt",
    tagline: "First wedding, memorable arrival",
    challenge:
      "A prestigious Somerset estate hosting its first wedding — the entrance and barn needed to feel intentional, not like empty event space waiting to be filled.",
    approach:
      "A fairy light tunnel for arrival, plus over 800 metres of fairy lights in the Threshing Barn — marquee lighting at scale, designed around how guests actually move through the estate.",
    effect:
      "Guests arrive into something memorable. The barn transforms from working space to proper party room — and photos capture warmth the daylight never would.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg",
        alt: "The Newt Somerset wedding venue with fairy light tunnel installation",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162325/The-Newt-Somerset-we-used-over-800-metres-of-fairy-lights-for-the-Threshing-Barn_xa47ry.jpg",
        alt: "The Newt Somerset Threshing Barn with over 800 metres of fairy lights",
      },
    ],
  },
];

const FAQ_ITEMS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Can you provide simple dancefloor lighting?",
    answer:
      "Yes. Not every party needs a full production. We regularly supply simple dancefloor lighting setups — mirror balls, DJ lighting and white dancefloor lighting designed to give the floor energy without tacky disco effects.",
  },
  {
    question: "Do you provide outdoor party lighting?",
    answer: (
      <>
        Yes. Outdoor party lighting is a core part of what we do — festoon, tree lighting, courtyard
        lighting and garden party lighting that keeps terraces and lawns connected to the party after
        dark. It pairs naturally with{" "}
        <Link href="/parties/private-parties/" className={linkClass}>
          private party production
        </Link>
        .
      </>
    ),
  },
  {
    question: "Can you light trees, courtyards and gardens?",
    answer:
      "Yes. Tree lighting, courtyard lighting and garden lighting are among our most requested services — especially for barn parties, marquee weekends and estate celebrations where guests move between indoor and outdoor spaces.",
  },
  {
    question: "Can lighting be added to a DJ booking?",
    answer: (
      <>
        Yes. We often combine party lighting with{" "}
        <Link href="/artists/djs/" className={linkClass}>
          DJ bookings
        </Link>{" "}
        so music and lighting are planned together — dancefloor lighting, mirror balls and atmospheric
        room light from one experienced team.
      </>
    ),
  },
  {
    question: "Do you provide lighting for marquees and barns?",
    answer:
      "Yes. Marquee lighting and barn lighting are regular requests — festoon, uplighting and fairy lights that turn a temporary structure or empty barn into a proper party room.",
  },
  {
    question: "Do you install and remove the lighting?",
    answer:
      "Yes. Delivery, installation and removal are included. We assess your venue, install before guests arrive and collect afterwards — so you focus on hosting, not cables and ladders.",
  },
  {
    question: "How early should we enquire?",
    answer: (
      <>
        Popular summer dates and marquee weekends book early — especially when you need tree
        lighting, courtyard lighting or a full estate-wide design. Enquire via our{" "}
        <Link href="/contact-us/" className={linkClass}>
          contact page
        </Link>{" "}
        as soon as you have a date and venue in mind.
      </>
    ),
  },
];

const filterablePhotos: Photo[] = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg", alt: "Romantic fairy light tunnel entrance for garden weddings", width: 1200, height: 900, eventTypes: ["weddings", "outdoor"], venue: "Various", serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163529/Wedding-Tree-Lighting_pgzhix.jpg", alt: "Wedding tree lighting with fairy lights for magical outdoor setting", width: 1200, height: 900, eventTypes: ["weddings", "outdoor"], serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768740556/Albert-Palmer-Photography-001-2-e1642519560978_yjkunf.jpg", alt: "Wedding reception with festoon and outdoor lighting – Albert Palmer Photography", width: 1200, height: 900, eventTypes: ["weddings"], serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742527/Church-Exterior-Lighting_a8rzbd.jpg", alt: "Church exterior lighting for evening wedding ceremony", width: 1200, height: 900, eventTypes: ["weddings"], serviceType: "atmospheric" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768739479/EXTERIOR-DINING-TREE-LIGHTING_ur4vlb.jpg", alt: "Exterior dining with tree lighting for alfresco wedding or corporate dinner", width: 1200, height: 900, eventTypes: ["weddings", "corporate", "outdoor"], serviceType: "atmospheric" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163720/A-Big-Lazer-e1430894875463_xgpiil.jpg", alt: "Laser lighting on dance floor for corporate party or celebration", width: 1200, height: 900, eventTypes: ["corporate", "outdoor"], serviceType: "dance-floor" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg", alt: "Hedsor House dance floor with DJ and sax – corporate event entertainment", width: 1200, height: 900, eventTypes: ["corporate"], venue: "Hedsor House", serviceType: "dance-floor" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163648/Party-dj-lighting_tuh8hm.jpg", alt: "Party DJ lighting for corporate or private celebrations", width: 1200, height: 900, eventTypes: ["corporate", "outdoor"], serviceType: "dance-floor" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163791/Edison-Vintage-Festoon-on-a-hot-night_qlolnk.jpg", alt: "Edison vintage festoon lighting for outdoor corporate or private events", width: 1200, height: 900, eventTypes: ["outdoor", "corporate"], serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg", alt: "Stretch marquee with festoon lights for outdoor weddings or events", width: 1200, height: 900, eventTypes: ["weddings", "outdoor"], serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162715/Kin-House-Exterior-Terrace-Lighting_lxvlpk.jpg", alt: "Kin House exterior terrace mood lighting for evening events", width: 1200, height: 900, eventTypes: ["weddings", "corporate", "outdoor"], venue: "Kin House", serviceType: "atmospheric" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162636/IMG_8030_b5un4j.jpg", alt: "Atmospheric mood lighting for wedding or party venue", width: 1200, height: 900, eventTypes: ["weddings", "corporate"], serviceType: "atmospheric" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768749164/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg", alt: "Wedding celebration with professional lighting – Martin Beddall Photography", width: 1200, height: 900, eventTypes: ["weddings"], serviceType: "dance-floor" },
];

export default function PartyLightingClient() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [filter, setFilter] = useState<EventFilter>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const advanceHero = useCallback(() => {
    setHeroIndex((i) => (i + 1) % heroMoodImages.length);
  }, []);
  useEffect(() => {
    const t = setInterval(advanceHero, 5000);
    return () => clearInterval(t);
  }, [advanceHero]);

  const filteredPhotos = filter === "all" ? filterablePhotos : filterablePhotos.filter((p) => p.eventTypes.includes(filter));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {heroMoodImages.map((image, i) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === heroIndex ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={i !== heroIndex}
            >
              <Image
                src={i === 0 ? LCP_HERO_URL : image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : "auto"}
                quality={85}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 pointer-events-none z-[1]" />
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-10 lg:p-12 max-w-4xl">
          <div className="inline-block mb-4 px-4 py-1.5 bg-champagne-gold/10 rounded-full border border-champagne-gold/30 backdrop-blur-sm">
            <span className="text-xs sm:text-sm font-semibold text-champagne-gold tracking-wider uppercase">
              Trusted at Babington House since 2003
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
            Party Lighting
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mb-6 drop-shadow-md">
            From simple dancefloor lighting to exterior tree lighting, courtyard lighting, festoon,
            mirror balls and full venue transformations — atmospheric party lighting designed around
            how your guests use the space.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-3">
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
              <Link href="/parties/private-parties/">Private Parties</Link>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 drop-shadow-md">
            20+ years · Party lighting hire · South West, London &amp; UK-wide
          </p>
        </div>

        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2 z-20">
          {heroMoodImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === heroIndex ? "true" : undefined}
            >
              <span
                className={`block w-2 h-2 rounded-full transition-all ${
                  i === heroIndex ? "bg-champagne-gold w-6" : "bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => setHeroIndex((i) => (i - 1 + heroMoodImages.length) % heroMoodImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 min-w-[48px] min-h-[48px] rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" aria-hidden />
        </button>
        <button
          onClick={() => setHeroIndex((i) => (i + 1) % heroMoodImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 min-w-[48px] min-h-[48px] rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" aria-hidden />
        </button>
      </section>

      {/* After 20 Years Of Lighting Parties */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              After 20 Years Of Lighting Parties&hellip;
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                The biggest mistake is treating lighting as decoration. Great lighting directs
                attention, creates atmosphere and changes how guests use a space.
              </p>
              <p>
                It can make a marquee feel intimate, a barn feel magical, a courtyard feel connected
                and a dancefloor feel irresistible. That is what{" "}
                <Link href="/parties/private-parties/" className={linkClass}>
                  event lighting design
                </Link>{" "}
                means to us — not filling a room with kit, but shaping how the evening unfolds.
              </p>
              <p>
                We have learned this over two decades at Babington House, Pennard House, The Newt and
                hundreds of private parties — from a simple mirror ball on a dancefloor to
                estate-wide tree lighting and courtyard festoon. The scale changes; the principle
                does not.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How We Light A Party */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How We Light A Party</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Party lighting hire planned around how guests actually move through your evening — not
              a product catalogue.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howWeLightParty.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="bg-white/5 backdrop-blur border-champagne-gold/30 hover:border-champagne-gold/50 transition-all h-full">
                  <CardContent className="p-8">
                    <item.icon className="w-10 h-10 text-champagne-gold mb-5" />
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.copy}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exterior Lighting That Connects The Party */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Trees className="w-8 h-8 text-champagne-gold" />
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Exterior Lighting That Connects The Party
              </h2>
            </div>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                Most DJs stop at the dancefloor. We do not. Tree lighting, courtyard lighting,
                terraces, pathways and arrival routes — outdoor party lighting planned so guests move
                naturally between spaces instead of clustering in one room.
              </p>
              <p>
                When the dining room, terrace and garden all feel part of the same evening, people
                drift outside for one more drink without the party splitting in two. Festoon over a
                courtyard, fairy lights in the trees, pathway lighting to the marquee — each layer
                guides movement and keeps the atmosphere connected after dark.
              </p>
              <p>
                It is one of the things we are asked for most at barn parties, marquee weekends and
                estate celebrations — and one of the reasons clients book us alongside{" "}
                <Link href="/artists/djs/" className={linkClass}>
                  DJ and production
                </Link>{" "}
                rather than a hire company that drops kit and leaves.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Toolkit – reframed */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Tools We Use To Create Those Moments</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Mirror balls, festoon, uplighting and fairy tunnels — each chosen for what it does to a
            space, not just what it is. For wedding-specific design, see our{" "}
            <Link href="/weddings/wedding-lighting/" className={linkClass}>
              wedding lighting
            </Link>{" "}
            page.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {toolkitServices.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <Link
                      href="#gallery"
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-3 bg-champagne-gold text-black font-medium rounded-lg hover:bg-gold-light transition-colors"
                      aria-label={`View ${service.title} gallery`}
                    >
                      View Gallery
                      <ExternalLink className="w-4 h-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  {service.id === "mirror-ball" && <Sparkles className="w-8 h-8 text-champagne-gold" />}
                  {service.id === "festoon" && <Sun className="w-8 h-8 text-champagne-gold" />}
                  {service.id === "uplighting" && <Lightbulb className="w-8 h-8 text-champagne-gold" />}
                  {service.id === "fairy-tunnel" && <Sparkles className="w-8 h-8 text-champagne-gold" />}
                  <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What Party Lighting Can Change */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Party Lighting Can Change</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Lighting is not decoration. It changes how guests experience a party.
            </p>
          </motion.div>

          <ul className="space-y-4">
            {whatLightingChanges.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-gray-900/60 border border-champagne-gold/20"
              >
                <Check className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-lg">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Simple Setup To Full Transformation */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Setup To Full Transformation</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Not every party needs a huge production. Tell us what you are celebrating and we will
              recommend the right level of party lighting hire — honest advice, not upselling.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {setupRange.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="bg-gray-900/80 border-champagne-gold/20 h-full">
                  <CardContent className="p-6">
                    <h3 className="text-champagne-gold font-semibold text-lg mb-3">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto text-center mt-12">
            Some clients need a simple dancefloor setup. Others want tree lighting, courtyards,
            dining spaces and outdoor zones linked together. We help you spend money where guests
            will notice the difference most.
          </p>
        </div>
      </section>

      {/* Venue Spotlights */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Venue Spotlights</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The challenge, the lighting approach and the effect on the party — at venues we know well.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-20">
          {venueSpotlights.map((spotlight) => (
            <motion.article
              key={spotlight.venue}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <span className="text-champagne-gold text-sm font-medium tracking-wide uppercase">
                  {spotlight.venue}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">{spotlight.tagline}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="p-5 rounded-lg bg-gray-900/60 border border-white/10">
                  <h4 className="text-champagne-gold font-semibold mb-2 uppercase tracking-wide text-xs">The challenge</h4>
                  <p className="text-gray-300 leading-relaxed">{spotlight.challenge}</p>
                </div>
                <div className="p-5 rounded-lg bg-gray-900/60 border border-white/10">
                  <h4 className="text-champagne-gold font-semibold mb-2 uppercase tracking-wide text-xs">The lighting approach</h4>
                  <p className="text-gray-300 leading-relaxed">{spotlight.approach}</p>
                </div>
                <div className="p-5 rounded-lg bg-gray-900/60 border border-white/10">
                  <h4 className="text-champagne-gold font-semibold mb-2 uppercase tracking-wide text-xs">The effect on the party</h4>
                  <p className="text-gray-300 leading-relaxed">{spotlight.effect}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {spotlight.images.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Gallery with filters */}
      <section id="gallery" className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 scroll-mt-28">
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Browse by Event</h2>
          <p className="text-gray-400 text-lg mb-8">
            Find the lighting style that matches your event. Filter without reloading.
          </p>

          <div className="flex flex-wrap gap-3">
            {(["all", "weddings", "corporate", "outdoor"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`min-h-[44px] px-5 py-3 rounded-full font-medium transition-all ${
                  filter === f
                    ? "bg-champagne-gold text-black"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
                aria-pressed={filter === f}
                aria-label={f === "all" ? "Show all events" : `Filter by ${f}`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, i) => (
              <motion.div
                key={photo.src + i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-sm text-white/90 line-clamp-2">{photo.alt}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-gray-900/60 border-champagne-gold/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                    <div className="text-gray-300 leading-relaxed">{item.answer}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900/50 border-t border-champagne-gold/20">
        <div className="max-w-3xl mx-auto text-center">
          <Lightbulb className="w-10 h-10 text-champagne-gold mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Planning Lighting For Your Party?</h2>
          <p className="text-gray-200 text-lg mb-8 leading-relaxed">
            Tell us what you are celebrating, where it is happening and how you want the space to
            feel — we will reply with honest ideas about party lighting hire and a clear next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/contact-us/">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10">
              <Link href="tel:+447970793177">Call 07970 793177</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={filteredPhotos}
      />
    </div>
  );
}
