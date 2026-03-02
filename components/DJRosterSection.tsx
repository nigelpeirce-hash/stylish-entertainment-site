"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
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
import { Quote } from "lucide-react";
import { reviews } from "@/data/reviews";
import { testimonials } from "@/data/testimonials";

// Helper function to filter testimonials/reviews by DJ name
function getDJTestimonials(djName: string) {
  const djKeywords: { [key: string]: string[] } = {
    "DJ Nige": ["nige", "nigel"],
    "DJ Rich": ["rich"],
    "James H DJ": ["james"],
  };

  const keywords = djKeywords[djName] || [];
  if (keywords.length === 0) return [];

  const allTestimonials = [
    ...reviews.map((r) => ({ ...r, source: "reviews" as const })),
    ...testimonials.map((t) => ({ ...t, source: "testimonials" as const })),
  ];

  return allTestimonials.filter((testimonial) => {
    const quoteLower = testimonial.quote.toLowerCase();
    return keywords.some((keyword) => quoteLower.includes(keyword));
  });
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

export default function DJRosterSection() {
  const [djs, setDjs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDJs = async () => {
      try {
        const response = await fetch("/api/djs");
        if (response.ok) {
          const data = await response.json();
          const apiDjs = data.djs ?? [];
          if (apiDjs.length === 0) {
            setDjs([]);
            setLoading(false);
            return;
          }

          const mappedDJs = apiDjs.map((dj: any) => {
            const youtubeEmbed = normalizeYouTubeUrl(dj.youtubeEmbed);
            const bio = dj.bio || "";
            const fullBio = (dj.fullBio && dj.fullBio.trim()) ? dj.fullBio : bio;
            const strapLine = (dj.strapLine && dj.strapLine.trim()) ? dj.strapLine : "Professional DJ Services";
            const mixcloudEmbeds =
              dj.mixcloudEmbeds && dj.mixcloudEmbeds.length > 0
                ? dj.mixcloudEmbeds
                : dj.mixcloudUrl
                  ? [dj.mixcloudUrl]
                  : [];
            return {
              name: dj.name,
              image: dj.imageUrl ?? null,
              alt: `${dj.name} performing at weddings and events, showcasing professional DJ services`,
              mixingStyle: strapLine,
              bio,
              fullBio,
              youtubeEmbed: youtubeEmbed ?? null,
              mixcloudEmbeds,
            };
          });
          setDjs(mappedDJs);
        }
      } catch (error) {
        console.error("Error fetching DJs:", error);
        setDjs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDJs();
  }, []);

  return (
    <section className="pt-8 pb-20 px-4 bg-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
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
                                      allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
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

                      <div className="mt-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full mt-auto border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-black transition-all duration-300 font-semibold min-h-[48px]"
                            >
                              Read more & expand
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
                                          allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
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
