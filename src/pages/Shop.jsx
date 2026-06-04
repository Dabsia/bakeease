import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/store/ProductCard";
import { Loader2 } from "lucide-react";
import { API_URL } from "../lib/api";
import { useLanguage } from "../context/LanguageContext";

const categoryKeys = [
  { key: "all", labelKey: "shop.category.all" },
  { key: "classic", labelKey: "shop.category.classic" },
  { key: "fruity", labelKey: "shop.category.fruity" },
  { key: "chocolatey", labelKey: "shop.category.chocolatey" },
  { key: "nutty", labelKey: "shop.category.nutty" },
  { key: "combo", labelKey: "shop.category.combo" },
];

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getCategory = () =>
    new URLSearchParams(location.search).get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(getCategory);

  useEffect(() => {
    setActiveCategory(getCategory());
  }, [location.search]);

  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    navigate(key === "all" ? "/shop" : `/shop?category=${key}`, {
      replace: true,
    });
  };

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

  const products = response?.data || [];

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;

    return products.filter(
      (p) => p.category?.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [products, activeCategory]);

  const pageTitle =
    activeCategory === "all"
      ? t("shop.allBreads")
      : t(categoryKeys.find((c) => c.key === activeCategory)?.labelKey ?? "shop.allBreads");

  if (error) {
    return (
      <div className="py-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500 font-body">
            {t("shop.errorLoading")} {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-black text-foreground text-center mb-10">
          {pageTitle}
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground text-lg">
              {t("shop.noProducts")}
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
