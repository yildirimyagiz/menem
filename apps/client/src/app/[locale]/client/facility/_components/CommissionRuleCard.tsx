import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

export interface CommissionRuleCardProps {
  rule: {
    ruleType: string;
    commission: number;
    startDate?: string;
    endDate?: string;
    conditions?: string;
  };
}

export const CommissionRuleCard = ({ rule }: CommissionRuleCardProps) => (
  <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 shadow-md dark:from-purple-950/30 dark:to-blue-950/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
        <span>Commission Rule</span>
        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          {rule.ruleType}
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mb-2 text-2xl font-bold text-purple-700 dark:text-purple-300">
        {rule.commission}%
      </div>
      {rule.conditions && (
        <div className="mb-1 text-sm text-neutral-600 dark:text-neutral-300">
          {rule.conditions}
        </div>
      )}
      {rule.startDate && rule.endDate && (
        <div className="text-xs text-neutral-400">
          Valid: {rule.startDate} - {rule.endDate}
        </div>
      )}
    </CardContent>
  </Card>
);

export default CommissionRuleCard;
