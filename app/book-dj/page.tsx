"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, Mail, Phone, MapPin, Music } from "lucide-react";
import DJSelectionModal from "@/components/DJSelectionModal";
import UpsellSection from "@/components/UpsellSection";

const bookingSchema = z.object({
  // Client Information
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  
  // Event Details
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Event date is required"),
  numberOfGuests: z.string().optional(),
  
  // Venue Information
  venueName: z.string().min(2, "Venue name is required"),
  venueAddress: z.string().optional(),
  venuePostcode: z.string().optional(),
  
  // Booking Details
  message: z.string().optional(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  
  // Account Creation
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
}).refine((data) => {
  // If creating account, password is required
  if (data.createAccount && (!data.password || data.password.length < 8)) {
    return false;
  }
  return true;
}, {
  message: "Password must be at least 8 characters when creating an account",
  path: ["password"],
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

function BookDJPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [showDJModal, setShowDJModal] = useState(false);
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);

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
      eventType: searchParams?.get("type") || "wedding",
      createAccount: false,
    },
  });

  const selectedServices = watch("services") || [];
  const createAccount = watch("createAccount");
  const password = watch("password");

  useEffect(() => {
    if (createAccount) {
      setShowAccountCreation(true);
    }
  }, [createAccount]);

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

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // If creating account and not logged in, create account first
      if (data.createAccount && !session) {
        try {
          const registerResponse = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              password: data.password,
            }),
          });

          if (!registerResponse.ok) {
            const registerError = await registerResponse.json();
            setError(registerError.error || "Failed to create account");
            setIsSubmitting(false);
            return;
          }
        } catch (registerError) {
          setError("Failed to create account. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Create booking
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          eventType: data.eventType,
          eventDate: data.eventDate,
          venueName: data.venueName,
          venueAddress: data.venueAddress,
          venuePostcode: data.venuePostcode,
          numberOfGuests: data.numberOfGuests ? parseInt(data.numberOfGuests) : null,
          services: data.services,
          message: data.message,
          preferredDJ: selectedDJ,
          upsellItems: selectedUpsells,
          termsAccepted: true, // Terms accepted by submitting the form
        }),
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResponse.ok) {
        setError(bookingResult.error || "Failed to submit booking");
        setIsSubmitting(false);
      } else {
        setBookingId(bookingResult.booking?.id);
        setSuccess(true);
        
        // If account was created, redirect to login
        if (data.createAccount && !session) {
          setTimeout(() => {
            router.push(`/login?registered=true&email=${encodeURIComponent(data.email)}`);
          }, 2000);
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
        <Card className="bg-gray-800 border-champagne-gold/30 max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-green-400 text-lg">
              Booking submitted successfully!
            </p>
            <p className="text-gray-400 text-sm">
              We'll be in touch soon to confirm your booking.
            </p>
            <p className="text-gray-300 text-xs mt-2">
              Once your booking is confirmed, you'll be able to complete the DJ worksheet and manage your booking online.
            </p>
            {createAccount && !session ? (
              <p className="text-gray-300 text-sm">
                Redirecting to login...
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => router.push("/")}
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  Return to Home
                </Button>
                {session && (
                  <Button
                    onClick={() => router.push("/client/dashboard")}
                    variant="outline"
                    className="border-gray-700 text-white"
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
            )}
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
              <CardTitle className="text-3xl flex items-center gap-2">
                <Music className="w-8 h-8 text-champagne-gold" />
                Book Your DJ
              </CardTitle>
              <CardDescription className="text-gray-300">
                Complete your booking details. You can create an account to manage your booking online.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                    {error}
                  </div>
                )}

                {/* Client Information */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="Your name"
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
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="01234567890"
                    />
                  </div>

                  {/* Account Creation Option */}
                  {!session && (
                    <div className="space-y-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="createAccount"
                          {...register("createAccount")}
                          onCheckedChange={(checked) => {
                            setValue("createAccount", checked as boolean);
                            setShowAccountCreation(checked as boolean);
                          }}
                        />
                        <Label htmlFor="createAccount" className="cursor-pointer">
                          Create an account to manage your booking online
                        </Label>
                      </div>

                      {showAccountCreation && (
                        <div className="space-y-2 pl-6 border-l-2 border-champagne-gold/30">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="bg-gray-900 border-gray-700 text-white"
                            placeholder="At least 8 characters"
                          />
                          {errors.password && (
                            <p className="text-sm text-red-400">{errors.password.message}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            Create an account to view your booking status and complete the DJ worksheet online
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {session && (
                    <p className="text-sm text-gray-400">
                      Logged in as {session.user?.email}. Booking will be linked to your account.
                    </p>
                  )}
                </div>

                {/* Event Details */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Event Details
                  </h3>

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

                  <div className="space-y-2">
                    <Label htmlFor="numberOfGuests">Number of Guests</Label>
                    <Input
                      id="numberOfGuests"
                      type="number"
                      {...register("numberOfGuests")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Approximate number"
                    />
                  </div>
                </div>

                {/* Venue Information */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Venue Information
                  </h3>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueAddress">Venue Address</Label>
                      <Input
                        id="venueAddress"
                        {...register("venueAddress")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venuePostcode">Postcode</Label>
                      <Input
                        id="venuePostcode"
                        {...register("venuePostcode")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold">Services Required *</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceOptions.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={selectedServices.includes(service)}
                          onCheckedChange={() => toggleService(service)}
                        />
                        <Label htmlFor={service} className="cursor-pointer text-sm">
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
                    <p className="text-sm text-red-400">{errors.services.message}</p>
                  )}
                  {selectedServices.includes("DJs") && (
                    <p className="text-sm text-gray-400 mt-2">
                      {selectedDJ ? (
                        <>
                          Selected: <span className="text-champagne-gold font-medium">
                            {selectedDJ === null ? "Any DJ" : selectedDJ}
                          </span>
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setShowDJModal(true)}
                            className="text-champagne-gold hover:text-gold-light ml-2 p-0 h-auto"
                          >
                            Change
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-yellow-400">Please select a DJ preference</span>
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setShowDJModal(true)}
                            className="text-champagne-gold hover:text-gold-light ml-2 p-0 h-auto"
                          >
                            Select Now
                          </Button>
                        </>
                      )}
                    </p>
                  )}
                </div>

                {/* Upsell Section - Shows when at least one service is selected */}
                {selectedServices.length > 0 && (
                  <UpsellSection
                    selectedServices={selectedServices}
                    selectedUpsells={selectedUpsells}
                    onUpsellChange={setSelectedUpsells}
                  />
                )}

                {/* Additional Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="Any additional details about your event..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
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
                    onClick={() => router.push("/")}
                    className="border-gray-700 text-white"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Login Link */}
                {!session && (
                  <p className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-champagne-gold hover:text-gold-light underline">
                      Sign in here
                    </Link>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* DJ Selection Modal */}
        <DJSelectionModal
          open={showDJModal}
          onClose={() => setShowDJModal(false)}
          onSelect={(dj) => setSelectedDJ(dj)}
          selectedDJ={selectedDJ}
        />
      </div>
    </div>
  );
}

export default function BookDJPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <BookDJPageContent />
    </Suspense>
  );
}
