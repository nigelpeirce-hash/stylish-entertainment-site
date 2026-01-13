"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import ImageCarousel, { ImagePhoto } from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";

const partyLightingPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162850/Saltburn_231005__0050_1558_y6diu8.jpg",
    width: 1200,
    height: 900,
    alt: "Saltburn venue with dramatic party lighting and mirror balls creating a vibrant dance floor atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Stretch marquee with professional party lighting and festoon lights creating a warm evening atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163799/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_qwbpur.jpg",
    width: 1200,
    height: 900,
    alt: "The Newt in Somerset with a stunning fairy light tunnel installed for an elegant evening party",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162892/Mirrorballs-and-staging_inwzu8.jpg",
    width: 1200,
    height: 900,
    alt: "Mirror balls and staging with colourful party lighting creating a classic disco atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    width: 1200,
    height: 900,
    alt: "Kin House venue with clusters of mirror balls and creative party lighting above the dance floor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163791/Edison-Vintage-Festoon-on-a-hot-night_qlolnk.jpg",
    width: 1200,
    height: 900,
    alt: "Edison vintage festoon lighting strung outdoors on a warm summer night for an alfresco party",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162522/Babington-House-Bar-with-DJ-Niges-setup_zdgqtq.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House bar with DJ Nige's setup and atmospheric party lighting for a late night celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163524/Amber-LED-Mood-lighting_zuiexc.jpg",
    width: 1200,
    height: 900,
    alt: "Amber LED mood lighting washing venue walls and columns for a sophisticated party look",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163161/Ashton-Court-Mansion_ikmf6q.jpg",
    width: 1200,
    height: 900,
    alt: "Ashton Court Mansion exterior illuminated with colourful party lighting for an evening event",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162858/DJ-Nige-Soho-Famhouse_spyy7e.jpg",
    width: 1200,
    height: 900,
    alt: "DJ Nige performing at Soho Farmhouse with vibrant party lighting and full dance floor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162291/Pennard-House-Lighting-with-Amber-Up-lighting_ztldmo.jpg",
    width: 1200,
    height: 900,
    alt: "Pennard House with amber uplighting highlighting architectural details for an evening party",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163461/IMG_8429_pxkrsu.jpg",
    width: 1200,
    height: 900,
    alt: "Dance floor with colourful moving lights and party lighting effects for a high energy celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163716/IMG_1098_hqiw3d.jpg",
    width: 1200,
    height: 900,
    alt: "Outdoor terrace with festoon and feature lighting creating a relaxed party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party with colourful lighting reflecting on the water for a stylish summer celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162636/IMG_8030_b5un4j.jpg",
    width: 1200,
    height: 900,
    alt: "Marquee interior with dynamic party lighting and mirror balls above the dance floor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162299/STYLISH-babs-july2016_ria-mishaal-photography_017_xsbk3l.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House grounds with festoon and feature lighting creating a magical outdoor party setting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg",
    width: 1200,
    height: 900,
    alt: "Fairy light tunnel creating a spectacular entrance for an evening party or wedding",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163448/Entrance-Lighting-02_rojobv.jpg",
    width: 1200,
    height: 900,
    alt: "Venue entrance with creative party lighting highlighting steps and doorway",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163197/DJ-Kit-on-Croquet-Lawn_jncfnl.jpg",
    width: 1200,
    height: 900,
    alt: "DJ kit set up on a croquet lawn with party lighting ready for an outdoor celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163408/Babington-House-Alfresco-dining-daytime_xk0vra.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House alfresco dining setup ready for evening party lighting and entertainment",
  },
];

export default function PartyLighting() {
  useEffect(() => {
    document.title = "Party Lighting | Creative Party & Event Lighting | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Hire party lighting, mirror balls, fairy lights, festoon lighting, disco and mood lighting for parties across Somerset, Wiltshire, Dorset, Devon and Gloucestershire."
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163130/Saltburn_231005__0020_0640_nmzjp6.jpg"
            alt="Saltburn venue with dramatic party lighting and mirror balls creating a vibrant party atmosphere"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Party Lighting</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Transform any party space with creative lighting, mirror balls and festoons
          </p>
        </motion.div>
      </section>

      {/* Text Paragraph */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Hire party lighting, mirror-balls, fairy-lights, festoon lighting, disco and mood lighting or, we can create our designs below at your venue.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Step into a world where illumination becomes an art form. Elevate your space with our chic party lighting, a transformative touch that turns every corner into an Instagram-worthy masterpiece. Whether it&apos;s barns, marquees, venues, or the comfort of your own home, our expert team crafts bespoke party and wedding lighting installations tailored to your vision and budget.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Extend the magic beyond interiors with our exterior lighting options, perfect for alfresco dining, enchanting terraces, captivating walkways, and accentuating the beauty of trees and topiary.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Planning a wedding? Let inspiration guide you — explore our <Link href="/weddings/wedding-lighting" className="text-champagne-gold hover:text-gold-light underline">wedding lighting gallery</Link> for a glimpse into the lighting elegance we bring to each celebration.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed">
              Illuminate your moments with style.
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
            <ImageCarousel images={partyLightingPhotos} />
          </motion.div>
        </div>
      </section>

      {/* Text Block Below Gallery - Broken into interesting sections */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            {/* Location Card */}
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/30 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">📍</div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-champagne-gold mb-3">
                      Serving the Region
                    </h3>
                    <p className="text-white text-lg leading-relaxed">
                      Nestled in the heart of Frome, Somerset, we actively work across <span className="font-semibold text-champagne-gold">Somerset, Wiltshire, Dorset, Devon, and Gloucestershire</span>, our team serves every area in between.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Extraordinary Events
                  </h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    Don&apos;t let your event fade into the ordinary. Reach out to us today with your location and specifications. Let&apos;s embark on a conversation about creating unforgettable moments and mesmerising party lighting.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-champagne-gold/30">
                <CardContent className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-champagne-gold mb-4">
                    Every Gathering Deserves Style
                  </h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    Elevate your celebration with us—because every gathering deserves to be extraordinary. From intimate gatherings to grand celebrations, we bring the magic.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-champagne-gold/20 via-yellow-400/20 to-champagne-gold/20 border-2 border-champagne-gold/40">
              <CardContent className="p-6 sm:p-8 text-center">
                <p className="text-white text-lg md:text-xl leading-relaxed mb-6 font-semibold">
                  Contact us now and let the magic begin!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-block px-8 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Get in Touch
                  </Link>
                  <a
                    href="tel:+447970793177"
                    className="inline-block px-8 py-3 bg-transparent border-2 border-champagne-gold text-champagne-gold font-semibold rounded-lg hover:bg-champagne-gold hover:text-black transition-all duration-300 hover:scale-105"
                  >
                    Call 07970793177
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
