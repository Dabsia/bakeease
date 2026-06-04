import React from "react";
import { motion } from "framer-motion";
import bread3 from "../../assets/bread2.jpg";
import { useLanguage } from "../../context/LanguageContext";

const milestoneKeys = [
  { titleKey: "story.m1.title", textKey: "story.m1.text" },
  { titleKey: "story.m2.title", textKey: "story.m2.text" },
  { titleKey: "story.m3.title", textKey: "story.m3.text" },
  { titleKey: "story.m4.title", textKey: "story.m4.text" },
];

export default function OurStorySection() {
  const { t } = useLanguage();

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
            {t("story.title")}
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-md">
            {t("story.intro")}
          </p>
          <div className="space-y-6 border-l-2 border-primary pl-6">
            {milestoneKeys.map((m, i) => (
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
                  {t(m.titleKey)}
                </h4>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {t(m.textKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
