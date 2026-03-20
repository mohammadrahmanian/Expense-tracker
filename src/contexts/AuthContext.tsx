import { authService } from "@/services/api";
import { AuthContextType, User } from "@/types";
import { handleApiError } from "@/lib/error-handling";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

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
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
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

      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error: any) {
      // Sentry reporting is handled at the service layer to avoid duplicates
      handleApiError(error, {
        action: "login",
        feature: "AUTH",
      }, { reportToSentry: false });
      throw error; // Re-throw for component to handle
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register(email, password, name);

      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error: any) {
      // Sentry reporting is handled at the service layer to avoid duplicates
      handleApiError(error, {
        action: "register",
        feature: "AUTH",
      }, { reportToSentry: false });
      throw error; // Re-throw for component to handle
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Sentry reporting is handled at the service layer to avoid duplicates
      handleApiError(
        error,
        {
          action: "logout",
          feature: "AUTH",
        },
        {
          showToast: false,
          reportToSentry: false,
        },
      );
    } finally {
      // Clear local state and storage regardless of API call result
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("transactions");
      localStorage.removeItem("categories");
      localStorage.removeItem("budgets");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, isInitializingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
