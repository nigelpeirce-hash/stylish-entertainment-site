import { pickDeterministic } from "@/lib/deterministic-shuffle";

export interface Review {
  quote: string;
  author: string;
  venue: string;
}

export const reviews: Review[] = [
  {
    quote: "All killer, no filler. All bangers, no clangers, as it were. The dance floor was full all night.",
    author: "Vicky & Oli",
    venue: "Hotel du Vin, Poole",
  },
  {
    quote: "Our photographers mentioned in the 10 years they've been working they've not seen a dance floor so full for so long.",
    author: "Alina & Dan",
    venue: "Babington House",
  },
  {
    quote: "Not sure a single guest left the dance floor for the 2.5hrs you were playing. We've had so many amazing comments today.",
    author: "Sophie & Sam",
    venue: "Sessions Art Club, London",
  },
  {
    quote: "The set was a real hit and Rich was an absolute pleasure to work with throughout the day. We'd absolutely recommend him for any future events.",
    author: "Tom & Annig",
    venue: "Marquee Wedding, Tisbury",
  },
  {
    quote: "His mixing and ability to judge the audience was better than I have ever seen. We will definitely be using him again! Just superb!",
    author: "George & Kathryn",
    venue: "Dene Farm, Hampshire",
  },
  {
    quote: "The music was absolutely amazing - the dance floor was busy all evening and lots of people have told me how much they enjoyed the set.",
    author: "Antonia & Jonathan",
    venue: "Eastnor Castle",
  },
  {
    quote: "Just wanted to say thank you soo much for helping us host such an amazing night on our special day. It was such fun and we've had so many nice comments from guests about how good the evening part was! Nigel, you are a top tier DJ!",
    author: "Camilla & Dan",
    venue: "Northover Manor Hotel, Somerset",
  },
  {
    quote: "We had an absolutely fantastic time and all of our guests have commented on how great the music was. Even our parents danced for most of the evening which both of us didn't expect at all!",
    author: "Katie & Andrew",
    venue: "Rockingham Castle, Leicestershire",
  },
  {
    quote: "I just wanted to say a huge thank you to Stylish Entertainment and to Rich. He was amazing! The DJ is such a big part of the wedding for me, the music can make or break the night!",
    author: "Caroline & Alex",
    venue: "Elmhay Park, Orchardleigh Estate",
  },
  {
    quote: "We have been meaning to drop you a line to say a HUGE HUGE THANK YOU for doing such an amazing job with the DJing and lighting etc at our wedding. So many people commented on how great you were.",
    author: "Colin & Lian",
    venue: "Babington House Hotel",
  },
  {
    quote: "We absolutely adored having Rich S play our wedding celebration. He totally set the tone for the party, and worked with our tastes and playlist to create an atmosphere that was electric.",
    author: "Hannah & Alex",
    venue: "Queen Mary University, London",
  },
  {
    quote: "Now that I am back from honeymoon I just wanted to drop you a line to say how much we loved James - he delivered the perfect set for our reception and was a delight to work with.",
    author: "Jess & Andrew",
    venue: "Town Hall Hotel, London",
  },
  {
    quote: "I just wanted to say how great Rich was on Saturday! His set list was perfect! He took all our requests into consideration and we've had soo many of our family and friends saying how amazing he was!",
    author: "Liam",
    venue: "Parklands Quendon Hall, Essex",
  },
  {
    quote: "We want to send our heartfelt thanks to you, Nigel, Dave & Simon - they were awesome. Everything was seamless between them and the band and we had such a great eclectic mix to get everyone in the mood and dancing.",
    author: "Hollie & Lewis",
    venue: "Penarth Pier Pavilion, Wales",
  },
  {
    quote: "We just wanted to say a HUGE thank you for supplying us with the beautiful lights... really made everything look so fabulous and definitely would have loved to keep them forever!!!!!!",
    author: "Hayley & David",
    venue: "Cutteridge Barns, Trowbridge",
  },
  {
    quote: "I hope you are well. I just wanted to write some positive feedback about James H, who I booked as the DJ at my recent wedding. My wife, Clare, and I could not be happier we chose him. He kept the dancefloor full all night.",
    author: "Clare & James",
    venue: "Marquee Wedding, Ruscombe",
  },
  {
    quote: "It was a great success. Once we got people on the dance floor Nigel played some fabulous music. We loved Darude, Insomnia and have some great video footage of people dancing.",
    author: "Charles Berkeley",
    venue: "Berkeley Castle, Gloucestershire",
  },
  {
    quote: "What an amazing set!!!! We were blown away and our guests absolutely loved it. The bar area was beautiful and we loved every second of it. Thanks again for patience and being brilliantly good fun.",
    author: "Rich & Laurie",
    venue: "Babington House",
  },
];

/**
 * Shuffles an array using Fisher-Yates + Math.random().
 * Client-only: call from useEffect after mount — never during SSR/first paint.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Same seed → same reviews on server and client (SSR-safe).
 */
export function getDeterministicReviews(count: number = 3, seed: string): Review[] {
  return pickDeterministic(reviews, count, seed);
}

/**
 * Random reviews — use only inside useEffect after hydration.
 */
export function getRandomReviews(count: number = 3): Review[] {
  const shuffled = shuffleArray(reviews);
  return shuffled.slice(0, count);
}
