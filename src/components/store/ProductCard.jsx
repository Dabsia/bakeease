import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
          {product.image_url && !imgError ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-amber-50">
              🍞
            </div>
          )}
        </div>
        <h3 className="font-body font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.original_price && product.original_price > product.price ? (
            <>
              <span className="font-body text-sm text-muted-foreground line-through">
                €{product.original_price.toFixed(2)}
              </span>
              <span className="font-body text-sm font-bold text-red-500">
                €{product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-body text-sm font-semibold text-foreground">
              €{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
