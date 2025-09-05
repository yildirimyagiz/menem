"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "JPY"
  | "CNY"
  | "INR";

interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatCurrency: (amount: number) => string;
  currentCurrency: CurrencyInfo;
  currencies: readonly CurrencyInfo[];
}

// Define currency data with symbols
const currencyData = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
] as const satisfies readonly CurrencyInfo[];

const defaultContext: CurrencyContextType = {
  currency: "USD",
  setCurrency: () => console.warn("CurrencyContext not initialized"),
  formatCurrency: () => "",
  currentCurrency: currencyData[0],
  currencies: currencyData,
};

const CurrencyContext = createContext<CurrencyContextType>(defaultContext);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  // Get current currency info
  const getCurrentCurrencyInfo = (code: CurrencyCode): CurrencyInfo => {
    return currencyData.find((c) => c.code === code) ?? currencyData[0];
  };

  // Currency formatting options
  const currencyOptions: Record<CurrencyCode, Intl.NumberFormatOptions> = {
    USD: { style: "currency", currency: "USD" },
    EUR: { style: "currency", currency: "EUR" },
    GBP: { style: "currency", currency: "GBP" },
    CAD: { style: "currency", currency: "CAD" },
    AUD: { style: "currency", currency: "AUD" },
    JPY: { style: "currency", currency: "JPY", minimumFractionDigits: 0 },
    CNY: { style: "currency", currency: "CNY" },
    INR: { style: "currency", currency: "INR" },
  };

  // Format currency function
  const formatCurrency = (amount: number): string => {
    if (typeof window === "undefined") {
      return `${amount}`;
    }

    try {
      return new Intl.NumberFormat("en-US", currencyOptions[currency]).format(
        amount,
      );
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `${amount}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatCurrency,
        currentCurrency: getCurrentCurrencyInfo(currency),
        currencies: currencyData,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
