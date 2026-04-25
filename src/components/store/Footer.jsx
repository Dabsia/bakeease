import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import PolicyModals from "./PolicyModals";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  const [openPolicy, setOpenPolicy] = useState(null);

  return (
    <footer>
      {/* CTA Section */}
      <div className="bg-primary py-16 px-4 text-center">
        <h2 className="font-heading text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
          There's intention behind every loaf.
        </h2>
        <p className="font-body text-primary-foreground/80 max-w-xl mx-auto mb-8 text-sm md:text-base">
          We've tested, refined, and perfected our recipes and baking process to
          ensure every bread delivers the same fresh-baked taste, texture, and
          comfort every time.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-foreground text-background font-body font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity tracking-wide text-sm"
        >
          DISCOVER OUR BREADS
        </Link>
      </div>

      {/* Footer links */}
      <div className="bg-foreground text-background py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">
              GourmetTwist
            </h3>
            <p className="font-body text-sm text-background/60 mb-5">
              Freshly baked joy, straight to your door.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/tiara_breadhub/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full  flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              >
                {/* <FaInstagram className="w-4 h-4" /> */}
                <FaInstagram className="w-4 h-4 text-purple-500" />
                {/* <Instagram className="w-4 h-4" /> */}
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full  flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              >
                {/* <Facebook className="w-4 h-4" /> */}{" "}
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
            <h4 className="font-body font-bold text-sm mb-4">Quick Links</h4>
            <div className="space-y-2 font-body text-sm text-background/60">
              <Link
                to="/shop"
                className="block hover:text-background transition-colors"
              >
                All Breads
              </Link>
              <Link
                to="/orders"
                className="block hover:text-background transition-colors"
              >
                Orders
              </Link>
              <Link
                to="/contact"
                className="block hover:text-background transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-body font-bold text-sm mb-4">Policies</h4>
            <div className="space-y-2 font-body text-sm text-background/60">
              <button
                onClick={() => setOpenPolicy("refund")}
                className="block hover:text-background transition-colors text-left"
              >
                Refund Policy
              </button>
              <button
                onClick={() => setOpenPolicy("privacy")}
                className="block hover:text-background transition-colors text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setOpenPolicy("terms")}
                className="block hover:text-background transition-colors text-left"
              >
                Terms of Service
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-body font-bold text-sm mb-4">Contact</h4>
            <div className="space-y-3 font-body text-sm text-background/60">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@gourmettwist.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-background/10 text-center font-body text-xs text-background/40">
          © 2026 GourmetTwist. All rights reserved.
        </div>
      </div>

      <PolicyModals open={openPolicy} onClose={() => setOpenPolicy(null)} />
    </footer>
  );
}
