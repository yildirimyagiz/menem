"use client";

import { createContext, useContext } from "react";
import { useTranslations } from "next-intl";

interface FilterTranslationContextType {
  t: (key: string) => string;
}

const FilterTranslationContext =
  createContext<FilterTranslationContextType | null>(null);

export const useFilterTranslation = () => {
  const context = useContext(FilterTranslationContext);
  if (!context) {
    throw new Error(
      "useFilterTranslation must be used within a FilterTranslationProvider",
    );
  }
  return context;
};

interface FilterTranslationProviderProps {
  children: React.ReactNode;
}

const FilterTranslationProvider: React.FC<FilterTranslationProviderProps> = ({
  children,
}) => {
  const t = useTranslations();

  return (
    <FilterTranslationContext.Provider value={{ t }}>
      {children}
    </FilterTranslationContext.Provider>
  );
};

export default FilterTranslationProvider;
