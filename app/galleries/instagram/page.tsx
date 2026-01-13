"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InstagramPost {
  url: string;
  html?: string;
  title?: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Instagram Feed | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Follow our latest work on Instagram. See behind-the-scenes photos, event highlights, and stunning venue transformations from Stylish Entertainment.");
    }

    // Load Instagram embeds
    loadInstagramEmbeds();
  }, []);

  const loadInstagramEmbeds = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
      const userId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

      let instagramPostUrls: string[] = [];

      // Try to fetch posts automatically via Instagram Graph API
      if (accessToken && userId) {
        try {
          const response = await fetch(
            `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&access_token=${accessToken}&limit=20`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              // Extract permalinks from API response
              instagramPostUrls = data.data
                .filter((post: any) => post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM")
                .map((post: any) => post.permalink);
            }
          }
        } catch (apiError) {
          console.log("API fetch failed, using manual URLs:", apiError);
        }
      }

      // Fallback to manual URLs if API didn't work or isn't configured
      if (instagramPostUrls.length === 0) {
        instagramPostUrls = [
          "https://www.instagram.com/p/DS6-lKXjAN2/",
          "https://www.instagram.com/p/DS9v4tRDHAC/",
          "https://www.instagram.com/p/DOu4Y6oDP4i/",
          // Add more Instagram post URLs here manually if needed
        ];
      }

      if (instagramPostUrls.length === 0) {
        setError("No Instagram posts found. Either configure Instagram API credentials or add post URLs manually.");
        setLoading(false);
        return;
      }

      // Fetch oEmbed data for each post (or use direct embed)
      const postsData = await Promise.all(
        instagramPostUrls.map(async (url) => {
          // Use Instagram's native embed format (no API needed)
          return {
            url,
            html: `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"><a href="${url}" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"></a></div></blockquote>`,
          };
        })
      );

      setPosts(postsData);
    } catch (err: any) {
      console.error("Error loading Instagram embeds:", err);
      setError(err.message || "Unable to load Instagram posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Instagram embed script
    if (posts.length > 0) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup
        const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [posts]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768169246/Fairy%20Light%20Tunnel%20at%20Babington%20House.jpg"
            alt="Instagram feed showcasing our work"
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <Instagram className="w-12 h-12 text-champagne-gold" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans text-white font-bold px-4 drop-shadow-lg">Instagram Feed</h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Follow our latest work and behind-the-scenes moments
          </p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              Get a glimpse into our latest events, venue transformations, and behind-the-scenes moments. 
              Follow us on Instagram to see our work in real-time.
            </p>
            <a
              href="https://www.instagram.com/stylishentertainment/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-champagne-gold hover:text-champagne-gold/80 transition-colors font-semibold"
            >
              <Instagram className="w-5 h-5" />
              Follow @stylishentertainment
            </a>
          </motion.div>
        </div>
      </section>

      {/* Instagram Posts Grid */}
      <section className="py-12 md:py-16 bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading Instagram posts...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <Card className="bg-gray-900/50 border-2 border-yellow-500/50 max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <Instagram className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Instagram Feed Setup</h3>
                  <p className="text-gray-300 mb-4">{error}</p>
                  <p className="text-sm text-gray-400 mb-4">
                    To add Instagram posts:
                  </p>
                  <ol className="text-sm text-gray-400 text-left list-decimal list-inside space-y-2 mb-4">
                    <li>Go to your Instagram post</li>
                    <li>Click the three dots (⋯) and select "Copy link"</li>
                    <li>Add the URL to the <code className="bg-gray-800 px-2 py-1 rounded">instagramPostUrls</code> array in the code</li>
                  </ol>
                  <p className="text-sm text-gray-400 mb-4">
                    Example: <code className="bg-gray-800 px-2 py-1 rounded">"https://www.instagram.com/p/ABC123xyz/"</code>
                  </p>
                  <a
                    href="https://www.instagram.com/stylishentertainment/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-champagne-gold hover:text-champagne-gold/80 transition-colors font-semibold"
                  >
                    Visit Instagram Profile →
                  </a>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-champagne-gold mb-4">
                  Latest Posts
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.url}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex justify-center"
                  >
                    <div
                      className="w-full max-w-md"
                      dangerouslySetInnerHTML={{ __html: post.html || '' }}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
