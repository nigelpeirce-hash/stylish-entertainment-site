"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "@/lib/motion";
import { ChevronLeft, ChevronRight, Map, Sparkles, Music, MapPin } from "lucide-react";
import SiteLightbox from "@/components/SiteLightbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import BeforeAfter from "@/components/BeforeAfter";
import { getEditorialServiceRegions, EDITORIAL_SERVICE_HEADLINE } from "@/lib/service-areas";
import { Button } from "@/components/ui/button";

// Hero mood images – party moments (first dance feel, marquee, packed dancefloor)
const heroMoodImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg",
    alt: "Magical fairy light tunnel at The Newt Somerset – first wedding, prestigious venue transformation",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163720/A-Big-Lazer-e1430894875463_xgpiil.jpg",
    alt: "Packed dance floor with dramatic laser lighting – high-energy party celebration",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741340/_F4R3275_tukoww.jpg",
    alt: "Lit marquee at night with Edison festoon and fairy lights – alfresco party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    alt: "Pool party with colourful lighting reflecting on the water – stylish summer celebration",
  },
];

// Gallery photos
const galleryPhotos = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg", alt: "Professional lighting design at Kings Weston House for a private party" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162844/Orangery1_dpfega.jpg", alt: "Orangery venue with stunning party lighting and elegant atmosphere" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg", alt: "Pool party with colourful lighting reflecting on the water" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163181/IMG_6095_fo6lhk.jpg", alt: "Private party with atmospheric lighting and elegant decor" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768731384/Pennard-House-Lighting-with-Amber-Up-lighting_sljvaa.jpg", alt: "Pennard House with amber uplighting for elegant evening events" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1777634524/wild-west-party-04_g8pvop.jpg", alt: "Outdoor Wild West themed patio with fire pit, hay-bale seating and festoon lights at a private party" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1777634523/wild-west-party-03_rvh4xq.jpg", alt: "Wild West themed photo backdrop with cowboy props and rustic styling at a private party" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1777634523/wild-west-party-01_chyutk.jpg", alt: "Wild West themed banquet hall with long tables, bunting and Edison festoon lighting" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1777634522/wild-west-party-02_aqqa1c.jpg", alt: "Wild West themed venue entrance with saloon doors and festive lighting at night" },
];

// Before and After – 2-row layout: Barn transformation + Party room transformation (matches galleries)
const beforeAfterTransforms = [
  {
    title: "Private Party Space",
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1771490793/Log_room_10_tttjs7.jpg",
      alt: "Private party space before transformation",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768649763/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw.jpg",
      alt: "Private party space after transformation",
    },
  },
  {
    title: "Barn Transformation",
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163654/IMG_1070_pelq7j.jpg",
      alt: "Barn before transformation - empty space ready for styling and lighting design",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163716/IMG_1098_hqiw3d.jpg",
      alt: "Barn after transformation - elegant outdoor terrace with professional venue styling and festoon lighting",
    },
  },
  {
    title: "Party Room Transformation",
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768753000/IMG_2530_njx41m.jpg",
      alt: "Party room before transformation - empty space ready for styling and lighting design",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768751155/IMG_3188_zviff5.jpg",
      alt: "Party room after transformation - fun and creative party styling with vibrant decorations and lighting design",
    },
  },
];

// Transformation pillars – impact-focused copy
const transformationPillars = [
  {
    icon: Map,
    title: "Design & Planning",
    copy: "We handle the logistics; you enjoy the hors d'oeuvres.",
  },
  {
    icon: Sparkles,
    title: "Production & Lighting",
    copy: "Atmosphere on demand. We turn empty fields into magical marquees.",
  },
  {
    icon: Music,
    title: "Entertainment",
    copy: "The perfect soundtrack for people who hate generic wedding bands.",
  },
];

// Planning journey – concierge-style timeline
const planningSteps = [
  { label: "Empty Venue", description: "Your vision, our starting point" },
  { label: "Discovery", description: "We listen. You dream." },
  { label: "Design", description: "Bespoke plans, no cookie-cutter" },
  { label: "Delivery", description: "Flawless execution on the day" },
  { label: "Flawless Night", description: "Memories made" },
];

// SEO location data – accordion at bottom. Order: West Country first, then London/Home Counties, Midlands, etc.
const SERVICE_AREAS_ORDER = ["Somerset", "Wiltshire", "Gloucestershire", "Bath", "Bristol", "Dorset", "Devon", "Oxfordshire", "London", "Surrey", "Berkshire"];
const serviceAreasRaw: { region: string; towns: string[] }[] = [
  { region: "Somerset", towns: ["Frome", "Bruton", "Castle Cary", "Glastonbury", "Wells", "Taunton", "Shepton Mallet", "Street", "Yeovil", "Bridgwater", "Wincanton", "Somerton", "Crewkerne", "Ilminster", "Chard", "Dunster", "Watchet", "Minehead", "Burnham-on-Sea", "Highbridge", "Cheddar", "Axbridge", "Wedmore", "Langport", "Martock", "South Petherton", "Milborne Port", "Templecombe", "Norton-sub-Hamdon", "Montacute", "Stoke-sub-Hamdon", "Cucklington", "Zeals", "Evercreech", "Ditcheat", "Pilton"] },
  { region: "Wiltshire", towns: ["Malmesbury", "Marlborough", "Devizes", "Salisbury", "Warminster", "Westbury", "Trowbridge", "Bradford-on-Avon", "Chippenham", "Swindon", "Melksham", "Corsham", "Amesbury", "Calne", "Tidworth", "Pewsey", "Royal Wootton Bassett", "Ludgershall", "Tisbury", "Downton", "Fordingbridge", "Alderbury", "Woodford", "Redlynch", "Britford", "Durrington", "Bulford", "Larkhill", "Easterton", "Market Lavington", "Burbage", "Great Bedwyn", "Ramsbury", "Ogbourne St George"] },
  { region: "Gloucestershire", towns: ["South Gloucestershire", "Cheltenham", "Gloucester", "Stroud", "Cirencester", "Tetbury", "Tewkesbury", "Dursley", "Thornbury", "Chipping Sodbury", "Yate", "Wotton-under-Edge", "Moreton-in-Marsh", "Fairford", "Lechlade", "Nailsworth", "Painswick", "Stonehouse", "Berkeley", "Lydney", "Newent", "Winchcombe", "Chipping Campden", "Broadway", "Bourton-on-the-Water", "Stow-on-the-Wold", "Northleach", "Kemble", "Sapperton", "Rodmarton", "Eastleach", "Ampney Crucis"] },
  { region: "Bath", towns: ["Bath", "Midsomer Norton", "Radstock", "Keynsham", "Saltford", "Peasedown St John", "Combe Down", "Lansdown", "Twerton", "Oldfield Park", "Widcombe", "Claverton Down", "Bathampton", "Batheaston", "Bathford", "Compton Dando", "Wellow", "Peasedown", "Camerton", "Priston", "Englishcombe", "Hinton Charterhouse", "Freshford", "Limpley Stoke"] },
  { region: "Bristol", towns: ["Clifton", "City Centre", "Westbury-on-Trym", "Chew Magna", "Bishopston", "Redland", "Hotwells", "Hanham", "Longwell Green", "Brislington", "Knowle", "Bedminster", "Ashton Gate", "Southville", "Windmill Hill", "Totterdown", "St Werburghs", "Montpelier", "Cotham", "Stokes Croft", "St Pauls", "Easton", "Fishponds", "Staple Hill", "Kingswood", "Whitchurch", "Westbury Park", "Henleaze", "Westbury Village"] },
  { region: "Dorset", towns: ["Sherborne", "Gillingham", "Shaftesbury", "Dorchester", "Weymouth", "Bridport", "Blandford Forum", "Wimborne Minster", "Sturminster Newton", "Bere Regis", "Verwood", "Wareham", "Swanage", "Poole", "Bournemouth", "Christchurch", "Ferndown", "Wimborne", "Corfe Mullen", "Blandford St Mary", "Stalbridge", "Templecombe", "Milborne Port", "Puddletown", "Cerne Abbas", "Milton Abbas", "Abbotsbury", "Lyme Regis"] },
  { region: "Devon", towns: ["Exeter", "Honiton", "Crediton", "Tiverton", "Okehampton", "Barnstaple", "Bideford", "South Molton", "Chulmleigh", "Dawlish", "Teignmouth", "Newton Abbot", "Torquay", "Paignton", "Totnes", "Dartmouth", "Salcombe", "Kingsbridge", "Plymouth", "Tavistock", "Holsworthy", "Hatherleigh", "Winkleigh", "North Tawton", "Bow"] },
];
const serviceAreas = [...serviceAreasRaw].sort((a, b) => {
  const ia = SERVICE_AREAS_ORDER.indexOf(a.region);
  const ib = SERVICE_AREAS_ORDER.indexOf(b.region);
  if (ia >= 0 && ib >= 0) return ia - ib;
  if (ia >= 0) return -1;
  if (ib >= 0) return 1;
  return a.region.localeCompare(b.region);
});

export default function PrivatePartiesClient() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const advanceHero = useCallback(() => {
    setHeroIndex((i) => (i + 1) % heroMoodImages.length);
  }, []);
  useEffect(() => {
    const t = setInterval(advanceHero, 5000);
    return () => clearInterval(t);
  }, [advanceHero]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white max-w-full overflow-x-hidden">
      {/* 1. Hero – rotating gallery; copy overlay stays fixed (SSR-safe, no fade-in on text) */}
      <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden max-w-full">
        <div className="absolute inset-0">
          {heroMoodImages.map((image, i) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === heroIndex ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={i !== heroIndex}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
                quality={85}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 pointer-events-none z-[1]" />
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-10 lg:p-12 max-w-4xl">
          <div className="inline-block mb-4 px-4 py-1.5 bg-champagne-gold/10 rounded-full border border-champagne-gold/30 backdrop-blur-sm">
            <span className="text-xs sm:text-sm font-semibold text-champagne-gold tracking-wider uppercase">
              Trusted at Babington House since 2003
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg leading-tight">
            Events That Feel Like a Soho House Night.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mb-6 drop-shadow-md">
            DJs, lighting and production for private parties across Somerset, Wiltshire and beyond — one experienced team from first enquiry to last dance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-3">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Link href="/contact-us/">Check Availability</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Link href="tel:+447970793177">Call 07970 793177</Link>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 drop-shadow-md">
            20+ years · Babington House since 2003 · UK-wide
          </p>
        </div>

        {/* Hero nav dots */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2 z-20">
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
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors z-20"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setHeroIndex((i) => (i + 1) % heroMoodImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors z-20"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Before and After – 2-row layout (matches galleries) */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-900 max-w-full overflow-x-hidden">
        <div className="w-full max-w-[1700px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-14 text-center"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Featured</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold mb-3 text-white">
              Before and After
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Drag the slider or click anywhere to compare
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-16">
            {beforeAfterTransforms.map((transform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-2 border-champagne-gold/30 shadow-xl overflow-hidden hover:border-champagne-gold/60 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-champagne-gold mb-4">{transform.title}</h3>
                    <BeforeAfter
                      before={transform.before}
                      after={transform.after}
                      aspectRatio="16/9"
                      fullWidth
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Transformation Three-Column Grid */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Bespoke Event Production</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The Soho House standard, delivered anywhere.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transformationPillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur border-champagne-gold/30 hover:border-champagne-gold/50 transition-all h-full">
                  <CardContent className="p-8">
                    <pillar.icon className="w-12 h-12 text-champagne-gold mb-6" />
                    <h3 className="text-xl md:text-2xl font-bold mb-4">{pillar.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{pillar.copy}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Planning Journey – horizontal timeline */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950 max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Your Planning Journey</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From empty venue to flawless execution. Think concierge, not checklist.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Desktop horizontal timeline */}
            <div className="hidden md:block relative pt-2 pb-4">
              <div className="absolute top-9 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-gray-600 via-champagne-gold/40 to-champagne-gold rounded-full" />
              <div className="relative flex justify-between">
                {planningSteps.map((step, i) => (
                  <div key={step.label} className="flex-1 flex flex-col items-center text-center min-w-0 px-2">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-base mb-4 z-10 ${
                        i === 0 ? "bg-gray-600/80 text-gray-300" : i === planningSteps.length - 1 ? "bg-champagne-gold text-black" : "bg-white/10 text-champagne-gold border-2 border-champagne-gold/50"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <h3 className="text-base font-bold mb-1">{step.label}</h3>
                    <p className="text-gray-500 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile vertical timeline */}
            <div className="md:hidden space-y-6">
              {planningSteps.map((step, i) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                        i === 0 ? "bg-gray-600 text-gray-300" : i === planningSteps.length - 1 ? "bg-champagne-gold text-black" : "bg-white/10 text-champagne-gold border-2 border-champagne-gold/50"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < planningSteps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-champagne-gold/50 to-champagne-gold min-h-[24px] mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="text-lg font-bold mb-1">{step.label}</h3>
                    <p className="text-gray-500 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Gallery */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-900/50 max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Atmospheric Venue Transformations</h2>
          <p className="text-gray-400 text-lg">Serving the South West&apos;s most prestigious venues.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryPhotos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Babington Social Proof */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gray-950 max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/40">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-6">
                  <span className="text-5xl">⭐</span>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">The Soho House Standard, Delivered Anywhere</h3>
                    <p className="text-gray-200 text-lg leading-relaxed mb-6">
                      For over 20 years we have been the sole supplier of entertainment and party production at the legendary{" "}
                      <Link
                        href="https://www.babingtonhouse.co.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-champagne-gold hover:text-gold-light underline font-semibold"
                      >
                        Babington House (Soho House & Co)
                      </Link>
                      —where celebs hang out and party.
                    </p>
                    <p className="text-gray-300">
                      Hundreds of weddings, parties and events. Every detail perfect. We&apos;re proud to be part of the Soho House family.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-16 px-4 bg-gray-900/50 border-t border-white/5 max-w-full overflow-x-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-200 text-lg mb-6">
            Contact us about your party plans on{" "}
            <a href="tel:+447970793177" className="text-champagne-gold hover:text-gold-light font-bold underline">
              07970793177
            </a>
          </p>
          <Button asChild size="lg" className="min-h-[48px] h-[48px] sm:h-auto sm:min-h-[48px] bg-champagne-gold text-black hover:bg-gold-light">
            <Link href="/contact-us/" className="flex items-center justify-center min-h-[48px] py-3">Get in Touch</Link>
          </Button>
        </div>
      </section>

      {/* 7. Editorial Service Areas + Town Accordion */}
      <section className="py-16 px-4 bg-gray-950 border-t border-white/5 max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Editorial tiles – cohesive with artists/djs */}
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              {EDITORIAL_SERVICE_HEADLINE.headline}
            </h3>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
              {EDITORIAL_SERVICE_HEADLINE.subheadline}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {getEditorialServiceRegions().map((tile) => (
                <Card key={tile.region} className="bg-gray-900/80 border-champagne-gold/30 text-left">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold text-champagne-gold mb-2">{tile.region}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{tile.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Town accordion – detailed locations */}
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-champagne-gold/70" />
            <h3 className="text-lg font-semibold text-gray-400">Where We Serve</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Click a county to see towns we serve in the South West and beyond.
          </p>
          <Accordion type="single" className="w-full">
            {serviceAreas.map((area, idx) => (
              <AccordionItem key={area.region} value={`area-${idx}`} className="border border-white/10 rounded-lg mb-2 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:bg-white/5 hover:no-underline text-left">
                  <span className="font-medium">{area.region}</span>
                  <span className="text-gray-500 text-sm ml-2">({area.towns.length} towns)</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {area.towns.map((town) => (
                      <span
                        key={town}
                        className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-full text-sm border border-white/10"
                      >
                        {town}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="sr-only mt-8" aria-hidden="true">
            <h3>Where We Serve – Party Planning Service Areas</h3>
            <p>STYLISH Entertainment provides bespoke event production in the South West and beyond. We serve 200+ towns including:</p>
            {serviceAreas.map((area) => (
              <div key={area.region}>
                <h4>Party Planning in {area.region}</h4>
                <p>{area.region}: {area.towns.join(", ")}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryPhotos}
      />
    </div>
  );
}
