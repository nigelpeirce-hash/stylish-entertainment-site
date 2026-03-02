"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Target, Clock, Sparkles, Wrench, Music, Shield, Search } from "lucide-react";
import DJRosterSection from "@/components/DJRosterSection";

/** Below-the-fold video gallery – loaded after initial paint to improve LCP/TBT on mobile */
const DJsVideoGallery = dynamic(() => import("./DJsVideoGallery"), {
  ssr: true,
  loading: () => (
    <section className="py-20 px-3 sm:px-4 bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 h-32 animate-pulse rounded-lg bg-gray-800/50" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[9/16] rounded-lg bg-gray-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
});
import YMCACheck from "@/components/YMCACheck";
import { Input } from "@/components/ui/input";
import { getVenuesWeveWorkedAt } from "@/lib/venues-weve-worked-at";
import { getEditorialServiceRegions, EDITORIAL_SERVICE_HEADLINE } from "@/lib/service-areas";

const allVenues = getVenuesWeveWorkedAt();

export default function DJs() {
  const [venueSearch, setVenueSearch] = useState("");

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
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768163785/Nigel-DJ-Babs-House-0002-1_ktgbaf.jpg"
            alt="DJ performing at Babington House with elegant lighting—wedding and event entertainment"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 1200px"
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
            DJs & Live DJ Acts <span className="text-gradient drop-shadow-md">Across the UK</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold leading-relaxed px-4 drop-shadow-md">
            Intelligent, high-energy entertainment for weddings, private parties and corporate events.
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
                  Our DJs shape the atmosphere and flow of your event—reading the room, building energy and crafting bespoke sets that keep the dance floor full. Choose a solo DJ, our DJ-plus-sax duo, or the full festival lineup of DJ, sax and percussion. High-end sound and lighting, zero gimmicks.
                </p>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  No clichés, no YMCA—just polished, crowd-led entertainment that feels right for your wedding, party or corporate celebration.
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
                    Polished presence, seamless mixing and clean setups—no mic-shouting or novelty antics.
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
                    Full five-hour sets when you need them—no break, no dip in energy, from first dance to last track.
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
                    Flexible, attentive and committed to your brief—from first contact to last track.
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
                    Early load-in available so everything is ready before your guests arrive.
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
                    Your playlist, your must-plays and must-not-plays—we work to your brief, not a generic formula.
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
                    Well-maintained sound and lighting, PAT tested and covered by public liability insurance.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <DJRosterSection />

      <DJsVideoGallery />

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
                <ol className="space-y-6 text-gray-100 leading-relaxed list-none pl-0">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold/20 border border-champagne-gold/50 flex items-center justify-center text-champagne-gold font-bold text-lg">1</span>
                    <div>
                      <span className="font-semibold text-white">Enquire.</span> Share your date, venue and timings—we&apos;ll send a tailored quote and confirm availability.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold/20 border border-champagne-gold/50 flex items-center justify-center text-champagne-gold font-bold text-lg">2</span>
                    <div>
                      <span className="font-semibold text-white">Secure your date.</span> Pay the booking fee; balance due two weeks before the event.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold/20 border border-champagne-gold/50 flex items-center justify-center text-champagne-gold font-bold text-lg">3</span>
                    <div>
                      <span className="font-semibold text-white">Plan.</span> Use our digital worksheet to add your playlist, must-plays and run-of-show—and connect with your DJ as the date approaches.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-champagne-gold/20 border border-champagne-gold/50 flex items-center justify-center text-champagne-gold font-bold text-lg">4</span>
                    <div>
                      <span className="font-semibold text-white">Celebrate.</span> We handle setup, flow and the dance floor—you enjoy the night.
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Complete the experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-8 text-center"
          >
            <p className="text-gray-300 text-base sm:text-lg">
              Complete the experience: <Link href="/weddings/wedding-lighting/" className="text-champagne-gold hover:text-champagne-gold/80 underline font-medium">Wedding Lighting</Link> · <Link href="/services/venue-styling/" className="text-champagne-gold hover:text-champagne-gold/80 underline font-medium">Venue Styling</Link> · <Link href="/what-we-do/" className="text-champagne-gold hover:text-champagne-gold/80 underline font-medium">Production &amp; Hire</Link>
            </p>
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
                  Venues We&apos;ve Played At
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center mb-6">
                  We&apos;ve performed at hundreds of venues across the UK. Search below by venue name or location.
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
                            aria-label={`View ${venue.name} website`}
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
                  Enquire to secure your date—we&apos;ll tailor the right Artist and setup to your venue and timings.
                </p>
                <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
                  <Link href="/contact-us/" aria-label="Enquire and check availability for your DJ or live act">Enquire &amp; Check Availability</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
