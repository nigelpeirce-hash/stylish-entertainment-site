"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "@/lib/motion";
import Lightbox from "yet-another-react-lightbox";
import { ChevronLeft, ChevronRight, Sparkles, Sun, Lightbulb, ExternalLink } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import { LIGHTBOX_CAROUSEL, LIGHTBOX_CONTROLLER, toLightboxSlides } from "@/components/lightbox-config";

type EventFilter = "all" | "weddings" | "corporate" | "outdoor";

interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  eventTypes: EventFilter[];
  venue?: string;
  serviceType?: "dance-floor" | "festoon" | "atmospheric";
}

// Hero mood images – high-impact, spaced for premium feel
const heroMoodImages: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg",
    alt: "Magical fairy light tunnel creating a romantic entrance for weddings and events",
    width: 1920,
    height: 1080,
    eventTypes: ["weddings", "outdoor"],
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163720/A-Big-Lazer-e1430894875463_xgpiil.jpg",
    alt: "Dramatic laser lighting effects on the dance floor for high-energy celebrations",
    width: 1920,
    height: 1080,
    eventTypes: ["corporate", "outdoor"],
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg",
    alt: "The Newt Somerset wedding venue with fairy light tunnel installation – prestigious venue transformation",
    width: 1920,
    height: 1080,
    eventTypes: ["weddings"],
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768731384/Pennard-House-Lighting-with-Amber-Up-lighting_sljvaa.jpg",
    alt: "Pennard House amber uplighting highlighting architectural features for elegant evening events",
    width: 1920,
    height: 1080,
    eventTypes: ["weddings", "corporate"],
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741340/_F4R3275_tukoww.jpg",
    alt: "Chill Out Camp with vintage Edison festoon lighting and fairy lights – alfresco party atmosphere",
    width: 1920,
    height: 1080,
    eventTypes: ["weddings", "outdoor"],
  },
];

// Service toolkit – half-screen cards with photo + minimal text
const toolkitServices = [
  {
    id: "mirror-ball",
    title: "Mirror Ball Clusters",
    description: "Dramatic disco atmosphere with signature mirror ball installations. Perfect for dance floors and high-energy celebrations.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162930/Mirrorball-Cluster-Glitterball-Clusters_mwjd8x.jpg",
    alt: "Mirrorball cluster and glitterball clusters creating disco atmosphere on the dance floor",
    galleryCategory: "dance-floor",
  },
  {
    id: "festoon",
    title: "Edison Vintage Festoons",
    description: "Warm, nostalgic lighting for outdoor and indoor spaces. Fairy light tunnels and festoon strings for weddings and alfresco events.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163791/Edison-Vintage-Festoon-on-a-hot-night_qlolnk.jpg",
    alt: "Edison vintage festoon lighting strung outdoors on a warm summer night",
    galleryCategory: "festoon",
  },
  {
    id: "uplighting",
    title: "LED Architectural Uplighting",
    description: "Highlight venue features with intelligent colour-changing LED systems. Amber, warm white, and dramatic colour washes.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162636/IMG_8030_b5un4j.jpg",
    alt: "LED architectural uplighting for venues",
    galleryCategory: "atmospheric",
  },
  {
    id: "fairy-tunnel",
    title: "Fairy Light Tunnels",
    description: "Magical entrances and pathways. Transform any space with our iconic fairy light tunnel installations.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg",
    alt: "Fairy light tunnel creating spectacular entrance for weddings and evening events",
    galleryCategory: "festoon",
  },
];

// Venue spotlights – narrative case studies
const venueSpotlights = [
  {
    venue: "Babington House",
    tagline: "Making Babington House feel intimate",
    narrative: "Soho House’s Somerset retreat demanded a balance of sophistication and warmth. We deployed vintage Edison festoons, bush lights, and atmospheric uplighting to create intimate zones across the grounds.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163784/babs-bush-lights_ria-mishaal-photography_01_wvrfst.jpg",
        alt: "Babington House bush lights and festoon lighting – Ria Mishaal Photography",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733527/Babington-House-mini-chill-out-camp_lrjeoi.jpg",
        alt: "Babington House mini chill-out camp with atmospheric lighting and festoons",
      },
    ],
    testimonial: "The lighting transformed the space completely. Our guests couldn’t stop talking about the fairy lights.",
    testimonialAttribution: "— Wedding at Babington House",
  },
  {
    venue: "Pennard House",
    tagline: "Architectural uplighting meets alfresco dining",
    narrative: "Pennard House’s stunning architecture called for amber uplighting to highlight its features. We complemented it with festoon lighting for the pizzarova area and tree lighting for outdoor dining.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768731384/Pennard-House-Lighting-with-Amber-Up-lighting_sljvaa.jpg",
        alt: "Pennard House with amber uplighting highlighting architectural details",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg",
        alt: "Pennard House festoon lighting and pizzarova alfresco dining area",
      },
    ],
    testimonial: "Professional, creative, and exactly what we envisioned. The amber uplighting made the house glow.",
    testimonialAttribution: "— Private Event, Pennard House",
  },
  {
    venue: "The Newt",
    tagline: "First wedding with our fairy light tunnel",
    narrative: "The Newt Somerset’s first wedding with our fairy light tunnel installation. A prestigious Somerset estate transformed with a magical entrance that set the tone for the entire evening.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg",
        alt: "The Newt Somerset wedding venue with fairy light tunnel installation",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162325/The-Newt-Somerset-we-used-over-800-metres-of-fairy-lights-for-the-Threshing-Barn_xa47ry.jpg",
        alt: "The Newt Somerset Threshing Barn with over 800 metres of fairy lights",
      },
    ],
    testimonial: "The fairy light tunnel was the highlight of our wedding. Magical.",
    testimonialAttribution: "— Wedding at The Newt, Somerset",
  },
];

// Filterable gallery – all photos with event type tags
const filterablePhotos: Photo[] = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162258/Fairy-light-Tunnel_sc40ed.jpg", alt: "Romantic fairy light tunnel entrance for garden weddings", width: 1200, height: 900, eventTypes: ["weddings", "outdoor"], venue: "Various", serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163529/Wedding-Tree-Lighting_pgzhix.jpg", alt: "Wedding tree lighting with fairy lights for magical outdoor setting", width: 1200, height: 900, eventTypes: ["weddings", "outdoor"], serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768740556/Albert-Palmer-Photography-001-2-e1642519560978_yjkunf.jpg", alt: "Wedding reception with festoon and outdoor lighting – Albert Palmer Photography", width: 1200, height: 900, eventTypes: ["weddings"], serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742527/Church-Exterior-Lighting_a8rzbd.jpg", alt: "Church exterior lighting for evening wedding ceremony", width: 1200, height: 900, eventTypes: ["weddings"], serviceType: "atmospheric" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768739479/EXTERIOR-DINING-TREE-LIGHTING_ur4vlb.jpg", alt: "Exterior dining with tree lighting for alfresco wedding or corporate dinner", width: 1200, height: 900, eventTypes: ["weddings", "corporate", "outdoor"], serviceType: "atmospheric" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163720/A-Big-Lazer-e1430894875463_xgpiil.jpg", alt: "Laser lighting on dance floor for corporate party or celebration", width: 1200, height: 900, eventTypes: ["corporate", "outdoor"], serviceType: "dance-floor" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg", alt: "Hedsor House dance floor with DJ and sax – corporate event entertainment", width: 1200, height: 900, eventTypes: ["corporate"], venue: "Hedsor House", serviceType: "dance-floor" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163648/Party-dj-lighting_tuh8hm.jpg", alt: "Party DJ lighting for corporate or private celebrations", width: 1200, height: 900, eventTypes: ["corporate", "outdoor"], serviceType: "dance-floor" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163791/Edison-Vintage-Festoon-on-a-hot-night_qlolnk.jpg", alt: "Edison vintage festoon lighting for outdoor corporate or private events", width: 1200, height: 900, eventTypes: ["outdoor", "corporate"], serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg", alt: "Stretch marquee with festoon lights for outdoor weddings or events", width: 1200, height: 900, eventTypes: ["weddings", "outdoor"], serviceType: "festoon" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162715/Kin-House-Exterior-Terrace-Lighting_lxvlpk.jpg", alt: "Kin House exterior terrace mood lighting for evening events", width: 1200, height: 900, eventTypes: ["weddings", "corporate", "outdoor"], venue: "Kin House", serviceType: "atmospheric" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162636/IMG_8030_b5un4j.jpg", alt: "Atmospheric mood lighting for wedding or party venue", width: 1200, height: 900, eventTypes: ["weddings", "corporate"], serviceType: "atmospheric" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768749164/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg", alt: "Wedding celebration with professional lighting – Martin Beddall Photography", width: 1200, height: 900, eventTypes: ["weddings"], serviceType: "dance-floor" },
];

export default function PartyLightingDemoClient() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [filter, setFilter] = useState<EventFilter>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Hero auto-advance
  const advanceHero = useCallback(() => {
    setHeroIndex((i) => (i + 1) % heroMoodImages.length);
  }, []);
  useEffect(() => {
    const t = setInterval(advanceHero, 5000);
    return () => clearInterval(t);
  }, [advanceHero]);

  const filteredPhotos = filter === "all" ? filterablePhotos : filterablePhotos.filter((p) => p.eventTypes.includes(filter));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Demo notice bar */}
      <div className="bg-champagne-gold/20 border-b border-champagne-gold/40 py-2 px-4 text-center text-sm text-champagne-gold">
        <span className="font-medium">Portfolio demo</span>
        {" · "}
        <Link href="/parties/party-lighting/" className="underline hover:no-underline">
          View current page
        </Link>
      </div>

      {/* 1. Mood-Based Hero Gallery – full-width carousel */}
      <section className="relative h-[70vh] min-h-[400px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={heroMoodImages[heroIndex].src}
              alt={heroMoodImages[heroIndex].alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-2"
              >
                Party Lighting
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-white/90 max-w-xl"
              >
                Transform any space with creative lighting. Trusted by Babington House, The Newt & beyond.
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hero nav dots */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex gap-2 z-10">
          {heroMoodImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === heroIndex ? "bg-champagne-gold w-6" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setHeroIndex((i) => (i - 1 + heroMoodImages.length) % heroMoodImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setHeroIndex((i) => (i + 1) % heroMoodImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors z-10"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* 2. Service Toolkit Cards – half-screen layouts */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Lighting Toolkit</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Each service paired with a professional photo. Hover for details, click to view gallery.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {toolkitServices.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <Link
                      href={`#gallery?cat=${service.galleryCategory}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-champagne-gold text-black font-medium rounded-lg hover:bg-gold-light transition-colors"
                    >
                      View Gallery
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  {service.id === "mirror-ball" && <Sparkles className="w-8 h-8 text-champagne-gold" />}
                  {service.id === "festoon" && <Sun className="w-8 h-8 text-champagne-gold" />}
                  {service.id === "uplighting" && <Lightbulb className="w-8 h-8 text-champagne-gold" />}
                  {service.id === "fairy-tunnel" && <Sparkles className="w-8 h-8 text-champagne-gold" />}
                  <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Venue Spotlights – storytelling case studies */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Venue Spotlights</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Narrative case studies: the goal, the solution, the result.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-20">
          {venueSpotlights.map((spotlight) => (
            <motion.article
              key={spotlight.venue}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <span className="text-champagne-gold text-sm font-medium tracking-wide uppercase">
                  {spotlight.venue}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">{spotlight.tagline}</h3>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">{spotlight.narrative}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {spotlight.images.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                ))}
              </div>

              <blockquote className="border-l-4 border-champagne-gold pl-6 py-2 mt-6 bg-gray-900/50 rounded-r-lg">
                <p className="text-white/90 italic">&ldquo;{spotlight.testimonial}&rdquo;</p>
                <cite className="text-gray-500 text-sm not-italic mt-1 block">{spotlight.testimonialAttribution}</cite>
              </blockquote>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 4. Interactive Filtering – Weddings / Corporate / Outdoor */}
      <section id="gallery" className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Browse by Event</h2>
          <p className="text-gray-400 text-lg mb-8">
            Find the lighting style that matches your event. Filter without reloading.
          </p>

          <div className="flex flex-wrap gap-3">
            {(["all", "weddings", "corporate", "outdoor"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  filter === f
                    ? "bg-champagne-gold text-black"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, i) => (
              <motion.div
                key={photo.src + i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-sm text-white/90 line-clamp-2">{photo.alt}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={toLightboxSlides(filteredPhotos)}
        carousel={LIGHTBOX_CAROUSEL}
        controller={LIGHTBOX_CONTROLLER}
        render={{
          buttonPrev: () => <ChevronLeft className="w-8 h-8 text-white" />,
          buttonNext: () => <ChevronRight className="w-8 h-8 text-white" />,
        }}
      />
    </div>
  );
}
