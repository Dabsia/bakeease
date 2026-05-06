// lib/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
const API_URL = "http://localhost:3000/api/v1";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkUserAuth();
    checkAppState();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const token = localStorage.getItem("auth_token");

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      const data = await response.json();

      if (response.ok && data.data) {
        setUser(data.data);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        // Token invalid or expired
        localStorage.removeItem("auth_token");
        setUser(null);
        setIsAuthenticated(false);

        // Check if user not registered error
        if (data.type === "user_not_registered") {
          setAuthError({ type: "user_not_registered", message: data.message });
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError({ type: "network_error", message: error.message });
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAppPublicSettings(null);
    } catch (error) {
      console.error("Error fetching app state:", error);
    } finally {
      setIsLoadingPublicSettings(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error messages from backend
        if (data.message === "Incorrect email or password") {
          throw {
            type: "invalid_credentials",
            message: "Invalid email or password. Please try again.",
          };
        } else if (data.message === "User not found") {
          throw {
            type: "user_not_registered",
            message: "Account not found. Please sign up first.",
          };
        } else {
          throw {
            type: "unknown",
            message: data.message || "Login failed",
          };
        }
      }

      // Store token and user data
      localStorage.setItem("auth_token", data.data.token);
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
      setIsAuthenticated(true);
      setAuthError(null);

      console.log("Login successful:", data.data);

      return { success: true, user: data.data };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message,
        type: error.type,
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle registration errors
        if (data.message && data.message.includes("email already exists")) {
          throw new Error("Email already registered. Please login instead.");
        }
        throw new Error(data.message || "Registration failed");
      }

      return { success: true, user: data.data };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = async (shouldRedirect = true) => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authChecked,
        authError,
        appPublicSettings,
        login,
        register,
        logout,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
