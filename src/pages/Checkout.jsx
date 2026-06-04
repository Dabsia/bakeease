import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Landmark,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { getBankDetails } from "../lib/bankDetails";
import { generatePaymentReference } from "../utils";
import { API_URL } from "../lib/api";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [step, setStep] = useState("details");
  const [bankDetails, setBankDetails] = useState(null);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
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

  useEffect(() => {
    if (step === "payment") {
      setLoadingBankDetails(true);
      getBankDetails()
        .then(setBankDetails)
        .catch(() => toast.error("Could not load bank details"))
        .finally(() => setLoadingBankDetails(false));
    }
  }, [step]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const createCheckoutSession = async () => {
    const token = localStorage.getItem("auth_token");

    const nameParts = form.customer_name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0];

    const lineItems = items.map((item) => ({
      productId: item.product_id,
      name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const response = await fetch(`${API_URL}/checkout/place-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        items: lineItems,
        customer: {
          firstName,
          lastName,
          email: form.customer_email,
          phone: form.customer_phone,
          streetAddress: form.shipping_address,
          city: form.city,
          postcode: form.zip_code,
          country: form.state || "Estonia",
          additionalInfo: form.notes,
        },
        subtotal: total,
        total: total,
        paymentMethod: "bank_transfer",
        paymentReference,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to place order");
    }

    return response.json();
  };

  const validateForm = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    if (
      !form.customer_name ||
      !form.customer_email ||
      !form.customer_phone ||
      !form.shipping_address ||
      !form.city ||
      !form.zip_code
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    return true;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setPaymentReference(generatePaymentReference());
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);

    try {
      await createCheckoutSession();
      clearCart();
      setOrderPlaced(true);
      toast.success("Order placed! We will confirm once your payment is received.");
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="py-32 text-center px-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          Order Placed!
        </h1>
        <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
          Thank you for your order. We will verify your bank transfer and process
          your order shortly. You will receive a confirmation email at{" "}
          <span className="font-semibold text-foreground">
            {form.customer_email}
          </span>
          .
        </p>
        {paymentReference && (
          <div className=" bg-muted border w-fit mx-auto border-border rounded-xl px-6 py-4 mb-6">
            <p className="font-body text-xs text-muted-foreground mb-1">
              Your payment reference
            </p>
            <p className="font-heading text-lg font-bold tracking-wide">
              {paymentReference}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-2">
              Keep this reference — we use it to match your bank transfer to your
              order.
            </p>
          </div>
        )}
        <Link
          to="/"
          className="bg-foreground text-background font-body font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
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

  const bankFields = bankDetails
    ? [
        { label: "Account Name", value: bankDetails.accountName },
        { label: "Bank Name", value: bankDetails.bankName },
        { label: "Account Number", value: bankDetails.accountNumber },
        { label: "IBAN", value: bankDetails.iban },
        { label: "SWIFT / BIC", value: bankDetails.swiftCode },
      ].filter((field) => field.value)
    : [];

  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {step === "payment" ? (
          <button
            type="button"
            onClick={() => setStep("details")}
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Details
          </button>
        ) : (
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
        )}

        <h1 className="font-heading text-3xl font-black text-foreground mb-2">
          {step === "details" ? "Checkout" : "Bank Transfer Payment"}
        </h1>
        {step === "payment" && (
          <p className="font-body text-muted-foreground mb-8">
            Transfer{" "}
            <span className="font-semibold text-foreground">
              €{total.toFixed(2)}
            </span>{" "}
            to the account below. Use your unique payment reference so we can
            identify your transfer.
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {step === "details" ? (
            <form
              onSubmit={handleContinueToPayment}
              className="lg:col-span-3 space-y-5"
            >
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
                <Label className="font-body text-sm">Phone *</Label>
                <Input
                  type="number"
                  name="customer_phone"
                  value={form.customer_phone}
                  onChange={handleChange}
                  required
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
                  <Label className="font-body text-sm">State</Label>
                  <Input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
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
                className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold py-6 rounded-full text-sm"
              >
                CONTINUE TO PAYMENT — €{total.toFixed(2)}
              </Button>
            </form>
          ) : (
            <div className="lg:col-span-3 space-y-6">
              {paymentReference && (
                <div className="bg-foreground text-background rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-body text-xs opacity-80 mb-1">
                        Payment Reference — include this in your transfer
                      </p>
                      <p className="font-heading text-2xl font-bold tracking-wider">
                        {paymentReference}
                      </p>
                      <p className="font-body text-xs opacity-80 mt-2 max-w-md">
                        Enter this exact reference in your bank&apos;s payment
                        description or reference field. This is how we match
                        your payment to your order.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(paymentReference, "Payment reference")
                      }
                      className="flex-shrink-0 p-2 rounded-md bg-background/10 hover:bg-background/20 transition-colors"
                      title="Copy payment reference"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Landmark className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-body font-bold text-sm">
                      Bank Account Details
                    </h2>
                    <p className="font-body text-xs text-muted-foreground">
                      Make a transfer from your bank using the details below
                    </p>
                  </div>
                </div>

                {loadingBankDetails ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : bankFields.length > 0 ? (
                  <div className="space-y-4">
                    {bankFields.map((field) => (
                      <div
                        key={field.label}
                        className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-body text-xs text-muted-foreground">
                            {field.label}
                          </p>
                          <p className="font-body text-sm font-semibold break-all">
                            {field.value}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(field.value, field.label)
                          }
                          className="flex-shrink-0 p-2 rounded-md hover:bg-muted transition-colors"
                          title={`Copy ${field.label}`}
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}

                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="font-body text-xs text-muted-foreground">
                        Amount to transfer
                      </p>
                      <p className="font-heading text-2xl font-bold text-foreground">
                        €{total.toFixed(2)}
                      </p>
                    </div>

                    {bankDetails?.paymentNote && (
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">
                        {bankDetails.paymentNote}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-body text-sm text-muted-foreground text-center py-4">
                    Bank details are not configured yet. Please contact support.
                  </p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-body text-sm text-amber-900">
                  Make sure to include reference{" "}
                  <span className="font-bold">{paymentReference}</span> when
                  making your transfer. After completing the payment at your
                  bank, click the button below to submit your order.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isSubmitting || loadingBankDetails}
                className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold py-6 rounded-full text-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                I HAVE MADE THE PAYMENT
              </Button>
            </div>
          )}

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
