"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { getRandomReviews } from "@/data/reviews";
import type { Review } from "@/data/reviews";

const services = [
  {
    title: "Weddings",
    href: "/weddings/wedding-entertainment/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163781/Emma-Conrad-2-9-23-682_utvftj.jpg",
    alt: "Exceptional entertainment and lighting design for weddings, parties and events across the UK",
  },
  {
    title: "Parties",
    href: "/parties/private-parties/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163810/image2_l1hxxx.jpg",
    alt: "Professional party entertainment and production in the South West and beyond",
  },
  {
    title: "DJs",
    href: "/artists/djs/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163683/NP-Decks-2_y32tje.jpg",
    alt: "Professional DJ for weddings, parties and events UK-wide",
  },
  {
    title: "Musicians",
    href: "/artists/musicians/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163688/Nigel-DJ-Babs-House-0008-1_ol2gkr.jpg",
    alt: "Live Musicians for weddings, parties and events UK-wide",
  },
  {
    title: "Lighting Gallery",
    href: "/galleries/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "Professional lighting design for weddings, parties and events in the South West and beyond",
  },
  {
    title: "Kit Hire",
    href: "/services/kit-hire/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768214470/DJ-Decks_mlezxe.jpg",
    alt: "Equipment hire for weddings, parties and events in the South West and beyond",
  },
  {
    title: "Hire Shop",
    href: "/hire/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163613/IMG_3400_twcvbw.jpg",
    alt: "Decorative hire items including lanterns, candlesticks, mirror balls and vases for weddings in the South West and beyond",
  },
  {
    title: "Fire-Pits",
    href: "/services/fire-pit-hire/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163430/Fire-Pits-and-Marshmallows_ke3nk5.jpg",
    alt: "Outdoor Fire-Pits for Wedding Venues in the South West and beyond",
  },
  {
    title: "Venue Styling",
    href: "/services/venue-styling/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162330/Venue-Styling-Candles-and-autumn-floristry_tbjfee.jpg",
    alt: "Luxury wedding venue styling in the South West and beyond",
  },
  {
    title: "Party Planning",
    href: "/party-planning-and-organising/",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163810/image2_l1hxxx.jpg",
    alt: "Professional party planning and event production in the South West and beyond",
  },
];

// Testimonials Section Component - Displays 3 random reviews
const TestimonialsSection = () => {
  const [selectedReviews, setSelectedReviews] = useState<Review[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setSelectedReviews(getRandomReviews(3));
  }, []);

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="bg-gray-800/50 border-champagne-gold/40 backdrop-blur-sm h-full">
            <CardContent className="p-6 sm:p-8 h-full flex flex-col">
              <div className="flex justify-center mb-4">
                <Quote className="w-8 h-8 text-champagne-gold/50" strokeWidth={1.5} />
              </div>
              <p className="text-base sm:text-lg text-white font-medium leading-relaxed text-center mb-6 italic flex-grow">&nbsp;</p>
              <div className="text-center border-t border-champagne-gold/30 pt-4">
                <p className="text-champagne-gold font-bold text-base sm:text-lg">&nbsp;</p>
                <p className="text-gray-400 text-sm mt-1">&nbsp;</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {selectedReviews.map((review, index) => (
        <motion.div
          key={`${review.author}-${index}`}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="bg-gray-800/50 border-champagne-gold/40 backdrop-blur-sm h-full hover:border-champagne-gold/60 transition-all duration-300">
            <CardContent className="p-6 sm:p-8 h-full flex flex-col">
              <div className="flex justify-center mb-4">
                <Quote className="w-8 h-8 text-champagne-gold/50" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.2))' }} />
              </div>
              <p className="text-base sm:text-lg text-white font-medium leading-relaxed text-center mb-6 italic flex-grow">
                &quot;{review.quote}&quot;
              </p>
              <div className="text-center border-t border-champagne-gold/30 pt-4">
                <p className="text-champagne-gold font-bold text-base sm:text-lg">{review.author}</p>
                <p className="text-gray-400 text-sm mt-1">{review.venue}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const LCP_HERO_URL = "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_60,dpr_auto,w_1080/v1768741948/Saltburn_231005__0020_0640_nmzjp6.jpg";

function smallerCloudinaryUrl(url: string): string {
  return url
    .replace(/q_auto|q_85/, "q_75")
    .replace(/\/(upload\/[^/]+)\//, (_, t) => (t.includes("w_") ? `/${t}/` : `/${t},w_800/`));
}

function sliderCloudinaryUrl(url: string): string {
  return url
    .replace(/q_auto|q_85/, "q_75")
    .replace(/\/(upload\/[^/]+)\//, (_, t) => (t.includes("w_") ? `/${t}/` : `/${t},w_1080/`));
}

const gallerySliderImages = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741948/Saltburn_231005__0020_0640_nmzjp6.jpg", alt: "Professional wedding lighting and entertainment at Saltburn venue, showcasing elegant atmospheric lighting design and event styling" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742204/Saltburn_231005__0050_1558_y6diu8.jpg", alt: "Professional wedding lighting and entertainment at Saltburn venue, showcasing elegant atmospheric lighting design and event styling" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg", alt: "Emily and Tom's wedding reception with stunning atmospheric lighting design creating a magical evening ambiance" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw", alt: "Fairy light tunnel at Babington House creating a magical entrance with professional wedding lighting design and venue styling" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768734676/RosedewFarmWeddingPhotography-EmmaSam-562_aqtw3u.jpg", alt: "Rosedew Farm wedding with elegant lighting design and professional wedding entertainment creating a beautiful celebration atmosphere" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg", alt: "The Newt Somerset wedding venue with fairy light tunnel installation showcasing professional wedding lighting design and venue transformation" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163768/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg", alt: "Elegant wedding celebration with professional lighting design and atmospheric wedding entertainment creating a memorable evening" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HomeClient() {
  const [sliderImages, setSliderImages] = useState<typeof gallerySliderImages>(gallerySliderImages);

  useEffect(() => {
    const t = setTimeout(() => setSliderImages(shuffleArray(gallerySliderImages)), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <section className="relative w-full h-[78dvh] min-h-[520px] sm:h-[75vh] md:h-[85vh] lg:h-[92vh] overflow-hidden bg-gray-900">
        <Slider className="h-full">
          {sliderImages.map((image, index) => (
            <div key={image.src} className="relative w-full h-full flex-shrink-0 flex items-center justify-center bg-gray-900">
              <Image
                src={index === 0 && image.src.includes("Saltburn_231005__0020_0640_nmzjp6") ? LCP_HERO_URL : sliderCloudinaryUrl(image.src)}
                alt={image.alt}
                fill
                className="object-cover"
                style={{ objectPosition: "center center" }}
                priority={index <= 1}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="(max-width: 1920px) 100vw, 1920px"
                loading={index <= 1 ? "eager" : "lazy"}
                quality={65}
                unoptimized={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
            </div>
          ))}
        </Slider>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-black/25 sm:from-black/80 sm:via-black/45 sm:to-black/15 pointer-events-none" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6 pt-28 sm:inset-0 sm:flex sm:items-end sm:justify-center sm:pb-14 md:pb-16 sm:pt-0 pointer-events-none">
          <div className="pointer-events-auto text-center max-w-5xl mx-auto w-full">
            <div className="inline-block mb-3 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30 backdrop-blur-sm">
              <span className="text-xs sm:text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">
                Trusted at Babington House since 2003
              </span>
            </div>
            <h1 className="text-2xl leading-snug sm:text-4xl sm:leading-tight md:text-5xl lg:text-6xl font-sans mb-2 sm:mb-4 text-white font-bold drop-shadow-lg px-1">
              Luxury Wedding Entertainment
              <br className="sm:hidden" />
              &amp; Event Production
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-white font-semibold leading-relaxed drop-shadow-md mb-4 sm:mb-6 max-w-3xl mx-auto">
              DJs, lighting and styling — one experienced team, UK-wide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-3 sm:mb-4">
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
                <Link href="/artists/djs/dj-nige/">Meet DJ Nige</Link>
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 drop-shadow-md">
              Five-star Google reviews · 20+ years · Trusted by couples across the UK and Europe
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-20 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Entertainment & <span className="text-gradient">Production</span> Studio
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold leading-relaxed px-4 drop-shadow-md">
            DJs and musicians UK-wide. Lighting design, venue styling and technical production in the South West and beyond. Weddings, private parties, corporate. Confident, crafted—strictly no YMCA.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-3 sm:px-4 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-champagne-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">The Stylish Difference</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white mb-6 md:mb-8 px-4">What sets us apart</h2>
            <div className="text-left space-y-5 text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
              <p>We&apos;re a boutique production studio: DJs and musicians are the entry point; the identity is full event production. Our artists read the room and build a bespoke soundtrack—from solo DJ sets to our festival-style trio (DJ, sax and percussion). Add lighting design and venue styling in the South West and you get one team, one vision.</p>
              <p>Cheese-free zone: no Macarena, no YMCA. Confident, crafted entertainment and production for weddings, private parties and corporate events. Your night, done right.</p>
            </div>
            <p className="text-center text-gray-400 text-sm sm:text-base mt-8">
              Explore by region: <Link href="/luxury-wedding-entertainment-south-west/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Luxury Wedding Entertainment South West</Link> · <Link href="/wedding-production-london/" className="text-champagne-gold hover:text-champagne-gold/80 underline">Wedding Production London</Link>
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-3 sm:px-4 bg-gray-700">
        <div className="container mx-auto">
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">What We <span className="text-gradient">Do</span></h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">Artists, lighting design, venue styling, technical production and hire—everything you need to make every celebration unforgettable</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div key={service.title} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link href={service.href}>
                  <Card className="h-full bg-gray-800 border-champagne-gold/30 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60 group cursor-pointer">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image src={smallerCloudinaryUrl(service.image)} alt={service.alt} fill className="object-cover object-center group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px" quality={65} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-champagne-gold transition-colors">{service.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-3 sm:px-4 bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Client Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">What Our <span className="text-gradient">Clients Say</span></h2>
            <p className="text-lg sm:text-xl md:text-2xl text-champagne-gold/90 font-semibold max-w-4xl mx-auto leading-relaxed px-4 mb-12">From packed dance floors to standing ovations – real stories from real celebrations</p>
          </motion.div>
          <TestimonialsSection />
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/testi/">Read All Testimonials</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-3 sm:px-4 bg-gray-700">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Our Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">Meet the <span className="text-gradient">Team</span></h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4 max-w-3xl mx-auto">The passionate professionals behind Stylish Entertainment</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Link href="/about/">
                <Card className="bg-gray-900 border-champagne-gold/30 h-full hover:border-champagne-gold/60 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 sm:p-8">
                    <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700 group-hover:scale-105 transition-transform duration-300">
                      <Image src={smallerCloudinaryUrl("https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162313/Ali-Peirce_aec3tn.jpg")} alt="Ali - Creative Strategist & Co-founder of Stylish Entertainment" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-champagne-gold mb-2">Ali</h3>
                    <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Creative Strategist</p>
                    <p className="text-gray-300 leading-relaxed mb-4">Ali combines creative vision with meticulous attention to detail. Specialising in venue styling and artist liaison, Ali transforms spaces into stunning celebration environments where every detail matters.</p>
                    <p className="text-champagne-gold text-sm font-medium group-hover:underline">Read Full Bio →</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Link href="/artists/djs/dj-nige/">
                <Card className="bg-gray-900 border-champagne-gold/30 h-full hover:border-champagne-gold/60 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 sm:p-8">
                    <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700 group-hover:scale-105 transition-transform duration-300">
                      <Image src={smallerCloudinaryUrl("https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162279/Nigel-DJ-Babs-House-0009-1_f59b99.jpg")} alt="Nige - Creative & Technical & Co-founder of Stylish Entertainment" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-champagne-gold mb-2">Nige</h3>
                    <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Creative & Technical</p>
                    <p className="text-gray-300 leading-relaxed mb-4">With over 20 years of experience, Nige brings technical excellence and creative expertise to every event. From DJ sets at Babington House to Glastonbury Festival, combining innovation with flawless execution.</p>
                    <p className="text-champagne-gold text-sm font-medium group-hover:underline">Read Full Bio →</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/about/">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
