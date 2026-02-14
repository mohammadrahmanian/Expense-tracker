import React, { createContext, useContext, useState, ReactNode } from "react";

export type Currency = "USD" | "EUR";

export interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    // Get currency from localStorage or default to USD
    try {
      const savedCurrency = localStorage.getItem("currency") as Currency;
      return savedCurrency || "USD";
    } catch (error) {
      // Fallback to USD if localStorage is unavailable (e.g., private browsing)
      return "USD";
    }
  });

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem("currency", newCurrency);
    } catch (error) {
      // Silently fail if localStorage is unavailable (e.g., private browsing)
      // The currency state is still updated in memory
    }
  };

  const value = {
    currency,
    setCurrency: handleSetCurrency,
    formatAmount,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
