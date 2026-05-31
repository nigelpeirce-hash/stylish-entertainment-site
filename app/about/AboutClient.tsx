"use client";

import { motion } from "@/lib/motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Professional DJs",
    description: "Experienced DJs who understand how to read a room and create the perfect atmosphere, from sophisticated background music to high-energy dance floors.",
  },
  {
    title: "Lighting Design",
    description: "Bespoke lighting installations that transform venues into magical spaces, from fairy light canopies to dramatic LED uplighting and intelligent moving lights.",
  },
  {
    title: "Venue Styling",
    description: "Complete venue transformation with elegant drapery, custom backdrops, props, furniture hire, and creative décor that reflects your personal style.",
  },
  {
    title: "Live Musicians",
    description: "A curated selection of talented musicians including harpists, saxophonists, trios, and bands to add sophistication and energy to your celebration.",
  },
  {
    title: "Event Production",
    description: "Full event planning and production services, from initial concept through to flawless execution, ensuring every detail is perfect.",
  },
  {
    title: "Party Planning",
    description: "Complete party planning and coordination services to bring your vision to life, handling every detail from concept to execution.",
  },
  {
    title: "Equipment Hire",
    description: "Professional sound systems, lighting rigs, microphones, and technical equipment, all PAT tested and fully insured.",
  },
  {
    title: "Fire-pit Hire",
    description: "Beautiful fire pits and outdoor heating solutions to create warm, inviting atmospheres for your outdoor celebrations.",
  },
];

const benefits = [
  {
    title: "Creative Approach",
    description: "Our background in creative industries influences how we approach entertainment. We think about lighting design, DJ sets, and venue styling as part of creating the right atmosphere for each event.",
  },
  {
    title: "Quality Standards",
    description: "We take care with equipment, setup, and service. We maintain our gear, arrive on time, and communicate clearly throughout the planning and event process.",
  },
  {
    title: "Long-term Relationships",
    description: "We have been a trusted supplier at Babington House (Soho House & Co) since 2003. We also work regularly with venues like Kin House, Pennard House, and Mells Barn. These ongoing relationships show that venues value our work and reliability.",
  },
  {
    title: "Personal Service",
    description: "We're a small, family-run business. You'll work directly with Ali and DJ Nige — including his long experience at Babington House — not a faceless agency. We're a team of two who care how your event feels on the night.",
  },
];

export default function AboutClient() {
  return (
    <div>
      {/* Main Content */}
      <section 
        className="pt-20 pb-8 px-3 sm:px-4"
        style={{
          background: 'radial-gradient(circle at top, rgb(55 65 81) 0%, rgb(31 41 55) 50%, rgb(17 24 39) 100%)'
        }}
      >
        <div className="container mx-auto max-w-5xl space-y-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold tracking-wide px-4">About Us</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white md:text-gray-300 font-semibold px-4 max-w-3xl mx-auto">
              A family-run team for luxury weddings and parties — DJs, lighting and production from one experienced pair, trusted at Babington House since 2003.
            </p>
          </motion.div>

          {/* Our Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-champagne-gold/20 md:from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.1)] md:shadow-none">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2 tracking-wide">
                  Who are STYLISH?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-champagne-gold mb-1">Ali – Strategic Heart & Luxe Experience</h3>
                    <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                      Ali brings a strategic and personal heart to Stylish, combining a professional background in interior design, luxury hospitality, and project management. Her eye for detail and sense of occasion run through everything – from creative guest experiences to event logistics. She delivers thoughtful, tailored service for every occasion, ensuring each celebration feels truly special.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-champagne-gold mb-1">
                      <Link href="/artists/djs/dj-nige/" className="hover:text-gold-light transition-colors">
                        DJ Nige
                      </Link>
                      {" "}– Wedding &amp; Event DJ
                    </h3>
                    <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                      Nigel (DJ Nige) has been DJing since he was 14 and has spent more than twenty years reading rooms at luxury weddings and private parties. He is the resident DJ at{" "}
                      <Link href="/venues/babington-house/" className="text-champagne-gold hover:text-gold-light underline">
                        Babington House
                      </Link>{" "}
                      (Soho House) — trusted since 2003 to move a celebration from elegant drinks through to a full dancefloor without forcing the mood. Open-format sets span soul, disco, house, indie, R&amp;B and contemporary party music; lighting and production know-how mean music and atmosphere are shaped together, not bolted on at the end.
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-4 border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                      <Link href="/artists/djs/dj-nige/">
                        Meet DJ Nige — full profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Heritage Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2 tracking-wide">
                  Our Heritage & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  STYLISH Entertainment brings together music, lighting and styling for weddings and parties across the South West, London and beyond. Ali leads the luxe client experience and venue relationships;{" "}
                  <Link href="/artists/djs/dj-nige/" className="text-champagne-gold hover:text-gold-light underline">
                    DJ Nige
                  </Link>{" "}
                  leads the soundtrack and the technical side of how a room should feel as the evening builds.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  Nige&apos;s path runs from club and radio work (including freelance production for Pete Tong&apos;s Essential Selection) through premium London venues to his long residency at Babington House from 2003. That depth in music — not just equipment — is what couples notice on the night: timing, energy and a dancefloor that still feels right at the end.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  We formalised STYLISH Entertainment in 2004 and have since built lasting relationships with venues including Kin House, Pennard House and Mells Barn, as well as Babington House. The same team plans your DJ set, lighting design and production so your celebration feels cohesive from first dance to last song.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* What Sets Us Apart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2 tracking-wide">
                  What Sets Us Apart
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-bold text-champagne-gold mb-2">{benefit.title}</h3>
                      <p className="text-gray-200 md:text-gray-300 leading-relaxed">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2 tracking-wide">
                  Our Comprehensive Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg mb-4">
                  We offer a complete range of wedding and party services, all delivered with the same attention to detail and creative excellence:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.map((service, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-bold text-champagne-gold mb-2">{service.title}</h3>
                      <p className="text-gray-200 md:text-gray-300 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Coverage Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-champagne-gold/20 md:from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.1)] md:shadow-none">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2 tracking-wide">
                  Where We Work
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  Based in Frome, Somerset, we serve clients across the South West and beyond. Over the last 12 months, we have supplied entertainment from Norfolk in the east to Cornwall in the west, from the south coast to the midlands.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  We regularly work in Somerset, Wiltshire, Dorset, Devon, Gloucestershire, Bath, Bristol, Swindon, Oxford, London and many areas in between. We have a network of artists and suppliers across the south that helps us work in different locations.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  Wherever your celebration takes place, we'll work to provide reliable service and attention to detail, just as we've done for venues like Babington House since 2003.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Promise Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gray-900 border-champagne-gold/30">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2 tracking-wide">
                  Our Promise to You
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  We understand that your event is important to you. We treat it with care and work to ensure everything runs smoothly.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  When you work with Stylish Entertainment, you're working with experienced professionals who understand that events matter. We focus on clear communication, reliable service, and getting things right.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  We have backup options if someone is unavailable, and we've always been there for our clients on their event day. Your peace of mind matters to us.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meet the Team Section - Two Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-serif font-bold mb-4 tracking-wide">
              Meet the <span className="text-gradient">Team</span>
            </h2>
            <p className="text-white md:text-gray-300 text-base sm:text-lg mb-8">
              The passionate professionals behind Stylish Entertainment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Column 1: Ali's Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gray-900 border-champagne-gold/30 h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162313/Ali-Peirce_aec3tn.jpg"
                      alt="Ali - Creative Strategist at Stylish Entertainment"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-champagne-gold mb-2 tracking-wide">Ali</h3>
                  <p className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">Creative Strategist</p>
                  <div className="space-y-4 text-gray-200 md:text-gray-300 leading-relaxed">
                    <p>
                      Ali is the Strategic Heart of STYLISH, overseeing every detail of the 'Luxe' experience that defines our approach to celebration. As the primary link to prestigious venues like Babington House and Kin House, Ali ensures that every interaction reflects our commitment to excellence.
                    </p>
                    <p>
                      Her philosophy is clear: entertainment is a high-end hospitality service. This perspective informs every decision, from initial consultation through to the final moments of your celebration. Ali understands that true luxury lies in the seamless execution of details that guests may never consciously notice, but will always remember.
                    </p>
                    <p>
                      Through meticulous oversight and a deep understanding of what makes moments truly special, Ali ensures that every STYLISH event exceeds expectations, creating memories that resonate long after the music fades.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Column 2: Nige's Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gray-900 border-champagne-gold/30 h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162279/Nigel-DJ-Babs-House-0009-1_f59b99.jpg"
                      alt="DJ Nige at Babington House — wedding and event DJ"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-champagne-gold mb-2 tracking-wide">
                    <Link href="/artists/djs/dj-nige/" className="hover:text-gold-light transition-colors">
                      DJ Nige
                    </Link>
                  </h3>
                  <p className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">Founder &amp; Resident DJ</p>
                  <div className="space-y-4 text-gray-200 md:text-gray-300 leading-relaxed">
                    <p>
                      DJ Nige is an open-format wedding and event DJ known for reading a room and building energy naturally — from relaxed early evening through to a packed dancefloor. Couples and planners book him for judgement on music, not a fixed playlist: soul, funk, disco, house, garage, indie, R&amp;B and contemporary party tracks chosen with the flow of your day in mind.
                    </p>
                    <p>
                      His defining venue relationship is{" "}
                      <Link href="/venues/babington-house/" className="text-champagne-gold hover:text-gold-light underline">
                        Babington House
                      </Link>
                      , where he has been part of weddings and parties since 2003. That long experience of how the bar, terrace, Orangery and outdoor spaces work together is something every Babington couple benefits from when they book STYLISH.
                    </p>
                    <p>
                      Behind the decks he brings calm, professional delivery and the production background to tie DJing with lighting design when you want one team shaping the whole atmosphere. High-profile and private clients value his discretion as much as his mixing.
                    </p>
                    <Button asChild className="w-full sm:w-auto bg-champagne-gold text-black hover:bg-champagne-gold/90">
                      <Link href="/artists/djs/dj-nige/">
                        View DJ Nige profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Column 3: DJ Nige at a glance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-champagne-gold/30 h-full">
                <CardHeader className="p-6 sm:p-8 pb-4">
                  <CardTitle className="text-xl md:text-2xl font-serif font-bold text-champagne-gold tracking-wide">
                    DJ Nige at a glance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white mb-3">Babington House</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      Resident DJ since 2003 — hundreds of weddings and parties at one of the UK&apos;s most celebrated venues.{" "}
                      <Link href="/venues/babington-house/" className="text-champagne-gold hover:text-gold-light underline">
                        Babington guide
                      </Link>
                    </p>
                  </div>
                  <div className="border-t border-champagne-gold/30 pt-6 space-y-3">
                    <h4 className="text-lg font-semibold text-white mb-3">Open-format DJ</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      Soul, disco, house, indie, R&amp;B and party classics — mixed with timing and instinct, not a rigid playlist.
                    </p>
                  </div>
                  <div className="border-t border-champagne-gold/30 pt-6 space-y-3">
                    <h4 className="text-lg font-semibold text-white mb-3">Music + lighting</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      DJ sets and{" "}
                      <Link href="/weddings/wedding-lighting/" className="text-champagne-gold hover:text-gold-light underline">
                        lighting design
                      </Link>{" "}
                      from one team so the evening feels joined-up.
                    </p>
                  </div>
                  <div className="border-t border-champagne-gold/30 pt-6 space-y-3">
                    <h4 className="text-lg font-semibold text-white mb-3">Discretion</h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      Trusted by private and high-profile clients who value professionalism and confidentiality on the night.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                    <Link href="/artists/djs/dj-nige/">Full DJ profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}