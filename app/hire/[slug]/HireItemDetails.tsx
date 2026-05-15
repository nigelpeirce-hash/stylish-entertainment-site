"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  itemId: string;
  itemName: string;
  description: string | null;
  price: number;
  stockAvailable: number;
  category: string | null;
}

const LOCATIONS = "Somerset, Dorset, Wiltshire, Bristol, Bath, and Frome";

export default function HireItemDetails({
  itemId,
  itemName,
  description,
  price,
  stockAvailable,
  category,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const addToCart = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const sessionId =
        localStorage.getItem("cartSessionId") ||
        `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cartSessionId", sessionId);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hireItemId: itemId,
          quantity: 1,
          sessionId,
        }),
      });

      if (response.ok) {
        router.push("/hire/");
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-4xl font-bold mb-4">{itemName}</h1>

      <div className="mb-6">
        <span className="text-3xl font-bold text-champagne-gold">
          £{price.toFixed(2)}
        </span>
        <span className="text-gray-400 ml-2">per hire</span>
      </div>

      {description ? (
        <div className="mb-6">
          <p className="text-lg text-gray-300 leading-relaxed">{description}</p>
        </div>
      ) : null}

      <div className="sr-only">
        <p>
          Available for hire in {LOCATIONS}. Professional wedding and event hire
          services in the South West and beyond.
        </p>
      </div>

      <div className="mb-6">
        <p className="text-gray-400 mb-2">
          <strong>Stock Available:</strong> {stockAvailable}
        </p>
        {category ? (
          <p className="text-gray-400">
            <strong>Category:</strong> {category}
          </p>
        ) : null}
      </div>

      <Button
        onClick={addToCart}
        disabled={stockAvailable === 0 || submitting}
        size="lg"
        className="w-full bg-champagne-gold text-black hover:bg-gold-light"
      >
        <Plus className="w-5 h-5 mr-2" />
        {submitting ? "Adding..." : "Add to Basket"}
      </Button>

      {stockAvailable === 0 ? (
        <p className="text-red-400 mt-2 text-sm">Currently out of stock</p>
      ) : null}
    </motion.div>
  );
}
