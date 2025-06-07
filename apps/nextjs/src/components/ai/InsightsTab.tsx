import React from "react";
import { BarChart, LineChart, ListChecks, PieChart } from "lucide-react";

import { useLanguage } from "~/context/LanguageContext";

interface PropertyTypeDataItem {
  name: string;
  value: number;
}

interface OccupancyTrendDataItem {
  month: string;
  occupancy: number;
}

interface LocationDistributionDataItem {
  location: string;
  count: number;
}

interface InsightsTabProps {
  propertyTypeData: PropertyTypeDataItem[];
  occupancyTrendData: OccupancyTrendDataItem[];
  locationDistributionData: LocationDistributionDataItem[];
}

const InsightsTab: React.FC<InsightsTabProps> = ({
  propertyTypeData,
  occupancyTrendData,
  locationDistributionData,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
      {/* Portfolio Distribution Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="flex items-center text-2xl font-semibold leading-none tracking-tight">
            <PieChart className="mr-2 h-5 w-5 text-primary" />
            {t("features.portfolioDistribution")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("features.portfolioDistributionDescription")}
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="text-center text-muted-foreground">
            Property type distribution visualization would render here.
            <br />
            <span className="text-sm">
              Using data from Second-Me AI analysis
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {propertyTypeData.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  {item.value}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Occupancy Trends Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="flex items-center text-2xl font-semibold leading-none tracking-tight">
            <LineChart className="mr-2 h-5 w-5 text-primary" />
            {t("features.occupancyTrends")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("features.occupancyTrendsDescription")}
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="text-center text-muted-foreground">
            Occupancy trend visualization would render here.
            <br />
            <span className="text-sm">
              Using data from Second-Me AI analysis
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {occupancyTrendData.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.month}</span>
                <span className="text-sm text-muted-foreground">
                  {item.occupancy}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Location Distribution Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="flex items-center text-2xl font-semibold leading-none tracking-tight">
            <BarChart className="mr-2 h-5 w-5 text-primary" />
            {t("features.locationDistribution")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("features.locationDistributionDescription")}
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="text-center text-muted-foreground">
            Location distribution visualization would render here.
            <br />
            <span className="text-sm">
              Using data from Second-Me AI analysis
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {locationDistributionData.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.location}</span>
                <span className="text-sm text-muted-foreground">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="flex items-center text-2xl font-semibold leading-none tracking-tight">
            <ListChecks className="mr-2 h-5 w-5 text-primary" />
            {t("features.aiInsights")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("features.aiInsightsDescription")}
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold">
                Portfolio Growth Opportunity
              </h4>
              <p className="text-sm text-muted-foreground">
                Based on current market trends, expanding your portfolio in the
                Downtown area could yield 8% higher returns.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Maintenance Prediction</h4>
              <p className="text-sm text-muted-foreground">
                AI analysis suggests scheduling HVAC maintenance for properties
                older than 10 years to prevent future issues.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Tenant Satisfaction</h4>
              <p className="text-sm text-muted-foreground">
                Communication response time has improved by 15% this month,
                leading to higher tenant satisfaction scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsTab;
