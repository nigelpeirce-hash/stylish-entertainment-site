"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  itemName: string;
  hireItem: {
    name: string;
    imageUrl: string | null;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerAddress: string | null;
  status: string;
  totalAmount: number;
  eventDate: string | null;
  eventType: string | null;
  venueName: string | null;
  venueAddress: string | null;
  notes: string | null;
  createdAt: string;
  confirmedAt: string | null;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin" && orderId) {
      fetchOrder();
    }
  }, [status, session, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setAdminNotes(data.order.notes || "");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          notes: adminNotes || undefined,
        }),
      });

      if (response.ok) {
        await fetchOrder();
        if (newStatus === "confirmed") {
          alert("Order confirmed! Customer will be notified.");
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin" || !order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <Link href="/admin/orders">
          <Button variant="ghost" className="text-gray-300 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{order.orderNumber}</CardTitle>
                    <span
                      className={`px-3 py-1 text-sm rounded border inline-flex items-center gap-2 ${
                        order.status === "pending"
                          ? "bg-yellow-900/30 text-yellow-400 border-yellow-500/30"
                          : order.status === "confirmed"
                          ? "bg-green-900/30 text-green-400 border-green-500/30"
                          : order.status === "cancelled"
                          ? "bg-red-900/30 text-red-400 border-red-500/30"
                          : "bg-blue-900/30 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {order.status === "pending" && <Clock className="w-4 h-4" />}
                      {order.status === "confirmed" && <CheckCircle className="w-4 h-4" />}
                      {order.status === "cancelled" && <XCircle className="w-4 h-4" />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-champagne-gold">
                      £{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Created: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Customer Information */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-sm text-gray-400">{order.customerEmail}</p>
                  </div>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-300">{order.customerPhone}</p>
                  </div>
                )}
                {order.customerAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <p className="text-gray-300">{order.customerAddress}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Information */}
            {(order.eventDate || order.venueName) && (
              <Card className="bg-gray-800 border-champagne-gold/30">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.eventDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-semibold">Event Date</p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.eventDate).toLocaleDateString("en-GB", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.eventType && (
                    <div>
                      <p className="font-semibold">Event Type</p>
                      <p className="text-sm text-gray-400">{order.eventType}</p>
                    </div>
                  )}
                  {order.venueName && (
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-semibold">{order.venueName}</p>
                        {order.venueAddress && (
                          <p className="text-sm text-gray-400">{order.venueAddress}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      {item.hireItem.imageUrl && (
                        <img
                          src={item.hireItem.imageUrl}
                          alt={item.itemName}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">{item.itemName}</p>
                        <p className="text-sm text-gray-400">
                          Quantity: {item.quantity} × £{item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-champagne-gold">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-champagne-gold/30 sticky top-4">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.status === "pending" && (
                  <>
                    <Button
                      onClick={() => updateOrderStatus("confirmed")}
                      disabled={updating}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Order
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus("cancelled")}
                      disabled={updating}
                      variant="outline"
                      className="w-full border-red-500 text-red-400 hover:bg-red-900/20"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Order
                    </Button>
                  </>
                )}

                {order.status === "confirmed" && (
                  <Button
                    onClick={() => updateOrderStatus("completed")}
                    disabled={updating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Mark as Completed
                  </Button>
                )}

                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="bg-gray-900 text-white border-gray-700"
                    placeholder="Internal notes about this order..."
                  />
                  <Button
                    onClick={() => updateOrderStatus(order.status)}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Save Notes
                  </Button>
                </div>

                {order.notes && (
                  <div>
                    <Label>Customer Notes</Label>
                    <p className="text-sm text-gray-400 mt-2 bg-gray-900 p-3 rounded">
                      {order.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
