"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Speaker, Lightbulb, Sparkles, Shield, FileText, Headphones, ArrowRight } from "lucide-react";
import WaveDivider from "@/components/WaveDivider";

export default function KitHireClient() {
  const equipmentCategories = [
    {
      icon: Speaker,
      title: "Audio & Sound",
      items: [
        "PA systems",
        "Wireless Mics for speeches",
        "DJ Decks",
      ],
    },
    {
      icon: Lightbulb,
      title: "Lighting & Visuals",
      items: [
        "Uplighting",
        "Dancefloor rigs",
        "Projectors",
      ],
    },
    {
      icon: Sparkles,
      title: "Styling & Props",
      items: [
        "Mirror balls",
        "Lanterns",
        "Vases",
        "Candlesticks",
      ],
    },
  ];

  const technicalStandards = [
    {
      icon: Shield,
      text: "PAT Tested Equipment",
    },
    {
      icon: FileText,
      text: "£10m Public Liability",
    },
    {
      icon: Headphones,
      text: "Expert Technical Support",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162508/Kin-House-Stage-Lighting-and-Sound-supply_j8yln4.jpg"
            alt="Kin House wedding venue with professional stage lighting and sound equipment hire, showcasing professional wedding entertainment setup"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Professional Equipment & Technical Hire
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Industry-standard sound, lighting, and styling props for West Country events
          </p>
        </motion.div>
        <div className="relative z-20 w-full">
          <WaveDivider />
        </div>
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
                  <CardTitle className="text-3xl md:text-4xl text-white">Equipment Hire</CardTitle>
                  <CardDescription className="text-lg text-gray-200 leading-relaxed">
                    Whether you need sound systems, lighting equipment, or technical accessories, we provide high-quality equipment hire to complement your wedding entertainment. All equipment is professionally maintained, PAT tested, and fully insured.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Equipment Categories Grid */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Equipment Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {equipmentCategories.map((category, idx) => (
                        <Card
                          key={idx}
                          className="bg-white/5 backdrop-blur-lg border-champagne-gold/30 hover:border-champagne-gold/50 transition-all duration-300"
                        >
                          <CardHeader>
                            <category.icon className="w-10 h-10 text-champagne-gold mb-3" />
                            <CardTitle className="text-white text-xl">{category.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {category.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-2 text-gray-200">
                                  <span className="text-champagne-gold mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Browse Hire Items */}
                  <div className="pt-6 border-t border-champagne-gold/20">
                    <h3 className="text-xl font-bold text-white mb-4">Hire Items</h3>
                    <p className="text-gray-200 mb-6 leading-relaxed">
                      Browse our selection of decorative and lighting hire items including lanterns, candlesticks, mirror balls, and vases.
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-lg group"
                    >
                      <Link href="/hire" className="flex items-center gap-2">
                        Browse Hire Items
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>

                  {/* Technical Standards */}
                  <div className="pt-6 border-t border-champagne-gold/20 bg-gradient-to-br from-champagne-gold/10 to-transparent rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Peace of Mind</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {technicalStandards.map((standard, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                          <standard.icon className="w-12 h-12 text-champagne-gold mb-3" />
                          <p className="text-gray-200 font-semibold">{standard.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
                    Ready to hire equipment?
                  </h2>
                  <Button
                    asChild
                    size="lg"
                    className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)] mb-4"
                  >
                    <Link href="/contact-us">Get in Touch</Link>
                  </Button>
                  <p className="text-sm text-gray-300 italic mt-4">
                    Not sure what you need? Tell us your venue and guest count, and we will recommend the perfect kit package.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
