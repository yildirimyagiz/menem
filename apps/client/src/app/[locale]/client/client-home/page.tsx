"use client";

import { useTranslations } from 'next-intl';
import { useState } from "react";

import { Button } from "@reservatior/ui/button";

import { useCurrency } from "~/context/CurrencyContext";
import { useAuth } from "~/hooks/use-auth";
import AddPropertyForm from "./AddPropertyForm";

export default function ClientHomePage() {
  const { user } = useAuth();
  const t = useTranslations('clientHome');
  const { formatCurrency } = useCurrency();
  const [showAddProperty, setShowAddProperty] = useState(false);

  // Add Property Button logic
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => setShowAddProperty((v) => !v)}
          variant="default"
          size="lg"
          className="px-8 py-3 text-lg font-semibold shadow-md"
        >
          {showAddProperty ? t('addProperty.hideForm') : t('addProperty.showForm')}
        </Button>
      </div>
      {showAddProperty && (
        <div className="mb-8">
          <AddPropertyForm />
        </div>
      )}
      {/* Existing dashboard content below */}
    </div>
  );
}
