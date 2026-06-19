"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "@/lib/motion";
import { ChevronLeft, ChevronRight, Mic, Music, Sparkles, CheckCircle2, X, ArrowRight } from "lucide-react";
import SiteLightbox from "@/components/SiteLightbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LazyIframe from "@/components/LazyIframe";
import type { DJCardData } from "@/lib/dj-data";
import { WEDDING_DJ_HERO_ALT, WEDDING_DJ_HERO_LCP_URL } from "@/lib/wedding-dj-hero";
import { PROOF_THEMES, testimonials } from "@/data/testimonials";
import { RefinedStar } from "@/components/RefinedStar";

interface DJ {
  name: string;
  image: string | null;
  alt: string;
  mixingStyle: string;
  bio: string;
  fullBio: string | null;
  youtubeEmbed: string | null;
  mixcloudEmbeds: string[];
}

// Normalize YouTube URLs to embed format (matches /artists/djs)
function normalizeYouTubeUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === "") return null;
  const normalized = url.trim();
  let videoId: string | null = null;
  if (normalized.includes("/embed/")) {
    videoId = normalized.split("/embed/")[1]?.split("?")[0]?.split("&")[0];
    if (videoId) {
      const queryParams = normalized.includes("?") ? normalized.split("?")[1] : "";
      return `https://www.youtube.com/embed/${videoId}${queryParams ? "?" + queryParams : ""}`;
    }
  } else if (normalized.includes("youtube.com/watch?v=")) {
    videoId = normalized.split("v=")[1]?.split("&")[0];
  } else if (normalized.includes("youtu.be/")) {
    videoId = normalized.split("youtu.be/")[1]?.split("?")[0];
  } else if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    const withProtocol = normalized.startsWith("http") ? normalized : `https://${normalized}`;
    if (withProtocol.includes("/embed/")) videoId = withProtocol.split("/embed/")[1]?.split("?")[0];
    else if (withProtocol.includes("watch?v=")) videoId = withProtocol.split("v=")[1]?.split("&")[0];
    else if (withProtocol.includes("youtu.be/")) videoId = withProtocol.split("youtu.be/")[1]?.split("?")[0];
  }
  if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  if (normalized.startsWith("https://")) return normalized;
  if (normalized.startsWith("http://")) return normalized.replace("http://", "https://");
  return null;
}

const CLOUD = (path: string) =>
  `https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/${path}`;

const heroImage = {
  src: WEDDING_DJ_HERO_LCP_URL,
  alt: WEDDING_DJ_HERO_ALT,
};

function mapRosterDj(dj: {
  name: string;
  imageUrl?: string | null;
  bio?: string | null;
  strapLine?: string | null;
  fullBio?: string | null;
  youtubeEmbed?: string | null;
  mixcloudEmbeds?: string[];
}): DJ {
  const rawEmbeds = Array.isArray(dj.mixcloudEmbeds) ? dj.mixcloudEmbeds : [];
  const embeds = rawEmbeds.filter((u) => u && typeof u === "string" && u.trim() !== "");
  return {
    name: dj.name,
    image: dj.imageUrl ?? null,
    alt: `${dj.name} – professional wedding DJ`,
    mixingStyle: dj.strapLine?.trim() ? dj.strapLine : "Professional DJ Services",
    bio: dj.bio ?? "",
    fullBio: dj.fullBio?.trim() ? dj.fullBio : null,
    youtubeEmbed: normalizeYouTubeUrl(dj.youtubeEmbed),
    mixcloudEmbeds: embeds,
  };
}

// Snapshot quotes — same pattern as /testi/ (dancefloor, taste, no cheese)
const weddingDjHighlights = PROOF_THEMES.filter((item) =>
  ["The dancefloor was full all night", "They read the room perfectly", "Not cheesy"].includes(
    item.theme
  )
);

// Party gallery — guests visible; no empty rooms, band-only or lighting-only shots
const galleryPhotos = [
  {
    src: CLOUD("v1768749164/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg"),
    alt: "Packed wedding dancefloor with guests dancing — Martin Beddall Photography",
  },
  {
    src: CLOUD("v1768163299/Nigel-DJ-Babs-House-0009-1_hmbsn3.jpg"),
    alt: "DJ Nige at Babington House with guests dancing on a packed dancefloor",
  },
  {
    src: CLOUD("v1768163223/Nigel-DJ-Babs-House-0019_y4rjks.jpg"),
    alt: "Wedding guests dancing on a packed dancefloor at Babington House",
  },
  {
    src: CLOUD("v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg"),
    alt: "Hedsor House wedding with DJ, saxophone and guests on the dancefloor",
  },
  {
    src: CLOUD("v1768163506/DJ-Nige-white-dance-floor-lighting_kigdwb.jpg"),
    alt: "DJ Nige with white dancefloor lighting and a busy wedding party",
  },
  {
    src: CLOUD("v1768163806/Jade-and-Emma-0061_vd8lwz.jpg"),
    alt: "Bride and groom dancing on the bar at Babington House with guests cheering",
  },
  {
    src: CLOUD("v1768735237/Jade-and-Emma-0066-1_p6jwnu.jpg"),
    alt: "Wedding guests celebrating on the dancefloor at Babington House",
  },
  {
    src: CLOUD("v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg"),
    alt: "Couple dancing on the bar at Babington House surrounded by wedding guests",
  },
];

// Comparison table data
const comparisonRows = [
  { feature: "Microphone Use", typical: "Constant \"Shout-outs\"", us: "Only when strictly necessary" },
  { feature: "Music Choice", typical: "Same 50 songs every week", us: "Tailored to your specific taste" },
  { feature: "Equipment", typical: "Bulky, dated, distracting", us: "High-end, sleek, discreet" },
  { feature: "Professionalism", typical: "Part-time hobbyist", us: "Full-time entertainment experts" },
];

export default function WeddingLandingClient({
  initialDjs,
}: {
  initialDjs: DJCardData[];
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const djs = initialDjs.map(mapRosterDj);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden md:min-h-[85vh]">
        <div className="absolute inset-0">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            className="object-cover object-center brightness-90"
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-gray-950" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-32 text-center md:pt-40">
          <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            You&apos;re Terrified of a Cheesy DJ.
            <br />
            <span className="text-champagne-gold">We&apos;re the Antidote.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/95 md:text-xl">
            High-quality, modern wedding entertainment for couples who hate &quot;wedding music.&quot;
            We&apos;re professional, and we promise: no cringe, no cheesy chat, and absolutely no
            &quot;YMCA.&quot;
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-champagne-gold px-8 py-6 text-lg font-semibold text-black hover:bg-gold-light"
            >
              <Link href="/contact-us/">Check Your Date</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-champagne-gold/20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 md:gap-10">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <RefinedStar key={star} filled className="h-[18px] w-[18px] text-champagne-gold" />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">5.0</span>
          </div>
          <div className="hidden items-center gap-3 rounded-lg border border-champagne-gold/30 bg-white/5 px-4 py-2 backdrop-blur-md md:flex">
            <span className="text-xl font-bold text-champagne-gold">20+</span>
            <span className="text-sm text-gray-300">Years experience</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-champagne-gold/30 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="text-sm font-semibold text-champagne-gold">Babington House</span>
            <span className="text-sm font-bold text-white">since 2003</span>
          </div>
          <div className="hidden items-center gap-3 rounded-lg border border-champagne-gold/30 bg-white/5 px-4 py-2 backdrop-blur-md md:flex">
            <span className="text-xl font-bold text-champagne-gold">{testimonials.length}+</span>
            <span className="text-sm text-gray-300">Client reviews</span>
          </div>
        </div>
      </section>

      {/* Anti-Cringe Manifesto */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Straight Talk for Your Big Day</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We get it. You&apos;ve seen the &quot;standard&quot; wedding DJ: the neon booth, the flashing lights from 1994, and the guy on the mic who won&apos;t stop talking over the best part of the song.
            </p>
            <p className="text-champagne-gold font-bold text-xl mt-6">That isn&apos;t us.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/5 border-champagne-gold/30 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Mic className="w-10 h-10 text-champagne-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">No &quot;Cheesy&quot; Commentary</h3>
                      <p className="text-gray-300">We let the music do the talking. No shouting at your guests to get on the dance floor.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Card className="bg-white/5 border-champagne-gold/30 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Music className="w-10 h-10 text-champagne-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Curated Playlists</h3>
                      <p className="text-gray-300">Your &quot;Do Not Play&quot; list is our sacred text. If you hate it, we don&apos;t play it.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 border-champagne-gold/30 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-10 h-10 text-champagne-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">Sleek Aesthetics</h3>
                      <p className="text-gray-300">Our setups are designed to complement your decor, not clutter it. Minimalist, high-end, and modern.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              <Card className="bg-white/5 border-champagne-gold/30 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-10 h-10 text-champagne-gold flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">We Read The Room</h3>
                      <p className="text-gray-300">The evening builds — warm-up, first dance, then party time — when your guests are actually ready.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet Our DJs – Card View */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet Our DJs</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real people, real expertise. No faceless agencies—just DJs who care about your day.
            </p>
          </motion.div>

          {djs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {djs.map((dj, index) => (
                <motion.div
                  key={dj.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={index > 0 ? "hidden md:block" : undefined}
                >
                  <Card className="bg-gray-900 border-2 border-champagne-gold/40 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-champagne-gold/60 group flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                      {dj.image ? (
                        <Image
                          src={dj.image}
                          alt={dj.alt}
                          fill
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                          style={{ objectPosition: "center center" }}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
                          <span>Image not available</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">{dj.name}</h3>
                        <span className="inline-block mt-1 px-2.5 py-1 bg-champagne-gold/20 text-champagne-gold rounded-full text-xs font-semibold border border-champagne-gold/40">
                          {dj.mixingStyle}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4 flex flex-col">
                      {dj.bio && (
                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 mb-4">{dj.bio}</p>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-champagne-gold hover:text-gold-light font-semibold text-sm transition-colors group/link text-left"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-champagne-gold/30">
                          <DialogHeader>
                            <DialogTitle className="text-2xl md:text-3xl text-white font-bold mb-2">
                              {dj.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 mt-2">
                            {(dj.fullBio || dj.bio) && (
                              <p className="text-base text-gray-200 leading-relaxed">
                                {(dj.fullBio && dj.fullBio.trim()) ? dj.fullBio : dj.bio}
                              </p>
                            )}
                            {dj.youtubeEmbed && (
                              <div>
                                <h4 className="text-sm font-bold text-champagne-gold mb-2 uppercase tracking-wider">YouTube</h4>
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-800">
                                  <LazyIframe
                                    src={dj.youtubeEmbed}
                                    title={`${dj.name} – video`}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    height="100%"
                                  />
                                </div>
                              </div>
                            )}
                            {dj.mixcloudEmbeds.length > 0 && (
                              <div>
                                <h4 className="text-sm font-bold text-champagne-gold mb-2 uppercase tracking-wider">Mixcloud</h4>
                                <div className="space-y-3">
                                  {dj.mixcloudEmbeds.map((embed, idx) => (
                                    <div key={idx} className="relative w-full rounded-lg overflow-hidden bg-gray-800" style={{ height: "120px" }}>
                                      <LazyIframe
                                        src={embed}
                                        title={`${dj.name} – mix ${idx + 1}`}
                                        className="absolute inset-0 w-full h-full"
                                        allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
                                        frameBorder="0"
                                        height="120"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {!dj.fullBio && !dj.bio && !dj.youtubeEmbed && dj.mixcloudEmbeds.length === 0 && (
                              <p className="text-gray-400">No additional details available.</p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No DJs available at the moment.</p>
              <Link href="/artists/djs/" className="inline-block mt-4 text-champagne-gold hover:underline">
                Explore our DJs
              </Link>
            </div>
          )}

          {djs.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/artists/djs/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-champagne-gold/40 text-champagne-gold font-medium rounded-lg hover:bg-champagne-gold/10 transition-colors"
              >
                See all DJs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof – Gallery + Testimonial */}
      <section className="pt-16 md:pt-20 pb-8 md:pb-10 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Couples Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Snapshots from real client feedback — and the dancefloors behind them.{" "}
              <Link href="/testi/" className="text-champagne-gold underline hover:text-gold-light">
                Read the full testimonial archive
              </Link>
              .
            </p>
          </motion.div>

          <div className="mb-12 hidden grid-cols-1 gap-5 md:grid md:grid-cols-3">
            {weddingDjHighlights.map((item, i) => (
              <motion.div
                key={item.theme}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full border-champagne-gold/20 bg-gray-900/60">
                  <CardContent className="flex h-full flex-col p-6">
                    <h3 className="mb-3 text-base font-bold text-champagne-gold">{item.theme}</h3>
                    <p className="flex-grow text-sm italic leading-relaxed text-gray-300">
                      &ldquo;{item.excerpt}&rdquo;
                    </p>
                    <p className="mt-4 border-t border-white/10 pt-4 text-xs text-gray-500">
                      {item.author} · {item.venue}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-champagne-gold/80">
            On the dancefloor
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {galleryPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group${i >= 4 ? " hidden md:block" : ""}`}
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={i < 4}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

          <p className="mb-10 text-center text-sm text-gray-500">
            Tap any photo to enlarge · More event photography in our{" "}
            <Link href="/galleries/" className="text-champagne-gold underline hover:text-gold-light">
              gallery
            </Link>
          </p>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center border-l-4 border-champagne-gold pl-6 py-4 bg-gray-900/50 rounded-r-lg"
          >
            <p className="text-xl md:text-2xl text-white/95 italic mb-4">
              &ldquo;It&apos;s fair to say everyone loved it! Haven&apos;t had such a good dance in a long time and it&apos;s because you read the mood so well.&rdquo;
            </p>
            <cite className="text-champagne-gold not-italic font-medium">— Demitria & David, Devonshire Terrace London</cite>
          </motion.blockquote>
        </div>
      </section>

      {/* How We Work – 3 Steps */}
      <section className="pt-8 md:pt-10 pb-16 md:pb-20 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">3 Steps to a Better Party</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-champagne-gold text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">The Music Brief</h3>
              <p className="text-gray-400">Your musical taste, your &quot;must-haves,&quot; and your &quot;absolutely-nots&quot;—all captured in your online planning space when you book, at your own pace.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-champagne-gold text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">The Logistics</h3>
              <p className="text-gray-400">We handle everything—insurance, PAT testing, and coordinating with your venue. Your booking gives you access to your online planning space to build your playlist and preferences whenever you&apos;re ready.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-champagne-gold text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">The Night</h3>
              <p className="text-gray-400">We show up, blend in, and play a set that actually reflects who you are as a couple.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contextual links — desktop only */}
      <section className="hidden border-b border-white/5 bg-gray-950 px-4 py-12 md:block md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Planning your wedding?</h2>
          <p className="mb-8 text-gray-400">
            Useful reading from weddings we know well — venues, dancefloors and how we work as a team.
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/venues/babington-house/"
              className="rounded-lg border border-champagne-gold/30 bg-gray-900/60 px-5 py-3 text-sm font-medium text-champagne-gold transition-colors hover:border-champagne-gold/50 hover:bg-champagne-gold/10"
            >
              Babington House wedding guide
            </Link>
            <Link
              href="/about/journal/how-to-keep-a-wedding-dancefloor-full/"
              className="rounded-lg border border-champagne-gold/30 bg-gray-900/60 px-5 py-3 text-sm font-medium text-champagne-gold transition-colors hover:border-champagne-gold/50 hover:bg-champagne-gold/10"
            >
              How to keep a dancefloor full
            </Link>
            <Link
              href="/weddings/wedding-entertainment/"
              className="rounded-lg border border-champagne-gold/30 bg-gray-900/60 px-5 py-3 text-sm font-medium text-champagne-gold transition-colors hover:border-champagne-gold/50 hover:bg-champagne-gold/10"
            >
              Wedding entertainment &amp; production
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table — desktop only (manifesto covers mobile) */}
      <section className="hidden bg-gray-950 px-4 py-16 md:block md:px-8 md:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">How We&apos;re Different</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              A quick comparison — what couples often worry about versus how we actually work.
            </p>
          </motion.div>
          <div className="overflow-x-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-champagne-gold/50">
                    <th className="px-4 py-4 text-left font-semibold text-gray-400">Feature</th>
                    <th className="px-4 py-4 text-left font-semibold text-red-400/90">
                      The &quot;Typical&quot; DJ
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-champagne-gold">Us</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="border-b border-white/10 transition-colors hover:bg-white/5">
                      <td className="px-4 py-4 font-medium">{row.feature}</td>
                      <td className="px-4 py-4 text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500/70" />
                          {row.typical}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-200">
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-champagne-gold" />
                          {row.us}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client Portal Section */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950" aria-labelledby="portal-features-heading">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 id="portal-features-heading" className="text-3xl md:text-5xl font-bold mb-4">Your Music, Planned Without the Stress</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Wedding planning is overwhelming enough. We include a free online planning space where you can curate your music at your own pace—no pressure, no rushed phone calls.
            </p>
          </motion.div>

          {/* Mobile: short summary. Desktop: feature grid */}
          <ul className="mx-auto mb-8 max-w-md space-y-3 text-left text-sm text-gray-300 md:hidden">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-champagne-gold" />
              <span>Build your playlist and &quot;do not play&quot; list at your own pace</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-champagne-gold" />
              <span>Approve guest requests — nothing plays without your say-so</span>
            </li>
          </ul>

          <div
            className="hidden gap-6 md:grid md:grid-cols-2"
            role="list"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              role="listitem"
            >
              <Card className="bg-white/5 border-champagne-gold/30 h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-champagne-gold">Build Your Playlist</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Add your must-play tracks, flag your guilty pleasures, and update your choices as many times as you want. No judgment, just your music.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              role="listitem"
            >
              <Card className="bg-white/5 border-champagne-gold/30 h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-champagne-gold">Your &quot;Do Not Play&quot; List</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The sacred veto. Tell us what makes you cringe and we promise—those tracks stay off your dancefloor.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              role="listitem"
            >
              <Card className="bg-white/5 border-champagne-gold/30 h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-champagne-gold">Guest Requests (That You Control)</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Your guests can suggest songs before the day. You approve what gets played. No hijacked playlists, no surprises.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              role="listitem"
            >
              <Card className="bg-white/5 border-champagne-gold/30 h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-champagne-gold">Everything in One Place</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Your booking details, event timeline, countdown to the big day. One place, all organised, zero chaos.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 hidden md:block"
          >
            <p className="text-gray-400 text-center mb-6">
              Take a look at what your planning space looks like:
            </p>
            <div className="relative w-full rounded-xl overflow-hidden border border-champagne-gold/20 bg-gray-900 h-[min(55vh,420px)] sm:h-[min(60vh,500px)] md:h-[580px] lg:h-[650px]">
              <LazyIframe
                src="/demo/portal-preview"
                title="Client portal preview"
                className="relative w-full h-full"
                style={{ height: "100%" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-gray-900/50 border border-champagne-gold/20 rounded-lg p-6"
          >
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              <strong className="text-white">Peace of mind:</strong> You stay in full control. Everything is agreed before the day. Your guests can&apos;t hijack the playlist, and you can tweak things right up until the week before.
            </p>
          </motion.div>

          <div className="text-center mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="outline" size="lg" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 font-semibold text-lg px-8 py-6">
              <Link href="/demo/portal-preview/" target="_blank" rel="noopener noreferrer">
                See the Portal
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-10 hidden max-w-2xl text-center md:block"
          >
            <blockquote className="text-base italic text-white/90 border-l-2 border-champagne-gold pl-4 text-left">
              &ldquo;Your organisation and research has been magnificent, and the fact you have held everything technical together has made this weekend brilliant.&rdquo;
              <cite className="block text-sm text-champagne-gold not-italic mt-2">— Rob & Jules, Babington House</cite>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to check your date?</h2>
            <p className="text-gray-400 text-lg mb-8">
              Tell us your date and venue — we&apos;ll confirm availability and come back with a clear quote.
            </p>
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light font-semibold text-lg px-10 py-6">
              <Link href="/contact-us/">Check Your Date</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryPhotos}
      />

    </div>
  );
}
