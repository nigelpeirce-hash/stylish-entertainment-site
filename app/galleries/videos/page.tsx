"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LazyIframe from "@/components/LazyIframe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

interface Playlist {
  id: string;
  title: string;
  description?: string;
  videos: Video[];
}

// Fallback playlists if API is not available
const fallbackPlaylists: Playlist[] = [
  {
    id: "PL_EXAMPLE_1",
    title: "Wedding Lighting",
    description: "Beautiful wedding lighting installations and designs",
    videos: [
      {
        id: "sDXBCwhMMkM",
        title: "LED Furniture & Fire Pits",
        description: "Stylish LED furniture and fire pit installations for weddings",
      },
      {
        id: "47yP9a9lEg8",
        title: "Venue Transformation",
        description: "See how we transform venues with lighting and styling",
      },
    ],
  },
  {
    id: "PL_EXAMPLE_2",
    title: "Party Entertainment",
    description: "DJ sets and party entertainment highlights",
    videos: [
      {
        id: "Nmc1Y_pzWbE",
        title: "Circus Tent Party",
        description: "Themed party with circus tent lighting and entertainment",
      },
    ],
  },
];

export default function Videos() {
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>(fallbackPlaylists);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Video Gallery | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Watch our video gallery showcasing wedding lighting design, party entertainment, DJ sets and event production across the UK.");
    }

    // Fetch videos from YouTube API if available
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "@stylishentertainment937";

    if (apiKey && apiKey !== "YOUR_YOUTUBE_API_KEY" && apiKey.length > 10) {
      fetchYouTubeData(apiKey, channelId);
    } else {
      // Show helpful message in development
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ YouTube API Key not configured. Using fallback videos.");
        console.warn("To enable YouTube videos, add NEXT_PUBLIC_YOUTUBE_API_KEY to .env.local");
        console.warn("See YOUTUBE_API_SETUP.md for instructions");
      }
      // Use fallback data
      const videos = fallbackPlaylists.flatMap((playlist) => playlist.videos);
      setAllVideos(videos);
      setPlaylists(fallbackPlaylists);
      setLoading(false);
      // Set a helpful error message for users
      setError("YouTube API not configured. Showing sample videos. Contact admin to enable full video gallery.");
    }
  }, []);

  const fetchYouTubeData = async (apiKey: string, channelId: string) => {
    try {
      setLoading(true);
      
      // Convert @username/handle to channel ID if needed
      let actualChannelId = channelId;
      if (channelId.startsWith("@")) {
        // For @handle format, try multiple methods to get the channel ID
        const handle = channelId.replace("@", "");
        let found = false;
        let lastError: string | null = null;
        
        // Method 1: Try using channels.list with forHandle (newer API feature - available in some API versions)
        try {
          const channelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handle}&key=${apiKey}`
          );
          
          if (channelResponse.ok) {
            const channelData = await channelResponse.json();
            if (channelData.items && channelData.items.length > 0) {
              actualChannelId = channelData.items[0].id;
              console.log(`Found channel ID via forHandle: ${actualChannelId}`);
              found = true;
            } else {
              lastError = "Channel not found with forHandle parameter";
            }
          } else {
            const errorData = await channelResponse.json().catch(() => ({}));
            const errorMessage = errorData?.error?.message || 'Unknown error';
            
            // Check if API key is invalid
            if (channelResponse.status === 400 && errorMessage.includes('API key not valid')) {
              throw new Error(`Invalid API key. Please check your API key and ensure YouTube Data API v3 is enabled in Google Cloud Console. See YOUTUBE_LIVE_TROUBLESHOOTING.md`);
            }
            
            lastError = `forHandle API returned ${channelResponse.status}: ${errorMessage}`;
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes('Invalid API key')) {
            throw e; // Re-throw API key errors immediately
          }
          lastError = `forHandle method failed: ${e instanceof Error ? e.message : 'Unknown error'}`;
          console.warn("forHandle method failed, trying alternatives:", e);
        }
        
        // Method 2: Try using the handle directly in playlists endpoint
        // Some API versions accept handles directly
        if (!found) {
          try {
            const testResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=1&key=${apiKey}`
            );
            if (testResponse.ok) {
              const testData = await testResponse.json();
              // If we get a valid response (even if empty), the handle works
              actualChannelId = channelId;
              console.log(`Using handle directly: ${actualChannelId}`);
              found = true;
            } else {
              const errorData = await testResponse.json().catch(() => ({}));
              const errorMessage = errorData?.error?.message || 'Unknown error';
              
              // Check if API key is invalid
              if (testResponse.status === 400 && errorMessage.includes('API key not valid')) {
                throw new Error(`Invalid API key. Please check your API key and ensure YouTube Data API v3 is enabled in Google Cloud Console. See YOUTUBE_LIVE_TROUBLESHOOTING.md`);
              }
              
              lastError = `Direct handle test returned ${testResponse.status}: ${errorMessage}`;
            }
          } catch (e) {
            if (e instanceof Error && e.message.includes('Invalid API key')) {
              throw e; // Re-throw API key errors immediately
            }
            lastError = `Direct handle method failed: ${e instanceof Error ? e.message : 'Unknown error'}`;
            console.warn("Direct handle method failed:", e);
          }
        }
        
        if (!found) {
          // Provide helpful error message with instructions
          const errorMsg = `Unable to resolve channel handle ${channelId}. ${lastError || 'All methods failed.'}\n\n` +
            `To fix this:\n` +
            `1. Get your actual Channel ID from: https://www.youtube.com/@${handle}/about\n` +
            `2. Or use this tool: https://commentpicker.com/youtube-channel-id.php\n` +
            `3. Set NEXT_PUBLIC_YOUTUBE_CHANNEL_ID to the Channel ID (starts with UC...) instead of the handle.\n` +
            `4. Make sure YouTube Data API v3 is enabled in Google Cloud Console.`;
          
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
      }

      // Fetch playlists using the actual channel ID
      const playlistsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${actualChannelId}&maxResults=50&key=${apiKey}`
      );

      if (!playlistsResponse.ok) {
        const errorData = await playlistsResponse.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || playlistsResponse.statusText;
        console.error(`YouTube API Error (${playlistsResponse.status}):`, errorMessage);
        
        if (playlistsResponse.status === 400 && errorMessage.includes('API key not valid')) {
          throw new Error(`Invalid API key. Please check: 1) Your API key is correct, 2) YouTube Data API v3 is enabled in Google Cloud Console, 3) API key restrictions allow your domain (e.g. stylishentertainment.co.uk). See YOUTUBE_LIVE_TROUBLESHOOTING.md`);
        }
        
        if (playlistsResponse.status === 403) {
          throw new Error(`API key error (403). Add your live domain (https://www.stylishentertainment.co.uk/*) to HTTP referrer restrictions in Google Cloud Console. See YOUTUBE_LIVE_TROUBLESHOOTING.md`);
        }
        
        throw new Error(`Failed to fetch playlists (${playlistsResponse.status}): ${errorMessage}`);
      }

      const playlistsData = await playlistsResponse.json();
      
      // Fetch videos for each playlist
      const playlistsWithVideos: Playlist[] = await Promise.all(
        playlistsData.items.map(async (playlist: any) => {
          const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist.id}&maxResults=50&key=${apiKey}`
          );
          
          if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            const videos: Video[] = videosData.items.map((item: any) => ({
              id: item.snippet.resourceId.videoId,
              title: item.snippet.title,
              description: item.snippet.description?.substring(0, 150) || "",
              thumbnail: item.snippet.thumbnails?.high?.url || "",
            }));
            
            return {
              id: playlist.id,
              title: playlist.snippet.title,
              description: playlist.snippet.description?.substring(0, 200) || "",
              videos,
            };
          }
          
          return {
            id: playlist.id,
            title: playlist.snippet.title,
            description: playlist.snippet.description?.substring(0, 200) || "",
            videos: [],
          };
        })
      );

      // Sort playlists: "Zoom parties" should be at the bottom, below "entertainment"
      const sortedPlaylists = [...playlistsWithVideos].sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        const aIsZoom = aTitle.includes("zoom parties") || aTitle.includes("zoom party");
        const bIsZoom = bTitle.includes("zoom parties") || bTitle.includes("zoom party");
        const aIsEntertainment = aTitle.includes("entertainment");
        const bIsEntertainment = bTitle.includes("entertainment");
        
        // Priority: Zoom parties (3) > Entertainment (2) > Others (1)
        const getPriority = (isZoom: boolean, isEntertainment: boolean) => {
          if (isZoom) return 3;
          if (isEntertainment) return 2;
          return 1;
        };
        
        const aPriority = getPriority(aIsZoom, aIsEntertainment);
        const bPriority = getPriority(bIsZoom, bIsEntertainment);
        
        return aPriority - bPriority;
      });
      
      setPlaylists(sortedPlaylists);
      // Deduplicate videos by ID to prevent duplicate keys
      const allVids = sortedPlaylists.flatMap((p) => p.videos);
      const uniqueVideos = Array.from(
        new Map(allVids.map((video) => [video.id, video])).values()
      );
      console.log(`Successfully loaded ${uniqueVideos.length} unique videos from ${allVids.length} total videos across ${sortedPlaylists.length} playlists`);
      setAllVideos(uniqueVideos);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching YouTube data:", err);
      const errorMessage = err?.message || "Unknown error";
      setError(`Unable to load videos from YouTube: ${errorMessage}. Using fallback content.`);
      console.error("Full error details:", err);
      // Use fallback data on error
      const videos = fallbackPlaylists.flatMap((playlist) => playlist.videos);
      setAllVideos(videos);
      setPlaylists(fallbackPlaylists);
    } finally {
      setLoading(false);
    }
  };

  const togglePlaylist = (playlistId: string) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto/v1768163683/NP-Decks-2_y32tje.jpg"
            alt="Video gallery showcasing our work - Professional DJ performance and entertainment"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Video Gallery</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Watch our work in action
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
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Explore our video collection showcasing stunning wedding lighting designs, party entertainment, 
              DJ performances and event production across the UK. From elegant fairy light installations 
              to energetic dance floor moments, see how we bring extraordinary celebrations to life.
            </p>
            <div className="mt-6">
              <a
                href="https://www.youtube.com/@stylishentertainment937/playlists"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-champagne-gold hover:text-champagne-gold/80 transition-colors font-semibold"
              >
                Visit our YouTube Channel
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Playlists */}
      <section className="py-12 md:py-16 bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-champagne-gold mb-4">
              Video Playlists
            </h2>
            <p className="text-lg text-gray-300">
              Browse our videos organised by category
            </p>
            {error && (
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mt-4">
                <p className="text-yellow-400 text-sm">{error}</p>
                {process.env.NODE_ENV === "development" && (
                  <p className="text-yellow-300 text-xs mt-2">
                    Check browser console for details. Add NEXT_PUBLIC_YOUTUBE_API_KEY to .env.local to enable YouTube videos.
                  </p>
                )}
              </div>
            )}
            {loading && (
              <p className="text-gray-400 text-sm mt-2">Loading videos...</p>
            )}
          </motion.div>

          <div className="space-y-8">
            {playlists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-2 border-champagne-gold/20 hover:border-champagne-gold/40 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl md:text-2xl text-white mb-2">
                          {playlist.title}
                        </CardTitle>
                        {playlist.description && (
                          <p className="text-gray-300">{playlist.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => togglePlaylist(playlist.id)}
                        className="px-4 py-2 bg-champagne-gold/20 hover:bg-champagne-gold/30 text-champagne-gold rounded-lg transition-colors font-semibold"
                      >
                        {expandedPlaylist === playlist.id ? "Hide" : `Show ${playlist.videos.length} Videos`}
                      </button>
                    </div>
                  </CardHeader>
                  {expandedPlaylist === playlist.id && (
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {playlist.videos.map((video, videoIndex) => (
                          <div key={`${playlist.id}-${video.id}-${videoIndex}`} className="space-y-2">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                              <LazyIframe
                                src={`https://www.youtube.com/embed/${video.id}?vq=hd1080`}
                                title={video.title}
                                className="w-full h-full relative"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ aspectRatio: '16/9' }}
                              />
                            </div>
                            <h3 className="text-white font-semibold text-sm md:text-base">
                              {video.title}
                            </h3>
                            {video.description && (
                              <p className="text-gray-400 text-xs md:text-sm">
                                {video.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Videos Section */}
      {allVideos.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-champagne-gold mb-4">
                All Videos
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allVideos.map((video, index) => (
                <motion.div
                  key={`all-videos-${video.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                    <LazyIframe
                      src={`https://www.youtube.com/embed/${video.id}?vq=hd1080`}
                      title={video.title}
                      className="w-full h-full relative"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ aspectRatio: '16/9' }}
                    />
                  </div>
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-gray-400 text-xs md:text-sm">
                      {video.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 rounded-lg p-8 md:p-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-champagne-gold mb-4">
              Want to See More?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Subscribe to our YouTube channel to see the latest videos and behind-the-scenes content 
              from our events across the West Country.
            </p>
            <a
              href="https://www.youtube.com/@stylishentertainment937"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-champagne-gold hover:bg-champagne-gold/80 text-gray-900 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Subscribe on YouTube
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
