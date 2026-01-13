"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function TermsAndConditionsPage() {
  useEffect(() => {
    document.title = "Terms and Conditions | Stylish Entertainment";
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <FileText className="w-8 h-8 text-champagne-gold" />
                Terms and Conditions
              </CardTitle>
              <p className="text-gray-400 mt-2">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">1. Booking Confirmation</h2>
                <p className="text-gray-300 leading-relaxed">
                  This booking form serves as an invitation only. Submission of this form does not constitute a confirmation of artist performance. 
                  Once we have final confirmation from your chosen DJ, we will email a booking invoice with full terms and conditions.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">2. Payment Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  A deposit is required upon booking confirmation. The final balance is due in the weeks before your event, or on the night in cash 
                  once the artist has set up. If the DJ is not paid in full at the start of the evening, they may refuse to play.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">3. Cancellation Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  Cancellations must be made in writing. The deposit is non-refundable. Cancellations made within 30 days of the event date 
                  may incur additional charges as outlined in your booking confirmation.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">4. Artist Availability</h2>
                <p className="text-gray-300 leading-relaxed">
                  We will confirm artist availability before finalising your booking. In the unlikely event that your chosen artist becomes unavailable, 
                  we will offer a suitable replacement or provide a full refund of your deposit.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">5. Setup and Access</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our artists require adequate setup time and access to the venue. Early setup may be available for an additional fee. 
                  Please ensure the venue provides suitable access and parking arrangements.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">6. Venue Requirements</h2>
                <p className="text-gray-300 leading-relaxed">
                  You must seek permission from your venue before booking our services. Some venues have specific requirements or restrictions. 
                  We are always respectful of venue policies and will work within their guidelines.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">7. Equipment and Safety</h2>
                <p className="text-gray-300 leading-relaxed">
                  All equipment is PAT tested and we have public liability insurance. Certificates can be provided to your venue upon request.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">8. Music and Requests</h2>
                <p className="text-gray-300 leading-relaxed">
                  We actively encourage music requests and will create a bespoke set for your event. Our DJs use their professional judgement 
                  to ensure the dance floor stays full. Please provide any must-play or do-not-play lists in advance.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">9. Liability</h2>
                <p className="text-gray-300 leading-relaxed">
                  While we take every care to provide an excellent service, Stylish Entertainment Ltd accepts no liability for delays or cancellations 
                  due to circumstances beyond our control, including but not limited to severe weather, venue closure, or government restrictions.
                </p>

                <h2 className="text-2xl font-bold text-champagne-gold mt-6 mb-4">10. Data Protection</h2>
                <p className="text-gray-300 leading-relaxed">
                  Your personal information will be stored securely and used only for the purposes of managing your booking. 
                  Please see our <Link href="/privacy-policy" className="text-champagne-gold hover:text-gold-light underline">Privacy Policy</Link> for more details.
                </p>

                <div className="mt-8 p-4 bg-champagne-gold/10 border border-champagne-gold/30 rounded-lg">
                  <p className="text-gray-300">
                    <strong className="text-champagne-gold">Questions?</strong> Please contact us at{" "}
                    <a href="tel:07970793177" className="text-champagne-gold hover:text-gold-light underline">
                      07970793177
                    </a>{" "}
                    or{" "}
                    <Link href="/contact-us" className="text-champagne-gold hover:text-gold-light underline">
                      use our contact form
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
