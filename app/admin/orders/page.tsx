"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
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
  status: string;
  totalAmount: number;
  createdAt: string;
  eventDate: string | null;
  venueName: string | null;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchOrders();
    }
  }, [status, session, filter]);

  const fetchOrders = async () => {
    try {
      const url = filter !== "all" ? `/api/admin/orders?status=${filter}` : "/api/admin/orders";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/30";
      case "confirmed":
        return "bg-green-900/30 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-900/30 text-red-400 border-red-500/30";
      case "completed":
        return "bg-blue-900/30 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Hire Orders</h1>
              <p className="text-gray-400">View and manage hire item orders</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-champagne-gold text-champagne-gold">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-yellow-500/30">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{pendingOrders}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-green-500/30">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Confirmed</p>
                <p className="text-2xl font-bold text-green-400">{confirmedOrders}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {["all", "pending", "confirmed", "cancelled", "completed"].map((status) => (
              <Button
                key={status}
                onClick={() => setFilter(status)}
                variant={filter === status ? "default" : "outline"}
                className={
                  filter === status
                    ? "bg-champagne-gold text-black"
                    : "border-gray-600 text-gray-300"
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{order.orderNumber}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded border flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      <strong>Customer:</strong> {order.customerName} ({order.customerEmail})
                    </p>
                    {order.customerPhone && (
                      <p className="text-sm text-gray-400">
                        <strong>Phone:</strong> {order.customerPhone}
                      </p>
                    )}
                    {order.eventDate && (
                      <p className="text-sm text-gray-400">
                        <strong>Event Date:</strong>{" "}
                        {new Date(order.eventDate).toLocaleDateString()}
                      </p>
                    )}
                    {order.venueName && (
                      <p className="text-sm text-gray-400">
                        <strong>Venue:</strong> {order.venueName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-champagne-gold mb-2">
                      £{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex gap-2 flex-wrap">
                    {order.items.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-300"
                      >
                        {item.itemName} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {orders.length === 0 && (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">No orders found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
