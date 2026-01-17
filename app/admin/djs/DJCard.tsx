"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { User } from "lucide-react";
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

interface DJCardProps {
  dj: DJ;
  onEdit: (dj: DJ) => void;
  onDelete: (id: string) => void;
}

export function DJCard({ dj, onEdit, onDelete }: DJCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50 hover:border-champagne-gold/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
        <CardContent className="p-4">
          {/* Image with fallback */}
          <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-900/50">
            {dj.imageUrl && !imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-16 h-16 text-champagne-gold/50" />
                  </div>
                )}
                <Image
                  src={dj.imageUrl}
                  alt={dj.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="w-16 h-16 text-champagne-gold/50" />
              </div>
            )}
          </div>

          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">{dj.name}</h3>
            {!dj.isActive && (
              <span className="px-2 py-1 bg-gray-900/30 text-gray-400 text-xs rounded border border-gray-500/30">
                Inactive
              </span>
            )}
          </div>

          {dj.bio && (
            <p className="text-sm text-gray-200 mb-2 line-clamp-2">{dj.bio}</p>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(dj)}
              size="sm"
              variant="outline"
              className="flex-1 border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold hover:text-black hover:border-champagne-gold transition-all duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(dj.id)}
              size="sm"
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
