import { Activity, AlertTriangle, CheckCircle, Clock, Database, Globe, Server, Zap } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';

interface PerformanceData {
  responseTime: number;
  uptime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestsPerMinute: number;
  recentErrors: {
    timestamp: string;
    message: string;
    severity: "low" | "medium" | "high";
    component: string;
  }[];
  performanceTrends: {
    metric: string;
    current: number;
    previous: number;
    change: number;
    trend: "up" | "down" | "stable";
  }[];
  systemHealth: {
    component: string;
    status: "healthy" | "warning" | "critical";
    value: number;
    threshold: number;
  }[];
}

// Safe helpers at module scope to avoid re-creation per render and React Hook deps warnings
const isRecord = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object';
const getArrayData = (x: unknown): unknown[] => {
  if (isRecord(x) && Array.isArray((x as { data?: unknown }).data)) {
    return (x as { data: unknown[] }).data;
  }
  return [];
};

export const PerformanceMetrics: FC = () => {
  const t = useTranslations('Analytics');
  const { data: session, status } = useSession();
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get performance analytics data
  const performanceQuery = (api as unknown as { analytics: { all: { useQuery: (...args: unknown[]) => { data?: unknown; isLoading?: boolean; error?: unknown } } } }).analytics.all.useQuery(
    {
      page: 1,
      pageSize: 100,
      type: "PERFORMANCE" as const,
      timestampFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      timestampTo: new Date(),
      sortBy: "timestamp",
      sortOrder: "desc",
    },
    {
      enabled: !!session?.user,
    },
  );
  const performanceAnalytics = performanceQuery.data;
  const performanceLoading = Boolean(performanceQuery.isLoading);
  const performanceError = performanceQuery.error;

  // Get system health data
  const systemQuery = (api as unknown as { analytics: { all: { useQuery: (...args: unknown[]) => { data?: unknown; isLoading?: boolean; error?: unknown } } } }).analytics.all.useQuery(
    {
      page: 1,
      pageSize: 100,
      type: "SYSTEM_HEALTH" as const,
      timestampFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      timestampTo: new Date(),
      sortBy: "timestamp",
      sortOrder: "desc",
    },
    {
      enabled: !!session?.user,
    },
  );
  const systemHealthData = systemQuery.data;
  const systemLoading = Boolean(systemQuery.isLoading);
  const systemError = systemQuery.error;

  useEffect(() => {
    if ((performanceAnalytics || systemHealthData) && !performanceLoading && !systemLoading) {
      const performanceItems: unknown[] = getArrayData(performanceAnalytics);
      const healthItems: unknown[] = getArrayData(systemHealthData);

      // Process performance data
      let responseTime = 245;
      let uptime = 99.8;
      let errorRate = 0.2;
      let cpuUsage = 45;
      let memoryUsage = 62;
      let activeConnections = 1250;
      let requestsPerMinute = 890;

      // Process performance analytics
      performanceItems.forEach((item: unknown) => {
        if (!isRecord(item)) return;
        const d = (item as { data?: unknown }).data;
        if (!isRecord(d)) return;
        if (typeof d.responseTime === 'number') responseTime = d.responseTime;
        if (typeof d.uptime === 'number') uptime = d.uptime;
        if (typeof d.errorRate === 'number') errorRate = d.errorRate;
        if (typeof d.cpuUsage === 'number') cpuUsage = d.cpuUsage;
        if (typeof d.memoryUsage === 'number') memoryUsage = d.memoryUsage;
        if (typeof d.activeConnections === 'number') activeConnections = d.activeConnections;
        if (typeof d.requestsPerMinute === 'number') requestsPerMinute = d.requestsPerMinute;
      });

      // Process system health data
      const recentErrors: PerformanceData['recentErrors'] = [];
      const systemHealth: PerformanceData['systemHealth'] = [];

      healthItems.forEach((item: unknown) => {
        if (!isRecord(item)) return;
        const d = (item as { data?: unknown }).data;
        if (!isRecord(d)) return;
        if (typeof d.timestamp === 'string' && typeof d.message === 'string' && typeof d.severity === 'string' && typeof d.component === 'string') {
          const sev = d.severity === 'high' || d.severity === 'medium' || d.severity === 'low' ? d.severity : 'low';
          recentErrors.push({
            timestamp: d.timestamp,
            message: d.message,
            severity: sev,
            component: d.component,
          });
        }
        if (typeof d.component === 'string' && typeof d.status === 'string' && typeof d.value === 'number' && typeof d.threshold === 'number') {
          const st = d.status === 'healthy' || d.status === 'warning' || d.status === 'critical' ? d.status : 'healthy';
          systemHealth.push({
            component: d.component,
            status: st,
            value: d.value,
            threshold: d.threshold,
          });
        }
      });

      // Build data (using computed metrics if available)
      const mockData: PerformanceData = {
        responseTime,
        uptime,
        errorRate,
        cpuUsage,
        memoryUsage,
        activeConnections,
        requestsPerMinute,
        recentErrors: recentErrors.length > 0 ? recentErrors : [
          {
            timestamp: new Date().toISOString(),
            message: "Database connection timeout",
            severity: "low",
            component: "Database",
          },
          {
            timestamp: new Date(Date.now() - 300000).toISOString(),
            message: "API rate limit exceeded",
            severity: "medium",
            component: "API Gateway",
          },
          {
            timestamp: new Date(Date.now() - 600000).toISOString(),
            message: "Memory allocation failed",
            severity: "high",
            component: "Application Server",
          },
          {
            timestamp: new Date(Date.now() - 900000).toISOString(),
            message: "Cache miss rate increased",
            severity: "low",
            component: "Redis Cache",
          },
        ],
        performanceTrends: [
          { metric: "Response Time", current: responseTime, previous: 280, change: -12.5, trend: responseTime <= 280 ? "down" : "up" },
          { metric: "CPU Usage", current: cpuUsage, previous: 42, change: +(cpuUsage - 42).toFixed(1), trend: cpuUsage >= 42 ? "up" : "down" },
          { metric: "Memory Usage", current: memoryUsage, previous: 58, change: +(memoryUsage - 58).toFixed(1), trend: memoryUsage >= 58 ? "up" : "down" },
          { metric: "Error Rate", current: errorRate, previous: 0.3, change: +((errorRate - 0.3) / 0.3 * 100).toFixed(1), trend: errorRate <= 0.3 ? "down" : "up" },
          { metric: "Uptime", current: uptime, previous: 99.5, change: +(uptime - 99.5).toFixed(1), trend: uptime >= 99.5 ? "up" : "down" },
          { metric: "Requests/min", current: requestsPerMinute, previous: 850, change: +((requestsPerMinute - 850) / 850 * 100).toFixed(1), trend: requestsPerMinute >= 850 ? "up" : "down" },
        ],
        systemHealth: systemHealth.length > 0 ? systemHealth : [
          { component: "Web Server", status: "healthy", value: 95, threshold: 90 },
          { component: "Database", status: "healthy", value: 88, threshold: 85 },
          { component: "Cache", status: "warning", value: 82, threshold: 80 },
          { component: "API Gateway", status: "healthy", value: 92, threshold: 90 },
          { component: "File Storage", status: "healthy", value: 96, threshold: 90 },
          { component: "Load Balancer", status: "critical", value: 75, threshold: 80 },
        ],
      };

      setPerformanceData(mockData);
      setLoading(false);
    }
  }, [performanceAnalytics, systemHealthData, performanceLoading, systemLoading]);

  // Show error state
  if (performanceError && systemError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-600">
          {t('performance.error', { defaultValue: 'Error loading performance data.' })}
        </p>
      </div>
    );
  }

  // Show loading state
  if (status === "loading" || loading || performanceLoading || systemLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
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

  if (loading || !performanceData) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('performance.metric.responseTime', { defaultValue: 'Response Time' })}</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.responseTime}ms</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {performanceData.performanceTrends.find(t => t.metric === "Response Time")?.change}% from last week
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('performance.metric.uptime', { defaultValue: 'Uptime' })}</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.uptime}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {performanceData.performanceTrends.find(t => t.metric === "Uptime")?.change}% from last week
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('performance.metric.errorRate', { defaultValue: 'Error Rate' })}</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.errorRate}%</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {performanceData.performanceTrends.find(t => t.metric === "Error Rate")?.change}% from last week
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('performance.metric.requestsPerMin', { defaultValue: 'Requests/min' })}</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.requestsPerMinute}</p>
            </div>
            <Zap className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {performanceData.performanceTrends.find(t => t.metric === "Requests/min")?.change}% from last week
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">{t('performance.systemHealth', { defaultValue: 'System Health' })}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.systemHealth.map((component) => (
            <div key={component.component} className="rounded border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {component.component === "Web Server" && <Server className="h-4 w-4 text-blue-500" />}
                  {component.component === "Database" && <Database className="h-4 w-4 text-green-500" />}
                  {component.component === "Cache" && <Zap className="h-4 w-4 text-yellow-500" />}
                  {component.component === "API Gateway" && <Globe className="h-4 w-4 text-purple-500" />}
                  {component.component === "File Storage" && <Server className="h-4 w-4 text-indigo-500" />}
                  {component.component === "Load Balancer" && <Activity className="h-4 w-4 text-red-500" />}
                  <h4 className="font-medium">{component.component}</h4>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium border ${getStatusColor(component.status)}`}>
                  {getStatusIcon(component.status)}
                  <span className="capitalize">{component.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('performance.health', { defaultValue: 'Health' })}</span>
                  <span className="font-medium">{component.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      component.status === "healthy" ? "bg-green-500" : 
                      component.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${component.value}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {t('performance.threshold', { defaultValue: 'Threshold' })}: {component.threshold}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">{t('performance.trends', { defaultValue: 'Performance Trends' })}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.performanceTrends.map((trend) => (
            <div key={trend.metric} className="rounded border p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{trend.metric}</h4>
                <span className={`text-sm font-medium ${
                  trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend.trend === 'up' ? '↑' : trend.trend === 'down' ? '↓' : '→'} {trend.change}%
                </span>
              </div>
              <div className="text-2xl font-bold">{trend.current}{trend.metric.includes('Rate') || trend.metric.includes('Uptime') ? '%' : ''}</div>
              <div className="text-sm text-gray-500">
                {t('performance.previous', { defaultValue: 'Previous' })}: {trend.previous}{trend.metric.includes('Rate') || trend.metric.includes('Uptime') ? '%' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Usage */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">{t('performance.resourceUsage', { defaultValue: 'Resource Usage' })}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{t('performance.cpuUsage', { defaultValue: 'CPU Usage' })}</span>
                <span className="font-medium">{performanceData.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    performanceData.cpuUsage < 50 ? "bg-green-500" : 
                    performanceData.cpuUsage < 80 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${performanceData.cpuUsage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{t('performance.memoryUsage', { defaultValue: 'Memory Usage' })}</span>
                <span className="font-medium">{performanceData.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    performanceData.memoryUsage < 50 ? "bg-green-500" : 
                    performanceData.memoryUsage < 80 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${performanceData.memoryUsage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded border p-4">
              <h4 className="font-medium mb-2">{t('performance.activeConnections', { defaultValue: 'Active Connections' })}</h4>
              <div className="text-2xl font-bold text-blue-600">{performanceData.activeConnections.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{t('performance.connections', { defaultValue: 'concurrent connections' })}</div>
        </div>
        <div className="rounded border p-4">
              <h4 className="font-medium mb-2">{t('performance.requestsPerMinute', { defaultValue: 'Requests per Minute' })}</h4>
              <div className="text-2xl font-bold text-green-600">{performanceData.requestsPerMinute.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{t('performance.avgLoad', { defaultValue: 'average load' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">{t('performance.recentErrors', { defaultValue: 'Recent Errors' })}</h3>
        <div className="space-y-3">
          {performanceData.recentErrors.map((error, index) => (
            <div
              key={index}
              className={`flex items-center justify-between rounded border p-3 ${getSeverityColor(error.severity)}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{error.component}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    error.severity === 'high' ? 'bg-red-100 text-red-800' : 
                    error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {error.severity}
                  </span>
                </div>
                <p className="text-sm">{error.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(error.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
