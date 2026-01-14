"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Script from "next/script";
import DJSelectionModal from "@/components/DJSelectionModal";
import UpsellSection from "@/components/UpsellSection";

// Load Google reCAPTCHA v3
declare global {
  interface Window {
    grecaptcha: any;
  }
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  weddingDate: z.string().min(1, "Please provide your wedding date"),
  venueNamePostcode: z.string().min(2, "Venue name/postcode must be at least 2 characters"),
  contactPreference: z.enum(["Phone", "Email"], {
    required_error: "Please select your preferred contact method",
  }),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  preferredDJ: z.string().optional(),
  djStartTime: z.string().optional(),
  djFinishTime: z.string().optional(),
  upsellItems: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

const serviceOptions = [
  "DJs",
  "Musicians",
  "Lighting Design",
  "Kit Hire",
  "Fire-Pits",
  "Venue Styling",
];

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [showDJModal, setShowDJModal] = useState(false);
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [djStartTime, setDjStartTime] = useState<string>("");
  const [djFinishTime, setDjFinishTime] = useState<string>("");

  // Replace with your actual Google reCAPTCHA site key
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "YOUR_RECAPTCHA_SITE_KEY";

  useEffect(() => {
    document.title = "Contact Us | West Country Wedding Entertainment Booking";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Get in touch to discuss your wedding entertainment requirements. Professional DJs, lighting design, and venue styling across the West Country including London, Somerset, Bath, Bristol, Dorset, and Devon.");
    }

    // Check if reCAPTCHA is loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        setRecaptchaLoaded(true);
      });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
      contactPreference: undefined,
    },
  });

  const selectedServices = watch("services") || [];

  const toggleService = (service: string) => {
    const current = selectedServices;
    if (current.includes(service)) {
      const newServices = current.filter((s) => s !== service);
      setValue("services", newServices);
      // If unchecking DJs, clear DJ selection
      if (service === "DJs") {
        setSelectedDJ(null);
      }
    } else {
      const newServices = [...current, service];
      setValue("services", newServices);
      // If checking DJs, show modal after a brief delay to ensure state is updated
      if (service === "DJs") {
        setTimeout(() => {
          setShowDJModal(true);
        }, 100);
      }
    }
  };

  const executeRecaptcha = async (): Promise<string | null> => {
    if (!window.grecaptcha || !RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY === "YOUR_RECAPTCHA_SITE_KEY") {
      return null; // Skip if not configured
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "submit" });
      return token;
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      return null;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(""); // Clear any previous errors
    
    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha();
      
      // Include reCAPTCHA token and DJ/upsell data in form submission
      const formDataWithRecaptcha = {
        ...data,
        recaptchaToken,
        preferredDJ: selectedDJ,
        djStartTime: selectedServices.includes("DJs") ? djStartTime : undefined,
        djFinishTime: selectedServices.includes("DJs") ? djFinishTime : undefined,
        upsellItems: selectedUpsells,
      };

      // Submit to API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataWithRecaptcha),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", result);
        throw new Error(result.error || result.details || "Failed to send message");
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        // Reset DJ and upsell selections
        setSelectedDJ(null);
        setSelectedUpsells([]);
        setDjStartTime("");
        setDjFinishTime("");
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      setError(errorMessage);
      alert(`Error: ${errorMessage}\n\nPlease check your email settings or try again later.`);
    }
  };

  return (
    <>
      {/* Load Google reCAPTCHA v3 */}
      {RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY !== "YOUR_RECAPTCHA_SITE_KEY" && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
          onLoad={() => {
            if (window.grecaptcha && window.grecaptcha.ready) {
              window.grecaptcha.ready(() => {
                setRecaptchaLoaded(true);
              });
            }
          }}
        />
      )}
      
      <div>
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25 flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162649/Kin-House-Mirrorball-Clusters_fi5n50.jpg"
            alt="Kin House wedding venue with elegant mirrorball clusters and professional lighting design, showcasing our wedding entertainment services"
            fill
            className="object-cover object-center brightness-110"
            style={{ objectPosition: 'center center' }}
            priority
            sizes="100vw"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-48 md:pt-52"
        >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans mb-4 sm:mb-6 text-white font-bold px-4 drop-shadow-lg">Get in Touch</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold px-4 drop-shadow-md">
            Let&apos;s discuss how we can make your wedding exceptional
          </p>
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="pt-20 pb-8 px-4 bg-gray-800">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl text-white">Contact Form</CardTitle>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-900/30 border-2 border-red-500/50 rounded-md text-red-400 font-medium text-center"
                    >
                      ⚠ {error}
                    </motion.div>
                  )}
                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="text-gray-200">Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Your full name"
                      className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-champagne-gold"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <Label htmlFor="email" className="text-gray-200">Your Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your.email@example.com"
                      className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-champagne-gold"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Wedding Date */}
                  <div>
                    <Label htmlFor="weddingDate" className="text-gray-200">Date of Wedding *</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      {...register("weddingDate")}
                      className="mt-2 bg-gray-700 border-gray-600 text-white focus:border-champagne-gold"
                    />
                    {errors.weddingDate && (
                      <p className="text-sm text-red-400 mt-1">{errors.weddingDate.message}</p>
                    )}
                  </div>

                  {/* Venue Name / Postcode */}
                  <div>
                    <Label htmlFor="venueNamePostcode" className="text-gray-200">Venue Name / Postcode *</Label>
                    <Input
                      id="venueNamePostcode"
                      {...register("venueNamePostcode")}
                      placeholder="Venue name or postcode"
                      className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-champagne-gold"
                    />
                    {errors.venueNamePostcode && (
                      <p className="text-sm text-red-400 mt-1">{errors.venueNamePostcode.message}</p>
                    )}
                  </div>

                  {/* Contact Preference */}
                  <div>
                    <Label className="text-gray-200">How would you like to be contacted? *</Label>
                    <div className="mt-2 flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="contactPhone"
                          value="Phone"
                          {...register("contactPreference")}
                          className="w-4 h-4 text-champagne-gold bg-gray-700 border-gray-600 focus:ring-champagne-gold focus:ring-2 cursor-pointer"
                        />
                        <Label
                          htmlFor="contactPhone"
                          className="text-sm font-normal cursor-pointer text-gray-300"
                        >
                          Phone
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="contactEmail"
                          value="Email"
                          {...register("contactPreference")}
                          className="w-4 h-4 text-champagne-gold bg-gray-700 border-gray-600 focus:ring-champagne-gold focus:ring-2 cursor-pointer"
                        />
                        <Label
                          htmlFor="contactEmail"
                          className="text-sm font-normal cursor-pointer text-gray-300"
                        >
                          Email
                        </Label>
                      </div>
                    </div>
                    {errors.contactPreference && (
                      <p className="text-sm text-red-400 mt-1">{errors.contactPreference.message}</p>
                    )}
                  </div>

                  {/* Service Interest */}
                  <div>
                    <Label className="text-gray-200">Service Interest *</Label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {serviceOptions.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => toggleService(service)}
                            className="border-gray-400 data-[state=checked]:bg-champagne-gold data-[state=checked]:text-black"
                          />
                          <Label
                            htmlFor={service}
                            className="text-sm font-normal cursor-pointer text-gray-300"
                          >
                            {service}
                            {service === "DJs" && selectedDJ && (
                              <span className="ml-2 text-xs text-champagne-gold">
                                ({selectedDJ === null ? "Any DJ" : selectedDJ})
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.services && (
                      <p className="text-sm text-red-400 mt-1">{errors.services.message}</p>
                    )}
                    {selectedServices.includes("DJs") && (
                      <>
                        <p className="text-sm text-gray-400 mt-2">
                          {selectedDJ ? (
                            <>
                              Selected: <span className="text-champagne-gold font-medium">
                                {selectedDJ === null ? "Any DJ" : selectedDJ}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowDJModal(true)}
                                className="text-champagne-gold hover:text-gold-light ml-2 underline"
                              >
                                Change
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-yellow-400">Please select a DJ preference</span>
                              <button
                                type="button"
                                onClick={() => setShowDJModal(true)}
                                className="text-champagne-gold hover:text-gold-light ml-2 underline"
                              >
                                Select Now
                              </button>
                            </>
                          )}
                        </p>
                        {/* DJ Set Times */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="djStartTime" className="text-gray-200">DJ Start Time</Label>
                            <Input
                              id="djStartTime"
                              type="time"
                              value={djStartTime}
                              onChange={(e) => setDjStartTime(e.target.value)}
                              className="mt-2 bg-gray-700 border-gray-600 text-white focus:border-champagne-gold"
                              placeholder="e.g., 19:00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="djFinishTime" className="text-gray-200">DJ Finish Time</Label>
                            <Input
                              id="djFinishTime"
                              type="time"
                              value={djFinishTime}
                              onChange={(e) => setDjFinishTime(e.target.value)}
                              className="mt-2 bg-gray-700 border-gray-600 text-white focus:border-champagne-gold"
                              placeholder="e.g., 00:00"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Upsell Section */}
                  {selectedServices.length > 0 && (
                    <UpsellSection
                      selectedServices={selectedServices}
                      selectedUpsells={selectedUpsells}
                      onUpsellChange={setSelectedUpsells}
                    />
                  )}

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-gray-200">Message *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us about your wedding and any specific requirements..."
                      className="mt-2 min-h-[120px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-champagne-gold"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || submitSuccess}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : submitSuccess
                      ? "Message Sent!"
                      : "Send Message"}
                  </Button>

                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-900/30 border-2 border-green-500/50 rounded-md text-green-400 font-medium text-center"
                    >
                      ✓ Thank you! Your message has been sent. We&apos;ll be in touch soon.
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">Get in Touch Directly</h3>
                <p className="text-base sm:text-lg text-gray-300 mb-5 sm:mb-6 px-4">
                  Prefer to speak directly? We&apos;re here to help make your wedding day perfect.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                  <a
                    href="tel:+447970793177"
                    className="inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-champagne-gold text-black font-bold rounded-lg hover:bg-champagne-gold/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-base sm:text-lg w-full sm:w-auto"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="whitespace-nowrap">+44 7970 793177</span>
                  </a>
                  <p className="text-xs sm:text-sm text-gray-400 text-center">
                    Call us today for a consultation
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* DJ Selection Modal */}
      <DJSelectionModal
        open={showDJModal}
        onClose={() => setShowDJModal(false)}
        onSelect={setSelectedDJ}
        selectedDJ={selectedDJ}
      />
    </div>
    </>
  );
}
