import React from "react";
import { AuthRedirect } from "@/components/AuthRedirect";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <AuthRedirect requireAuth={true} redirectTo="/login">
      {children}
    </AuthRedirect>
  );
};
