import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

const reviewKeys = [
  { name: "Sarah M.", textKey: "reviews.1.text", rating: 5 },
  { name: "James T.", textKey: "reviews.2.text", rating: 5 },
  { name: "Amara K.", textKey: "reviews.3.text", rating: 5 },
];

export default function ReviewsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-black text-foreground mb-12">
          {t("reviews.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewKeys.map((review, i) => (
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
                &ldquo;{t(review.textKey)}&rdquo;
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
