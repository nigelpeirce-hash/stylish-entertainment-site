"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { formSchema, type FormData, referralOptions, eventTypeOptions } from "@/lib/contact-schema";

// Load Google reCAPTCHA v3
declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ContactForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "YOUR_RECAPTCHA_SITE_KEY";

  useEffect(() => {
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
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralSource: "",
      eventType: "",
    },
  });

  const executeRecaptcha = async (): Promise<string | null> => {
    if (!window.grecaptcha || !RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY === "YOUR_RECAPTCHA_SITE_KEY") {
      return null;
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
    setError("");
    
    try {
      const recaptchaToken = await executeRecaptcha();
      
      const formDataWithRecaptcha = {
        ...data,
        recaptchaToken,
      };

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

      // Redirect to thank-you page on success (status 200)
      if (response.status === 200) {
        router.push("/thank-you/");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <>
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

      <section
        className="pt-20 pb-8 px-4 relative"
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl text-white">Premium Inquiry Experience</CardTitle>
                <CardDescription className="text-gray-200 text-sm sm:text-base">
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-900/30 border-2 border-red-500/50 rounded-md text-red-400 font-medium text-center"
                    >
                      ⚠ {error}
                    </motion.div>
                  )}

                  <div>
                    <Label htmlFor="name" className="text-gray-200">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Your full name"
                      className="mt-2 bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-200">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your.email@example.com"
                      className="mt-2 bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-200">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+44 7970 793177"
                      className="mt-2 bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-400 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="eventDate" className="text-gray-200">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      {...register("eventDate")}
                      className="mt-2 bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                    {errors.eventDate && (
                      <p className="text-sm text-red-400 mt-1">{errors.eventDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="venueName" className="text-gray-200">Venue Name *</Label>
                    <Input
                      id="venueName"
                      {...register("venueName")}
                      placeholder="Venue name"
                      className="mt-2 bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                    {errors.venueName && (
                      <p className="text-sm text-red-400 mt-1">{errors.venueName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="referralSource" className="text-gray-200">How did you hear about us? *</Label>
                    <Select
                      id="referralSource"
                      {...register("referralSource")}
                      className="mt-2"
                    >
                      {referralOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {errors.referralSource && (
                      <p className="text-sm text-red-400 mt-1">{errors.referralSource.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="eventType" className="text-gray-200">Event Type *</Label>
                    <Select
                      id="eventType"
                      {...register("eventType")}
                      className="mt-2"
                    >
                      {eventTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {errors.eventType && (
                      <p className="text-sm text-red-400 mt-1">{errors.eventType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-200">Message *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us about your event and any specific requirements..."
                      className="mt-2 min-h-[120px] bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 pt-6 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span>
                        Your data is private. We never sell your details.{" "}
                        <Link href="/privacy-policy/" className="text-champagne-gold hover:underline">
                          See our Privacy Policy
                        </Link>
                        .
                      </span>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-champagne-gold text-black hover:bg-gold-light shadow-lg min-w-[150px]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </div>
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
            <Card className="bg-gradient-to-br from-champagne-gold/10 to-yellow-400/10 border-2 border-champagne-gold/40 backdrop-blur-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">
                  Get in Touch Directly
                </h3>
                <p className="text-base sm:text-lg text-gray-200 mb-5 sm:mb-6 px-4">
                  Prefer to speak directly? We&apos;re here to help make your event perfect.
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
    </>
  );
}
