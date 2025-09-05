import React from "react";

interface SpecialPricing {
  startDate: Date;
  endDate: Date;
  price: number;
}

interface ExtraCharge {
  name: string;
  amount: number;
}

interface Discount {
  name: string;
  amount: number;
}

interface PricingBreakdownProps {
  basePrice: number;
  specialPricing?: SpecialPricing[];
  extraCharges?: ExtraCharge[];
  discounts?: Discount[];
  nights: number;
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
  basePrice,
  specialPricing = [],
  extraCharges = [],
  discounts = [],
  nights,
}) => {
  // Calculate special price if any nights overlap
  const totalBase = basePrice * nights;
  let specialTotal = 0;
  // TODO: Implement special pricing logic
  // For now, just add all special pricing amounts
  specialPricing.forEach((sp) => {
    specialTotal += sp.price;
  });
  const extraTotal = extraCharges.reduce((sum, c) => sum + c.amount, 0);
  const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
  const total = totalBase + specialTotal + extraTotal - discountTotal;

  return (
    <div className="mt-4 rounded border p-4">
      <div className="mb-2 font-semibold">Pricing Breakdown</div>
      <div>
        Base Price: ${basePrice} x {nights} nights = ${totalBase}
      </div>
      {specialPricing.length > 0 && (
        <div>Special Pricing: +${specialTotal}</div>
      )}
      {extraCharges.length > 0 && <div>Extra Charges: +${extraTotal}</div>}
      {discounts.length > 0 && <div>Discounts: -${discountTotal}</div>}
      <div className="mt-2 font-bold">Total: ${total}</div>
    </div>
  );
};

export default PricingBreakdown;
