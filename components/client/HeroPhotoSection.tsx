"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const UPLOAD_COPY: Record<string, string> = {
  wedding: "Add a photo of you both or your venue",
  party: "Add a venue photo or a photo of your event",
  corporate: "Add a venue photo or a photo of your event",
};

interface HeroPhotoSectionProps {
  heroImageUrl: string | null;
  eventType?: string | null;
  bookingId: string;
  onUploaded?: (url: string | null) => void;
  portalToken?: string | null;
  className?: string;
}

export default function HeroPhotoSection({
  heroImageUrl,
  eventType = "wedding",
  bookingId,
  onUploaded,
  portalToken,
  className = "",
}: HeroPhotoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const evType = (eventType || "wedding").toLowerCase();
  const copy =
    UPLOAD_COPY[evType] ||
    UPLOAD_COPY.wedding;

  const baseUrl = `/api/client/bookings/${bookingId}/upload-hero-image`;
  const urlWithToken = portalToken
    ? `${baseUrl}?token=${encodeURIComponent(portalToken)}`
    : baseUrl;

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert("Please upload a JPEG, PNG, or WebP image.");
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        alert("Image must be under 5MB.");
        return;
      }
      setIsUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(urlWithToken, {
          method: "POST",
          body: fd,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          alert(data.error || "Upload failed.");
          return;
        }
        onUploaded?.(data.url ?? heroImageUrl);
      } catch (err) {
        console.error(err);
        alert("Upload failed.");
      } finally {
        setIsUploading(false);
      }
    },
    [urlWithToken, onUploaded, heroImageUrl]
  );

  const handleRemove = useCallback(async () => {
    setIsRemoving(true);
    try {
      const res = await fetch(urlWithToken, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to remove photo.");
        return;
      }
      onUploaded?.(null);
    } catch (err) {
      console.error(err);
      alert("Failed to remove photo.");
    } finally {
      setIsRemoving(false);
    }
  }, [urlWithToken, onUploaded]);

  return (
    <div className={`${className}`}>
      {heroImageUrl ? (
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-champagne-gold/40 flex-shrink-0">
            <Image
              src={sanitizeCloudinaryUrl(heroImageUrl) || heroImageUrl}
              alt="Hero preview"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isRemoving ? "Removing…" : "Remove photo"}
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-gray-400 text-sm mb-2">{copy}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading…" : "Upload photo"}
          </Button>
        </div>
      )}
    </div>
  );
}
