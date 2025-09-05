import React from "react";

interface FactChipProps {
  label: string;
  value: string | number | boolean | undefined | null;
  className?: string;
}

export default function FactChip({ label, value, className = "" }: FactChipProps) {
  if (value === undefined || value === null || value === "") return null;
  const text = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <span className={`inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs text-foreground ring-1 ring-black/5 ${className}`}>
      <span className="font-medium mr-1.5 text-muted-foreground">{label}:</span>
      <span>{text}</span>
    </span>
  );
}
