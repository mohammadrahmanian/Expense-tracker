import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({
  children,
  redirectTo = "/dashboard",
  requireAuth = false,
}) => {
  const { user, isInitializingAuth } = useAuth();

  // Show loading spinner while checking authentication status
  if (isInitializingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If requireAuth is true and user is not authenticated, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // If requireAuth is false (auth pages) and user is authenticated, redirect to dashboard
  if (!requireAuth && user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if conditions are met
  return <>{children}</>;
};