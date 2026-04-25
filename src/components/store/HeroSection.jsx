import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Sparkles, Leaf, Award } from "lucide-react";
import bread from "../../assets/bread.jpg";

export default function HeroSection() {
  return (
    <section className="relative bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
              <Badge className="bg-foreground/10 text-primary-foreground border-none px-3 py-1 font-body text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> Ultra-Moist
              </Badge>
              <Badge className="bg-foreground/10 text-primary-foreground border-none px-3 py-1 font-body text-xs">
                <Leaf className="w-3 h-3 mr-1" /> Real Ingredients
              </Badge>
              <Badge className="bg-foreground/10 text-primary-foreground border-none px-3 py-1 font-body text-xs">
                <Award className="w-3 h-3 mr-1" /> 100+ pieces Sold
              </Badge>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6"
            >
              GO BANANAS
              <br />
              FOR OUR BREADS!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-body text-primary-foreground/80 mb-8 text-base md:text-lg max-w-md mx-auto md:mx-0"
            >
              Freshly baked, right to your door. Artisan banana bread made with
              real ingredients and love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-4 justify-center md:justify-start"
            >
              <Link
                to="/shop?category=combo"
                className="bg-foreground text-background font-body font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
              >
                SHOP BUNDLES
              </Link>
              <Link
                to="/shop"
                className="bg-background text-foreground font-body font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
              >
                SHOP ALL
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src={bread}
              alt="Fresh banana bread"
              className="rounded-2xl shadow-2xl max-w-sm w-full object-cover"
            />
          </div>
        </div>
      </div>
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-foreground/5 hidden md:block" />
      <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-foreground/5 hidden md:block" />
    </section>
  );
}
