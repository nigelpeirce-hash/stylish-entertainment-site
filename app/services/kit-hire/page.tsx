"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";
import { useEffect } from "react";

export default function KitHireService() {
  useEffect(() => {
    document.title = "Kit Hire | Professional Equipment Hire | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "High-quality equipment hire for weddings. Sound systems, lighting rigs, microphones, DJ equipment, and technical accessories across the West Country.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162508/Kin-House-Stage-Lighting-and-Sound-supply_j8yln4.jpg"
            alt="Kin House wedding venue with professional stage lighting and sound equipment hire, showcasing professional wedding entertainment setup"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Kit Hire</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            High-quality equipment hire for all your wedding entertainment needs
          </p>
        </motion.div>
      </section>

      {/* Service Details */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-champagne-gold" />
                <CardTitle className="text-3xl md:text-4xl text-white">Equipment Hire</CardTitle>
              </div>
              <CardDescription className="text-lg text-gray-300">
                Whether you need sound systems, lighting equipment, or technical accessories, we provide high-quality equipment hire to complement your wedding entertainment. All equipment is professionally maintained, PAT tested, and fully insured.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">What We Offer</h3>
                <ul className="space-y-3">
                  {[
                    "Sound systems and PA equipment",
                    "Lighting rigs and effects",
                    "Microphones and audio equipment",
                    "DJ decks and mixers",
                    "Cables and technical accessories",
                    "Projectors and screens",
                    "Dance floors",
                    "Generators for outdoor events",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
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
              Ready to hire equipment?
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
