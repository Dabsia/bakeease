import React from "react";
import { Link } from "react-router-dom";
import { Check, Plus, ShieldCheck, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import banana2 from "../../assets/bread3.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function BakedFreshSection() {
  return (
    <section className="bg-secondary py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="font-heading text-3xl md:text-5xl font-black text-foreground mb-4">
            Baked Fresh.
            <br />
            Loved Daily.
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-md">
            Fresh-baked banana bread made to be enjoyed anytime, every day.
          </p>

          <Accordion type="single" collapsible className="max-w-md">
            <AccordionItem value="fresh">
              <AccordionTrigger className="font-body font-semibold text-base">
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" /> Fresh-Baked Flavor
                </span>
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                Every loaf is baked to order, ensuring maximum freshness and
                flavor in every bite.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sweet">
              <AccordionTrigger className="font-body font-semibold text-base">
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" /> Perfectly Balanced
                  Sweetness
                </span>
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                We use just the right amount of natural sweeteners for a taste
                that's indulgent but not overwhelming.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cravings">
              <AccordionTrigger className="font-body font-semibold text-base">
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" /> Made for Repeat
                  Cravings
                </span>
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                Our customers come back again and again. Once you try it, you'll
                understand why.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-3 mt-8">
            <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3 bg-background">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <span className="font-body text-xs font-medium">
                No Artificial
                <br />
                Flavoring
              </span>
            </div>
            <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3 bg-background">
              <Leaf className="w-5 h-5 text-muted-foreground" />
              <span className="font-body text-xs font-medium">
                Made With
                <br />
                Real Ingredients
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={banana2}
            alt="Chocolate banana bread"
            className="rounded-2xl shadow-xl max-w-sm w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
