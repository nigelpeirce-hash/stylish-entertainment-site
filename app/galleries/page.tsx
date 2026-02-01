"use client";

import { motion, AnimatePresence } from "framer-motion";
import Gallery, { Photo } from "@/components/Gallery";
import BeforeAfter from "@/components/BeforeAfter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import LazyIframe from "@/components/LazyIframe";
import { useEffect, useState } from "react";

// Lighting Design Gallery Photos - All normalized to 4:3 aspect ratio
const lightingPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant wedding reception with sophisticated lighting design creating a warm and romantic atmosphere with ambient mood lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733254/Babington-House-in-Green_oms0ws.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House wedding venue exterior with beautiful green LED mood lighting, showcasing luxury wedding lighting design in Somerset",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg",
    width: 1200,
    height: 900,
    alt: "Emily and Tom's wedding reception with stunning atmospheric lighting design, captured by Jonny Barratt Photography, creating a magical evening ambiance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768751155/IMG_3188_zviff5.jpg",
    width: 1200,
    height: 900,
    alt: "Professional lighting design transformation creating a stunning venue atmosphere with elegant lighting effects",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742320/IMG_1871_161201_n88x5z.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant wedding lighting design with sophisticated ambient lighting creating a romantic atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742094/IMG_4162_h3h0bb.jpg",
    width: 1200,
    height: 900,
    alt: "Professional wedding lighting design with atmospheric mood lighting and elegant venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768749164/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg",
    width: 1200,
    height: 900,
    alt: "Professional wedding photography showcasing elegant lighting design and venue transformation",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg",
    width: 1200,
    height: 900,
    alt: "Pennard House with beautiful festoon lighting creating an elegant outdoor dining atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    width: 1200,
    height: 900,
    alt: "Stretch marquee with professional lighting design and festoon lights creating a warm evening atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163522/Orangery-day-e1642527408215_bqpzoh.jpg",
    width: 1200,
    height: 900,
    alt: "Orangery venue with elegant lighting design creating a sophisticated daytime and evening atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163506/DJ-Nige-white-dance-floor-lighting_kigdwb.jpg",
    width: 1200,
    height: 900,
    alt: "Professional dance floor lighting design with white LED effects creating a vibrant party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163502/Wick-Farm-Bath_svdu14.jpg",
    width: 1200,
    height: 900,
    alt: "Wick Farm in Bath with professional lighting design showcasing elegant venue transformation",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163527/Festoon-and-Shades_yjg7ps.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant festoon lighting with decorative shades creating a sophisticated outdoor party atmosphere",
  },
];

const stylingPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163340/IMG_1348_161201_owwllt.jpg",
    width: 1200,
    height: 900,
    alt: "Professional venue styling with elegant decorations and creative design creating a sophisticated wedding atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw",
    width: 1200,
    height: 900,
    alt: "Fairy light tunnel at Babington House creating a magical entrance with professional venue styling and lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163815/Highcliffe-Castle-Wedding-2-web_pgsbaa.jpg",
    width: 1200,
    height: 900,
    alt: "Highcliffe Castle wedding with elegant venue styling, professional decoration and sophisticated wedding design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party with professional venue styling, creative decorations and beautiful lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163744/430_lzn5ns.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant venue styling with professional decorations and creative design elements creating a sophisticated event atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163738/Circus-Temed-Party-Tent_uizqbq.jpg",
    width: 1200,
    height: 900,
    alt: "Circus themed party tent with creative venue styling, professional decorations and themed party design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163733/Lost-Orangery_xdaewo.jpg",
    width: 1200,
    height: 900,
    alt: "Lost Orangery venue with elegant styling, professional decoration and sophisticated wedding design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163716/IMG_1098_hqiw3d.jpg",
    width: 1200,
    height: 900,
    alt: "Outdoor terrace with professional venue styling, festoon lighting and elegant party decorations",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163714/IMG_2321-1_mh4e6d.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant venue styling with professional decorations and creative design elements for weddings and parties",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163708/LED-furniture_im8hda.jpg",
    width: 1200,
    height: 900,
    alt: "LED furniture and creative venue styling with modern lighting design creating a unique party atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163684/IMG_2731_yk0kmb.jpg",
    width: 1200,
    height: 900,
    alt: "Professional venue styling with elegant decorations and sophisticated design creating a beautiful event atmosphere",
  },
];

// Before and After transformations
const beforeAfterTransforms = [
  {
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163654/IMG_1070_pelq7j.jpg",
      alt: "Venue before transformation - empty space ready for styling and lighting design",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163716/IMG_1098_hqiw3d.jpg",
      alt: "Venue after transformation - elegant outdoor terrace with professional venue styling, festoon lighting and beautiful decorations",
    },
  },
  {
    before: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768753000/IMG_2530_njx41m.jpg",
      alt: "Venue before transformation - empty space ready for fun and creative styling",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768751155/IMG_3188_zviff5.jpg",
      alt: "Venue after transformation - fun and creative party styling with vibrant decorations and lighting design",
    },
  },
];

// Animation variants for stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth "pop"
    },
  },
};

export default function Galleries() {
  const [activeTab, setActiveTab] = useState("lighting");
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    document.title = "Wedding Galleries | Professional Wedding Lighting & Venue Styling Photos";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Browse our portfolio of professional wedding lighting design and venue styling across the UK. See our work at prestigious venues.");
    }

    // Calculate columns based on screen size
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    window.addEventListener('orientationchange', updateColumns); // Ensure columns recalc on iPhone rotation
    return () => {
      window.removeEventListener('resize', updateColumns);
      window.removeEventListener('orientationchange', updateColumns);
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] min-h-60dvh flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw"
            alt="Enchanting fairy light tunnel at Babington House showcasing our wedding lighting design"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Galleries</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Explore our portfolio of exceptional weddings
          </p>
        </motion.div>
      </section>

      {/* Featured: Before and After – up top as a feature */}
      <section className="py-16 md:py-20 px-3 sm:px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl lg:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-14 text-center"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Featured</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-3 text-white font-bold">Before and After</h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              See the dramatic transformations we create at venues in the South West and beyond
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-8 md:mb-10">
            {beforeAfterTransforms.map((transform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-800/50 backdrop-blur-sm border-2 border-champagne-gold/30 shadow-xl overflow-hidden hover:border-champagne-gold/60 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <BeforeAfter before={transform.before} after={transform.after} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {/* Video Transformation – wider container so YouTube serves HD (720p+ needs ~1090px+) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl md:max-w-6xl lg:max-w-7xl mx-auto"
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-2 border-champagne-gold/30 shadow-xl overflow-hidden hover:border-champagne-gold/60 transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 text-center">
                  Fun & Creative Transformations
                </h3>
                <p className="text-sm text-gray-300 text-center mb-4">
                  Watch how we transform spaces with fun and creative styling
                </p>
                <div className="relative w-full aspect-[9/16] sm:aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-lg">
                  <LazyIframe
                    src="https://www.youtube.com/embed/47yP9a9lEg8?vq=hd1080"
                    title="Venue transformation and fun styling example - Stylish Entertainment"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Gallery Section with Tabs */}
      <section className="py-12 md:py-20 px-3 sm:px-4 bg-gray-800 relative">
        <div className="container mx-auto max-w-7xl">
          {/* Tab Navigation and Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Sticky Tab Navigation */}
            <div className="sticky top-20 z-20 mb-8 md:mb-12">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center"
              >
                <TabsList className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-md border-2 border-champagne-gold/30 shadow-xl">
                  <TabsTrigger 
                    value="lighting" 
                    className="flex-1 text-base md:text-lg font-semibold py-3 px-6"
                  >
                    Lighting Design
                  </TabsTrigger>
                  <TabsTrigger 
                    value="styling" 
                    className="flex-1 text-base md:text-lg font-semibold py-3 px-6"
                  >
                    Venue Styling
                  </TabsTrigger>
                </TabsList>
              </motion.div>
            </div>

            {/* Tab Content with Stagger Animation */}
            <AnimatePresence mode="wait">
              {activeTab === "lighting" && (
                <motion.div
                  key="lighting-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="lighting" className="mt-0">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-8 md:mb-12 text-center"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-sans mb-3 text-white font-bold"
                      >
                        Lighting Design
                      </motion.h2>
                      <motion.p 
                        variants={itemVariants}
                        className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto"
                      >
                        Transform your venue with our professional lighting design
                      </motion.p>
                    </motion.div>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Gallery photos={lightingPhotos} columns={columns} />
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === "styling" && (
                <motion.div
                  key="styling-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="styling" className="mt-0">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-8 md:mb-12 text-center"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-sans mb-3 text-white font-bold"
                      >
                        Venue Styling
                      </motion.h2>
                      <motion.p 
                        variants={itemVariants}
                        className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto"
                      >
                        Elegant styling that reflects your personal vision. We offer fun as well.
                      </motion.p>
                    </motion.div>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Gallery photos={stylingPhotos} columns={columns < 3 ? columns : 2} />
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
