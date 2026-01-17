"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlameKindling, Shield, Users, Cloud, Package } from "lucide-react";

export default function FirePitClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&h=1080&fit=crop"
            alt="Outdoor fire pit hire for wedding venues"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-orange-900/40 via-transparent to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <div className="mb-6">
            <FlameKindling className="w-16 h-16 mx-auto text-orange-200 drop-shadow-lg" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Fire Pit Hire
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Create a warm, inviting atmosphere with our outdoor fire pit installations
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <div
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        {/* Service Details */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border-champagne-gold/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <FlameKindling className="h-8 w-8 text-orange-200" />
                    <CardTitle className="text-3xl md:text-4xl text-white">Fire Pit Hire</CardTitle>
                  </div>
                  <p className="text-lg text-gray-200 leading-relaxed">
                    Add warmth and ambiance to your outdoor wedding celebration with our professional fire pit hire service. Perfect for evening receptions, creating cozy gathering spaces, and extending your celebration into the night.
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Cozy Experience Grid */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">The Cozy Experience</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-orange-200/50 transition-all duration-300">
                        <CardHeader>
                          <Shield className="w-10 h-10 text-orange-200 mb-3" />
                          <CardTitle className="text-white text-xl">Safety First</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-200 leading-relaxed">
                            All our fire pits are professionally maintained and safety-checked with the same care we apply to our electrical equipment. PAT-tested-level reliability, but for fire.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-orange-200/50 transition-all duration-300">
                        <CardHeader>
                          <Users className="w-10 h-10 text-orange-200 mb-3" />
                          <CardTitle className="text-white text-xl">The Social Hub</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-200 leading-relaxed">
                            Perfect for guests who want to chat away from the music. Fire pits create natural gathering points that encourage conversation and connection.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-orange-200/50 transition-all duration-300">
                        <CardHeader>
                          <Cloud className="w-10 h-10 text-orange-200 mb-3" />
                          <CardTitle className="text-white text-xl">All-Weather</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-200 leading-relaxed">
                            Keeps the party going even on chilly Somerset nights. Our fire pits extend the celebration well into the evening, ensuring your guests stay warm and comfortable.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-orange-200/50 transition-all duration-300">
                        <CardHeader>
                          <Package className="w-10 h-10 text-orange-200 mb-3" />
                          <CardTitle className="text-white text-xl">Full Service</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-200 leading-relaxed">
                            We supply the pits, the fuel, and the safety management. Professional setup, monitoring, and breakdown—you can relax and enjoy the warmth.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Perfect Pairing Section */}
                  <Card className="bg-gradient-to-br from-orange-900/20 to-transparent border-2 border-orange-200/30 mt-8">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <FlameKindling className="w-8 h-8 text-orange-200 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-3">Perfect Pairing</h3>
                          <p className="text-gray-200 leading-relaxed">
                            Fire pits look incredible alongside our <span className="text-orange-200 font-semibold">&apos;Light & Shade&apos; tree lighting</span> or our <span className="text-orange-200 font-semibold">&apos;Vintage Festoon&apos; canopies</span>. Ask us about an outdoor lighting & warmth package.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-champagne-gold/20 to-transparent border-2 border-champagne-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <CardContent className="p-8 sm:p-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
                    Ready to add fire pits to your wedding?
                  </h2>
                  <Button
                    asChild
                    size="lg"
                    className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                  >
                    <Link href="/contact-us">Get in Touch</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
