import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Sarah M.",
    text: "Absolutely the best banana bread I've ever had! Moist, flavorful, and arrived fresh. Will order again!",
    rating: 5,
  },
  {
    name: "James T.",
    text: "The chocolate combo was incredible. My whole family loved it. Perfect gift idea too!",
    rating: 5,
  },
  {
    name: "Amara K.",
    text: "You can taste the quality ingredients. This isn't your average banana bread — it's next level.",
    rating: 5,
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-black text-foreground mb-12">
          The Reviews Are In
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-left"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
                "{review.text}"
              </p>
              <p className="font-body text-sm font-semibold text-foreground">
                {review.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
