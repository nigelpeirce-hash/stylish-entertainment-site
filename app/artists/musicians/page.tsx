"use client";

import { motion } from "@/lib/motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Music2 } from "lucide-react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import LazyIframe from "@/components/LazyIframe";

export default function Musicians() {
  const [musicians, setMusicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Title + description are set server-side via app/artists/musicians/layout.tsx
    // (see createMetadata call). Do NOT mutate document.title here — Google
    // sees the initial HTML title before client JS runs.
    const fetchMusicians = async () => {
      try {
        const response = await fetch("/api/musicians");
        if (response.ok) {
          const data = await response.json();
          // Normalize YouTube URLs
          const normalizeYouTubeUrl = (url: string | null | undefined): string | null => {
            if (!url || url.trim() === "") return null;
            let normalized = url.trim();
            let videoId: string | null = null;
            
            if (normalized.includes('/embed/')) {
              videoId = normalized.split('/embed/')[1]?.split('?')[0]?.split('&')[0];
              if (videoId) {
                const queryParams = normalized.includes('?') ? normalized.split('?')[1] : '';
                return `https://www.youtube.com/embed/${videoId}${queryParams ? '?' + queryParams : ''}`;
              }
            } else if (normalized.includes('youtube.com/watch?v=')) {
              videoId = normalized.split('v=')[1]?.split('&')[0];
            } else if (normalized.includes('youtu.be/')) {
              videoId = normalized.split('youtu.be/')[1]?.split('?')[0];
            }
            
            if (videoId) {
              return `https://www.youtube.com/embed/${videoId}`;
            }
            
            if (normalized.includes('/embed/') && !normalized.startsWith('http')) {
              return `https://${normalized}`;
            }
            
            if (normalized.includes('youtube.com') && !normalized.startsWith('http')) {
              return `https://${normalized}`;
            }
            
            if (normalized.startsWith('https://')) {
              return normalized;
            }
            
            if (normalized.startsWith('http://')) {
              return normalized.replace('http://', 'https://');
            }
            
            return null;
          };

          const mappedMusicians = data.musicians.map((musician: any) => {
            const strapLine = (musician.strapLine && musician.strapLine.trim()) ? musician.strapLine : null;
            return {
              name: musician.name,
              image: musician.imageUrl || null,
              alt: `${musician.name} performing at weddings and events, showcasing professional live music entertainment`,
              instrument: musician.instrument || "Musician",
              strapLine,
              bio: musician.bio || "",
              fullBio: (musician.fullBio && musician.fullBio.trim()) ? musician.fullBio : null,
              youtubeEmbed: normalizeYouTubeUrl(musician.youtubeEmbed),
            };
          });
          setMusicians(mappedMusicians);
        }
      } catch (error) {
        console.error("Error fetching musicians:", error);
        setMusicians([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicians();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-50 flex items-center justify-center overflow-hidden">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768162617/Kin-House-Stage-and-Lighting-supply_ufpxbl.jpg"
            alt="Kin House stage and lighting supply, setting the scene for live musicians and wedding entertainment"
            fill
            className="object-cover brightness-110 scale-90"
            style={{ objectPosition: "center center" }}
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
            Our <span className="text-gradient drop-shadow-md">Musicians</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold leading-relaxed px-4 drop-shadow-md">
            Professional musicians with exceptional talent and expertise
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
              What Sets Our <span className="text-gradient">Musicians Apart</span>
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
                  From elegant harpists to energetic bands, our roster of talented musicians brings sophistication and energy to your wedding celebration. Whether you want background music for your ceremony or a high-energy performance for your reception, we have the perfect act for your event.
                </p>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  Each performer is carefully selected for their professionalism, talent and ability to create the perfect atmosphere for your event. We work closely with you to understand your vision and recommend the perfect musical acts to complement your celebration.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Musicians Slider */}
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
              Our <span className="text-gradient">Musicians</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Each musician brings their unique style and expertise to create the perfect atmosphere
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-400">
                <p>Loading musicians...</p>
              </div>
            ) : musicians.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No musicians available at the moment.</p>
              </div>
            ) : (
              <Slider>
                {musicians.map((musician, index) => (
                    <div key={musician.name || index} className="px-4">
                      <Card className="bg-gray-900 border-2 border-champagne-gold/40 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-champagne-gold/60 group">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:items-stretch">
                          <div className="relative h-64 md:h-auto overflow-hidden bg-gray-900 flex items-center justify-center">
                            {musician.image ? (
                              <>
                                <Image
                                  src={musician.image}
                                  alt={musician.alt}
                                  fill
                                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                  style={{ objectPosition: 'center center' }}
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                                <Music2 className="w-16 h-16 text-champagne-gold/30" />
                              </div>
                            )}
                          </div>
                          <CardHeader className="p-4 sm:p-6 md:p-6 lg:p-8 bg-gray-900 flex flex-col justify-start pb-20 sm:pb-6 md:pb-6 lg:pb-8">
                            <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 text-white font-bold">{musician.name}</CardTitle>
                            {musician.strapLine && (
                              <span className="inline-block mb-2 px-2.5 py-1 bg-champagne-gold/20 text-champagne-gold rounded-full text-xs font-semibold border border-champagne-gold/40 w-fit">
                                {musician.strapLine}
                              </span>
                            )}
                            <p className="text-sm sm:text-base text-gray-200 mb-3 sm:mb-4 leading-relaxed">{musician.bio}</p>
                            
                            <div className="mb-4">
                              <h4 className="font-bold mb-2 text-white text-xs sm:text-sm uppercase tracking-wider">Specialization:</h4>
                              <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-champagne-gold/20 to-yellow-400/20 text-champagne-gold rounded-full text-xs sm:text-sm font-semibold border border-champagne-gold/40 shadow-sm">
                                {musician.instrument}
                              </span>
                            </div>

                            {musician.fullBio && (
                              <div className="mb-4">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-black transition-all duration-300 font-semibold"
                                    >
                                      Read more
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle className="text-3xl md:text-4xl text-white font-bold mb-4">
                                        {musician.name}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="text-base sm:text-lg text-gray-100 leading-relaxed space-y-6 prose prose-lg max-w-none">
                                      {musician.fullBio.split('\n\n').filter((p: string) => p.trim()).map((paragraph: string, index: number) => {
                                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                                        const parts: (string | JSX.Element)[] = [];
                                        let lastIndex = 0;
                                        let match;
                                        while ((match = linkRegex.exec(paragraph)) !== null) {
                                          if (match.index > lastIndex) {
                                            parts.push(paragraph.substring(lastIndex, match.index));
                                          }
                                          parts.push(
                                            <Link key={match.index} href={match[2]} className="text-champagne-gold hover:text-champagne-gold/80 underline">
                                              {match[1]}
                                            </Link>
                                          );
                                          lastIndex = match.index + match[0].length;
                                        }
                                        if (lastIndex < paragraph.length) {
                                          parts.push(paragraph.substring(lastIndex));
                                        }
                                        return (
                                          <p key={index} className="mb-4 leading-relaxed text-gray-100">
                                            {parts.length > 0 ? parts : paragraph}
                                          </p>
                                        );
                                      })}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}

                            {musician.youtubeEmbed && musician.youtubeEmbed.trim() !== "" && musician.youtubeEmbed.startsWith('http') && (
                              <div className="space-y-3 sm:space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2 text-white text-xs sm:text-sm uppercase tracking-wider">Watch</h4>
                                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/10 shadow-lg">
                                    <LazyIframe
                                      src={musician.youtubeEmbed}
                                      title={`${musician.name} - Video`}
                                      className="absolute inset-0 w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                      referrerPolicy="strict-origin-when-cross-origin"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardHeader>
                        </div>
                      </Card>
                    </div>
                  ))}
                </Slider>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-3 sm:px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="bg-gray-800/50 border-champagne-gold/30">
              <CardContent className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                  Our Musicians
                </h3>
                <p className="text-white text-base sm:text-lg leading-relaxed mb-4">
                  We offer a diverse range of live entertainment including harpists, bands, duos, trios, singing waiters and cabaret acts. Our popular festival trio of DJ, sax and bongos brings a unique energy to any celebration.
                </p>
                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Each performer is carefully selected for their professionalism, talent, and ability to create the perfect atmosphere for your event.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-champagne-gold/30">
              <CardContent className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                  Versatile Performances
                </h3>
                <p className="text-white text-base sm:text-lg leading-relaxed mb-4">
                  Whether you need elegant background music for your ceremony, sophisticated entertainment for your drinks reception, or high-energy performances to get your guests dancing, our musicians adapt to your needs.
                </p>
                <p className="text-white text-base sm:text-lg leading-relaxed">
                  We work closely with you to understand your vision and recommend the perfect musical acts to complement your celebration.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to add live music to your celebration?
            </h2>
            <Link
              href="/contact-us/"
              className="inline-block px-8 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
