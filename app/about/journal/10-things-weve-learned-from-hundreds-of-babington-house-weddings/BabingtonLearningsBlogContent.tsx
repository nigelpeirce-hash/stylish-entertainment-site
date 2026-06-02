"use client";

import { motion } from "@/lib/motion";
import { useEffect, useMemo } from "react";
import dynamicImport from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const BlogImage = dynamicImport(() => import("@/components/BlogImage"), {
  ssr: false,
});

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-bold text-champagne-gold md:text-3xl">{children}</h2>
  );
}

const linkClass = "text-champagne-gold underline hover:text-gold-light";

const CLOUD = (path: string) =>
  `https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/${path}`;

export default function BabingtonLearningsBlogContent() {
  useEffect(() => {
    document.title = "10 Things We've Learned From Hundreds Of Babington House Weddings";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "After hundreds of Babington House weddings since 2003, DJ Nige shares what makes the venue work so well — from the bar and terrace to lighting, music and guest flow."
      );
    }
  }, []);

  const allImages = useMemo(
    () => [
      {
        src: CLOUD("v1768740556/Albert-Palmer-Photography-001-2-e1642519560978_yjkunf.jpg"),
        alt: "Babington House estate — wedding guests enjoying drinks on the lawn",
      },
      {
        src: CLOUD("v1768733634/Babington-Bar-with-DJ-and-Band-Setup-Summer_cs7dyw.jpg"),
        alt: "Babington House bar with DJ and band setup for a summer wedding",
      },
      {
        src: CLOUD("v1768738511/wedding-tree-lighting-2-e1510835516724_f1fant.jpg"),
        alt: "Babington House terrace with tree lighting and festoon at night",
      },
      {
        src: CLOUD("v1768163170/Orangery-Canopy-Day_llzwge.jpg"),
        alt: "Babington House Orangery with fairy-light canopy for wedding breakfast",
      },
      {
        src: CLOUD("v1768163677/Babington-Bar-Violet_xc3jsd.jpg"),
        alt: "Warm violet uplighting in the Babington House bar",
      },
      {
        src: CLOUD("v1768163223/Nigel-DJ-Babs-House-0019_y4rjks.jpg"),
        alt: "Packed dancefloor at a Babington House wedding reception",
      },
    ],
    []
  );

  return (
    <div>
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <Image
            src={CLOUD("v1768740393/Albert-Palmer-Photography-002_rpgfzf.jpg")}
            alt="Babington House wedding guests on the Croquet Lawn — summer estate celebration"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: "center center" }}
            priority
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-4xl px-4 pt-32 text-center md:pt-40"
        >
          <div className="mb-4 inline-block rounded-full border border-champagne-gold/20 bg-champagne-gold/10 px-4 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-champagne-gold">
              Venue Guide · Journal · DJ Nige
            </span>
          </div>
          <h1 className="mb-4 px-4 font-sans text-3xl font-bold text-white drop-shadow-lg sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            10 Things We&apos;ve Learned From Hundreds Of Babington House Weddings
          </h1>
          <p className="mx-auto max-w-3xl px-4 text-base font-semibold leading-relaxed text-gray-200 drop-shadow-md sm:text-lg md:text-xl">
            After more than twenty years at Babington House, here are the things we see working
            again and again — from guest flow and lighting to the bar, terrace and evening party.
          </p>
        </motion.div>
      </section>

      <section className="bg-gray-800 px-3 py-20 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <Card className="border-champagne-gold/30 bg-gray-900">
              <CardContent className="space-y-8 p-6 sm:p-8 md:p-12">
                <div className="space-y-6 leading-relaxed text-gray-300">
                  <p className="text-lg">
                    <Link href="/artists/djs/dj-nige/" className={linkClass}>
                      DJ Nige
                    </Link>{" "}
                    has been part of{" "}
                    <strong className="font-semibold text-white">Babington House weddings</strong>{" "}
                    since 2003. Every wedding is different. Some are elegant and understated. Some
                    are wild and unforgettable. Some end at midnight. Some continue until dawn.
                  </p>
                  <p>
                    But after hundreds of weddings at this{" "}
                    <strong className="text-white">Soho House wedding venue</strong>, certain
                    patterns appear again and again. This is not a duplicate of our{" "}
                    <Link href="/venues/babington-house/" className={linkClass}>
                      Babington House wedding guide
                    </Link>{" "}
                    — it is what we have learned in the room, on the terrace and behind the decks.
                    Insight from someone who knows the estate intimately, not a generic venue
                    brochure.
                  </p>

                  <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-lg">
                    <BlogImage
                      src={allImages[0].src}
                      alt={allImages[0].alt}
                      images={allImages}
                      index={0}
                    />
                  </div>

                  {/* 1 */}
                  <div>
                    <SectionHeading>
                      1. The Best Babington Weddings Use The Whole Estate
                    </SectionHeading>
                    <p className="mb-4">
                      Babington rewards couples who think in journeys, not snapshots. The church,
                      the Croquet Lawn, the Orangery, the bar, the terrace, the Walled Garden, the
                      front of house — each space has a role. When the day moves through them
                      deliberately, guests feel the shift from ceremony to lunch to evening without
                      awkward gaps.
                    </p>
                    <p>
                      The best{" "}
                      <strong className="text-white">Babington House wedding entertainment</strong>{" "}
                      plans respect that arc. Music in the Orangery is not the same as music in the
                      bar at midnight. Lighting on the terrace at dusk is not the same as lighting
                      the bar for dancing. Treat the estate as one story, not a series of unrelated
                      rooms.
                    </p>
                  </div>

                  {/* 2 */}
                  <div>
                    <SectionHeading>2. The Bar Is Bigger Than You Think</SectionHeading>
                    <p className="mb-4">
                      Couples often underestimate the bar. It is an excellent party room — more
                      capacity than most expect once furniture is moved and the dancefloor opens
                      up. We have seen New Year&apos;s Eve atmosphere with two hundred people in
                      there, shoulder to shoulder, without it feeling wrong.
                    </p>
                    <p>
                      That only works when you plan for it: sofa removal, clear routes, sound that
                      suits the room and a{" "}
                      <strong className="text-white">Babington House wedding DJ</strong> who knows
                      where the energy needs to sit. The bar is not a fallback space. For many
                      Babington weddings, it is the main event.
                    </p>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[1].src}
                        alt={allImages[1].alt}
                        images={allImages}
                        index={1}
                      />
                    </div>
                  </div>

                  {/* 3 */}
                  <div>
                    <SectionHeading>3. Guests Always Gather Around The Bar</SectionHeading>
                    <p className="mb-4">
                      At venues where the bar is detached from the dancefloor, non-dancers drift
                      away and the room splits. Babington works differently. Guests stay connected
                      to the music because the bar, terrace and dancefloor work as one social hub.
                    </p>
                    <p>
                      You notice it within an hour of the party starting: people who never intended
                      to dance are still in the orbit of the room, laughing, watching, joining in
                      for a song. That is one reason{" "}
                      <strong className="text-white">DJ Nige Babington House</strong> experience
                      matters — knowing how that room breathes after hundreds of nights.
                    </p>
                  </div>

                  {/* 4 */}
                  <div>
                    <SectionHeading>
                      4. The Terrace Deserves More Attention Than Most Couples Give It
                    </SectionHeading>
                    <p className="mb-4">
                      Summer weddings live on the{" "}
                      <strong className="text-white">Babington House terrace</strong> — but it
                      changes completely after sunset. Without thought, it goes dark and guests
                      retreat inside. With tree lighting, festoon or fairy lights, it stays an
                      extension of the party rather than a corridor to the smoking area.
                    </p>
                    <p>
                      The terrace should feel connected to the bar, not separate from it. Guests
                      move between inside and out all evening; if the outside is forgotten, you lose
                      half the estate&apos;s charm. Our{" "}
                      <Link href="/weddings/wedding-lighting/" className={linkClass}>
                        wedding lighting
                      </Link>{" "}
                      work on the terrace is often where couples see the biggest transformation
                      for the least fuss.
                    </p>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[2].src}
                        alt={allImages[2].alt}
                        images={allImages}
                        index={2}
                      />
                    </div>
                  </div>

                  {/* 5 */}
                  <div>
                    <SectionHeading>
                      5. The Orangery Needs Less Decoration Than You Think
                    </SectionHeading>
                    <p className="mb-4">
                      The Orangery is already one of the finest dining rooms you could wish for.
                      The instinct is to dress it heavily. Often the better approach is to enhance,
                      not over-dress — a canopy, subtle lighting, considered{" "}
                      <Link href="/services/venue-styling/" className={linkClass}>
                        venue styling
                      </Link>{" "}
                      that works with the room rather than fighting it.
                    </p>
                    <p>
                      In autumn and winter, lighting matters even more. The glass, the views, the
                      shift from daylight to candlelight — less is frequently more. We have seen
                      stunning Orangery breakfasts with nothing more than a well-planned canopy and
                      warm wash.
                    </p>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[3].src}
                        alt={allImages[3].alt}
                        images={allImages}
                        index={3}
                      />
                    </div>
                  </div>

                  {/* 6 */}
                  <div>
                    <SectionHeading>
                      6. Winter Weddings Can Be Every Bit As Magical As Summer
                    </SectionHeading>
                    <p className="mb-4">
                      Summer Babington weddings get the headlines. Winter ones have a different
                      magic — fires inside, darkness outside, a more intimate house atmosphere.
                      From October to April, the front of house becomes important in a way summer
                      couples rarely think about: arrival lighting, warmth, the sense that guests
                      are stepping into somewhere special before they reach the Orangery.
                    </p>
                    <p>
                      Do not write off a winter date because the terrace will be cold. Lean into
                      what the house does well when the nights draw in.
                    </p>
                  </div>

                  {/* 7 */}
                  <div>
                    <SectionHeading>7. Lighting Matters More Than People Expect</SectionHeading>
                    <p className="mb-4">
                      Guests may not consciously notice{" "}
                      <strong className="text-white">Babington House wedding lighting</strong>. They
                      notice whether they feel comfortable, whether photographs look warm, whether
                      the terrace invites them outside, whether the bar feels like a party.
                    </p>
                    <p className="mb-4">
                      Softly lit terrace. Warm bar lighting. Orangery canopy. Tree lighting that
                      connects outside to in. The goal is effortless — lighting that feels like it
                      belongs to the evening, not like equipment hired for the night.
                    </p>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[4].src}
                        alt={allImages[4].alt}
                        images={allImages}
                        index={4}
                      />
                    </div>
                  </div>

                  {/* 8 */}
                  <div>
                    <SectionHeading>
                      8. The Best Dancefloors Start Long Before The First Dance
                    </SectionHeading>
                    <p className="mb-4">
                      Timing again. Guest flow. Energy building gradually. The first dance is the
                      beginning of the party, not a forced start after a room that has been sitting
                      in neutral since coffee.
                    </p>
                    <p>
                      At Babington, that often means reading the bar, the terrace stragglers and the
                      band handover as one problem — not three. We wrote more about that in{" "}
                      <Link
                        href="/about/journal/how-to-keep-a-wedding-dancefloor-full/"
                        className={linkClass}
                      >
                        how to keep a wedding dancefloor full
                      </Link>
                      . The principles apply here with extra force because the room is so social.
                    </p>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[5].src}
                        alt={allImages[5].alt}
                        images={allImages}
                        index={5}
                      />
                    </div>
                  </div>

                  {/* 9 */}
                  <div>
                    <SectionHeading>9. The Small Details Make The Biggest Difference</SectionHeading>
                    <p className="mb-4">
                      Sofa removal when band and DJ share the bar. Terrace lighting for smokers and
                      guests who need air. Speeches timed so the room is ready for what comes next.
                      Live musician placement that does not block the flow between spaces.
                    </p>
                    <p>
                      None of these are glamorous. All of them show up in whether guests stay
                      connected or drift. After hundreds of weddings, we notice the same small
                      frictions — and the same small fixes.
                    </p>
                  </div>

                  {/* 10 */}
                  <div>
                    <SectionHeading>
                      10. The Best Babington Weddings Feel Effortless
                    </SectionHeading>
                    <p className="mb-4">
                      Not always the biggest budget. Always the best-connected spaces. Music,
                      lighting and flow feeling right. Guests staying in the same orbit from
                      dinner to the last song.
                    </p>
                    <p>
                      Babington&apos;s real strength is how the estate supports atmosphere when
                      you use it properly. The couples who trust that — rather than fighting the
                      venue with too much stuff — are usually the ones guests talk about for years.
                    </p>
                  </div>

                  {/* Final thoughts */}
                  <div className="border-t border-gray-700 pt-8">
                    <SectionHeading>Final Thoughts</SectionHeading>
                    <p className="mb-4">
                      Babington rewards couples who embrace what already makes it special. Use the
                      spaces well. Trust the atmosphere. Think about how guests experience the day,
                      not just how individual details look in isolation.
                    </p>
                    <p>
                      If you are planning a Babington wedding, start with our{" "}
                      <Link href="/venues/babington-house/" className={linkClass}>
                        venue guide
                      </Link>{" "}
                      for the practical overview — then talk to us about how entertainment and
                      lighting shape around how the estate actually works on your date.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-12 rounded-xl border border-champagne-gold/30 bg-gray-800/60 p-6 text-center backdrop-blur-sm sm:p-8">
                    <h2 className="mb-3 text-2xl font-bold text-champagne-gold md:text-3xl">
                      Planning a Babington House wedding?
                    </h2>
                    <p className="mx-auto mb-6 max-w-2xl text-gray-300">
                      Tell us your date and plans — we can help with wedding entertainment, DJ Nige,
                      lighting and production shaped around how Babington actually works.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                      <Link
                        href="/venues/babington-house/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-champagne-gold px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      >
                        Plan Babington Entertainment &amp; Lighting
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                      <Link
                        href="/artists/djs/dj-nige/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-champagne-gold/40 px-6 py-3 font-semibold text-champagne-gold transition-all hover:border-champagne-gold hover:bg-champagne-gold/10"
                      >
                        Meet DJ Nige
                      </Link>
                      <Link
                        href="/venues/babington-house/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-champagne-gold/40 px-6 py-3 font-semibold text-champagne-gold transition-all hover:border-champagne-gold hover:bg-champagne-gold/10"
                      >
                        View Babington House Guide
                      </Link>
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      Or explore{" "}
                      <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                        wedding entertainment
                      </Link>{" "}
                      and{" "}
                      <Link href="/contact-us/" className={linkClass}>
                        contact us
                      </Link>{" "}
                      with your date.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
