"use client";

import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Textarea } from "@reservatior/ui/textarea";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface SidebarProperty {
  price?: number;
  marketValue?: number;
  currency?: string;
}

export default function ForSaleSidebar({ property, locale: _locale }: { property: SidebarProperty; locale?: string }) {
  const t = useTranslations("ClientPropertyDetail");
  const [offer, setOffer] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const MESSAGE_MAX = 600;

  const price = typeof property.price === "number" ? property.price : (typeof property.marketValue === "number" ? property.marketValue : undefined);
  const currency = property.currency ?? "";
  const priceFormatted = useMemo(() => {
    if (price == null) return undefined;
    try {
      return new Intl.NumberFormat(undefined, { style: currency ? "currency" : undefined as unknown as "currency", currency: currency || undefined }).format(price);
    } catch {
      return String(price);
    }
  }, [price, currency]);

  const isValid = message.trim().length > 0 && message.length <= MESSAGE_MAX;
  const remaining = MESSAGE_MAX - message.length;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3 text-lg font-semibold">{t("sale.title", { default: "Buy this property" })}</div>
      {price != null && (
        <div className="mb-3 text-sm text-muted-foreground">
          {t("sale.price", { default: "Price" })}: <span className="font-medium text-foreground">{priceFormatted ?? price}</span>
        </div>
      )}
      <div className="space-y-3">
        <div>
          <Label htmlFor="offer">{t("sale.makeOffer", { default: "Make an offer (optional)" })}</Label>
          <Input
            id="offer"
            type="number"
            min={0}
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            aria-describedby="offerHelp"
          />
          <p id="offerHelp" className="mt-1 text-xs text-muted-foreground">{t("sale.offerHelp", { default: "You can propose a price or leave it blank." })}</p>
        </div>
        <div>
          <Label htmlFor="message">{t("sale.message", { default: "Message to owner/agent" })}</Label>
          <Textarea
            id="message"
            value={message}
            maxLength={MESSAGE_MAX}
            aria-invalid={message.trim().length === 0 ? true : undefined}
            aria-describedby="saleMessageHelp"
            placeholder={t("sale.messagePh", { default: "I would like to discuss this property..." })}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div id="saleMessageHelp" className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("sale.messageHint", { default: "Share your timeline, financing status, and questions." })}</span>
            <span>{remaining}</span>
          </div>
        </div>
      </div>
      <Button
        className="mt-4 w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm transition-colors hover:from-indigo-600 hover:to-violet-600 focus-visible:ring-2 focus-visible:ring-indigo-500"
        disabled={!isValid}
        aria-disabled={!isValid}
      >
        {t("sale.requestInfo", { default: "Request info" })}
      </Button>
      <Button variant="outline" className="mt-2 w-full rounded-full" disabled={!isValid} aria-disabled={!isValid}>{t("sale.scheduleTour", { default: "Schedule a tour" })}</Button>
    </div>
  );
}
