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
import { Loader2, Eye, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { API_URL } from "../../lib/api";
import { getOrderDeliveryInfo } from "../../lib/orderAddress";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function DeliveryBlock({ delivery, compact = false }) {
  if (!delivery) {
    return (
      <p className="font-body text-xs text-muted-foreground italic">
        No delivery address on file
      </p>
    );
  }

  if (compact) {
    return (
      <p className="font-body text-xs text-muted-foreground flex items-start gap-1 mt-1">
        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
        <span className="line-clamp-2">{delivery.formatted}</span>
      </p>
    );
  }

  return (
    <div className="font-body text-sm space-y-1 rounded-lg bg-muted/50 p-3">
      {delivery.name && (
        <p className="font-medium text-foreground">{delivery.name}</p>
      )}
      <p>{delivery.street}</p>
      <p>
        {[delivery.city, delivery.state, delivery.zip].filter(Boolean).join(", ")}
      </p>
      {delivery.country && (
        <p className="text-muted-foreground">{delivery.country}</p>
      )}
      {(delivery.phone || delivery.email) && (
        <p className="text-xs text-muted-foreground pt-1 border-t border-border mt-2">
          {delivery.phone && <span>{delivery.phone}</span>}
          {delivery.phone && delivery.email && " · "}
          {delivery.email && <span>{delivery.email}</span>}
        </p>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const selectedDelivery = selected ? getOrderDeliveryInfo(selected) : null;

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated");
    },
    onError: () => {
      toast.error("Failed to update order");
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
          {orders.map((order) => {
            const delivery = getOrderDeliveryInfo(order);
            const customerName = [order.firstName, order.lastName]
              .filter(Boolean)
              .join(" ");

            return (
              <Card key={order._id}>
                <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 px-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-body font-semibold text-sm">
                        {customerName || order.email || "Customer"}
                      </h3>
                      <span
                        className={`font-body text-xs px-2 py-0.5 rounded-full font-medium ${
                          statusColors[order.orderStatus] ||
                          statusColors.pending
                        }`}
                      >
                        {order.orderStatus || "pending"}
                      </span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">
                      {order.items?.length || 0} items • €
                      {order.total?.toFixed(2)} •{" "}
                      {order.created_date
                        ? format(new Date(order.created_date), "MMM d, yyyy")
                        : order.createdAt
                          ? format(new Date(order.createdAt), "MMM d, yyyy")
                          : ""}
                      {order.paymentReference && (
                        <> • Ref: {order.paymentReference}</>
                      )}
                    </p>
                    <DeliveryBlock delivery={delivery} compact />
                  </div>
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <Select
                      value={order.orderStatus || "processing"}
                      onValueChange={(v) =>
                        updateMutation.mutate({
                          id: order._id,
                          data: { orderStatus: v },
                        })
                      }
                    >
                      <SelectTrigger className="w-32 font-body text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
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
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Order Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 font-body text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Customer</p>
                  <p className="font-medium">
                    {selectedDelivery?.name ||
                      [selected.firstName, selected.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium break-all">
                    {selectedDelivery?.email || selected.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">
                    {selectedDelivery?.phone || selected.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-medium capitalize">
                    {selected.orderStatus}
                  </p>
                </div>
                {selected.paymentReference && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">
                      Payment Reference
                    </p>
                    <p className="font-medium font-mono tracking-wide">
                      {selected.paymentReference}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="font-body text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery address
                </p>
                <DeliveryBlock delivery={selectedDelivery} />
              </div>

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
                        {item.name} x{item.quantity}
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

              {selectedDelivery?.notes && (
                <div className="font-body text-sm">
                  <p className="text-muted-foreground text-xs">Order notes</p>
                  <p>{selectedDelivery.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
