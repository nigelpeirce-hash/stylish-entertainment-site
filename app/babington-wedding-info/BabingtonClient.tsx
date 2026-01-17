"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import BlogImage from "@/components/BlogImage";
import { Lightbulb, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const allImages = [
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg", alt: "Babington House wedding venue exterior" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg", alt: "Professional DJ setup by DJ Nige at Babington House" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw", alt: "Fairy light tunnel at Babington House" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162522/Babington-House-Bar-with-DJ-Niges-setup_zdgqtq.jpg", alt: "Babington House bar with DJ Nige's setup" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162299/STYLISH-babs-july2016_ria-mishaal-photography_017_xsbk3l.jpg", alt: "Babington House front of house with bush lighting" },
  { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163408/Babington-House-Alfresco-dining-daytime_xk0vra.jpg", alt: "Babington House croquet lawn alfresco dining" },
];

const lightingOptions = [
  {
    title: "Light and Shade",
    description: "We call this Light and Shade Tree lighting and it's installed on the large pine tree on the bar terrace. Great for Insta shots. We have had it described as Iconic (not by us)!",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "Light and Shade tree lighting at Babington House bar terrace",
  },
  {
    title: "LED Spheres",
    description: "Beautiful LED spheres hung in the Pine Tree. Practically invisible during the day, once dusk falls they really add drama to the already beautiful tree.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "LED spheres lighting in pine tree at Babington House",
  },
  {
    title: "Chill Out Camp",
    description: "Linking the Bar this lighting installation uses vintage Edison festoon lighting wrapped in fairy-lights. The Edison is dimmable so that the bar and bar terrace work in unison to create a magical atmosphere.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "Chill Out Camp lighting with Edison festoon at Babington House",
  },
  {
    title: "Free Standing Bar Terrace Canopy",
    description: "Free standing lighting canopy with optional white shades.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "Free standing bar terrace canopy lighting at Babington House",
  },
  {
    title: "Edison Vintage Tree Lighting",
    description: "Vintage Edison Bulbs for a beautiful, warm atmosphere.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    alt: "Edison vintage tree lighting at Babington House",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function BabingtonClient() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.6;
      setIsSticky(window.scrollY > heroHeight);

      // Determine active section based on scroll position
      const sections = ["bar", "terrace", "front-of-house", "orangery", "garden"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(currentSection || "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky nav height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg"
            alt="Babington House wedding venue exterior"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-800" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Babington House Wedding Info
          </h1>
        </motion.div>
      </section>

      {/* Sticky Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isSticky ? 1 : 0, y: isSticky ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-champagne-gold/50 shadow-lg ${
          isSticky ? "block" : "hidden"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-4 py-3 overflow-x-auto">
            {[
              { id: "bar", label: "Bar" },
              { id: "terrace", label: "Terrace" },
              { id: "front-of-house", label: "Front of House" },
              { id: "orangery", label: "Orangery" },
              { id: "garden", label: "Garden" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-champagne-gold text-black"
                    : "text-gray-200 hover:text-champagne-gold hover:bg-gray-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Introduction */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-4">
              Congratulations on booking your Babington House wedding, you have chosen the best venue in the UK to get married – in my opinion. Since 2003 when I played my first DJ set at a Babington wedding, I have seen many things – some beautiful, some tear-jerking and some odd!
            </p>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-4">
              To assist you with your planning and understanding of how weddings generally flow at Babington, I have offered my thoughts below on the different areas of the site which I hope you find useful.
            </p>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-semibold">
              <span className="text-champagne-gold text-3xl md:text-4xl" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontStyle: "italic" }}>
                DJ Nige
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Bar */}
      <section id="bar" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Bar</h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                The Babington bar is an excellent space for a party and can hold more people than you think. On New Years Eve we have over 200 celebrating at midnight and it&apos;s an amazing atmosphere.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                If you are opting for a solo DJ with decks, sound-system and lighting, the small tables are removed along with the easy chairs to create a good-sized dance-floor.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                When a band and DJ are used you will lose some of the bar sofas. Once removed they do not go back into the bar until the following morning, which means, there are no comfy spaces to sit and watch the dancing or, for any after hours activity.
              </p>
              
              {/* Expert Tip */}
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 mt-6">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="p-2 bg-champagne-gold/20 rounded-lg flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Expert Tip</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      <strong>Consider the sofa removal:</strong> If you&apos;re planning a band and DJ setup, remember that the bar sofas will be removed and won&apos;t return until the next morning. Plan for alternative seating areas if guests need a break from dancing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              <BlogImage
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162522/Babington-House-Bar-with-DJ-Niges-setup_zdgqtq.jpg"
                alt="Babington House bar with DJ Nige's setup and atmospheric lighting"
                images={allImages}
                index={3}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bar Terrace */}
      <section id="terrace" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Bar Terrace</h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                The bar terrace is a great space for summer weddings, it&apos;s linked to the bar so you can hear and interact with the music but enjoy a cigar around a table with your friends and family.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                There is no lighting permanently installed and it can be very dark if there is no moon. You are allocated money for lighting from your wedding package and we can happily advise if you are undecided what will work for you. Below are some options that are tried and tested, we can also create bespoke lighting to your requirements and brief.
              </p>
            </div>
            <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              <BlogImage
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw"
                alt="Bar terrace lighting options at Babington House"
                images={allImages}
                index={2}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
              />
            </div>
          </motion.div>

          {/* Lighting Options Gallery Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Lighting Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lightingOptions.map((option, idx) => (
                <motion.div key={idx} variants={item}>
                  <Card className="bg-gray-900/50 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/60 transition-all h-full overflow-hidden">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={option.image}
                        alt={option.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="text-lg font-bold text-champagne-gold mb-2">{option.title}</h4>
                      <p className="text-sm text-gray-200 leading-relaxed">{option.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Front of House */}
      <section id="front-of-house" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Front of House</h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                During the months where the bar terrace is unavailable (October – April generally) The front of the house plays a more important role. Any smokers in the group will gravitate outside on the main turning circle. The view is towards the church, drive and the front of house.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                We call these Fairies in the bushes and they help to illuminate the entrance and turning circle. Great for Insta shots.
              </p>
            </div>
            <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              <BlogImage
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162299/STYLISH-babs-july2016_ria-mishaal-photography_017_xsbk3l.jpg"
                alt="Babington House front of house with fairy lights in bushes and tree lighting"
                images={allImages}
                index={4}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Croquet Lawn */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Croquet Lawn</h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                An underused space (in my opinion) but can be used for some fun for kids and kidults! If you are into Alfresco dining, it&apos;s a lovely experience for your family and friends.
              </p>
            </div>
            <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              <BlogImage
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163408/Babington-House-Alfresco-dining-daytime_xk0vra.jpg"
                alt="Babington House croquet lawn set up for alfresco dining with festoon lighting"
                images={allImages}
                index={5}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Orangery */}
      <section id="orangery" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Orangery</h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                One of the finest dining rooms in the whole world! The Orangery does not need much as it&apos;s already stunning but to make it more sparkly for a wedding we often install lighting for winter and autumn weddings.
              </p>
            </div>
            <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
              <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
                <Sparkles className="w-24 h-24 text-champagne-gold/30" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Walled Garden */}
      <section id="garden" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Walled Garden</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              Often used for pre-wedding BBQ&apos;s on a Wednesday night, the walled garden is a delightful area during the summer. A well loved and tended garden with an abundance of flowers, vegetables & apple trees in a Soho House style. We offer a lighting canopy that covers the dining tables, BBQ and bar. In addition to lighting we often supply a PA with microphone for welcome speeches and music playback.
            </p>
            <p className="text-gray-200 text-lg leading-relaxed">
              This fairy light canopy can be created in any space using free standing supports. Stunning all times of the year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Other */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Other</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              We work with a variety of musicians, from saxophone players who jam along with the DJ to pianists and singers for cocktail sets. We can also provide confetti cannons for first dances and create unique lighting installations tailored to your vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Questions About Your Babington House Wedding?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <Link href="/contact-us">Get in Touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 transition-all duration-300">
                <Link href="/artists/djs">Visit DJ Nige&apos;s Page</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
