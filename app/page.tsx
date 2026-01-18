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
    alt: "Exceptional wedding entertainment and lighting design across the West Country",
  },
  {
    title: "Parties",
    href: "/parties/private-parties",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163810/image2_l1hxxx.jpg",
    alt: "Professional party entertainment and production across the West Country",
  },
  {
    title: "DJs",
    href: "/artists/djs",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163683/NP-Decks-2_y32tje.jpg",
    alt: "Professional Wedding DJ across the West Country",
  },
  {
    title: "Musicians",
    href: "/artists/musicians",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163656/IMG_3148_owtb29.jpg",
    alt: "Live Wedding Musicians across the West Country",
  },
  {
    title: "Lighting Gallery",
    href: "/galleries",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "Professional Wedding Lighting Design across the West Country",
  },
  {
    title: "Kit Hire",
    href: "/what-we-do/equipment-dj-band-sound-kit",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768214470/DJ-Decks_mlezxe.jpg",
    alt: "Wedding Equipment Hire across the West Country",
  },
  {
    title: "Hire Shop",
    href: "/hire",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/v1768163613/IMG_3400_twcvbw.jpg",
    alt: "Decorative hire items including lanterns, candlesticks, mirror balls and vases for weddings across the West Country",
  },
  {
    title: "Fire-Pits",
    href: "/fire-pit-html",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163430/Fire-Pits-and-Marshmallows_ke3nk5.jpg",
    alt: "Outdoor Fire-Pits for Wedding Venues across the West Country",
  },
  {
    title: "Venue Styling",
    href: "/what-we-do/venue-decoration",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162330/Venue-Styling-Candles-and-autumn-floristry_tbjfee.jpg",
    alt: "Luxury Wedding Venue Styling across the West Country",
  },
  {
    title: "Party Planning",
    href: "/party-planning-and-organising",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163810/image2_l1hxxx.jpg",
    alt: "Professional Party Planning and Event Production across the West Country",
  },
];


const featuredVenues = [
  { name: "Babington House", url: "/babington-wedding-info" },
  { name: "Kin House", url: "/kin-house-wiltshire" },
  { name: "Pennard House", url: "/pennard-house-lighting" },
  { name: "Mells Barn", url: "/mells-barn-weddings" },
  { name: "North Cadbury Court", url: "https://www.northcadburycourt.co.uk/" },
];

// Testimonials Section Component - Displays 3 random reviews
const TestimonialsSection = () => {
  // Initialize with empty array to avoid hydration mismatch
  // Reviews will be set in useEffect (client-side only)
  const [selectedReviews, setSelectedReviews] = useState<Review[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Only select random reviews on client-side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setSelectedReviews(getRandomReviews(3));
  }, []);

  // Show placeholder during SSR and initial hydration
  if (!isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="bg-gray-800/50 border-champagne-gold/40 backdrop-blur-sm h-full">
            <CardContent className="p-6 sm:p-8 h-full flex flex-col">
              <div className="flex justify-center mb-4">
                <Quote className="w-8 h-8 text-champagne-gold/50" strokeWidth={1.5} />
              </div>
              <p className="text-base sm:text-lg text-white font-medium leading-relaxed text-center mb-6 italic flex-grow">
                &nbsp;
              </p>
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
          transition={{ 
            duration: 0.6, 
            delay: index * 0.15,
            ease: [0.22, 1, 0.36, 1] // Luxe easing curve
          }}
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
                <p className="text-champagne-gold font-bold text-base sm:text-lg">
                  {review.author}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {review.venue}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Homepage Gallery Slider Images
const gallerySliderImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768731827/Camilla-Richard-0063_ngmblz.jpg",
    alt: "Wedding reception with professional lighting design showcasing elegant table settings and ambient lighting at a West Country venue",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733254/Babington-House-in-Green_oms0ws.jpg",
    alt: "Babington House wedding venue with beautiful exterior LED mood lighting in green tones, showcasing luxury wedding lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
    alt: "Professional DJ setup at Babington House with custom lighting, professional sound equipment, and atmospheric wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg",
    alt: "Emily and Tom's wedding reception with stunning atmospheric lighting design creating a magical evening ambiance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "Fairy light tunnel at Babington House creating a magical entrance with professional wedding lighting design and venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768734676/RosedewFarmWeddingPhotography-EmmaSam-562_aqtw3u.jpg",
    alt: "Rosedew Farm wedding with elegant lighting design and professional wedding entertainment creating a beautiful celebration atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg",
    alt: "The Newt Somerset wedding venue with fairy light tunnel installation showcasing professional wedding lighting design and venue transformation",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163768/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg",
    alt: "Elegant wedding celebration with professional lighting design and atmospheric wedding entertainment creating a memorable evening",
  },
];

export default function Home() {
  useEffect(() => {
    document.title = "Stylish Entertainment & Production | Professional DJs, Lighting Design & Venue Styling";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Stylish Entertainment & Production - Exceptional entertainment services. Professional DJs, musicians, lighting design, and venue styling across London, Somerset, Bath, Bristol, Dorset, Devon, and Cornwall. Strictly no YMCA.");
    }
  }, []);

  return (
    <div>
      {/* Full Width Image Gallery Slider */}
      <section className="relative w-full h-[60vh] sm:h-[75vh] md:h-[85vh] lg:h-[92vh] overflow-hidden bg-gray-900">
        <Slider className="h-full">
          {gallerySliderImages.map((image, index) => (
            <div key={index} className="relative w-full h-full flex-shrink-0 flex items-center justify-center bg-gray-900">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                style={{ 
                  objectPosition: 'center center',
                }}
                priority={index <= 1}
                sizes="100vw"
                loading={index <= 1 ? "eager" : "lazy"}
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none"></div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30"
          >
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">Stylish Entertainment & Production</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Exceptional <span className="text-gradient">Entertainment</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold leading-relaxed px-4 drop-shadow-md mb-8">
            Professional DJs, musicians, lighting design, and venue styling across London, Somerset, Bath, Bristol, Dorset, Devon, and Cornwall. Strictly no YMCA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="outline" size="lg" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300">
              <Link href="/artists">Meet Our DJs</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-700">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              What We <span className="text-gradient">Do</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Comprehensive entertainment services to make your special day unforgettable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={service.href}>
                  <Card className="h-full bg-gray-800 border-champagne-gold/30 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60 group cursor-pointer">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image
                        src={service.image}
                        alt={service.alt}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-champagne-gold transition-colors">
                        {service.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Client Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-champagne-gold/90 font-semibold max-w-4xl mx-auto leading-relaxed px-4 mb-12">
              From packed dance floors to standing ovations – real stories from real celebrations
            </p>
          </motion.div>

          {/* Random Testimonials Grid */}
          <TestimonialsSection />
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/testi">Read All Testimonials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/20 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Partners</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Featured <span className="text-gradient">Venues</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
              Trusted by the West Country&apos;s most prestigious venues
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 px-4 mb-8">
            {featuredVenues.map((venue, index) => {
              const isExternal = venue.url.startsWith("http");
              return (
                <motion.div
                  key={venue.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-xl sm:text-2xl md:text-3xl font-sans text-gray-400 hover:text-champagne-gold transition-all duration-300 hover:scale-110 font-bold relative group px-2"
                >
                  <Link 
                    href={venue.url} 
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="relative z-10 hover:text-champagne-gold transition-colors"
                  >
                    {venue.name}
                  </Link>
                  <span className="absolute inset-0 bg-gradient-to-r from-champagne-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300">
              <Link href="/venues">Show More Venues</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 px-4 bg-gray-700">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Our Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Meet the <span className="text-gradient">Team</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4 max-w-3xl mx-auto">
              The passionate professionals behind Stylish Entertainment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Ali */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-gray-900 border-champagne-gold/30 h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162313/Ali-Peirce_aec3tn.jpg"
                      alt="Ali - Co-founder of Stylish Entertainment"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-3">Ali</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Ali combines creative vision with meticulous attention to detail. Drawing on years of experience in the creative industries, Ali specializes in venue styling and creating the perfect atmosphere for your special day. Every detail matters, and Ali ensures nothing is overlooked.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Nige */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gray-900 border-champagne-gold/30 h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162279/Nigel-DJ-Babs-House-0009-1_f59b99.jpg"
                      alt="Nige - Co-founder of Stylish Entertainment"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-3">Nige</h3>
                  <p className="text-gray-300 leading-relaxed">
                    With over 20 years of experience in the music and creative industries, Nige brings a wealth of knowledge and passion to every event. From DJ sets at prestigious venues like Babington House to creative lighting design, Nige ensures every celebration is unforgettable.
                  </p>
                </CardContent>
              </Card>
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
