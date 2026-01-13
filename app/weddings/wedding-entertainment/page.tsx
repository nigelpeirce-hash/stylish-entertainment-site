"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Gallery, { Photo } from "@/components/Gallery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LazyIframe from "@/components/LazyIframe";

// DJ data with embeds
const djs = [
  {
    name: "DJ Nige",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163297/Mirjam-and-Ben-1062-1_vy1hgx.jpg",
    alt: "DJ Nige performing at Mirjam and Ben's wedding at Babington House, Somerset, showcasing professional wedding DJ services with elegant lighting",
    mixingStyle: "Seamless Mixing",
    genres: ["House", "Disco", "Soul", "Funk", "Pop", "Ibiza", "R&B"],
    bio: "Over 20 years as resident DJ at Babington House Hotel, Nige brings sophistication and energy to every event.",
    fullBio: `DJ Nige started his DJ career at the age of 14, honing his skills at local parties and events before entering into the wider world of London's radio, music, and advertising industries. Throughout his career, DJ Nige has established himself as a highly talented and sought-after producer & DJ, with highlights including producing for Pete Tong's Essential Selection on Radio 1, playing as a resident DJ at Babington House Hotel in Somerset for 20 years, and entertaining crowds at the Glastonbury Festival as backstage DJ at the Pyramid stage.`,
    youtubeEmbed: "https://www.youtube.com/embed/RAdejWBYWaw?si=4-GnDsRvsG4ZpYio",
    mixcloudEmbeds: [
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fnigelpeirce1%2Fbabington-nye-part-1%2F",
    ],
  },
  {
    name: "DJ Rich",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163359/Rich-S-DJ_qxsnht.jpg",
    alt: "Professional wedding DJ Rich S performing at a luxury London venue, showcasing professional DJ services with high-quality sound and lighting",
    mixingStyle: "Eclectic Blend",
    genres: ["Indie", "Alternative", "Electronic", "Pop"],
    bio: "Rich curates unique sets that reflect your personal style, creating unforgettable moments.",
    fullBio: "Rich curates unique sets that reflect your personal style, creating unforgettable moments. With an eclectic taste in music and a talent for blending genres seamlessly, DJ Rich brings a fresh and modern approach to wedding entertainment.",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mixcloudEmbeds: [],
  },
  {
    name: "James H DJ",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163730/James-Hudson-DJ_qnenph.png",
    alt: "Professional DJ James H Hudson performing at wedding and party events, showcasing professional DJ services with expert mixing and entertainment",
    mixingStyle: "Classic Elegance",
    genres: ["Jazz", "Swing", "Soul", "R&B"],
    bio: "Experienced, festival, wedding and party DJ.",
    fullBio: "James H DJ is an experienced DJ specializing in festivals, weddings and parties. With a deep appreciation for the classics and a sophisticated understanding of musical history, James brings a refined and elegant touch to every celebration. His expertise in jazz, swing, soul, and R&B allows him to create a sophisticated ambiance that complements any event style. James has spent years perfecting his craft, studying the greats and understanding how music can enhance the emotional journey of any occasion. From intimate moments to lively celebrations, James ensures that every song is perfectly timed and beautifully executed. His commitment to quality and his passion for music shine through in every performance, making him the perfect choice for events that value sophistication and timeless elegance.",
    youtubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    mixcloudEmbeds: [],
  },
];

const musicianPhotos: Photo[] = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163609/Harpist_rtzc74.jpg",
    width: 1200,
    height: 900,
    alt: "Professional harpist performing at a wedding ceremony, creating elegant and romantic musical atmosphere",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163839/Jade-and-Emma-0062_fz8ujk.jpg",
    width: 1200,
    height: 900,
    alt: "Jade and Emma's wedding with live musicians performing, showcasing professional wedding entertainment with saxophone and percussion",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163730/Cuban-Brothers-at-Private-Party_iuletb.jpg",
    width: 1200,
    height: 900,
    alt: "The Cuban Brothers performing at a private party, showcasing vibrant live wedding entertainment with energetic musical performance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163688/Nigel-DJ-Babs-House-0008-1_ol2gkr.jpg",
    width: 1200,
    height: 900,
    alt: "DJ Nige performing at Babington House with live musicians, showcasing professional wedding entertainment with DJ, saxophone and percussion",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163656/IMG_3148_owtb29.jpg",
    width: 1200,
    height: 900,
    alt: "Live musicians performing at a wedding reception, showcasing professional wedding entertainment with saxophone and percussion",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163624/The-Cocktail-Trio_mxawmy.jpg",
    width: 1200,
    height: 900,
    alt: "The Cocktail Trio performing at a wedding, showcasing elegant live wedding entertainment with sophisticated musical performance",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163537/incognito_wyoqx5.jpg",
    width: 1200,
    height: 900,
    alt: "Incognito performing at a wedding event, showcasing professional live wedding entertainment with talented musicians",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163484/IMG_1019_arczyx.jpg",
    width: 1200,
    height: 900,
    alt: "Live musicians performing at a wedding celebration, showcasing professional wedding entertainment with talented performers",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163510/The-Travelling-Hands_fmhulk.png",
    width: 1200,
    height: 900,
    alt: "The Travelling Hands performing at a wedding, showcasing unique live wedding entertainment with talented musicians",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163469/steelband_tq5oip.jpg",
    width: 1200,
    height: 900,
    alt: "Steel band performing at a wedding celebration, showcasing vibrant live wedding entertainment with Caribbean musical style",
  },
];

export default function WeddingEntertainment() {
  useEffect(() => {
    document.title = "Wedding Entertainment | Professional Wedding DJs & Musicians | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Professional wedding entertainment including DJs with sax and bongos, creative lighting, and fire pits. Trusted by venues including Babington House since 2003.");
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163781/Emma-Conrad-2-9-23-682_utvftj.jpg"
            alt="Emma and Conrad's wedding with professional entertainment, elegant lighting design, and beautiful wedding atmosphere captured by The Falkenburgs Photography"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Wedding Entertainment</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Creating amazing memories with entertainment, styling and production
          </p>
        </motion.div>
      </section>

      {/* Text Under Hero */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              Congratulations, you are getting married, we love weddings and create many amazing memories every year with our entertainment, styling and production. You can book a creative and highly experienced DJ with Sax and Bongos or, creative lighting for your home or wedding venue.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              We also offer Fire-pits for hire – every wedding needs one whatever the time of year.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              We are trusted by many venues one of them being <a href="https://www.babingtonhouse.co.uk" target="_blank" rel="noopener noreferrer" className="text-champagne-gold hover:text-gold-light underline">Babington House</a> where we have been a supplier since 2003.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              You want everything to be perfect – from the venue, food and entertainment – to your guests saying it's the best wedding they have ever been to.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed font-semibold text-champagne-gold">
              We can help you with that.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed">
              We offer a range of services for STYLISH weddings including entertainment and creative lighting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wedding DJs Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/20">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Entertainment</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Wedding <span className="text-gradient">DJs</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Choose from our talented DJs, each bringing their unique style and expertise
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <Slider>
              {djs.map((dj, index) => (
                <div key={dj.name} className="px-4">
                  <Card className="bg-gradient-to-br from-white to-gray-50/30 border-2 border-champagne-gold/40 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-champagne-gold/60 group">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:items-stretch">
                      {/* Image Section */}
                      <div className="relative h-64 lg:h-auto overflow-hidden bg-gray-900 flex items-center justify-center">
                        {dj.image ? (
                          <>
                            <img
                              src={dj.image}
                              alt={dj.alt}
                              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                              style={{ objectPosition: 'center center' }}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                console.error('Image failed to load:', dj.image);
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                // Show fallback
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 flex-col gap-2">
                              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm text-center px-4">{dj.name}</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                            <span>Image not available</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Bio Section */}
                      <CardHeader className="p-4 sm:p-6 md:p-6 lg:p-8 bg-gray-800/50 backdrop-blur-sm flex flex-col justify-start">
                        <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 text-white font-bold">{dj.name}</CardTitle>
                        <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed">{dj.bio}</p>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto mb-4 border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-black transition-all duration-300 font-semibold"
                            >
                              Read More
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-3xl md:text-4xl text-white font-bold mb-4">
                                {dj.name}
                              </DialogTitle>
                              <DialogDescription className="text-base sm:text-lg text-gray-100 leading-relaxed">
                                <p className="mb-4 leading-relaxed text-gray-100">
                                  {dj.fullBio}
                                </p>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>

                        <div className="mt-4">
                          <p className="text-xs sm:text-sm text-gray-400 mb-2">Mixing Style:</p>
                          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-champagne-gold/20 to-yellow-400/20 text-champagne-gold rounded-full text-xs sm:text-sm font-semibold border border-champagne-gold/40">
                            {dj.mixingStyle}
                          </span>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs sm:text-sm text-gray-400 mb-2">Genre Specialties:</p>
                          <div className="flex flex-wrap gap-2">
                            {dj.genres.map((genre) => (
                              <span
                                key={genre}
                                className="px-2 py-1 bg-gray-700/50 text-gray-200 rounded text-xs border border-gray-600"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardHeader>

                      {/* Embeds Section */}
                      <div className="p-4 sm:p-6 bg-gray-800/30 backdrop-blur-sm flex flex-col gap-4">
                        {dj.youtubeEmbed && (
                          <div className="mb-4">
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">YouTube</h4>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
                              <LazyIframe
                                src={dj.youtubeEmbed}
                                title={`${dj.name} YouTube Video`}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                                height="100%"
                              />
                            </div>
                          </div>
                        )}
                        
                        {dj.mixcloudEmbeds && dj.mixcloudEmbeds.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Mixcloud</h4>
                            <div className="space-y-3">
                              {dj.mixcloudEmbeds.map((embed, idx) => (
                                <div key={idx} className="relative w-full" style={{ height: '120px' }}>
                                  <LazyIframe
                                    src={embed}
                                    title={`${dj.name} Mixcloud Mix ${idx + 1}`}
                                    className="absolute inset-0 w-full h-full rounded-lg overflow-hidden"
                                    frameBorder="0"
                                    height="120px"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Musicians Section */}
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
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Live Music</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Musicians
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Elevate your wedding with our talented musicians and live performers
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <Gallery photos={musicianPhotos} columns={3} />
          </div>
        </div>
      </section>

      {/* Text Block Below Gallery */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              When it comes to your wedding day, entrusting it to a seasoned and trusted wedding supplier with years of experience and knowledge is paramount. Our wealth of expertise not only ensures seamless execution but also brings invaluable insights and solutions to any challenges that may arise.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              From understanding the intricacies of various venues to anticipating and addressing potential issues before they arise, experienced suppliers offer a level of assurance and professionalism that can truly elevate your wedding experience.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
              With our extensive network of industry connections and finely-honed skills, we have the ability to turn your dreams into a breathtaking reality, creating moments that you and your loved ones will cherish forever.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed mb-6">
              Choosing a trusted wedding supplier with a proven track record is not just about peace of mind – it's about investing in the expertise and dedication needed to make your special day truly unforgettable.
            </p>
            <p className="text-white text-lg md:text-xl leading-relaxed font-semibold text-champagne-gold">
              Ali and Nige
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
