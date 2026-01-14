"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

const services = [
  {
    title: "Weddings",
    href: "/weddings/wedding-entertainment",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163781/Emma-Conrad-2-9-23-682_utvftj.jpg",
    alt: "Exceptional wedding entertainment and lighting design across the West Country",
  },
  {
    title: "Parties",
    href: "/parties/private-parties",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163810/image2_l1hxxx.jpg",
    alt: "Professional party entertainment and production across the West Country",
  },
  {
    title: "DJs",
    href: "/artists/djs",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163683/NP-Decks-2_y32tje.jpg",
    alt: "Professional Wedding DJ across the West Country",
  },
  {
    title: "Musicians",
    href: "/artists/musicians",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163656/IMG_3148_owtb29.jpg",
    alt: "Live Wedding Musicians across the West Country",
  },
  {
    title: "Lighting Gallery",
    href: "/galleries",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768169246/Fairy%20Light%20Tunnel%20at%20Babington%20House.jpg",
    alt: "Professional Wedding Lighting Design across the West Country",
  },
  {
    title: "Kit Hire",
    href: "/what-we-do/equipment-dj-band-sound-kit",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768214470/DJ-Decks_mlezxe.jpg",
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
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163430/Fire-Pits-and-Marshmallows_ke3nk5.jpg",
    alt: "Outdoor Fire-Pits for Wedding Venues across the West Country",
  },
  {
    title: "Venue Styling",
    href: "/what-we-do/venue-decoration",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162330/Venue-Styling-Candles-and-autumn-floristry_tbjfee.jpg",
    alt: "Luxury Wedding Venue Styling across the West Country",
  },
  {
    title: "Party Planning",
    href: "/party-planning-and-organising",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163810/image2_l1hxxx.jpg",
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

// Featured testimonials for homepage carousel
const featuredTestimonials = [
  {
    quote: "All killer, no filler. All bangers, no clangers, as it were. The dance floor was full all night.",
    author: "Vicky & Oli",
    venue: "Hotel du Vin, Poole",
  },
  {
    quote: "Our photographers mentioned in the 10 years they've been working they've not seen a dance floor so full for so long.",
    author: "Alina & Dan",
    venue: "Babington House",
  },
  {
    quote: "Not sure a single guest left the dance floor for the 2.5hrs you were playing. We've had so many amazing comments today.",
    author: "Sophie & Sam",
    venue: "Sessions Art Club, London",
  },
  {
    quote: "The set was a real hit and Rich was an absolute pleasure to work with throughout the day. We'd absolutely recommend him for any future events.",
    author: "Tom & Annig",
    venue: "Marquee Wedding, Tisbury",
  },
  {
    quote: "His mixing and ability to judge the audience was better than I have ever seen. We will definitely be using him again! Just superb!",
    author: "George & Kathryn",
    venue: "Dene Farm, Hampshire",
  },
  {
    quote: "The music was absolutely amazing - the dance floor was busy all evening and lots of people have told me how much they enjoyed the set.",
    author: "Antonia & Jonathan",
    venue: "Eastnor Castle",
  },
];

// Testimonials Carousel Component
function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = featuredTestimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800/50 border-champagne-gold/40 backdrop-blur-sm">
            <CardContent className="p-8 sm:p-12">
              <div className="flex justify-center mb-6">
                <Quote className="w-12 h-12 text-champagne-gold/60" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium leading-relaxed text-center mb-8 italic">
                &quot;{currentTestimonial.quote}&quot;
              </p>
              <div className="text-center border-t border-champagne-gold/30 pt-6">
                <p className="text-champagne-gold font-bold text-lg sm:text-xl">
                  {currentTestimonial.author}
                </p>
                <p className="text-gray-400 text-sm sm:text-base mt-2">
                  {currentTestimonial.venue}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {featuredTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-champagne-gold"
                : "w-2 h-2 bg-champagne-gold/30 hover:bg-champagne-gold/50"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Homepage Gallery Slider Images
const gallerySliderImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162627/Camilla-Richard-0063_mctrmo.jpg",
    alt: "Wedding reception with professional lighting design showcasing elegant table settings and ambient lighting at a West Country venue",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg",
    alt: "Babington House wedding venue with beautiful exterior LED mood lighting in green tones, showcasing luxury wedding lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
    alt: "Professional DJ setup at Babington House with custom lighting, professional sound equipment, and atmospheric wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg",
    alt: "Emily and Tom's wedding reception with stunning atmospheric lighting design creating a magical evening ambiance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768169246/Fairy%20Light%20Tunnel%20at%20Babington%20House.jpg",
    alt: "Fairy light tunnel at Babington House creating a magical entrance with professional wedding lighting design and venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163830/RosedewFarmWeddingPhotography-EmmaSam-562_aqtw3u.jpg",
    alt: "Rosedew Farm wedding with elegant lighting design and professional wedding entertainment creating a beautiful celebration atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163799/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_qwbpur.jpg",
    alt: "The Newt Somerset wedding venue with fairy light tunnel installation showcasing professional wedding lighting design and venue transformation",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163768/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg",
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
      <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[92vh] overflow-hidden">
        <Slider className="h-full">
          {gallerySliderImages.map((image, index) => (
            <div key={index} className="relative w-full h-full flex-shrink-0 flex items-center justify-center bg-black">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: 'center center',
                  minHeight: '100%',
                  minWidth: '100%'
                }}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none"></div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
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
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 hover:scale-105 transition-all duration-300">
              <Link href="/artists">Meet Our DJs</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-800">
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
                      <img
                        src={service.image}
                        alt={service.alt}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
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
      <section className="py-20 px-4 bg-gray-900 relative overflow-hidden">
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

          {/* Animated Testimonials Carousel */}
          <TestimonialsCarousel />
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
              <Link href="/testi">Read All Testimonials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="pt-20 pb-8 px-4 bg-gray-900">
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
      <section className="py-20 px-4 bg-gray-800">
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
                    <img
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162313/Ali-Peirce_aec3tn.jpg"
                      alt="Ali - Co-founder of Stylish Entertainment"
                      className="w-full h-full object-cover"
                      loading="lazy"
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
                    <img
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162279/Nigel-DJ-Babs-House-0009-1_f59b99.jpg"
                      alt="Nige - Co-founder of Stylish Entertainment"
                      className="w-full h-full object-cover"
                      loading="lazy"
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
