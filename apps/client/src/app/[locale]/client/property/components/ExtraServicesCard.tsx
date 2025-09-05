"use client";

import { useTranslations } from "next-intl";

interface ExtraChargeLike {
  name?: string;
  description?: string;
  icon?: string;
  amount?: number;
  currency?: string;
}

export default function ExtraServicesCard({ items }: { items?: ExtraChargeLike[] | null }) {
  const t = useTranslations("ClientPropertyDetail");
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  if (list.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-foreground">{t("extraServices.title", { default: "Extra services" })}</h3>
      <ul className="space-y-2">
        {list.slice(0, 12).map((s, i) => (
          <li key={i} className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              {s.icon && <span className="mt-0.5 text-sm">{s.icon}</span>}
              <div>
                <div className="text-sm text-foreground">{s.name ?? ""}</div>
                {s.description && <div className="text-xs text-muted-foreground">{s.description}</div>}
              </div>
            </div>
            {typeof s.amount === "number" && (
              <div className="text-xs text-muted-foreground">
                {s.amount.toLocaleString(undefined, { style: "currency", currency: s.currency ?? "USD" })}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
