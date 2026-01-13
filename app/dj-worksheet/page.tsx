"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, User, Phone, MapPin, Music, CreditCard } from "lucide-react";

const weddingDJSchema = z.object({
  // Client Information
  name: z.string().min(2, "Happy Couple name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneAreaCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  
  // Event Details
  eventDate: z.string().min(1, "Wedding Date is required"),
  
  // Venue Information
  venueName: z.string().min(2, "Venue Name is required"),
  venueContact: z.string().optional(),
  venueAddress: z.string().optional(),
  venueAddress2: z.string().optional(),
  venueTown: z.string().optional(),
  venueCounty: z.string().optional(),
  venuePostcode: z.string().optional(),
  venuePhoneAreaCode: z.string().optional(),
  venuePhoneNumber: z.string().optional(),
  
  // DJ Details
  djArrivalTime: z.string().optional(),
  djStartTime: z.string().optional(),
  djFinishTime: z.string().optional(),
  djSetupLocation: z.string().optional(),
  djParking: z.string().optional(),
  soundLimiter: z.enum(["Yes", "No"]).optional(),
  numberOfGuests: z.string().optional(),
  
  // Payment
  finalBalance: z.string().optional(),
  paymentPayerName: z.string().optional(),
  
  // Music Details
  musicNotesToDJ: z.string().optional(),
  musicNotesToStylish: z.string().optional(),
  firstDance: z.string().optional(),
  lastSong: z.string().optional(),
  musicDislikes: z.string().optional(),
  musicRequests: z.string().optional(),
});

type WeddingDJFormData = z.infer<typeof weddingDJSchema>;

export default function DJWorksheetPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeddingDJFormData>({
    resolver: zodResolver(weddingDJSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  const onSubmit = async (data: WeddingDJFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/client/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          eventType: "wedding",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to submit form");
        setIsSubmitting(false);
      } else {
        setSuccess(true);
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
          <CardContent className="pt-6 text-center">
            <p className="text-green-400 text-lg mb-4">
              DJ Worksheet submitted successfully! Thank you for completing the form.
            </p>
            <p className="text-gray-400 text-sm mb-4">
              We will be in touch 3 weeks prior to your wedding day.
            </p>
            {session ? (
              <Button
                onClick={() => router.push("/client/dashboard")}
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/")}
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                Return to Home
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <Music className="w-8 h-8 text-champagne-gold" />
                Final DJ Worksheet
              </CardTitle>
              <p className="text-gray-400 mt-2">
                Please complete all the required fields including music requests and first dance. 
                We will be in touch 3 weeks prior to your wedding day for your completed form. 
                You can submit to us sooner if you are nice and organised.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                    {error}
                  </div>
                )}

                {/* Happy Couple Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Happy Couple
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Happy Couple *</Label>
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
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="myname@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Wedding Date *</Label>
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
                      <Label htmlFor="phoneAreaCode">Area Code</Label>
                      <Input
                        id="phoneAreaCode"
                        {...register("phoneAreaCode")}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="+44"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        {...register("phoneNumber")}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="01234567890"
                      />
                    </div>
                  </div>
                </div>

                {/* Venue Information Section */}
                <div className="space-y-4 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Venue Information
                  </h3>
                  
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
                      <Label htmlFor="venueContact">Venue Contact</Label>
                      <Input
                        id="venueContact"
                        {...register("venueContact")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venueAddress">Venue Address *</Label>
                    <Input
                      id="venueAddress"
                      {...register("venueAddress")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Address"
                    />
                    {errors.venueAddress && (
                      <p className="text-sm text-red-400">{errors.venueAddress.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venueAddress2">Address 2</Label>
                    <Input
                      id="venueAddress2"
                      {...register("venueAddress2")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueTown">Town</Label>
                      <Input
                        id="venueTown"
                        {...register("venueTown")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venueCounty">County</Label>
                      <Input
                        id="venueCounty"
                        {...register("venueCounty")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venuePostcode">Post Code</Label>
                      <Input
                        id="venuePostcode"
                        {...register("venuePostcode")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venuePhoneAreaCode">Area Code</Label>
                      <Input
                        id="venuePhoneAreaCode"
                        {...register("venuePhoneAreaCode")}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="+44"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="venuePhoneNumber">Phone Number</Label>
                      <Input
                        id="venuePhoneNumber"
                        type="tel"
                        {...register("venuePhoneNumber")}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="01234567890"
                      />
                    </div>
                  </div>
                </div>

                {/* DJ Details Section */}
                <div className="space-y-4 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    DJ Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="djArrivalTime">DJ Arrival Time *</Label>
                      <Input
                        id="djArrivalTime"
                        type="time"
                        {...register("djArrivalTime")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      {errors.djArrivalTime && (
                        <p className="text-sm text-red-400">{errors.djArrivalTime.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="djStartTime">DJ Start Time *</Label>
                      <Input
                        id="djStartTime"
                        type="time"
                        {...register("djStartTime")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      {errors.djStartTime && (
                        <p className="text-sm text-red-400">{errors.djStartTime.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="djFinishTime">DJ Finish Time *</Label>
                      <Input
                        id="djFinishTime"
                        type="time"
                        {...register("djFinishTime")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      {errors.djFinishTime && (
                        <p className="text-sm text-red-400">{errors.djFinishTime.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="djSetupLocation">DJ Setup Location</Label>
                      <Textarea
                        id="djSetupLocation"
                        {...register("djSetupLocation")}
                        rows={3}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="Where will the DJ set up?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="djParking">DJ Parking</Label>
                      <Textarea
                        id="djParking"
                        {...register("djParking")}
                        rows={3}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="Parking information for DJ"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Is there a sound-limiter? *</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Yes"
                            {...register("soundLimiter")}
                            className="w-4 h-4 text-champagne-gold"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="No"
                            {...register("soundLimiter")}
                            className="w-4 h-4 text-champagne-gold"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfGuests">Number of guests</Label>
                      <Input
                        id="numberOfGuests"
                        type="number"
                        {...register("numberOfGuests")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-4 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="finalBalance">Final Balance *</Label>
                    <Input
                      id="finalBalance"
                      {...register("finalBalance")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="£0.00"
                    />
                    {errors.finalBalance && (
                      <p className="text-sm text-red-400">{errors.finalBalance.message}</p>
                    )}
                    <p className="text-sm text-gray-400">
                      Cash at start of evening - If the DJ is not paid in full at the start of the evening they may refuse to play.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentPayerName">Who is going to pay the DJ? Name Please. *</Label>
                    <Input
                      id="paymentPayerName"
                      {...register("paymentPayerName")}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="Name of person paying"
                    />
                    {errors.paymentPayerName && (
                      <p className="text-sm text-red-400">{errors.paymentPayerName.message}</p>
                    )}
                  </div>
                </div>

                {/* Music Details Section */}
                <div className="space-y-4 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Music Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="musicNotesToDJ">Notes to the DJ</Label>
                      <Textarea
                        id="musicNotesToDJ"
                        {...register("musicNotesToDJ")}
                        rows={5}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="Any special instructions or notes for the DJ..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="musicNotesToStylish">Notes to STYLISH Entertainment</Label>
                      <Textarea
                        id="musicNotesToStylish"
                        {...register("musicNotesToStylish")}
                        rows={5}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="Any notes for STYLISH Entertainment..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstDance">First Dance</Label>
                      <Input
                        id="firstDance"
                        {...register("firstDance")}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="Song title and artist"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastSong">Last Song</Label>
                      <Input
                        id="lastSong"
                        {...register("lastSong")}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="Song title and artist"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="musicDislikes">Dis Likes (Genres or Tracks)</Label>
                    <Textarea
                      id="musicDislikes"
                      {...register("musicDislikes")}
                      rows={4}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="List any genres or specific tracks you don't want played..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="musicRequests">Music Requests</Label>
                    <Textarea
                      id="musicRequests"
                      {...register("musicRequests")}
                      rows={4}
                      className="bg-gray-900 border-gray-700 text-white"
                      placeholder="List any specific songs or genres you'd like to hear..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="musicFile">Upload an Excel or Word Doc</Label>
                    <Input
                      id="musicFile"
                      type="file"
                      accept=".xlsx,.xls,.doc,.docx"
                      className="bg-gray-900 border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-champagne-gold file:text-black hover:file:bg-gold-light"
                    />
                    <p className="text-sm text-gray-400">
                      Upload a file with your music requests (Excel or Word format)
                    </p>
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
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
