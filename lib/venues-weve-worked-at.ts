/**
 * Shared "Venues We've Worked At" list.
 * Used by: DJ page (/artists/djs), admin venue autocomplete (GET /api/admin/venues).
 * Keep in sync with both.
 */

type VenueItem = string | { name: string; url?: string };

const VENUES_RAW: VenueItem[] = [
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

export interface FormattedVenue {
  name: string;
  location: string;
  url?: string;
}

function formatOne(venue: VenueItem): FormattedVenue {
  if (typeof venue === "string") {
    const parts = venue.split(",").map((p) => p.trim());
    if (parts.length > 1) {
      return { name: parts[0], location: parts.slice(1).join(", "), url: undefined };
    }
    return { name: venue, location: "", url: undefined };
  }
  const nameParts = venue.name.split(",").map((p) => p.trim());
  if (nameParts.length > 1) {
    return {
      name: nameParts[0],
      location: nameParts.slice(1).join(", "),
      url: venue.url,
    };
  }
  return { name: venue.name, location: "", url: venue.url };
}

/** Sorted list for DJ page "Venues We've Played At". */
export function getVenuesWeveWorkedAt(): FormattedVenue[] {
  const formatted = VENUES_RAW.map(formatOne);
  return formatted.sort((a, b) => {
    const nameA = a.name.replace(/^The /i, "").toLowerCase();
    const nameB = b.name.replace(/^The /i, "").toLowerCase();
    return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
  });
}

/** For admin venue API: { venueName, venuePostcode }[] (postcode null). Deduped by venueName. */
export function getVenueNamesForAdmin(): { venueName: string; venuePostcode: null }[] {
  const list = getVenuesWeveWorkedAt();
  const seen = new Set<string>();
  return list
    .filter((v) => {
      const key = v.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((v) => ({
      venueName: v.location ? `${v.name}, ${v.location}` : v.name,
      venuePostcode: null as null,
    }));
}
