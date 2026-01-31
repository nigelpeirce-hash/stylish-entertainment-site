"use client";

import { motion } from "framer-motion";
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
  // Additional venues from testimonials and DJ profiles
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
  // Additional venues from DJ Nige's page
  { name: "Glastonbury Festival", url: "https://www.glastonburyfestivals.co.uk/" },
  // Additional venues from new testimonials
  "Almonry Barn, Somerset",
  "Penarth Pier Pavilion, Wales",
  { name: "Kingscote Barn, Gloucestershire", url: "https://www.kingscotebarn.co.uk/" },
  "Hatton Hall, Warwickshire",
  { name: "The Assembly Rooms, Bath", url: "https://www.assemblyroomsbath.co.uk/" },
  "The Penny Farthing Cafe Bar, Cowbridge, Wales",
  "Ruscombe, Berkshire",
  "Braintree, Essex",
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
      {/* Venues List */}
      <section className="pt-20 pb-8 px-3 sm:px-4 bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">
              Our <span className="text-gradient">Venues</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Trusted by prestigious venues across the UK and Europe
            </p>
          </motion.div>

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
