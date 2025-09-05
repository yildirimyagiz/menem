import React, { useState } from "react";

import type { CommissionRule } from "@reservatior/validators";

import { api } from "~/trpc/react";
import CommissionRuleList from "../../commissionRule/_components/CommissionRuleList";
import { PaymentActions } from "../../payments/components/PaymentActions";

interface CommissionRuleByBookingProps {
  propertyId?: string;
  reservationId?: string;
}

const CommissionRuleByBooking: React.FC<CommissionRuleByBookingProps> = ({
  propertyId,
  reservationId,
}) => {
  const [payingRuleId, setPayingRuleId] = useState<string | null>(null);
  // For now, filter by propertyId; extend to reservationId if needed
  const {
    data: rulesData,
    isLoading,
    error,
  } = api.commissionRule.all.useQuery({
    // TODO: Adjust filter as needed for your backend
    // e.g. propertyId, reservationId, providerId, etc.
    // For now, just pass propertyId if present
    ...(propertyId ? { providerId: propertyId } : {}),
  });

  const rules: CommissionRule[] = Array.isArray(rulesData?.data)
    ? (rulesData.data as CommissionRule[])
    : [];

  return (
    <div className="my-4">
      <h2 className="mb-2 text-lg font-semibold">
        Commission Rules for this Booking
      </h2>
      {rules.map((rule) => (
        <div key={rule.id} className="mb-4 rounded border p-2">
          <div className="flex items-center justify-between">
            <div>
              <div>
                <span className="font-semibold">Type:</span> {rule.ruleType}
              </div>
              <div>
                <span className="font-semibold">Commission:</span>{" "}
                {rule.commission}
              </div>
              {/* TODO: Show paid/unpaid status if available */}
            </div>
            <div>
              {/* Only show if unpaid, add logic as needed */}
              <button
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => setPayingRuleId(rule.id)}
              >
                Pay Commission
              </button>
            </div>
          </div>
          {payingRuleId === rule.id && (
            <div className="mt-4">
              {/* Pass commission amount and reference to PaymentActions */}
              <PaymentActions />
              {/* TODO: Pass props to PaymentActions for amount/reference if needed */}
              <button
                className="mt-2 text-sm text-gray-500 underline"
                onClick={() => setPayingRuleId(null)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
      <CommissionRuleList
        rules={rules}
        loading={isLoading}
        error={error?.message}
      />
    </div>
  );
};

export default CommissionRuleByBooking;
