"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Music } from "lucide-react";
import { useEffect } from "react";

export default function DJsService() {
  useEffect(() => {
    document.title = "DJ Services | Professional Wedding DJs | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Professional DJ services for weddings across the West Country. Premium sound systems, wireless microphones, and seamless mixing for your special day.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768160337/James-Hudson-DJ_cvk8ab.png"
            alt="Professional DJ services by James H DJ, showcasing professional wedding DJ setup with high-quality sound equipment and lighting"
            className="w-full h-full object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">DJ Services</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Professional DJ services with state-of-the-art equipment and seamless mixing
          </p>
        </motion.div>
      </section>

      {/* Service Details */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Music className="h-8 w-8 text-champagne-gold" />
                <CardTitle className="text-3xl md:text-4xl text-white">Professional DJ Services</CardTitle>
              </div>
              <CardDescription className="text-lg text-gray-300">
                Transform your wedding reception with our professional DJ services. We bring state-of-the-art equipment, seamless mixing, and an unparalleled ability to read the crowd and keep your guests dancing all night long.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">What We Offer</h3>
                <ul className="space-y-3">
                  {[
                    "Premium sound systems with crystal-clear audio",
                    "Wireless microphones for speeches and announcements",
                    "Professional DJ equipment and mixing",
                    "Music consultation and playlist creation",
                    "MC services available",
                    "Extended performance times available",
                    "Early setup to minimize disruption",
                    "Fully insured and PAT tested equipment",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 border-t border-champagne-gold/20">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/artists">Meet Our DJs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to book your perfect DJ?
            </h2>
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
