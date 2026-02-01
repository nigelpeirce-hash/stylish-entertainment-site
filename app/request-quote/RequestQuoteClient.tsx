"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, Minus, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { trackEnquiryComplete } from "@/lib/analytics";

const STORAGE_KEY = "public_hire_basket";

const SERVICE_OPTIONS = [
  { value: "lighting", label: "Lighting" },
  { value: "dj_kit", label: "DJ & kit" },
  { value: "production", label: "Production" },
  { value: "hire_only", label: "Hire only" },
  { value: "combination", label: "Combination" },
] as const;

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
      (x: { hireItemId?: string; quantity?: number }) =>
        typeof x?.hireItemId === "string" && typeof x?.quantity === "number" && x.quantity >= 1
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

export default function RequestQuoteClient() {
  const [services, setServices] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    eventDate: "",
    venue: "",
    message: "",
  });
  const [hireItems, setHireItems] = useState<HireItem[]>([]);
  const [basket, setBasket] = useState<BasketEntry[]>([]);
  const [loadingHire, setLoadingHire] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successDate, setSuccessDate] = useState("");

  const showHireSection = services.includes("hire_only") || services.includes("combination");

  const persistBasket = useCallback((next: BasketEntry[]) => {
    setBasket(next);
    saveBasket(next);
  }, []);

  useEffect(() => {
    setBasket(loadBasket());
  }, []);

  useEffect(() => {
    if (!showHireSection) return;
    let cancelled = false;
    setLoadingHire(true);
    (async () => {
      try {
        const r = await fetch("/api/hire-items");
        const d = await r.json();
        if (!cancelled) setHireItems(d.items || []);
      } catch {
        if (!cancelled) setHireItems([]);
      } finally {
        if (!cancelled) setLoadingHire(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showHireSection]);

  const toggleService = (value: string) => {
    setServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const addToBasket = (item: HireItem, qty: number = 1) => {
    const next = [...basket];
    const i = next.findIndex((x) => x.hireItemId === item.id);
    const cap = item.stockAvailable > 0 ? Math.min(qty, item.stockAvailable) : qty;
    if (i >= 0) {
      const newQty = next[i].quantity + cap;
      next[i] = { ...next[i], quantity: item.stockAvailable > 0 ? Math.min(newQty, item.stockAvailable) : newQty };
    } else {
      next.push({ hireItemId: item.id, quantity: cap });
    }
    persistBasket(next);
  };

  const updateQty = (hireItemId: string, delta: number) => {
    const item = hireItems.find((i) => i.id === hireItemId);
    const next = basket
      .map((e) => {
        if (e.hireItemId !== hireItemId) return e;
        const n = e.quantity + delta;
        if (n < 1) return null;
        const cap = item && item.stockAvailable > 0 ? Math.min(n, item.stockAvailable) : n;
        return { ...e, quantity: cap };
      })
      .filter(Boolean) as BasketEntry[];
    persistBasket(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!form.eventDate.trim()) {
      setError("Event date is required");
      return;
    }
    if (services.length === 0) {
      setError("Select at least one service");
      return;
    }

    setSubmitting(true);
    try {
      const r = await fetch("/api/public/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          eventDate: form.eventDate,
          venue: form.venue.trim() || undefined,
          message: form.message.trim() || undefined,
          services,
          selectedItems: basket.map((e) => ({ hireItemId: e.hireItemId, quantity: e.quantity })),
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d?.error || "Something went wrong");
        return;
      }
      trackEnquiryComplete({
        eventType: "quote_request",
        eventDate: form.eventDate,
        source: "request_quote_page",
      });
      setSuccessDate(d.dateLabel || form.eventDate);
      setSuccess(true);
      persistBasket([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
        <div className="container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gray-800 border border-champagne-gold/30 p-8"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Request received</h1>
            <p className="text-gray-400 mb-6">
              Thanks! We&apos;ll check availability for {successDate} and send your quote shortly.
            </p>
            <Link href="/">
              <Button className="bg-champagne-gold text-black hover:bg-amber-200">
                Back to home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Request a quote</h1>
          <p className="text-gray-400">
            Tell us what you need (lighting, DJ & kit, production, hire) and we&apos;ll send a custom quote. No payment now.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-gray-800 border-champagne-gold/30 mb-6">
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="text-gray-300 mb-2 block">Services you&apos;re interested in</Label>
                <div className="flex flex-wrap gap-3">
                  {SERVICE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={services.includes(opt.value)}
                        onChange={() => toggleService(opt.value)}
                        className="rounded border-gray-600 bg-gray-900 text-champagne-gold"
                      />
                      <span className="text-white">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Full name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventDate" className="text-gray-300">Event date *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venue" className="text-gray-300">Venue</Label>
                  <Input
                    id="venue"
                    value={form.venue}
                    onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                    placeholder="TBC"
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-300">Message (optional)</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your event, budget, or specific requirements"
                  className="bg-gray-900 border-gray-600 text-white mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {showHireSection && (
            <Card className="bg-gray-800 border-champagne-gold/30 mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Hire items (optional)</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Add items from the hire shop. Same basket as <Link href="/hire" className="text-champagne-gold hover:underline">Hire Shop</Link>.
                </p>
                {loadingHire ? (
                  <p className="text-gray-400">Loading items…</p>
                ) : hireItems.length === 0 ? (
                  <p className="text-gray-400">No hire items available at the moment.</p>
                ) : (
                  <ul className="space-y-3">
                    {hireItems.map((item) => {
                      const inBasket = basket.find((e) => e.hireItemId === item.id);
                      const qty = inBasket?.quantity ?? 0;
                      return (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-4 py-2 border-b border-gray-700 last:border-0"
                        >
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-sm text-gray-400">
                              £{item.price.toFixed(2)}
                              {item.stockAvailable >= 0 && ` · ${item.stockAvailable} available`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {qty > 0 ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300"
                                  onClick={() => updateQty(item.id, -1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-white font-semibold w-6 text-center">{qty}</span>
                                <Button
                                  type="button"
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
                                type="button"
                                size="sm"
                                className="bg-champagne-gold text-black hover:bg-amber-200"
                                onClick={() => addToBasket(item, 1)}
                                disabled={item.stockAvailable === 0}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {basket.length > 0 && (
                  <p className="text-sm text-champagne-gold mt-4">
                    {basket.reduce((s, x) => s + x.quantity, 0)} item(s) in basket
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-champagne-gold text-black hover:bg-amber-200"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              "Send quote request"
            )}
          </Button>
        </form>

        <p className="text-gray-500 text-sm mt-6">
          Prefer to browse hire items first? <Link href="/hire" className="text-champagne-gold hover:underline">Go to Hire Shop</Link>.
        </p>
      </div>
    </div>
  );
}
