import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../ui/button";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { itemCount } = useCart();
  const { t } = useLanguage();

  const navLinks = [
    { labelKey: "nav.allBreads", path: "/shop" },
    { labelKey: "nav.contact", path: "/contact" },
  ];
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("auth_token") !== null;

  const handleNavClick = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          className="font-heading text-xl font-black text-foreground tracking-tight"
        >
          {t("nav.brand")}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t(link.labelKey)}
            </button>
          ))}
          {isLoggedIn && <button
              key="admin"
              onClick={() => handleNavClick("/admin")}
              className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.adminDashboard")}
            </button>}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector className="hidden md:flex" />
          {/* User profile icon */}
          {/* <Link
            to={isLoggedIn ? "/profile" : "/auth"}
            className="hidden sm:block"
            title="My Profile"
          >
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="w-5 h-5" />
            </Button>
          </Link> */}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-body font-bold leading-none">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className="block w-full text-left py-3 font-body font-medium text-sm text-foreground border-b border-border last:border-none"
            >
              {t(link.labelKey)}
            </button>
          ))}
          <div className="py-3 border-b border-border">
            <LanguageSelector />
          </div>
          {isLoggedIn && (
            <button
              onClick={() => handleNavClick("/admin")}
              className="block w-full text-left py-3 font-body font-medium text-sm text-muted-foreground"
            >
              {t("nav.adminDashboard")}
            </button>
          
          )}
        </div>
      )}
    </header>
  );
}
