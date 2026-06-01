"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "@/lib/motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  BROWSE_TOPICS,
  FEATURED_GUIDE,
  type BlogCategory,
} from "@/data/blog";

const chipClass = (active: boolean) =>
  `min-h-[40px] inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
    active
      ? "bg-champagne-gold/20 border-2 border-champagne-gold text-champagne-gold shadow-[0_0_15px_rgba(212,175,55,0.25)]"
      : "bg-white/5 border border-champagne-gold/30 text-gray-300 hover:bg-white/10 hover:border-champagne-gold/50"
  }`;

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">("All");

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return BLOG_POSTS;
    return BLOG_POSTS.filter((post) => post.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = "Ideas & Inspiration | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Real events, venue guides, wedding entertainment and lighting advice from more than twenty years of weddings, private parties and celebrations."
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163768/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg"
            alt="Professional wedding lighting and entertainment"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: "center center" }}
            priority
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52 pb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Ideas &amp; Inspiration
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 font-semibold px-4 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
            Real events, venue guides, planning advice and inspiration from more than twenty years
            of weddings, parties and celebrations.
          </p>
        </motion.div>
      </section>

      <section className="py-16 md:py-20 px-3 sm:px-4 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-6xl space-y-16 md:space-y-20">
          {/* Category navigation */}
          <nav aria-label="Article categories">
            <p className="text-center text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-4">
              Browse by category
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button type="button" onClick={() => setActiveCategory("All")} className={chipClass(activeCategory === "All")}>
                All
              </button>
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={chipClass(activeCategory === category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>

          {/* Featured guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-4">
              Featured Article
            </p>
            <Link href={FEATURED_GUIDE.href} className="group block">
              <Card className="overflow-hidden bg-gray-900 border-2 border-champagne-gold/40 hover:border-champagne-gold/60 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto min-h-[16rem]">
                    <Image
                      src={FEATURED_GUIDE.image}
                      alt={FEATURED_GUIDE.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  <CardContent className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                    <span className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-3">
                      {FEATURED_GUIDE.label}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-champagne-gold transition-colors">
                      {FEATURED_GUIDE.title}
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">{FEATURED_GUIDE.excerpt}</p>
                    <span className="inline-flex items-center text-champagne-gold font-semibold group-hover:underline">
                      Read the Babington guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>

          {/* Browse by topic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
              Browse By Topic
            </h2>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Jump to service pages and articles by what you are planning — wedding entertainment,
              lighting, styling, parties or corporate events.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BROWSE_TOPICS.map((topic) => (
                <Link
                  key={topic.title}
                  href={topic.href}
                  className="group block p-5 rounded-xl bg-gray-900/80 border border-champagne-gold/20 hover:border-champagne-gold/50 transition-colors h-full"
                >
                  <h3 className="text-lg font-bold text-champagne-gold mb-2 group-hover:text-gold-light">
                    {topic.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{topic.description}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Why read our advice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-900/80 border border-champagne-gold/25">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Why Read Our Advice?
                </h2>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg max-w-3xl">
                  Babington House since 2003, hundreds of weddings and celebrations since, and a
                  small team still doing the work on the night. What we write here comes from
                  real rooms, real timelines and real problems solved — practical planning notes,
                  not trend-chasing or content for its own sake.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* All articles */}
          <div id="all-articles">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">All Articles</h2>
                <p className="text-gray-400">
                  {activeCategory === "All"
                    ? "Every post in the archive"
                    : `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? "article" : "articles"} · ${activeCategory}`}
                </p>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <p className="text-gray-400 text-center py-12">
                No articles in this category yet — try another topic or explore{" "}
                <Link href="/about/blog/" className="text-champagne-gold hover:underline">
                  all articles
                </Link>
                .
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link href={`/about/blog/${post.slug}/`}>
                      <Card className="h-full bg-gray-900 border-champagne-gold/30 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60 group cursor-pointer">
                        <div className="relative h-56 md:h-64 overflow-hidden bg-gray-100">
                          <Image
                            src={post.image}
                            alt={post.alt}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-black/70 text-champagne-gold border border-champagne-gold/30">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-6 md:p-8">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-champagne-gold transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-4">
                            {post.excerpt}
                          </p>
                          <div className="mt-5 text-champagne-gold text-sm md:text-base font-semibold group-hover:underline">
                            Read article →
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
