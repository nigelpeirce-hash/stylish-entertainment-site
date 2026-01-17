"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Music, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

interface Musician {
  id: string;
  name: string;
  instrument: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export function MusicianCard({ musician, onEdit, onDelete }: { 
  musician: Musician, 
  onEdit: (m: Musician) => void, 
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

export default function MusiciansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/client/dashboard");
        return;
      }
      fetchMusicians();
    }
  }, [status, session, router]);

  const fetchMusicians = async () => {
    try {
      const response = await fetch("/api/admin/musicians");
      if (response.ok) {
        const data = await response.json();
        setMusicians(data.musicians || []);
      }
    } catch (error) {
      console.error("Error fetching musicians:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (musician: Musician) => {
    // TODO: Implement edit functionality
    console.log("Edit musician:", musician);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this musician?")) return;
    // TODO: Implement delete functionality
    console.log("Delete musician:", id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-champagne-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Musicians Management</h1>
          <Button className="bg-champagne-gold text-black hover:bg-gold-light">
            <Plus className="w-5 h-5 mr-2" />
            Add Musician
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {musicians.map((musician) => (
              <MusicianCard
                key={musician.id}
                musician={musician}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>

        {musicians.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">No musicians found. Add your first musician to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
