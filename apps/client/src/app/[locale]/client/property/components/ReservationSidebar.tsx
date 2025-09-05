"use client";

import { useMemo, useState } from "react";
import { Button } from "@reservatior/ui/button";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Separator } from "@reservatior/ui/separator";
import { useTranslations } from "next-intl";

// Minimal, schema-tolerant props
interface SidebarProperty {
  price?: number;
  marketValue?: number;
  currency?: string;
}

export default function ReservationSidebar({ property, locale: _locale }: { property: SidebarProperty; locale?: string }) {
  const t = useTranslations("ClientPropertyDetail");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const price = (typeof property.price === "number" ? property.price : (typeof property.marketValue === "number" ? property.marketValue : undefined));
  const currency = property.currency ?? "";
  const priceFormatted = useMemo(() => {
    if (price == null) return undefined;
    try {
      return new Intl.NumberFormat(undefined, { style: currency ? "currency" : undefined as unknown as "currency", currency: currency || undefined }).format(price);
    } catch {
      return String(price);
    }
  }, [price, currency]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);
  const total = useMemo(() => (price != null && nights > 0 ? price * nights : undefined), [price, nights]);
  const totalFormatted = useMemo(() => {
    if (total == null) return undefined;
    try {
      return new Intl.NumberFormat(undefined, { style: currency ? "currency" : undefined as unknown as "currency", currency: currency || undefined }).format(total);
    } catch {
      return String(total);
    }
  }, [total, currency]);

  const invalidRange = !!checkIn && !!checkOut && nights === 0;
  const guestsValid = Number.isFinite(guests) && guests >= 1;
  const canReserve = !invalidRange && guestsValid && !!checkIn && !!checkOut;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3 text-lg font-semibold">
        {t("booking.title", { default: "Book your stay" })}
      </div>
      {price != null && (
        <div className="mb-3 text-sm text-muted-foreground">
          {t("priceFrom", { default: "From" })} <span className="font-medium text-foreground">{priceFormatted ?? price}</span>
        </div>
      )}
      <div className="space-y-3">
        <div>
          <Label htmlFor="checkIn">{t("booking.checkIn", { default: "Check-in" })}</Label>
          <Input
            id="checkIn"
            type="date"
            value={checkIn}
            min={today}
            aria-invalid={invalidRange ? true : undefined}
            aria-describedby="checkInHelp"
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <p id="checkInHelp" className="mt-1 text-xs text-muted-foreground">{t("booking.checkInHelp", { default: "Select your arrival date." })}</p>
        </div>
        <div>
          <Label htmlFor="checkOut">{t("booking.checkOut", { default: "Check-out" })}</Label>
          <Input
            id="checkOut"
            type="date"
            value={checkOut}
            min={checkIn || today}
            aria-invalid={invalidRange ? true : undefined}
            aria-describedby="checkOutHelp"
            onChange={(e) => setCheckOut(e.target.value)}
          />
          <p id="checkOutHelp" className="mt-1 text-xs text-muted-foreground">{t("booking.checkOutHelp", { default: "Select your departure date (after check-in)." })}</p>
          {invalidRange && (
            <p className="mt-1 text-xs text-red-600">{t("booking.invalidRange", { default: "Check-out must be after check-in." })}</p>
          )}
        </div>
        <div>
          <Label htmlFor="guests">{t("booking.guests", { default: "Guests" })}</Label>
          <Input
            id="guests"
            type="number"
            min={1}
            value={guests}
            aria-invalid={!guestsValid ? true : undefined}
            aria-describedby="guestsHelp"
            onChange={(e) => setGuests(Number(e.target.value || 1))}
          />
          <p id="guestsHelp" className="mt-1 text-xs text-muted-foreground">{t("booking.guestsHelp", { default: "Number of people staying." })}</p>
        </div>
      </div>
      {nights > 0 && (
        <div className="mt-3 rounded-md bg-gray-50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span>{t("booking.nights", { default: "Nights" })}</span>
            <span className="font-medium">{nights}</span>
          </div>
          {total != null && (
            <div className="mt-1 flex items-center justify-between">
              <span>{t("booking.total", { default: "Total" })}</span>
              <span className="font-semibold">{totalFormatted ?? total}</span>
            </div>
          )}
        </div>
      )}
      <Separator className="my-4" />
      <Button className="w-full" disabled={!canReserve} aria-disabled={!canReserve}>
        {t("booking.reserve", { default: "Reserve" })}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        {t("booking.policyNote", { default: "Free cancellation within 48 hours." })}
      </p>
    </div>
  );
}
