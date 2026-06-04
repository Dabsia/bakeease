import React from "react";
import { Check, ShieldCheck, Leaf } from "lucide-react";
import banana2 from "../../assets/bread3.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useLanguage } from "../../context/LanguageContext";

export default function BakedFreshSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-secondary py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="font-heading text-3xl md:text-5xl font-black text-foreground mb-4">
            {t("bakedFresh.title1")}
            <br />
            {t("bakedFresh.title2")}
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-md">
            {t("bakedFresh.subtitle")}
          </p>

          <Accordion type="single" collapsible className="max-w-md">
            <AccordionItem value="fresh">
              <AccordionTrigger className="font-body font-semibold text-base">
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" /> {t("bakedFresh.accord1.title")}
                </span>
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                {t("bakedFresh.accord1.body")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sweet">
              <AccordionTrigger className="font-body font-semibold text-base">
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" /> {t("bakedFresh.accord2.title")}
                </span>
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                {t("bakedFresh.accord2.body")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cravings">
              <AccordionTrigger className="font-body font-semibold text-base">
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" /> {t("bakedFresh.accord3.title")}
                </span>
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                {t("bakedFresh.accord3.body")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-3 mt-8">
            <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3 bg-background">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <span className="font-body text-xs font-medium">
                {t("bakedFresh.noArtificial")}
                <br />
                {t("bakedFresh.flavoring")}
              </span>
            </div>
            <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3 bg-background">
              <Leaf className="w-5 h-5 text-muted-foreground" />
              <span className="font-body text-xs font-medium">
                {t("bakedFresh.madeWith")}
                <br />
                {t("bakedFresh.realIngredients")}
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
