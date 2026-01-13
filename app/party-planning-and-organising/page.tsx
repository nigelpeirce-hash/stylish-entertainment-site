"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Sparkles, CheckCircle } from "lucide-react";

const partyPlanningPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    width: 1200,
    height: 900,
    alt: "Professional party planning and event organization at Kin House with elegant mirrorball clusters and sophisticated lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg",
    width: 1200,
    height: 900,
    alt: "Complete party planning service at Kings Weston House with professional lighting design and event coordination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party planning and organization with professional event management and entertainment coordination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163790/Party-dj-with-lazer_wnhreb.jpg",
    width: 1200,
    height: 900,
    alt: "Full party planning service including DJ entertainment, lighting, and complete event coordination",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Marquee party planning with professional lighting installation and complete event styling",
  },
];

export default function PartyPlanning() {
  useEffect(() => {
    document.title = "Party Planning & Organising | Full Event Planning Services | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Complete party planning and event organization services. From intimate celebrations to grand events, we handle every detail including entertainment, lighting, styling, and coordination across the West Country."
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163267/IMG_0740_rcczi9.jpg"
            alt="Professional party planning and event organization services"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Party Planning & Organising</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Complete event planning services that take the stress out of your celebration
          </p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-champagne-gold mb-6">
              Stress-Free Event Planning
            </h2>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-6">
              Planning a party or event can be overwhelming, but it doesn&apos;t have to be. With over 20 years of experience creating unforgettable celebrations, we offer complete party planning and event organization services that handle every detail, so you can relax and enjoy your own event.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed">
              From intimate gatherings to grand celebrations, we work closely with you to understand your vision and bring it to life with professional expertise, attention to detail, and seamless coordination.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <ImageCarousel images={partyPlanningPhotos} />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-3">Event Coordination</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Complete timeline management and day-of coordination to ensure everything runs smoothly
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-3">Supplier Management</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Coordinate with all suppliers including caterers, florists, photographers, and venues
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-3">Design & Styling</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Create cohesive design themes and styling that reflects your personal vision
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-champagne-gold" />
                <h3 className="text-xl font-bold text-white mb-3">Full Service</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Entertainment, lighting, styling, and production all managed under one roof
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-champagne-gold mb-4">
                Complete Planning Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Initial Consultation & Planning
                  </h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Comprehensive event consultation to understand your vision</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Budget planning and cost management</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Venue selection and site visits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Timeline creation and schedule management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Event Coordination
                  </h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Day-of event coordination and management</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Supplier liaison and coordination</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Guest management and flow</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Problem-solving and on-the-day support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Entertainment & Production
                  </h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>DJ and musician booking and coordination</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Lighting design and installation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Sound system setup and management</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Venue styling and decoration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Post-Event Services
                  </h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Equipment breakdown and removal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Venue restoration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Final invoice and payment processing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-champagne-gold mt-1">•</span>
                      <span>Follow-up and feedback collection</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Card className="bg-gradient-to-r from-champagne-gold/20 via-yellow-400/20 to-champagne-gold/20 border-2 border-champagne-gold/40">
              <CardContent className="p-8 sm:p-12 text-center">
                <h3 className="text-3xl sm:text-4xl font-bold text-champagne-gold mb-6">
                  Ready to Plan Your Perfect Event?
                </h3>
                <p className="text-white text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                  Let us take the stress out of planning your celebration. Contact us today to discuss your event and discover how we can make it truly unforgettable.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="tel:+447970793177"
                    className="inline-block px-10 py-4 bg-champagne-gold text-black font-bold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-110 shadow-xl text-lg"
                  >
                    Call 07970793177
                  </a>
                  <Link
                    href="/contact-us"
                    className="inline-block px-10 py-4 bg-transparent border-2 border-champagne-gold text-champagne-gold font-bold rounded-lg hover:bg-champagne-gold hover:text-black transition-all duration-300 hover:scale-110 text-lg"
                  >
                    Get in Touch
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
