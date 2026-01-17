"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface DJ {
  id: string;
  name: string;
  slug: string | null;
  bio: string | null;
  mixcloudUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

interface DJFormProps {
  editingId: string | null;
  formData: {
    name: string;
    bio: string;
    mixcloudUrl: string;
    seoTitle: string;
    seoDescription: string;
    imageUrl: string;
    isActive: boolean;
    displayOrder: number;
  };
  onFormDataChange: (data: typeof formData) => void;
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
            <Label className="text-white">Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                onFormDataChange({ ...formData, bio: e.target.value })
              }
              rows={4}
              placeholder="DJ bio and experience..."
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Mixcloud URL (optional)</Label>
            <Input
              value={formData.mixcloudUrl}
              onChange={(e) =>
                onFormDataChange({ ...formData, mixcloudUrl: e.target.value })
              }
              placeholder="https://www.mixcloud.com/username/show-name/"
              className="bg-gray-900/50 text-white border-gray-700 focus:border-champagne-gold"
            />
            <p className="text-xs text-gray-400">
              Full Mixcloud URL (e.g., https://www.mixcloud.com/djnige/live-mix/)
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
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
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
