"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import BlogImage from "@/components/BlogImage";

export default function BlogPostProfessionalDJ() {
  useEffect(() => {
    document.title = "Why You Should Use an Experienced, Professional DJ | Stylish Entertainment Blog";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Discover why hiring an experienced, professional DJ is essential for your wedding or event. Learn about the benefits of professional DJ services over amateur options.");
    }
  }, []);

  // Collect all images for lightbox navigation
  const allImages = useMemo(() => [
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg", alt: "Professional DJ setup at Babington House with custom lighting, professional sound equipment, and atmospheric wedding entertainment" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163683/NP-Decks-2_y32tje.jpg", alt: "Professional DJ decks and mixing equipment for high-quality sound production" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163197/DJ-Kit-on-Croquet-Lawn_jncfnl.jpg", alt: "Professional DJ kit setup on croquet lawn showcasing quality sound equipment" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163297/Mirjam-and-Ben-1062-1_vy1hgx.jpg", alt: "Professional DJ Nige performing at a wedding, showcasing expert mixing and crowd engagement" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163359/Rich-S-DJ_qxsnht.jpg", alt: "Professional DJ Rich S performing at a luxury venue, showcasing professional DJ services" },
    { src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163392/james-Malin_ovqqnf.jpg", alt: "Professional DJ James H performing at wedding and party events" },
  ], []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163774/Jade-and-Emma-0064_t4shle.jpg"
            alt="Professional DJ and wedding entertainment at Babington House, Somerset"
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
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-32 md:pt-40"
        >
          <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
            <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Blog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Why You Should Use an Experienced, Professional DJ
          </h1>
        </motion.div>
      </section>

      {/* Blog Content */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <div className="text-gray-300 leading-relaxed space-y-6">
                  <p className="text-lg">
                    When planning your wedding or special event, the entertainment you choose can make or break the atmosphere. While it might be tempting to cut costs with a friend&apos;s playlist or an amateur DJ, investing in an experienced, professional DJ is one of the most important decisions you&apos;ll make. Here&apos;s why.
                  </p>

                  <div className="my-8">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg my-6">
                      <BlogImage
                        src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg"
                        alt="Professional DJ setup at Babington House with custom lighting, professional sound equipment, and atmospheric wedding entertainment"
                        images={allImages}
                        index={0}
                      />
                    </div>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">1. Reading the Room</h2>
                    <p className="mb-4">
                      An experienced professional DJ has the ability to read a crowd and adapt in real-time. They understand when to slow things down, when to build energy, and when to play that perfect song that gets everyone on the dance floor. This skill comes from years of experience performing at hundreds of events, understanding different demographics, and knowing how to keep guests engaged throughout the entire evening.
                    </p>
                    <p>
                      A professional DJ can sense the mood of your guests and adjust their set accordingly. They know that what works at 8pm might not work at 11pm, and they have the expertise to transition seamlessly between different musical styles and energy levels.
                    </p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">2. Professional Equipment & Sound Quality</h2>
                    <p className="mb-4">
                      Professional DJs invest in high-quality, reliable equipment that delivers crystal-clear sound. They understand acoustics, know how to set up sound systems properly for different venues, and have backup equipment ready should anything go wrong. This ensures your guests hear every beat, every lyric, and every announcement clearly.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163683/NP-Decks-2_y32tje.jpg"
                          alt="Professional DJ decks and mixing equipment for high-quality sound production"
                          images={allImages}
                          index={1}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163197/DJ-Kit-on-Croquet-Lawn_jncfnl.jpg"
                          alt="Professional DJ kit setup on croquet lawn showcasing quality sound equipment"
                          images={allImages}
                          index={2}
                        />
                      </div>
                    </div>
                    <p>
                      Amateur DJs often use consumer-grade equipment that can fail under pressure, produce poor sound quality, or lack the power needed for larger venues. Professional DJs use industry-standard equipment that&apos;s been tested and proven at countless events.
                    </p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">3. Extensive Music Library & Knowledge</h2>
                    <p className="mb-4">
                      Professional DJs maintain extensive music libraries covering multiple decades and genres. They understand music history, know which songs work well together, and can create seamless transitions that keep the energy flowing. With access to tens of thousands of tracks, they can accommodate any request while maintaining the overall vibe of your event.
                    </p>
                    <p>
                      More importantly, professional DJs have deep knowledge of music across all eras and genres. They can play everything from contemporary hits to classic disco, from indie anthems to R&B, and everything in between. This versatility ensures that all your guests, regardless of age or musical preference, will find something to enjoy.
                    </p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">4. Reliability & Professionalism</h2>
                    <p className="mb-4">
                      When you hire a professional DJ, you&apos;re hiring someone who treats your event as a business commitment. They arrive on time, are properly insured, have backup plans for equipment failures, and conduct themselves professionally throughout the event. They understand the importance of your special day and won&apos;t let you down.
                    </p>
                    <p>
                      Professional DJs also handle the technical aspects seamlessly - from setting up equipment before guests arrive to managing sound levels, coordinating with other vendors, and ensuring everything runs smoothly. They&apos;ve dealt with every possible scenario and know how to handle challenges without disrupting your event.
                    </p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">5. MC Services & Event Coordination</h2>
                    <p className="mb-4">
                      Many professional DJs also offer MC (Master of Ceremonies) services, helping to guide your event timeline, make announcements, and keep everything running on schedule. They can coordinate with your photographer, videographer, and other vendors to ensure key moments happen at the right time.
                    </p>
                    <p>
                      From announcing the first dance to coordinating cake cutting, a professional DJ can help manage the flow of your event, ensuring that all the important moments happen smoothly and your guests know what&apos;s happening next.
                    </p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">6. Custom Playlists & Personalization</h2>
                    <p className="mb-4">
                      Professional DJs work with you before the event to understand your musical preferences, create custom playlists, and incorporate your must-play songs while avoiding your do-not-play list. They can blend your personal favorites with crowd-pleasing hits, creating a unique soundtrack that reflects your style while keeping guests entertained.
                    </p>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg my-6">
                      <BlogImage
                        src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163297/Mirjam-and-Ben-1062-1_vy1hgx.jpg"
                        alt="Professional DJ Nige performing at a wedding, showcasing expert mixing and crowd engagement"
                        images={allImages}
                        index={3}
                      />
                    </div>
                    <p>
                      They also understand how to balance different musical styles throughout the evening - perhaps starting with background music during dinner, transitioning to more upbeat tracks as the evening progresses, and building to a high-energy dance set that keeps the party going until the last song.
                    </p>
                  </div>

                  <div className="my-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">7. Experience with Venues & Logistics</h2>
                    <p className="mb-4">
                      Professional DJs have worked at countless venues and understand the unique challenges each space presents. They know how to work with different acoustics, power requirements, and space limitations. They&apos;ve likely worked at your venue before or similar venues, giving them valuable insight into what works best.
                    </p>
                    <p>
                      They also understand venue rules and restrictions, know how to coordinate with venue staff, and can work within noise restrictions and curfews. This experience ensures that your event runs smoothly without any technical or logistical surprises.
                    </p>
                  </div>

                  <div className="my-8 p-6 bg-gray-800/50 rounded-lg border border-champagne-gold/20">
                    <h2 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-4">The STYLISH Entertainment Difference</h2>
                    <p className="mb-4">
                      At STYLISH Entertainment, our professional DJs bring decades of combined experience to every event. From our resident DJ at Babington House Hotel with over 20 years of experience, to our talented team of DJs who have performed at some of the UK&apos;s most prestigious venues, we understand what it takes to create unforgettable entertainment.
                    </p>
                    <p className="mb-4">
                      Our DJs are not just music selectors - they&apos;re entertainers, crowd readers, and event coordinators who work tirelessly to ensure your special day is everything you dreamed it would be. With extensive music libraries, professional equipment, and a commitment to excellence, our DJs create the perfect soundtrack for your celebration.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163359/Rich-S-DJ_qxsnht.jpg"
                          alt="Professional DJ Rich S performing at a luxury venue, showcasing professional DJ services"
                          images={allImages}
                          index={4}
                        />
                      </div>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <BlogImage
                          src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163392/james-Malin_ovqqnf.jpg"
                          alt="Professional DJ James H performing at wedding and party events"
                          images={allImages}
                          index={5}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-lg mb-4">
                      Your wedding or event is a once-in-a-lifetime celebration. Don&apos;t leave the entertainment to chance. Invest in a professional DJ who will ensure your guests have an unforgettable experience and your special day is everything you imagined.
                    </p>
                    <p className="text-lg">
                      Ready to discuss your event?{" "}
                      <Link href="/contact-us" className="text-champagne-gold hover:text-gold-light underline">
                        Contact us
                      </Link>
                      {" "}to learn more about our professional DJ services, or{" "}
                      <Link href="/artists/djs" className="text-champagne-gold hover:text-gold-light underline">
                        meet our DJs
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
