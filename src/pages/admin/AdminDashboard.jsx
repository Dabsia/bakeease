const API_BASE_URL = "https://bakeease-backend.onrender.com";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cos } from "three/src/nodes/math/MathNode.js";

export default function AdminDashboard() {
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "processing",
  ).length;

  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Products",
      value: products.count,
      icon: Package,
      color: "text-blue-500",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-green-500",
    },
    {
      label: "Revenue",
      value: `€${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "Processing Orders",
      value: pendingOrders,
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-body text-sm text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="font-heading text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-body text-lg">Recent Orders</CardTitle>
          <p
            className="font-body text-sm text-primary hover:underline cursor-pointer"
            onClick={() => navigate("/admin/orders")}
          >
            View all
          </p>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="font-body text-xs text-muted-foreground text-left pb-3">
                      Customer
                    </th>
                    <th className="font-body text-xs text-muted-foreground text-left pb-3">
                      Items
                    </th>
                    <th className="font-body text-xs text-muted-foreground text-left pb-3">
                      Total
                    </th>
                    <th className="font-body text-xs text-muted-foreground text-left pb-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-border last:border-none"
                    >
                      <td className="font-body text-sm py-3">
                        {order.firstName} {order.lastName}
                      </td>
                      <td className="font-body text-sm py-3 text-muted-foreground">
                        {order.items?.length || 0} items
                      </td>
                      <td className="font-body text-sm py-3 font-semibold">
                        €{order.total?.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-body text-xs px-2 py-1 rounded-full font-medium ${
                            order.orderStatus === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.orderStatus === "delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
