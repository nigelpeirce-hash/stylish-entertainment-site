"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About Us | Stylish Entertainment | West Country Wedding Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Learn about Stylish Entertainment. We are an entertainment business based in Frome, Somerset, with 20 years of experience in the music and advertising industries.");
    }
  }, []);

  return (
    <div>
      {/* Main Content */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto max-w-5xl space-y-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">About Us</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-semibold px-4">
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
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  Who are STYLISH?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  We are an entertainment business based in Frome, Somerset. Prior to setting up STYLISH, we spent 20 years in London working in the music and advertising industries, honing our craft and building a reputation for excellence.
                </p>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  We founded the award-winning Factory Studios, which is currently London's top creative post-production studios and production company. This unique background sets us apart in the entertainment industry and drives our commitment to exceptional customer service and attention to detail.
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
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  Our Heritage & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  With over 20 years of experience in the music and creative industries, we bring a level of professionalism and creativity that is rare in the wedding and party entertainment sector. Our time in London's competitive creative industries taught us the importance of precision, innovation, and exceeding expectations.
                </p>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  Our work with Factory Studios, one of London's most respected post-production facilities, has given us an unparalleled understanding of how to create atmosphere, mood, and unforgettable experiences. We apply this same level of creative excellence and technical expertise to every wedding, party, and event we produce.
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
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  What Sets Us Apart
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-champagne-gold mb-2">Creative Excellence</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Our background in creative industries means we don't just provide entertainment – we create experiences. Every lighting design, every DJ set, and every venue styling project is approached with an artist's eye and a professional's precision.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-champagne-gold mb-2">Uncompromising Standards</h3>
                    <p className="text-gray-300 leading-relaxed">
                      We've worked with some of the most demanding clients in the creative industries, and we bring that same commitment to quality to every wedding and party. From equipment standards to customer service, we never compromise.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-champagne-gold mb-2">Trusted by Prestigious Venues</h3>
                    <p className="text-gray-300 leading-relaxed">
                      For over 20 years, we have been the sole supplier of entertainment and party production at the legendary Babington House (Soho House & Co), where every detail must be perfect. This long-standing relationship demonstrates our reliability, professionalism, and ability to consistently deliver exceptional results.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-champagne-gold mb-2">Personal Service</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Despite our professional background, we remain a personal, family-run business. You'll work directly with Nigel and Ali, who bring decades of combined experience to every project. We're not a faceless corporation – we're passionate professionals who care deeply about making your event extraordinary.
                    </p>
                  </div>
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
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  Our Comprehensive Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg mb-4">
                  We offer a complete range of wedding and party services, all delivered with the same attention to detail and creative excellence:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-champagne-gold mb-2">Professional DJs</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Experienced DJs who understand how to read a room and create the perfect atmosphere, from sophisticated background music to high-energy dance floors.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-champagne-gold mb-2">Lighting Design</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Bespoke lighting installations that transform venues into magical spaces, from fairy light canopies to dramatic LED uplighting and intelligent moving lights.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-champagne-gold mb-2">Venue Styling</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Complete venue transformation with elegant drapery, custom backdrops, props, furniture hire, and creative décor that reflects your personal style.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-champagne-gold mb-2">Live Musicians</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      A curated selection of talented musicians including harpists, saxophonists, trios, and bands to add sophistication and energy to your celebration.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-champagne-gold mb-2">Party Planning</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Full event planning and production services, from initial concept through to flawless execution, ensuring every detail is perfect.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-champagne-gold mb-2">Equipment Hire</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Professional sound systems, lighting rigs, microphones, and technical equipment, all PAT tested and fully insured.
                    </p>
                  </div>
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
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  Where We Work
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  Based in Frome, Somerset, we serve clients across the West Country and beyond. Over the last 12 months, we have supplied entertainment from Norfolk in the east to Cornwall in the west, from the south coast to the midlands.
                </p>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  We regularly work in Somerset, Wiltshire, Dorset, Devon, Gloucestershire, Bath, Bristol, Swindon, Oxford, Berkshire, London, and many areas in between. Our network of artists and suppliers across the south enables us to provide exceptional service wherever your event is located.
                </p>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg font-semibold">
                  No matter where your celebration takes place, we're committed to bringing the same level of excellence and attention to detail that has made us trusted partners of venues like Babington House for over two decades.
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
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  Our Promise to You
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  We understand that the entertainment industry has a reputation for inconsistency and poor service. That's why we're committed to changing that perception, one exceptional event at a time.
                </p>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                  When you work with STYLISH Entertainment, you're not just hiring a DJ or lighting company – you're partnering with experienced professionals who understand that your event is one of the most important days of your life. We treat it with the respect, care, and attention to detail it deserves.
                </p>
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg font-semibold text-champagne-gold">
                  We have backup talent if someone is ill and have never let any client down on their special party or wedding. Your peace of mind is our priority.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
