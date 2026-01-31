export interface Testimonial {
  quote: string;
  author: string;
  venue: string;
  venueUrl?: string;
  venueFilter?: string; // county or venue name for filtering (e.g. 'Babington House', 'London', 'Somerset', 'Wiltshire', 'Cornwall', 'Dorset')
}

/** Unique venue/county filter labels from testimonials: Babington House first, then others alphabetically. Used for filter buttons on testimonials and venue pages. */
export function getVenueFiltersFromTestimonials(): string[] {
  const set = new Set<string>();
  for (const t of testimonials) {
    if (t.venueFilter) set.add(t.venueFilter);
  }
  const rest = [...set].filter((f) => f !== "Babington House").sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  return set.has("Babington House") ? ["Babington House", ...rest] : rest;
}

export const testimonials: Testimonial[] = [
  {
    quote: "We wanted to say thank you so much for Monday night. Also, many thanks for playing Come On Eileen for the first time. We really appreciated that and hopefully you didn't mind too much. We had the most perfect day and your DJ set was brilliant!!! We knew you meant business when you came straight in with Stayin' Alive after the band.",
    author: "Riley & Emily Broudie",
    venue: "Babington House Hotel, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "I just wanted to say thank you for our wedding in Cornwall on 20th Aug, it was really fantastic. A lot of people have let us know that they thought your DJ'ing was incredible - so thanks so much.",
    author: "Vienna and Ben Balkwill",
    venue: "Pencarrow Estate, Bodmin, Cornwall",
    venueUrl: "https://www.pencarrow.co.uk/",
    venueFilter: "Cornwall",
  },
  {
    quote: "Just wanted to say thank you soo much for helping us host such an amazing night on our special day. It was such fun and we've had so many nice comments from guests about how good the evening part was! Nigel, you are a top tier DJ! You really brought the party vibe we wanted and were an absolutely great host. Cannot thank you enough! We will 100% be recommending Stylish Entertainment.",
    author: "Camilla & Dan Wilkins",
    venue: "Northover Manor Hotel, Ilchester, Somerset",
    venueUrl: "https://www.northovermanor.co.uk/",
    venueFilter: "Somerset",
  },
  {
    quote: "We just wanted to drop you a quick email to say thank you so much for playing our wedding last weekend at Rockingham Castle. We had an absolutely fantastic time and all of our guests have commented on how great the music was. Even our parents danced for most of the evening which both of us didn't expect at all!",
    author: "Katie & Andrew McLaughlin",
    venue: "Rockingham Castle, Leicestershire",
    venueUrl: "https://www.rockinghamcastle.com/",
    venueFilter: "Leicestershire",
  },
  {
    quote: "I just wanted to say a huge thank you to Stylish Entertainment and to Rich. He was amazing! The DJ is such a big part of the wedding for me, the music can make or break the night! Rich listened to exactly what we wanted, and played amazing music! We had lots of compliments. Also he was such a lovely person to have as part of our wedding. The venue were late moving tables so we had to delay the first song. Rich was so lovely and accommodating. Thanks so much to Rich, he was excellent!",
    author: "Caroline & Alex Brudenell",
    venue: "Elmhay Park, Orchardleigh Estate, Somerset",
    venueUrl: "https://www.orchardleigh.com/",
    venueFilter: "Somerset",
  },
  {
    quote: "It's been a month since our wedding, so we are long overdue the massive THANK YOU that we owe you for doing such an amazing job at our wedding. We've had so many people say to us what a great evening it was (no faint praise considering a lot of them were the 'Amsterdammers', many of whom appear to have PhDs in partying), you did an amazing job to keep the dance floor full throughout. All killer, no filler. All bangers, no clangers, as it were. Please do let us know if there is anywhere we can leave a testimonial so we can spread the word about how ace you are, any couple would be lucky to have you preside over their wedding dancefloor.",
    author: "Vicky & Oli",
    venue: "Hotel du Vin, Poole, Dorset",
    venueUrl: "https://www.hotelduvin.com/locations/poole/",
    venueFilter: "Dorset",
  },
  {
    quote: "We have been meaning to drop you a line to say a HUGE HUGE THANK YOU for doing such an amazing job with the DJing and lighting etc at our wedding. So many people commented on how great you were and how good the music was and it really made the night so special so really thank you from the bottom of our hearts. Everyone loved Mark Anthony as well and that all went really smoothly and I think the stage worked really well generally as a podium for people to dance on afterwards! Anyway we thought you were awesome and everyone had such a great time, thanks once again for making the party and hope to see you at Babington some time.",
    author: "Colin and Lian Lockhead",
    venue: "Babington House Hotel",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "I've already messaged Rich but I wanted to pass on our many many thanks for his DJing at the wedding. The set was a real hit and Rich was an absolute pleasure to work with throughout the day, and really easy to communicate with throughout. We'd absolutely recommend him for any future events. Many thanks again for your help and your contribution to making our day so special.",
    author: "Tom and Annig Pitt-Brooke",
    venue: "Marquee Wedding, Tisbury, Wiltshire",
    venueUrl: "https://www.tisbury.org.uk/",
    venueFilter: "Wiltshire",
  },
  {
    quote: "I just wanted to send a quick email to say thank you so much to Nigel for DJ'ing at our wedding (almost two months ago now- the time has flown by!). The music was absolutely amazing- the dance floor was busy all evening and lots of people have told me how much they enjoyed the set. So a big thank you to Nigel and yourself for organising everything for us – we really appreciate it.",
    author: "Antonia & Jonathan Pass",
    venue: "Eastnor Castle Wedding, Herefordshire",
    venueUrl: "https://www.eastnorcastle.com/",
    venueFilter: "Herefordshire",
  },
  {
    quote: "Just wanted to say a huge thank you for the amazing DJ set you played at our wedding last month! Everyone had the best night and the music was a huge part of that and a key reason the dance floor was full right until the very end! The tree lighting also looked incredible and photographed so well! So thanks to the team for that also!",
    author: "Ellie & David Hearn",
    venue: "Babington House Hotel",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "Just a quick message from us to say thank you so much for playing at our wedding on Saturday. We had such a great night and the dance floor was packed constantly. We've got some great videos and pictures. Lots of being up on the shoulders. Your lighting really made for a great background. Everyone loved it. Sorry we didn't say bye I think we got a bit lost in the partying!!!",
    author: "Aimee & Mike Harper",
    venue: "Great Tythe Barn, Tetbury",
    venueUrl: "https://www.greattythebarn.co.uk/",
  },
  {
    quote: "We wanted to say a huge thank you for being the most fantastic DJ and creating the best atmosphere, and for helping us out with sound throughout and confetti. We had the time of our lives and are so grateful to you. We're so sorry everything ran later than planned and will make sure we get back to Babington asap for another party. Thank you for everything and hope you have a lovely rest of the week.",
    author: "Kathryn and Matt Brown",
    venue: "Babington House Hotel, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "We absolutely adored having Rich S play our wedding celebration. He totally set the tone for the party, and worked with our tastes and playlist to create an atmosphere that was electric. He is incredibly talented! We were utterly thrilled to have Rich S lead us in celebrating our marriage. And the additional Doctor Who dance remix was especially appreciated.",
    author: "Hannah and Alex Torres",
    venue: "Queen Mary University, London",
    venueUrl: "https://www.qmul.ac.uk/",
    venueFilter: "London",
  },
  {
    quote: "Just wanted to say a massive thank you for last night Nigel. You and Leo (Sax player) were absolute champions. Not sure a single guest left the dance floor for the 2.5hrs you were playing. We have had some many amazing comments today and you guys are mentioned in almost every text. Apologies we couldn't get you on sooner, and if that 11pm curfew wasn't there we'd still be dancing now!",
    author: "Sophie & Sam Hawsley",
    venue: "Sessions Art Club, London EC2",
    venueUrl: "https://sessionsartsclub.com/",
    venueFilter: "London",
  },
  {
    quote: "Now that I am back from honeymoon I just wanted to drop you a line to say how much we loved James - he delivered the perfect set for our reception and was a delight to work with…such a lovely man. He took notice of all of our requests and was able to mix in just the right amount of his own picks which were spot on in terms of matching our taste. Brilliant service, thanks to you and him for making everything go so seamlessly on the day!",
    author: "Jess & Andrew Walsh",
    venue: "Town Hall Hotel, London",
    venueUrl: "https://www.townhallhotel.com/",
    venueFilter: "London",
  },
  {
    quote: "Thank-you so much for putting up with our (my) awkward requests! We had so much fun rocking an raving! It was superb, you mixed and DJ'd perfectly.",
    author: "Mr & Mrs Colton",
    venue: "The Wellington Arms, Basingstoke",
    venueUrl: "https://www.thewellingtonarms.com/",
    venueFilter: "Hampshire",
  },
  {
    quote: "We just wanted to say thank you so much for doing such a fantastic job at our Wedding!! We thought the music was perfect and catered to all our guests!! Took us by surprise with Come Together just before the first dance song but worked so so well to get everyone in the mood! So memorable! Everything went so perfectly and was just magical on the day for us! Our photographers mentioned in the 10 years they've been working they've not seen a dance floor so full for so long, and so many of our guests singled out the music as their highlight. So we'd like to thank you for making such a huge difference to our big day.",
    author: "Alina and Dan",
    venue: "Babington House, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "I just wanted to take a couple of minutes out from our honeymoon to extend a massive thank you to James H and for his set on Saturday night. We were really pleased with the music throughout the night and he kept our guests dancing all evening, which is all we can ask for! Thanks for your help with arranging James.",
    author: "Mitchell Droppa",
    venue: "Manor House, Castle Coombe",
    venueUrl: "https://www.manorhousecastlecombe.co.uk/",
    venueFilter: "Wiltshire",
  },
  {
    quote: "Thanks again for last week Nigel! So many people commented on how brilliant the DJ was and how much they danced compared to other weddings.",
    author: "Jamie Molloy",
    venue: "Wick Farm, Bath",
    venueUrl: "https://www.wickfarm.co.uk/",
    venueFilter: "Somerset",
  },
  {
    quote: "I just wanted to say how great Rich was on Saturday! His set list was perfect! He took all our requests into consideration and we've had soo many of our family and friends saying how amazing he was! He took us from disco through to 00s RnB and ended on our garage half hour request - all seemlessly! We are soo happy with how great he was and really topped off a fantastic day! I can't wait for another occasion to book again!",
    author: "Liam Price",
    venue: "Parklands Quendon Hall, Essex",
    venueUrl: "https://www.parklandsquendonhall.co.uk/",
    venueFilter: "Essex",
  },
  {
    quote: "We would just like to do a review for James for our wedding day. From start to finish James was fantastic to deal with an absolutely got we wanted. His mixing and ability to judge the audience was better than I have ever seen. We have had so many friends and family compliment the DJ and we will definitely be using him again! Just superb!",
    author: "George and Kathryn",
    venue: "Dene Farm, Stockbridge, Hampshire",
    venueUrl: "https://www.denefarm.co.uk/",
    venueFilter: "Hampshire",
  },
  {
    quote: "We just wanted to say a HUGE thank you for supplying us with the beautiful lights... really made everything look so fabulous and definitely would have loved to keep them forever!!!!!! We may just have to have more parties so we can hire them again! Thank you to you and your team for doing such a great job.",
    author: "Hayley and David",
    venue: "Cutteridge Barns, Brokerswood, Trowbridge",
    venueUrl: "https://www.cutteridgebarns.co.uk/",
    venueFilter: "Wiltshire",
  },
  {
    quote: "We just wanted to send you a quick email to thank Rich for the excellent DJing he provided for our wedding. We were so impressed with his professionalism and the standard of the service he provided, as well as how friendly and helpful he was.",
    author: "Rachel and Will Espensen",
    venue: "Almonry Barn, Somerset",
    venueFilter: "Somerset",
  },
  {
    quote: "We want to send our heartfelt thanks to you, Nigel, Dave & Simon - they were awesome. Everything was seamless between them and the band and we had such a great eclectic mix to get everyone in the mood and dancing. I'm not kidding when I say that we've never seen my 61yr old father dance so that's certainly testament to the great vibes created, thank you. We wish we could do it all over again and hope to have an opportunity to recommend you guys very soon.",
    author: "Hollie & Lewis Corby",
    venue: "Penarth Pier Pavilion, Wales",
    venueFilter: "Wales",
  },
  {
    quote: "I just wanted to say a massive thank you for dj-ing on Thursday. We had an amazing time and I didn't stop dancing all night. Mum also appreciated the Rolling Stones - she said to pass on the message! I thought the orangery and the outside lights all looked great.",
    author: "Elly Martin",
    venue: "Babington House Hotel, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "I hope you are well. I just wanted to write some positive feedback about James H, who I booked as the DJ at my recent wedding. My wife, Clare, and I could not be happier we chose him. He was positive, friendly and communicative thought the whole process - a real pleasure to deal with. He kept the dancefloor full all night and so many of our guests commented how great the music was. Clare and I were both able to relax and enjoy the evening knowing the music was in good hands. Thank you for your service and providing us with a great DJ.",
    author: "Clare and James Fisher",
    venue: "Marquee Wedding, Ruscombe, Berkshire",
    venueFilter: "Berkshire",
  },
  {
    quote: "It was a great success. Once we got people on the dance floor Nigel played some fabulous music. We loved Darude, Insomnia and have some great video footage of people dancing. I hope we did not keep him too late! It was wonderful he could play until 1.30am. Our guests loved the music and the Castle looked fabulous.",
    author: "Charles Berkeley",
    venue: "Berkeley Castle, Gloucestershire",
    venueUrl: "https://www.berkeley-castle.com/",
    venueFilter: "Gloucestershire",
  },
  {
    quote: "Just to say a huge Thank you to Nigel and Simon they were totally amazing on Saturday night!!! We had a tough crowd but Nigel won and everyone was up on their feet. Everyone has commented on how good they were so please pass a huge thank you onto them from us.",
    author: "Anna-Marie Panter",
    venue: "Hatton Hall, Warwickshire",
    venueFilter: "Warwickshire",
  },
  {
    quote: "I wanted to follow up our wedding in which Rich Smith DJ'd for us at Kingscote Barn. I can't thank Rich enough for the evening. He was simply awesome. The music was great and the party was the best we've ever had. The comments and feedback from our guests are still coming in, the last 30 minutes in a large group is one of the best experiences I've ever had! Can you please pass on our thanks and tell him he is the first phone call I will make in future if we have a party!",
    author: "Rich Farmer",
    venue: "Kingscote Barn, Gloucestershire",
    venueFilter: "Gloucestershire",
  },
  {
    quote: "THANK YOU FROM THE BOTTOM OF OUR HEARTS FOR MAKING OUR WEDDING RECEPTION SO PERFECT. You really made it magical and everything that we could have every wished for. I wish we could take you everywhere with us! We will never forget the dancing and how you played us out with Into The Mystic. It meant so much.",
    author: "Tiff Marie Brannon",
    venue: "Babington House Hotel, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "Hope you're well, just wanted to drop you a quick email, saying thanks so much for everything at our wedding. Your DJ'ing was fantastic and we had lots of comments about how good the music was. Thanks so much for all your help making it a great evening for us.",
    author: "Alex & Hannah Humphries",
    venue: "Babington House Hotel, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "I'd really grateful if you could pass our thanks onto Rich for making our day even more special.",
    author: "Unknown",
    venue: "Babington House, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "What an amazing set!!!! We were blown away and our guests absolutely loved it. How you mixed in the theme song from Chevy Chase Fletch lives into Phil Collins we will never know but it was off the scale cool. The bar area was beautiful and we loved every second of it. Thanks again for patience and being brilliantly good fun.",
    author: "Rich and Laurie Pace",
    venue: "Babington House, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "We had a wonderful wonderful time, thanks so much for all your help & the rocking tunes. The music was perfect and we were so happy to see everyone dancing!",
    author: "Katie & Dinc",
    venue: "Babington House, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "We are back from our 'mini-moon' and wanted to say a special thanks to you both for helping make our wedding very festive and special. Everyone loved the music and the lighting, and we have some great shots of our first dance as husband and wife. We also enjoyed watching everyone dance, with a few members of the family surprisingly passionate about being on the dance floor! We are still buzzing about the whole event. It has been a pleasure working with you from beginning to end and we wish you all the best.",
    author: "Paul & Isabella Sandford",
    venue: "The Assembly Rooms, Bath",
    venueFilter: "Somerset",
  },
  {
    quote: "Just a note to say that Saturday was a great day and James was brilliant and made a real contribution. He provided exactly what we wanted, with a thoughtful selection based on our choices. He kept a nice atmosphere going in the early part of the evening and then got everyone going with some real floor fillers. He was friendly and responsive and really added to the day. Thank you for your help in making all the arrangements.",
    author: "Stephen & Lisa Rouse",
    venue: "The Penny Farthing Cafe Bar, Cowbridge, Wales",
    venueFilter: "Wales",
  },
  {
    quote: "Thank you for a brilliant evening. You are a fantastic DJ and the saxophonist was just the icing on top on the cake. Everyone was raving about the music.",
    author: "Grace & Tom Nickalls",
    venue: "Babington House Hotel, Somerset",
    venueUrl: "https://www.sohohouse.com/houses/babington-house",
    venueFilter: "Babington House",
  },
  {
    quote: "Just wanted to drop you a note to say how great James and the Sax Lady were on Saturday. We had an amazing party and they really did make it for me. We had some amazing feedback from people at the party and also nearby neighbours who enjoyed it from their gardens too!",
    author: "Steve Abbott",
    venue: "Private Party, Braintree, Essex",
    venueFilter: "Essex",
  },
  {
    quote: "A quick thank you for arranging our fantastic DJ Rich for our 50th birthday party. He was great, super choice of songs, read the audience and worked around the band seamlessly. It was a shame that we couldn't have had an extra few hours…. The party was a great success all in all. If we have another need for a DJ in the future then we will be in touch again.",
    author: "Jackie Barber",
    venue: "Private Party, Sutton, Shepton Mallet, Somerset",
    venueFilter: "Somerset",
  },
];
