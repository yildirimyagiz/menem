"use client";

import { useState } from "react";
import {
  Badge,
  Building,
  Calendar,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Home as HomeIcon,
  MessageCircle,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Progress } from "@acme/ui/progress";

import { useCurrency } from "~/context/CurrencyContext";
import { useLanguage } from "~/context/LanguageContext";
import { useAuth } from "~/hooks/use-auth";
import Button from "../../../../shared/Button";
import AddPropertyForm from "./AddPropertyForm";

export default function ClientHomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [showAddProperty, setShowAddProperty] = useState(false);

  // Add Property Button logic
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => setShowAddProperty((v) => !v)}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 24px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
          }}
        >
          {showAddProperty ? "Hide Add Property Form" : "Add New Property"}
        </button>
      </div>
      {showAddProperty && (
        <div style={{ marginBottom: 32 }}>
          <AddPropertyForm />
        </div>
      )}
      {/* Existing dashboard content below */}
    </div>
  );
}
