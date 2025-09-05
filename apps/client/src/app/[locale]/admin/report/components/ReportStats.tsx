import React from "react";

import type { ReportSummary } from "@reservatior/validators";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";

interface ReportStatsProps {
  stats?: ReportSummary;
}

export const ReportStats: React.FC<ReportStatsProps> = ({ stats }) => {
  if (!stats) {
    return <div className="text-gray-400">No stats available</div>;
  }
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{stats.totalReports}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">${stats.totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Avg. Occupancy Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">
            {stats.averageOccupancyRate.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>By Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {Object.entries(stats.reportsByStatus).map(([status, count]) => (
              <span key={status}>
                {status}: {count}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
