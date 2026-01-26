"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight, Lightbulb, Sun, Sparkles, MapPin, Mail, Phone } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImagePhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  category?: "dance-floor" | "outdoor-festoon" | "atmospheric";
}

// Categorized photos
const danceFloorPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg",
    width: 1200,
    height: 900,
    alt: "Mirrorball clusters creating a vibrant dance floor atmosphere",
    category: "dance-floor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162892/Mirrorballs-and-staging_inwzu8.jpg",
    width: 1200,
    height: 900,
    alt: "Mirror balls and staging with colourful party lighting creating a classic disco atmosphere",
    category: "dance-floor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163461/IMG_8429_pxkrsu.jpg",
    width: 1200,
    height: 900,
    alt: "Dance floor with colourful moving lights and party lighting effects for a high energy celebration",
    category: "dance-floor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162636/IMG_8030_b5un4j.jpg",
    width: 1200,
    height: 900,
    alt: "Marquee interior with dynamic party lighting and mirror balls above the dance floor",
    category: "dance-floor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162850/Saltburn_231005__0050_1558_y6diu8.jpg",
    width: 1200,
    height: 900,
    alt: "Saltburn venue with dramatic party lighting and mirror balls creating a vibrant dance floor atmosphere",
    category: "dance-floor",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163524/Amber-LED-Mood-lighting_zuiexc.jpg",
    width: 1200,
    height: 900,
    alt: "Amber LED mood lighting washing venue walls and columns for a sophisticated party look",
    category: "dance-floor",
  },
];

const outdoorFestoonPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163799/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_qwbpur.jpg",
    width: 1200,
    height: 900,
    alt: "The Newt in Somerset with a stunning fairy light tunnel installed for an elegant evening party",
    category: "outdoor-festoon",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163791/Edison-Vintage-Festoon-on-a-hot-night_qlolnk.jpg",
    width: 1200,
    height: 900,
    alt: "Edison vintage festoon lighting strung outdoors on a warm summer night for an alfresco party",
    category: "outdoor-festoon",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Stretch marquee with professional party lighting and festoon lights creating a warm evening atmosphere",
    category: "outdoor-festoon",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg",
    width: 1200,
    height: 900,
    alt: "Fairy light tunnel creating a spectacular entrance for an evening party or wedding",
    category: "outdoor-festoon",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162299/STYLISH-babs-july2016_ria-mishaal-photography_017_xsbk3l.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House grounds with festoon and feature lighting creating a magical outdoor party setting",
    category: "outdoor-festoon",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163716/IMG_1098_hqiw3d.jpg",
    width: 1200,
    height: 900,
    alt: "Outdoor terrace with festoon and feature lighting creating a relaxed party atmosphere",
    category: "outdoor-festoon",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768741340/_F4R3275_tukoww.jpg",
    width: 1200,
    height: 900,
    alt: "Chill Out Camp with vintage Edison festoon lighting and fairy lights creating a magical outdoor party atmosphere",
    category: "outdoor-festoon",
  },
];

const atmosphericPhotos: ImagePhoto[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163764/IMG_1811_qctvz4.jpg",
    width: 1200,
    height: 900,
    alt: "Dynamic party lighting with vibrant colors creating an energetic atmosphere",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163751/led-red_ukq9hf.jpg",
    width: 1200,
    height: 900,
    alt: "Red LED party lighting creating a dramatic and atmospheric mood",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163720/A-Big-Lazer-e1430894875463_xgpiil.jpg",
    width: 1200,
    height: 900,
    alt: "Professional laser lighting effects creating spectacular visual displays for party celebrations",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163684/IMG_2731_yk0kmb.jpg",
    width: 1200,
    height: 900,
    alt: "Party lighting with colorful effects and atmospheric mood lighting",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768733441/Babington-House-Bar-with-DJ-Niges-setup_zdgqtq.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House bar with DJ Nige's setup and atmospheric party lighting for a late night celebration",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163161/Ashton-Court-Mansion_ikmf6q.jpg",
    width: 1200,
    height: 900,
    alt: "Ashton Court Mansion exterior illuminated with colourful party lighting for an evening event",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768731384/Pennard-House-Lighting-with-Amber-Up-lighting_sljvaa.jpg",
    width: 1200,
    height: 900,
    alt: "Pennard House with amber uplighting highlighting architectural details for an evening party",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163448/Entrance-Lighting-02_rojobv.jpg",
    width: 1200,
    height: 900,
    alt: "Venue entrance with creative party lighting highlighting steps and doorway",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162858/DJ-Nige-Soho-Famhouse_spyy7e.jpg",
    width: 1200,
    height: 900,
    alt: "DJ Nige performing at Soho Farmhouse with vibrant party lighting and full dance floor",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party with colourful lighting reflecting on the water for a stylish summer celebration",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163197/DJ-Kit-on-Croquet-Lawn_jncfnl.jpg",
    width: 1200,
    height: 900,
    alt: "DJ kit set up on a croquet lawn with party lighting ready for an outdoor celebration",
    category: "atmospheric",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163408/Babington-House-Alfresco-dining-daytime_xk0vra.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House alfresco dining setup ready for evening party lighting and entertainment",
    category: "atmospheric",
  },
];

const allPhotos = [...danceFloorPhotos, ...outdoorFestoonPhotos, ...atmosphericPhotos];

// Masonry Grid Component
function MasonryGrid({ photos }: { photos: ImagePhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  return (
    <>
      <div 
        className="masonry-grid"
        style={{
          columnCount: "auto",
          columnWidth: "300px",
          columnGap: "1.5rem",
          padding: "1rem 0",
        }}
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            className="mb-6 break-inside-avoid cursor-pointer group"
            onClick={() => setLightboxIndex(index)}
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] border border-champagne-gold/20">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={photos.map(p => ({ src: p.src, alt: p.alt }))}
        render={{ buttonPrev: () => <ChevronLeft className="w-8 h-8 text-white" />, buttonNext: () => <ChevronRight className="w-8 h-8 text-white" /> }}
      />
    </>
  );
}

// Interactive Lighting Enquiry CTA Bar
function LightingEnquiryBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
        >
          <Link
            href="/contact-us/"
            className="pointer-events-auto bg-white/10 backdrop-blur-xl border-2 border-champagne-gold/50 text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:scale-105 transition-all duration-300 hover:bg-white/15 hover:border-champagne-gold flex items-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 text-champagne-gold group-hover:rotate-12 transition-transform" />
            <span>Lighting Enquiry</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PartyLightingClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163790/Party-dj-with-lazer_wnhreb.jpg"
            alt="Party DJ with laser lighting effects creating a vibrant and energetic dance floor atmosphere"
            fill
            className="object-cover object-center brightness-110"
            priority
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Party Lighting
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Transform any party space with creative lighting, mirror balls and festoons
          </p>
        </motion.div>
      </section>

      {/* Our Lighting Toolkit */}
      <section className="py-16 px-4 bg-gray-800 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-6 text-white font-bold">
              Our <span className="text-gradient">Lighting Toolkit</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-champagne-gold/30 transition-all h-full">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-12 h-12 text-champagne-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Mirror Ball Clusters</h3>
                  <p className="text-gray-300 text-sm">Dramatic disco atmosphere with our signature mirror ball installations</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-champagne-gold/30 transition-all h-full">
                <CardContent className="p-6 text-center">
                  <Sun className="w-12 h-12 text-champagne-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Edison Vintage Festoons</h3>
                  <p className="text-gray-300 text-sm">Warm, nostalgic lighting perfect for outdoor and indoor spaces</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-champagne-gold/30 transition-all h-full">
                <CardContent className="p-6 text-center">
                  <Lightbulb className="w-12 h-12 text-champagne-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">LED Architectural Uplighting</h3>
                  <p className="text-gray-300 text-sm">Highlight architectural features with intelligent colour-changing LED systems</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-champagne-gold/30 transition-all h-full">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-12 h-12 text-champagne-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Fairy Light Tunnels</h3>
                  <p className="text-gray-300 text-sm">Create magical entrances and pathways with our fairy light installations</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Grid: The Dance Floor */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-4 text-white font-bold">
              The Dance Floor
            </h2>
            <p className="text-gray-300 text-lg">Mirrorballs and disco lighting for high-energy celebrations</p>
          </motion.div>
          <MasonryGrid photos={danceFloorPhotos} />
        </div>
      </section>

      {/* Glassmorphism Promotional Card - DJs */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/5 backdrop-blur-xl border-champagne-gold/30 shadow-2xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-champagne-gold mb-4">
                Complete Your Party Experience
              </h3>
              <p className="text-white text-lg md:text-xl leading-relaxed mb-6">
                Pair your lighting with professional DJ services. Our expert DJs create the perfect atmosphere with seamless mixing and crowd-pleasing playlists.
              </p>
              <Link
                href="/artists/djs"
                className="inline-block px-8 py-3 bg-champagne-gold/20 backdrop-blur-md border-2 border-champagne-gold text-champagne-gold font-semibold rounded-lg hover:bg-champagne-gold hover:text-black transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Explore Our DJs
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Category Grid: Outdoor & Festoon */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-4 text-white font-bold">
              Outdoor & Festoon
            </h2>
            <p className="text-gray-300 text-lg">Fairy light tunnels, festoon lighting, and alfresco ambiance</p>
          </motion.div>
          <MasonryGrid photos={outdoorFestoonPhotos} />
        </div>
      </section>

      {/* Glassmorphism Promotional Card - Musicians */}
      <section className="py-12 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/5 backdrop-blur-xl border-champagne-gold/30 shadow-2xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-champagne-gold mb-4">
                Add Live Music to Your Event
              </h3>
              <p className="text-white text-lg md:text-xl leading-relaxed mb-6">
                Elevate your event with live music. From jazz trios to saxophone and percussion, our talented musicians add elegance and energy to any celebration.
              </p>
              <Link
                href="/artists/musicians"
                className="inline-block px-8 py-3 bg-champagne-gold/20 backdrop-blur-md border-2 border-champagne-gold text-champagne-gold font-semibold rounded-lg hover:bg-champagne-gold hover:text-black transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Explore Our Musicians
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Category Grid: Atmospheric Mood Lighting */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl md:max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-4 text-white font-bold">
              Atmospheric Mood Lighting
            </h2>
            <p className="text-gray-300 text-lg">Sophisticated uplighting and architectural illumination</p>
          </motion.div>
          <MasonryGrid photos={atmosphericPhotos} />
        </div>
      </section>

      {/* Service Area Map-Style Card */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-white/5 backdrop-blur-xl border-champagne-gold/30 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-8 h-8 text-champagne-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Service Area
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Based in Frome, Somerset, we serve venues across the West Country. Our premium lighting installations are featured at prestigious venues including:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border border-champagne-gold/30 rounded-lg p-6">
                      <h4 className="text-xl font-bold text-champagne-gold mb-2">Babington House</h4>
                      <p className="text-gray-200 text-sm">Soho House venue in Somerset - Resident DJ and lighting specialists</p>
                    </div>
                    <div className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border border-champagne-gold/30 rounded-lg p-6">
                      <h4 className="text-xl font-bold text-champagne-gold mb-2">The Newt</h4>
                      <p className="text-gray-200 text-sm">Historic Somerset estate - Featured fairy light tunnel installation</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {["Somerset", "Wiltshire", "Dorset", "Devon", "Gloucestershire", "Bath", "Bristol"].map((location) => (
                      <span
                        key={location}
                        className="px-4 py-2 bg-gray-700/50 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-champagne-gold/20"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <p className="text-white text-xl md:text-2xl leading-relaxed mb-8 font-semibold">
                Ready to transform your event with professional party lighting?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light">
                  <Link href="/contact-us/">Request a Quote</Link>
                </Button>
                <a
                  href="tel:+447970793177"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-champagne-gold text-champagne-gold font-semibold rounded-lg hover:bg-champagne-gold hover:text-black transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Call 07970793177
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Lighting Enquiry Bar */}
      <LightingEnquiryBar />
    </div>
  );
}
