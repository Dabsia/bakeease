import React from "react";
import { motion } from "framer-motion";
import bread3 from "../../assets/bread2.jpg";

const milestones = [
  {
    title: "Where It All Began",
    text: "Inspired by home, culture, and baking traditions rooted in craftsmanship.",
  },
  {
    title: "A Taste of Home",
    text: "Focused on creating banana bread that feels warm, familiar, and personal.",
  },
  {
    title: "Bringing the Craft to You",
    text: "Grown organically through word of mouth and repeat customers.",
  },
  {
    title: "Built on Trust & Consistency",
    text: "Over 100+ loaves baked with the same passion and quality.",
  },
];

export default function OurStorySection() {
  return (
    <section className="bg-secondary py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 flex justify-center">
          <img
            src={bread3}
            alt="Stacked banana bread slices"
            className="rounded-2xl shadow-xl max-w-sm w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-3xl md:text-5xl font-black text-foreground mb-4">
            Our Story
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-md">
            GourmetTwist began with a simple idea: create banana bread that
            actually tastes homemade, soft, moist, and full of real flavor.
          </p>
          <div className="space-y-6 border-l-2 border-primary pl-6">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-primary" />
                <h4 className="font-heading text-lg font-bold text-foreground">
                  {m.title}
                </h4>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {m.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
