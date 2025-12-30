import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthContext } from '@/contexts/AuthContext';
import { type AuthContextType } from '@/types';
import { CurrencyContext, type CurrencyContextType } from '@/contexts/CurrencyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock user data for testing
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
};

// Mock auth context value
export const mockAuthContext: AuthContextType = {
  user: mockUser,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
  isInitializingAuth: false,
};

// Mock currency context value
export const mockCurrencyContext: CurrencyContextType = {
  currency: 'USD',
  setCurrency: vi.fn(),
  formatAmount: vi.fn((amount: number) => `$${amount.toFixed(2)}`),
};

// Custom render function with all providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authContext?: Partial<AuthContextType>;
  currencyContext?: Partial<CurrencyContextType>;
  initialEntries?: string[];
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    authContext = {},
    currencyContext = {},
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const authValue = { ...mockAuthContext, ...authContext };
  const currencyValue = { ...mockCurrencyContext, ...currencyContext };

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthContext.Provider value={authValue}>
            <CurrencyContext.Provider value={currencyValue}>
              {children}
            </CurrencyContext.Provider>
          </AuthContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

// Helper to render components with router only
export const renderWithRouter = (
  ui: ReactElement
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper });
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';