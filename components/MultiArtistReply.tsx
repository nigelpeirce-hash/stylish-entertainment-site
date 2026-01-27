"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Plus, X, Star, Music, Mic2 } from "lucide-react";
import Image from "next/image";
import { fixCloudinaryUrlForThumbnail } from "@/lib/cloudinary-utils";

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  instrument?: string | null; // For musicians
}

interface SelectedArtist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  tagline: string;
  fee: string;
  recommended: boolean;
}

interface MultiArtistReplyProps {
  bookingId: string;
  clientEmail: string;
  clientName: string;
  venueName: string;
  venueAddress?: string;
  eventDate: string;
  onSend?: () => void;
}

export function MultiArtistReply({
  bookingId,
  clientEmail,
  clientName,
  venueName,
  venueAddress,
  eventDate,
  onSend,
}: MultiArtistReplyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [artistType, setArtistType] = useState<"dj" | "musician">("dj");
  const [availableArtists, setAvailableArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState<SelectedArtist[]>([]);
  const [customIntro, setCustomIntro] = useState("");
  const [emailOverride, setEmailOverride] = useState(clientEmail);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch artists when dialog opens or type changes
  useEffect(() => {
    if (isOpen) {
      fetchArtists();
      // Reset email to booking email when dialog opens
      setEmailOverride(clientEmail);
    }
  }, [isOpen, artistType, clientEmail]);

  const fetchArtists = async () => {
    setLoadingArtists(true);
    try {
      const endpoint = artistType === "dj" ? "/api/admin/djs" : "/api/admin/musicians";
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        const artists = artistType === "dj" ? data.djs : data.musicians;
        setAvailableArtists(artists?.filter((a: Artist) => a.bio && a.imageUrl) || []);
      }
    } catch (err) {
      console.error("Error fetching artists:", err);
    } finally {
      setLoadingArtists(false);
    }
  };

  const addArtist = (artist: Artist) => {
    if (selectedArtists.find(a => a.id === artist.id)) return;
    
    // Extract first sentence as tagline
    const tagline = artist.bio?.split(/[.!?]/)[0]?.trim() || "";
    
    setSelectedArtists([
      ...selectedArtists,
      {
        id: artist.id,
        name: artist.name,
        bio: artist.bio || "",
        imageUrl: artist.imageUrl || "",
        tagline: tagline.length > 60 ? tagline.substring(0, 60) + "..." : tagline,
        fee: "",
        recommended: selectedArtists.length === 0, // First one is recommended by default
      },
    ]);
  };

  const removeArtist = (id: string) => {
    const updated = selectedArtists.filter(a => a.id !== id);
    // If we removed the recommended one, make the first one recommended
    if (updated.length > 0 && !updated.some(a => a.recommended)) {
      updated[0].recommended = true;
    }
    setSelectedArtists(updated);
  };

  const updateArtist = (id: string, field: keyof SelectedArtist, value: string | boolean) => {
    setSelectedArtists(selectedArtists.map(a => {
      if (a.id === id) {
        return { ...a, [field]: value };
      }
      // If setting recommended, unset others
      if (field === "recommended" && value === true) {
        return { ...a, recommended: a.id === id };
      }
      return a;
    }));
  };

  const setRecommended = (id: string) => {
    setSelectedArtists(selectedArtists.map(a => ({
      ...a,
      recommended: a.id === id,
    })));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (selectedArtists.length === 0) {
      setError("Please select at least one artist");
      return;
    }

    if (selectedArtists.some(a => !a.fee.trim())) {
      setError("Please enter a fee for all selected artists");
      return;
    }

    if (!emailOverride || !emailOverride.trim() || !emailOverride.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/admin/send-artist-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          clientEmail: emailOverride.trim(),
          clientName,
          venueName,
          venueAddress,
          eventDate,
          customIntro: customIntro.trim() || null,
          artistType,
          options: selectedArtists.map(a => ({
            name: a.name,
            tagline: a.tagline,
            bio: a.bio,
            photoUrl: a.imageUrl,
            fee: parseFloat(a.fee),
            recommended: a.recommended,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSelectedArtists([]);
        setCustomIntro("");
        setEmailOverride(clientEmail);
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
          Send Quote with Options
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-champagne-gold/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-champagne-gold">
            Send Quote with Multiple Options
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">
            {venueName} on {formattedDate}
          </p>
        </DialogHeader>

        <form onSubmit={handleSend} className="space-y-6 mt-4">
          {/* Artist Type Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={artistType === "dj" ? "default" : "outline"}
              onClick={() => { setArtistType("dj"); setSelectedArtists([]); }}
              className={artistType === "dj" ? "bg-champagne-gold text-black" : "border-gray-700"}
            >
              <Music className="w-4 h-4 mr-2" />
              DJs
            </Button>
            <Button
              type="button"
              variant={artistType === "musician" ? "default" : "outline"}
              onClick={() => { setArtistType("musician"); setSelectedArtists([]); }}
              className={artistType === "musician" ? "bg-champagne-gold text-black" : "border-gray-700"}
            >
              <Mic2 className="w-4 h-4 mr-2" />
              Musicians
            </Button>
          </div>

          {/* Client Email - Editable */}
          <div>
            <Label htmlFor="client-email">Client Email Address *</Label>
            <Input
              id="client-email"
              type="email"
              value={emailOverride}
              onChange={(e) => setEmailOverride(e.target.value)}
              placeholder="client@example.com"
              className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
            {emailOverride !== clientEmail && (
              <p className="text-xs text-yellow-400 mt-1">
                ⚠️ Email differs from booking record ({clientEmail})
              </p>
            )}
          </div>

          {/* Custom Introduction */}
          <div>
            <Label htmlFor="custom-intro">Introduction Message</Label>
            <Textarea
              id="custom-intro"
              value={customIntro}
              onChange={(e) => setCustomIntro(e.target.value)}
              placeholder="Thank you for getting in touch about your wedding..."
              className="mt-2 min-h-[80px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Artist Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Select {artistType === "dj" ? "DJs" : "Musicians"} to Include
            </Label>
            
            {loadingArtists ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-champagne-gold" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-1">
                {availableArtists.map((artist) => {
                  const isSelected = selectedArtists.some(a => a.id === artist.id);
                  return (
                    <button
                      key={artist.id}
                      type="button"
                      onClick={() => !isSelected && addArtist(artist)}
                      disabled={isSelected}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? "border-champagne-gold/50 bg-champagne-gold/10 opacity-50"
                          : "border-gray-700 hover:border-champagne-gold/50 hover:bg-gray-800"
                      }`}
                    >
                      {artist.imageUrl && (
                        <Image
                          src={fixCloudinaryUrlForThumbnail(artist.imageUrl) || artist.imageUrl}
                          alt={artist.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            console.error('Image failed to load:', artist.imageUrl);
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{artist.name}</p>
                        {artist.instrument && (
                          <p className="text-xs text-gray-400">{artist.instrument}</p>
                        )}
                      </div>
                      {!isSelected && <Plus className="w-4 h-4 text-gray-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Artists */}
          {selectedArtists.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Selected Options ({selectedArtists.length})</Label>
              
              {selectedArtists.map((artist, index) => (
                <Card key={artist.id} className={`p-4 ${artist.recommended ? "bg-champagne-gold/10 border-champagne-gold" : "bg-gray-800/50 border-gray-700"}`}>
                  <div className="flex items-start gap-4">
                    {artist.imageUrl && (
                      <Image
                        src={fixCloudinaryUrlForThumbnail(artist.imageUrl) || artist.imageUrl}
                        alt={artist.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          console.error('Image failed to load:', artist.imageUrl);
                        }}
                      />
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">{artist.name}</h4>
                          {artist.recommended && (
                            <span className="text-xs bg-champagne-gold text-black px-2 py-0.5 rounded font-semibold">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!artist.recommended && selectedArtists.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setRecommended(artist.id)}
                              className="text-gray-400 hover:text-champagne-gold"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArtist(artist.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-400">Tagline</Label>
                          <Input
                            value={artist.tagline}
                            onChange={(e) => updateArtist(artist.id, "tagline", e.target.value)}
                            placeholder="Short description..."
                            className="mt-1 bg-gray-700 border-gray-600 text-white text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Fee (£) *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={artist.fee}
                            onChange={(e) => updateArtist(artist.id, "fee", e.target.value)}
                            placeholder="0.00"
                            className="mt-1 bg-gray-700 border-gray-600 text-white text-sm"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-400">Bio (editable)</Label>
                        <Textarea
                          value={artist.bio}
                          onChange={(e) => updateArtist(artist.id, "bio", e.target.value)}
                          className="mt-1 min-h-[60px] bg-gray-700 border-gray-600 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-sm">
              Quote sent successfully to {emailOverride}!
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-700">
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
              disabled={sending || selectedArtists.length === 0}
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
                  Send Quote ({selectedArtists.length} option{selectedArtists.length !== 1 ? "s" : ""})
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
