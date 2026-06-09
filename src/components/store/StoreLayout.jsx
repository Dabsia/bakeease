import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ShippingDate from "./ShippingDate";

export default function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
      <ShippingDate />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
