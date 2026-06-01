"use client";

import type { ReactNode } from "react";
import { motion } from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlameKindling, Shield, Users, Cloud, Package, Check } from "lucide-react";

const CLOUDINARY_OPT = "f_auto,q_85,dpr_auto,w_1200";
const cdn = (path: string) =>
  `https://res.cloudinary.com/drtwveoqo/image/upload/${CLOUDINARY_OPT}/${path}`;

const LEAD_IMAGE = cdn("v1768163430/Fire-Pits-and-Marshmallows_ke3nk5.jpg");

const linkClass =
  "text-champagne-gold hover:text-gold-light underline underline-offset-2 transition-colors";

const GALLERY_IMAGES = [
  {
    src: cdn("v1768163378/Fire-pit-hire_bvuubu.jpg"),
    alt: "Wedding fire pit hire with hay-bale seating and rustic table styling outdoors",
  },
  {
    src: cdn("v1768163640/Firepit-Hire_xfvmzx.jpg"),
    alt: "Fire pits outside a stone manor with hay-bale seating and plaid blankets",
  },
  {
    src: cdn("v1768163072/Firepit-Hire-for-weddings-and-parties_u7pugi.jpg"),
    alt: "Guests gathered around fire pits in a courtyard at an evening wedding celebration",
  },
  {
    src: cdn("v1768163758/Festoon-and-Fairy-Fan-with-Fire-pits_ycu53m.jpg"),
    alt: "Festoon and fairy-light fan over a lawn with multiple fire pits at dusk",
  },
  {
    src: cdn("v1777634522/wild-west-party-02_aqqa1c.jpg"),
    alt: "Fire pit on a stone patio with festoon lighting, hay-bale seating and plaid blankets",
  },
  {
    src: cdn("v1768741476/Version_2_apydn6.jpg"),
    alt: "Manor house lawn at dusk with festoon lighting and multiple fire pits among guests",
  },
];

const WHY_COUPLES_BULLETS = [
  "Encourage conversation away from the noise of the dancefloor",
  "Create a focal point outdoors that draws people together",
  "Keep guests outside for longer instead of drifting indoors",
  "Extend the wedding evening atmosphere after dinner",
  "Great for autumn and winter weddings when outdoor wedding heating matters",
  "Perfect for marshmallows, cigars and late-night chats",
];

const FAQ_ITEMS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Are fire pits safe at weddings?",
    answer:
      "Yes — when they are set up and used properly. All our fire pits are professionally maintained and safety-checked with the same care we apply to our electrical equipment. We deliver and position them for your layout with safe distances from seating and structures in mind. Lighting and tending during the evening is normally handled by you, your venue or coordinator — we provide the equipment and guidance so you can manage them confidently.",
  },
  {
    question: "Do you supply fuel?",
    answer:
      "Fire-lighters and kindling are included in our standard package so you can light the pits on the night. Logs and additional fuel are available at extra cost, priced according to how long you want the fires burning — we will advise when you enquire so there are no surprises on the day.",
  },
  {
    question: "How many fire pits do we need?",
    answer:
      "It depends on your guest numbers and how you want the outdoor space to feel. One well-placed pit can anchor a wedding chill out area; larger lawns often benefit from two or three so conversation groups do not crowd each other. Tell us your layout and we will recommend a practical number for a natural wedding outdoor gathering space.",
  },
  {
    question: "Can fire pits be used on grass?",
    answer:
      "Often yes, with the right placement and protection. When we deliver, we assess the site and position each pit appropriately — grass, gravel, stone and paved areas are all common at country weddings. If a particular spot is not suitable, we will advise on alternatives before guests arrive.",
  },
  {
    question: "Do you provide setup and supervision?",
    answer:
      "Delivery, positioning and collection are included in our standard hire — we place the pits where you need them and collect afterwards. Staff to light, supervise or extinguish the fires through the evening are not included as standard; most couples arrange that through their venue, planner or a trusted member of the wedding party. Ask us when you enquire if you are unsure who should take responsibility on the night.",
  },
  {
    question: "Can fire pits be combined with festoon lighting?",
    answer: (
      <>
        They work beautifully together — and we often plan both as one outdoor picture. Warm
        festoon over a lawn or courtyard, fairy lights in trees, and fire pits below create the kind
        of wedding evening atmosphere guests remember. Ask us about a combined quote or see our{" "}
        <Link href="/weddings/wedding-lighting/" className={linkClass}>
          wedding lighting design
        </Link>{" "}
        page for the full range of outdoor options.
      </>
    ),
  },
];

export default function FirePitClient() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero — copy over lead image */}
      <section className="pt-24 md:pt-32 pb-10 md:pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-[5/6] sm:aspect-[16/10] md:aspect-[21/9] min-h-[420px] sm:min-h-0 rounded-xl overflow-hidden border border-champagne-gold/20 shadow-[0_0_24px_rgba(212,175,55,0.08)]">
            <Image
              src={LEAD_IMAGE}
              alt="Wedding fire pit with flames and marshmallow on a skewer — cosy evening atmosphere"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1152px"
              priority
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/65" />
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 py-10 md:px-12"
            >
              <FlameKindling
                className="w-12 h-12 text-champagne-gold mb-4 drop-shadow-lg"
                aria-hidden
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg px-2">
                Wedding Fire Pit Hire
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-2xl leading-relaxed drop-shadow-md">
                Wedding fire pit hire for couples who want more than a dancefloor — a warm outdoor
                space where guests linger, talk and stay part of the celebration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-gray-900/80">
        {/* Intro */}
        <section className="py-12 md:py-16 px-4 md:px-8">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Wedding fire pit hire for couples who want a second place to belong on the day — warm
              light, unhurried conversation and an outdoor gathering space that keeps guests part of
              the celebration after dinner.
            </p>
          </motion.div>
        </section>

        {/* Why Fire Pits Work So Well At Weddings */}
        <section className="py-12 md:py-16 px-4 md:px-8 border-t border-champagne-gold/10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-5">
              Why Fire Pits Work So Well At Weddings
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Once dinner is over, guests rarely move as one group. Some want the energy of the
                dancefloor; others want somewhere quieter to catch up with family and friends they
                have not seen all day.
              </p>
              <p>
                Without a deliberate outdoor space, that second group often slips away — back to
                their room, the car park or a corner indoors. Fire pits create a natural wedding
                outdoor gathering space: people pull up a chair, share a drink and stay in the mood
                of the day rather than leaving the celebration early.
              </p>
              <p>
                You are not trying to pull everyone off the dancefloor. You are giving the evening
                room to breathe so different personalities can enjoy the same wedding at their own
                pace.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Create A Second Atmosphere */}
        <section className="py-12 md:py-16 px-4 md:px-8 border-t border-champagne-gold/10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-5">
              Create A Second Atmosphere
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The best wedding evenings often run on two atmospheres at once. Inside, the
                dancefloor builds momentum — first dance, peak tracks, the friends you came to dance
                with. Outside, a softer wedding evening atmosphere takes over: flames, low light and
                conversations that do not need shouting.
              </p>
              <p>
                Fire pits help both thrive together. The dancers are not interrupted; the talkers are
                not bored. Parents, older relatives and friends who want a break from the bass still
                feel included because the outdoor social space is clearly part of the night, not an
                afterthought.
              </p>
              <p>
                That balance is especially valuable when you are planning entertainment and lighting
                as a whole — which is how we approach every booking alongside our{" "}
                <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                  wedding entertainment
                </Link>{" "}
                team.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Perfect With Lighting */}
        <section className="py-12 md:py-16 px-4 md:px-8 border-t border-champagne-gold/10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-5">Perfect With Lighting</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                A fire pit on its own adds warmth. Paired with thoughtful lighting, it becomes a
                destination — the kind of wedding chill out area guests photograph and gravitate
                towards all evening.
              </p>
              <p>
                <strong className="text-white font-semibold">Festoon lighting</strong> over a lawn or
                courtyard defines the space and makes it feel finished before anyone sits down.{" "}
                <strong className="text-white font-semibold">Fairy lights</strong> through beams,
                pergolas or marquees add intimacy at head height.{" "}
                <strong className="text-white font-semibold">Tree lighting</strong> lifts the eye
                line and stops outdoor areas feeling flat after sunset.
              </p>
              <p>
                We tie that together with practical{" "}
                <strong className="text-white font-semibold">outdoor seating areas</strong> — hay
                bales, benches or your own furniture — so the light and the flames work as one
                picture, not separate hires bolted on at the last minute.
              </p>
              <p>
                Fire pit hire Somerset couples often book alongside our lighting team. Explore{" "}
                <Link href="/weddings/wedding-lighting/" className={linkClass}>
                  wedding lighting design
                </Link>{" "}
                for uplighting, festoon, fairy lights and full outdoor schemes — or ask us to quote
                pits and lighting together when you enquire.
              </p>
            </div>
          </motion.div>
        </section>

        {/* On the night — safety & service cards */}
        <section className="py-12 md:py-20 px-3 sm:px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
                What Is Included
              </h2>
              <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
                Safety-checked pits, delivery and collection — plus fire-lighters and kindling so you
                can light them on the night. Evening staffing is not part of the standard hire.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/20 hover:border-champagne-gold/40 transition-all duration-300">
                  <CardHeader>
                    <Shield className="w-10 h-10 text-champagne-gold mb-3" aria-hidden />
                    <CardTitle className="text-white text-xl">Safety First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      All our fire pits are professionally maintained and safety-checked with the
                      same care we apply to our electrical equipment. Reliable setup you can trust
                      around guests and venues.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/20 hover:border-champagne-gold/40 transition-all duration-300">
                  <CardHeader>
                    <Users className="w-10 h-10 text-champagne-gold mb-3" aria-hidden />
                    <CardTitle className="text-white text-xl">The Social Hub</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      Perfect for guests who want to chat away from the dancefloor. Fire pits create
                      natural gathering points that encourage conversation and connection.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/20 hover:border-champagne-gold/40 transition-all duration-300">
                  <CardHeader>
                    <Cloud className="w-10 h-10 text-champagne-gold mb-3" aria-hidden />
                    <CardTitle className="text-white text-xl">All-Weather</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      Keeps the wedding evening going when the temperature drops. Fire pits extend
                      the celebration well past dinner.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/20 hover:border-champagne-gold/40 transition-all duration-300">
                  <CardHeader>
                    <Package className="w-10 h-10 text-champagne-gold mb-3" aria-hidden />
                    <CardTitle className="text-white text-xl">Standard Hire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      We supply the pits, fire-lighters and kindling, with delivery, positioning and
                      collection. Additional fuel for longer burn times can be quoted when you enquire.
                      Supervision through the evening is normally arranged by your venue or wedding
                      team.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Couples Add Fire Pits */}
        <section className="py-12 md:py-16 px-4 md:px-8 border-t border-champagne-gold/10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              Why Couples Add Fire Pits
            </h2>
            <ul className="space-y-4">
              {WHY_COUPLES_BULLETS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                  <Check
                    className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* After 20 years — Nigel voice */}
        <section className="py-12 md:py-16 px-4 md:px-8 border-t border-champagne-gold/10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto rounded-2xl border-2 border-champagne-gold/30 bg-gray-800/50 backdrop-blur-sm p-8 md:p-12 shadow-[0_0_32px_rgba(212,175,55,0.08)]"
          >
            <p className="text-xs font-semibold text-champagne-gold tracking-widest uppercase mb-4">
              From Nigel · Stylish Entertainment
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              After 20 Years Of Weddings&hellip;
            </h2>
            <div className="space-y-5 text-lg text-gray-200 leading-relaxed">
              <p>
                One thing I&apos;ve noticed is that guests rarely remember how many speakers were in
                the room or what lighting fixture was used. They remember where they spent the
                evening.
              </p>
              <p className="text-gray-300">
                Fire pits create those moments — old friends catching up, grandparents staying
                involved, and guests lingering long after dinner has finished. If your venue has
                outdoor space worth using, they are often the simplest way to make a wedding evening
                feel complete.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Gallery */}
        <section className="pt-12 pb-8 md:pt-16 md:pb-10 px-4 md:px-8 border-t border-champagne-gold/20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Fire Pits at Weddings
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Real wedding evenings across the South West — courtyards, lawns and outdoor spaces
                where guests gather after dinner.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {GALLERY_IMAGES.map((photo, index) => (
                <motion.div
                  key={photo.src}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-champagne-gold/20"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16 px-4 md:px-8 border-t border-champagne-gold/20">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-8">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <dt className="text-lg font-semibold text-white mb-2">{item.question}</dt>
                  <dd className="text-gray-300 leading-relaxed">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </section>

        {/* Is it right for your wedding? */}
        <section className="py-12 md:py-16 px-4 md:px-8 border-t border-champagne-gold/20">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              Is Fire Pit Hire Right For Your Wedding?
            </h2>
            <p className="text-gray-400 text-center mb-8 leading-relaxed">
              Honest guidance — we would rather tell you early if pits are not the right fit.
            </p>
            <ul className="space-y-4">
              {[
                { question: "Autumn wedding?", answer: "Probably yes." },
                { question: "Winter wedding?", answer: "Almost certainly." },
                { question: "Large outdoor venue?", answer: "Usually." },
                { question: "Marquee wedding?", answer: "Often." },
                { question: "Small summer wedding?", answer: "Maybe not." },
              ].map((item) => (
                <li
                  key={item.question}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 border-b border-champagne-gold/15 last:border-0"
                >
                  <span className="text-white font-medium">{item.question}</span>
                  <span className="text-champagne-gold sm:text-right">{item.answer}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-300 text-center mt-8 leading-relaxed">
              Not sure? Share your wedding date and venue — we will give you a straight answer.
            </p>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="pt-4 pb-16 md:pt-6 md:pb-20 px-3 sm:px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-champagne-gold/50 bg-gray-800 shadow-xl">
                <CardContent className="p-8 sm:p-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Ready to add fire pits to your wedding?
                  </h2>
                  <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                    Share your wedding date, venue and how you imagine the outdoor space — whether
                    you need a quiet chill out area, several gathering spots or pits with festoon
                    and fairy lights. We will reply within 24 hours with honest advice, not a
                    generic catalogue.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/contact-us/">Get in Touch</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
