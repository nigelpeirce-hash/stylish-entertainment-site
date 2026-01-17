"use client";

import { motion } from "framer-motion";
import Gallery, { Photo } from "@/components/Gallery";
import BeforeAfter from "@/components/BeforeAfter";
import { useEffect } from "react";

// Lighting Design Gallery Photos - All normalized to 4:3 aspect ratio
const lightingPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162627/Camilla-Richard-0063_mctrmo.jpg",
    width: 1200,
    height: 900,
    alt: "Wedding reception for Camilla and Richard with professional lighting design, elegant table settings, and ambient lighting at a West Country venue",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163679/IMG_3094-1_aiyu5i.jpg",
    width: 1200,
    height: 900,
    alt: "Elegant wedding reception with sophisticated lighting design creating a warm and romantic atmosphere with ambient mood lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162621/Babington-House-in-Green_oms0ws.jpg",
    width: 1200,
    height: 900,
    alt: "Babington House wedding venue exterior with beautiful green LED mood lighting, showcasing luxury wedding lighting design in Somerset",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163328/Nigel-DJ-Babs-House-0021-1_xmxz8v.jpg",
    width: 1200,
    height: 900,
    alt: "Professional DJ setup by DJ Nige at Babington House with custom lighting, professional sound equipment, and atmospheric wedding entertainment",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto,c_auto,g_auto,h_667,w_1000/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg",
    width: 1200,
    height: 900,
    alt: "Emily and Tom's wedding reception with stunning atmospheric lighting design, captured by Jonny Barratt Photography, creating a magical evening ambiance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162378/Jade-and-Emma-0059-1_wddnet.jpg",
    width: 1200,
    height: 900,
    alt: "Jade and Emma's wedding with elegant dance floor lighting design and romantic ambient lighting creating a beautiful celebration atmosphere",
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
    alt: "Highcliffe Castle wedding with elegant venue styling, professional decoration, and sophisticated wedding design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163745/Pool-Party01_qe5ro0.jpg",
    width: 1200,
    height: 900,
    alt: "Pool party with professional venue styling, creative decorations, and beautiful lighting design",
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
    alt: "Circus themed party tent with creative venue styling, professional decorations, and themed party design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163733/Lost-Orangery_xdaewo.jpg",
    width: 1200,
    height: 900,
    alt: "Lost Orangery venue with elegant styling, professional decoration, and sophisticated wedding design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163723/IMG_6321_xu8q8j.jpg",
    width: 1200,
    height: 900,
    alt: "Professional venue styling with creative decorations and elegant design creating a beautiful celebration atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163716/IMG_1098_hqiw3d.jpg",
    width: 1200,
    height: 900,
    alt: "Outdoor terrace with professional venue styling, festoon lighting, and elegant party decorations",
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
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163716/IMG_1098_hqiw3d.jpg",
      alt: "Venue before transformation - empty space ready for styling and lighting design",
    },
    after: {
      src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163654/IMG_1070_pelq7j.jpg",
      alt: "Venue after transformation - elegant outdoor terrace with professional venue styling, festoon lighting, and beautiful decorations",
    },
  },
];

export default function Galleries() {
  useEffect(() => {
    document.title = "Wedding Galleries | Professional Wedding Lighting & Venue Styling Photos";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Browse our portfolio of professional wedding lighting design and venue styling across the West Country. See our work at prestigious venues in London, Somerset, Bath, Bristol, Dorset, and Devon.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
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

      {/* Lighting Gallery */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-center text-white font-bold px-4">Lighting Design</h2>
            <p className="text-base sm:text-lg text-gray-300 text-center max-w-2xl mx-auto px-4">
              Transform your venue with our professional lighting design
            </p>
          </motion.div>
          <Gallery photos={lightingPhotos} columns={3} />
        </div>
      </section>

      {/* Styling Gallery */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-center text-white font-bold px-4">Venue Styling</h2>
            <p className="text-base sm:text-lg text-gray-300 text-center max-w-2xl mx-auto px-4">
              Elegant styling that reflects your personal vision
            </p>
          </motion.div>
          <Gallery photos={stylingPhotos} columns={2} />
        </div>
      </section>

      {/* Before and After Gallery */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-center text-white font-bold px-4">Before and After</h2>
            <p className="text-base sm:text-lg text-gray-300 text-center max-w-2xl mx-auto px-4">
              See the dramatic transformations we create at venues across the West Country
            </p>
          </motion.div>
          
          <div className="space-y-12">
            {beforeAfterTransforms.map((transform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <BeforeAfter
                  before={transform.before}
                  after={transform.after}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
