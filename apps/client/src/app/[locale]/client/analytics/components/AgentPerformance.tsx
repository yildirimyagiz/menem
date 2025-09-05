import { Award, Clock, Star, TrendingUp, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';
import type { FC } from "react";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

interface AgentData {
  agentId: string;
  agentName: string;
  propertiesListed: number;
  propertiesSold: number;
  totalRevenue: number;
  responseTime: number;
  rating: number;
  conversionRate: number;
  averagePropertyValue: number;
  activeListings: number;
  completedDeals: number;
  clientSatisfaction: number;
}

interface AgentPerformanceData {
  topAgents: AgentData[];
  averageResponseTime: number;
  totalAgents: number;
  activeAgents: number;
  averageConversionRate: number;
  totalRevenue: number;
  performanceByRegion: {
    region: string;
    agents: number;
    revenue: number;
    conversionRate: number;
  }[];
}

export const AgentPerformance: FC = () => {
  const t = useTranslations('Analytics');
  const { data: session, status } = useSession();
  const [agentData, setAgentData] = useState<AgentPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get agent performance analytics
  const agentQuery = (api as unknown as { analytics: { all: { useQuery: (...args: unknown[]) => { data?: unknown; isLoading?: boolean; error?: unknown } } } }).analytics.all.useQuery(
    {
      page: 1,
      pageSize: 100,
      type: "AGENT_PERFORMANCE" as const,
      timestampFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      timestampTo: new Date(),
      sortBy: "timestamp",
      sortOrder: "desc",
    },
    {
      enabled: !!session?.user,
    },
  );
  const agentAnalytics = agentQuery.data;
  const agentLoading = Boolean(agentQuery.isLoading);
  const agentError = agentQuery.error;

  // Get agency performance analytics
  const agencyQuery = (api as unknown as { analytics: { all: { useQuery: (...args: unknown[]) => { data?: unknown; isLoading?: boolean; error?: unknown } } } }).analytics.all.useQuery(
    {
      page: 1,
      pageSize: 100,
      type: "AGENCY_PERFORMANCE" as const,
      timestampFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      timestampTo: new Date(),
      sortBy: "timestamp",
      sortOrder: "desc",
    },
    {
      enabled: !!session?.user,
    },
  );
  const agencyAnalytics = agencyQuery.data;
  const agencyLoading = Boolean(agencyQuery.isLoading);
  const agencyError = agencyQuery.error;

  const isRecord = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object';

  useEffect(() => {
    if ((agentAnalytics || agencyAnalytics) && !agentLoading && !agencyLoading) {
      const agentItems: unknown[] = Array.isArray((agentAnalytics as { data?: unknown })?.data)
        ? (agentAnalytics as { data: unknown[] }).data
        : [];
      const agencyItems: unknown[] = Array.isArray((agencyAnalytics as { data?: unknown })?.data)
        ? (agencyAnalytics as { data: unknown[] }).data
        : [];

      // Process agent data
      const agentsMap = new Map<string, AgentData>();
      let totalRevenue = 0;
      let totalResponseTime = 0;
      let totalConversionRate = 0;
      let agentCount = 0;

      agentItems.forEach((item: unknown) => {
        if (!isRecord(item)) return;
        const d = (item as { data?: unknown }).data;
        if (!isRecord(d)) return;

        const agentId = typeof d.agentId === 'string' ? d.agentId : undefined;
        if (!agentId) return;
        const existing: AgentData = agentsMap.get(agentId) ?? {
          agentId,
          agentName: (typeof d.agentName === 'string' ? d.agentName : 'Unknown Agent'),
          propertiesListed: 0,
          propertiesSold: 0,
          totalRevenue: 0,
          responseTime: 0,
          rating: 0,
          conversionRate: 0,
          averagePropertyValue: 0,
          activeListings: 0,
          completedDeals: 0,
          clientSatisfaction: 0,
        };

        if (typeof d.propertiesListed === 'number') existing.propertiesListed += d.propertiesListed;
        if (typeof d.propertiesSold === 'number') existing.propertiesSold += d.propertiesSold;
        if (typeof d.totalRevenue === 'number') existing.totalRevenue += d.totalRevenue;
        if (typeof d.responseTime === 'number') existing.responseTime = d.responseTime;
        if (typeof d.rating === 'number') existing.rating = d.rating;
        if (typeof d.activeListings === 'number') existing.activeListings = d.activeListings;
        if (typeof d.completedDeals === 'number') existing.completedDeals = d.completedDeals;
        if (typeof d.clientSatisfaction === 'number') existing.clientSatisfaction = d.clientSatisfaction;

        // Derived metrics
        if (existing.propertiesListed > 0) {
          existing.conversionRate = (existing.propertiesSold / existing.propertiesListed) * 100;
        }
        if (existing.propertiesSold > 0) {
          existing.averagePropertyValue = existing.totalRevenue / existing.propertiesSold;
        }

        agentsMap.set(agentId, existing);
        totalRevenue += existing.totalRevenue;
        totalResponseTime += existing.responseTime;
        totalConversionRate += existing.conversionRate;
        agentCount++;
      });

      // Process agency data for regional performance
      const regionMap = new Map<string, { agents: number; revenue: number; deals: number; views: number }>();

      agencyItems.forEach((item: unknown) => {
        if (!isRecord(item)) return;
        const d = (item as { data?: unknown }).data;
        if (!isRecord(d)) return;
        const region = typeof d.region === 'string' ? d.region : undefined;
        if (!region) return;

        const existing = regionMap.get(region) ?? { agents: 0, revenue: 0, deals: 0, views: 0 };
        if (typeof d.agents === 'number') existing.agents += d.agents;
        if (typeof d.revenue === 'number') existing.revenue += d.revenue;
        if (typeof d.deals === 'number') existing.deals += d.deals;
        if (typeof d.views === 'number') existing.views += d.views;
        regionMap.set(region, existing);
      });

      // Convert to arrays and sort
      const topAgents = Array.from(agentsMap.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);

      const performanceByRegion = Array.from(regionMap.entries())
        .map(([region, data]) => ({
          region,
          agents: data.agents,
          revenue: data.revenue,
          conversionRate: data.views > 0 ? (data.deals / data.views) * 100 : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue);

      // Calculate averages
      const averageResponseTime = agentCount > 0 ? totalResponseTime / agentCount : 0;
      const averageConversionRate = agentCount > 0 ? totalConversionRate / agentCount : 0;
      const activeAgents = topAgents.filter(agent => agent.activeListings > 0).length;

      setAgentData({
        topAgents,
        averageResponseTime,
        totalAgents: agentCount,
        activeAgents,
        averageConversionRate,
        totalRevenue,
        performanceByRegion,
      });

      setLoading(false);
    }
  }, [agentAnalytics, agencyAnalytics, agentLoading, agencyLoading]);

  // Show error state
  if (agentError && agencyError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-600">
          {t('agent.error', { defaultValue: 'Error loading agent performance data.' })}
        </p>
      </div>
    );
  }

  // Show loading state
  if (status === "loading" || loading || agentLoading || agencyLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-1/2 animate-pulse rounded bg-gray-300" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show authentication message - but still show mock data for demo
  if (status === "unauthenticated" || !session?.user) {
    // Continue to show mock data instead of blocking
  }

  if (!agentData) {
    // Provide mock data for demonstration
    const mockData = {
      topAgents: [
        {
          agentId: "1",
          agentName: "Sarah Johnson",
          propertiesListed: 45,
          propertiesSold: 12,
          totalRevenue: 2850000,
          responseTime: 2.3,
          rating: 4.8,
          conversionRate: 26.7,
          averagePropertyValue: 237500,
          activeListings: 33,
          completedDeals: 12,
          clientSatisfaction: 95,
        },
        {
          agentId: "2",
          agentName: "Michael Chen",
          propertiesListed: 38,
          propertiesSold: 10,
          totalRevenue: 2200000,
          responseTime: 3.1,
          rating: 4.6,
          conversionRate: 26.3,
          averagePropertyValue: 220000,
          activeListings: 28,
          completedDeals: 10,
          clientSatisfaction: 92,
        },
        {
          agentId: "3",
          agentName: "Emily Rodriguez",
          propertiesListed: 42,
          propertiesSold: 9,
          totalRevenue: 1950000,
          responseTime: 2.8,
          rating: 4.7,
          conversionRate: 21.4,
          averagePropertyValue: 216667,
          activeListings: 33,
          completedDeals: 9,
          clientSatisfaction: 89,
        },
        {
          agentId: "4",
          agentName: "David Thompson",
          propertiesListed: 35,
          propertiesSold: 8,
          totalRevenue: 1800000,
          responseTime: 3.5,
          rating: 4.5,
          conversionRate: 22.9,
          averagePropertyValue: 225000,
          activeListings: 27,
          completedDeals: 8,
          clientSatisfaction: 87,
        },
        {
          agentId: "5",
          agentName: "Lisa Wang",
          propertiesListed: 31,
          propertiesSold: 7,
          totalRevenue: 1650000,
          responseTime: 2.9,
          rating: 4.4,
          conversionRate: 22.6,
          averagePropertyValue: 235714,
          activeListings: 24,
          completedDeals: 7,
          clientSatisfaction: 85,
        },
      ],
      averageResponseTime: 2.9,
      totalAgents: 24,
      activeAgents: 18,
      averageConversionRate: 23.2,
      totalRevenue: 10450000,
      performanceByRegion: [
        { region: "North", agents: 8, revenue: 4200000, conversionRate: 25.8 },
        { region: "South", agents: 6, revenue: 2800000, conversionRate: 22.4 },
        { region: "East", agents: 5, revenue: 2200000, conversionRate: 21.1 },
        { region: "West", agents: 5, revenue: 1250000, conversionRate: 19.8 },
      ],
    };

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{t('agent.totalAgents', { defaultValue: 'Total Agents' })}</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.totalAgents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{t('agent.activeAgents', { defaultValue: 'Active Agents' })}</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.activeAgents}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{t('agent.avgResponse', { defaultValue: 'Avg. Response' })}</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.averageResponseTime}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{t('agent.conversionRate', { defaultValue: 'Conversion Rate' })}</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.averageConversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Top Performing Agents */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">{t('agent.topPerformers', { defaultValue: 'Top Performing Agents' })}</h3>
          <div className="space-y-4">
            {mockData.topAgents.map((agent, index) => (
              <div key={agent.agentId} className="rounded border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{agent.agentName}</h4>
                      <p className="text-sm text-gray-500">{agent.propertiesListed} {t('agent.listings', { defaultValue: 'listings' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${agent.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{agent.conversionRate}% {t('agent.conversion', { defaultValue: 'conversion' })}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {agent.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {agent.responseTime}h
                    </span>
                  </div>
                  <span className="text-green-600 font-medium">+{agent.clientSatisfaction}% {t('agent.satisfaction', { defaultValue: 'satisfaction' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Performance */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">{t('agent.regional', { defaultValue: 'Regional Performance' })}</h3>
          <div className="space-y-3">
            {mockData.performanceByRegion.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium">{region.region}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(region.revenue / mockData.totalRevenue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">${region.revenue.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">{region.agents} {t('agent.agents', { defaultValue: 'agents' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('agent.totalAgents', { defaultValue: 'Total Agents' })}</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.totalAgents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {agentData.activeAgents} {t('agent.active', { defaultValue: 'active' })}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('agent.totalRevenue', { defaultValue: 'Total Revenue' })}</p>
              <p className="text-2xl font-bold text-gray-900">${agentData.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('agent.avgResponseTime', { defaultValue: 'Avg. Response' })}</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.averageResponseTime.toFixed(1)}h</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('agent.conversionRate', { defaultValue: 'Conversion Rate' })}</p>
              <p className="text-2xl font-bold text-gray-900">{agentData.averageConversionRate.toFixed(1)}%</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Top Agents */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">{t('agent.topAgents', { defaultValue: 'Top Performing Agents' })}</h3>
        <div className="space-y-4">
          {agentData.topAgents.map((agent, index) => (
            <div key={agent.agentId} className="flex items-center justify-between rounded border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium">{agent.agentName}</h4>
                  <p className="text-sm text-gray-500">
                    {agent.propertiesSold} {t('agent.sold', { defaultValue: 'sold' })} / {agent.propertiesListed} {t('agent.listed', { defaultValue: 'listed' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${agent.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{agent.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({agent.conversionRate.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Performance */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">{t('agent.regionalPerformance', { defaultValue: 'Regional Performance' })}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {agentData.performanceByRegion.map((region) => (
            <div key={region.region} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{region.region}</h4>
                  <p className="text-sm text-gray-500">{region.agents} {t('agent.agents', { defaultValue: 'agents' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${region.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{region.conversionRate.toFixed(1)}% {t('agent.conversion', { defaultValue: 'conversion' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 