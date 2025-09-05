"use client";

import { Card } from "@reservatior/ui/card";

import { PaymentActions, PaymentHistory } from "./components";

export default function PaymentsPage() {
  // Placeholder summary data; replace with real data if available
  const summary = [
    { label: "Total Paid", value: "$12,500" },
    { label: "Unpaid", value: "$1,200" },
    { label: "Overdue", value: "$300" },
    { label: "Upcoming", value: "$2,000" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950">
      <div className="container mx-auto space-y-8 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your payments, view history, and take action.
          </p>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {summary.map((item) => (
            <Card key={item.label} className="p-4 text-center">
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="mt-1 text-xl font-bold">{item.value}</div>
            </Card>
          ))}
        </div>
        {/* Main Content: Responsive 2-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Payment History</h2>
            <PaymentHistory />
          </div>
          <div className="lg:border-l lg:pl-8">
            <h2 className="mb-4 text-xl font-semibold">Make a Payment</h2>
            <PaymentActions />
          </div>
        </div>
      </div>
    </div>
  );
}
