"use client";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Textarea } from "@reservatior/ui/textarea";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface SidebarProperty {
  price?: number;
  currency?: string;
}

export default function ForRentSidebar({ property, locale: _locale }: { property: SidebarProperty; locale?: string }) {
  const t = useTranslations("ClientPropertyDetail");
  const [moveIn, setMoveIn] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const MESSAGE_MAX = 600;

  const monthly = typeof property.price === "number" ? property.price : undefined;
  const currency = property.currency ?? "";
  const monthlyFormatted = useMemo(() => {
    if (monthly == null) return undefined;
    try {
      return new Intl.NumberFormat(undefined, { style: currency ? "currency" : undefined as unknown as "currency", currency: currency || undefined }).format(monthly);
    } catch {
      return String(monthly);
    }
  }, [monthly, currency]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const remaining = MESSAGE_MAX - message.length;
  const isValid = !!moveIn && message.trim().length > 0 && message.length <= MESSAGE_MAX;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3 text-lg font-semibold">{t("rent.title", { default: "Rent this property" })}</div>
      {monthly != null && (
        <div className="mb-3 text-sm text-muted-foreground">
          {t("rent.monthly", { default: "Monthly" })}: <span className="font-medium text-foreground">{monthlyFormatted ?? monthly}</span>
        </div>
      )}
      <div className="space-y-3">
        <div>
          <Label htmlFor="moveIn">{t("rent.moveInDate", { default: "Preferred move-in date" })}</Label>
          <Input
            id="moveIn"
            type="date"
            value={moveIn}
            min={today}
            aria-invalid={!moveIn ? true : undefined}
            aria-describedby="moveInHelp"
            onChange={(e) => setMoveIn(e.target.value)}
          />
          <p id="moveInHelp" className="mt-1 text-xs text-muted-foreground">
            {t("rent.moveInHelp", { default: "Select a future date." })}
          </p>
        </div>
        <div>
          <Label htmlFor="message">{t("rent.message", { default: "Message to owner/agent" })}</Label>
          <Textarea
            id="message"
            value={message}
            maxLength={MESSAGE_MAX}
            aria-invalid={message.trim().length === 0 ? true : undefined}
            aria-describedby="messageHelp"
            placeholder={t("rent.messagePh", { default: "I am interested in renting..." })}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("rent.messageHint", { default: "Introduce yourself, desired lease term, and any questions." })}</span>
            <span>{remaining}</span>
          </div>
        </div>
      </div>
      <Button
        className="mt-4 w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm transition-colors hover:from-indigo-600 hover:to-violet-600 focus-visible:ring-2 focus-visible:ring-indigo-500"
        disabled={!isValid}
        aria-disabled={!isValid}
        aria-live="polite"
      >
        {t("rent.requestTour", { default: "Request a tour" })}
      </Button>
      <Button variant="outline" className="mt-2 w-full rounded-full" disabled={!isValid} aria-disabled={!isValid}>
        {t("rent.apply", { default: "Apply" })}
      </Button>
    </div>
  );
}
