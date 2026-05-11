import { Toaster } from "./components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "./lib/query-client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import UserNotRegisteredError from "./components/UserNotRegisteredError";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import StoreLayout from "./components/store/StoreLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProfile from "./pages/admin/AdminProfile";
import Contact from "./pages/Contact";
import OrderHistory from "./pages/OrderHistory";
import UserProfile from "./pages/UserProfile";
import AuthScreen from "./pages/AuthScreen";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Unauthenticated fallback component
const UnauthenticatedFallback = () => <Navigate to="/auth" replace />;

// Admin route wrapper component
// Admin route wrapper component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth, authChecked, user } = useAuth();

  // Wait for auth to check
  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== "admin") {
    console.log(
      "User is not admin, redirecting to /shop. User role:",
      user?.role,
    );
    return <Navigate to="/shop" replace />;
  }

  return children;
};

const AuthenticatedApp = () => {
  const { isLoadingPublicSettings, isLoadingAuth, authChecked } = useAuth();

  // Show loading while checking auth or loading settings
  if (isLoadingPublicSettings || isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        {/* Public routes - no authentication required */}
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />

        {/* Protected store routes - require authentication */}
        <Route
          element={
            <ProtectedRoute
              unauthenticatedElement={<UnauthenticatedFallback />}
            />
          }
        >
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Route>

        {/* Admin routes - require admin role */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </CartProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
