import React from "react";

import type { CommissionRule } from "@reservatior/validators";

interface CommissionRuleListProps {
  rules: CommissionRule[];
  loading?: boolean;
  error?: string | null;
  onView?: (id: string) => void;
}

const CommissionRuleList: React.FC<CommissionRuleListProps> = ({
  rules,
  loading,
  error,
  onView,
}) => {
  if (loading) {
    return <div className="py-8 text-center">Loading commission rules...</div>;
  }
  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }
  if (!rules.length) {
    return (
      <div className="py-8 text-center text-gray-500">
        No commission rules found.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Provider</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Commission</th>
            <th className="px-4 py-2 text-left">Start</th>
            <th className="px-4 py-2 text-left">End</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} className="border-b">
              <td className="px-4 py-2">{rule.provider?.name || "-"}</td>
              <td className="px-4 py-2">{rule.ruleType}</td>
              <td className="px-4 py-2">{rule.commission}</td>
              <td className="px-4 py-2">
                {rule.startDate
                  ? new Date(rule.startDate).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-4 py-2">
                {rule.endDate
                  ? new Date(rule.endDate).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-4 py-2">
                {onView && (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => onView(rule.id)}
                  >
                    View
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommissionRuleList;
