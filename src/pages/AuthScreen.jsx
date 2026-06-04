import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Coffee,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/AuthContext";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, isAuthenticated, isLoadingAuth } = useAuth();
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // Redirect if already authenticated
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/shop" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isLogin && form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!form.email) {
      toast.error("Please enter your email");
      return;
    }

    if (!form.password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    setErr(null);

    try {
      if (isLogin) {
        // Login
        const result = await login({
          email: form.email,
          password: form.password,
        });
        console.log("Login result:", result);
        setErr(result || null);

        if (result.success) {
          toast.success("Welcome back! 🎉");
          navigate("/shop");
        } else {
          // Handle different error types
          if (result.type === "invalid_credentials") {
            toast.error("Invalid email or password. Please try again.");
            // Clear password field for security
            setForm({ ...form, password: "" });
          } else if (result.type === "user_not_registered") {
            toast.error("Account not found. Please sign up first.");
            // Switch to sign up form after a moment
            setTimeout(() => {
              setIsLogin(false);
              setForm({ ...form, password: "", confirm_password: "" });
            }, 1500);
          } else {
            toast.error(result.message || "Login failed. Please try again.");
          }
        }
      } else {
        // Register
        if (!form.full_name) {
          toast.error("Please enter your full name");
          setIsLoading(false);
          return;
        }

        const result = await register({
          name: form.full_name,
          email: form.email,
          password: form.password,
          role: "user",
        });

        if (result.success) {
          toast.success("Account created successfully! 🎉 Please login.");
          // Reset form and switch to login
          setForm({
            full_name: "",
            email: "",
            password: "",
            confirm_password: "",
          });
          setIsLogin(true);
        } else {
          if (result.message && result.message.includes("already exists")) {
            toast.error("Email already registered. Please login instead.");
            setTimeout(() => setIsLogin(true), 1500);
          } else {
            toast.error(
              result.message || "Registration failed. Please try again.",
            );
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Back button */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
          >
            <Coffee className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="font-heading text-3xl font-black text-foreground mb-2">
            Bake<span className="text-primary">Ease</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Tab Switcher */}
            {/* <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setErr(null);
                  setForm({ ...form, password: "", confirm_password: "" });
                }}
                className={`flex-1 py-2 font-body text-sm font-semibold rounded-md transition-all ${
                  isLogin
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setErr(null);
                  setForm({ ...form, password: "", confirm_password: "" });
                }}
                className={`flex-1 py-2 font-body text-sm font-semibold rounded-md transition-all ${
                  !isLogin
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div> */}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name - Only for Sign Up */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label className="font-body text-sm text-foreground mb-2 block">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="full_name"
                        type="text"
                        placeholder="John Doe"
                        value={form.full_name}
                        onChange={handleChange}
                        className="pl-10"
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div>
                <Label className="font-body text-sm text-foreground mb-2 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label className="font-body text-sm text-foreground mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Only for Sign Up */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label className="font-body text-sm text-foreground mb-2 block">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.confirm_password}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        required={!isLogin}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!err?.success && err?.message && (
                <p className="text-red-500 text-[12px] ">{err?.message}</p>
              )}

              {/* Forgot Password Link - Only for Login */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="font-body text-xs text-primary hover:underline transition-all"
                    onClick={() => {
                      navigate("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold py-6 rounded-full text-sm transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isLogin ? "SIGNING IN..." : "CREATING ACCOUNT..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
