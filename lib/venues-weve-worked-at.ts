/**
 * Shared "Venues We've Worked At" list.
 * Used by: DJ page (/artists/djs), admin venue autocomplete (GET /api/admin/venues).
 * Keep in sync with both.
 */

type VenueItem = string | { name: string; url?: string };

const VENUES_RAW: VenueItem[] = [
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
  { name: "Glastonbury Festival", url: "https://www.glastonburyfestivals.co.uk/" },
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
