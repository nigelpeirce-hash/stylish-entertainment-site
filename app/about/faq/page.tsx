"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function FAQ() {
  useEffect(() => {
    document.title = "FAQ | Frequently Asked Questions | Stylish Entertainment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Frequently asked questions about Stylish Entertainment. Learn about our DJs, lighting design, venue styling, pricing, booking process, and service areas across the West Country.");
    }
  }, []);

  return (
    <div>
      {/* Main Content */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4">Frequently Asked Questions</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-semibold px-4">
              Everything you need to know about our services
            </p>
          </motion.div>
          {/* Lighting, Styling and Production */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-gray-900 border-champagne-gold/30 mb-8">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  Lighting, Styling and Production
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    How Much Do you Charge?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We need to know a few details before we can offer a quote which include size of the venue / space. Ceiling height if we are creating a canopy and access times. The most important question is have you sought permission from the venue before contacting us? some venue are very fussy about their properties however, we are always very respectful.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    When will you setup and de-rig?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our preference is to setup the day before your wedding, the wedding day will be very busy with your caterer, florist, bar-staff and photographer all wanting to access the same space as us. We try and work to your requirements for the de-rig, if your wedding is a Saturday we prefer to de-rig on a Monday however, if that isn't possible we will de-rig on Sunday.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    What types of lighting do you offer?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We offer a comprehensive range of lighting solutions including LED uplighting, fairy light canopies, festoon lighting, intelligent moving lights, dance floor packages, exterior lighting, and custom installations. We can create everything from subtle ambient lighting to dramatic theatrical effects tailored to your venue and style.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Can you work with our venue's existing lighting?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yes, we can integrate our lighting design with your venue's existing lighting system. We'll assess the venue during our consultation and create a design that complements or enhances what's already there. We can also work independently if preferred.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Do you provide venue styling consultations?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yes, we offer styling consultations to help you create a cohesive design theme for your event. We can discuss drapery, backdrops, props, furniture hire, and decorative elements that will transform your venue and reflect your personal style.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Can you create custom lighting designs?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Absolutely! We specialise in bespoke lighting installations tailored to your specific venue and vision. Whether you want a fairy light tunnel, a dramatic canopy, or custom colour schemes to match your theme, we can create unique designs that make your event unforgettable.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Do you handle outdoor lighting?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yes, we provide outdoor lighting for terraces, gardens, walkways, and alfresco dining areas. We use weather-appropriate equipment and can create beautiful exterior lighting that extends the magic of your celebration beyond the main venue space.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    How far in advance should we book?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We recommend booking as early as possible, especially for popular dates and peak wedding season. Many clients book 12-18 months in advance. However, we can often accommodate shorter notice bookings depending on availability, so it's always worth getting in touch.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* DJs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-gray-900 border-champagne-gold/30 mb-8">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  DJs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    How much do your DJs charge?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Every party, wedding or event is different due to location, timings and individual requirements. Please submit our contact form to get the ball rolling.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Will you play our requests?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yes, we actively encourage both your requests and dis-likes and create a bespoke set for every client. We do use our knowledge and skills to make sure we fill the dance-floor not empty it!
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    We have a mixed-age crowd, is that an issue?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    No, we are very experienced at entertaining everyone in your wedding party – even aunt Betty!
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Can you setup during the day?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yes, we can offer an early set-up for an additional fee. The artists will arrive, setup their equipment and then return when they are required. We also offer the use of a microphone for speeches.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Can we have a DJ and band for the evening?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yes, we are used to splitting the evening with a band and DJ can advise on the best way to use both.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    How late can you play?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    It depends on the venue but we are used to late nights, you may have to pay accommodation locally if it is unsafe for the artist to drive home.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    How do we book?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    If you make an inquiry we will email you with artists available for your date and a fee. To book, we will need your names, address and contact numbers. We will then email you a deposit invoice with t&cs. Once payment and t&c's have been received, we will email you a booking confirmation.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    What area do you cover?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Over the last 12 months we have supplied entertainment from Norfolk in the east to Cornwall in the west, the south coast to the midlands. We have artists located across the south which enables us to cover a large area.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="bg-gray-900 border-champagne-gold/30 mb-8">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                  Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Where are you based?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We are based in Somerset close to Bath but, as you can see from the above we can cover a large area.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Do you have public liability and pat tested equipment?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yes, we can supply your venue directly if they ask for it.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    When do we pay?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    You pay a deposit when booking and the final balance in the weeks before your party or wedding or, on the night in cash once the artist have setup.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Can I speak with anyone?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Of course, we are available on the phone during the day <a href="tel:+447970793177" className="text-champagne-gold hover:underline">07970793177</a>, if we do not answer please leave a message and we will call you back.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-champagne-gold mb-3">
                    Are you reliable?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Yes, we have backup talent if someone is ill and have never let any client down on their special party or wedding.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
