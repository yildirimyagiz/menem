"use client";

import {
  AlertTriangle, // For warning (example, if you extend variants)
  CheckCircle2, // For success
  Info, // For info (example, if you extend variants)
  X, // For dismiss
  XCircle, // For destructive/error
} from "lucide-react";

import { useToast } from "~/hooks/use-toast";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  const getIcon = (variant?: "default" | "destructive" | "success") => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "destructive":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null; // No icon for default or unknown variants
    }
  };

  const getVariantStyles = (
    variant?: "default" | "destructive" | "success",
  ) => {
    switch (variant) {
      case "success":
        return "border-green-500";
      case "destructive":
        return "border-red-500";
      default:
        return "border-gray-300"; // Default border or border-transparent
    }
  };

  const allowedVariants = ["destructive", "default", "success"] as const;

  return (
    <div className="fixed right-4 top-4 z-[9999] space-y-2">
      {toasts.map((toast) => {
  // Only allow valid variants for styling and icons
  const allowedVariants = ["destructive", "default", "success"] as const;
  const variant: "destructive" | "default" | "success" =
    allowedVariants.includes(toast.variant as any)
      ? (toast.variant as "destructive" | "default" | "success")
      : "default";
  return (
    <div
      key={typeof toast.id === "string" ? toast.id : undefined}
      className={`flex items-center rounded bg-white p-4 shadow ${getVariantStyles(variant)}`}
    >
      {getIcon(variant)}
      <div className="flex-1">
        {typeof toast.title === "string" && (
          <div className="font-semibold">{toast.title}</div>
        )}
        {typeof toast.description === "string" && (
          <div className="text-sm text-gray-700">{toast.description}</div>
        )}
        {toast.action && <div className="mt-2">{toast.action}</div>}
      </div>
      <button
        onClick={() =>
          dismiss(typeof toast.id === "string" ? toast.id : undefined)
        }
        className="ml-4 text-gray-500 hover:text-black"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
})}
    </div>
  );
}
