"use client";

import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/useHasMounted";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import BlogImage from "@/components/BlogImage";
import SiteLightbox from "@/components/SiteLightbox";
import {
  Lightbulb,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Phone,
  Sun,
  MapPin,
  AlertCircle,
  Lamp,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";

/** Inlined to avoid bundling the full testimonials dataset into this client page (mobile perf). */
const BABINGTON_TESTIMONIALS = [
  {
    quote:
      "We wanted to say thank you so much for Monday night. Also, many thanks for playing Come On Eileen for the first time. We really appreciated that and hopefully you didn't mind too much. We had the most perfect day and your DJ set was brilliant!!! We knew you meant business when you came straight in with Stayin' Alive after the band.",
    author: "Riley & Emily Broudie",
    venue: "Babington House Hotel, Somerset",
  },
  {
    quote:
      "We have been meaning to drop you a line to say a HUGE HUGE THANK YOU for doing such an amazing job with the DJing and lighting etc at our wedding. So many people commented on how great you were and how good the music was and it really made the night so special so really thank you from the bottom of our hearts.",
    author: "Colin and Lian Lockhead",
    venue: "Babington House Hotel",
  },
  {
    quote:
      "Just wanted to say a huge thank you for the amazing DJ set you played at our wedding last month! Everyone had the best night and the music was a huge part of that and a key reason the dance floor was full right until the very end! The tree lighting also looked incredible and photographed so well!",
    author: "Ellie & David Hearn",
    venue: "Babington House Hotel",
  },
] as const;

const PRIORITY_LINKS = [
  {
    href: "/weddings/wedding-entertainment/",
    label: "Wedding Entertainment",
    description: "DJs, live music and planning the flow of your day",
  },
  {
    href: "/weddings/wedding-lighting/",
    label: "Wedding Lighting Design",
    description: "Lighting designed for barns, terraces and estates",
  },
  {
    href: "/artists/djs/dj-nige/",
    label: "Meet DJ Nige",
    description: "Part of Babington House weddings since 2003",
  },
] as const;

const WHY_COUPLES_POINTS = [
  {
    icon: Sun,
    title: "How the day flows",
    text: "We know how Babington moves from ceremony and drinks through dinner to the evening party — so music and lighting feel natural, not bolted on.",
  },
  {
    icon: MapPin,
    title: "The right space for the moment",
    text: "Bar, terrace, Orangery, walled garden or croquet lawn — we can suggest what works for your style of celebration and the time of year.",
  },
  {
    icon: AlertCircle,
    title: "Avoiding common pitfalls",
    text: "Sofa removal when band and DJ share the bar, dark terraces without moonlight, timing between spaces — the small details couples often only learn on the day.",
  },
  {
    icon: Lamp,
    title: "Lighting across the estate",
    text: "Stylish Entertainment is trusted to deliver Babington House wedding lighting — from tree lighting on the terrace to fairy canopies in the Orangery and walled garden.",
  },
  {
    icon: Heart,
    title: "Atmosphere, not just kit",
    text: "We shape how a room feels as the evening builds — dimmable festoon, animated bar lighting, canopies and mood — rather than simply dropping off equipment.",
  },
] as const;

const BABINGTON_FAQ = [
  {
    question: "Has DJ Nige been part of Babington House weddings since 2003?",
    answer:
      "Yes. Nigel (DJ Nige) has been part of Babington House weddings since 2003. Couples who book us benefit from his long experience of how the venue works — from the bar dancefloor to terrace lighting and the flow between spaces.",
  },
  {
    question: "Do you provide wedding lighting at Babington House?",
    answer:
      "Yes. Stylish Entertainment is trusted to deliver Babington House wedding lighting — including options on the bar terrace such as Light and Shade tree lighting, Chill Out Camp, fairy-light canopies and more. Your wedding package includes an allocation for lighting; we help you choose what will work for your date and spaces.",
  },
  {
    question: "Can you help with both a band and a DJ in the bar?",
    answer:
      "Yes. Many Babington weddings use a band followed by a DJ in the bar. We can advise on layout, sofa removal, sound and how to keep the atmosphere going when the band finishes — including practical tips in the Bar section above.",
  },
  {
    question: "When should we start planning entertainment and lighting?",
    answer:
      "As soon as your date is set. Popular summer dates fill quickly, and lighting choices (especially terrace installations) benefit from an early conversation so we can align with your coordinator and the rest of your suppliers.",
  },
  {
    question: "Do you supply live musicians at Babington?",
    answer:
      "We work with sax players, pianists, singers and other live acts who know Babington — from ceremony and drinks reception through to jamming alongside the DJ. See our musicians page or ask when you enquire.",
  },
  {
    question: "How do we check availability?",
    answer:
      "Contact us with your date and a brief outline of your plans. We reply within 24 hours with availability and tailored guidance for your Babington House wedding.",
  },
] as const;

const frontOfHouseGalleryImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/v1768163448/Entrance-Lighting-02_rojobv.jpg",
    alt: "Babington House front of house with fairy lights in bushes, captured by Martin Beddall Photography",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768740393/Albert-Palmer-Photography-002_rpgfzf.jpg",
    alt: "Albert Palmer Photography at Babington House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768740556/Albert-Palmer-Photography-001-2-e1642519560978_yjkunf.jpg",
    alt: "Albert Palmer Photography at Babington House",
  },
];

const walledGardenGalleryImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163336/Fairy-canopy-6_iv1ig2.jpg",
    alt: "Walled Garden fairy light canopy at Babington House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163204/IMG_2362_zfncoc.jpg",
    alt: "Walled Garden at Babington House",
  },
];

const orangeryHeroImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768738816/Fairy-light-Canopy_vc1rkd.gif",
    alt: "Animated fairy light canopy at Babington House Orangery",
  },
];

const croquetLawnGalleryImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768739479/EXTERIOR-DINING-TREE-LIGHTING_ur4vlb.jpg",
    alt: "Babington House croquet lawn alfresco dining with festoon and tree lighting",
  },
];

const terraceGalleryImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742634/Light_Shade_02_w0mupa.jpg",
    alt: "Bar terrace with light and shade lighting design at Babington House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741619/IMG_0487_aoaxho.jpg",
    alt: "Bar terrace with elegant lighting at Babington House",
  },
];

const barGalleryImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733634/Babington-Bar-with-DJ-and-Band-Setup-Summer_cs7dyw.jpg",
    alt: "Babington House bar with DJ Nige's setup and atmospheric lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742701/150730_sami-tammy_ria-mishaal-photography_782_n8tmps.jpg",
    alt: "Babington House bar with elegant lighting design, captured by Ria Mishaal Photography",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768734499/Jade-and-Emma-0059-1_wddnet.jpg",
    alt: "Jade and Emma's wedding with elegant dance floor lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768734443/Jade-and-Emma-0068-1_gcs0kw.jpg",
    alt: "Jade and Emma's wedding celebration with beautiful lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768735237/Jade-and-Emma-0066-1_p6jwnu.jpg",
    alt: "Jade and Emma's wedding with atmospheric lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768735117/Jade-and-Emma-0055-1_vksgum.jpg",
    alt: "Jade and Emma's wedding celebration with elegant lighting",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768738377/Amber-LED-Mood-lighting_jvwdbr.jpg",
    alt: "Amber LED mood lighting at Babington House bar",
  },
];

const orangeryGalleryImages = [
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741948/Saltburn_231005__0020_0640_nmzjp6.jpg",
    alt: "Babington House Orangery with elegant lighting design and venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742034/IMG_1348_161201_zwmdh2.jpg",
    alt: "Babington House Orangery with sophisticated lighting and venue styling",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742094/IMG_4162_h3h0bb.jpg",
    alt: "Babington House Orangery with elegant lighting design",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163170/Orangery-Canopy-Day_llzwge.jpg",
    alt: "Orangery canopy by day at Babington House",
  },
  {
    src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163647/Orangery-violet_c95cvu.jpg",
    alt: "Orangery with violet lighting at Babington House",
  },
];

const lightingOptions = [
  {
    title: "Light and Shade",
    description: "We call this Light and Shade Tree lighting and it's installed on the large pine tree on the bar terrace. Great for Insta shots. We have had it described as Iconic (not by us)!",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768738898/Light-and-Shade-KV_counyg.jpg",
        alt: "Light and Shade tree lighting at Babington House bar terrace",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163095/matt_emma_4191-scaled_jllnsf.jpg",
        alt: "Light and Shade tree lighting at Babington House bar terrace",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163114/Babington-Tree-Lighting-Daytime_nw8qbl.jpg",
        alt: "Babington tree lighting during daytime",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768738511/wedding-tree-lighting-2-e1510835516724_f1fant.jpg",
        alt: "Wedding tree lighting at Babington House",
      },
    ],
  },
  {
    title: "Mini Chill Out Camp",
    description: "A smaller, more intimate version of our Chill Out Camp lighting. This installation uses vintage Edison festoon lighting wrapped in fairy-lights, creating a cozy atmosphere perfect for smaller gatherings.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733527/Babington-House-mini-chill-out-camp_lrjeoi.jpg",
        alt: "Mini Chill Out Camp lighting with Edison festoon at Babington House",
      },
    ],
  },
  {
    title: "Chill Out Camp",
    description: "Linking the Bar this lighting installation uses vintage Edison festoon lighting wrapped in fairy-lights. The Edison is dimmable so that the bar and bar terrace work in unison to create a magical atmosphere.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741340/_F4R3275_tukoww.jpg",
        alt: "Chill Out Camp lighting with vintage Edison festoon at Babington House",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741476/Version_2_apydn6.jpg",
        alt: "Chill Out Camp lighting installation with vintage Edison festoon and fairy lights at Babington House",
      },
    ],
  },
  {
    title: "Free Standing Bar Terrace Canopy",
    description: "Free standing lighting canopy with optional white shades.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162717/Free-Standing-Lighting-Canopy-with-Tree-lighting-in-distance_fgfz56.jpg",
        alt: "Free standing bar terrace canopy lighting at Babington House",
      },
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741843/JI_2836_tkl0gi.jpg",
        alt: "Free standing lighting canopy with elegant design at Babington House",
      },
    ],
  },
  {
    title: "Edison Vintage Tree Lighting",
    description: "Vintage Edison Bulbs for a beautiful, warm atmosphere.",
    images: [
      {
        src: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163783/Jade-and-Emma-0048_y2uzdn.jpg",
        alt: "Edison vintage tree lighting at Babington House",
      },
    ],
  },
];

// Mini Card Carousel Component for lighting options
function MiniCardCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const multi = images.length > 1;

  const goToPrevious = () => {
    if (!multi) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!multi) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 1) {
    return (
      <>
        <div 
          className="relative w-full h-48 overflow-hidden cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            className="object-cover hover:opacity-90 transition-opacity duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <SiteLightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative w-full h-48 overflow-hidden group">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full cursor-pointer"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onClick={() => openLightbox(currentIndex)}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full w-full flex-shrink-0 relative">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover hover:opacity-90 transition-opacity duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-champagne-gold/80 border border-champagne-gold/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-champagne-gold/80 border border-champagne-gold/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 h-1.5 bg-champagne-gold"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        onView={setLightboxIndex}
      />
    </>
  );
}

// Bar Gallery Carousel Component
function BarGalleryCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const multi = images.length > 1;

  const goToPrevious = () => {
    if (!multi) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!multi) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out cursor-pointer"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onClick={() => {
            setLightboxIndex(currentIndex);
            setLightboxOpen(true);
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="min-w-full w-full flex-shrink-0 relative aspect-[4/3]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
                loading={index <= 1 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {multi && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-champagne-gold border-2 border-champagne-gold rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-champagne-gold group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-champagne-gold border-2 border-champagne-gold rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-champagne-gold group-hover:text-white transition-colors" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 h-2 bg-champagne-gold"
                      : "w-2 h-2 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <SiteLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
        onView={setLightboxIndex}
      />
    </div>
  );
}

export default function BabingtonClient() {
  const mounted = useHasMounted();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const sections = ["bar", "terrace", "front-of-house", "orangery", "garden", "croquet"];
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

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

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
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768741340/_F4R3275_tukoww.jpg"
            alt="Chill Out Camp lighting with vintage Edison festoon at Babington House"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-800" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-32 md:pt-52 pb-12">
          <div className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">
              Trusted at Babington House since 2003
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Babington House Wedding Entertainment, Lighting &amp; Production
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 font-medium px-4 drop-shadow-md mb-8 max-w-3xl mx-auto leading-relaxed">
            DJ Nige has been part of Babington House weddings since 2003, and Stylish Entertainment is trusted to deliver the venue&apos;s wedding lighting — one experienced team for your music and your atmosphere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button
              asChild
              size="lg"
              className="min-h-[48px] bg-champagne-gold text-black hover:bg-champagne-gold/90 shadow-lg"
            >
              <Link href="/contact-us/">Check Availability</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[48px] border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
            >
              <a href="tel:+447970793177" suppressHydrationWarning>
                Call 07970 793177
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="py-10 px-4 bg-gray-900 border-y border-champagne-gold/20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "20+ years", sub: "Wedding entertainment" },
              { label: "Babington House since 2003", sub: "DJ Nige at the venue" },
              { label: "Music & lighting", sub: "Trusted with both" },
              { label: "One experienced team", sub: "DJs, lighting & production" },
            ].map((item) => (
              <div key={item.label} className="px-2">
                <p className="text-champagne-gold font-bold text-sm md:text-base mb-1">{item.label}</p>
                <p className="text-gray-400 text-xs md:text-sm">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Priority links */}
      <section className="py-12 px-4 bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRIORITY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="block group">
                <Card className="h-full bg-gray-900/70 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col h-full">
                    <p className="text-lg font-bold text-champagne-gold mb-2 group-hover:text-gold-light transition-colors">
                      {link.label}
                    </p>
                    <p className="text-gray-300 text-sm flex-grow mb-4">{link.description}</p>
                    <span className="inline-flex items-center gap-2 text-white font-semibold text-sm">
                      Explore
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* A typical Babington wedding day */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg prose-invert max-w-none">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 not-prose">
              A typical Babington wedding day
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              Every wedding is different, but most days at Babington move through a familiar rhythm. Morning and early afternoon often centre on the house and gardens; drinks may spill onto the terrace in summer or gather around the bar as the light fades. Dinner is frequently in the Orangery — one of the finest rooms in the country — before the party builds in the bar, with the terrace and outdoor spaces still part of the atmosphere.
            </p>
            <p className="text-gray-200 text-lg leading-relaxed">
              Music and lighting need to support each chapter without fighting the venue. That is where twenty years of Babington experience matters — knowing when to soften the terrace, when the bar needs a real dancefloor, and how lighting ties the bar, terrace and dining spaces together as the evening develops.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky area navigation — always visible; active state only after hydration */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-champagne-gold/50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-4 py-3 overflow-x-auto">
            {[
              { id: "bar", label: "Bar" },
              { id: "terrace", label: "Terrace" },
              { id: "front-of-house", label: "Front of House" },
              { id: "orangery", label: "Orangery" },
              { id: "garden", label: "Garden" },
              { id: "croquet", label: "Croquet Lawn" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 ${
                  mounted && activeSection === item.id
                    ? "bg-champagne-gold text-black"
                    : "text-gray-200 hover:text-champagne-gold hover:bg-gray-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Introduction */}
      <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-4">
              Whether you are planning your Babington House wedding or have already booked your date, you have chosen one of the best venues in the UK to get married — in my opinion. I have been part of Babington House weddings since 2003, and in that time I have seen many things — some beautiful, some tear-jerking and some odd!
            </p>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-4">
              Every couple who books us benefits from that experience — how the venue flows, which spaces suit your celebration, and how music and lighting work together across the estate. Below are my thoughts on each area of the site, which I hope you find useful whether you are at the start of planning or fine-tuning the details.
            </p>
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-semibold">
              <span
                className="text-champagne-gold text-3xl md:text-4xl italic [font-family:var(--font-dancing),cursive]"
                suppressHydrationWarning
              >
                DJ Nige
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* The Bar */}
      <section id="bar" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          >
            {/* Left Column: The Guide */}
            <div className="max-w-none">
              <div className="prose prose-lg prose-invert max-w-none">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Bar</h2>
                <p className="text-gray-200 text-lg leading-relaxed mb-4">
                  The Babington bar is an excellent space for a party and can hold more people than you think. On New Years Eve we have over 200 celebrating at midnight and it&apos;s an amazing atmosphere.
                </p>
                <p className="text-gray-200 text-lg leading-relaxed mb-4">
                  If you are opting for a solo DJ with decks, sound-system and lighting, the small tables are removed along with the easy chairs to create a good-sized dance-floor.
                </p>
              </div>
              {/* Expert Tip: Sofa Removal — outside .prose (block Card must not nest inside typography prose) */}
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 mt-6">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="p-2 bg-champagne-gold/20 rounded-lg flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Expert Tip</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      <strong>Consider the sofa removal:</strong> When a band and DJ are used you will lose some of the bar sofas. Once removed they do not go back into the bar until the following morning, which means there are no comfy spaces to sit and watch the dancing or for any after hours activity. Plan for alternative seating areas if guests need a break from dancing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: The Media */}
            <div className="space-y-6">
              {/* Bar Summer Image */}
              <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
                <BlogImage
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733634/Babington-Bar-with-DJ-and-Band-Setup-Summer_cs7dyw.jpg"
                  alt="Babington House bar with DJ and band setup in summer"
                  images={barGalleryImages}
                  index={0}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              
              {/* GIF with aspect-video */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-lg">
                <img
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768168979/IMG_4045_akqofr.gif"
                  alt="Animated lighting display at Babington House bar"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Expert Tip: Lighting Atmosphere - Matching GIF width */}
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="p-2 bg-champagne-gold/20 rounded-lg flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Expert Tip</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      <strong>Lighting atmosphere:</strong> The animated lighting display creates a dynamic atmosphere that evolves throughout the evening. It&apos;s perfect for creating memorable moments and stunning photo opportunities for your guests.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bar Gallery Carousel */}
          <div
            className="mt-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Bar Gallery</h3>
            <BarGalleryCarousel images={barGalleryImages} />
          </div>
        </div>
      </section>

      {/* Bar Terrace */}
      <section id="terrace" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div
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
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768742634/Light_Shade_02_w0mupa.jpg"
                alt="Bar terrace with light and shade lighting design at Babington House"
                images={terraceGalleryImages}
                index={0}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Lighting Options Gallery Grid */}
          <div
            className="mt-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Lighting Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lightingOptions.map((option, idx) => (
                <div key={idx}>
                  <Card className="bg-gray-900/50 backdrop-blur-md border-champagne-gold/30 hover:border-champagne-gold/60 transition-all h-full overflow-hidden">
                    <MiniCardCarousel images={option.images} />
                    <CardContent className="p-4">
                      <h4 className="text-lg font-bold text-champagne-gold mb-2">{option.title}</h4>
                      <p className="text-sm text-gray-200 leading-relaxed">{option.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Front of House */}
      <section id="front-of-house" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div
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
            <div className="space-y-4">
              <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
                <BlogImage
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/v1768163448/Entrance-Lighting-02_rojobv.jpg"
                  alt="Babington House front of house wedding celebration with fairy light bushes"
                  images={frontOfHouseGalleryImages}
                  index={0}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Croquet Lawn */}
      <section id="croquet" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div
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
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768739479/EXTERIOR-DINING-TREE-LIGHTING_ur4vlb.jpg"
                alt="Babington House croquet lawn alfresco dining with festoon and tree lighting"
                images={croquetLawnGalleryImages}
                index={0}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Orangery */}
      <section id="orangery" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Orangery</h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                One of the finest dining rooms in the whole world! The Orangery does not need much as it&apos;s already stunning but to make it more sparkly for a wedding we often install lighting for winter and autumn weddings.
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative w-full h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-900 shadow-lg">
                <BlogImage
                  src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768738816/Fairy-light-Canopy_vc1rkd.gif"
                  alt="Fairy light canopy at Babington House Orangery"
                  images={orangeryHeroImages}
                  index={0}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>

          {/* Orangery Gallery */}
          <div
            className="mt-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Orangery Gallery</h3>
            <BarGalleryCarousel images={orangeryGalleryImages} />
          </div>
        </div>
      </section>

      {/* Walled Garden */}
      <section id="garden" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-none">
            <div className="prose prose-lg prose-invert max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Walled Garden</h2>
              <p className="text-gray-200 text-lg leading-relaxed mb-4">
                Often used for pre-wedding BBQ&apos;s on a Wednesday night, the walled garden is a delightful area during the summer. A well loved and tended garden with an abundance of flowers, vegetables & apple trees in a Soho House style. We offer a lighting canopy that covers the dining tables, BBQ and bar. In addition to lighting we often supply a PA with microphone for welcome speeches and music playback.
              </p>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                This fairy light canopy can be created in any space using free standing supports. Stunning all times of the year.
              </p>
            </div>
            <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-900 shadow-lg mt-6">
              <BlogImage
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163336/Fairy-canopy-6_iv1ig2.jpg"
                alt="Walled Garden fairy light canopy at Babington House"
                images={walledGardenGalleryImages}
                index={0}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Real Babington Weddings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Real Babington Weddings</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A few words from couples we have DJ&apos;d and lit at Babington House.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {BABINGTON_TESTIMONIALS.map((testimonial, index) => (
              <div
                key={testimonial.author}
              >
                <Card className="h-full bg-gray-800/70 border-champagne-gold/30 backdrop-blur-sm">
                  <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                    <p className="text-gray-200 italic leading-relaxed mb-6 flex-grow text-sm sm:text-base">
                      &quot;{testimonial.quote.length > 320
                        ? `${testimonial.quote.slice(0, 320)}…`
                        : testimonial.quote}&quot;
                    </p>
                    <div className="border-t border-champagne-gold/20 pt-4">
                      <p className="text-champagne-gold font-bold">{testimonial.author}</p>
                      <p className="text-gray-400 text-sm mt-1">{testimonial.venue}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
              <Link href="/contact-us/">Check Availability for Your Date</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Entertainment options */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 not-prose">Entertainment options</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              From the bar dancefloor to acoustic sets and sax alongside the DJ, we help you build the right soundtrack for your day. DJ Nige has been part of Babington House weddings since 2003 — and our wider team brings the same care to sound, timing and atmosphere.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 not-prose">
              <Button asChild variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                <Link href="/weddings/wedding-entertainment/">Wedding Entertainment</Link>
              </Button>
              <Button asChild variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                <Link href="/artists/djs/dj-nige/">Meet DJ Nige</Link>
              </Button>
              <Button asChild variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                <Link href="/artists/musicians/">Live Musicians</Link>
              </Button>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed mt-6">
              We also work with saxophone players who jam along with the DJ, pianists and singers for cocktail sets, confetti cannons for first dances, and bespoke production when you need something unique.
            </p>
          </div>
        </div>
      </section>

      {/* Lighting options */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <div
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 not-prose">Lighting options</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              Stylish Entertainment is trusted to deliver Babington House wedding lighting — from the terrace options detailed above to Orangery canopies, front-of-house fairy lights and the walled garden. We design installations that photograph beautifully and feel right as the sun goes down.
            </p>
            <Button asChild className="bg-champagne-gold text-black hover:bg-champagne-gold/90 not-prose">
              <Link href="/weddings/wedding-lighting/">
                Wedding Lighting Design
                <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Couples Ask Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <div
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Couples Ask Us</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              It is not only about playing records or hanging festoon — it is knowing Babington, and helping your day feel effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHY_COUPLES_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <Card
                  key={point.title}
                  className="bg-gray-900/50 border-champagne-gold/20 backdrop-blur-sm"
                >
                  <CardContent className="p-6 flex gap-4">
                    <div className="p-2 bg-champagne-gold/20 rounded-lg flex-shrink-0 h-fit">
                      <Icon className="h-6 w-6 text-champagne-gold" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{point.text}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="text-center text-gray-400 mt-10 text-sm">
            Questions about your date?{" "}
            <Link href="/contact-us/" className="text-champagne-gold hover:text-gold-light underline">
              Get in touch
            </Link>{" "}
            — we are happy to talk through your plans.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {BABINGTON_FAQ.map((item) => (
              <Card key={item.question} className="bg-gray-800/70 border-champagne-gold/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-champagne-gold mb-3">{item.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-12 px-4 bg-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <div
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Plan your Babington House wedding entertainment &amp; lighting
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Tell us your date and vision — we reply within 24 hours with availability and tailored guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-champagne-gold text-black hover:bg-gold-light hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] min-h-[48px]"
              >
                <Link href="/contact-us/">Check Availability</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 min-h-[48px]"
              >
                <a
                  href="tel:+447970793177"
                  className="inline-flex items-center justify-center gap-2"
                  suppressHydrationWarning
                >
                  <Phone className="w-4 h-4 shrink-0" aria-hidden />
                  Call 07970 793177
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 min-h-[48px]"
              >
                <Link href="/artists/djs/dj-nige/">Meet DJ Nige</Link>
              </Button>
            </div>
            <p className="mt-8 text-gray-400 text-sm">
              <Link href="/venues/" className="text-champagne-gold hover:text-gold-light underline">
                More venues we know
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
