import { ProtectedRoute } from "@/components/ProtectedRoute";
import ErrorBoundary, { PageErrorBoundary } from "@/components/ErrorBoundary";
import { setNavigationCallback } from "@/services/api";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SidebarContextProvider } from "@/contexts/SidebarContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import More from "./pages/More";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import RecurringTransactions from "./pages/RecurringTransactions";
import { useEffect } from "react";

// Configure React Query with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache retention (formerly cacheTime)
      refetchOnWindowFocus: false, // Prevent excessive refetching
      refetchOnReconnect: true, // Refetch on network reconnect
      retry: 2, // Retry failed requests twice
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

const NavigationSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback(navigate);
  }, [navigate]);

  return null;
};

const PageBoundary: React.FC<{ name: string; children: React.ReactNode }> = ({
  name,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <PageErrorBoundary name={name} onGoHome={() => navigate("/dashboard")}
    >
      {children}
    </PageErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <SidebarContextProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <NavigationSetup />
              <ErrorBoundary name="AppShell" variant="app">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <PageBoundary name="DashboardPage">
                          <Dashboard />
                        </PageBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <ProtectedRoute>
                        <PageBoundary name="TransactionsPage">
                          <Transactions />
                        </PageBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/categories"
                    element={
                      <ProtectedRoute>
                        <PageBoundary name="CategoriesPage">
                          <Categories />
                        </PageBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/recurring-transactions"
                    element={
                      <ProtectedRoute>
                        <PageBoundary name="RecurringTransactionsPage">
                          <RecurringTransactions />
                        </PageBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <PageBoundary name="ReportsPage">
                          <Reports />
                        </PageBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <PageBoundary name="ProfilePage">
                          <Profile />
                        </PageBoundary>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/more"
                    element={
                      <ProtectedRoute>
                        <PageBoundary name="MorePage">
                          <More />
                        </PageBoundary>
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </SidebarContextProvider>
      </CurrencyProvider>
      {/* React Query DevTools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
