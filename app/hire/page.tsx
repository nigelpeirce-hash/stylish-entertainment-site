"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Plus, Minus, X, Package, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";
import { trackEnquiryComplete } from "@/lib/analytics";

const STORAGE_KEY = "public_hire_basket";

interface HireItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stockAvailable: number;
  imageUrl: string | null;
  category: string | null;
  slug?: string | null;
}

interface BasketEntry {
  hireItemId: string;
  quantity: number;
}

function loadBasket(): BasketEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    return items.filter(
      (x: any) => typeof x?.hireItemId === "string" && typeof x?.quantity === "number" && x.quantity >= 1
    );
  } catch {
    return [];
  }
}

function saveBasket(items: BasketEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  } catch {
    /* ignore */
  }
}

export default function HirePage() {
  const [items, setItems] = useState<HireItem[]>([]);
  const [basket, setBasket] = useState<BasketEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDate, setSuccessDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", eventDate: "", venue: "" });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const persistBasket = useCallback((next: BasketEntry[]) => {
    setBasket(next);
    saveBasket(next);
  }, []);

  useEffect(() => {
    setBasket(loadBasket());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/hire-items");
        const d = await r.json();
        if (!cancelled) setItems(d.items || []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addToBasket = (item: HireItem, qty: number = 1) => {
    const next = [...basket];
    const i = next.findIndex((x) => x.hireItemId === item.id);
    if (i >= 0) {
      const cap = item.stockAvailable > 0 ? Math.min(next[i].quantity + qty, item.stockAvailable) : next[i].quantity + qty;
      next[i] = { ...next[i], quantity: cap };
    } else {
      const cap = item.stockAvailable > 0 ? Math.min(qty, item.stockAvailable) : qty;
      next.push({ hireItemId: item.id, quantity: cap });
    }
    persistBasket(next);
    setShowCart(true);
  };

  const updateQty = (hireItemId: string, delta: number) => {
    const next = basket.map((e) => {
      if (e.hireItemId !== hireItemId) return e;
      const n = e.quantity + delta;
      if (n < 1) return null;
      const item = items.find((i) => i.id === hireItemId);
      const cap = item && item.stockAvailable > 0 ? Math.min(n, item.stockAvailable) : n;
      return { ...e, quantity: cap };
    }).filter(Boolean) as BasketEntry[];
    persistBasket(next);
  };

  const removeFromBasket = (hireItemId: string) => {
    persistBasket(basket.filter((e) => e.hireItemId !== hireItemId));
  };

  const resolveBasket = () => {
    return basket.map((e) => {
      const hireItem = items.find((i) => i.id === e.hireItemId);
      return { ...e, hireItem };
    }).filter((x) => x.hireItem) as (BasketEntry & { hireItem: HireItem })[];
  };

  const resolved = resolveBasket();
  const cartTotal = resolved.reduce((s, x) => s + x.hireItem.price * x.quantity, 0);
  const cartCount = resolved.reduce((s, x) => s + x.quantity, 0);

  const openRequestQuote = () => {
    setFormError(null);
    setForm({ name: "", email: "", eventDate: "", venue: "" });
    setShowForm(true);
  };

  const submitRequestQuote = async () => {
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Full name is required");
      return;
    }
    if (!form.email.trim()) {
      setFormError("Email is required");
      return;
    }
    if (!form.eventDate.trim()) {
      setFormError("Event date is required");
      return;
    }
    const selectedItems = basket.map((e) => ({ hireItemId: e.hireItemId, quantity: e.quantity }));
    if (selectedItems.length === 0) {
      setFormError("Add at least one item to your basket first");
      return;
    }

    setSubmitting(true);
    try {
      const r = await fetch("/api/public/hire-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          eventDate: form.eventDate,
          venue: form.venue.trim() || undefined,
          selectedItems,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setFormError(d?.error || "Something went wrong");
        return;
      }
      
      // Track conversion in Google Analytics
      trackEnquiryComplete({
        eventType: 'hire',
        eventDate: form.eventDate,
        source: 'hire_enquiry_form',
      });
      
      setSuccessDate(d.dateLabel || form.eventDate);
      persistBasket([]);
      setShowCart(false);
      setShowForm(false);
      setShowSuccess(true);
    } catch (e: any) {
      setFormError(e?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-champagne-gold/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/what-we-do/equipment-dj-band-sound-kit">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              ← What We Do
            </Button>
          </Link>
          <Button
            onClick={() => setShowCart(!showCart)}
            className="bg-champagne-gold text-black hover:bg-amber-200 relative"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Basket
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[1.5rem] h-6 flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Create Your Setup</h1>
          <p className="text-gray-400">Add items to your basket, then request a quote. No payment now.</p>
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            const inBasket = basket.find((e) => e.hireItemId === item.id);
            const qty = inBasket?.quantity ?? 0;
            return (
              <Card key={item.id} className="bg-gray-800 border-champagne-gold/30">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {item.imageUrl ? (
                      <Link href={`/hire/${item.slug || item.id}`}>
                        <img
                          src={sanitizeCloudinaryUrl(item.imageUrl) || item.imageUrl}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                    <Link href={`/hire/${item.slug || item.id}`}>
                      <h3 className="text-xl font-semibold text-white mb-2 hover:text-champagne-gold transition-colors cursor-pointer">
                        {item.name}
                      </h3>
                    </Link>
                    {item.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-champagne-gold">
                        £{item.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400">{item.stockAvailable} available</span>
                    </div>

                    <div className="mb-4">
                      <button
                        onClick={() => {
                          const next = new Set(expandedItems);
                          if (isExpanded) next.delete(item.id);
                          else next.add(item.id);
                          setExpandedItems(next);
                        }}
                        className="flex items-center gap-2 text-sm text-champagne-gold hover:text-amber-200 transition-colors"
                      >
                        {isExpanded ? (
                          <><ChevronUp className="w-4 h-4" /> Read Less</>
                        ) : (
                          <><ChevronDown className="w-4 h-4" /> Read More</>
                        )}
                      </button>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-700 space-y-2"
                        >
                          <p className="text-xs text-gray-400">
                            {item.name === "Lanterns" && "Various sizes. Battery LED candles included."}
                            {item.name === "Candlesticks" && "Height 25cm. Brass or silver finish."}
                            {item.name === "Mirroballs" && "30cm diameter. Motor included."}
                            {item.name === "Vases" && "Various sizes. Clear or coloured glass."}
                            {item.name === "Crooks" && "120cm shepherd's crook. For lanterns or florals."}
                            {!["Lanterns", "Candlesticks", "Mirroballs", "Vases", "Crooks"].includes(item.name) && "Standard 3-day hire."}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300"
                          onClick={() => updateQty(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-white font-semibold w-8 text-center">{qty}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300"
                          onClick={() => updateQty(item.id, 1)}
                          disabled={item.stockAvailable > 0 && qty >= item.stockAvailable}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => addToBasket(item, 1)}
                        disabled={item.stockAvailable === 0}
                        className="flex-1 bg-champagne-gold text-black hover:bg-amber-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Basket
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {items.length === 0 && (
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">No items available at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Basket sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCart(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full md:w-96 bg-gray-800 border-l border-champagne-gold/30 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Basket</h2>
                  <Button variant="ghost" size="sm" className="text-gray-400" onClick={() => setShowCart(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {resolved.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {resolved.map(({ hireItemId, quantity, hireItem }) => (
                        <Card key={hireItemId} className="bg-gray-900 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white">{hireItem.name}</h3>
                                <p className="text-sm text-gray-400">£{hireItem.price.toFixed(2)} each</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-400"
                                onClick={() => removeFromBasket(hireItemId)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300"
                                  onClick={() => updateQty(hireItemId, -1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300"
                                  onClick={() => updateQty(hireItemId, 1)}
                                  disabled={hireItem.stockAvailable > 0 && quantity >= hireItem.stockAvailable}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <span className="text-champagne-gold font-bold">
                                £{(hireItem.price * quantity).toFixed(2)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="border-t border-gray-700 pt-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-semibold">Total</span>
                        <span className="text-2xl font-bold text-champagne-gold">£{cartTotal.toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={openRequestQuote}
                        className="w-full bg-champagne-gold text-black hover:bg-amber-200 font-semibold"
                      >
                        Request Quote
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">Your basket is empty</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Request Quote form modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-gray-900 border-champagne-gold/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Request a quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {formError && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}
            <div>
              <Label className="text-gray-300">Full name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Jane Smith"
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="jane@example.com"
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Event date</Label>
              <Input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Venue (optional)</Label>
              <Input
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                placeholder="e.g. Babington House"
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>
            <Button
              onClick={submitRequestQuote}
              disabled={submitting}
              className="w-full bg-champagne-gold text-black hover:bg-amber-200 font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending…
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success confirmation modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-gray-900 border-champagne-gold/30 text-white max-w-md text-center">
          <div className="py-6">
            <CheckCircle2 className="w-16 h-16 text-champagne-gold mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Thank you!</h2>
            <p className="text-gray-300">
              Nigel will check availability for {successDate} and send your custom quote shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
