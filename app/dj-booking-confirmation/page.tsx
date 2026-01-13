"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Music, User, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react";

const bookingSchema = z.object({
  // Client Information
  name: z.string().min(2, "Full Names is required"),
  homeAddress: z.string().min(2, "Home Address is required"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  
  // Event Details
  eventDate: z.string().min(1, "Event Date is required"),
  eventType: z.string().min(1, "Please select an event type"),
  
  // DJ Selection
  chosenDJ: z.string().min(1, "Please select a DJ"),
  musicians: z.string().optional(),
  earlySetup: z.boolean().optional(),
  
  // Venue Details
  venueNamePostcode: z.string().min(2, "Venue Name & Postcode is required"),
  musicStartFinishTime: z.string().optional(),
  agreedFee: z.string().optional(),
  
  // Other Requirements
  otherRequirements: z.string().optional(),
  
  // Account Creation
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
  
  // Terms & Conditions
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms and Conditions to complete your booking",
  }),
}).refine((data) => {
  if (data.createAccount && (!data.password || data.password.length < 8)) {
    return false;
  }
  return true;
}, {
  message: "Password must be at least 8 characters when creating an account",
  path: ["password"],
});

type BookingFormData = z.infer<typeof bookingSchema>;

const eventTypes = [
  "Please Select",
  "Wedding",
  "Party",
  "Corporate",
  "Other",
];

const djs = [
  "Please Select",
  "DJ Nige",
  "DJ Rich",
  "DJ James H",
  "DJ Brett",
  "DJ James F",
  "DJ Ricky",
];

const musiciansOptions = [
  "Please Select",
  "Sax Player and Percussionist",
  "Sax Player",
  "Percussionist",
];

export default function DJBookingConfirmationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [showAccountCreation, setShowAccountCreation] = useState(false);

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
      eventType: "Please Select",
      chosenDJ: "Please Select",
      musicians: "Please Select",
      earlySetup: false,
      createAccount: false,
      termsAccepted: false,
    },
  });

  const createAccount = watch("createAccount");
  const earlySetup = watch("earlySetup");

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setError("");

    // Validate dropdowns
    if (data.eventType === "Please Select") {
      setError("Please select an Event Type");
      setIsSubmitting(false);
      return;
    }
    if (data.chosenDJ === "Please Select") {
      setError("Please select a DJ");
      setIsSubmitting(false);
      return;
    }

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
          homeAddress: data.homeAddress,
          eventType: data.eventType,
          eventDate: data.eventDate,
          chosenDJ: data.chosenDJ,
          musicians: data.musicians !== "Please Select" ? data.musicians : null,
          earlySetup: data.earlySetup,
          venueNamePostcode: data.venueNamePostcode,
          musicStartFinishTime: data.musicStartFinishTime,
          agreedFee: data.agreedFee,
          otherRequirements: data.otherRequirements,
          services: ["DJs"], // Default service
          termsAccepted: data.termsAccepted,
        }),
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResponse.ok) {
        setError(bookingResult.error || "Failed to submit booking");
        setIsSubmitting(false);
      } else {
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
              Booking form submitted successfully!
            </p>
            <p className="text-gray-400 text-sm">
              We will be in touch soon to confirm your booking.
            </p>
            {createAccount && !session ? (
              <p className="text-gray-300 text-sm">
                Redirecting to login...
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => router.push("/dj-worksheet")}
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  Complete DJ Worksheet
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="border-gray-700 text-white"
                >
                  Return to Home
                </Button>
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
                STYLISH Entertainment Ltd DJ Booking Form
              </CardTitle>
              <CardDescription className="text-gray-300 mt-4 space-y-2">
                <p>
                  I am delighted that you would like to book one of our DJs. Please understand that this booking form serves as an invitation only. This does not constitute a confirmation of artist performance.
                </p>
                <p>
                  Once we have final confirmation from your chosen DJ we will email a booking invoice with terms and conditions.
                </p>
                <p className="font-semibold text-champagne-gold">Thank you. Alison</p>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Names (Happy couple if a Wedding) *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="John & Jane Doe"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homeAddress">Home Address *</Label>
                    <Textarea
                      id="homeAddress"
                      {...register("homeAddress")}
                      rows={3}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Your full home address"
                    />
                    {errors.homeAddress && (
                      <p className="text-sm text-red-400">{errors.homeAddress.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email *</Label>
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

                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type *</Label>
                      <select
                        id="eventType"
                        {...register("eventType")}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      >
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
                  </div>
                </div>

                {/* DJ Selection */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    DJ Selection
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="chosenDJ">Chosen DJ *</Label>
                    <select
                      id="chosenDJ"
                      {...register("chosenDJ")}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    >
                      {djs.map((dj) => (
                        <option key={dj} value={dj}>
                          {dj}
                        </option>
                      ))}
                    </select>
                    {errors.chosenDJ && (
                      <p className="text-sm text-red-400">{errors.chosenDJ.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="musicians">Add Musicians to play with DJ</Label>
                    <select
                      id="musicians"
                      {...register("musicians")}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    >
                      {musiciansOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="earlySetup"
                        {...register("earlySetup")}
                      />
                      <Label htmlFor="earlySetup" className="cursor-pointer">
                        Early Setup Required (additional £120)? Includes use of PA for speeches and Ipod connection.
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Venue & Payment Details */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Venue & Payment Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="venueNamePostcode">Venue Name & Postcode *</Label>
                    <Input
                      id="venueNamePostcode"
                      {...register("venueNamePostcode")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Venue name and postcode"
                    />
                    {errors.venueNamePostcode && (
                      <p className="text-sm text-red-400">{errors.venueNamePostcode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="musicStartFinishTime">Music Start & Finish Time (Approx) *</Label>
                    <Input
                      id="musicStartFinishTime"
                      {...register("musicStartFinishTime")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="e.g., 7:00 PM - 12:00 AM"
                    />
                    {errors.musicStartFinishTime && (
                      <p className="text-sm text-red-400">{errors.musicStartFinishTime.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agreedFee" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Agreed Fee *
                    </Label>
                    <Input
                      id="agreedFee"
                      {...register("agreedFee")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="£0.00"
                    />
                    {errors.agreedFee && (
                      <p className="text-sm text-red-400">{errors.agreedFee.message}</p>
                    )}
                  </div>
                </div>

                {/* Other Requirements */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <div className="space-y-2">
                    <Label htmlFor="otherRequirements">
                      Other requirements - lighting, musicians, production & styling?
                    </Label>
                    <Textarea
                      id="otherRequirements"
                      {...register("otherRequirements")}
                      rows={4}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Any additional requirements..."
                    />
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-4 border-t border-gray-700 pt-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="termsAccepted"
                      {...register("termsAccepted")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="termsAccepted" className="cursor-pointer text-sm">
                        I accept the{" "}
                        <Link 
                          href="/terms-and-conditions" 
                          target="_blank"
                          className="text-champagne-gold hover:text-gold-light underline"
                        >
                          Terms and Conditions
                        </Link>
                        {" "}*
                      </Label>
                      {errors.termsAccepted && (
                        <p className="text-sm text-red-400 mt-1">{errors.termsAccepted.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
                  <Button
                    type="submit"
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
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
      </div>
    </div>
  );
}
