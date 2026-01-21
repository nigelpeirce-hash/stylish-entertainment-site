"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneAreaCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  eventDate: z.string().min(1, "Please provide your event date"),
  venuePostcode: z.string().min(5, "Please enter a valid postcode (minimum 5 characters)"),
});

type FormData = z.infer<typeof formSchema>;

export default function NewInquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    document.title = "New Enquiry | STYLISH Entertainment";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/inquiries/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit enquiry");
      }

      setSubmitSuccess(true);
      reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl text-white font-serif">
                New Enquiry
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base">
                Tell us about your event and we'll get back to you shortly
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-900/30 border-2 border-green-500/50 rounded-md text-green-400 font-medium mb-6 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Thank you! We've received your enquiry and will contact you soon.
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-900/30 border-2 border-red-500/50 rounded-md text-red-400 font-medium mb-6 flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-gray-200">
                    Name *
                  </Label>
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

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-gray-200">
                    Email Address *
                  </Label>
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

                {/* Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneAreaCode" className="text-gray-200">
                      Phone Area Code
                    </Label>
                    <Input
                      id="phoneAreaCode"
                      {...register("phoneAreaCode")}
                      placeholder="+44"
                      className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-champagne-gold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-gray-200">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      placeholder="1234567890"
                      className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-champagne-gold"
                    />
                  </div>
                </div>

                {/* Event Date */}
                <div>
                  <Label htmlFor="eventDate" className="text-gray-200">
                    Event Date *
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    {...register("eventDate")}
                    className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-champagne-gold"
                  />
                  {errors.eventDate && (
                    <p className="text-sm text-red-400 mt-1">{errors.eventDate.message}</p>
                  )}
                </div>

                {/* Venue Postcode */}
                <div>
                  <Label htmlFor="venuePostcode" className="text-gray-200">
                    Venue Postcode *
                  </Label>
                  <Input
                    id="venuePostcode"
                    {...register("venuePostcode")}
                    placeholder="SW1A 1AA"
                    className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-champagne-gold uppercase"
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.venuePostcode && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.venuePostcode.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    We'll use this to check our availability for your date and location
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-champagne-gold text-black hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
