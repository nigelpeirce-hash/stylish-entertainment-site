"use client";

import { useState } from "react";
import Image from "next/image";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";
import { Sparkles, CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { getLabel } from "@/lib/eventLabels";

interface AddOn {
  id: string;
  name: string;
  luxeDescription: string;
  why: string;
  featured?: boolean;
  category: string;
  imageUrl: string;
  imageAlt: string;
}

interface AddOnConciergeProps {
  bookingId: string;
  eventType?: string | null;
  eventDate?: string | null;
  onUpdate?: (selectedAddOns: string[]) => Promise<void>;
}

const AVAILABLE_ADDONS: AddOn[] = [
  {
    id: "led-mood-lighting",
    name: "LED Mood Lighting",
    luxeDescription: "Paint your venue with light.",
    why: "Essential for changing the vibe from dinner to dancefloor.",
    category: "lighting",
    imageUrl: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733254/Babington-House-in-Green_oms0ws.jpg",
    imageAlt: "LED mood lighting installation transforming a venue with ambient green lighting",
  },
  {
    id: "outdoor-firepits",
    name: "Luxury Firepits",
    luxeDescription: "The ultimate evening gathering point.",
    why: "Keeps the party flowing outside for smokers and talkers.",
    featured: true,
    category: "ambiance",
    imageUrl: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163522/Orangery-day-e1642527408215_bqpzoh.jpg",
    imageAlt: "Luxury outdoor firepits creating a warm gathering point for evening celebrations",
  },
  {
    id: "mirrorball-clusters",
    name: "Mirrorball Clusters",
    luxeDescription: "A 70s Gatsby masterpiece.",
    why: "Creates a high-energy 'Saltburn' aesthetic for the dancefloor.",
    category: "lighting",
    imageUrl: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163506/DJ-Nige-white-dance-floor-lighting_kigdwb.jpg",
    imageAlt: "Mirrorball clusters and disco lighting creating a high-energy dancefloor atmosphere",
  },
  {
    id: "festoon-canopies",
    name: "Festoon Canopies",
    luxeDescription: "Industrial-luxe outdoor lighting.",
    why: "Perfect for Babington or Kin House terraces.",
    category: "lighting",
    imageUrl: "https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768163633/Stretch-Marquee-Lighting-e1483614284289_lmsqwr.jpg",
    imageAlt: "Festoon canopies and industrial-luxe outdoor lighting creating elegant terrace spaces",
  },
];

export default function AddOnConcierge({
  bookingId,
  eventType,
  eventDate,
  onUpdate,
}: AddOnConciergeProps) {
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, "idle" | "checking" | "available" | "unavailable">>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleCheckAvailability = async (addOnId: string) => {
    // Set checking state
    setAvailabilityStatus(prev => ({ ...prev, [addOnId]: "checking" }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate availability check (in real implementation, check against eventDate)
    const isAvailable = true; // Placeholder logic

    setAvailabilityStatus(prev => ({
      ...prev,
      [addOnId]: isAvailable ? "available" : "unavailable",
    }));
  };

  const handleToggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => {
      if (prev.includes(addOnId)) {
        return prev.filter(id => id !== addOnId);
      }
      return [...prev, addOnId];
    });
  };

  const handleRequestQuoteUpdate = async () => {
    if (selectedAddOns.length === 0) return;

    setIsSaving(true);
    try {
      if (onUpdate) {
        await onUpdate(selectedAddOns);
      } else {
        // Fallback: save via API
        const response = await fetch(`/api/client/bookings/${bookingId}/addons`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addOns: selectedAddOns }),
        });

        if (!response.ok) {
          throw new Error("Failed to update booking");
        }
      }
      // Could show success message here
    } catch (error) {
      console.error("Error updating add-ons:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getButtonContent = (addOnId: string) => {
    const status = availabilityStatus[addOnId] || "idle";

    if (status === "checking") {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Checking...
        </>
      );
    }

    if (status === "available") {
      const isSelected = selectedAddOns.includes(addOnId);
      return (
        <>
          {isSelected ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to My Celebration
            </>
          )}
        </>
      );
    }

    if (status === "unavailable") {
      return "Unavailable";
    }

    return "Check Availability";
  };

  const getButtonVariant = (addOnId: string) => {
    const status = availabilityStatus[addOnId] || "idle";
    const isSelected = selectedAddOns.includes(addOnId);

    if (status === "available" && isSelected) {
      return "default" as const;
    }

    if (status === "available") {
      return "default" as const;
    }

    if (status === "unavailable") {
      return "outline" as const;
    }

    return "outline" as const;
  };

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-champagne-gold" />
          Upgrade Your {getLabel("countdown", eventType) || "Event"}
        </CardTitle>
        <p className="text-sm text-gray-400 mt-2">
          Enhance your celebration with our premium add-ons and styling services
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add-Ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_ADDONS.map((addOn, index) => {
            const isSelected = selectedAddOns.includes(addOn.id);
            const status = availabilityStatus[addOn.id] || "idle";
            const isAvailable = status === "available";

            return (
              <motion.div
                key={addOn.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative bg-gray-900 border ${
                    isSelected
                      ? "border-champagne-gold"
                      : "border-gray-700 hover:border-champagne-gold/50"
                  } transition-all`}
                >
                  {addOn.featured && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-1 text-xs font-semibold bg-champagne-gold text-black rounded">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Thumbnail Image */}
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={sanitizeCloudinaryUrl(addOn.imageUrl) || addOn.imageUrl}
                      alt={addOn.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {addOn.name}
                    </h3>
                    <p className="text-sm italic text-champagne-gold/80 mb-2">
                      "{addOn.luxeDescription}"
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      The "Why": {addOn.why}
                    </p>

                    <Button
                      onClick={() => {
                        if (status === "idle") {
                          handleCheckAvailability(addOn.id);
                        } else if (isAvailable) {
                          handleToggleAddOn(addOn.id);
                        }
                      }}
                      disabled={status === "checking" || status === "unavailable"}
                      variant={getButtonVariant(addOn.id)}
                      className={`w-full ${
                        isSelected
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : isAvailable
                          ? "bg-champagne-gold text-black hover:bg-gold-light"
                          : "border-gray-600 text-gray-300"
                      }`}
                    >
                      {getButtonContent(addOn.id)}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Pending Upgrades Summary */}
        {selectedAddOns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-gray-900/50 border border-champagne-gold/30 rounded-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">
                  Pending Upgrades
                </h4>
                <p className="text-sm text-gray-400">
                  {selectedAddOns.length} {selectedAddOns.length === 1 ? "item" : "items"} added to your celebration
                </p>
                <ul className="mt-2 space-y-1">
                  {selectedAddOns.map((addOnId) => {
                    const addOn = AVAILABLE_ADDONS.find((a) => a.id === addOnId);
                    return (
                      <li key={addOnId} className="text-sm text-gray-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {addOn?.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <Button
                onClick={handleRequestQuoteUpdate}
                disabled={isSaving}
                className="bg-champagne-gold text-black hover:bg-gold-light px-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Request Quote Update"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
