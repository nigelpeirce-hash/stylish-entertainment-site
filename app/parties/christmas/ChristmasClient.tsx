"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  Gift,
  Heart,
  Lightbulb,
  Mic,
  Music,
  Sparkles,
  Trophy,
  Users,
  Wine,
} from "lucide-react";

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const christmasPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162638/IMG_6124_reoaew.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party celebration with professional lighting and festive atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162642/Kilver-Court-3_yyawfu.jpg",
    width: 1200,
    height: 900,
    alt: "Kilver Court venue with elegant Christmas party lighting and sophisticated holiday decorations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162231/IMG_8604_anypjx.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party event with beautiful lighting design and festive entertainment atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162468/IMG_8564_pz0zvq.jpg",
    width: 1200,
    height: 900,
    alt: "Festive Christmas celebration with professional party lighting and elegant venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163055/IMG_8559_mvpels.jpg",
    width: 1200,
    height: 900,
    alt: "Christmas party with atmospheric lighting and professional entertainment creating a magical holiday celebration",
  },
];

const after20YearsPoints = [
  "The best Christmas parties do not start when dancing starts. They begin when guests arrive.",
  "The room feels warm. The lighting feels inviting. People reconnect over a drink.",
  "Conversations happen naturally. Speeches land properly. The energy builds without being forced.",
  "The dancefloor is simply the final chapter — the payoff for an evening planned with care.",
  "The best Christmas parties feel effortless because the atmosphere has been carefully planned from the beginning.",
];

const whyChristmasMattersCards = [
  { Icon: Heart, title: "A thank you", detail: "Recognition the team has earned." },
  { Icon: Trophy, title: "A reward", detail: "A proper end to a demanding year." },
  { Icon: Sparkles, title: "A celebration", detail: "Achievements shared in one room." },
  { Icon: Users, title: "A chance to reconnect", detail: "Colleagues outside the everyday." },
];

const christmasPartyThemes = [
  {
    title: "Alpine Lodge",
    copy: "Rustic warmth, forest backdrops and cosy lounge areas — a company Christmas party that feels like an escape.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162256/Xmas1_ghqir1.jpg",
    alt: "Alpine lodge Christmas party theme with snowy forest backdrop and rustic lounge seating",
  },
  {
    title: "Winter Wonderland",
    copy: "Cool tones, fairy lights and transformed spaces — festive event production that feels magical from arrival.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162468/IMG_8564_pz0zvq.jpg",
    alt: "Winter wonderland Christmas party with festive lighting and elegant venue styling",
  },
  {
    title: "Après Ski",
    copy: "Relaxed energy, warm lighting and a celebratory mood — ideal for teams who want fun without formality.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162231/IMG_8604_anypjx.jpg",
    alt: "Après ski themed Christmas party with warm festive lighting and relaxed celebration atmosphere",
  },
  {
    title: "Christmas Disco",
    copy: "Mirror balls, dancefloor energy and lighting that builds — when the brief calls for a proper party payoff.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163055/IMG_8559_mvpels.jpg",
    alt: "Christmas disco party with dancefloor lighting and festive celebration atmosphere",
  },
  {
    title: "Black Tie Winter Gala",
    copy: "Elegant dining, awards and sophisticated entertainment — winter gala production with polish and restraint.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162642/Kilver-Court-3_yyawfu.jpg",
    alt: "Black tie winter gala Christmas party with elegant venue lighting and formal celebration styling",
  },
  {
    title: "Christmas Festival Party",
    copy: "Live energy, bold lighting and a crowd-ready atmosphere — for teams who want the dancefloor to take off.",
    image:
      "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162638/IMG_6124_reoaew.jpg",
    alt: "Christmas festival party with professional lighting and high-energy festive entertainment",
  },
];

const bookingTimeline = [
  {
    period: "Summer",
    status: "Ideal",
    detail: "The best time to plan December corporate Christmas parties — venues, themes and production sorted without the rush.",
    statusClass: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  },
  {
    period: "September",
    status: "Still a good choice",
    detail: "Plenty of availability for company Christmas parties — enquire early if you want premium Friday and Saturday dates.",
    statusClass: "text-champagne-gold border-champagne-gold/40 bg-champagne-gold/10",
  },
  {
    period: "October",
    status: "Limited availability",
    detail: "Popular dates begin to fill. We can often still help, but choice of DJs, bands, lighting and production narrows.",
    statusClass: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  },
  {
    period: "November",
    status: "Often late for premium dates",
    detail: "We will always be honest about what is still possible — but the best Christmas party production is rarely booked last-minute.",
    statusClass: "text-gray-400 border-gray-500/40 bg-gray-800/60",
  },
];

const greatPartyElements = [
  {
    title: "Arrival",
    detail: "First impressions matter — lighting, music and welcome that sets a festive tone without rushing the room.",
  },
  {
    title: "Food & Drink",
    detail: "People settle into the evening. Background that supports conversation, not competes with it.",
  },
  {
    title: "Atmosphere",
    detail: "Lighting, music and room design working together — winter warmth, not a generic function room.",
  },
  {
    title: "Entertainment",
    detail: "Supporting the celebration, not dominating it — chosen for your audience and company culture.",
  },
  {
    title: "The Dancefloor",
    detail: "The payoff at the end of the night — when the room is ready, not when entertainment is forced on too early.",
  },
];

const christmasPartiesWeProduce: Array<{ Icon: typeof Building2; title: string; copy: ReactNode }> = [
  {
    Icon: Building2,
    title: "Corporate Christmas parties",
    copy: (
      <>
        Team celebrations with{" "}
        <Link href="/artists/djs/" className={linkClass}>
          Christmas party DJs
        </Link>
        ,{" "}
        <Link href="/artists/musicians/" className={linkClass}>
          live bands
        </Link>{" "}
        and production — end-of-year energy that still reflects your company properly.
      </>
    ),
  },
  {
    Icon: Users,
    title: "Office Christmas parties",
    copy: "DJs, bands and production that works in hotels, venues and converted office spaces — sound, timings and guest flow handled professionally.",
  },
  {
    Icon: Wine,
    title: "Client entertaining",
    copy: "Sophisticated festive hospitality with the right balance of energy and professionalism — atmosphere first, not loud entertainment dominating dinner.",
  },
  {
    Icon: Trophy,
    title: "Winter galas",
    copy: "Formal celebrations, awards evenings and fundraising events — live bands, presentations, walk-up music, lighting and celebration managed as one programme.",
  },
  {
    Icon: Gift,
    title: "Private Christmas parties",
    copy: (
      <>
        Luxury festive celebrations at home, in marquees and private venues — see our{" "}
        <Link href="/party-planning-and-organising/" className={linkClass}>
          private event production
        </Link>{" "}
        approach applied to winter.
      </>
    ),
  },
  {
    Icon: Sparkles,
    title: "Shared party nights",
    copy: "DJs, bands and production support for larger hospitality events — multiple companies, one polished festive experience.",
  },
];

const dinnerToDancefloorPhases = [
  { label: "Arrival drinks", detail: "Festive welcome — acoustic or background music, warm lighting and a room that already feels like a celebration." },
  { label: "Dinner", detail: "Atmosphere that supports conversation and thanks — lighting and sound adjusted for speeches and toasts." },
  { label: "Awards or speeches", detail: "Clear reinforcement, reliable playback and walk-up music where the programme needs it." },
  { label: "Live entertainment", detail: "Bands, musicians or performers when the brief suits — lifting energy without overwhelming the room." },
  { label: "Dancefloor", detail: "DJ or live band when the room is ready — the final chapter of one connected evening." },
  { label: "Late-night atmosphere", detail: "Keeping the celebration going for those who do not want the night to end — guest experience to the last song." },
];

const productionScaleItems = [
  "Christmas party DJ or live band",
  "DJ or band with festive lighting",
  "Live bands and musicians for corporate Christmas events",
  "Sound and microphones for speeches and awards",
  "Awards-night production",
  "Full Christmas party production — entertainment, lighting, sound and crew together",
];

const CHRISTMAS_FAQ_ITEMS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Do you provide DJs and bands for Christmas parties?",
    answer: (
      <>
        Yes. Our{" "}
        <Link href="/artists/djs/" className={linkClass}>
          Christmas party DJs
        </Link>{" "}
        and{" "}
        <Link href="/artists/musicians/" className={linkClass}>
          live bands
        </Link>{" "}
        are chosen for audience and atmosphere — company Christmas parties, office celebrations and
        private festive events. Music and production are planned together, not as a last-minute add-on.
      </>
    ),
  },
  {
    question: "Can you provide sound for speeches and awards?",
    answer:
      "Yes. PA, microphones and playback for speeches, awards and presentations — essential for corporate Christmas parties and winter galas where the programme matters as much as the party.",
  },
  {
    question: "Can you provide festive lighting?",
    answer: (
      <>
        Yes. Warm amber uplighting, fairy lights, mirror balls, dining atmosphere and dancefloor
        energy — see our{" "}
        <Link href="/parties/party-lighting/" className={linkClass}>
          Christmas party lighting
        </Link>{" "}
        approach. Experience-led, not an equipment catalogue.
      </>
    ),
  },
  {
    question: "Do you provide live musicians?",
    answer:
      "Yes. Live musicians, bands and performers where the brief suits — curated for the audience, alongside DJs and production when needed.",
  },
  {
    question: "Can you support corporate Christmas parties?",
    answer: (
      <>
        Yes. We produce corporate Christmas parties and company celebrations regularly — see our{" "}
        <Link href="/parties/corporate/" className={linkClass}>
          corporate event production
        </Link>{" "}
        page for the wider B2B approach; Christmas is often the most important date in the calendar.
      </>
    ),
  },
  {
    question: "Can you help with private Christmas parties?",
    answer: (
      <>
        Yes. Luxury private Christmas parties at home, in marquees and festive venues — production and
        atmosphere shaped for your guest list, not a generic Christmas package.
      </>
    ),
  },
  {
    question: "Do you travel outside Somerset and Wiltshire?",
    answer:
      "Yes. Our heartland is the South West, but we work across London, the Home Counties and UK-wide for Christmas parties and winter galas — especially for dates that book early.",
  },
  {
    question: "How early should we book our Christmas party?",
    answer: (
      <>
        Summer is ideal for December corporate parties; September still offers good choice, but
        popular Friday and Saturday dates fill quickly from October onwards. Enquire as soon as your
        venue and date are confirmed via our{" "}
        <Link href="/contact-us/" className={linkClass}>
          contact page
        </Link>
        ; we will reply with honest recommendations and availability.
      </>
    ),
  },
];

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const snowflakes = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  delay: Number((pseudoRandom(i + 1) * 5).toFixed(2)),
  duration: Number((10 + pseudoRandom(i + 2) * 10).toFixed(2)),
  left: `${(pseudoRandom(i + 3) * 100).toFixed(2)}%`,
}));

const Snowflake = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <div
    className="christmas-snowflake absolute w-1 h-1 rounded-full bg-white/30"
    style={{
      left,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    }}
  />
);

const SnowfallAnimation = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden md:block" aria-hidden="true">
      {snowflakes.map((snowflake) => (
        <Snowflake
          key={snowflake.id}
          delay={snowflake.delay}
          duration={snowflake.duration}
          left={snowflake.left}
        />
      ))}
    </div>
  );
};

export default function ChristmasClient() {
  return (
    <div className="relative">
      <SnowfallAnimation />

      {/* Hero */}
      <section className="relative min-h-[60vh] min-h-[440px] flex items-center justify-center text-white overflow-hidden md:min-h-[70vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162256/Xmas1_ghqir1.jpg"
            alt="Winter wonderland Christmas party production — alpine lodge styling, festive lighting and elegant dining atmosphere"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/55 to-gray-950/90" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52 pb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Christmas Party Production
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-champagne-gold font-semibold px-4 drop-shadow-md mb-4 max-w-3xl mx-auto leading-snug">
            The night your team talks about until next Christmas.
          </p>
          <p className="text-base sm:text-lg text-gray-200 px-4 drop-shadow-md mb-8 max-w-2xl mx-auto leading-relaxed">
            Sound, lighting, DJs, bands and production for company Christmas parties, winter galas
            and festive celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Request a Christmas Proposal</Link>
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
            20+ years creating Christmas celebrations · Trusted venues · UK-wide
          </p>
        </motion.div>
      </section>

      <div
        style={{
          background:
            "radial-gradient(circle at center, rgb(17 24 39) 0%, rgb(3 7 18) 50%, rgb(2 6 23) 100%)",
        }}
      >
        {/* Why Christmas Parties Matter */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8 relative">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Why Christmas Parties Matter
              </h2>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-10">
                The Christmas party is often the only time the whole team gathers outside work — and
                for many companies, the most important celebration of the year.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
                {whyChristmasMattersCards.map(({ Icon, title, detail }, index) => (
                  <div
                    key={title}
                    className={`flex flex-col items-center text-center p-4 sm:p-6 rounded-xl bg-gray-900/70 border border-champagne-gold/25 hover:border-champagne-gold/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.12)] transition-all${
                      index >= 2 ? " hidden md:flex" : ""
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-champagne-gold/10 border border-champagne-gold/30 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-champagne-gold" />
                    </div>
                    <p className="text-champagne-gold font-bold text-sm sm:text-base leading-snug mb-2">
                      {title}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                People are not buying a DJ. They are buying a reward for the team, a chance to
                celebrate achievements, an opportunity to entertain clients and a memorable end to
                the year.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed max-w-2xl mx-auto">
                The atmosphere matters because people remember how the night felt long after the
                decorations have gone away.
              </p>
            </motion.div>
          </div>
        </section>

        {/* After 20 Years Of Christmas Parties… */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                After 20 Years Of Christmas Parties&hellip;
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

        {/* What Makes A Great Christmas Party? */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                What Makes A Great Christmas Party?
              </h2>
              <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">
                Great Christmas parties are built gradually — not switched on in one moment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {greatPartyElements.map((item, index) => (
                  <div
                    key={item.title}
                    className={`p-5 rounded-xl bg-gray-900/60 border border-champagne-gold/20${
                      index >= 2 ? " hidden md:block" : ""
                    }`}
                  >
                    <h3 className="text-champagne-gold font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Christmas Parties We Produce */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8 bg-gray-950/50 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Christmas Parties We Produce
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Festive event production for corporate Christmas parties, office celebrations, winter
                galas and luxury private Christmas parties across Somerset, Wiltshire and UK-wide.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {christmasPartiesWeProduce.map(({ Icon, title, copy }, index) => (
                <Card
                  key={title}
                  className={`bg-gray-900/70 border border-champagne-gold/20 hover:border-champagne-gold/40 transition-colors${
                    index >= 2 ? " hidden md:block" : ""
                  }`}
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

        {/* Popular Christmas Party Themes */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                Popular Christmas Party Themes
              </h2>
              <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
                We have spent twenty years creating themed Christmas celebrations — a few directions
                clients often explore when planning a company Christmas party or winter gala.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {christmasPartyThemes.map((theme, index) => (
                  <Card
                    key={theme.title}
                    className={`bg-gray-900/70 border border-champagne-gold/20 overflow-hidden hover:border-champagne-gold/40 transition-colors${
                      index >= 2 ? " hidden md:block" : ""
                    }`}
                  >
                    <div className="relative h-36 sm:h-40">
                      <Image
                        src={theme.image}
                        alt={theme.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
                    </div>
                    <CardContent className="p-4 sm:p-5">
                      <h3 className="text-lg font-bold text-champagne-gold mb-2">{theme.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{theme.copy}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8 bg-gray-950">
          <div className="container mx-auto max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <ImageCarousel images={christmasPhotos} mobileVisibleCount={4} viewAllHref="/galleries/" />
            </motion.div>
          </div>
        </section>

        {/* Service sections — text only, images live in hero, themes and gallery */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8 bg-slate-950">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <Music className="w-6 h-6" />
                    Entertainment For Every Celebration
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    <Link href="/artists/djs/" className={linkClass}>
                      DJs
                    </Link>
                    ,{" "}
                    <Link href="/artists/musicians/" className={linkClass}>
                      bands
                    </Link>
                    , musicians, live performers and our festival trio — selected to suit the audience
                    and atmosphere, not chosen from a catalogue because it is Christmas.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    Background music for client entertaining, live bands for winter galas, energy for
                    the dancefloor — Christmas party entertainment planned for how your guests actually
                    behave, not a generic festive playlist.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6" />
                    Festive Lighting Design
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    Warm amber uplighting, fairy lights, mirror balls, dining atmosphere and winter
                    warmth — Christmas party lighting that transforms barns, marquees, hotels and
                    private homes into spaces guests want to stay in.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    We focus on guest experience and venue transformation, not equipment lists. See{" "}
                    <Link href="/parties/party-lighting/" className={linkClass}>
                      party lighting
                    </Link>{" "}
                    and{" "}
                    <Link href="/services/venue-styling/" className={linkClass}>
                      venue styling
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hidden md:block">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    Production &amp; Coordination
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    Managing entertainment, lighting, timings and supplier coordination so organisers
                    can enjoy the evening — Christmas party production, not generic event planning from
                    a checklist.
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    We work with venues, caterers and in-house teams so the celebration runs as one
                    connected experience from arrival drinks to the last dance.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hidden md:block">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-champagne-gold mb-4 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Trusted Experience
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    For more than twenty years we have helped create Christmas celebrations at
                    prestigious venues including{" "}
                    <Link href="/venues/babington-house/" className={linkClass}>
                      Babington House
                    </Link>
                    .
                  </p>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    That experience means honest advice, reliable delivery and production that reflects
                    well on your company — whether the venue is a members&apos; club, a company hotel
                    or a marquee in a field.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* From Dinner To Dancefloor */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                From Dinner To Dancefloor
              </h2>
              <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">
                A successful Christmas event is one connected experience — not separate suppliers
                arriving at different times.
              </p>
              <div className="space-y-3">
                {dinnerToDancefloorPhases.map((phase, idx) => (
                  <div
                    key={phase.label}
                    className={`flex gap-4 p-4 rounded-lg bg-gray-900/70 border border-champagne-gold/15${
                      idx >= 3 ? " hidden md:flex" : ""
                    }`}
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

        {/* Simple Support To Full Christmas Party Production */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                Simple Support To Full Christmas Party Production
              </h2>
              <p className="text-gray-300 text-center mb-8 leading-relaxed">
                Not every Christmas brief needs the same scope. We scale from a DJ or band and PA for
                speeches to full festive event production — tell us what you need and we will be
                honest about the right fit.
              </p>
              <ul className="space-y-2">
                {productionScaleItems.map((item, idx) => (
                  <li
                    key={item}
                    className={`flex items-start gap-3 text-gray-300 text-sm sm:text-base leading-relaxed p-3 rounded-lg bg-gray-900/40 border border-champagne-gold/10${
                      idx >= 3 ? " hidden md:flex" : ""
                    }`}
                  >
                    <span className="text-champagne-gold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Popular Entertainment Option — Festival Trio */}
        <section className="hidden py-12 md:block md:py-28 px-3 sm:px-4 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/40">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                    <Mic className="w-6 h-6 text-champagne-gold" />
                    Popular Entertainment Option
                  </h3>
                  <h4 className="text-lg font-bold text-champagne-gold mb-3">
                    Festival Trio: DJ, Sax &amp; Bongos
                  </h4>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    A high-energy option for the right audience — DJ, sax and percussion bringing
                    festival feel to staff Christmas parties and company celebrations where the brief
                    suits live energy alongside professional mixing.
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    It is not the headline service and not right for every event. Client entertaining
                    and formal winter galas often need a different approach — recommendations are
                    always tailored to the brief.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* When Should You Book? */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8 bg-gray-950/60 border-y border-champagne-gold/10">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                When Should You Book?
              </h2>
              <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto leading-relaxed">
                Premium Friday and Saturday dates in November and December disappear quickly. The
                earlier you enquire, the more choice you have over Christmas party production,
                entertainment and lighting.
              </p>
              <div className="space-y-3">
                {bookingTimeline.map((item, idx) => (
                  <div
                    key={item.period}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-4 sm:p-5 rounded-xl bg-gray-900/70 border border-champagne-gold/15${
                      idx >= 2 ? " hidden md:flex" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 sm:w-44 shrink-0">
                      <Calendar className="w-5 h-5 text-champagne-gold shrink-0" />
                      <p className="text-white font-bold">{item.period}</p>
                    </div>
                    <span
                      className={`inline-flex self-start sm:self-center text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full border ${item.statusClass}`}
                    >
                      {item.status}
                    </span>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed sm:flex-1">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm text-center mt-8">
                Ready to secure your date?{" "}
                <Link href="/contact-us/" className={linkClass}>
                  Request a Christmas proposal
                </Link>
                .
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 md:py-28 px-3 sm:px-4 lg:px-8 bg-gray-950/50 border-t border-champagne-gold/10">
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
                {CHRISTMAS_FAQ_ITEMS.map((item, i) => (
                  <details
                    key={i}
                    className={`group rounded-xl border border-champagne-gold/20 bg-gray-900/60 overflow-hidden${
                      i >= 3 ? " hidden md:block" : ""
                    }`}
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
        <section className="py-16 px-3 sm:px-4 lg:px-8 relative">
          <div className="container mx-auto max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <CardContent className="p-8 sm:p-12 text-center">
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block mb-6"
                  >
                    <Sparkles className="w-16 h-16 text-champagne-gold" />
                  </motion.div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    Ready to plan the best night of your year?
                  </h3>
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                    Tell us about your company Christmas party, winter gala or private festive
                    celebration. We will reply with honest ideas and a clear next step — Christmas
                    party production for teams who want the atmosphere to do the talking.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <Button
                      asChild
                      size="lg"
                      className="min-h-[48px] bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    >
                      <Link href="/contact-us/">Request a Christmas Proposal</Link>
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
                    Also see{" "}
                    <Link href="/parties/corporate/" className={linkClass}>
                      corporate event production
                    </Link>{" "}
                    and{" "}
                    <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                      wedding entertainment
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
