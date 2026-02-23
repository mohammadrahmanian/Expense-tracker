import ErrorBoundary, { PageErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SidebarContextProvider } from "@/contexts/SidebarContext";
import { setNavigationCallback } from "@/services/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Categories from "./pages/Categories";
import { Dashboard } from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import More from "./pages/More";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import RecurringTransactions from "./pages/RecurringTransactions";
import Register from "./pages/Register";
import { Reports } from "./pages/Reports";
import { Transactions } from "./pages/Transactions";

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
    <PageErrorBoundary name={name} onGoHome={() => navigate("/dashboard")}>
      {children}
    </PageErrorBoundary>
  );
};

type RouteConfig = {
  path: string;
  element: ReactNode;
  protected?: boolean;
  boundaryName?: string;
};

const routes: RouteConfig[] = [
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard />, protected: true, boundaryName: "DashboardPage" },
  { path: "/transactions", element: <Transactions />, protected: true, boundaryName: "TransactionsPage" },
  { path: "/categories", element: <Categories />, protected: true, boundaryName: "CategoriesPage" },
  { path: "/recurring-transactions", element: <RecurringTransactions />, protected: true, boundaryName: "RecurringTransactionsPage" },
  { path: "/reports", element: <Reports />, protected: true, boundaryName: "ReportsPage" },
  { path: "/profile", element: <Profile />, protected: true, boundaryName: "ProfilePage" },
  { path: "/more", element: <More />, protected: true, boundaryName: "MorePage" },
  { path: "*", element: <NotFound /> },
];

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
                  {routes.map(({ path, element, protected: isProtected, boundaryName }) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        isProtected ? (
                          <ProtectedRoute>
                            <PageBoundary name={boundaryName!}>
                              {element}
                            </PageBoundary>
                          </ProtectedRoute>
                        ) : (
                          element
                        )
                      }
                    />
                  ))}
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
