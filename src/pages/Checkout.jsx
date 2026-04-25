import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    city: "",
    state: "",
    zip_code: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsSubmitting(true);

    // TODO: Replace with your own order creation logic
    // Example: await yourApi.createOrder({
    //   ...form,
    //   items: items.map((i) => ({
    //     product_id: i.product_id,
    //     product_name: i.product_name,
    //     quantity: i.quantity,
    //     price: i.price,
    //   })),
    //   total,
    //   status: "pending",
    // });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    clearCart();
    setOrderPlaced(true);
    setIsSubmitting(false);
  };

  if (orderPlaced) {
    return (
      <div className="py-32 text-center px-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          Order Placed!
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        <Link
          to="/"
          className="inline-block bg-foreground text-background font-body font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
        >
          BACK TO HOME
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-32 text-center px-4">
        <p className="font-body text-muted-foreground text-lg mb-4">
          Your cart is empty.
        </p>
        <Link to="/shop" className="font-body text-primary hover:underline">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="font-heading text-3xl font-black text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Full Name *</Label>
                <Input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Email *</Label>
                <Input
                  name="customer_email"
                  type="email"
                  value={form.customer_email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="font-body text-sm">Phone</Label>
              <Input
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="font-body text-sm">Shipping Address *</Label>
              <Input
                name="shipping_address"
                value={form.shipping_address}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="font-body text-sm">City *</Label>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-body text-sm">State *</Label>
                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-body text-sm">ZIP Code *</Label>
                <Input
                  name="zip_code"
                  value={form.zip_code}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="font-body text-sm">Order Notes</Label>
              <Textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold py-6 rounded-full text-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              PLACE ORDER — €{total.toFixed(2)}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
              <h3 className="font-body font-bold text-sm mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-body text-xs font-medium truncate max-w-[140px]">
                          {item.product_name}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-body text-xs font-semibold">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-between">
                <span className="font-body font-bold">Total</span>
                <span className="font-body font-bold">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
