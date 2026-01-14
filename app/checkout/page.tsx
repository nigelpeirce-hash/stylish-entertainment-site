"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Package } from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  hireItem: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [sessionId, setSessionId] = useState<string>("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    eventDate: "",
    eventType: "",
    venueName: "",
    venueAddress: "",
    notes: "",
  });

  useEffect(() => {
    let sid = localStorage.getItem("cartSessionId");
    if (!sid) {
      router.push("/hire");
      return;
    }
    setSessionId(sid);

    // Pre-fill form if logged in
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        customerName: (session.user as any).name || "",
        customerEmail: (session.user as any).email || "",
      }));
    }

    fetchCart(sid);
  }, [session, router]);

  const fetchCart = async (sid: string) => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sid}`);
      if (response.ok) {
        const data = await response.json();
        if (!data.cart || data.cart.items.length === 0) {
          router.push("/hire");
          return;
        }
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          ...formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderNumber(data.order.orderNumber);
        setOrderCreated(true);
        
        // Clear cart from localStorage
        localStorage.removeItem("cartSessionId");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred");
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

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (orderCreated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h1 className="text-3xl font-bold mb-2">Order Submitted!</h1>
                <p className="text-gray-400 mb-4">
                  Your order has been received and will be confirmed once we verify stock availability and location.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-400 mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-champagne-gold">{orderNumber}</p>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  We'll send you a confirmation email at <strong>{formData.customerEmail}</strong> once your order has been reviewed and confirmed.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => router.push("/hire")}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Continue Shopping
                  </Button>
                  <Link href="/">
                    <Button className="bg-champagne-gold text-black hover:bg-gold-light">
                      Return Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/hire">
          <Button variant="ghost" className="text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hire Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-champagne-gold/30 sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {item.hireItem.imageUrl && (
                      <img
                        src={item.hireItem.imageUrl}
                        alt={item.hireItem.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.hireItem.name}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity} × £{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-champagne-gold">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-champagne-gold">
                      £{total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    * Final price confirmed after stock check
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <p className="text-sm text-gray-400 mt-2">
                  Please provide your details. We'll confirm your order once we've verified stock availability and location.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          value={formData.customerName}
                          onChange={(e) =>
                            setFormData({ ...formData, customerName: e.target.value })
                          }
                          required
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, customerEmail: e.target.value })
                          }
                          required
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, customerPhone: e.target.value })
                          }
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Address</Label>
                        <Textarea
                          value={formData.customerAddress}
                          onChange={(e) =>
                            setFormData({ ...formData, customerAddress: e.target.value })
                          }
                          rows={2}
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Event Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Event Details (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Event Date</Label>
                        <Input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) =>
                            setFormData({ ...formData, eventDate: e.target.value })
                          }
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Event Type</Label>
                        <Input
                          value={formData.eventType}
                          onChange={(e) =>
                            setFormData({ ...formData, eventType: e.target.value })
                          }
                          placeholder="e.g., Wedding, Party"
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Venue Name</Label>
                        <Input
                          value={formData.venueName}
                          onChange={(e) =>
                            setFormData({ ...formData, venueName: e.target.value })
                          }
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Venue Address</Label>
                        <Input
                          value={formData.venueAddress}
                          onChange={(e) =>
                            setFormData({ ...formData, venueAddress: e.target.value })
                          }
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Additional Notes</Label>
                        <Textarea
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          rows={3}
                          placeholder="Any special requirements or instructions..."
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                      <strong>Important:</strong> Your order will be reviewed and confirmed within 24-48 hours. 
                      We'll check stock availability and verify your location before confirming the order. 
                      You'll receive a confirmation email once approved.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    {submitting ? "Submitting..." : "Submit Order"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
