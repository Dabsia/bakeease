import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import UserNotRegisteredError from "./UserNotRegisteredError";

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({
  fallback = <DefaultFallback />,
  unauthenticatedElement,
}) {
  const {
    isAuthenticated,
    isLoadingAuth,
    authChecked,
    authError,
    checkUserAuth,
  } = useAuth();

  // useEffect(() => {
  //   // Only check if not already checked and not loading
  //   if (!authChecked && !isLoadingAuth) {
  //     checkUserAuth();
  //   }
  // }, [authChecked, isLoadingAuth, checkUserAuth]);

  // Show loading spinner while checking authentication
  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  // After auth check is complete, handle errors
  // if (authError) {
  //   if (authError.type === "user_not_registered") {
  //     return <UserNotRegisteredError />;
  //   }
  //   return unauthenticatedElement;
  // }

  // After auth check is complete, redirect if not authenticated
  // if (!isAuthenticated) {
  //   return unauthenticatedElement;
  // }

  // User is authenticated, render the protected content
  return <Outlet />;
}
