import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../components/store/ProductCard";

export default function ProductDetail() {
  const productId = window.location.pathname.split("/product/")[1];
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // TODO: Replace with your own product fetching logic
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      // Replace this with your actual API call
      // Example: return await yourApi.getProduct(productId);

      // For now, return null
      return null;
    },
    enabled: !!productId,
  });

  // TODO: Replace with your own related products fetching logic
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      // Replace this with your actual API call
      // Example: const all = await yourApi.getProducts({ category: product.category });
      // return all.filter((p) => p.id !== productId).slice(0, 4);

      return [];
    },
    enabled: !!product?.category,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="font-body text-lg text-muted-foreground">
          Product not found.
        </p>
        <Link
          to="/shop"
          className="font-body text-primary hover:underline mt-2 inline-block"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body">
                No Image
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {product.category}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-black text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              {product.original_price &&
              product.original_price > product.price ? (
                <>
                  <span className="font-body text-xl text-muted-foreground line-through">
                    €{product.original_price.toFixed(2)}
                  </span>
                  <span className="font-body text-2xl font-bold text-red-500">
                    €{product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-body text-2xl font-bold text-foreground">
                  €{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {product.combo_items && product.combo_items.length > 0 && (
              <div className="mb-6">
                <h3 className="font-body font-semibold text-sm mb-2">
                  Includes:
                </h3>
                <ul className="space-y-1">
                  {product.combo_items.map((item, i) => (
                    <li
                      key={i}
                      className="font-body text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.ingredients && (
              <div className="mb-6">
                <h3 className="font-body font-semibold text-sm mb-2">
                  Ingredients:
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-body font-semibold text-sm min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-foreground text-background hover:opacity-90 font-body font-semibold py-6 rounded-full"
                disabled={!product.in_stock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.in_stock ? "ADD TO CART" : "OUT OF STOCK"}
              </Button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
