"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Music, 
  Sparkles, 
  Heart, 
  Users, 
  Calendar,
  CheckCircle2,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Smartphone,
  Share2,
  ListMusic,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DJ {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  mixingStyle: string | null;
}

const features = [
  {
    icon: Smartphone,
    title: "Personal Client Portal",
    description: "Your own private dashboard to manage every detail of your wedding entertainment - music preferences, timings, and more.",
  },
  {
    icon: Share2,
    title: "Guest Song Requests",
    description: "Share a link with your guests so they can request their favourite songs. We'll build your playlist together.",
  },
  {
    icon: Sparkles,
    title: "Stunning Lighting Design",
    description: "Transform your venue with uplighting, festoon lights, and dance floor lighting that creates the perfect atmosphere.",
  },
  {
    icon: ListMusic,
    title: "Curated Playlists",
    description: "From your ceremony to the last dance - every moment perfectly soundtracked to your taste.",
  },
];

const testimonials = [
  {
    quote: "The guest song request feature was amazing! Our friends loved being part of the playlist.",
    author: "Sarah & James",
    venue: "Babington House",
  },
  {
    quote: "Professional, organised, and the lighting transformed our barn venue. Couldn't recommend more highly.",
    author: "Emma & Tom",
    venue: "Priston Mill",
  },
  {
    quote: "The client portal made planning so easy. We could see everything in one place.",
    author: "Lucy & Ben",
    venue: "The Rectory Hotel",
  },
];

const stats = [
  { value: "500+", label: "Weddings" },
  { value: "5★", label: "Reviews" },
  { value: "15+", label: "Years Experience" },
  { value: "100%", label: "Would Recommend" },
];

export default function WeddingLandingClient() {
  const [djs, setDjs] = useState<DJ[]>([]);
  const [loadingDJs, setLoadingDJs] = useState(true);
  const [currentDJIndex, setCurrentDJIndex] = useState(0);

  // Fetch DJs
  useEffect(() => {
    const fetchDJs = async () => {
      try {
        const response = await fetch("/api/djs");
        if (response.ok) {
          const data = await response.json();
          setDjs(data);
        }
      } catch (error) {
        console.error("Error fetching DJs:", error);
      } finally {
        setLoadingDJs(false);
      }
    };
    fetchDJs();
  }, []);

  const nextDJ = () => {
    setCurrentDJIndex((prev) => (prev + 1) % djs.length);
  };

  const prevDJ = () => {
    setCurrentDJIndex((prev) => (prev - 1 + djs.length) % djs.length);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1/galleries/stylish/wedding-dj-hero"
            alt="Wedding DJ Setup"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-champagne-gold/20 border border-champagne-gold/30 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-champagne-gold fill-champagne-gold" />
              <span className="text-champagne-gold text-sm font-medium">
                Rated 5 Stars on Google
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Wedding,{" "}
              <span className="text-champagne-gold">Your Music</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Professional wedding DJs with a personal touch. 
              Stunning lighting, guest song requests, and your own client portal 
              to plan every detail.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/contact-us">
                <Button size="lg" className="bg-champagne-gold text-black hover:bg-gold-light text-lg px-8 py-6 font-semibold">
                  Get Your Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/galleries">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  View Our Work
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-champagne-gold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Meet Our DJs Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our <span className="text-champagne-gold">DJs</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experienced professionals who know how to read a room and keep your dance floor packed
            </p>
          </motion.div>

          {loadingDJs ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-champagne-gold animate-spin" />
            </div>
          ) : djs.length > 0 ? (
            <div className="relative">
              {/* DJ Card */}
              <motion.div
                key={currentDJIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gray-900 border-2 border-champagne-gold/40 overflow-hidden max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* DJ Image */}
                    <div className="relative h-72 md:h-96 overflow-hidden">
                      {djs[currentDJIndex]?.image ? (
                        <Image
                          src={djs[currentDJIndex].image!}
                          alt={djs[currentDJIndex].name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Music className="w-16 h-16 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* DJ Info */}
                    <CardHeader className="p-6 md:p-8 flex flex-col justify-center">
                      <CardTitle className="text-2xl md:text-3xl text-white font-bold mb-2">
                        {djs[currentDJIndex]?.name}
                      </CardTitle>
                      {djs[currentDJIndex]?.mixingStyle && (
                        <div className="inline-flex items-center gap-2 text-champagne-gold text-sm mb-4">
                          <Music className="w-4 h-4" />
                          {djs[currentDJIndex].mixingStyle}
                        </div>
                      )}
                      <p className="text-gray-300 leading-relaxed mb-6 line-clamp-4">
                        {djs[currentDJIndex]?.bio || "Professional DJ with years of experience in wedding entertainment."}
                      </p>
                      <Link href="/artists/djs">
                        <Button variant="outline" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-black">
                          View Full Profile
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardHeader>
                  </div>
                </Card>
              </motion.div>

              {/* Navigation Arrows */}
              {djs.length > 1 && (
                <>
                  <button
                    onClick={prevDJ}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white hover:bg-champagne-gold hover:text-black transition-colors"
                    aria-label="Previous DJ"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextDJ}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white hover:bg-champagne-gold hover:text-black transition-colors"
                    aria-label="Next DJ"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {djs.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {djs.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDJIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        index === currentDJIndex
                          ? "bg-champagne-gold"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                      aria-label={`Go to DJ ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Meet our talented DJs on the full roster</p>
              <Link href="/artists/djs">
                <Button className="mt-4 bg-champagne-gold text-black hover:bg-gold-light">
                  View All DJs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              More Than Just a DJ
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We&apos;ve built technology that makes planning your wedding entertainment effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700 h-full hover:border-champagne-gold/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-champagne-gold/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-champagne-gold" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Preview Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-champagne-gold text-sm font-medium uppercase tracking-wider">
                Exclusive Feature
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-6">
                Your Personal Wedding Portal
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Every couple gets access to their own private portal where you can:
              </p>
              <ul className="space-y-4">
                {[
                  "Add your must-play and do-not-play songs",
                  "Share a request link with your guests",
                  "View and manage all song requests",
                  "See your timeline and event details",
                  "Message us directly anytime",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact-us" className="inline-block mt-8">
                <Button className="bg-champagne-gold text-black hover:bg-gold-light">
                  See It In Action
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <div className="bg-gray-900 rounded-xl p-6">
                  {/* Mock Portal UI */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-champagne-gold" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Sarah & James</div>
                      <div className="text-gray-500 text-sm">15th March 2025 • Babington House</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-champagne-gold">23</div>
                      <div className="text-gray-400 text-sm">Song Requests</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">Ready</div>
                      <div className="text-gray-400 text-sm">Portal Status</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                        <Music className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm truncate">Blinding Lights</div>
                        <div className="text-gray-500 text-xs">The Weeknd • Uncle Frank</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center">
                        <Music className="w-4 h-4 text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm truncate">First Dance Song</div>
                        <div className="text-gray-500 text-xs">Your Choice • Must Play</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-champagne-gold text-black px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                Included Free!
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loved by Couples
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700 h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-champagne-gold fill-champagne-gold" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">{testimonial.venue}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Get a free, no-obligation quote for your wedding. We&apos;ll get back to you within 24 hours with availability and pricing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/contact-us">
                <Button size="lg" className="bg-champagne-gold text-black hover:bg-gold-light text-lg px-8 py-6 font-semibold">
                  Get Your Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
              <a href="tel:07970793177" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                07970 793 177
              </a>
              <a href="mailto:info@stylishentertainment.co.uk" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                info@stylishentertainment.co.uk
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">Proudly serving weddings across</p>
          <p className="text-white font-medium">
            Somerset • Bristol • Bath • Wiltshire • Dorset • Devon • Cornwall • Gloucestershire • London • Nationwide
          </p>
        </div>
      </section>

      {/* Footer Brand */}
      <footer className="py-8 px-4 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png"
            alt="Stylish Entertainment Ltd"
            width={160}
            height={50}
            className="brightness-[1.2]"
          />
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Stylish Entertainment Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
