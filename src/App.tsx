import { AppRoutes, NavigationSetup } from "@/components/AppRoutes";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { SidebarContextProvider } from "@/contexts/SidebarContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <SidebarContextProvider>
          <Toaster />
          <BrowserRouter>
            <NavigationSetup />
            <ErrorBoundary name="AppShell" variant="app">
              <AppRoutes />
            </ErrorBoundary>
          </BrowserRouter>
        </SidebarContextProvider>
      </CurrencyProvider>
      {/* React Query DevTools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
