"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Loader2, X, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export type ServiceQuoteCategory = "lighting" | "venue_styling";

interface ServiceQuoteItem {
  id: string;
  name: string;
  description: string | null;
  unit: string;
  pricePerUnit: number;
  category: string;
}

interface ServiceQuoteGeneratorProps {
  category: ServiceQuoteCategory;
  title?: string;
  /** If true, render inside a compact card; if false, full-width for dedicated page */
  compact?: boolean;
  /** Optional: show a close button that calls this (e.g. close modal) */
  onClose?: () => void;
}

export function ServiceQuoteGenerator({
  category,
  title,
  compact = true,
  onClose,
}: ServiceQuoteGeneratorProps) {
  const [items, setItems] = useState<ServiceQuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [bespokeLines, setBespokeLines] = useState<Array<{ id: string; description: string; amount: string }>>([]);
  const [copied, setCopied] = useState(false);

  const addBespokeLine = () => {
    setBespokeLines((prev) => [
      ...prev,
      { id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `bespoke-${Date.now()}-${prev.length}`, description: "", amount: "" },
    ]);
  };

  const updateBespokeLine = (id: string, field: "description" | "amount", value: string) => {
    setBespokeLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const removeBespokeLine = (id: string) => {
    setBespokeLines((prev) => prev.filter((l) => l.id !== id));
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchItems() {
      try {
        const res = await fetch(`/api/service-quote-items?category=${category}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) {
          setItems(data.items || []);
          setQuantities((q) => {
            const next = { ...q };
            (data.items || []).forEach((i: ServiceQuoteItem) => {
              if (next[i.id] === undefined) next[i.id] = 0;
            });
            return next;
          });
        }
      } catch (e) {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchItems();
    return () => { cancelled = true; };
  }, [category]);

  const setQty = (id: string, value: number) => {
    const n = Math.max(0, Math.floor(value));
    setQuantities((q) => ({ ...q, [id]: n }));
  };

  const lines = items
    .map((item) => ({
      item,
      qty: quantities[item.id] ?? 0,
      total: (quantities[item.id] ?? 0) * item.pricePerUnit,
    }))
    .filter((l) => l.qty > 0);

  const catalogTotal = lines.reduce((sum, l) => sum + l.total, 0);
  const bespokeWithAmount = bespokeLines
    .map((l) => ({ ...l, parsed: parseFloat(l.amount) || 0 }))
    .filter((l) => l.parsed > 0);
  const bespokeTotal = bespokeWithAmount.reduce((sum, l) => sum + l.parsed, 0);
  const total = catalogTotal + bespokeTotal;

  const summaryLines: string[] = [
    title || (category === "lighting" ? "Lighting quote" : "Venue styling quote"),
    "",
    ...lines.map(
      (l) =>
        `${l.item.name} · ${l.qty} ${l.item.unit} @ £${l.item.pricePerUnit.toFixed(2)} = £${l.total.toFixed(2)}`
    ),
  ];
  if (bespokeWithAmount.length > 0) {
    summaryLines.push("");
    bespokeWithAmount.forEach((l) => {
      const label = l.description.trim() || "Other";
      summaryLines.push(`${label} £${l.parsed.toFixed(2)}`);
    });
  }
  summaryLines.push("", `Total: £${total.toFixed(2)}`);
  const summaryText = summaryLines.join("\n");

  const hasAnyQuoteContent = lines.length > 0 || bespokeWithAmount.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const contactUrl = "/contact-us/?" + new URLSearchParams({
    subject: category === "lighting" ? "Lighting quote request" : "Venue styling quote request",
    message: summaryText.replace(/\n/g, "%0A"),
  }).toString();

  const displayTitle = title ?? (category === "lighting" ? "Lighting quote" : "Venue styling quote");

  if (loading) {
    return (
      <Card className={compact ? "bg-gray-800 border-champagne-gold/30" : "bg-gray-800 border-champagne-gold/30"}>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-champagne-gold" />
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="bg-gray-800 border-champagne-gold/30">
        <CardContent className="py-6 text-center text-gray-400">
          <p>No quote items are set up for this service yet.</p>
          <p className="text-sm mt-2">Please contact us and we’ll put together a quote for you.</p>
          <Button asChild className="mt-4 bg-champagne-gold text-black hover:bg-champagne-gold/90">
            <Link href="/contact-us/">Get in touch</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg text-white">{displayTitle}</CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">
          Add quantities for the items you’re interested in. We’ll use this to prepare your quote.
        </p>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm sm:text-base">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.unit} · £{item.pricePerUnit.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`qty-${item.id}`} className="text-gray-400 text-sm whitespace-nowrap">
                  Qty
                </Label>
                <Input
                  id={`qty-${item.id}`}
                  type="number"
                  min={0}
                  value={quantities[item.id] ?? 0}
                  onChange={(e) => setQty(item.id, parseInt(e.target.value, 10) || 0)}
                  className="w-20 bg-gray-900 border-gray-600 text-white text-center"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bespoke / other items */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-300">Bespoke / other items</p>
          {bespokeLines.map((line) => (
            <div
              key={line.id}
              className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-gray-900/50 border border-gray-700"
            >
              <Input
                value={line.description}
                onChange={(e) => updateBespokeLine(line.id, "description", e.target.value)}
                placeholder="e.g. Fair Ground Ride"
                className="flex-1 min-w-[120px] bg-gray-900 border-gray-600 text-white"
              />
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">£</span>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={line.amount}
                  onChange={(e) => updateBespokeLine(line.id, "amount", e.target.value)}
                  placeholder="0"
                  className="w-24 bg-gray-900 border-gray-600 text-white text-right"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBespokeLine(line.id)}
                className="text-gray-400 hover:text-red-400 shrink-0"
                aria-label="Remove bespoke item"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBespokeLine}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add bespoke item
          </Button>
        </div>

        {hasAnyQuoteContent && (
          <>
            <div className="border-t border-gray-700 pt-4 space-y-1">
              {lines.map((l) => (
                <div key={l.item.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {l.item.name} × {l.qty}
                  </span>
                  <span className="text-white">£{l.total.toFixed(2)}</span>
                </div>
              ))}
              {bespokeWithAmount.map((l) => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {l.description.trim() || "Other"}
                  </span>
                  <span className="text-white">£{l.parsed.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-white pt-2 border-t border-gray-600">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy quote"}
              </Button>
              <Button asChild size="sm" className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
                <Link href={contactUrl}>Request this quote</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
