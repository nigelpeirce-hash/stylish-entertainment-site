"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, Flame } from "lucide-react";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import LazyIframe from "@/components/LazyIframe";
import { useEffect } from "react";

const firePitPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163009/Fire-pit-hire_o00hm7.jpg",
    width: 1200,
    height: 900,
    alt: "Professional fire pit hire creating a warm and inviting atmosphere for outdoor wedding and party celebrations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163556/Fire-pit-hire-with-haybale-sofa_t2otsi.jpg",
    width: 1200,
    height: 900,
    alt: "Fire pit hire with hay bale seating creating a cozy and rustic outdoor party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163758/Festoon-and-Fairy-Fan-with-Fire-pits_ycu53m.jpg",
    width: 1200,
    height: 900,
    alt: "Fire pits with festoon and fairy lighting creating a magical outdoor evening atmosphere for weddings and parties",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163640/Firepit-Hire_xfvmzx.jpg",
    width: 1200,
    height: 900,
    alt: "Professional fire pit hire service creating a warm gathering space for outdoor events and celebrations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163813/Firepit-Hire-for-weddings-and-parties_xvnj07.jpg",
    width: 1200,
    height: 900,
    alt: "Fire pit hire for weddings and parties creating an inviting outdoor atmosphere with warm flames and cozy ambiance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg",
    width: 1200,
    height: 900,
    alt: "Pennard House with fire pits and festoon lighting creating a beautiful outdoor dining and party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163461/IMG_8429_pxkrsu.jpg",
    width: 1200,
    height: 900,
    alt: "Outdoor fire pit hire creating a warm and inviting atmosphere for evening celebrations and gatherings",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163387/F4R3482_nxqed4.jpg",
    width: 1200,
    height: 900,
    alt: "Professional fire pit installation creating a cozy gathering space for outdoor wedding and party events",
  },
];

export default function FirePitHire() {
  useEffect(() => {
    document.title = "Fire Pit Hire | Outdoor Wedding Fire Pits | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Fire pit hire for weddings, parties, and events. Large 80cm fire pits with delivery, setup, and collection service. Prices from £80+VAT for 3-day hire across the West Country.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162576/Fire-Pits-and-Marshmallows0_hdqcl6.jpg"
            alt="Fire pits with marshmallows creating a warm and inviting atmosphere for outdoor celebrations"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Fire Pit Hire</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            The hottest party essential that sparks connections and ignites celebrations
          </p>
        </motion.div>
      </section>

      {/* Introduction Text */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Spice up your shindig with the hottest party essential – a Fire-pit or Fire-bowl! Say &quot;I do&quot; to the ultimate wedding, party, or event experience, where sparks fly, and connections ignite.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Our Fire-pits are the life of the party, appealing to all age groups. It&apos;s like taking a trip back to the stone age, but with a modern twist. Whether it&apos;s summer vibes or winter warmth, our large 80cm Fire-pits guarantee a blazing good time. Bonus: they double up as ashtrays for your smoking pals!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Package Details */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <Flame className="w-12 h-12 text-champagne-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-champagne-gold mb-4">
                Fire Pit Package
              </h2>
            </div>

            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-champagne-gold mb-4">
                  What&apos;s Included
                </h3>
                <ul className="space-y-3 text-white text-lg mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-champagne-gold mt-1">•</span>
                    <span>80cm Fire-pit on a low stand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-champagne-gold mt-1">•</span>
                    <span>Kindling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-champagne-gold mt-1">•</span>
                    <span>Fire-lighters</span>
                  </li>
                </ul>
                <div className="bg-gray-800/50 p-6 rounded-lg border border-champagne-gold/30">
                  <p className="text-white text-lg leading-relaxed mb-3">
                    <span className="font-bold text-champagne-gold">Prices start at just £80</span> per Fire-pit for a 3 day hire, plus the cost of delivery & collection.
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed">
                    You can calculate the approximate cost using <span className="font-semibold text-champagne-gold">BA11</span> as our location and envision four journeys at a mere <span className="font-semibold">65p per mile</span> (we deliver, return to base, collect, return to base).
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <ImageCarousel images={firePitPhotos} />
          </motion.div>
        </div>
      </section>

      {/* Delivery & Additional Services */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Delivery & Collection Service
                  </h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed mb-4">
                    Opt for our delivery and collection service, and our crew member will be your fire-starting hero. They&apos;ll set up the Fire-pit, get the flames dancing, and then swoop in for a grand finale – collecting and cleaning it from your venue.
                  </p>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    Alternatively, if you&apos;re feeling budget constraints, you can pick up and drop off at our office. (<span className="font-semibold text-champagne-gold">BA11</span>)
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Additional Logs
                  </h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    Fuel the fire even more by adding logs at an extra cost. The quantity depends on how long you want the Fire-pit to keep burning – the longer, the better!
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimer */}
            <Card className="bg-gradient-to-br from-red-900/20 to-gray-800/50 border-2 border-red-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Important Notice
                </h3>
                <p className="text-white text-base sm:text-lg leading-relaxed">
                  Just a heads up: we&apos;re not in the business of fire insurance. While we promise a blazing good time, we can&apos;t take the heat for any injuries or damages. It&apos;s all fun and flames, so party responsibly!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-champagne-gold mb-4">
              See Our Fire Pits in Action
            </h2>
            <p className="text-white text-lg leading-relaxed">
              Watch how our fire pits create the perfect atmosphere for your celebration
            </p>
          </motion.div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
            <LazyIframe
              src="https://www.youtube.com/embed/sDXBCwhMMkM"
              title="Fire Pit Hire - Stylish Entertainment"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to add fire pits to your celebration?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+447970793177"
                className="inline-block px-8 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Call 07970793177
              </a>
              <Link
                href="/contact-us"
                className="inline-block px-8 py-3 bg-transparent border-2 border-champagne-gold text-champagne-gold font-semibold rounded-lg hover:bg-champagne-gold hover:text-black transition-all duration-300 hover:scale-105"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
