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
    href: "/weddings/wedding-entertainment",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163781/Emma-Conrad-2-9-23-682_utvftj.jpg",
    alt: "Exceptional entertainment and lighting design for weddings, parties and events across the UK",
  },
  {
    title: "Parties",
    href: "/parties/private-parties",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163810/image2_l1hxxx.jpg",
    alt: "Professional party entertainment and production in the South West and beyond",
  },
  {
    title: "DJs",
    href: "/artists/djs",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163683/NP-Decks-2_y32tje.jpg",
    alt: "Professional DJ for weddings, parties and events UK-wide",
  },
  {
    title: "Musicians",
    href: "/artists/musicians",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163688/Nigel-DJ-Babs-House-0008-1_ol2gkr.jpg",
    alt: "Live Musicians for weddings, parties and events UK-wide",
  },
  {
    title: "Lighting Gallery",
    href: "/galleries",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "Professional lighting design for weddings, parties and events in the South West and beyond",
  },
  {
    title: "Kit Hire",
    href: "/what-we-do/equipment-dj-band-sound-kit",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768214470/DJ-Decks_mlezxe.jpg",
    alt: "Equipment hire for weddings, parties and events in the South West and beyond",
  },
  {
    title: "Hire Shop",
    href: "/hire",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163613/IMG_3400_twcvbw.jpg",
    alt: "Decorative hire items including lanterns, candlesticks, mirror balls and vases for weddings in the South West and beyond",
  },
  {
    title: "Fire-Pits",
    href: "/fire-pit-html",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163430/Fire-Pits-and-Marshmallows_ke3nk5.jpg",
    alt: "Outdoor Fire-Pits for Wedding Venues in the South West and beyond",
  },
  {
    title: "Venue Styling",
    href: "/what-we-do/venue-decoration",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162330/Venue-Styling-Candles-and-autumn-floristry_tbjfee.jpg",
    alt: "Luxury wedding venue styling in the South West and beyond",
  },
  {
    title: "Party Planning",
    href: "/party-planning-and-organising",
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
          initial={{ opacity: 0, y: 30 }}
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
      <section className="relative w-full h-[60vh] sm:h-[75vh] md:h-[85vh] lg:h-[92vh] h-60dvh sm:h-75dvh md:h-85dvh lg:h-92dvh overflow-hidden bg-gray-900">
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
      </section>

      <section className="relative py-12 md:py-20 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">Stylish Entertainment & Production</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Exceptional <span className="text-gradient">Entertainment</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold leading-relaxed px-4 drop-shadow-md mb-8">
            Professional DJs, musicians, lighting design and venue styling for weddings, parties and events. DJs and musicians UK-wide; lighting and styling in the South West and beyond. Strictly no YMCA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="outline" size="lg" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300">
              <Link href="/artists">Meet Our DJs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-3 sm:px-4 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-champagne-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">The Stylish Difference</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white mb-6 md:mb-8 px-4">What sets our DJs apart</h2>
            <div className="text-left space-y-5 text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
              <p>Let&apos;s be honest: the right vibe is everything. Whether you&apos;re dreaming of a sleek, high-energy solo DJ to anchor the night or the show-stopping magic of our festival trio—featuring live saxophone and percussion—we curate a high-end atmosphere that feels effortlessly vibrant.</p>
              <p>We pride ourselves on our ability to read the crowd and cater to everyone&apos;s musical tastes, from the music lovers to your Great Aunt Betty. Best of all, we&apos;ve officially retired the &quot;wedding cheese.&quot; You can consider us a cliché-free zone: you won&apos;t hear The Macarena or YMCA on our watch; instead, we focus on a fresh, signature soundscape tailored specifically to your taste. It&apos;s your night—let&apos;s make it legendary.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-3 sm:px-4 bg-gray-700">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">What We <span className="text-gradient">Do</span></h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">Comprehensive entertainment services for weddings, parties and events to make every celebration unforgettable</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Client Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">What Our <span className="text-gradient">Clients Say</span></h2>
            <p className="text-lg sm:text-xl md:text-2xl text-champagne-gold/90 font-semibold max-w-4xl mx-auto leading-relaxed px-4 mb-12">From packed dance floors to standing ovations – real stories from real celebrations</p>
          </motion.div>
          <TestimonialsSection />
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/testi">Read All Testimonials</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-3 sm:px-4 bg-gray-700">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Our Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">Meet the <span className="text-gradient">Team</span></h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4 max-w-3xl mx-auto">The passionate professionals behind Stylish Entertainment</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Link href="/about">
                <Card className="bg-gray-900 border-champagne-gold/30 h-full hover:border-champagne-gold/60 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 sm:p-8">
                    <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700 group-hover:scale-105 transition-transform duration-300">
                      <Image src={smallerCloudinaryUrl("https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162313/Ali-Peirce_aec3tn.jpg")} alt="Ali - Creative Strategist & Co-founder of Stylish Entertainment" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-champagne-gold mb-2">Ali</h3>
                    <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Creative Strategist</p>
                    <p className="text-gray-300 leading-relaxed mb-4">Ali combines creative vision with meticulous attention to detail. Specializing in venue styling and artist liaison, Ali transforms spaces into stunning celebration environments where every detail matters.</p>
                    <p className="text-champagne-gold text-sm font-medium group-hover:underline">Read Full Bio →</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Link href="/about">
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
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
