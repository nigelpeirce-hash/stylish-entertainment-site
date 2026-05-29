"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight, Mic, Music, Sparkles, CheckCircle2, X, ArrowRight } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import { LIGHTBOX_CAROUSEL, LIGHTBOX_CONTROLLER, toLightboxSlides } from "@/components/lightbox-config";
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

// Hero image – Mells Barn with fairy lights
const heroImage = {
  src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163500/Mells-Barn-Fairy-lights-in-ceiling_vmzs3p.jpg",
  alt: "Mells Barn wedding venue with fairy lights in ceiling – magical atmosphere",
};

// Social proof gallery – packed dancefloors, stylish setups
const galleryPhotos = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768749164/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg", alt: "Wedding celebration with professional lighting – Martin Beddall Photography" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg", alt: "Hedsor House dance floor with DJ and sax – sophisticated wedding entertainment" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163299/Nigel-DJ-Babs-House-0009-1_hmbsn3.jpg", alt: "DJ performing at Babington House with professional wedding entertainment" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg", alt: "The Newt Somerset wedding with fairy light tunnel – magical atmosphere" },
];

// Comparison table data
const comparisonRows = [
  { feature: "Microphone Use", typical: "Constant \"Shout-outs\"", us: "Only when strictly necessary" },
  { feature: "Music Choice", typical: "Same 50 songs every week", us: "Tailored to your specific taste" },
  { feature: "Equipment", typical: "Bulky, dated, distracting", us: "High-end, sleek, discreet" },
  { feature: "Professionalism", typical: "Part-time hobbyist", us: "Full-time entertainment experts" },
];

export default function WeddingLandingClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [djs, setDjs] = useState<DJ[]>([]);
  const [loadingDJs, setLoadingDJs] = useState(true);

  useEffect(() => {
    const fetchDJs = async () => {
      try {
        const res = await fetch("/api/djs");
        const data = await res.json();
        const apiDJs = data.djs ?? [];
        const mapped: DJ[] = apiDJs.map((dj: { name: string; imageUrl?: string | null; bio?: string | null; strapLine?: string | null; fullBio?: string | null; youtubeEmbed?: string | null; mixcloudEmbeds?: string[]; mixcloudUrl?: string | null }) => {
          const rawEmbeds = Array.isArray(dj.mixcloudEmbeds) ? dj.mixcloudEmbeds : (dj.mixcloudUrl ? [dj.mixcloudUrl] : []);
          const embeds = rawEmbeds.filter((u: string) => u && typeof u === "string" && u.trim() !== "");
          return {
            name: dj.name,
            image: dj.imageUrl ?? null,
            alt: `${dj.name} – professional wedding DJ`,
            mixingStyle: (dj.strapLine && dj.strapLine.trim()) ? dj.strapLine : "Professional DJ Services",
            bio: dj.bio ?? "",
            fullBio: dj.fullBio && dj.fullBio.trim() ? dj.fullBio : null,
            youtubeEmbed: normalizeYouTubeUrl(dj.youtubeEmbed),
            mixcloudEmbeds: embeds,
          };
        });
        setDjs(mapped);
      } catch {
        setDjs([]);
      } finally {
        setLoadingDJs(false);
      }
    };
    fetchDJs();
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            className="object-cover brightness-[0.7]"
            priority
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-950" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-32 md:pt-40"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            You&apos;re Terrified of a Cheesy DJ.<br />
            <span className="text-champagne-gold">We&apos;re the Antidote.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto">
            High-quality, modern wedding entertainment for couples who hate &quot;wedding music.&quot; We&apos;re professional, and we promise: no cringe, no cheesy chat, and absolutely no &quot;YMCA.&quot;
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light font-semibold text-lg px-8 py-6">
              <Link href="/contact-us/">Check Your Date</Link>
            </Button>
          </div>
        </motion.div>
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
                      <h3 className="text-xl font-bold mb-2">We Travel to You</h3>
                      <p className="text-gray-300">Whether it&apos;s a grand ballroom or an intimate barn, we bring the vibe to your venue.</p>
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

          {loadingDJs ? (
            <div className="text-center py-12 text-gray-400">
              <p>Loading DJs...</p>
            </div>
          ) : djs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {djs.map((dj, index) => (
                <motion.div
                  key={dj.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
                          priority={index === 0}
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
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Couples Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {galleryPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

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
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
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
              <h3 className="text-xl font-bold mb-2">The Vibe Check</h3>
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

          {/* Mobile: horizontal scroll with snap. Desktop: 2-column grid */}
          <div
            className="flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-visible gap-6 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none"
            style={{ WebkitOverflowScrolling: "touch" }}
            role="list"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex-shrink-0 w-[85vw] min-w-[280px] max-w-[340px] md:w-auto md:min-w-0 md:max-w-none snap-center snap-always md:snap-align-none"
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
              className="flex-shrink-0 w-[85vw] min-w-[280px] max-w-[340px] md:w-auto md:min-w-0 md:max-w-none snap-center snap-always md:snap-align-none"
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
              className="flex-shrink-0 w-[85vw] min-w-[280px] max-w-[340px] md:w-auto md:min-w-0 md:max-w-none snap-center snap-always md:snap-align-none"
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
              className="flex-shrink-0 w-[85vw] min-w-[280px] max-w-[340px] md:w-auto md:min-w-0 md:max-w-none snap-center snap-always md:snap-align-none"
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

          {/* Mobile: scroll hint */}
          <p className="md:sr-only text-center text-gray-500 text-sm mt-3 mb-4" aria-hidden="true">
            Swipe to see all features
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
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
              <Link href="/demo/portal-preview" target="_blank" rel="noopener noreferrer">
                See the Portal
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mt-10 text-center"
          >
            <blockquote className="text-base italic text-white/90 border-l-2 border-champagne-gold pl-4 text-left">
              &ldquo;Your organisation and research has been magnificent, and the fact you have held everything technical together has made this weekend brilliant.&rdquo;
              <cite className="block text-sm text-champagne-gold not-italic mt-2">— Rob & Jules, Babington House</cite>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pt-10 pb-20 md:pt-14 md:pb-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-champagne-gold/50">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Feature</th>
                  <th className="text-left py-4 px-4 text-red-400/90 font-semibold">The &quot;Typical&quot; DJ</th>
                  <th className="text-left py-4 px-4 text-champagne-gold font-semibold">Us</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500/70" />
                        {row.typical}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-200">
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-champagne-gold" />
                        {row.us}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a wedding that doesn&apos;t feel like a school disco?</h2>
            <p className="text-gray-400 text-lg mb-8">Stop settling for &quot;standard.&quot; Let&apos;s talk about your music.</p>
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light font-semibold text-lg px-10 py-6">
              <Link href="/contact-us/">Check Availability & Pricing</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={toLightboxSlides(galleryPhotos)}
        carousel={LIGHTBOX_CAROUSEL}
        controller={LIGHTBOX_CONTROLLER}
        render={{
          buttonPrev: () => <ChevronLeft className="w-8 h-8 text-white" />,
          buttonNext: () => <ChevronRight className="w-8 h-8 text-white" />,
        }}
      />

    </div>
  );
}
