"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";

interface HireItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  slug: string | null;
  isActive?: boolean;
}

interface BookingItemRow {
  id: string;
  quantity: number;
  status: string;
  HireItem: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    category: string | null;
  };
}

interface HireShopProps {
  bookingId: string;
  venueName?: string | null;
  eventType?: string | null;
  onItemsChange?: () => void;
}

export default function HireShop({ bookingId, venueName, eventType, onItemsChange }: HireShopProps) {
  const isWedding = (eventType || "").toLowerCase() === "wedding";
  const venueLabel = venueName?.trim() || "your venue";
  const title = isWedding
    ? `Items for your Wedding at ${venueLabel}`
    : `Items for your Event at ${venueLabel}`;
  const [catalog, setCatalog] = useState<HireItem[]>([]);
  const [cart, setCart] = useState<BookingItemRow[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingCatalog(true);
      try {
        const r = await fetch("/api/hire-items?isActive=true");
        const d = await r.json();
        if (!cancelled) setCatalog(d.items || []);
      } catch {
        if (!cancelled) setCatalog([]);
      } finally {
        if (!cancelled) setLoadingCatalog(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    (async () => {
      setLoadingCart(true);
      try {
        const r = await fetch(`/api/client/bookings/${bookingId}/items`);
        const d = await r.json();
        if (!cancelled && r.ok) setCart(d.items || []);
      } catch {
        if (!cancelled) setCart([]);
      } finally {
        if (!cancelled) {
          setLoadingCart(false);
          onItemsChange?.();
        }
      }
    })();
    return () => { cancelled = true; };
  }, [bookingId]);

  const addToBooking = async (hireItemId: string) => {
    setAddingId(hireItemId);
    setError(null);
    try {
      const r = await fetch(`/api/client/bookings/${bookingId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hireItemId }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed to add");
      setCart(d.items || []);
      onItemsChange?.();
    } catch (e: any) {
      setError(e?.message || "Could not add item");
    } finally {
      setAddingId(null);
    }
  };

  const confirmRequest = async () => {
    setConfirming(true);
    setError(null);
    try {
      const r = await fetch(`/api/client/bookings/${bookingId}/confirm-hire-request`, {
        method: "POST",
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Failed to send request");
      setRequestSent(true);
      onItemsChange?.();
    } catch (e: any) {
      setError(e?.message || "Could not send request");
    } finally {
      setConfirming(false);
    }
  };

  const inCart = (id: string) => cart.some((i) => i.HireItem.id === id);

  if (requestSent) {
    return (
      <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-lg font-semibold text-white">Request Sent!</p>
            <p className="text-sm text-gray-400 mt-1">
              Nigel will update your final invoice shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-500" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-400">
          Add items to your booking. No payment now — we&apos;ll update your invoice.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {/* Catalog */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Add to booking
          </h3>
          {loadingCatalog ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : catalog.length === 0 ? (
            <p className="text-gray-500 text-sm">No hire items available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catalog.map((item) => {
                const added = inCart(item.id);
                const busy = addingId === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-white/10 hover:border-amber-500/30 transition-colors"
                  >
                    {item.imageUrl && (
                      <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={sanitizeCloudinaryUrl(item.imageUrl) || item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{item.name}</p>
                      <p className="text-amber-500/80 text-sm">£{item.price.toFixed(2)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToBooking(item.id)}
                      disabled={busy || added}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-60 flex-shrink-0"
                    >
                      {busy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : added ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add to booking
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected items (persist after refresh) + Confirm Request */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Selected
          </h3>
          {loadingCart ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : cart.length === 0 ? (
            <p className="text-gray-500 text-sm">No items yet. Add from the list above.</p>
          ) : (
            <>
              <ul className="space-y-2 mb-4" role="list" aria-label="Selected items">
                {cart.map((row) => {
                  const isRequested = row.status !== "pending_approval";
                  return (
                    <li
                      key={row.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-900/50 border border-amber-500/20"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white">
                          {row.HireItem.name} × {row.quantity}
                        </span>
                        {isRequested && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/40 rounded text-[10px] font-bold uppercase tracking-wider">
                            Requested
                          </span>
                        )}
                      </div>
                      <span className="text-amber-500 font-medium">
                        £{(row.HireItem.price * row.quantity).toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Button
                onClick={confirmRequest}
                disabled={confirming}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                {confirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Confirm Request"
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
