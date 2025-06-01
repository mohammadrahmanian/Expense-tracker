import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate login
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate registration
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("transactions");
    localStorage.removeItem("categories");
    localStorage.removeItem("budgets");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
