import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with your own authentication and order fetching logic
    const fetchOrders = async () => {
      try {
        // Get current user from your auth system
        // const user = await yourAuth.getCurrentUser();

        // Fetch orders for this user from your API
        // const orders = await yourApi.getOrders({
        //   customerEmail: user.email,
        //   sort: "-created_date",
        //   limit: 50
        // });
        // setOrders(orders);

        // For now, just simulate loading completion
        setLoading(false);
      } catch (error) {
        // Handle error (user not logged in, etc.)
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <div className="w-6 h-6 border-4 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-32 text-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
          No orders yet
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          Once you place an order, it will appear here.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-foreground text-background font-body font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
        >
          SHOP NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl font-black text-foreground mb-8">
          Order History
        </h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">
                      {order.created_date
                        ? format(new Date(order.created_date), "MMM d, yyyy")
                        : ""}
                    </p>
                    <p className="font-body font-semibold text-sm text-foreground mt-0.5">
                      {order.items?.length || 0} item
                      {order.items?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-body text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[order.status] || statusColors.pending
                      }`}
                    >
                      {order.status || "pending"}
                    </span>
                    <p className="font-body font-bold text-sm mt-1">
                      €{order.total?.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-1">
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between font-body text-sm text-muted-foreground"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
