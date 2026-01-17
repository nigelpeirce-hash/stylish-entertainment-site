"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

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
    description: "We're a small, family-run business. You'll work directly with Ali and Nige, who bring years of combined experience to each project. We're not a large corporation – we're a team of two who care about making your event work well.",
  },
];

export default function AboutClient() {
  return (
    <div>
      {/* Main Content */}
      <section 
        className="pt-20 pb-8 px-6 md:px-4"
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
            <p className="text-lg sm:text-xl md:text-2xl text-white md:text-gray-300 font-semibold px-4">
              Learn more about Stylish Entertainment
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
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  We are an entertainment business based in Frome, Somerset, with over 20 years of experience creating celebrations across the West Country and beyond. From intimate weddings to larger parties, we work with venues and couples to bring their vision to life.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  We work regularly with venues like Babington House (where we have been a trusted supplier since 2003), Kin House, Pennard House, and Mells Barn, providing DJs, musicians, lighting design, and venue styling for weddings and celebrations. We focus on good communication, reliable service, and attention to detail in every event we produce.
                </p>
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
                  With over 20 years of experience creating celebrations, we bring a background in music and creative industries to wedding and party entertainment. Our journey began in 1997 when Nige co-founded <a href="https://factory.uk.com" target="_blank" rel="noopener noreferrer" className="text-champagne-gold hover:text-gold-light underline">factory.uk.com</a>, which provided experience in creative and technical work.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  Nige's background includes work with Radio 1, Virgin Radio, and clients such as Sony and Universal, bringing a depth of industry knowledge and creative expertise to every event. This experience helps us understand how to create the right atmosphere and mood for each celebration, and we work hard to get the details right.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  In 2004, we established Stylish Entertainment, applying this background to weddings, parties, and events. Since then, we have been a trusted supplier at Babington House since 2003, building on our reputation for excellence and reliability.
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
                  Based in Frome, Somerset, we serve clients across the West Country and beyond. Over the last 12 months, we have supplied entertainment from Norfolk in the east to Cornwall in the west, from the south coast to the midlands.
                </p>
                <p className="text-gray-200 md:text-gray-300 leading-relaxed text-base sm:text-lg">
                  We regularly work in Somerset, Wiltshire, Dorset, Devon, Gloucestershire, Bath, Bristol, Swindon, Oxford, London, and many areas in between. We have a network of artists and suppliers across the south that helps us work in different locations.
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

          {/* Meet the Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4 tracking-wide">
              Meet the <span className="text-gradient">Team</span>
            </h2>
            <p className="text-white md:text-gray-300 text-base sm:text-lg mb-8">
              The passionate professionals behind Stylish Entertainment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Ali */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-gray-900 border-champagne-gold/30 h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162313/Ali-Peirce_aec3tn.jpg"
                      alt="Ali - Venue Styling & Artist Liaison at Stylish Entertainment"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-3 tracking-wide">Ali</h3>
                  <p className="text-gray-400 text-sm font-semibold mb-3">Venue Styling & Artist Liaison</p>
                  <p className="text-gray-200 md:text-gray-300 leading-relaxed mb-4">
                    Ali combines creative vision with meticulous attention to detail. Drawing on years of experience in the creative industries, Ali specializes in venue styling and creating the perfect atmosphere for your special day. Every detail matters, and Ali ensures nothing is overlooked.
                  </p>
                  <p className="text-gray-200 md:text-gray-300 leading-relaxed">
                    With a keen eye for design and a passion for creating beautiful spaces, Ali transforms venues into stunning celebration spaces. From initial consultation through to the final setup, Ali works closely with couples and clients to bring their vision to life, ensuring every element works together harmoniously.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Nige */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="bg-gray-900 border-champagne-gold/30 h-full">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768162279/Nigel-DJ-Babs-House-0009-1_f59b99.jpg"
                      alt="Nige - Production & DJ at Stylish Entertainment"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-champagne-gold mb-3 tracking-wide">Nige</h3>
                  <p className="text-gray-400 text-sm font-semibold mb-3">Production & DJ</p>
                  <p className="text-gray-200 md:text-gray-300 leading-relaxed mb-4">
                    With over 20 years of experience in the music and creative industries, Nige brings a wealth of knowledge and passion to every event. From DJ sets at prestigious venues like Babington House to creative lighting design, Nige ensures every celebration is unforgettable.
                  </p>
                  <p className="text-gray-200 md:text-gray-300 leading-relaxed">
                    Nige co-founded factory.uk.com in 1997, bringing expertise from the creative industries to entertainment. His background includes work with Radio 1, Virgin Radio, and clients such as Sony and Universal. Since establishing Stylish Entertainment in 2004, Nige has been the creative force behind hundreds of celebrations, combining technical excellence with an intuitive understanding of what makes an event truly special.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}