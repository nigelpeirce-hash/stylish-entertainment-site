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

const FILLS_DANCEFLOOR = [
  "Great timing",
  "Good lighting",
  "Mixed generations",
  "Shared moments",
  "The right requests",
  "Reading the room",
  "Confident hosting",
  "A room that feels connected",
] as const;

const EVENING_TIMELINE = [
  { time: "7:30", moment: "Guests finishing coffee — room still in conversation mode" },
  { time: "8:15", moment: "First dance — emotional, not yet a full floor" },
  { time: "9:00", moment: "Mixed floor — generations finding their feet" },
  { time: "10:30", moment: "Peak energy — the room commits" },
  { time: "11:15", moment: "Singalongs — shared moments that pull everyone in" },
  { time: "11:45", moment: "Final run — last chance to leave on a high" },
] as const;

const MUSIC_MISTAKES = [
  "Only playing current music",
  "Only playing niche music",
  "Trying to please every request",
  "Making the first dance too late",
  "Leaving no plan after the band",
  "Turning the music down too much",
  "Treating the evening like a nightclub",
] as const;

export default function DancefloorFullBlogContent() {
  useEffect(() => {
    document.title =
      "How To Keep A Wedding Dancefloor Full | Expert Wedding DJ Advice";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "What keeps a wedding dancefloor full all night? Practical advice from DJ Nige, resident at Babington House since 2003 and performer at hundreds of weddings across the UK."
      );
    }
  }, []);

  const allImages = useMemo(
    () => [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163297/Mirjam-and-Ben-1062-1_vy1hgx.jpg",
        alt: "DJ Nige performing at a wedding with guests on the dancefloor",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163790/Party-dj-with-lazer_wnhreb.jpg",
        alt: "Professional wedding DJ with dancefloor lighting and lasers",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768730094/Mirrorball-with-spotlights-and-amber-up-lighting_vyrl8r.jpg",
        alt: "Mirror ball and amber uplighting creating wedding dancefloor atmosphere",
      },
    ],
    []
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768737146/full-dance-floor300x200_iglsa1.jpg"
            alt="Packed wedding dancefloor with guests dancing at a formal reception"
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
              Wedding Entertainment · Journal · DJ Nige
            </span>
          </div>
          <h1 className="mb-4 px-4 font-sans text-3xl font-bold text-white drop-shadow-lg sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            How To Keep A Wedding Dancefloor Full
          </h1>
          <p className="mx-auto max-w-3xl px-4 text-base font-semibold leading-relaxed text-gray-200 drop-shadow-md sm:text-lg md:text-xl">
            After more than twenty years behind the decks, here are the things that genuinely make
            the difference between a packed dancefloor and an empty one.
          </p>
        </motion.div>
      </section>

      {/* Content */}
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
                    One of the biggest worries couples have is: &ldquo;What if nobody dances?&rdquo;
                  </p>
                  <p>
                    The good news is that most empty dancefloors are not caused by bad guests. They
                    are usually caused by planning mistakes, poor timing, unrealistic expectations
                    or entertainment that fails to read the room.
                  </p>
                  <p>
                    After hundreds of weddings at venues including{" "}
                    <Link href="/venues/babington-house/" className={linkClass}>
                      Babington House
                    </Link>
                    , Kin House, Pennard House and country estates across the UK, certain patterns
                    appear again and again. This guide explains what actually works — practical{" "}
                    <strong className="font-semibold text-white">wedding DJ advice</strong> from
                    someone who has been resident at Babington since 2003, not generic{" "}
                    <strong className="font-semibold text-white">wedding music tips</strong> copied
                    from a listicle.
                  </p>

                  {/* 1 */}
                  <div>
                    <SectionHeading>
                      1. The Biggest Myth About Wedding Dancefloors
                    </SectionHeading>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      It Is Not About Playing Bangers All Night
                    </h3>
                    <p className="mb-4">
                      Many couples imagine six straight hours of floor-fillers. That is not how
                      great weddings work. A wedding is a journey. Guests need moments of
                      conversation, drinks, recovery and anticipation. The best dancefloors rise and
                      fall naturally — they breathe.
                    </p>
                    <p className="rounded-lg border border-champagne-gold/20 bg-gray-800/60 px-5 py-4 font-medium text-white">
                      A full dancefloor at 11pm is usually created by decisions made at 7pm.
                    </p>
                  </div>

                  {/* 2 */}
                  <div>
                    <SectionHeading>2. Get The Timing Right</SectionHeading>
                    <p className="mb-4">
                      One of the biggest mistakes is starting too early. You cannot force momentum.
                      The room has to be ready.
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Speeches overrunning while guests are still seated and restless</li>
                      <li>Dessert or coffee service delaying the shift into evening mode</li>
                      <li>Guests still outside on the terrace when the first dance is announced</li>
                      <li>A first dance before people have had a chance to relax into the evening</li>
                    </ul>
                    <p className="mt-4">
                      If you are planning with a band and DJ, agree the handover early. A common{" "}
                      <strong className="text-white">wedding reception music</strong> mistake is
                      leaving no plan after the band — the room loses energy while someone hunts for
                      a playlist. Good{" "}
                      <Link href="/weddings/wedding-entertainment/" className={linkClass}>
                        wedding entertainment
                      </Link>{" "}
                      planning treats the whole evening as one arc, not a series of disconnected
                      moments.
                    </p>
                  </div>

                  {/* 3 */}
                  <div>
                    <SectionHeading>
                      3. The First Dance Is Not The Most Important Song
                    </SectionHeading>
                    <p className="mb-4">
                      Couples often spend months choosing their first dance and five minutes
                      thinking about the next three hours.
                    </p>
                    <p className="mb-4">
                      The first dance matters emotionally. The next twenty songs usually matter more
                      to the success of the party.
                    </p>
                    <p>
                      I am not saying skip the planning — it is your moment. But if you want a full
                      floor at midnight, the conversation should be about the arc of the evening,
                      not just those four minutes under the spotlight.
                    </p>
                  </div>

                  {/* 4 */}
                  <div>
                    <SectionHeading>4. A Typical Wedding Evening</SectionHeading>
                    <p className="mb-4">
                      Every wedding is different — venue, band, guest mix and energy all shift the
                      timings. But this is the kind of shape I see work again and again at country
                      houses and barns across the South West. Not a script. A realistic guide.
                    </p>
                    <div className="overflow-hidden rounded-lg border border-champagne-gold/30 bg-gray-800/60">
                      <ul className="divide-y divide-champagne-gold/10">
                        {EVENING_TIMELINE.map((item) => (
                          <li
                            key={item.time}
                            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-6 sm:px-6"
                          >
                            <span className="shrink-0 font-semibold tabular-nums text-champagne-gold sm:w-16">
                              {item.time}
                            </span>
                            <span className="text-gray-300">{item.moment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      Notice how little happens in the first hour after dinner — and how much of the
                      night still has to be shaped after the first dance. That is where experienced{" "}
                      <strong className="text-white">wedding DJ advice</strong> earns its keep.
                    </p>
                  </div>

                  {/* 5 */}
                  <div>
                    <SectionHeading>
                      5. Choose Music For Guests, Not Just Yourselves
                    </SectionHeading>
                    <p className="mb-4">
                      Your wedding should absolutely reflect your taste. But the dancefloor belongs
                      to the guests. That means balancing generations, balancing tastes and creating
                      shared moments — the songs where cousins, parents and old friends end up
                      dancing together without thinking about it.
                    </p>
                    <p className="rounded-lg border border-champagne-gold/20 bg-gray-800/60 px-5 py-4 font-medium text-white">
                      The most successful wedding dancefloors are rarely built around one genre.
                    </p>
                    <p className="mt-4">
                      I will always honour your must-plays and your do-not-plays. But the skill is
                      finding the thread that connects your world to your guests&apos; — that is
                      where the best{" "}
                      <strong className="text-white">wedding entertainment ideas</strong> come from,
                      not from playing your favourite album on repeat.
                    </p>
                  </div>

                  {/* 6 */}
                  <div>
                    <SectionHeading>6. Don&apos;t Fear Requests</SectionHeading>
                    <p className="mb-4">
                      Good requests can be valuable. Guests feel involved. The right request at the
                      right moment can unlock a room — especially when an uncle or a university
                      friend asks for something that suddenly pulls twenty people onto the floor.
                    </p>
                    <p>
                      The key is filtering. Not every request gets played. The skill is knowing which
                      ones help and which ones hurt — timing, tone and whether the person asking
                      represents a table that has not danced yet. That judgement is part of{" "}
                      <strong className="text-white">how to get guests dancing</strong> without
                      handing the evening over to whoever shouts loudest.
                    </p>
                  </div>

                  {/* 7 */}
                  <div>
                    <SectionHeading>7. The Importance Of Reading The Room</SectionHeading>
                    <p className="mb-4">
                      No playlist can see who just arrived, who is leaving, who is dancing, who is
                      tired or who needs one more song before they call it a night. Reading the room
                      means adjusting energy, changing direction when something is not landing,
                      knowing when to stay with a style and knowing when to move on.
                    </p>
                    <p className="mb-4 rounded-lg border border-champagne-gold/20 bg-gray-800/60 px-5 py-4 font-medium text-white">
                      Reading the room is what separates a playlist from a professional DJ.
                    </p>
                    <p>
                      It is the reason couples book an experienced DJ rather than a speaker and a
                      phone. After hundreds of weddings, you develop a sense for the small signals —
                      the bar getting busier, the older crowd returning from dinner, the moment the
                      bride&apos;s friends are ready to go again. That is not something you can
                      automate.
                    </p>
                    <div className="relative my-6 aspect-[16/9] overflow-hidden rounded-lg">
                      <BlogImage
                        src={allImages[0].src}
                        alt={allImages[0].alt}
                        images={allImages}
                        index={0}
                      />
                    </div>
                  </div>

                  {/* 8 */}
                  <div>
                    <SectionHeading>8. Alcohol Helps. Atmosphere Matters More.</SectionHeading>
                    <p className="mb-4">
                      People often assume alcohol creates the party. In reality, lighting, room
                      layout, confidence and crowd dynamics matter just as much — sometimes more,
                      especially early in the evening when the bar has only just opened.
                    </p>
                    <ul className="mb-4 list-disc space-y-2 pl-5">
                      <li>
                        <strong className="text-white">Dancefloor placement</strong> — too isolated
                        and guests feel exposed; too cramped and people never commit
                      </li>
                      <li>
                        <strong className="text-white">Bar proximity</strong> — if the bar feels
                        miles away, people drift and do not come back
                      </li>
                      <li>
                        <strong className="text-white">Outdoor spaces</strong> — terraces and
                        gardens need to feel connected, not like a separate party
                      </li>
                    </ul>
                    <p>
                      Babington House works particularly well because guests naturally stay connected
                      to the bar, terrace and dancefloor — the flow of the building does half the
                      work. Our{" "}
                      <Link href="/venues/babington-house/" className={linkClass}>
                        Babington House wedding guide
                      </Link>{" "}
                      goes into that in detail. At other venues,{" "}
                      <Link href="/services/venue-styling/" className={linkClass}>
                        venue styling
                      </Link>{" "}
                      and layout decisions made earlier in the day often determine whether the
                      evening feels joined-up or fragmented.
                    </p>
                  </div>

                  {/* 9 */}
                  <div>
                    <SectionHeading>9. Why Lighting Matters</SectionHeading>
                    <p className="mb-4">
                      People dance in environments that feel exciting. Mirror balls, warm lighting,
                      intelligent dancefloor lighting — atmosphere encourages participation. A
                      brightly lit empty barn feels like a school hall. A warmly lit room with
                      movement and glow feels like a celebration people want to join.
                    </p>
                    <p className="mb-4">
                      This is one reason we talk about lighting and entertainment together. Good{" "}
                      <Link href="/weddings/wedding-lighting/" className={linkClass}>
                        wedding lighting
                      </Link>{" "}
                      does not just look beautiful in photographs. It changes how confident guests
                      feel on the floor. Some of my favourite{" "}
                      <strong className="text-white">wedding dancefloor ideas</strong> start with
                      how the room looks at 9pm, not with a song list.
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

                  {/* 10 */}
                  <div>
                    <SectionHeading>10. Common Wedding Music Mistakes</SectionHeading>
                    <p className="mb-4">
                      After hundreds of weddings, these patterns show up often enough to mention:
                    </p>
                    <ul className="list-disc space-y-2 pl-5">
                      {MUSIC_MISTAKES.map((mistake) => (
                        <li key={mistake}>{mistake}</li>
                      ))}
                    </ul>
                    <p className="mt-4">
                      None of these are fatal on their own. Combined, they are how you end up with a
                      dancefloor that peaks for ten minutes and then empties — the opposite of{" "}
                      <strong className="text-white">
                        how to keep a wedding dancefloor full
                      </strong>{" "}
                      all evening.
                    </p>
                  </div>

                  {/* 11 */}
                  <div>
                    <SectionHeading>11. What Actually Fills Dancefloors?</SectionHeading>
                    <ul className="mb-4 grid gap-2 sm:grid-cols-2">
                      {FILLS_DANCEFLOOR.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 rounded-lg border border-champagne-gold/15 bg-gray-800/50 px-4 py-3 text-white"
                        >
                          <span className="text-champagne-gold" aria-hidden>
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="font-medium text-white">
                      Not one magic song. Never has been.
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

                  {/* 12 */}
                  <div>
                    <SectionHeading>
                      12. What We Have Learned After Hundreds Of Weddings
                    </SectionHeading>
                    <div className="space-y-4">
                      <p>
                        I am going to speak plainly here, because this is what I actually believe
                        after more than twenty years doing this.
                      </p>
                      <p>
                        Every wedding is different. The best weddings are rarely the most expensive.
                        Guests remember atmosphere more than playlists. People remember how a room
                        felt — whether they felt comfortable, whether the energy built naturally,
                        whether they lost track of time on the floor.
                      </p>
                      <p>
                        A wedding succeeds when guests stop thinking about the music and simply enjoy
                        themselves. That is the goal. Not proving you have cutting-edge taste. Not
                        running the room like a nightclub. Not playing safe for six hours either.
                      </p>
                      <p>
                        If you want someone who thinks about the whole evening — timing, requests,
                        lighting, the flow between band and DJ, the terrace and the bar — that is
                        what I do. It is why I have been at Babington since 2003, and why most of
                        my work still comes from venues, planners and couples who have seen a room
                        done properly once and do not want to gamble on the biggest night of their
                        lives.
                      </p>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div className="border-t border-gray-700 pt-8">
                    <SectionHeading>Final Thoughts</SectionHeading>
                    <p className="mb-4">
                      There is no secret playlist. No guaranteed floor-filler. No shortcut. A full
                      wedding dancefloor is usually the result of dozens of good decisions made
                      throughout the day and evening.
                    </p>
                    <p className="mb-4">
                      The music matters. The timing matters. The atmosphere matters. Most importantly,
                      having someone who can read the room matters.
                    </p>
                    <p>
                      If you are weighing up DJs, read this alongside our guide on{" "}
                      <Link
                        href="/about/blog/why-you-should-use-an-experienced-professional-dj/"
                        className={linkClass}
                      >
                        why an experienced professional DJ makes a difference
                      </Link>{" "}
                      — then decide whether you want a playlist or someone who has done this
                      hundreds of times before.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-12 rounded-xl border border-champagne-gold/30 bg-gray-800/60 p-6 text-center backdrop-blur-sm sm:p-8">
                    <h2 className="mb-3 text-2xl font-bold text-champagne-gold md:text-3xl">
                      Planning your wedding entertainment?
                    </h2>
                    <p className="mx-auto mb-6 max-w-2xl text-gray-300">
                      Tell us your venue, guest numbers and musical tastes and we will help create
                      an evening that feels right for your guests.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                      <Link
                        href="/weddings/wedding-entertainment/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-champagne-gold px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      >
                        Discuss Wedding Entertainment
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                      <Link
                        href="/artists/djs/dj-nige/"
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-champagne-gold/40 px-6 py-3 font-semibold text-champagne-gold transition-all hover:border-champagne-gold hover:bg-champagne-gold/10"
                      >
                        Meet DJ Nige
                      </Link>
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      Or{" "}
                      <Link href="/contact-us/" className={linkClass}>
                        contact us directly
                      </Link>
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
