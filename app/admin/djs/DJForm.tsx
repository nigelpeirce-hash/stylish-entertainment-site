"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveImage } from "@/components/cloudinary";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface DJ {
  id: string;
  name: string;
  slug: string | null;
  bio: string | null;
  mixcloudUrl: string | null;
  mixcloudEmbeds?: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

type FormDataState = {
  name: string;
  bio: string;
  strapLine: string;
  fullBio: string;
  mixcloudEmbeds: string[];
  youtubeEmbed: string;
  seoTitle: string;
  seoDescription: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
};

interface DJFormProps {
  editingId: string | null;
  formData: FormDataState;
  onFormDataChange: (data: FormDataState) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function DJForm({
  editingId,
  formData,
  onFormDataChange,
  onSave,
  onCancel,
  isSaving,
}: DJFormProps) {
  const handleNameChange = (value: string) => {
    onFormDataChange({ ...formData, name: value });
  };

  const isNameEmpty = !formData.name.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
      id="dj-form"
    >
      <Card className="bg-gray-800/50 backdrop-blur-md border-2 border-champagne-gold/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span>
              {editingId
                ? `Edit DJ: ${formData.name || ""}`
                : "Create New DJ"}
            </span>
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">DJ Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., DJ Nige"
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
            {formData.name && (
              <p className="text-xs text-gray-400">
                Slug will be: <span className="text-champagne-gold">{generateSlug(formData.name)}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white">Short bio (card fallback / SEO)</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                onFormDataChange({ ...formData, bio: e.target.value })
              }
              rows={3}
              placeholder="Short bio for card and SEO..."
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Strap line (card tagline)</Label>
            <Input
              value={formData.strapLine}
              onChange={(e) =>
                onFormDataChange({ ...formData, strapLine: e.target.value })
              }
              placeholder="e.g. Seamless Mixing or Over 20 years as resident DJ at Babington House"
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Full bio (modal / Read more)</Label>
            <Textarea
              value={formData.fullBio}
              onChange={(e) =>
                onFormDataChange({ ...formData, fullBio: e.target.value })
              }
              rows={14}
              placeholder="Long bio for the modal. Use --- on a line to separate a 'Recent Testimonials' section; use **Venue name** for each testimonial heading."
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
            <p className="text-xs text-gray-400">
              Use --- on its own line before testimonials. Use **Venue name** for each testimonial block.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">YouTube Embed URL (optional)</Label>
            <Input
              value={formData.youtubeEmbed}
              onChange={(e) =>
                onFormDataChange({ ...formData, youtubeEmbed: e.target.value })
              }
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
            <p className="text-xs text-gray-400">
              YouTube embed URL (e.g., https://www.youtube.com/embed/RAdejWBYWaw)
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Mixcloud URLs (page URL or embed URL)</Label>
            {formData.mixcloudEmbeds.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={url}
                  onChange={(e) => {
                    const next = [...formData.mixcloudEmbeds];
                    next[index] = e.target.value;
                    onFormDataChange({ ...formData, mixcloudEmbeds: next });
                  }}
                  placeholder={
                    index === 0
                      ? "https://www.mixcloud.com/username/show-name/"
                      : "Or embed URL / iframe code"
                  }
                  className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold flex-1"
                />
                {formData.mixcloudEmbeds.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-400 shrink-0"
                    onClick={() => {
                      const next = formData.mixcloudEmbeds.filter((_, i) => i !== index);
                      onFormDataChange({ ...formData, mixcloudEmbeds: next });
                    }}
                    aria-label="Remove Mixcloud URL"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 mt-1"
              onClick={() =>
                onFormDataChange({
                  ...formData,
                  mixcloudEmbeds: [...formData.mixcloudEmbeds, ""],
                })
              }
            >
              <Plus className="w-4 h-4 mr-1" />
              Add another Mixcloud URL
            </Button>
            <p className="text-xs text-gray-400">
              Page URL (e.g. mixcloud.com/username/show-name/) or WordPress embed code—we convert to widget format automatically.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Display Order</Label>
            <Input
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  displayOrder: parseInt(e.target.value) || 0,
                })
              }
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
            <p className="text-xs text-gray-400">Lower numbers appear first</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">
              SEO Title (optional - auto-generated if empty)
            </Label>
            <Input
              value={formData.seoTitle}
              onChange={(e) =>
                onFormDataChange({ ...formData, seoTitle: e.target.value })
              }
              placeholder="e.g., DJ Nige | Professional Wedding DJ"
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">
              SEO Description (optional - auto-generated with locations if empty)
            </Label>
            <Textarea
              value={formData.seoDescription}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  seoDescription: e.target.value,
                })
              }
              rows={3}
              placeholder="Auto-generated with: available in Somerset, Dorset, Wiltshire, Bristol, Bath, and Frome"
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Image URL</Label>
            <Input
              value={formData.imageUrl}
              onChange={(e) =>
                onFormDataChange({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://..."
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
            {formData.imageUrl && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-700 mt-2">
                {formData.imageUrl.includes("cloudinary.com") ? (
                  <ResponsiveImage
                    publicId={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                  />
                ) : (
                  <Image
                    src={sanitizeCloudinaryUrl(formData.imageUrl) || formData.imageUrl}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={(e) => {
                      console.warn("Preview image failed to load:", formData.imageUrl);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    isActive: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Active (visible on website)
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onSave}
              disabled={isNameEmpty || isSaving}
              className="bg-champagne-gold text-black hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update DJ" : "Create DJ"}
                </>
              )}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-gray-600 text-gray-300"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
