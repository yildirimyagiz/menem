import React, { useState } from "react";

import type { TaxRecord } from "~/utils/interfaces";
import { api } from "~/trpc/react";

interface TaxRecordByBookingProps {
  propertyId?: string;
  reservationId?: string;
}

const TaxRecordByBooking: React.FC<TaxRecordByBookingProps> = ({
  propertyId,
  reservationId,
}) => {
  const [payingTaxId, setPayingTaxId] = useState<string | null>(null);
  // For now, filter by propertyId; extend to reservationId if needed
  const {
    data: taxData,
    isLoading,
    error,
  } = api.taxRecord.all.useQuery({
    ...(propertyId ? { propertyId } : {}),
    // TODO: Add reservationId filter if supported by backend
  });

  const taxRecords: TaxRecord[] = Array.isArray(taxData?.data)
    ? (taxData.data as TaxRecord[])
    : [];

  // Helper to get status string
  function getStatus(tax: TaxRecord) {
    if (tax.paid) return "Paid";
    if (tax.dueDate && new Date(tax.dueDate) < new Date()) return "Overdue";
    return "Pending";
  }

  return (
    <div className="my-4">
      <h2 className="mb-2 text-lg font-semibold">
        Tax Records for this Booking
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-4 text-center">
                  Loading tax records...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-red-500">
                  {error.message}
                </td>
              </tr>
            ) : taxRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No tax records found.
                </td>
              </tr>
            ) : (
              taxRecords.map((tax) => (
                <tr key={tax.id} className="border-b">
                  <td className="px-4 py-2">{tax.year}</td>
                  <td className="px-4 py-2">{tax.amount}</td>
                  <td className="px-4 py-2">{getStatus(tax)}</td>
                  <td className="px-4 py-2">
                    {tax.dueDate
                      ? new Date(tax.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {!tax.paid && (
                      <button
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        onClick={() => setPayingTaxId(tax.id)}
                      >
                        Pay Tax
                      </button>
                    )}
                    {payingTaxId === tax.id && (
                      <div className="mt-2">
                        {/* TODO: Integrate payment component for tax payment */}
                        <span className="text-sm text-gray-500">
                          Payment UI goes here.
                        </span>
                        <button
                          className="ml-2 text-xs text-gray-500 underline"
                          onClick={() => setPayingTaxId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxRecordByBooking;
