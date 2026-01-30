"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Send, Loader2, MapPin, Calculator } from "lucide-react";

interface DJInquiryReplyProps {
  bookingId: string;
  clientEmail: string;
  clientName: string;
  venueName: string;
  venueAddress?: string;
  venuePostcode?: string;
  eventDate: string;
  djName?: string;
  onSend?: () => void;
}

export function DJInquiryReply({
  bookingId,
  clientEmail,
  clientName,
  venueName,
  venueAddress,
  venuePostcode,
  eventDate,
  djName,
  onSend,
}: DJInquiryReplyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customIntro, setCustomIntro] = useState("");
  const [djFee, setDjFee] = useState("");
  const [accommodation, setAccommodation] = useState(false);
  const [accommodationDetails, setAccommodationDetails] = useState("");
  const [food, setFood] = useState(false);
  const [foodDetails, setFoodDetails] = useState("");
  const [drink, setDrink] = useState(false);
  const [drinkDetails, setDrinkDetails] = useState("");
  const [djBaseAddress, setDjBaseAddress] = useState("");
  const [mileage, setMileage] = useState<number | null>(null);
  const [mileageCost, setMileageCost] = useState("");
  const [calculatingMileage, setCalculatingMileage] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Calculate mileage using Google Maps Distance Matrix API
  const calculateMileage = async () => {
    if (!djBaseAddress.trim() || !venueAddress && !venuePostcode) {
      setError("Please provide DJ base address and venue address/postcode");
      return;
    }

    setCalculatingMileage(true);
    setError("");

    try {
      const response = await fetch("/api/admin/calculate-mileage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: djBaseAddress.trim(),
          destination: venueAddress || `${venueName}, ${venuePostcode}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate mileage");
      }

      setMileage(data.distanceMiles || null);
    } catch (err: any) {
      setError(err.message || "Failed to calculate mileage. Please enter manually.");
      console.error("Mileage calculation error:", err);
    } finally {
      setCalculatingMileage(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!djFee.trim()) {
      setError("Please enter the DJ fee");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/admin/send-dj-inquiry-reply/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          clientEmail,
          clientName,
          venueName,
          venueAddress,
          eventDate,
          djName: djName || undefined,
          customIntro: customIntro.trim() || null,
          djFee: parseFloat(djFee),
          accommodation: accommodation ? accommodationDetails.trim() || "Required" : null,
          food: food ? foodDetails.trim() || "Required" : null,
          drink: drink ? drinkDetails.trim() || "Required" : null,
          mileage: mileage || null,
          mileageCost: mileageCost.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        // Reset form
        setCustomIntro("");
        setDjFee("");
        setAccommodation(false);
        setAccommodationDetails("");
        setFood(false);
        setFoodDetails("");
        setDrink(false);
        setDrinkDetails("");
        setDjBaseAddress("");
        setMileage(null);
        setMileageCost("");
        setSuccess(false);
        if (onSend) onSend();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
          <Send className="w-4 h-4 mr-2" />
          Send DJ Enquiry Reply
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-champagne-gold/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-champagne-gold">
            DJ Enquiry Reply
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            {djName ? `Reply for ${djName}` : "Reply for DJ Enquiry"} - {venueName} on {formattedDate}
          </p>
        </DialogHeader>

        <form onSubmit={handleSend} className="space-y-4 mt-4">
          {/* Custom Introduction */}
          <div>
            <Label htmlFor="custom-intro">Custom Introduction (Optional)</Label>
            <Textarea
              id="custom-intro"
              value={customIntro}
              onChange={(e) => setCustomIntro(e.target.value)}
              placeholder="Add a personalised introduction after 'Dear [Name]'..."
              className="mt-2 min-h-[80px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">This appears after the greeting in the email</p>
          </div>

          {/* DJ Fee */}
          <div>
            <Label htmlFor="dj-fee">DJ Fee (£) *</Label>
            <Input
              id="dj-fee"
              type="number"
              step="0.01"
              min="0"
              value={djFee}
              onChange={(e) => setDjFee(e.target.value)}
              placeholder="0.00"
              className="mt-2 bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          {/* Mileage Calculator */}
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-champagne-gold" />
              <Label className="text-base font-semibold">Mileage Calculator</Label>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="dj-base" className="text-sm">DJ Base Address</Label>
                <Input
                  id="dj-base"
                  value={djBaseAddress}
                  onChange={(e) => setDjBaseAddress(e.target.value)}
                  placeholder="e.g., Frome, Somerset"
                  className="mt-1 bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  value={venueAddress || `${venueName}${venuePostcode ? `, ${venuePostcode}` : ""}`}
                  disabled
                  className="flex-1 bg-gray-700 border-gray-600 text-gray-400 text-sm"
                />
                <Button
                  type="button"
                  onClick={calculateMileage}
                  disabled={calculatingMileage || !djBaseAddress.trim()}
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  {calculatingMileage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-1" />
                      Calculate
                    </>
                  )}
                </Button>
              </div>
              {mileage !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-300">Distance: </span>
                  <span className="text-champagne-gold font-semibold">{mileage.toFixed(1)} miles (return)</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={mileageCost}
                    onChange={(e) => setMileageCost(e.target.value)}
                    placeholder="Mileage cost (£)"
                    className="ml-auto w-32 bg-gray-700 border-gray-600 text-white text-sm"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Rider Requirements */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Rider Requirements</Label>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="accommodation"
                checked={accommodation}
                onCheckedChange={(checked) => setAccommodation(checked === true)}
                className="mt-1 border-champagne-gold/50 data-[state=checked]:bg-champagne-gold"
              />
              <div className="flex-1">
                <Label htmlFor="accommodation" className="cursor-pointer">Accommodation Required</Label>
                {accommodation && (
                  <Textarea
                    value={accommodationDetails}
                    onChange={(e) => setAccommodationDetails(e.target.value)}
                    placeholder="Accommodation details..."
                    className="mt-2 min-h-[60px] bg-gray-800 border-gray-700 text-white text-sm"
                  />
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="food"
                checked={food}
                onCheckedChange={(checked) => setFood(checked === true)}
                className="mt-1 border-champagne-gold/50 data-[state=checked]:bg-champagne-gold"
              />
              <div className="flex-1">
                <Label htmlFor="food" className="cursor-pointer">Food Required</Label>
                {food && (
                  <Textarea
                    value={foodDetails}
                    onChange={(e) => setFoodDetails(e.target.value)}
                    placeholder="Food requirements..."
                    className="mt-2 min-h-[60px] bg-gray-800 border-gray-700 text-white text-sm"
                  />
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="drink"
                checked={drink}
                onCheckedChange={(checked) => setDrink(checked === true)}
                className="mt-1 border-champagne-gold/50 data-[state=checked]:bg-champagne-gold"
              />
              <div className="flex-1">
                <Label htmlFor="drink" className="cursor-pointer">Drink Required</Label>
                {drink && (
                  <Textarea
                    value={drinkDetails}
                    onChange={(e) => setDrinkDetails(e.target.value)}
                    placeholder="Drink requirements..."
                    className="mt-2 min-h-[60px] bg-gray-800 border-gray-700 text-white text-sm"
                  />
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-sm">
              DJ Enquiry Reply sent successfully!
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sending || !djFee.trim()}
              className="flex-1 bg-champagne-gold text-black hover:bg-gold-light"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
