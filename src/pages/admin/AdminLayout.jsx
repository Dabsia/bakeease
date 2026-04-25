import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  LayoutDashboard,
  ArrowLeft,
  UserCircle,
} from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { path: "/admin/profile", label: "Profile", icon: UserCircle },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted">
      {/* Admin header */}
      <header className="bg-foreground text-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-background/60 hover:text-background transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-heading text-lg font-bold">GourmetTwist Admin</h1>
        </div>
        <Link
          to="/"
          className="font-body text-xs text-background/60 hover:text-background transition-colors"
        >
          View Store →
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-background border-r border-border min-h-[calc(100vh-52px)] hidden md:block p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                    isActive
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 font-body text-xs transition-colors ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
