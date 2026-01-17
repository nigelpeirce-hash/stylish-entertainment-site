"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Palette, Music, Zap } from "lucide-react";

const services = [
  {
    title: "Lighting Design",
    icon: Sparkles,
    description: "Transform your venue with bespoke lighting design that creates the perfect atmosphere for your special day.",
    features: [
      "Custom lighting schemes tailored to your venue",
      "LED uplighting and color washes",
      "Intelligent moving lights and effects",
      "Atmospheric mood lighting",
      "Dance floor lighting packages",
    ],
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162978/ITALLIAN-VILLA-02_jgy3tx.jpg",
    alt: "Professional wedding lighting design at luxury West Country venue",
  },
  {
    title: "Venue Styling",
    icon: Palette,
    description: "Complete venue transformation with elegant styling that reflects your personal taste and vision.",
    features: [
      "Full venue styling consultation",
      "Table centerpieces and floral arrangements",
      "Drapery and fabric installations",
      "Custom backdrops and photo walls",
      "Cohesive design theme throughout",
    ],
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162260/Saltburn_231005__0020_0638_fpdevj.jpg",
    alt: "Elegant wedding venue styling across the West Country",
  },
  {
    title: "DJs",
    icon: Music,
    description: "Professional DJ services with state-of-the-art equipment and seamless mixing.",
    features: [
      "Premium sound systems",
      "Wireless microphones for speeches",
      "Professional DJ equipment",
      "Music consultation and playlist creation",
      "MC services available",
    ],
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163392/james-Malin_ovqqnf.jpg",
    alt: "Professional wedding DJ services across the West Country",
  },
  {
    title: "Kit Hire",
    icon: Zap,
    description: "High-quality equipment hire for all your wedding entertainment needs.",
    features: [
      "Sound systems and PA equipment",
      "Lighting rigs and effects",
      "Microphones and audio equipment",
      "DJ decks and mixers",
      "Cables and technical accessories",
    ],
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162508/Kin-House-Stage-Lighting-and-Sound-supply_j8yln4.jpg",
    alt: "Professional wedding equipment hire at Kin House across the West Country",
  },
  {
    title: "Fire Pit Hire",
    icon: Zap,
    description: "Outdoor fire pit hire for wedding venues. Create a warm, inviting atmosphere.",
    features: [
      "Professional fire pit installations",
      "Safe and secure setups",
      "Various sizes available",
      "Perfect for outdoor receptions",
    ],
    galleryTrigger: false,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop",
    alt: "Outdoor fire pit hire for wedding venues",
  },
];

export default function ServicesClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw"
            alt="Enchanting fairy light tunnel at Babington House showcasing our professional wedding services"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">What We Do</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Comprehensive entertainment services across the West Country
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow bg-gray-800 border-champagne-gold/30">
                    <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={service.image}
                        alt={service.alt}
                        className="w-full h-full object-cover object-center brightness-105 contrast-105"
                        style={{ objectPosition: 'center center' }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-6 w-6 text-champagne-gold" />
                        <CardTitle className="text-2xl md:text-3xl text-white">{service.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base text-gray-300">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-champagne-gold mt-1">•</span>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={
                          service.title === "DJs" ? "/services/djs" :
                          service.title === "Lighting Design" ? "/services/lighting-design" :
                          service.title === "Venue Styling" ? "/services/venue-styling" :
                          service.title === "Kit Hire" ? "/what-we-do/equipment-dj-band-sound-kit" :
                          service.title === "Fire Pit Hire" ? "/services/fire-pit-hire" :
                          "/services"
                        }>
                          Learn More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="pt-20 pb-8 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Bespoke Service Packages
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 px-4">
              Every wedding is unique, and so should be your entertainment. We work closely with you
              to create a custom package that perfectly matches your vision, venue, and budget.
              From intimate gatherings to grand celebrations, we have the expertise and equipment
              to make your day truly exceptional.
            </p>
            <Button asChild size="lg">
              <Link href="/contact-us">Discuss Your Requirements</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
