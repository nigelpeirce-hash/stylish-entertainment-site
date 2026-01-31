"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useEffect, useState } from "react";
import LazyIframe from "@/components/LazyIframe";
import { Target, Clock, Sparkles, Wrench, Music, Shield, Play, Search, Quote } from "lucide-react";
import YMCACheck from "@/components/YMCACheck";
import { Input } from "@/components/ui/input";
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

import { getVenuesWeveWorkedAt } from "@/lib/venues-weve-worked-at";
import { getEditorialServiceRegions, EDITORIAL_SERVICE_HEADLINE } from "@/lib/service-areas";

const allVenues = getVenuesWeveWorkedAt();

export default function DJs() {
  const [venueSearch, setVenueSearch] = useState("");
  const [djs, setDjs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "DJs | Professional Wedding DJs | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Meet our talented DJs. Professional entertainment for weddings, parties and corporate events across the UK. Mixing styles and genre specialties.");
    }

    // Fetch DJs from API
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

          // Map database DJs to the format expected by the UI (admin is master, no fallbacks)
          // Helper function to normalize YouTube URLs to embed format
          const normalizeYouTubeUrl = (url: string | null | undefined): string | null => {
            if (!url || url.trim() === "") return null;
            
            let normalized = url.trim();
            
            // Extract video ID from various YouTube URL formats
            let videoId: string | null = null;
            
            // Handle embed URLs (already correct format)
            if (normalized.includes('/embed/')) {
              videoId = normalized.split('/embed/')[1]?.split('?')[0]?.split('&')[0];
              if (videoId) {
                // Preserve query parameters if they exist
                const queryParams = normalized.includes('?') ? normalized.split('?')[1] : '';
                return `https://www.youtube.com/embed/${videoId}${queryParams ? '?' + queryParams : ''}`;
              }
            }
            // Handle watch URLs: youtube.com/watch?v=VIDEO_ID
            else if (normalized.includes('youtube.com/watch?v=') || normalized.includes('youtube.com/watch?v=')) {
              videoId = normalized.split('v=')[1]?.split('&')[0];
            }
            // Handle short URLs: youtu.be/VIDEO_ID
            else if (normalized.includes('youtu.be/')) {
              videoId = normalized.split('youtu.be/')[1]?.split('?')[0];
            }
            // Handle URLs missing protocol
            else if (normalized.includes('youtube.com') || normalized.includes('youtu.be')) {
              // Add https:// if missing
              if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
                normalized = `https://${normalized}`;
              }
              // Try to extract video ID again after adding protocol
              if (normalized.includes('/embed/')) {
                videoId = normalized.split('/embed/')[1]?.split('?')[0];
              } else if (normalized.includes('watch?v=')) {
                videoId = normalized.split('v=')[1]?.split('&')[0];
              } else if (normalized.includes('youtu.be/')) {
                videoId = normalized.split('youtu.be/')[1]?.split('?')[0];
              }
            }
            
            // If we extracted a video ID, create embed URL
            if (videoId) {
              return `https://www.youtube.com/embed/${videoId}`;
            }
            
            // If it's already an embed URL but missing protocol, add it
            if (normalized.includes('/embed/') && !normalized.startsWith('http')) {
              return `https://${normalized}`;
            }
            
            // If it looks like a valid YouTube URL but not embed format, return as-is with https
            if (normalized.includes('youtube.com') && !normalized.startsWith('http')) {
              return `https://${normalized}`;
            }
            
            // If it already starts with https://, return as-is
            if (normalized.startsWith('https://')) {
              return normalized;
            }
            
            // If it starts with http://, upgrade to https://
            if (normalized.startsWith('http://')) {
              return normalized.replace('http://', 'https://');
            }
            
            // If we can't normalize it, return null
            return null;
          };

          const mappedDJs = apiDjs.map((dj: any) => {
            const youtubeEmbed = normalizeYouTubeUrl(dj.youtubeEmbed);
            const bio = dj.bio || "";
            const fullBio = (dj.fullBio && dj.fullBio.trim()) ? dj.fullBio : bio;
            const strapLine = (dj.strapLine && dj.strapLine.trim()) ? dj.strapLine : "Professional DJ Services";
            const mixcloudEmbeds = (dj.mixcloudEmbeds && dj.mixcloudEmbeds.length > 0)
              ? dj.mixcloudEmbeds
              : (dj.mixcloudUrl ? [dj.mixcloudUrl] : []);
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
    <div>
      <YMCACheck />
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163785/Nigel-DJ-Babs-House-0002-1_ktgbaf.jpg"
            alt="DJ Nige performing at Babington House, showcasing professional wedding DJ services with elegant lighting"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            priority
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-48 md:pt-52"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30"
          >
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">Meet The Team</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Our <span className="text-gradient drop-shadow-md">DJs</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold leading-relaxed px-4 drop-shadow-md">
            Professional DJs with exceptional talent and expertise
          </p>
        </motion.div>
      </section>

      {/* Selling Points */}
      <section className="py-16 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/20 rounded-full border border-champagne-gold/40">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-6 text-white font-bold px-4">
              What Sets Our <span className="text-gradient">DJs Apart</span>
            </h2>
          </motion.div>

          {/* Introduction Text Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="bg-gray-800 border-2 border-champagne-gold/30 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed mb-4">
                  Looking for a DJ to make your event unforgettable? Our experienced and reliable DJs know exactly how to get the crowd dancing with their perfect mix of music, sound and lighting. Choose from our brilliant solo mobile DJs or our festival trio of DJ, sax and percussion to truly wow and entertain your guests.
                </p>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  We pride ourselves on our ability to read the crowd and cater to everyone's musical tastes, from the music lovers to your Aunt Betty. And to ensure a unique experience, we have banned overplayed and cliché songs such as YMCA, "Come on Eileen," and "The Macarena."
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg relative">
                      <Target className="w-10 h-10 text-champagne-gold" strokeWidth={2.5} />
                      {/* Bullseye rings */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full border-2 border-champagne-gold/40"></div>
                        <div className="absolute w-10 h-10 rounded-full border-2 border-champagne-gold/50"></div>
                        <div className="absolute w-6 h-6 rounded-full border-2 border-champagne-gold/60"></div>
                        <div className="absolute w-3 h-3 rounded-full bg-champagne-gold/80 border border-champagne-gold"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Professional Standards</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our DJs will not whoop at the crowd, wear orange wigs, or revolving bow ties.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg relative flex items-center justify-center">
                      <svg 
                        className="w-10 h-10 text-champagne-gold relative z-10" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        {/* Hour hand pointing to 5 (5 o'clock position) */}
                        <line x1="12" y1="12" x2="15" y2="17.2" strokeLinecap="round" strokeWidth="2.5" />
                        {/* Minute hand pointing to 12 */}
                        <line x1="12" y1="12" x2="12" y2="4" strokeLinecap="round" strokeWidth="1.5" />
                        {/* Clock face markers */}
                        <circle cx="12" cy="4" r="0.5" fill="currentColor" />
                        <circle cx="20" cy="12" r="0.5" fill="currentColor" />
                        <circle cx="12" cy="20" r="0.5" fill="currentColor" />
                        <circle cx="4" cy="12" r="0.5" fill="currentColor" />
                        {/* Center dot */}
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Extended Performance</h3>
                  <p className="text-gray-300 leading-relaxed">
                    They can play for five hours without a break, from 7pm to 12am or 8pm to 1am.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                      <Sparkles className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Dedicated Service</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our DJs are flexible, motivated and committed to making your party a great success.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                      <Wrench className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Early Setup Available</h3>
                  <p className="text-gray-300 leading-relaxed">
                    They can offer an early setup for your convenience.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                      <Music className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Your Music, Your Way</h3>
                  <p className="text-gray-300 leading-relaxed">
                    They will play your requests/playlist and work to your music brief. If you don&apos;t like Beyonce, they won&apos;t play her.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                      <Shield className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Fully Insured Equipment</h3>
                  <p className="text-gray-300 leading-relaxed">
                    All of our DJs use their own well-maintained sound and lighting equipment, which is PAT tested with public liability insurance.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DJ Grid - 2-column tiles that expand */}
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
              Our <span className="text-gradient">DJs</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Each DJ brings their unique style and expertise to create the perfect atmosphere
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {djs.map((dj, index) => (
                <motion.div
                  key={dj.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
                >
                  <Card className="bg-gray-900 border-2 border-champagne-gold/40 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-champagne-gold/60 group h-full flex flex-col">
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
                    <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 mb-4 flex-1">{dj.bio}</p>

                      {/* Watch & Listen – visible on tile */}
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
                              className="w-full mt-auto border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-black transition-all duration-300 font-semibold"
                            >
                              Read more & expand
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-3xl md:text-4xl text-white font-bold mb-4">
                                {dj.name}
                              </DialogTitle>
                              <div className="text-base sm:text-lg text-gray-100 leading-relaxed space-y-6 prose prose-lg max-w-none">
                                {(() => {
                                  const fullBio = dj.fullBio || "";
                                  const parts = fullBio.split('---');
                                  const bioText = parts[0] || "";
                                  const testimonialsText = parts[1];
                                  
                                  return (
                                    <>
                                      {/* Biography paragraphs */}
                                      {bioText.split('\n\n').filter(p => p.trim() && !p.includes('**Recent Testimonials**')).map((paragraph, index) => {
                                        // Check for markdown links [text](url)
                                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                                        const parts = [];
                                        let lastIndex = 0;
                                        let match;
                                        
                                        while ((match = linkRegex.exec(paragraph)) !== null) {
                                          // Add text before the link
                                          if (match.index > lastIndex) {
                                            parts.push(paragraph.substring(lastIndex, match.index));
                                          }
                                          // Add the link
                                          parts.push(
                                            <Link key={match.index} href={match[2]} className="text-champagne-gold hover:text-champagne-gold/80 underline">
                                              {match[1]}
                                            </Link>
                                          );
                                          lastIndex = match.index + match[0].length;
                                        }
                                        
                                        // Add remaining text after last link
                                        if (lastIndex < paragraph.length) {
                                          parts.push(paragraph.substring(lastIndex));
                                        }
                                        
                                        return (
                                          <p key={index} className="mb-4 leading-relaxed text-gray-100">
                                            {parts.length > 0 ? parts : paragraph}
                                          </p>
                                        );
                                      })}
                                      
                                      {/* Testimonials section from fullBio */}
                                      {testimonialsText && (
                                        <div className="mt-8 pt-6 border-t-2 border-champagne-gold/30">
                                          <h3 className="text-2xl font-bold text-white mb-6">Recent Testimonials</h3>
                                          <div className="space-y-6">
                                            {testimonialsText.split(/\*\*([^*]+)\*\*/).filter((section, idx) => idx % 2 === 1 && section.trim() && !section.includes('Recent Testimonials')).map((venue, idx) => {
                                              const fullSection = testimonialsText.split(`**${venue}**`)[1]?.split('**')[0] || '';
                                              const lines = fullSection.split('\n').filter(l => l.trim());
                                              const quoteLines = lines.filter(l => !l.includes('—') && !l.includes('-') && l.trim() && !l.match(/^[A-Z][a-z]+ & [A-Z]/));
                                              const quote = quoteLines.join(' ').replace(/^"/, '').replace(/"$/, '').trim();
                                              const authorLine = lines.find(l => l.includes('—') || (l.includes(',') && l.match(/^[A-Z]/)));
                                              const author = authorLine ? authorLine.replace(/^—\s*/, '').replace(/^-\s*/, '').trim() : '';
                                              
                                              return (
                                                <div key={idx} className="p-6 bg-gradient-to-br from-champagne-gold/5 to-yellow-400/5 rounded-lg border border-champagne-gold/20 shadow-sm">
                                                  <h4 className="text-lg font-bold text-champagne-gold mb-3">{venue}</h4>
                                                  {quote && <p className="text-gray-200 italic mb-3 leading-relaxed">"{quote}"</p>}
                                                  {author && <p className="text-gray-300 text-sm font-medium">— {author}</p>}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Dynamic Testimonials Section - Pulled from reviews/testimonials */}
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
                                                    <p className="text-champagne-gold font-semibold text-sm">
                                                      {testimonial.author}
                                                    </p>
                                                    {'venueUrl' in testimonial && testimonial.venueUrl ? (
                                                      <Link
                                                        href={testimonial.venueUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-champagne-gold text-xs transition-colors"
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
                                                  And {djTestimonials.length - 5} more testimonial{djTestimonials.length - 5 !== 1 ? 's' : ''}...
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

      {/* Fun Video Gallery - Portrait Style */}
      <section className="py-20 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">The Fun We Create</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-white font-bold px-4">
              See The <span className="text-gradient">Party In Action</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Watch how our DJs create unforgettable moments and get everyone dancing
            </p>
          </motion.div>

          {/* Portrait Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { id: "5VChJyJMIfs", title: "DJ performance and crowd energy" },
              { id: "EPq35ZF1Awc", title: "Wedding party dance floor excitement" },
              { id: "3TnzdP0IhTU", title: "Celebration moments and guest reactions" },
              { id: "iGCx-ZzMMtw", title: "Fun party atmosphere and music mixing" },
            ].map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-2 border-champagne-gold/30 shadow-xl overflow-hidden hover:border-champagne-gold/60 transition-all duration-300 hover:shadow-2xl h-full">
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-[9/16] rounded-t-lg overflow-hidden bg-gray-900">
                      <LazyIframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={`${video.title} - Stylish Entertainment DJ Services`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                      {/* Refined Play Icon Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none flex items-center justify-center">
                        <div className="relative">
                          {/* Outer glow ring */}
                          <div className="absolute inset-0 bg-champagne-gold/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-300"></div>
                          {/* Play button circle */}
                          <div className="relative bg-champagne-gold/95 backdrop-blur-sm rounded-full p-4 md:p-5 shadow-2xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                            <Play 
                              className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" 
                              fill="currentColor"
                              strokeWidth={2}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Subtle corner indicator */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <Play className="w-4 h-4 text-champagne-gold" fill="currentColor" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Does It Work */}
      <section className="py-20 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Booking Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-6 text-white font-bold px-4">
              How Does It <span className="text-gradient">Work?</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-champagne-gold/30 bg-gray-800 shadow-lg mb-8">
              <CardContent className="p-8 sm:p-10 md:p-12">
                <div className="space-y-6 text-gray-100 leading-relaxed">
                  <p className="text-lg sm:text-xl">
                    Once you share your date, location, and timings, we&apos;ll tailor a bespoke quote based on our current availability. If you&apos;re ready to move forward, we&apos;ll send over your booking details. We want to ensure they&apos;re the perfect match for your vision, so you&apos;ll have the chance to connect either before you book or as your celebration draws near.
                  </p>
                  <p className="text-lg sm:text-xl">
                    As soon as you share your date, location, and timings, we&apos;ll tailor a bespoke quote based on our current availability. To secure your date on our calendar, we&apos;ll begin by sending over a booking invoice for the initial commitment, with the remaining balance settled just two weeks before the big day.
                  </p>
                  <p className="text-lg sm:text-xl">
                    Once your booking is confirmed, you&apos;ll gain exclusive access to our digital planning worksheet. This is truly where the magic happens: you can update it over the coming months with every essential detail and your curated playlist to ensure the evening flows flawlessly. You&apos;ll also have the chance to connect personally with your DJ as your celebration draws near to chat through those final, finer details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Nationwide Reach – Editorial Region Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                {EDITORIAL_SERVICE_HEADLINE.headline}
              </h3>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                {EDITORIAL_SERVICE_HEADLINE.subheadline}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {getEditorialServiceRegions().map((tile, index) => (
                <motion.div
                  key={tile.region}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="h-full border-champagne-gold/30 bg-gray-800/80 backdrop-blur-sm hover:border-champagne-gold/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 sm:p-8">
                      <h4 className="text-lg sm:text-xl font-bold text-champagne-gold mb-3 tracking-tight">
                        {tile.region}
                      </h4>
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {tile.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Venues We've Played At */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-8"
          >
            <Card className="border-champagne-gold/30 bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 sm:p-10 md:p-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                  Venues We've Played At
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center mb-6">
                  Check if we've performed at your venue. Search by venue name or location.
                </p>
                
                {/* Search Input */}
                <div className="relative mb-6 max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search venues..."
                    value={venueSearch}
                    onChange={(e) => setVenueSearch(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-champagne-gold/30 text-white placeholder:text-gray-500 focus:border-champagne-gold/60"
                  />
                </div>

                {/* Venues List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allVenues
                    .filter((venue) => 
                      venue.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
                      venue.location.toLowerCase().includes(venueSearch.toLowerCase())
                    )
                    .map((venue, index) => (
                      <motion.div
                        key={`${venue.name}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.01 }}
                        className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-champagne-gold/20 hover:border-champagne-gold/40 hover:bg-gray-900/70 transition-all"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{venue.name}</p>
                          {venue.location && (
                            <p className="text-gray-400 text-sm">{venue.location}</p>
                          )}
                        </div>
                        {venue.url && (
                          <Link
                            href={venue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-champagne-gold hover:text-champagne-gold/80 text-sm font-medium ml-4 transition-colors"
                          >
                            View →
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  {allVenues.filter((venue) => 
                    venue.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
                    venue.location.toLowerCase().includes(venueSearch.toLowerCase())
                  ).length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      No venues found. Try a different search term.
                    </p>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 text-center mt-6 italic">
                  Don't see your venue? We'd love to play there! Contact us to discuss your date.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Card className="border-2 border-champagne-gold/50 bg-gray-800 shadow-xl">
              <CardContent className="p-8 sm:p-10">
                <p className="text-xl sm:text-2xl font-bold text-white mb-6">
                  Please Contact us for a free quote based on your location and timings.
                </p>
                <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
                  <Link href="/contact-us">Get Your Free Quote</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to book your perfect match?
            </h2>
            <Button asChild size="lg">
              <Link href="/contact-us">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
