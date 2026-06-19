"use client";

import { motion } from "@/lib/motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Featured venues from homepage - these link to our dedicated venue pages
const featuredVenues = [
  { name: "Babington House", url: "/venues/babington-house", internal: true },
  { name: "Kin House", url: "/kin-house-wiltshire", internal: true },
  { name: "Pennard House", url: "/venues/pennard-house", internal: true },
  { name: "Mells Barn", url: "/venues/mells-barn", internal: true },
];

const venuesUnsorted = [
  { name: "Monaco Yacht Club", url: "https://yacht-club-monaco.mc/en/home/" },
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
  { name: "The Great Tythe Barn, Tetbury", url: "https://www.gtb.co.uk/" },
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
  { name: "The Manor House, Castle Combe", url: "https://www.exclusive.co.uk/the-manor-house/" },
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
  { name: "Northover Manor", url: "https://www.northovermanor.com/" },
  { name: "Boconnoc Estate", url: "https://www.boconnoc.com/" },
  // Additional venues from testimonials and DJ profiles
  { name: "Rockingham Castle", url: "https://www.rockinghamcastle.com/" },
  "Queen Mary University, London",
  { name: "Town Hall Hotel, London", url: "https://www.townhallhotel.com/" },
  { name: "The Wellington Arms, Basingstoke", url: "https://www.thewellingtonarms.com/" },
  { name: "Wick Farm, Bath", url: "https://www.wickfarm.co.uk/" },
  { name: "Parklands Quendon Hall, Essex", url: "https://quendonhall.co.uk/" },
  { name: "Dene Farm, Hampshire", url: "https://www.denefarm.co.uk/" },
  { name: "Cutteridge Barns, Trowbridge", url: "https://www.cutteridgeweddings.co.uk/" },
  { name: "Brympton House", url: "https://www.brymptonhouse.co.uk/" },
  { name: "Cripps Barn", url: "https://www.crippsbarn.co.uk/" },
  { name: "Tall Johns, South Wales", url: "https://www.talljohnshouse.com/" },
  { name: "The Royal Yacht Club", url: "https://www.rlyc.org.uk/" },
  { name: "The Newt in Somerset", url: "https://www.thenewtinsomerset.com/" },
  // Additional venues from DJ Nige's page
  { name: "Glastonbury Festival", url: "https://www.glastonburyfestivals.co.uk/" },
  // Additional venues from new testimonials
  { name: "Almonry Barn, Somerset", url: "https://almonrybarnsomerset.com/" },
  "Penarth Pier Pavilion, Wales",
  { name: "Kingscote Barn, Gloucestershire", url: "https://www.kingscotebarn.co.uk/" },
  "Hatton Hall, Warwickshire",
  { name: "The Assembly Rooms, Bath", url: "https://www.assemblyroomsbath.co.uk/" },
  "The Penny Farthing Cafe Bar, Cowbridge, Wales",
  "Ruscombe, Berkshire",
  "Braintree, Essex",
  // Additional venues from 2012–2013 testimonials
  "Westwood Village Hall",
  { name: "Kingscote House, Tetbury", url: "https://www.kingscotehouse.co.uk/" },
  { name: "Pennsylvania Castle, Dorset", url: "https://www.pennsylvaniacastle.co.uk/" },
  { name: "Brooklands Motor Museum, Surrey", url: "https://www.brooklandsmuseum.com/" },
  { name: "1 Lombard Street, London", url: "https://www.1lombardstreet.com/" },
  { name: "Lantallack, Cornwall", url: "https://www.lantallack.co.uk/" },
  { name: "The Clifton Club, Bristol", url: "https://www.thecliftonclub.co.uk/" },
  { name: "The Victorian Barn, Dorset", url: "https://www.thevictorianbarn.co.uk/" },
  { name: "Hassop Hall, Derbyshire", url: "https://www.hassophall.co.uk/" },
  { name: "Sheldon Manor, Chippenham", url: "https://www.sheldonmanor.co.uk/" },
  "North Dorset Rugby Club",
  // Additional venues from 2013 testimonials
  { name: "The Brewery, London", url: "https://www.thebrewerylondon.co.uk/" },
  { name: "Warwick Castle, Warwickshire", url: "https://www.warwick-castle.com/" },
  { name: "Bix Manor, Henley on Thames", url: "https://www.bixmanor.co.uk/" },
  { name: "Danesfield House, Marlow", url: "https://www.danesfieldhouse.co.uk/" },
  { name: "Russets Country House, Chiddingfold", url: "https://www.russetscountryhouse.co.uk/" },
  { name: "Well Barn, Shoot Lodge, Oxfordshire", url: "https://www.wellbarn.co.uk/" },
  { name: "The Paintworks, Bristol", url: "https://www.thepaintworks.co.uk/" },
  { name: "Aynhoe Park, Oxfordshire", url: "https://aynhoepark.co.uk/" },
  // Additional venues from 2013–2014 testimonials
  { name: "Polurrian Bay Hotel, Mullion", url: "https://www.polurrianbay.com/" },
  { name: "Rhinefield House Hotel, Dorset", url: "https://www.rhinefieldhouse.co.uk/" },
  { name: "Compton Hall, Surrey", url: "https://www.comptonhall.co.uk/" },
  { name: "Stoke Park, Buckinghamshire", url: "https://www.stokepark.com/" },
  { name: "Friars Court, Clanfield", url: "https://www.friarscourt.co.uk/" },
  { name: "Oxford Town Hall", url: "https://www.oxfordtownhall.co.uk/" },
  { name: "The Bingham Hotel, Richmond", url: "https://www.thebingham.co.uk/" },
  // Additional venues from 2014–2015 testimonials
  { name: "Stone Barn, Aldsworth", url: "https://www.stonebarnaldsworth.co.uk/" },
  { name: "The In and Out Club, London", url: "https://www.theinandout.co.uk/" },
  { name: "Cadhay House, Devon", url: "https://www.cadhay.co.uk/" },
  { name: "The Nave, London N1", url: "https://www.thenave.co.uk/" },
  { name: "Rivervale Barn, Yateley", url: "https://www.rivervalebarn.co.uk/" },
  // Additional venues from 2015 testimonials
  { name: "The Pig, Bath", url: "https://www.thepighotel.com/bath" },
  { name: "Mells Manor, Somerset", url: "https://www.mellsmanor.co.uk/" },
  { name: "The Letchworth Centre for Healthy Living", url: "https://www.letchworthcentre.org/" },
  { name: "Uggeshall Hall, Suffolk", url: "https://www.uggeshallhall.co.uk/" },
  { name: "Shilstone Manor, Devon", url: "https://www.shilstonemanor.co.uk/" },
  { name: "Priory Barn, Hertfordshire", url: "https://www.priorybarn.com/" },
  { name: "The Hoste, Burnham Market", url: "https://www.thehoste.com/" },
  { name: "The Jam Factory, Oxford", url: "https://www.thejamfactoryoxford.co.uk/" },
  { name: "Wentworth Estate, Virginia Water", url: "https://www.wentworthestate.org.uk/" },
  // Additional venues from 2016-2017 testimonials
  { name: "Revolution, Richmond", url: "https://www.revolution-bars.co.uk/" },
  { name: "Chigwell Hall, Essex", url: "https://chigwellhall.com/" },
  { name: "Pythouse Kitchen Garden, Tisbury", url: "https://www.pythousekitchengarden.co.uk/" },
  { name: "Huntsham Court, Devon", url: "https://www.huntshamcourt.co.uk/" },
  { name: "Ham Yard Hotel, London", url: "https://www.firmdalehotels.com/hotels/london/ham-yard-hotel/" },
  { name: "The Red Barn, Blindley Heath", url: "https://www.theredbarnblindleyheath.co.uk/" },
  "Llanfair Court, Abergavenny",
  { name: "Swallows Nest Barn, Sherbourne", url: "https://www.swallowsnestbarn.co.uk/" },
  "Battleaxes, Wraxall, Bristol",
  { name: "Morden Hall, Morden", url: "https://mordenhall.com/" },
  { name: "Devonshire Terrace, London EC2", url: "https://www.drakeandmorgan.co.uk/devonshire-terrace/" },
];

// Sort venues alphabetically by name
const venues = venuesUnsorted.sort((a, b) => {
  const nameA = typeof a === 'string' ? a : a.name;
  const nameB = typeof b === 'string' ? b : b.name;
  return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
});

export default function VenuesClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto,w_1200/v1768741340/_F4R3275_tukoww.jpg"
            alt="Festoon and fairy-light styling at Babington House — prestigious UK wedding venue"
            fill
            className="object-cover object-center opacity-50 brightness-110"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/30 to-gray-900" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">
            Our <span className="text-gradient">Venues</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white font-semibold max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-md">
            Trusted by prestigious venues across the UK and Europe
          </p>
        </motion.div>
      </section>

      {/* Venues List */}
      <section className="pt-20 pb-8 px-3 sm:px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          {/* Featured Venues Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">Featured Venues</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {featuredVenues.map((venue, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-champagne-gold/20 to-transparent border-2 border-champagne-gold/50 h-full hover:border-champagne-gold/70 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <Link
                        href={venue.url}
                        className="text-white hover:text-champagne-gold transition-colors text-base sm:text-lg font-semibold block"
                        target={venue.url.startsWith('http') ? '_blank' : undefined}
                        rel={venue.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {venue.name}
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All Venues Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">All Venues</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {venues.map((venue, index) => {
              const venueName = typeof venue === 'string' ? venue : venue.name;
              const venueUrl = typeof venue === 'object' ? venue.url : null;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.02 }}
                >
                  <Card className="bg-gray-900 border-champagne-gold/30 h-full hover:border-champagne-gold/60 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      {venueUrl ? (
                        <Link
                          href={venueUrl}
                          target={venueUrl.startsWith('http') ? '_blank' : undefined}
                          rel={venueUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-gray-300 hover:text-champagne-gold transition-colors text-sm sm:text-base font-medium block"
                        >
                          {venueName}
                        </Link>
                      ) : (
                        <p className="text-gray-300 text-sm sm:text-base font-medium">
                          {venueName}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
