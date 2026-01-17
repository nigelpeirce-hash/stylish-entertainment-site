"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Music, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function MusicianCard({ musician, onEdit, onDelete }: { 
  musician: any, 
  onEdit: (m: any) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Card className="bg-gray-900/40 backdrop-blur-xl border-champagne-gold/30 hover:border-champagne-gold/60 transition-all duration-500 shadow-xl overflow-hidden group">
        <div className="relative h-40 w-full bg-gray-800">
          {musician.imageUrl ? (
            <Image 
              src={musician.imageUrl} 
              alt={musician.name} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full"><Music className="text-champagne-gold/20 w-12 h-12" /></div>
          )}
          <div className="absolute top-2 right-2">
            {musician.isActive ? 
              <span className="bg-green-500/20 border border-green-500/50 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Live</span> : 
              <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Hidden</span>
            }
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-white mb-1">{musician.name}</h3>
          <p className="text-champagne-gold text-xs font-medium mb-3 uppercase tracking-widest">
            {musician.instrument || "General Performer"}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => onEdit(musician)} variant="outline" className="flex-1 border-champagne-gold/40 text-champagne-gold hover:bg-champagne-gold hover:text-black">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button onClick={() => onDelete(musician.id)} variant="ghost" className="text-gray-500 hover:text-red-400 hover:bg-red-900/20">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}