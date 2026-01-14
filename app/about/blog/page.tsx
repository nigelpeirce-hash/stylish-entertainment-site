"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import Link from "next/link";

const blogPosts = [
  {
    title: "Why You Should Use an Experienced, Professional DJ",
    slug: "why-you-should-use-an-experienced-professional-dj",
    excerpt: "Discover why hiring an experienced, professional DJ is essential for your wedding or event. Learn about the benefits of professional DJ services over amateur options.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
    alt: "Professional DJ setup with custom lighting and sound equipment",
  },
  {
    title: "Bristol University Spring Ball",
    slug: "bristol-university-spring-ball",
    excerpt: "STYLISH Entertainment designed and implemented lighting and sound for the Bristol University Spring Ball at Kings Weston House, transforming the venue for 750 law students.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg",
    alt: "Bristol University Spring Ball lighting design at Kings Weston House",
  },
  {
    title: "Five Ways to Totally Transform a Venue #1 Lighting",
    slug: "five-ways-to-totally-transform-a-venue-1-lighting",
    excerpt: "Discover how lighting can transform your wedding venue. From fairy lights to LED uplighting, explore creative lighting design ideas from STYLISH Entertainment.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162661/Exterior-LED-mood-Lighting_jjuuar.jpg",
    alt: "Professional wedding lighting design transforming venue atmosphere",
  },
  {
    title: "Five Ways to Totally Transform a Venue #2 Decor",
    slug: "five-ways-to-totally-transform-a-venue-2-decor",
    excerpt: "Discover how decor can transform your wedding venue. From Middle Eastern themes to circus tents, explore creative venue styling ideas from STYLISH Entertainment.",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163738/Circus-Temed-Party-Tent_uizqbq.jpg",
    alt: "Circus tent venue transformation with creative decor styling",
  },
];

export default function Blog() {
  useEffect(() => {
    document.title = "Blog | Wedding & Party Tips | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Read our blog for wedding planning tips, party ideas, lighting inspiration, and entertainment advice from the experts at Stylish Entertainment.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163768/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg"
            alt="Professional wedding lighting and entertainment blog"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Blog</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Wedding tips, party ideas, and entertainment inspiration
          </p>
        </motion.div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/about/blog/${post.slug}`}>
                  <Card className="h-full bg-gray-900 border-champagne-gold/30 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60 group cursor-pointer">
                    <div className="relative h-64 md:h-80 overflow-hidden bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.alt}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <CardContent className="p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-champagne-gold transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="mt-6 text-champagne-gold text-base md:text-lg font-semibold group-hover:underline">
                        Read more →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
