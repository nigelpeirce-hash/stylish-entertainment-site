"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Please provide your event date"),
  venueName: z.string().min(2, "Venue name is required"),
  venuePostcode: z.string().optional(),
  numberOfGuests: z.string().optional(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  message: z.string().optional(),
  budget: z.string().optional(),
  contactPreference: z.enum(["Phone", "Email"]).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const serviceOptions = [
  "DJs",
  "Musicians",
  "Lighting Design",
  "Kit Hire",
  "Fire-Pits",
  "Venue Styling",
  "Party Planning",
];

const eventTypes = [
  "Wedding",
  "Private Party",
  "Corporate Event",
  "Christmas Party",
  "Other",
];

export default function NewBookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  const selectedServices = watch("services") || [];

  const toggleService = (service: string) => {
    const current = selectedServices;
    if (current.includes(service)) {
      setValue("services", current.filter((s) => s !== service));
    } else {
      setValue("services", [...current, service]);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/client/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to submit booking");
        setIsSubmitting(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/client/dashboard");
        }, 2000);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
        <Card className="bg-gray-800 border-champagne-gold/30 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-green-400 text-lg mb-4">
              Booking submitted successfully! Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-2xl">New Booking Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <select
                      id="eventType"
                      {...register("eventType")}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.eventType && (
                      <p className="text-sm text-red-400">{errors.eventType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      {...register("eventDate")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.eventDate && (
                      <p className="text-sm text-red-400">{errors.eventDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venueName">Venue Name *</Label>
                    <Input
                      id="venueName"
                      {...register("venueName")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.venueName && (
                      <p className="text-sm text-red-400">{errors.venueName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venuePostcode">Venue Postcode</Label>
                    <Input
                      id="venuePostcode"
                      {...register("venuePostcode")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfGuests">Number of Guests</Label>
                  <Input
                    id="numberOfGuests"
                    type="number"
                    {...register("numberOfGuests")}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Services Required *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={selectedServices.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <Label htmlFor={service} className="cursor-pointer">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="text-sm text-red-400">{errors.services.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    {...register("budget")}
                    placeholder="e.g., £2000-3000"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPreference">Preferred Contact Method</Label>
                  <select
                    id="contactPreference"
                    {...register("contactPreference")}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                  >
                    <option value="">No preference</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Details</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="Tell us more about your event..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Booking"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-gray-700 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
