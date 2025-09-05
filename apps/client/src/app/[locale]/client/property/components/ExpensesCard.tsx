"use client";

import { useTranslations } from "next-intl";
import type { Currency } from "~/utils/interfaces";

interface ExpenseLike {
  name?: string;
  description?: string;
  amount?: number;
  currency?: string | Currency;
  dueDate?: string | null;
  paidDate?: string | null;
  status?: string;
}

function formatMoney(v?: number, c?: string) {
  if (typeof v !== "number") return "";
  try {
    return v.toLocaleString(undefined, { style: "currency", currency: c ?? "USD" });
  } catch {
    return `${v.toFixed(2)} ${c ?? ""}`.trim();
  }
}

export default function ExpensesCard({ expenses }: { expenses?: ExpenseLike[] | null }) {
  const t = useTranslations("ClientPropertyDetail");
  const list = Array.isArray(expenses) ? expenses.filter(Boolean) : [];
  if (list.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-foreground">{t("expenses.title", { default: "Expenses" })}</h3>
      <ul className="divide-y">
        {list.slice(0, 8).map((e, i) => (
          <li key={i} className="flex items-start justify-between gap-3 py-2">
            <div className="min-w-0">
              <div className="truncate text-sm text-foreground">{e.name ?? e.description ?? t("expenses.untitled", { default: "Expense" })}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {e.status && <span className="rounded bg-gray-100 px-1.5 py-0.5">{e.status}</span>}
                {e.dueDate && (
                  <span>
                    {t("expenses.due", { default: "Due" })}: {new Date(e.dueDate).toLocaleDateString()}
                  </span>
                )}
                {e.paidDate && (
                  <span>
                    {t("expenses.paid", { default: "Paid" })}: {new Date(e.paidDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground">{formatMoney(e.amount, typeof e.currency === "string" ? e.currency : e.currency?.code)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
