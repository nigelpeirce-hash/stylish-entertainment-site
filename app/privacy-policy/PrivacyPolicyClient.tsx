"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function PrivacyPolicyClient() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      {/* Content */}
      <section
        className="py-20 px-4 bg-gray-800 pt-32 md:pt-40 relative"
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Quick Links Sidebar - Sticky on Desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="lg:sticky lg:top-24">
                <Card className="bg-white/5 backdrop-blur-xl border-champagne-gold/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <button
                      onClick={() => scrollToSection("data-collection")}
                      className="w-full text-left text-gray-200 hover:text-champagne-gold transition-colors flex items-center gap-2 py-2 text-sm"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Data Collection</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("your-rights")}
                      className="w-full text-left text-gray-200 hover:text-champagne-gold transition-colors flex items-center gap-2 py-2 text-sm"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Your Rights</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("contact-us")}
                      className="w-full text-left text-gray-200 hover:text-champagne-gold transition-colors flex items-center gap-2 py-2 text-sm"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Contact Us</span>
                    </button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-champagne-gold/30">
                  <CardContent className="p-6 sm:p-8 md:p-12">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-6 text-white font-bold">
                        Privacy Policy
                      </h1>
                      <p className="text-sm md:text-base text-gray-200 font-semibold border-t border-b border-champagne-gold/30 py-2 inline-block px-4">
                        Last updated: 1st January 2024
                      </p>
                    </div>

                    {/* Privacy Promise Box */}
                    <Card className="bg-gradient-to-br from-champagne-gold/10 to-transparent border-2 border-champagne-gold/50 mb-8">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <ShieldCheck className="w-8 h-8 text-champagne-gold flex-shrink-0 mt-1" />
                          <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Our Privacy Promise</h2>
                            <p className="text-gray-200 leading-relaxed">
                              As a small, family-run business, we value your privacy as much as our own. We never sell your details to third parties. We only collect the essentials needed to create your perfect event.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="prose prose-sm md:prose-base prose-invert max-w-none text-gray-200 leading-relaxed space-y-6">
                      <p>
                        At Stylish Entertainment Ltd we are committed to protecting and respecting your privacy. This Privacy Policy together with our Cookie Policy, Terms and Conditions and any other documents referred to herein, sets out the basis on which we will process any personal data that we collect from you, or that you provide to us. Please read the following carefully to understand our views and practices regarding your personal data and how we will treat it. By using this website and our services you are accepting and consenting to the practices described in this Privacy Policy.
                      </p>

                      <p>
                        For the purpose of the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and any subsequent amendment or replacement or supplementary legislation (the &quot;Act&quot;), the data controller is Stylish Entertainment Ltd of 88 Weymouth Road, Frome, Somerset BA11 1HJ.
                      </p>

                      <div className="my-8" id="data-collection">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Information we may collect from you</h2>
                        <p className="mb-4">We may collect and process the following information about you:</p>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-6">Information you give us</h3>
                        <p className="mb-4">
                          By filling in forms on our website or by corresponding with us by telephone, email or otherwise you give us information about yourself. This includes information you provide when you register to use our website, subscribe to our services or newsletter, search for products, place an order on our website, participate in discussion boards or other social media functions on our website, enter a competition, promotion or survey, when you chat to one of our sales or support personnel and when you report a problem with our Site.
                        </p>
                        <p>
                          The information you give us may include your name, address, e-mail address and phone number.
                        </p>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-6">Information we collect about you</h3>
                        <p className="mb-4">Each time you visit our website we may automatically collect the following information:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                          <li>Technical information, including the Internet Protocol (IP) address used to connect your computer to the Internet, your log information, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform.</li>
                          <li>Information about your online activity, which may include your URL, visits to, through and from our website (including date and time), length of visits to certain pages, page interaction information (such as scrolling, clicks and mouse-overs) and methods to browse away from the page, page response times, download errors and any phone number used to call our customer service number.</li>
                        </ul>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-6">Information we receive from other sources</h3>
                        <p>
                          We may receive information about you if you use any of the other websites we operate or the other services we provide. In this case we will have informed you when we collected that data that it may be shared internally and combined with data collected on this Site. We are also working closely with third parties (including, for example, business partners, sub-contractors in technical, payment and delivery services, advertising networks, analytics providers, search information providers) and may receive information about you from them.
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Cookies</h2>
                        <p>
                          We use cookies on our website to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve the website.
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Uses made of the information</h2>
                        <p className="mb-4">We use information held about you in the following ways:</p>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-6">Information you give to us</h3>
                        <p className="mb-4">We use this information to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                          <li>Administer and provide you with the products and services that you request from us;</li>
                          <li>Notify you about changes to our services;</li>
                          <li>Ensure that content from our website is presented in the most effective manner for you and for your computer;</li>
                          <li>Provide you with information about products and services that you request from us, or about other goods and services we offer that are similar to those that you have already purchased or enquired about;</li>
                          <li>Carry out our obligations under any contracts we have entered into with you.</li>
                        </ul>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-6">Information we collect about you</h3>
                        <p className="mb-4">We use this information to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Administer the website and for internal operations including troubleshooting, data analysis, testing, research, statistical and survey purposes;</li>
                          <li>To improve the website and ensure that content is presented in the most effective manner for you and your computer;</li>
                          <li>Allow you to participate in interactive features of our services, when you choose to do so;</li>
                          <li>Keep our website safe and secure;</li>
                          <li>Measure or understand the effectiveness of advertising or promotions we send to you and others; and</li>
                          <li>Deliver relevant advertising or promotions to you;</li>
                          <li>To make suggestions and recommendations to you and other users of our website about goods or services that may interest you or them.</li>
                        </ul>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Disclosure of your information</h2>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-6">Information we share with third parties</h3>
                        <p className="mb-4">We may share your information with selected third parties:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                          <li>Business partners, suppliers and sub-contractors for the performance of any contract we enter into with them or you. For example: to provide technical assistance, payment and delivery services, advertising networks, analytics providers, search information providers and credit reference agencies;</li>
                          <li>Credit reference agencies for the purpose of assessing your credit score where this is a condition of us entering into a contract with you.</li>
                        </ul>
                        <p>
                          We will only share your information that is essential for such third parties to provide services on our behalf.
                        </p>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-6">Information we disclose to third parties</h3>
                        <p className="mb-4">We may disclose your personal (business) data to third parties:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>In the event that we sell or buy any business or assets, in which case we may disclose your personal data to the prospective seller or buyer of such business or assets, subject to the seller or buyer signing a suitable confidentiality undertaking;</li>
                          <li>If Stylish Entertainment Ltd or substantially all of its assets are acquired by a third party, in which case personal data held by it about its customers will be one of the transferred assets;</li>
                          <li>If we are under a duty to disclose or share your personal data in order to comply with any legal obligation, or in order to enforce or apply our Terms and Conditions or other agreement with you and/or any other agreements; or to protect our rights, property, safety, our customers or others. This includes exchanging information with other companies and organisations for the purposes of fraud protection and credit risk reduction.</li>
                        </ul>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Where we store your personal data</h2>
                        <p className="mb-4">
                          The personal data that we collect from you may be transferred to, and stored at, a destination outside the European Economic Area (&quot;EEA&quot;). It may also be processed by staff operating outside the EEA who work for us or for one of our suppliers or partners. Such staff may be engaged in, among other things, the fulfilment of the service, the processing of your payment details and the provision of support services. By submitting your data, you agree to this transfer, storing or processing outside of the EEA.
                        </p>
                        <p className="mb-4">
                          We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy. In particular, this means that your personal data will only be transferred to a country that provides an adequate level of protection (for example, where the European Commission has determined that a country provides an adequate level of protection) or where the recipient is bound by standard contractual clause according to conditions provided by the European Commission (&quot;EU Model Clauses&quot;).
                        </p>
                        <p>
                          Our website is accessible via the internet and may potentially be accessed by anyone around the world. Other users may access the website from outside the EEA. This means that where you choose to post your data on our website, it could be accessed from anywhere around the world and therefore a transfer of your data outside of the EEA may be deemed to have occurred. You consent to such transfer of your data for and by way of this purpose.
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Protection of Information</h2>
                        <p className="mb-4">
                          All information you provide to us is stored on our secure servers. All personal data will be encrypted at rest and in transit between our servers and your browser. We will take all steps reasonably necessary to ensure that your information is treated securely and in accordance with this Privacy Policy. Where we have given you (or where you have chosen) a password which enables you to access certain parts of our website or services, you are responsible for keeping this password confidential. We ask you not to share any password with anyone.
                        </p>
                        <p>
                          Unfortunately, the transmission of any information across the Internet cannot be guaranteed to be completely secure. Although we will endeavour to protect your information, we cannot guarantee the security of your information transmitted to our website. Any transmission is at your own risk. Once we have received your information, we will use strict procedures and security features to try to prevent unauthorised access.
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Links to other websites</h2>
                        <p>
                          Our website or the services may, from time to time, contain links to and from the websites of our partner networks, advertisers and affiliates. This privacy policy does not cover use of other websites linked from this website. If you follow a link to any of these websites, please note that these websites have their own privacy policies and that we do not accept any responsibility or liability for these policies. We encourage you to read the privacy statements on other websites you visit before providing any information about yourself.
                        </p>
                      </div>

                      <div className="my-8" id="your-rights">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Your rights</h2>
                        <p className="mb-4">You have the right under the Act, free of charge to request:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>Access to your personal data;</li>
                          <li>Rectification or deletion of your personal data;</li>
                          <li>A restriction on the processing of your personal data;</li>
                          <li>Object to the processing of your personal data;</li>
                          <li>A transfer of your personal data (data portability).</li>
                        </ul>
                        <p className="mt-4">
                          You can make a request in relation to any of the above rights by writing to us at the contact address given at the end of this Privacy Policy. We will respond to such queries within 30 days and deal with requests we receive from you, in accordance with the provisions of the Act.
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Consent</h2>
                        <p className="mb-4">
                          You have the right to withdraw your consent to us processing your personal data, at any time, by writing to us at the contact address given at the end of this Privacy Policy.
                        </p>
                        <p className="mb-4">
                          Where we process your personal data for marketing purposes, we will inform you and obtain your opt-in consent (before collecting your personal data) if we intend to use your personal data for such purposes or if we intend to disclose your information to any third party for such purposes. If you change your mind about being contacted in the future, please click on the opt-out options and we will remove you from our mailing lists.
                        </p>
                        <p>
                          We send notifications and emails from time to time in order to update you about any service updates, events and promotions we may be running. If you no longer wish to receive these communications, please disable these in the settings on your device.
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Data Retention</h2>
                        <p className="mb-4">
                          We retain personal data for as long as necessary for the relevant activity for which it was provided or collected. This will be for as long as we provide access to the website or services to you, your account with us remains open or any period set out in any relevant contract you have with us. However, we may keep some data after your account is closed or you cease using the services for the purposes set out below.
                        </p>
                        <p className="mb-4">
                          After your account has been closed, we usually delete personal data, however we may retain personal data where reasonably necessary to comply with our legal obligations (including law enforcement requests), meet regulatory requirements, maintain security, prevent fraud and abuse, resolve disputes, enforce our Terms and Conditions, or fulfil your request to &quot;unsubscribe&quot; from further messages from us.
                        </p>
                        <p>
                          We may retain de-personalised information after your account has been closed. Please note: After you have closed your account or deleted information from your account, any information you have shared with others will remain visible. We do not control data that other users may have copied from the website or services.
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Age of Users</h2>
                        <p>
                          This website is not intended for and shall not be used by anyone under the age of 18.
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Complaints or queries</h2>
                        <p className="mb-4">
                          Our intention is to meet the highest standards when collecting and using personal data. For this reason, we take any complaints we receive very seriously. We encourage people to notify us if they think that our collection or use of their personal data is unfair, misleading or inappropriate.
                        </p>
                        <p>
                          If you have any complaints about our use of your personal data please contact us as set out at the end of this Privacy Policy or contact our supervisory authority in the UK: The Information Commissioner&apos;s Office at, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF, England (&quot;ICO&quot;).
                        </p>
                      </div>

                      <div className="my-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Changes to this privacy policy</h2>
                        <p>
                          Any changes we may make to our Privacy Policy in the future will be posted on this page and, where appropriate, notified to you by e-mail. Please check back frequently to see any updates or changes to our Privacy Policy. This Privacy Policy was last updated on 1st January 2024 and replaces any other Privacy Policy previously applicable.
                        </p>
                      </div>

                      <div className="my-8 p-6 bg-white/5 backdrop-blur-lg rounded-lg border border-champagne-gold/30" id="contact-us">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How to contact us</h2>
                        <p className="mb-4 text-gray-200">
                          Questions, comments and requests regarding this Privacy Policy are welcomed and should be addressed to:
                        </p>
                        <p className="mb-2 text-gray-200">
                          <strong>Email:</strong>{" "}
                          <Link href="mailto:info@stylishentertainment.co.uk" className="text-champagne-gold hover:text-gold-light underline">
                            info@stylishentertainment.co.uk
                          </Link>
                        </p>
                        <p className="text-gray-200">
                          <strong>Postal Address:</strong> Stylish Entertainment Ltd, 88 Weymouth Road, Frome, Somerset, BA11 1HJ, UK
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
