import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BottomTabBar } from "@/components/ui/bottom-tab-bar";
import { setNavigationCallback } from "@/services/api";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { DataRefreshProvider } from "@/contexts/DataRefreshContext";
import { SidebarContextProvider } from "@/contexts/SidebarContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import { useEffect } from "react";

const queryClient = new QueryClient();

const NavigationSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback(navigate);
  }, [navigate]);

  return null;
};

const ConditionalBottomTabBar = () => {
  const location = useLocation();
  
  // Dashboard routes that should show the bottom tab bar
  const dashboardRoutes = ['/dashboard', '/transactions', '/categories', '/reports', '/profile'];
  
  const shouldShowTabBar = dashboardRoutes.includes(location.pathname);
  
  return shouldShowTabBar ? <BottomTabBar /> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <DataRefreshProvider>
          <SidebarContextProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <NavigationSetup />
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute>
                      <Categories />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ConditionalBottomTabBar />
            </BrowserRouter>
          </TooltipProvider>
        </SidebarContextProvider>
      </DataRefreshProvider>
    </CurrencyProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
