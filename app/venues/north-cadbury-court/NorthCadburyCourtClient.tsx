"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NorthCadburyCourtClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-800" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            North Cadbury Court
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Professional wedding entertainment and lighting services
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 px-3 sm:px-4 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardContent className="p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">North Cadbury Court</h2>
                <p className="text-gray-200 text-lg leading-relaxed mb-6">
                  We are proud to have provided entertainment and lighting services for weddings at North Cadbury Court, one of Somerset&apos;s most beautiful historic venues.
                </p>
                <p className="text-gray-200 text-lg leading-relaxed mb-8">
                  Our services include professional DJs, lighting design, venue styling, and live musicians tailored to create the perfect atmosphere for your celebration.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
                    <Link href="/contact-us/">Get in Touch</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                    <Link href="https://www.northcadburycourt.co.uk/" target="_blank" rel="noopener noreferrer">
                      Visit North Cadbury Court
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
