"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import Link from "next/link";

const venuesUnsorted = [
  "Monaco Yacht Club",
  "Maritime Museum Amsterdam",
  { name: "Babington House Hotel, Soho House", url: "https://www.sohohouse.com/houses/babington-house" },
  { name: "Goodwood House, Sussex", url: "https://www.goodwood.com/" },
  { name: "Hotel Tresanton Cornwall", url: "https://www.tresanton.com/" },
  { name: "Cowley Manor", url: "https://www.cowleymanor.com/" },
  { name: "Berkeley Castle", url: "https://www.berkeley-castle.com/" },
  { name: "Coombe Lodge", url: "https://www.coombelodge.co.uk/" },
  { name: "Priston Mill", url: "https://www.pristonmill.co.uk/" },
  { name: "The Chapel, Bruton", url: "https://www.thechapelbruton.co.uk/" },
  { name: "The Roth Bar & Grill", url: "https://www.hauserwirth.com/visit/roth-bar-grill/" },
  { name: "Orchardleigh Estate", url: "https://www.orchardleigh.com/" },
  { name: "Elmhay Park", url: "https://www.orchardleigh.com/" },
  { name: "North Cadbury Court", url: "https://www.northcadburycourt.co.uk/" },
  { name: "The Assembly Rooms, Bath", url: "https://www.bathassemblyrooms.org.uk/" },
  { name: "Barnsley House", url: "https://www.barnsleyhouse.com/" },
  { name: "Pembroke Lodge, Richmond Park", url: "https://www.pembroke-lodge.co.uk/" },
  { name: "Yarlington House", url: "https://www.yarlingtonhouse.co.uk/" },
  { name: "Lulworth Castle", url: "https://www.lulworth.com/" },
  "The Imperial",
  { name: "Charlton House, Shepton Mallet", url: "https://www.charltonhouse.co.uk/" },
  { name: "Easnor Castle", url: "https://www.eastnorcastle.com/" },
  { name: "The Great Tythe Barn, Tetbury", url: "https://www.greattythebarn.co.uk/" },
  { name: "Euridge Manor", url: "https://www.euridgemanor.co.uk/" },
  { name: "Sessions Art Club London", url: "https://sessionsartsclub.com/" },
  "Many private addresses",
  { name: "Calcot Manor", url: "https://www.calcot.co/" },
  { name: "Cardiff City Hall", url: "https://www.cardiffcityhall.com/" },
  { name: "Cardiff Castle", url: "https://www.cardiffcastle.com/" },
  { name: "Athelhampton House", url: "https://www.athelhampton.co.uk/" },
  { name: "Homewood Park", url: "https://www.homewoodpark.co.uk/" },
  { name: "Shilstone Manor", url: "https://www.shilstonemanor.co.uk/" },
  { name: "Pentille Castle", url: "https://www.pentillie.co.uk/" },
  { name: "Stoke Place", url: "https://www.stokeplace.com/" },
  { name: "St Stephen's Hampstead", url: "https://www.ststephenshampstead.org.uk/" },
  { name: "St George's Bristol", url: "https://www.stgeorgesbristol.co.uk/" },
  { name: "Gant's Mill", url: "https://www.gantsmill.co.uk/" },
  { name: "The Manor Castle Coombe", url: "https://www.manorhousecastlecombe.co.uk/" },
  { name: "Elmore Court", url: "https://www.elmorecourt.com/" },
  "Revolution",
  { name: "The Mayfair Hotel", url: "https://www.themayfairhotel.co.uk/" },
  { name: "Dewsall Court", url: "https://www.dewsallcourt.co.uk/" },
  { name: "Polhawn Fort", url: "https://www.polhawnfort.co.uk/" },
  { name: "Syrencot", url: "https://www.syrencot.co.uk/" },
  { name: "Bailbrook House", url: "https://www.bailbrookhouse.co.uk/" },
  { name: "The Gathering Barn", url: "https://www.thegatheringbarn.co.uk/" },
  { name: "Thames Rowing Club", url: "https://www.thamesrc.co.uk/" },
  { name: "Hampton Court House", url: "https://www.hamptoncourthouse.co.uk/" },
  { name: "Hestercombe Gardens", url: "https://www.hestercombe.com/" },
  { name: "Pencarrow Estate", url: "https://www.pencarrow.co.uk/" },
  { name: "Northover Manor", url: "https://www.northovermanor.co.uk/" },
  { name: "Boconnoc Estate", url: "https://www.boconnoc.com/" },
];

// Sort venues alphabetically by name
const venues = venuesUnsorted.sort((a, b) => {
  const nameA = typeof a === 'string' ? a : a.name;
  const nameB = typeof b === 'string' ? b : b.name;
  return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
});

export default function Venues() {
  useEffect(() => {
    document.title = "Venues | Trusted Wedding Venues | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Stylish Entertainment has provided entertainment and production services at prestigious venues across the UK and Europe including Babington House, Goodwood House, Cardiff Castle, and many more.");
    }
  }, []);

  return (
    <div>
      {/* Venues List */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
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
                          target="_blank"
                          rel="noopener noreferrer"
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
