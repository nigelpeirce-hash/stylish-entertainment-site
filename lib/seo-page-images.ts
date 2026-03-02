/**
 * Image assets for SEO landing pages (luxury-wedding-entertainment-south-west,
 * wedding-production-london, wedding-dj-somerset, wedding-dj-bath, wedding-dj-bristol).
 * Swap URLs here to change images without editing page components.
 * All URLs use Cloudinary with f_auto,q_85,dpr_auto for optimization.
 */
const C = "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_85,dpr_auto";

export type SeoPageImageSet = {
  hero: { src: string; alt: string };
  imageStrip: Array<{ src: string; alt: string }>;
  featureImage: { src: string; alt: string };
};

export const seoPageImages: Record<string, SeoPageImageSet> = {
  "luxury-wedding-entertainment-south-west": {
    hero: {
      src: `${C}/v1768736010/The-Newt-Somerset-with-our-Fairy-Light-Tunnel-installed-for-their-first-wedding_xwmaca.jpg`,
      alt: "Fairy light tunnel at The Newt in Somerset—luxury wedding production and lighting design in the South West.",
    },
    imageStrip: [
      { src: `${C}/v1768162531/Mells-Barn-Fairy-lights-in-ceiling_t8xe8k.jpg`, alt: "Mells Barn Somerset with fairy light ceiling—wedding venue lighting." },
      { src: `${C}/v1768734676/RosedewFarmWeddingPhotography-EmmaSam-562_aqtw3u.jpg`, alt: "Rosedew Farm wedding with elegant lighting and atmosphere—South West wedding." },
      { src: `${C}/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg`, alt: "Pennard House festoon lighting—South West wedding venue styling." },
    ],
    featureImage: {
      src: `${C}/80EF72DA-E9D2-4CC9-9AAE-6AF923A5481E_1_102_a_efp2sw`,
      alt: "Fairy light tunnel entrance—luxury wedding production and venue styling in the South West.",
    },
  },
  "wedding-production-london": {
    hero: {
      src: `${C}/v1768163768/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg`,
      alt: "Elegant wedding reception with atmospheric lighting—London and Home Counties wedding production.",
    },
    imageStrip: [
      { src: `${C}/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg`, alt: "Lighting design at Kings Weston House—premium wedding venue." },
      { src: `${C}/v1768163633/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg`, alt: "Wedding reception with stunning atmospheric lighting—London wedding entertainment." },
      { src: `${C}/v1768163790/Party-dj-with-lazer_wnhreb.jpg`, alt: "Wedding DJ with professional lighting—high-end event production." },
    ],
    featureImage: {
      src: `${C}/v1768731827/Camilla-Richard-0063_ngmblz.jpg`,
      alt: "Wedding celebration with elegant lighting and dance floor—London wedding production.",
    },
  },
  "wedding-dj-somerset": {
    hero: {
      src: `${C}/v1768163392/Mells_Barn_LED_lighting-transformed-e1698060379974_geh36y.jpg`,
      alt: "Mells Barn Somerset with LED lighting—wedding DJ and production in Somerset.",
    },
    imageStrip: [
      { src: `${C}/v1768163679/IMG_3094-1_aiyu5i.jpg`, alt: "Somerset wedding venue with fairy lights and styling." },
      { src: `${C}/v1768734676/RosedewFarmWeddingPhotography-EmmaSam-562_aqtw3u.jpg`, alt: "Rosedew Farm wedding—Somerset wedding DJ and entertainment." },
      { src: `${C}/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg`, alt: "Pennard House Somerset—wedding venue and lighting." },
    ],
    featureImage: {
      src: `${C}/v1768163785/Nigel-DJ-Babs-House-0002-1_ktgbaf.jpg`,
      alt: "Wedding DJ performing with elegant lighting—Somerset wedding entertainment.",
    },
  },
  "wedding-dj-bath": {
    hero: {
      src: `${C}/v1768163641/Pennard-House-Festoon-Pizzarova_rpdwep.jpg`,
      alt: "Pennard House festoon lighting—Bath area wedding DJ and venue styling.",
    },
    imageStrip: [
      { src: `${C}/v1768163679/IMG_3094-1_aiyu5i.jpg`, alt: "Elegant wedding styling—Bath wedding entertainment." },
      { src: `${C}/v1768163734/F4R3490_dyrug0.jpg`, alt: "Wedding reception with atmospheric lighting—Bath area wedding." },
      { src: `${C}/v1768162531/Mells-Barn-Fairy-lights-in-ceiling_t8xe8k.jpg`, alt: "Fairy light ceiling—Bath and South West wedding venue." },
    ],
    featureImage: {
      src: `${C}/v1768731827/Camilla-Richard-0063_ngmblz.jpg`,
      alt: "Wedding celebration with refined lighting—Bath wedding DJ and production.",
    },
  },
  "wedding-dj-bristol": {
    hero: {
      src: `${C}/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg`,
      alt: "Lighting design at Kings Weston House—Bristol area wedding DJ and production.",
    },
    imageStrip: [
      { src: `${C}/v1768163790/Party-dj-with-lazer_wnhreb.jpg`, alt: "Wedding DJ with professional lighting—Bristol wedding entertainment." },
      { src: `${C}/v1768163679/IMG_3094-1_aiyu5i.jpg`, alt: "Wedding venue with elegant styling—Bristol and South West." },
      { src: `${C}/v1768163768/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg`, alt: "Wedding reception atmosphere—Bristol wedding DJ." },
    ],
    featureImage: {
      src: `${C}/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg`,
      alt: "Marquee lighting and wedding production—Bristol and South West events.",
    },
  },
};

export function getSeoPageImages(pageKey: string): SeoPageImageSet | null {
  return seoPageImages[pageKey] ?? null;
}
