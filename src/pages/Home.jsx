import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import HeroSection from "../components/store/HeroSection";
import BakedFreshSection from "../components/store/BakedFreshSection";
import OurStorySection from "../components/store/OurStorySection";
import ReviewsSection from "../components/store/ReviewsSection";
import ProductCard from "../components/store/ProductCard";

export default function Home() {
  // TODO: Replace with your own product fetching logic
  const { data: products = [] } = useQuery({
    queryKey: ["products-featured"],
    queryFn: async () => {
      // Replace this with your actual API call
      // Example: return await yourApi.getProducts({ limit: 8, sort: '-created_date' });

      // For now, return empty array or mock data
      return [];
    },
  });

  const featured = products.filter((p) => p.featured);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <div>
      <HeroSection />

      {/* Featured Products */}
      {displayProducts.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-5xl font-black text-foreground">
                Our Best Sellers
              </h2>
              <p className="font-body text-muted-foreground mt-3">
                The favorites our customers can't stop ordering
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/shop"
                className="inline-block bg-foreground text-background font-body font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
              >
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>
      )}

      <BakedFreshSection />
      <ReviewsSection />
      <OurStorySection />
    </div>
  );
}
