"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Building2, Snowflake } from "lucide-react";

const partyServices = [
  {
    title: "Party Lighting",
    icon: Sparkles,
    description: "Transform your party venue with bespoke lighting design that creates the perfect atmosphere for your celebration.",
    href: "/parties/party-lighting",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163130/Saltburn_231005__0020_0640_nmzjp6.jpg",
    alt: "Professional party lighting design creating an atmospheric celebration",
  },
  {
    title: "Private Parties",
    icon: Users,
    description: "Complete party planning and production services for private celebrations. From intimate gatherings to grand events.",
    href: "/parties/private-parties",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163810/image2_l1hxxx.jpg",
    alt: "Elegant private party with professional entertainment and lighting",
  },
  {
    title: "Corporate Events",
    icon: Building2,
    description: "Professional entertainment and production for corporate events, galas, conferences, and product launches.",
    href: "/parties/corporate-events",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/e_enhance/ABS-Preview-50-percent0006_c51xsl.jpg",
    alt: "Corporate event entertainment and production services",
  },
  {
    title: "Christmas Parties",
    icon: Snowflake,
    description: "Festive entertainment and lighting for Christmas celebrations. Make your holiday party truly memorable.",
    href: "/parties/christmas",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162638/IMG_6124_reoaew.jpg",
    alt: "Festive Christmas party entertainment and lighting",
  },
];

export default function Parties() {
  useEffect(() => {
    document.title = "Party Entertainment & Production | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Professional party entertainment, lighting design, and production services across the West Country. Private parties, corporate events, and Christmas celebrations in Somerset, Wiltshire, Dorset, Bath, and Bristol.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163130/Saltburn_231005__0020_0640_nmzjp6.jpg"
            alt="Professional party entertainment and production services"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Parties</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Exceptional party entertainment and production across the West Country
          </p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Whether you're planning an intimate private celebration, a corporate event, or a festive Christmas party, 
              we bring years of experience and creative expertise to make your event truly unforgettable. From stunning 
              lighting design to professional DJs and complete party planning, we handle every detail so you can enjoy 
              your celebration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Party Services Grid */}
      <section className="py-12 md:py-16 bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-champagne-gold mb-4">
              Our Party Services
            </h2>
            <p className="text-lg text-gray-300">
              Explore our range of party entertainment and production services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {partyServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-gray-900/50 border-2 border-champagne-gold/20 hover:border-champagne-gold/40 transition-all duration-300 h-full overflow-hidden group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-champagne-gold/90 p-3 rounded-lg">
                          <Icon className="w-6 h-6 text-gray-900" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl text-white">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={service.href}>
                        <Button className="w-full bg-champagne-gold hover:bg-champagne-gold/80 text-gray-900 font-semibold">
                          Learn More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 rounded-lg p-8 md:p-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-champagne-gold mb-4">
              Ready to Plan Your Perfect Party?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Based in Frome, Somerset, we serve parties across Somerset, Wiltshire, Dorset, Devon, 
              Gloucestershire, Bath, Bristol, Swindon, and Exeter. Get in touch to discuss your event 
              and let's create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us">
                <Button className="bg-champagne-gold hover:bg-champagne-gold/80 text-gray-900 font-semibold px-8 py-6 text-lg">
                  Get in Touch
                </Button>
              </Link>
              <a href="tel:+447970793177">
                <Button variant="outline" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-gray-900 font-semibold px-8 py-6 text-lg">
                  Call 07970 793177
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
