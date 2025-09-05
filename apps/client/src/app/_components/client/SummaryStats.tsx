"use client";

import { useRouter } from "next/navigation";
import {
  Building,
  DollarSign,
  LayoutDashboard,
  Wrench,
  Users,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import { Progress } from "@reservatior/ui/progress";
import { Badge } from "@reservatior/ui/badge";

import { useLanguage } from "~/context/LanguageContext";
import { useCurrency } from "~/context/CurrencyContext";

// Stats types for different categories
interface PropertyStats {
  total: number;
  change: number;
  occupied: number;
  vacant: number;
  occupancyRate: number;
  byType: { 
    type: string;
    count: number;
    percentage: number;
  }[];
}

interface FinancialStats {
  monthlyCashflow: number;
  cashflowChange: number;
  pending: number;
  pendingAmount: number;
  overdue: number;
  overdueAmount: number;
}

interface TaskStats {
  total: number;
  pending: number;
  pendingChange: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

interface TenantStats {
  total: number;
  totalChange: number;
  newTenants: number;
  expiringLeases: number;
}

interface SummaryStatsProps {
  properties: PropertyStats;
  financials: FinancialStats;
  tasks: TaskStats;
  tenants: TenantStats;
}

export default function SummaryStats({
  properties,
  financials,
  tasks,
  tenants
}: SummaryStatsProps) {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const router = useRouter();
  
  // Format percentage values
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{t("summaryStats")}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => router.push("/admin/analytics")}
          >
            {t("detailedAnalytics")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-4">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              {t("overview")}
            </TabsTrigger>
            <TabsTrigger value="properties">
              <Building className="h-4 w-4 mr-2" />
              {t("properties")}
            </TabsTrigger>
            <TabsTrigger value="financials">
              <DollarSign className="h-4 w-4 mr-2" />
              {t("financials")}
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <Wrench className="h-4 w-4 mr-2" />
              {t("tasks")}
            </TabsTrigger>
            <TabsTrigger value="tenants">
              <Users className="h-4 w-4 mr-2" />
              {t("tenants")}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Properties */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t("totalProperties")}</p>
                      <h3 className="text-2xl font-bold">{properties.total}</h3>
                    </div>
                    <Badge variant={properties.change > 0 ? "default" : "secondary"} className="flex items-center gap-1">
                      {properties.change > 0 ? <ArrowUp className="h-3 w-3" /> : null}
                      {properties.change > 0 ? `+${properties.change}` : properties.change} {t("thisMonth")}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">{t("occupancyRate")}: </span>
                      <span className="font-medium">{formatPercentage(properties.occupancyRate)}</span>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        {properties.occupied}/{properties.total}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Cashflow */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t("monthlyCashflow")}</p>
                      <h3 className="text-2xl font-bold">{formatCurrency(financials.monthlyCashflow)}</h3>
                    </div>
                    <Badge variant={financials.cashflowChange > 0 ? "default" : "secondary"} className="flex items-center gap-1">
                      {financials.cashflowChange > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {financials.cashflowChange > 0 ? `+${formatCurrency(financials.cashflowChange)}` : formatCurrency(financials.cashflowChange)} 
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">{t("pendingPayments")}: </span>
                      <span className="font-medium">{financials.pending}</span>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        {formatCurrency(financials.pendingAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Tasks */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t("pendingTasks")}</p>
                      <h3 className="text-2xl font-bold">{tasks.pending}</h3>
                    </div>
                    <Badge variant={tasks.pendingChange <= 0 ? "default" : "destructive"} className="flex items-center gap-1">
                      {tasks.pendingChange <= 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                      {tasks.pendingChange <= 0 ? tasks.pendingChange : `+${tasks.pendingChange}`} {t("thisWeek")}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 mb-1">
                        {tasks.highPriority}
                      </span>
                      <span className="text-muted-foreground text-xs">{t("high")}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 mb-1">
                        {tasks.mediumPriority}
                      </span>
                      <span className="text-muted-foreground text-xs">{t("medium")}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 mb-1">
                        {tasks.lowPriority}
                      </span>
                      <span className="text-muted-foreground text-xs">{t("low")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tenants Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t("totalTenants")}</p>
                      <h3 className="text-2xl font-bold">{tenants.total}</h3>
                    </div>
                    <Badge variant={tenants.totalChange > 0 ? "default" : "secondary"} className="flex items-center gap-1">
                      {tenants.totalChange > 0 ? <ArrowUp className="h-3 w-3" /> : null}
                      {tenants.totalChange > 0 ? `+${tenants.totalChange}` : tenants.totalChange} {t("thisMonth")}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">{t("newTenants")}: </span>
                      <span className="font-medium">{tenants.newTenants}</span>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        {tenants.expiringLeases} {t("expiring")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs content remains the same, just updating imports and routing */}
          <TabsContent value="properties">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 dark:bg-green-950">
                    <CardContent className="p-6 flex flex-col items-center">
                      <p className="text-sm font-medium mb-1">{t("occupied")}</p>
                      <h3 className="text-2xl font-bold">{properties.occupied}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{formatPercentage(properties.occupancyRate)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 dark:bg-blue-950">
                    <CardContent className="p-6 flex flex-col items-center">
                      <p className="text-sm font-medium mb-1">{t("vacant")}</p>
                      <h3 className="text-2xl font-bold">{properties.vacant}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{formatPercentage(100 - properties.occupancyRate)}</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base">{t("propertiesByType")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {properties.byType.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.type}</span>
                            <span className="font-medium">{item.count}</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground text-right">
                            {formatPercentage(item.percentage)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">{t("occupancyTrend")}</CardTitle>
                  <CardDescription>{t("last6Months")}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex items-center justify-center h-[300px]">
                  <div className="text-center text-muted-foreground">
                    {t("chartPlaceholder")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">{t("financialSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">{t("monthlyCashflow")}</p>
                        <p className="text-2xl font-bold">{formatCurrency(financials.monthlyCashflow)}</p>
                      </div>
                      <Badge className="flex items-center gap-1">
                        {financials.cashflowChange > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {financials.cashflowChange > 0 
                          ? `+${formatCurrency(financials.cashflowChange)}` 
                          : formatCurrency(financials.cashflowChange)
                        }
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">{t("pending")}</p>
                        <p className="text-xl font-bold">{formatCurrency(financials.pendingAmount)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {financials.pending} {t("payments")}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">{t("overdue")}</p>
                        <p className="text-xl font-bold text-red-600">{formatCurrency(financials.overdueAmount)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {financials.overdue} {t("payments")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">{t("cashflowTrend")}</CardTitle>
                  <CardDescription>{t("last6Months")}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex items-center justify-center h-[300px]">
                  <div className="text-center text-muted-foreground">
                    {t("chartPlaceholder")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">{t("taskSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">{t("pendingTasks")}</p>
                        <p className="text-2xl font-bold">{tasks.pending}</p>
                      </div>
                      <Badge variant={tasks.pendingChange <= 0 ? "outline" : "destructive"} className="flex items-center gap-1">
                        {tasks.pendingChange <= 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        {tasks.pendingChange <= 0 ? tasks.pendingChange : `+${tasks.pendingChange}`}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg bg-red-50">
                        <p className="text-sm text-muted-foreground mb-1">{t("high")}</p>
                        <p className="text-xl font-bold text-red-600">{tasks.highPriority}</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-amber-50">
                        <p className="text-sm text-muted-foreground mb-1">{t("medium")}</p>
                        <p className="text-xl font-bold text-amber-600">{tasks.mediumPriority}</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-green-50">
                        <p className="text-sm text-muted-foreground mb-1">{t("low")}</p>
                        <p className="text-xl font-bold text-green-600">{tasks.lowPriority}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">{t("taskDistribution")}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex items-center justify-center h-[300px]">
                  <div className="text-center text-muted-foreground">
                    {t("chartPlaceholder")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tenants">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                      <p className="text-sm font-medium mb-1">{t("totalTenants")}</p>
                      <h3 className="text-2xl font-bold">{tenants.total}</h3>
                      <Badge className="mt-2 flex items-center gap-1">
                        {tenants.totalChange > 0 ? <ArrowUp className="h-3 w-3" /> : null}
                        {tenants.totalChange > 0 ? `+${tenants.totalChange}` : tenants.totalChange}
                      </Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                      <p className="text-sm font-medium mb-1">{t("newTenants")}</p>
                      <h3 className="text-2xl font-bold">{tenants.newTenants}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{t("thisMonth")}</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-amber-50 dark:bg-amber-900">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{t("expiringLeases")}</p>
                        <h3 className="text-2xl font-bold">{tenants.expiringLeases}</h3>
                      </div>
                      <Button variant="outline" className="bg-white" size="sm" onClick={() => router.push("/admin/tenants/expiring")}>
                        {t("viewAll")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">{t("tenantTurnover")}</CardTitle>
                  <CardDescription>{t("last6Months")}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex items-center justify-center h-[300px]">
                  <div className="text-center text-muted-foreground">
                    {t("chartPlaceholder")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
