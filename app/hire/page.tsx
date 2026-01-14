"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Plus, Minus, X, Package, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface HireItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stockAvailable: number;
  imageUrl: string | null;
  category: string | null;
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  hireItem: HireItem;
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function HirePage() {
  const [items, setItems] = useState<HireItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Generate or get session ID for guest carts
    let sid = localStorage.getItem("cartSessionId");
    if (!sid) {
      sid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cartSessionId", sid);
    }
    setSessionId(sid);

    fetchItems();
    fetchCart(sid);
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/hire-items");
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
        console.log("Fetched items:", data.items?.length || 0);
      } else {
        const error = await response.json();
        console.error("Error fetching items:", error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (sid: string) => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sid}`);
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      } else {
        const error = await response.json();
        console.error("Error fetching cart:", error);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (item: HireItem, quantity: number = 1) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hireItemId: item.id,
          quantity,
          sessionId,
        }),
      });

      if (response.ok) {
        await fetchCart(sessionId);
        setShowCart(true);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred");
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItemId,
          quantity,
        }),
      });

      if (response.ok) {
        await fetchCart(sessionId);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("An error occurred");
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCart(sessionId);
      } else {
        alert("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("An error occurred");
    }
  };

  const cartTotal = cart?.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;
  const cartItemCount = cart?.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  ) || 0;

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
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowCart(!showCart)}
              className="bg-champagne-gold text-black hover:bg-gold-light relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Basket
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Hire Items</h1>
          <p className="text-gray-400">Browse and add items to your basket</p>
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            return (
              <Card key={item.id} className="bg-gray-800 border-champagne-gold/30">
                <CardContent className="p-6">
                  <div className="mb-4">
                    {item.imageUrl ? (
                      <Link href={`/hire/${item.slug || item.id}`}>
                        <img
                          src={item.imageUrl}
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
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-champagne-gold">
                        £{item.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {item.stockAvailable} available
                      </span>
                    </div>

                    {/* Read More Section */}
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedItems);
                          if (isExpanded) {
                            newExpanded.delete(item.id);
                          } else {
                            newExpanded.add(item.id);
                          }
                          setExpandedItems(newExpanded);
                        }}
                        className="flex items-center gap-2 text-sm text-champagne-gold hover:text-gold-light transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Read Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Read More
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-700 space-y-2"
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-1">Dimensions</h4>
                            <p className="text-xs text-gray-400">
                              {item.name === "Lanterns" && "Various sizes available: Small (15cm), Medium (25cm), Large (35cm)"}
                              {item.name === "Candlesticks" && "Height: 25cm, Base diameter: 8cm. Available in brass or silver finish"}
                              {item.name === "Mirroballs" && "Standard size: 30cm diameter. Can be suspended from ceiling or mounted on stand"}
                              {item.name === "Vases" && "Various sizes: Small (20cm), Medium (30cm), Large (40cm). Clear glass or colored options"}
                              {item.name === "Crooks" && "Height: 120cm (4ft). Traditional shepherd's crook design, perfect for hanging lanterns or floral displays"}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-1">Additional Details</h4>
                            <ul className="text-xs text-gray-400 space-y-1">
                              {item.name === "Lanterns" && (
                                <>
                                  <li>• Battery operated LED candles included</li>
                                  <li>• Weather resistant for outdoor use</li>
                                  <li>• Available in various finishes</li>
                                </>
                              )}
                              {item.name === "Candlesticks" && (
                                <>
                                  <li>• Suitable for standard taper candles</li>
                                  <li>• Easy to clean and maintain</li>
                                  <li>• Elegant design for formal events</li>
                                </>
                              )}
                              {item.name === "Mirroballs" && (
                                <>
                                  <li>• Motor included for rotation</li>
                                  <li>• Requires spotlight for best effect</li>
                                  <li>• Professional installation available</li>
                                </>
                              )}
                              {item.name === "Vases" && (
                                <>
                                  <li>• Water-tight for fresh flowers</li>
                                  <li>• Easy to clean</li>
                                  <li>• Versatile for various arrangements</li>
                                </>
                              )}
                              {item.name === "Crooks" && (
                                <>
                                  <li>• Perfect for creating elegant entrance displays</li>
                                  <li>• Can be used with lanterns or floral arrangements</li>
                                  <li>• Sturdy construction for outdoor use</li>
                                  <li>• Traditional rustic design</li>
                                </>
                              )}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-1">Hire Period</h4>
                            <p className="text-xs text-gray-400">
                              Standard hire period: 3 days (collection day, event day, return day)
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => addToCart(item, 1)}
                    disabled={item.stockAvailable === 0}
                    className="w-full bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Basket
                  </Button>
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

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCart(false)}
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
                  <Button
                    onClick={() => setShowCart(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {cart && cart.items.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.items.map((item) => (
                        <Card key={item.id} className="bg-gray-900 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white">{item.hireItem.name}</h3>
                                <p className="text-sm text-gray-400">
                                  £{item.price.toFixed(2)} each
                                </p>
                              </div>
                              <Button
                                onClick={() => removeFromCart(item.id)}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-white font-semibold w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300"
                                  disabled={item.quantity >= item.hireItem.stockAvailable}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <span className="text-champagne-gold font-bold">
                                £{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="border-t border-gray-700 pt-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-semibold">Total</span>
                        <span className="text-2xl font-bold text-champagne-gold">
                          £{cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <Link href="/checkout" className="block">
                        <Button className="w-full bg-champagne-gold text-black hover:bg-gold-light">
                          Proceed to Checkout
                        </Button>
                      </Link>
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
    </div>
  );
}
