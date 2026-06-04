import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import PolicyModals from "./PolicyModals";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const [openPolicy, setOpenPolicy] = useState(null);
  const { t } = useLanguage();

  return (
    <footer>
      <div className="bg-primary py-16 px-4 text-center">
        <h2 className="font-heading text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
          {t("footer.ctaTitle")}
        </h2>
        <p className="font-body text-primary-foreground/80 max-w-xl mx-auto mb-8 text-sm md:text-base">
          {t("footer.ctaBody")}
        </p>
        <Link
          to="/shop"
          className="inline-block bg-foreground text-background font-body font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity tracking-wide text-sm"
        >
          {t("footer.discover")}
        </Link>
      </div>

      <div className="bg-foreground text-background py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">
              {t("nav.brand")}
            </h3>
            <p className="font-body text-sm text-background/60 mb-5">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/tiara_breadhub/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full  flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              >
                <FaInstagram className="w-4 h-4 text-purple-500" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61557920194244"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full  flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              >
                <FaFacebook className="w-4 h-4 text-[#1877F2]" />
              </a>
              <a
                href="https://www.tiktok.com/@tiarasbreadhub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full  flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              >
                <FaTiktok className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-body font-bold text-sm mb-4">{t("footer.quickLinks")}</h4>
            <div className="space-y-2 font-body text-sm text-background/60">
              <Link
                to="/shop"
                className="block hover:text-background transition-colors"
              >
                {t("nav.allBreads")}
              </Link>
              <Link
                to="/contact"
                className="block hover:text-background transition-colors"
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-body font-bold text-sm mb-4">{t("footer.policies")}</h4>
            <div className="space-y-2 font-body text-sm text-background/60">
              <button
                onClick={() => setOpenPolicy("refund")}
                className="block hover:text-background transition-colors text-left"
              >
                {t("footer.refundPolicy")}
              </button>
              <button
                onClick={() => setOpenPolicy("privacy")}
                className="block hover:text-background transition-colors text-left"
              >
                {t("footer.privacyPolicy")}
              </button>
              <button
                onClick={() => setOpenPolicy("terms")}
                className="block hover:text-background transition-colors text-left"
              >
                {t("footer.termsOfService")}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-body font-bold text-sm mb-4">{t("footer.contact")}</h4>
            <div className="space-y-3 font-body text-sm text-background/60">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>tiarasbeadhub@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+372 5379 0302</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-background/10 text-center font-body text-xs text-background/40">
          {t("footer.copyright")}
        </div>
      </div>

      <PolicyModals open={openPolicy} onClose={() => setOpenPolicy(null)} />
    </footer>
  );
}
