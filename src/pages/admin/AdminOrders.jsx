import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Loader2, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  // TODO: Replace with your own orders fetching logic
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      // Replace this with your actual API call
      // Example: return await yourApi.getOrders({ sort: "-created_date", limit: 100 });

      // For now, return empty array
      return [];
    },
  });

  // TODO: Replace with your own order update logic
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      // Replace this with your actual API call
      // Example: return await yourApi.updateOrder(id, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated");
    },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">
        Orders
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-body text-muted-foreground">No orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex items-center gap-4 py-3 px-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body font-semibold text-sm">
                      {order.customer_name}
                    </h3>
                    <span
                      className={`font-body text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[order.status] || statusColors.pending
                      }`}
                    >
                      {order.status || "pending"}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    {order.items?.length || 0} items • €
                    {order.total?.toFixed(2)} •{" "}
                    {order.created_date
                      ? format(new Date(order.created_date), "MMM d, yyyy")
                      : ""}
                  </p>
                </div>
                <Select
                  value={order.status || "pending"}
                  onValueChange={(v) =>
                    updateMutation.mutate({ id: order.id, data: { status: v } })
                  }
                >
                  <SelectTrigger className="w-32 font-body text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(order)}
                  className="font-body text-xs gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Order Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 font-body text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Customer</p>
                  <p className="font-medium">{selected.customer_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{selected.customer_email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">
                    {selected.customer_phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-medium capitalize">{selected.status}</p>
                </div>
              </div>
              {selected.shipping_address && (
                <div className="font-body text-sm">
                  <p className="text-muted-foreground text-xs">
                    Shipping Address
                  </p>
                  <p className="font-medium">
                    {selected.shipping_address}, {selected.city},{" "}
                    {selected.state} {selected.zip_code}
                  </p>
                </div>
              )}
              <div>
                <p className="font-body text-xs text-muted-foreground mb-2">
                  Items
                </p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between font-body text-sm"
                    >
                      <span>
                        {item.product_name} x{item.quantity}
                      </span>
                      <span className="font-semibold">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-3 pt-3 flex justify-between font-body font-bold">
                  <span>Total</span>
                  <span>€{selected.total?.toFixed(2)}</span>
                </div>
              </div>
              {selected.notes && (
                <div className="font-body text-sm">
                  <p className="text-muted-foreground text-xs">Notes</p>
                  <p>{selected.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
