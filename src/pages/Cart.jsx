import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="py-32 text-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
          {t("cart.emptyTitle")}
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          {t("cart.emptySubtitle")}
        </p>
        <Link
          to="/shop"
          className="inline-block bg-foreground text-background font-body font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
        >
          {t("cart.shopNow")}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("cart.continueShopping")}
        </Link>

        <h1 className="font-heading text-3xl font-black text-foreground mb-8">
          {t("cart.title")}
        </h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
            >
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-body">
                    {t("cart.noImage")}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-body font-semibold text-sm text-foreground">
                    {item.product_name}
                  </h3>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="font-body text-sm text-muted-foreground">
                  €{item.price.toFixed(2)}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center border  border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                      className="px-2 py-1 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 font-body text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                      className="px-2 py-1 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-body font-semibold text-sm">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-body text-muted-foreground">{t("cart.subtotal")}</span>
            <span className="font-body font-semibold">€{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-body text-muted-foreground">{t("cart.shipping")}</span>
            <span className="font-body text-sm text-muted-foreground">
              {t("cart.shippingNote")}
            </span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center mb-6">
            <span className="font-body font-bold text-lg">{t("cart.total")}</span>
            <span className="font-body font-bold text-lg">
              €{total.toFixed(2)}
            </span>
          </div>
          <Link to="/checkout">
            <Button className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold py-6 rounded-full text-sm">
              {t("cart.checkout")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
