import { authService } from "@/services/api";
import { AuthContextType, User } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializingAuth, setIsInitializingAuth] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuthStatus = async () => {
      // Check if we have a legacy localStorage token that needs migration
      const hasLegacyToken = !!localStorage.getItem("authToken");

      try {
        // Always attempt to get current user
        // This will work if:
        // 1. httpOnly cookie exists (new method) - automatically sent by browser
        // 2. localStorage token exists (legacy method) - sent via axios interceptor
        const userData = await authService.getCurrentUser();
        setUser(userData);

        // Migration: If authentication succeeded and we had a localStorage token,
        // remove it since the backend has now set an httpOnly cookie
        if (hasLegacyToken) {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        // Authentication failed - no valid cookie or localStorage token
        // Clean up localStorage in case it has an invalid token
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setIsInitializingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);

      // Store user data
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Migration: Remove legacy token if it exists
      // Backend has set httpOnly cookie, so localStorage token is no longer needed
      localStorage.removeItem("authToken");
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register(email, password, name);

      // Store user data
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Migration: Remove legacy token if it exists
      // Backend has set httpOnly cookie, so localStorage token is no longer needed
      localStorage.removeItem("authToken");
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state and storage regardless of API call result
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("transactions");
      localStorage.removeItem("categories");
      localStorage.removeItem("budgets");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isInitializingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
