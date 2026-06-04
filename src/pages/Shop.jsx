import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/store/ProductCard";
import { Loader2 } from "lucide-react";
import { API_URL } from "../lib/api";

const categories = [
  { key: "all", label: "All" },
  { key: "classic", label: "Classic" },
  { key: "fruity", label: "Fruity" },
  { key: "chocolatey", label: "Chocolatey" },
  { key: "nutty", label: "Nutty" },
  { key: "combo", label: "Bundles" },
];

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();

  const getCategory = () =>
    new URLSearchParams(location.search).get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(getCategory);

  // Sync when URL changes (e.g. clicking nav links)
  useEffect(() => {
    setActiveCategory(getCategory());
  }, [location.search]);

  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    navigate(key === "all" ? "/shop" : `/shop?category=${key}`, {
      replace: true,
    });
  };

  // Fetch products from your API
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    },
  });

  // Extract products array from response
  const products = response?.data || [];

  // Map your API categories to the frontend categories
  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;

    // Convert category to lowercase for comparison
    return products.filter(
      (p) => p.category?.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [products, activeCategory]);

  if (error) {
    return (
      <div className="py-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500 font-body">
            Error loading products: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-black text-foreground text-center mb-10">
          {activeCategory === "all"
            ? "All Breads"
            : categories.find((c) => c.key === activeCategory)?.label}
        </h1>

        {/* Category tabs */}
        {/* <div className="flex flex-wrap justify-center gap-2 md:gap-8 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className={`font-body font-semibold text-sm md:text-base pb-2 px-1 transition-all border-b-2 ${
                activeCategory === cat.key
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div> */}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground text-lg">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
