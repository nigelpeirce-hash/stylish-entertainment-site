"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LazyIframe from "@/components/LazyIframe";
import { ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import type { DJCardData } from "@/lib/dj-data";

interface DJRosterCard {
  name: string;
  slug: string;
  image: string | null;
  alt: string;
  mixingStyle: string;
  bio: string;
  fullBio: string;
  youtubeEmbed: string | null;
  mixcloudEmbeds: string[];
}

// Filter testimonials for the per-DJ "Client Testimonials" block in the modal.
//
// We source from testimonials.ts only (the long-form quotes). reviews.ts is
// intentionally NOT included because every reviews.ts entry is a shortened
// duplicate of a testimonials.ts entry — including both used to render the
// same review twice in the modal (e.g. Camilla & Dan / Camilla & Dan Wilkins).
//
// For DJ Nige specifically, we also include every Babington House testimonial
// regardless of whether the quote text mentions his name. He is the 22-year
// resident DJ at Babington House, so all Babington testimonials belong to him.
function getDJTestimonials(djName: string) {
  const djKeywords: { [key: string]: string[] } = {
    "DJ Nige": ["nige", "nigel"],
    "DJ Rich": ["rich"],
    "James H DJ": ["james"],
  };

  const keywords = djKeywords[djName] || [];
  if (keywords.length === 0) return [];

  const matched = testimonials.filter((t) => {
    const quoteLower = t.quote.toLowerCase();
    const mentionsDj = keywords.some((kw) => quoteLower.includes(kw));
    const isNigeBabington =
      djName === "DJ Nige" && t.venueFilter === "Babington House";
    return mentionsDj || isNigeBabington;
  });

  // Defensive dedupe by author (case-insensitive) in case of any future
  // duplicates within testimonials.ts itself.
  const seen = new Set<string>();
  return matched
    .filter((t) => {
      const key = t.author.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((t) => ({ ...t, source: "testimonials" as const }));
}

// Normalize YouTube URLs to embed format (YouTube only; Mixcloud is handled by API)
function normalizeYouTubeUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === "") return null;

  let normalized = url.trim();
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
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = `https://${normalized}`;
    }
    if (normalized.includes("/embed/")) {
      videoId = normalized.split("/embed/")[1]?.split("?")[0];
    } else if (normalized.includes("watch?v=")) {
      videoId = normalized.split("v=")[1]?.split("&")[0];
    } else if (normalized.includes("youtu.be/")) {
      videoId = normalized.split("youtu.be/")[1]?.split("?")[0];
    }
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (normalized.includes("/embed/") && !normalized.startsWith("http")) {
    return `https://${normalized}`;
  }
  if (normalized.includes("youtube.com") && !normalized.startsWith("http")) {
    return `https://${normalized}`;
  }
  if (normalized.startsWith("https://")) {
    return normalized;
  }
  if (normalized.startsWith("http://")) {
    return normalized.replace("http://", "https://");
  }
  return null;
}

function mapDJ(raw: {
  name: string;
  slug?: string;
  bio?: string | null;
  fullBio?: string | null;
  strapLine?: string | null;
  imageUrl?: string | null;
  youtubeEmbed?: string | null;
  mixcloudEmbeds?: string[];
  mixcloudUrl?: string | null;
}): DJRosterCard {
  const youtubeEmbed = normalizeYouTubeUrl(raw.youtubeEmbed ?? null);
  const bio = raw.bio || "";
  const fullBio = (raw.fullBio && raw.fullBio.trim()) ? raw.fullBio : bio;
  const strapLine = (raw.strapLine && raw.strapLine.trim()) ? raw.strapLine : "Professional DJ Services";
  const mixcloudEmbeds =
    raw.mixcloudEmbeds && raw.mixcloudEmbeds.length > 0
      ? raw.mixcloudEmbeds
      : raw.mixcloudUrl
      ? [raw.mixcloudUrl]
      : [];
  return {
    name: raw.name,
    slug: raw.slug ?? "",
    image: raw.imageUrl ?? null,
    alt: `${raw.name} performing at weddings and events, showcasing professional DJ services`,
    mixingStyle: strapLine,
    bio,
    fullBio,
    youtubeEmbed: youtubeEmbed ?? null,
    mixcloudEmbeds,
  };
}

interface DJRosterSectionProps {
  /**
   * Server-prefetched DJ data. When provided, the component renders the roster
   * synchronously in the initial HTML (used by /artists/djs/). When omitted,
   * the component falls back to its legacy client-side fetch from /api/djs
   * (kept for back-compat with /services/djs/).
   */
  djs?: DJCardData[];
}

export default function DJRosterSection({ djs: initialDjs }: DJRosterSectionProps = {}) {
  const hasInitial = Array.isArray(initialDjs);
  const [djs, setDjs] = useState<DJRosterCard[]>(
    hasInitial ? (initialDjs as DJCardData[]).map(mapDJ) : []
  );
  const [loading, setLoading] = useState(!hasInitial);

  useEffect(() => {
    if (hasInitial) return; // Already hydrated from server props.
    const fetchDJs = async () => {
      try {
        const response = await fetch("/api/djs");
        if (response.ok) {
          const data = await response.json();
          const apiDjs = data.djs ?? [];
          setDjs(apiDjs.map(mapDJ));
        }
      } catch (error) {
        console.error("Error fetching DJs:", error);
        setDjs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDJs();
  }, [hasInitial]);

  return (
    <section className="pt-8 pb-20 px-4 bg-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
            Meet Our <span className="text-gradient">DJs</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Hand-picked for weddings, private parties and corporate events—each brings a distinct sound and the same premium standard.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <p>Loading DJs...</p>
            </div>
          ) : djs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No DJs available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {djs.map((dj, index) => (
                <motion.div
                  key={dj.name}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
                >
                  <Card className="bg-gray-900 border-2 border-champagne-gold/40 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-champagne-gold/60 group flex flex-col">
                    {dj.slug ? (
                      <Link
                        href={`/artists/djs/${dj.slug}/`}
                        aria-label={`View ${dj.name}'s full profile`}
                        className="relative aspect-[4/3] overflow-hidden bg-gray-900 block focus:outline-none focus:ring-2 focus:ring-champagne-gold/60 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        {dj.image ? (
                          <Image
                            src={dj.image}
                            alt={dj.alt}
                            fill
                            className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                            style={{ objectPosition: "center center" }}
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
                            <span>Image not available</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold text-white drop-shadow-lg group-hover:text-champagne-gold transition-colors">
                            {dj.name}
                          </h3>
                          <span className="inline-block mt-1 px-2.5 py-1 bg-champagne-gold/20 text-champagne-gold rounded-full text-xs font-semibold border border-champagne-gold/40">
                            {dj.mixingStyle}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                        {dj.image ? (
                          <Image
                            src={dj.image}
                            alt={dj.alt}
                            fill
                            className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                            style={{ objectPosition: "center center" }}
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
                            <span>Image not available</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold text-white drop-shadow-lg">{dj.name}</h3>
                          <span className="inline-block mt-1 px-2.5 py-1 bg-champagne-gold/20 text-champagne-gold rounded-full text-xs font-semibold border border-champagne-gold/40">
                            {dj.mixingStyle}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4 sm:p-5 flex flex-col">
                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 mb-4">{dj.bio}</p>

                      {(dj.youtubeEmbed || (dj.mixcloudEmbeds && dj.mixcloudEmbeds.length > 0)) && (
                        <div className="space-y-3 mb-4">
                          {dj.youtubeEmbed && dj.youtubeEmbed.trim() !== "" && dj.youtubeEmbed.startsWith("http") && (
                            <div>
                              <span className="text-xs font-semibold text-champagne-gold uppercase tracking-wider">Watch</span>
                              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/20 mt-1">
                                <LazyIframe
                                  src={dj.youtubeEmbed}
                                  title={`${dj.name} - Video`}
                                  className="absolute inset-0 w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  referrerPolicy="strict-origin-when-cross-origin"
                                />
                              </div>
                            </div>
                          )}
                          {dj.mixcloudEmbeds && dj.mixcloudEmbeds.length > 0 && (
                            <div>
                              <span className="text-xs font-semibold text-champagne-gold uppercase tracking-wider">Listen</span>
                              <div className="space-y-2 mt-1">
                                {dj.mixcloudEmbeds.slice(0, 2).map((embed: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="relative w-full rounded overflow-hidden bg-black/20"
                                    style={{ height: "48px" }}
                                  >
                                    <LazyIframe
                                      src={embed}
                                      title={`${dj.name} - Mix ${idx + 1}`}
                                      className="absolute inset-0 w-full h-full"
                                      allow="encrypted-media; fullscreen; autoplay; idle-detection; web-share"
                                      frameBorder="0"
                                    />
                                  </div>
                                ))}
                                {dj.mixcloudEmbeds.length > 2 && (
                                  <p className="text-xs text-gray-400">+{dj.mixcloudEmbeds.length - 2} more in full bio</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-auto space-y-2">
                        {dj.slug ? (
                          <Button
                            asChild
                            className="w-full bg-champagne-gold text-black hover:bg-champagne-gold/90 transition-colors font-semibold min-h-[48px] shadow-[0_0_16px_rgba(212,175,55,0.18)]"
                          >
                            <Link
                              href={`/artists/djs/${dj.slug}/`}
                              aria-label={`View ${dj.name}'s full profile`}
                            >
                              View {dj.name}&rsquo;s full profile
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        ) : null}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full border-champagne-gold/50 text-champagne-gold/90 hover:bg-champagne-gold/10 hover:text-champagne-gold transition-colors font-medium min-h-[44px] text-sm"
                            >
                              Quick preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-champagne-gold/30">
                            <DialogHeader>
                              <DialogTitle className="text-3xl md:text-4xl text-white font-bold mb-4">
                                {dj.name}
                              </DialogTitle>
                              <div className="text-base sm:text-lg text-gray-100 leading-relaxed space-y-6 prose prose-lg max-w-none">
                                {(() => {
                                  const fullBio = dj.fullBio || "";
                                  const parts = fullBio.split("---");
                                  const bioText = parts[0] || "";
                                  const testimonialsText = parts[1];

                                  return (
                                    <>
                                      {bioText
                                        .split("\n\n")
                                        .filter((p) => p.trim() && !p.includes("**Recent Testimonials**"))
                                        .map((paragraph, index) => {
                                          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                                          const linkParts: (string | ReactNode)[] = [];
                                          let lastIndex = 0;
                                          let match;

                                          while ((match = linkRegex.exec(paragraph)) !== null) {
                                            if (match.index > lastIndex) {
                                              linkParts.push(paragraph.substring(lastIndex, match.index));
                                            }
                                            linkParts.push(
                                              <Link
                                                key={match.index}
                                                href={match[2]}
                                                className="text-champagne-gold hover:text-champagne-gold/80 underline"
                                              >
                                                {match[1]}
                                              </Link>
                                            );
                                            lastIndex = match.index + match[0].length;
                                          }
                                          if (lastIndex < paragraph.length) {
                                            linkParts.push(paragraph.substring(lastIndex));
                                          }

                                          return (
                                            <p key={index} className="mb-4 leading-relaxed text-gray-100">
                                              {linkParts.length > 0 ? linkParts : paragraph}
                                            </p>
                                          );
                                        })}

                                      {testimonialsText && (
                                        <div className="mt-8 pt-6 border-t-2 border-champagne-gold/30">
                                          <h3 className="text-2xl font-bold text-white mb-6">Recent Testimonials</h3>
                                          <div className="space-y-6">
                                            {testimonialsText
                                              .split(/\*\*([^*]+)\*\*/)
                                              .filter((section, idx) => idx % 2 === 1 && section.trim() && !section.includes("Recent Testimonials"))
                                              .map((venue, idx) => {
                                                const fullSection = testimonialsText.split(`**${venue}**`)[1]?.split("**")[0] || "";
                                                const lines = fullSection.split("\n").filter((l) => l.trim());
                                                const quoteLines = lines.filter(
                                                  (l) => !l.includes("—") && !l.includes("-") && l.trim() && !l.match(/^[A-Z][a-z]+ & [A-Z]/)
                                                );
                                                const quote = quoteLines.join(" ").replace(/^"/, "").replace(/"$/, "").trim();
                                                const authorLine = lines.find((l) => l.includes("—") || (l.includes(",") && l.match(/^[A-Z]/)));
                                                const author = authorLine ? authorLine.replace(/^—\s*/, "").replace(/^-\s*/, "").trim() : "";

                                                return (
                                                  <div
                                                    key={idx}
                                                    className="p-6 bg-gradient-to-br from-champagne-gold/5 to-yellow-400/5 rounded-lg border border-champagne-gold/20 shadow-sm"
                                                  >
                                                    <h4 className="text-lg font-bold text-champagne-gold mb-3">{venue}</h4>
                                                    {quote && (
                                                      <p className="text-gray-200 italic mb-3 leading-relaxed">&quot;{quote}&quot;</p>
                                                    )}
                                                    {author && <p className="text-gray-300 text-sm font-medium">— {author}</p>}
                                                  </div>
                                                );
                                              })}
                                          </div>
                                        </div>
                                      )}

                                      {(() => {
                                        const djTestimonials = getDJTestimonials(dj.name);
                                        if (djTestimonials.length === 0) return null;

                                        return (
                                          <div className="mt-8 pt-6 border-t-2 border-champagne-gold/30">
                                            <div className="flex items-center gap-2 mb-6">
                                              <Quote className="w-6 h-6 text-champagne-gold" strokeWidth={2} />
                                              <h3 className="text-2xl font-bold text-white">Client Testimonials</h3>
                                            </div>
                                            <div className="space-y-4">
                                              {djTestimonials.slice(0, 5).map((testimonial, idx) => (
                                                <div
                                                  key={idx}
                                                  className="p-5 bg-gradient-to-br from-champagne-gold/5 to-yellow-400/5 rounded-lg border border-champagne-gold/20 shadow-sm hover:border-champagne-gold/40 transition-colors"
                                                >
                                                  <p className="text-gray-200 italic mb-3 leading-relaxed">
                                                    &quot;{testimonial.quote}&quot;
                                                  </p>
                                                  <div className="flex items-center justify-between pt-2 border-t border-champagne-gold/20">
                                                    <p className="text-champagne-gold font-semibold text-sm">{testimonial.author}</p>
                                                    {"venueUrl" in testimonial && testimonial.venueUrl ? (
                                                      <Link
                                                        href={testimonial.venueUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-champagne-gold text-xs transition-colors"
                                                        aria-label={`View ${testimonial.venue} venue`}
                                                      >
                                                        {testimonial.venue}
                                                      </Link>
                                                    ) : (
                                                      <p className="text-gray-400 text-xs">{testimonial.venue}</p>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                              {djTestimonials.length > 5 && (
                                                <p className="text-gray-400 text-sm italic text-center pt-2">
                                                  And {djTestimonials.length - 5} more testimonial{djTestimonials.length - 5 !== 1 ? "s" : ""}...
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </>
                                  );
                                })()}
                              </div>
                            </DialogHeader>
                            <div className="space-y-4 mt-6 pt-6 border-t border-champagne-gold/20">
                              {dj.youtubeEmbed && dj.youtubeEmbed.trim() !== "" && dj.youtubeEmbed.startsWith("http") && (
                                <div>
                                  <h4 className="font-semibold mb-2 text-white text-sm uppercase tracking-wider">Watch</h4>
                                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/10 shadow-lg">
                                    <LazyIframe
                                      src={dj.youtubeEmbed}
                                      title={`${dj.name} - Video`}
                                      className="absolute inset-0 w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                      referrerPolicy="strict-origin-when-cross-origin"
                                    />
                                  </div>
                                </div>
                              )}
                              <div>
                                <h4 className="font-semibold mb-2 text-white text-sm uppercase tracking-wider">Listen</h4>
                                <div className="space-y-3">
                                  {dj.mixcloudEmbeds && dj.mixcloudEmbeds.length > 0 ? (
                                    dj.mixcloudEmbeds.map((embed, idx) => (
                                      <div
                                        key={idx}
                                        className="relative w-full rounded-lg overflow-hidden bg-black/10 shadow-lg hover:shadow-xl transition-shadow"
                                        style={{ height: "60px" }}
                                      >
                                        <LazyIframe
                                          src={embed}
                                          title={`${dj.name} - Mix ${idx + 1}`}
                                          className="absolute inset-0 w-full h-full"
                                          allow="encrypted-media; fullscreen; autoplay; idle-detection; web-share"
                                          frameBorder="0"
                                          height="60px"
                                        />
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-600 rounded-lg">
                                      Mixcloud mixes coming soon
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
