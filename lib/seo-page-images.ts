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
      src: `${C}/v1768163371/Lighting-Design-at-Kings-Weston-House_qxzunv.jpg`,
      alt: "Dramatic production lighting at a South West venue—luxury wedding production and lighting design.",
    },
    imageStrip: [
      { src: `${C}/v1768163779/Dj-Sax-Bongos_zlozkq.jpg`, alt: "DJ with sax and percussion—live wedding entertainment in the South West." },
      { src: `${C}/v1768731827/Camilla-Richard-0063_ngmblz.jpg`, alt: "Styled reception with elegant lighting—luxury South West wedding." },
      { src: `${C}/v1768162258/Fairy-light-Tunnel_sc40ed.jpg`, alt: "Dramatic fairy light tunnel—wedding production and venue styling in the South West." },
    ],
    featureImage: {
      src: `${C}/v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg`,
      alt: "DJ and sax performance—luxury wedding production and live entertainment in the South West.",
    },
  },
  "wedding-production-london": {
    hero: {
      src: `${C}/v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg`,
      alt: "Sophisticated dance floor with DJ and sax—London and Home Counties wedding production.",
    },
    imageStrip: [
      { src: `${C}/v1768741948/Saltburn_231005__0020_0640_nmzjp6.jpg`, alt: "Elegant venue with refined lighting—London wedding production." },
      { src: `${C}/v1768163768/MartinBeddallPhotography02-e1530632660291_pabjzl.jpg`, alt: "Black tie wedding reception with atmospheric lighting—London wedding entertainment." },
      { src: `${C}/v1768163633/EmilyTomWedding-JonnyBarrattPhotography605-scaled-e1640779326843_ozksuz.jpg`, alt: "Sophisticated wedding reception—London and Home Counties." },
    ],
    featureImage: {
      src: `${C}/v1768731827/Camilla-Richard-0063_ngmblz.jpg`,
      alt: "Elegant wedding celebration and dance floor—London wedding production.",
    },
  },
  "wedding-dj-somerset": {
    hero: {
      src: `${C}/v1768734676/RosedewFarmWeddingPhotography-EmmaSam-562_aqtw3u.jpg`,
      alt: "Barn wedding at dusk with warm atmosphere—Somerset wedding DJ and production.",
    },
    imageStrip: [
      { src: `${C}/v1768163700/Pennard-House_koaxfj.jpg`, alt: "Countryside estate lighting—Somerset wedding venue." },
      { src: `${C}/v1768162531/Mells-Barn-Fairy-lights-in-ceiling_t8xe8k.jpg`, alt: "Warm fairy light atmosphere at Mells Barn—Somerset wedding." },
      { src: `${C}/v1768163785/Nigel-DJ-Babs-House-0002-1_ktgbaf.jpg`, alt: "Fairy lights and festoon—Somerset wedding venue styling." },
    ],
    featureImage: {
      src: `${C}/v1768163783/Jade-and-Emma-0048_y2uzdn.jpg`,
      alt: "Warm fairy light tunnel at The Newt in Somerset—wedding DJ and production.",
    },
  },
  "wedding-dj-bath": {
    hero: {
      src: `${C}/v1768162651/Party-DJ-with-hands-in-the-air_usg7yx.jpg`,
      alt: "Elegant ballroom interior—Bath area wedding DJ and refined venue styling.",
    },
    imageStrip: [
      { src: `${C}/v1768163549/Dj-Sax-Bongos0_uufzvk.jpg`, alt: "Elegant Orangery venue with refined lighting—Bath wedding entertainment." },
      { src: `${C}/v1768733441/Babington-House-Bar-with-DJ-Niges-setup_zdgqtq.jpg`, alt: "Refined candlelit reception styling—Bath wedding." },
      { src: `${C}/v1768163223/Nigel-DJ-Babs-House-0019_y4rjks.jpg`, alt: "Elegant reception with atmospheric lighting—Bath area wedding." },
    ],
    featureImage: {
      src: `${C}/v1768731827/Camilla-Richard-0063_ngmblz.jpg`,
      alt: "Refined wedding celebration—Bath wedding DJ and production.",
    },
  },
  "wedding-dj-bristol": {
    hero: {
      src: `${C}/v1768163649/Alice-Prakyat-517-2_gf5mno.jpg`,
      alt: "Lighting design at Kings Weston House—Bristol area wedding DJ and production.",
    },
    imageStrip: [
      { src: `${C}/v1768163790/Party-dj-with-lazer_wnhreb.jpg`, alt: "Modern reception with DJ and lighting—Bristol wedding entertainment." },
      { src: `${C}/v1768163587/Party-DJ-Lighting-at-a-UNiversity-Spring-Ball_anblbj.jpg`, alt: "City venue dance floor energy—Bristol wedding DJ." },
      { src: `${C}/v1768749211/MartinBeddallPhotography03-e1530632777146_eqctxf.jpg`, alt: "Dance floor and reception atmosphere—Bristol wedding DJ." },
    ],
    featureImage: {
      src: `${C}/v1768163661/Hedsor-House-with-DJ-and-Sax_zv7pnl.jpg`,
      alt: "Dance floor with DJ and sax—Bristol wedding entertainment.",
    },
  },
};

export function getSeoPageImages(pageKey: string): SeoPageImageSet | null {
  return seoPageImages[pageKey] ?? null;
}
