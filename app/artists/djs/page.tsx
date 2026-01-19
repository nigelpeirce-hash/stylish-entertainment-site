"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useEffect, useState } from "react";
import LazyIframe from "@/components/LazyIframe";
import { Target, Clock, Sparkles, Wrench, Music, Shield, Play, Search, Quote } from "lucide-react";
import YMCACheck from "@/components/YMCACheck";
import { Input } from "@/components/ui/input";
import { reviews } from "@/data/reviews";
import { testimonials } from "@/data/testimonials";

// Helper function to filter testimonials/reviews by DJ name
function getDJTestimonials(djName: string) {
  const djKeywords: { [key: string]: string[] } = {
    "DJ Nige": ["nige", "nigel"],
    "DJ Rich": ["rich"],
    "James H DJ": ["james"],
  };

  const keywords = djKeywords[djName] || [];
  if (keywords.length === 0) return [];

  const allTestimonials = [
    ...reviews.map((r) => ({ ...r, source: "reviews" as const })),
    ...testimonials.map((t) => ({ ...t, source: "testimonials" as const })),
  ];

  return allTestimonials.filter((testimonial) => {
    const quoteLower = testimonial.quote.toLowerCase();
    return keywords.some((keyword) => quoteLower.includes(keyword));
  });
}

const djs = [
  {
    name: "DJ Nige",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163297/Mirjam-and-Ben-1062-1_vy1hgx.jpg",
    alt: "DJ Nige performing at Mirjam and Ben's wedding at Babington House, Somerset, showcasing professional wedding DJ services with elegant lighting",
    mixingStyle: "Seamless Mixing",
    bio: "Over 20 years as resident DJ at Babington House Hotel, Nige brings sophistication and energy to every event.",
    fullBio: `DJ Nige started his DJ career at the age of 14, honing his skills at local parties and events before entering into the wider world of London's radio, music, and advertising industries. Throughout his career, DJ Nige has established himself as a highly talented and sought-after producer & DJ, with highlights including working as a freelance producer for Pete Tong's Essential Selection on Radio 1, which took him around clubs in the UK and Europe, playing as a resident DJ at Babington House Hotel in Somerset for 20 years, and entertaining crowds at the Glastonbury Festival as backstage DJ at the Pyramid stage.

Nige's journey took a significant turn when he transitioned from performing at iconic festivals like Glastonbury to high-profile London venues, including The Met Bar. This move reflected his growing reputation and the demand for his unique ability to blend technical excellence with an intuitive understanding of crowd dynamics. Working alongside industry leaders and entertaining A-list clients, Nige established himself as a trusted name in premium event entertainment.

Alongside his DJing career, Nige also co-founded an award-winning TV & Radio production company, Factory Studios, where he mixed and produced many dance compilation albums. Since 2003, Nige has been resident DJ at celebrity hangout, Babington House Hotel in Somerset, where his skills on the decks & reading a crowd has been sought out for the entertainment of Adele, James Corden, Kate Winslet, Eddie Redmayne, Russell Howard, and Michael McIntyre to name a few!

With his exceptional talent and extensive knowledge of music, DJ Nige is the perfect choice for any event, whether it's a wedding, corporate party, or birthday celebration. His music knowledge is extensive and ever-growing, with a love of music from all eras and genres. He plays everything from Contemporary, House, Garage, Ibiza, Old Skool, Soul, Funk, Dance, Reggae, Rock N Roll, R&B, Indie, Urban, Ska and any other genre from the 30,000 tracks he holds on his Mac. However, if you're looking for cheesy hits or synchronised dancing, you are dancing on the wrong turntables!

For more on Nige's technical expertise and industry recognition, including his Artic License and lighting design work, see his [technical bio on our About page](/about).

---

**Recent Testimonials**

**The Met Bar, London**
"Thank you Nige. You did a magnificent job!, It was a magical night for the Stringers and I am happy you were on hand to help make it so! See you soon."
— Rob Stringer, CEO Sony Music Worldwide, The Met Bar, London.

**Sessions Art Club, London EC2**
"Just wanted to say a massive thank you for last night Nigel. You and Leo (Sax player) were absolute champions. Not sure a single guest left the dance floor for the 2.5hrs you were playing. We have had some many amazing comments today and you guys are mentioned in almost every text. Apologies we couldn't get you on sooner, and if that 11pm curfew wasn't there we'd still be dancing now!"
— Sophie & Sam Hawsley, Sessions Art Club, London

**Dorfold Hall, Nantwich, Cheshire**
"I wanted to drop you an email to thank both you and Nigel. He was brilliant on the day and everyone had a fantastic time (we've had lots of positive feedback on the tunes he played). We loved having him there, and his set was absolutely banging. Please pass on Nancy and my thanks for his part in such a memorable and incredible day. He was, predictably, fantastic."
— Alex & Nancy Horlock, Dorfold Hall, Nantwich, Cheshire

**Babington House Hotel, Somerset**
"Hope you're really well and had a good bank holiday weekend. Just a quick note to say a massive thank you for everything last week. It all went so well and really helped make our day so special. Music on Thursday was perfect and exactly want Emma and I wanted! I had so many people on the night and the next day commenting on what a great mix you had and it really kept everyone on the dance floor all night. Also the light in the walled garden were beautiful and helped create such a lovely atmosphere for dinner. Thank you again!"
— Max & Emma Rayner, Babington House Hotel`,
    youtubeEmbed: "https://www.youtube.com/embed/RAdejWBYWaw?si=4-GnDsRvsG4ZpYio",
    mixcloudEmbeds: [
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fnigelpeirce1%2Fbabington-nye-part-1%2F",
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fnigelpeirce1%2Fkitchen-disco-volume-2%2F",
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fnigelpeirce1%2Fthe-90s-club-classics-mix%2F",
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fnigelpeirce1%2Fthe-80s-remixed-mix%2F",
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Fnigelpeirce1%2Fuk-garage-old-skool-minimix%2F",
    ],
  },
  {
    name: "DJ Rich",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163359/Rich-S-DJ_qxsnht.jpg",
    alt: "Professional wedding DJ Rich S performing at a luxury London venue, showcasing professional DJ services with high-quality sound and lighting",
    mixingStyle: "Oxford & London Resident | JACKfm Presenter | O2 Academy",
    bio: "Award-winning radio presenter and versatile DJ, experienced in playing for thousands at student nights, corporate events, and celebrations.",
    fullBio: `After discovering a passion and love for music whilst studying, Rich worked his way up through the student night scene in Oxford (Fuzzy Ducks, Bridge Mondays etc…) and London (Crazy Larrys, Embargos etc…). Accustomed to playing regularly in front of 1000's of people, his musical style is broad and Rich is experienced in playing weddings, 18th, 21st, 30th Birthdays and a multitude of corporate events.

Through a vast knowledge of music past and present, his range and ability to play whatever style is necessary for your party is invaluable. His exuberance and hard work has also seen him become a co-presenter on Oxfordshire's largest local breakfast show The Morning Glory on the multi-award winning JACKfm in Oxfordshire. When not presenting early mornings, Rich is honing his DJing as resident for the O2 Academy in Oxford. Rich is an extremely accomplished and adaptable DJ who is ideal for a party whatever the occasion.`,
    youtubeEmbed: "https://www.youtube.com/embed/H7bTX4sbUwI",
    mixcloudEmbeds: [
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FDjrichsmith%2Fsomething-chilled-mix%2F",
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FDjrichsmith%2Fwedding-mix%2F",
    ],
  },
  {
    name: "James H DJ",
    image: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163392/james-Malin_ovqqnf.jpg",
    alt: "Professional DJ James H Hudson performing at wedding and party events, showcasing professional DJ services with expert mixing and entertainment",
    mixingStyle: "From Radio to Prestigious Venues",
    bio: "Award-winning DJ with an eclectic style, creating unforgettable moments at London's most prestigious venues.",
    fullBio: `Beginning his career in radio, it wasn't long before James's innovative style of presenting got him noticed. He soon moved into TV and with his love of music made a name for himself as a respected DJ across the UK. Having performed at awards, festivals and some of London's most prestigious venues and events, James has developed a unique style that appeals to diverse audiences. James prides himself on working closely with clients to ensure unique sets that reflect your personal style, creating unforgettable moments. With an eclectic taste in music and the ability to mix any genre or decade seamlessly, James creates a dynamic atmosphere that keeps guests engaged from the first song to the last. His attention to detail and commitment to excellence make him a standout choice for clients seeking something truly special.`,
    youtubeEmbed: "https://www.youtube.com/embed/r7PAMv1CbOg",
    mixcloudEmbeds: [
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FJamesMalinHudson%2Fhere-comes-the-bride-saxhouse%2F",
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FJamesMalinHudson%2Flets-get-married-discosoulpop%2F",
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FJamesMalinHudson%2Fthrow-the-bouquet-kisstory%2F",
      "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FJamesMalinHudson%2Fshotgun-alternativeindierock%2F",
    ],
  },
];

// Import venues data from venues page
const venuesUnsorted = [
  "Monaco Yacht Club",
  "Maritime Museum Amsterdam",
  { name: "Babington House Hotel, Soho House", url: "https://www.sohohouse.com/houses/babington-house" },
  { name: "Dorfold Hall", url: "https://www.dorfoldestate.com/" },
  { name: "The Met Bar", url: "https://www.metropolitanlondon.com/" },
  { name: "Goodwood House, Sussex", url: "https://www.goodwood.com/" },
  { name: "Hotel Tresanton Cornwall", url: "https://www.tresanton.com/" },
  { name: "Cowley Manor", url: "https://www.cowleymanor.com/" },
  { name: "Berkeley Castle", url: "https://www.berkeley-castle.com/" },
  { name: "Coombe Lodge", url: "https://www.coombelodge.co.uk/" },
  { name: "Priston Mill", url: "https://www.pristonmill.co.uk/" },
  { name: "The Chapel, Bruton", url: "https://atthechapel.co.uk/" },
  { name: "Roth Bar & Grill", url: "https://rothbar.co.uk/" },
  { name: "Orchardleigh Estate", url: "https://www.orchardleigh.com/" },
  { name: "Elmhay Park", url: "https://www.orchardleigh.com/" },
  { name: "North Cadbury Court", url: "https://www.northcadburycourt.com/" },
  { name: "Barnsley House", url: "https://www.barnsleyhouse.com/" },
  { name: "Pembroke Lodge, Richmond Park", url: "https://www.pembroke-lodge.co.uk/" },
  { name: "Yarlington House", url: "https://www.yarlingtonhouse.co.uk/" },
  { name: "Lulworth Castle", url: "https://www.lulworth.com/" },
  "The Imperial",
  "Charlton House, Shepton Mallet",
  { name: "Eastnor Castle", url: "https://www.eastnorcastle.com/" },
  "The Great Tythe Barn, Tetbury",
  "Euridge Manor",
  { name: "Sessions Art Club London", url: "https://sessionsartsclub.com/" },
  { name: "Soho Farmhouse", url: "https://www.sohohouse.com/houses/soho-farmhouse" },
  { name: "Hotel du Vin, Poole", url: "https://www.hotelduvin.com/locations/poole/" },
  "Many private addresses",
  { name: "Calcot Manor", url: "https://www.calcot.co/" },
  { name: "Cardiff City Hall", url: "https://www.cardiffcityhall.com/" },
  { name: "Cardiff Castle", url: "https://www.cardiffcastle.com/" },
  { name: "Athelhampton House", url: "https://www.athelhampton.co.uk/" },
  { name: "Homewood Park", url: "https://www.homewoodpark.co.uk/" },
  "Shilstone Manor",
  { name: "Pentille Castle", url: "https://www.pentillie.co.uk/" },
  { name: "Stoke Place", url: "https://www.stokeplace.com/" },
  "St Stephen's Hampstead",
  { name: "St George's Bristol", url: "https://www.stgeorgesbristol.co.uk/" },
  { name: "Gant's Mill", url: "https://www.gantsmill.co.uk/" },
  "The Manor Castle Coombe",
  { name: "Elmore Court", url: "https://www.elmorecourt.com/" },
  "Revolution",
  { name: "The Mayfair Hotel", url: "https://www.themayfairhotel.co.uk/" },
  "Dewsall Court",
  "Polhawn Fort",
  { name: "Syrencot", url: "https://www.syrencot.co.uk/" },
  { name: "Bailbrook House", url: "https://www.bailbrookhouse.co.uk/" },
  { name: "The Gathering Barn", url: "https://www.thegatheringbarn.co.uk/" },
  { name: "Thames Rowing Club", url: "https://www.thamesrc.co.uk/" },
  { name: "Hampton Court House", url: "https://www.hamptoncourthouse.co.uk/" },
  { name: "Hestercombe Gardens", url: "https://www.hestercombe.com/" },
  { name: "Pencarrow Estate", url: "https://www.pencarrow.co.uk/" },
  "Northover Manor",
  { name: "Boconnoc Estate", url: "https://www.boconnoc.com/" },
  { name: "Rockingham Castle", url: "https://www.rockinghamcastle.com/" },
  "Queen Mary University, London",
  { name: "Town Hall Hotel, London", url: "https://www.townhallhotel.com/" },
  { name: "The Wellington Arms, Basingstoke", url: "https://www.thewellingtonarms.com/" },
  { name: "Wick Farm, Bath", url: "https://www.wickfarm.co.uk/" },
  { name: "Parklands Quendon Hall, Essex", url: "https://quendonhall.co.uk/" },
  { name: "Dene Farm, Hampshire", url: "https://www.denefarm.co.uk/" },
  "Cutteridge Barns, Trowbridge",
  { name: "Brympton House", url: "https://www.brymptonhouse.co.uk/" },
  { name: "Cripps Barn", url: "https://www.crippsbarn.co.uk/" },
  { name: "Tall Johns, South Wales", url: "https://www.talljohnshouse.com/" },
  { name: "The Royal Yacht Club", url: "https://www.rlyc.org.uk/" },
  { name: "The Newt in Somerset", url: "https://www.thenewtinsomerset.com/" },
  { name: "Glastonbury Festival", url: "https://www.glastonburyfestivals.co.uk/" },
  "Almonry Barn, Somerset",
  "Penarth Pier Pavilion, Wales",
  { name: "Kingscote Barn, Gloucestershire", url: "https://www.kingscotebarn.co.uk/" },
  "Hatton Hall, Warwickshire",
  { name: "The Assembly Rooms, Bath", url: "https://www.assemblyroomsbath.co.uk/" },
  "The Penny Farthing Cafe Bar, Cowbridge, Wales",
  "Ruscombe, Berkshire",
  "Braintree, Essex",
];

// Convert venues to a consistent format with name and location extracted
const formatVenues = () => {
  const formatted = venuesUnsorted.map((venue) => {
    if (typeof venue === 'string') {
      // Extract location from string if it contains a comma
      const parts = venue.split(',').map(p => p.trim());
      if (parts.length > 1) {
        return {
          name: parts[0],
          location: parts.slice(1).join(', '),
          url: undefined,
        };
      }
      return {
        name: venue,
        location: '',
        url: undefined,
      };
    }
    // Extract location from name if it contains a comma
    const nameParts = venue.name.split(',').map(p => p.trim());
    if (nameParts.length > 1) {
      return {
        name: nameParts[0],
        location: nameParts.slice(1).join(', '),
        url: venue.url,
      };
    }
    return {
      name: venue.name,
      location: '',
      url: venue.url,
    };
  });
  
  // Sort alphabetically by name (ignoring "The" prefix for sorting)
  return formatted.sort((a, b) => {
    const nameA = a.name.replace(/^The /i, '').toLowerCase();
    const nameB = b.name.replace(/^The /i, '').toLowerCase();
    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
  });
};

const allVenues = formatVenues();

export default function DJs() {
  const [venueSearch, setVenueSearch] = useState("");

  useEffect(() => {
    document.title = "DJs | Professional Wedding DJs | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Meet our talented DJs. Professional wedding entertainment across the West Country including London, Somerset, Bath, Bristol, Dorset, and Devon with mixing styles and genre specialties.");
    }
  }, []);
  return (
    <div>
      <YMCACheck />
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-champagne-gold/5 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768163785/Nigel-DJ-Babs-House-0002-1_ktgbaf.jpg"
            alt="DJ Nige performing at Babington House, showcasing professional wedding DJ services with elegant lighting"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            priority
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-48 md:pt-52"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6 px-6 py-2 bg-champagne-gold/10 rounded-full border border-champagne-gold/30"
          >
            <span className="text-sm md:text-base font-semibold text-champagne-gold tracking-wider uppercase">Meet The Team</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Our <span className="text-gradient drop-shadow-md">DJs</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold leading-relaxed px-4 drop-shadow-md">
            Professional DJs with exceptional talent and expertise
          </p>
        </motion.div>
      </section>

      {/* Selling Points */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/20 rounded-full border border-champagne-gold/40">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-6 text-white font-bold px-4">
              What Sets Our <span className="text-gradient">DJs Apart</span>
            </h2>
          </motion.div>

          {/* Introduction Text Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="bg-gray-800 border-2 border-champagne-gold/30 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed mb-4">
                  Looking for a DJ to make your event unforgettable? Our experienced and reliable DJs know exactly how to get the crowd dancing with their perfect mix of music, sound, and lighting. Choose from our brilliant solo mobile DJs or our festival trio of DJ, sax, and percussion to truly wow and entertain your guests.
                </p>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  We pride ourselves on our ability to read the crowd and cater to everyone's musical tastes, from the music lovers to your Aunt Betty. And to ensure a unique experience, we have banned overplayed and cliché songs such as YMCA, "Come on Eileen," and "The Macarena."
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg relative">
                      <Target className="w-10 h-10 text-champagne-gold" strokeWidth={2.5} />
                      {/* Bullseye rings */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full border-2 border-champagne-gold/40"></div>
                        <div className="absolute w-10 h-10 rounded-full border-2 border-champagne-gold/50"></div>
                        <div className="absolute w-6 h-6 rounded-full border-2 border-champagne-gold/60"></div>
                        <div className="absolute w-3 h-3 rounded-full bg-champagne-gold/80 border border-champagne-gold"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Professional Standards</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our DJs will not whoop at the crowd, wear orange wigs, or revolving bow ties.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg relative flex items-center justify-center">
                      <svg 
                        className="w-10 h-10 text-champagne-gold relative z-10" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        {/* Hour hand pointing to 5 (5 o'clock position) */}
                        <line x1="12" y1="12" x2="15" y2="17.2" strokeLinecap="round" strokeWidth="2.5" />
                        {/* Minute hand pointing to 12 */}
                        <line x1="12" y1="12" x2="12" y2="4" strokeLinecap="round" strokeWidth="1.5" />
                        {/* Clock face markers */}
                        <circle cx="12" cy="4" r="0.5" fill="currentColor" />
                        <circle cx="20" cy="12" r="0.5" fill="currentColor" />
                        <circle cx="12" cy="20" r="0.5" fill="currentColor" />
                        <circle cx="4" cy="12" r="0.5" fill="currentColor" />
                        {/* Center dot */}
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Extended Performance</h3>
                  <p className="text-gray-300 leading-relaxed">
                    They can play for five hours without a break, from 7pm to 12am or 8pm to 1am.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                      <Sparkles className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Dedicated Service</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our DJs are flexible, motivated, and committed to making your party a great success.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                      <Wrench className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Early Setup Available</h3>
                  <p className="text-gray-300 leading-relaxed">
                    They can offer an early setup for your convenience.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                      <Music className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Your Music, Your Way</h3>
                  <p className="text-gray-300 leading-relaxed">
                    They will play your requests/playlist and work to your music brief. If you don&apos;t like Beyonce, they won&apos;t play her.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="h-full border-champagne-gold/30 bg-gray-800 hover:shadow-xl transition-all duration-300 hover:border-champagne-gold/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-full border-2 border-champagne-gold/60 shadow-lg">
                      <Shield className="w-8 h-8 text-champagne-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Fully Insured Equipment</h3>
                  <p className="text-gray-300 leading-relaxed">
                    All of our DJs use their own well-maintained sound and lighting equipment, which is PAT tested with public liability insurance.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DJ Slider */}
      <section className="pt-8 pb-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Our <span className="text-gradient">DJs</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Each DJ brings their unique style and expertise to create the perfect atmosphere
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <Slider>
              {djs.map((dj, index) => (
                <div key={dj.name} className="px-4">
                  <Card className="bg-gray-900 border-2 border-champagne-gold/40 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-champagne-gold/60 group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:items-stretch">
                      <div className="relative h-64 md:h-auto overflow-hidden bg-gray-900 flex items-center justify-center">
                        {dj.image ? (
                          <>
                            <Image
                              src={dj.image}
                              alt={dj.alt}
                              fill
                              className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                              style={{ objectPosition: 'center center' }}
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 flex-col gap-2">
                              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm text-center px-4">Image loading...</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                            <span>Image not available</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <CardHeader className="p-4 sm:p-6 md:p-6 lg:p-8 bg-gray-900 flex flex-col justify-start pb-20 sm:pb-6 md:pb-6 lg:pb-8">
                        <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 text-white font-bold">{dj.name}</CardTitle>
                        <p className="text-sm sm:text-base text-gray-200 mb-3 sm:mb-4 leading-relaxed">{dj.bio}</p>
                        
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
                              <div className="text-base sm:text-lg text-gray-100 leading-relaxed space-y-6 prose prose-lg max-w-none">
                                {(() => {
                                  const parts = dj.fullBio.split('---');
                                  const bioText = parts[0];
                                  const testimonialsText = parts[1];
                                  
                                  return (
                                    <>
                                      {/* Biography paragraphs */}
                                      {bioText.split('\n\n').filter(p => p.trim() && !p.includes('**Recent Testimonials**')).map((paragraph, index) => {
                                        // Check for markdown links [text](url)
                                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                                        const parts = [];
                                        let lastIndex = 0;
                                        let match;
                                        
                                        while ((match = linkRegex.exec(paragraph)) !== null) {
                                          // Add text before the link
                                          if (match.index > lastIndex) {
                                            parts.push(paragraph.substring(lastIndex, match.index));
                                          }
                                          // Add the link
                                          parts.push(
                                            <Link key={match.index} href={match[2]} className="text-champagne-gold hover:text-champagne-gold/80 underline">
                                              {match[1]}
                                            </Link>
                                          );
                                          lastIndex = match.index + match[0].length;
                                        }
                                        
                                        // Add remaining text after last link
                                        if (lastIndex < paragraph.length) {
                                          parts.push(paragraph.substring(lastIndex));
                                        }
                                        
                                        return (
                                          <p key={index} className="mb-4 leading-relaxed text-gray-100">
                                            {parts.length > 0 ? parts : paragraph}
                                          </p>
                                        );
                                      })}
                                      
                                      {/* Testimonials section from fullBio */}
                                      {testimonialsText && (
                                        <div className="mt-8 pt-6 border-t-2 border-champagne-gold/30">
                                          <h3 className="text-2xl font-bold text-white mb-6">Recent Testimonials</h3>
                                          <div className="space-y-6">
                                            {testimonialsText.split(/\*\*([^*]+)\*\*/).filter((section, idx) => idx % 2 === 1 && section.trim() && !section.includes('Recent Testimonials')).map((venue, idx) => {
                                              const fullSection = testimonialsText.split(`**${venue}**`)[1]?.split('**')[0] || '';
                                              const lines = fullSection.split('\n').filter(l => l.trim());
                                              const quoteLines = lines.filter(l => !l.includes('—') && !l.includes('-') && l.trim() && !l.match(/^[A-Z][a-z]+ & [A-Z]/));
                                              const quote = quoteLines.join(' ').replace(/^"/, '').replace(/"$/, '').trim();
                                              const authorLine = lines.find(l => l.includes('—') || (l.includes(',') && l.match(/^[A-Z]/)));
                                              const author = authorLine ? authorLine.replace(/^—\s*/, '').replace(/^-\s*/, '').trim() : '';
                                              
                                              return (
                                                <div key={idx} className="p-6 bg-gradient-to-br from-champagne-gold/5 to-yellow-400/5 rounded-lg border border-champagne-gold/20 shadow-sm">
                                                  <h4 className="text-lg font-bold text-champagne-gold mb-3">{venue}</h4>
                                                  {quote && <p className="text-gray-200 italic mb-3 leading-relaxed">"{quote}"</p>}
                                                  {author && <p className="text-gray-300 text-sm font-medium">— {author}</p>}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Dynamic Testimonials Section - Pulled from reviews/testimonials */}
                                      {(() => {
                                        const djTestimonials = getDJTestimonials(dj.name);
                                        if (djTestimonials.length === 0) return null;
                                        
                                        return (
                                          <div className="mt-8 pt-6 border-t-2 border-champagne-gold/30">
                                            <div className="flex items-center gap-2 mb-6">
                                              <Quote className="w-6 h-6 text-champagne-gold" strokeWidth={2} />
                                              <h3 className="text-2xl font-bold text-white">Client Testimonials</h3>
                                            </div>
                                            <div className="space-y-4">
                                              {djTestimonials.slice(0, 5).map((testimonial, idx) => (
                                                <div
                                                  key={idx}
                                                  className="p-5 bg-gradient-to-br from-champagne-gold/5 to-yellow-400/5 rounded-lg border border-champagne-gold/20 shadow-sm hover:border-champagne-gold/40 transition-colors"
                                                >
                                                  <p className="text-gray-200 italic mb-3 leading-relaxed">
                                                    &quot;{testimonial.quote}&quot;
                                                  </p>
                                                  <div className="flex items-center justify-between pt-2 border-t border-champagne-gold/20">
                                                    <p className="text-champagne-gold font-semibold text-sm">
                                                      {testimonial.author}
                                                    </p>
                                                    {'venueUrl' in testimonial && testimonial.venueUrl ? (
                                                      <Link
                                                        href={testimonial.venueUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-champagne-gold text-xs transition-colors"
                                                      >
                                                        {testimonial.venue}
                                                      </Link>
                                                    ) : (
                                                      <p className="text-gray-400 text-xs">{testimonial.venue}</p>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                              {djTestimonials.length > 5 && (
                                                <p className="text-gray-400 text-sm italic text-center pt-2">
                                                  And {djTestimonials.length - 5} more testimonial{djTestimonials.length - 5 !== 1 ? 's' : ''}...
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </>
                                  );
                                })()}
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        
                        <div className="mb-4">
                          <h4 className="font-bold mb-2 text-white text-xs sm:text-sm uppercase tracking-wider">Mixing Style:</h4>
                          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-champagne-gold/20 to-yellow-400/20 text-champagne-gold rounded-full text-xs sm:text-sm font-semibold border border-champagne-gold/40 shadow-sm">
                            {dj.mixingStyle}
                          </span>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-white text-xs sm:text-sm uppercase tracking-wider">Watch</h4>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/10 shadow-lg">
                              <LazyIframe
                                src={dj.youtubeEmbed}
                                title={`${dj.name} - Video`}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-white text-xs sm:text-sm uppercase tracking-wider">Listen</h4>
                            <div className="space-y-3">
                              {dj.mixcloudEmbeds && dj.mixcloudEmbeds.length > 0 ? (
                                dj.mixcloudEmbeds.map((embed, index) => (
                                  <div
                                    key={index}
                                    className="relative w-full rounded-lg overflow-hidden bg-black/10 shadow-lg hover:shadow-xl transition-shadow"
                                    style={{ height: '60px' }}
                                  >
                                    <LazyIframe
                                      src={embed}
                                      title={`${dj.name} - Mix ${index + 1}`}
                                      className="absolute inset-0 w-full h-full"
                                      allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
                                      frameBorder="0"
                                      height="60px"
                                    />
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-600 rounded-lg">
                                  Mixcloud mixes coming soon
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </div>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Fun Video Gallery - Portrait Style */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">The Fun We Create</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans mb-3 sm:mb-4 text-white font-bold px-4">
              See The <span className="text-gradient">Party In Action</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Watch how our DJs create unforgettable moments and get everyone dancing
            </p>
          </motion.div>

          {/* Portrait Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { id: "5VChJyJMIfs", title: "DJ performance and crowd energy" },
              { id: "EPq35ZF1Awc", title: "Wedding party dance floor excitement" },
              { id: "3TnzdP0IhTU", title: "Celebration moments and guest reactions" },
              { id: "iGCx-ZzMMtw", title: "Fun party atmosphere and music mixing" },
            ].map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-2 border-champagne-gold/30 shadow-xl overflow-hidden hover:border-champagne-gold/60 transition-all duration-300 hover:shadow-2xl h-full">
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-[9/16] rounded-t-lg overflow-hidden bg-gray-900">
                      <LazyIframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={`${video.title} - Stylish Entertainment DJ Services`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                      {/* Refined Play Icon Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none flex items-center justify-center">
                        <div className="relative">
                          {/* Outer glow ring */}
                          <div className="absolute inset-0 bg-champagne-gold/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-300"></div>
                          {/* Play button circle */}
                          <div className="relative bg-champagne-gold/95 backdrop-blur-sm rounded-full p-4 md:p-5 shadow-2xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                            <Play 
                              className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" 
                              fill="currentColor"
                              strokeWidth={2}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Subtle corner indicator */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <Play className="w-4 h-4 text-champagne-gold" fill="currentColor" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Does It Work */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 px-4 py-1 bg-champagne-gold/10 rounded-full border border-champagne-gold/30">
              <span className="text-xs font-semibold text-champagne-gold tracking-wider uppercase">Booking Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-6 text-white font-bold px-4">
              How Does It <span className="text-gradient">Work?</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-champagne-gold/30 bg-gray-800 shadow-lg mb-8">
              <CardContent className="p-8 sm:p-10 md:p-12">
                <div className="space-y-6 text-gray-100 leading-relaxed">
                  <p className="text-lg sm:text-xl">
                    When you contact us with your date, location and timings we will email you a quote based on current availability. If you wish to book, we will email a booking form and we will arrange for you to speak with your chosen DJ (to make sure they are the right person for you) before you book or near your party date.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="border-champagne-gold/30 bg-gray-800 shadow-lg">
              <CardContent className="p-8 sm:p-10 md:p-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                  Our Service Areas
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center mb-6">
                  Our party DJs and mobile DJs play in the following locations:
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {[
                    "London", "Bristol", "Bath", "Birmingham", "Somerset", "Wiltshire",
                    "Devon", "Dorset", "Oxford", "Cardiff", "Surrey", "Gloucestershire",
                    "Essex", "Sussex", "Exeter", "South Wales"
                  ].map((location, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-800/80 text-white rounded-full text-sm sm:text-base font-medium border border-champagne-gold/30 hover:bg-champagne-gold/20 hover:border-champagne-gold/50 transition-all cursor-default shadow-sm"
                    >
                      {location}
                    </span>
                  ))}
                </div>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center mt-6 italic">
                  And other areas of the UK and Europe by request.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Venues We've Played At */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-8"
          >
            <Card className="border-champagne-gold/30 bg-gray-800/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 sm:p-10 md:p-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                  Venues We've Played At
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center mb-6">
                  Check if we've performed at your venue. Search by venue name or location.
                </p>
                
                {/* Search Input */}
                <div className="relative mb-6 max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search venues..."
                    value={venueSearch}
                    onChange={(e) => setVenueSearch(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-champagne-gold/30 text-white placeholder:text-gray-500 focus:border-champagne-gold/60"
                  />
                </div>

                {/* Venues List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allVenues
                    .filter((venue) => 
                      venue.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
                      venue.location.toLowerCase().includes(venueSearch.toLowerCase())
                    )
                    .map((venue, index) => (
                      <motion.div
                        key={`${venue.name}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.01 }}
                        className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-champagne-gold/20 hover:border-champagne-gold/40 hover:bg-gray-900/70 transition-all"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">{venue.name}</p>
                          {venue.location && (
                            <p className="text-gray-400 text-sm">{venue.location}</p>
                          )}
                        </div>
                        {venue.url && (
                          <Link
                            href={venue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-champagne-gold hover:text-champagne-gold/80 text-sm font-medium ml-4 transition-colors"
                          >
                            View →
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  {allVenues.filter((venue) => 
                    venue.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
                    venue.location.toLowerCase().includes(venueSearch.toLowerCase())
                  ).length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      No venues found. Try a different search term.
                    </p>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 text-center mt-6 italic">
                  Don't see your venue? We'd love to play there! Contact us to discuss your date.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Card className="border-2 border-champagne-gold/50 bg-gray-800 shadow-xl">
              <CardContent className="p-8 sm:p-10">
                <p className="text-xl sm:text-2xl font-bold text-white mb-6">
                  Please Contact us for a free quote based on your location and timings.
                </p>
                <Button asChild size="lg" className="bg-champagne-gold text-black hover:bg-champagne-gold/90 hover:scale-105 transition-all duration-300 shadow-lg">
                  <Link href="/contact-us">Get Your Free Quote</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-20 pb-8 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Ready to book your perfect match?
            </h2>
            <Button asChild size="lg">
              <Link href="/contact-us">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
