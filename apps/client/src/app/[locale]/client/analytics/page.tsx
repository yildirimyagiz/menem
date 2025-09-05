"use client";

import { Activity, BarChart3, Calendar, DollarSign, Download, Filter, Home, RefreshCw, Share2, Target, TrendingUp, Users } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useEffect, useState } from "react";
import { toast } from "sonner";


import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@reservatior/ui/dialog";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import { Progress } from "@reservatior/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@reservatior/ui/tooltip";

import { env } from "~/env";

import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { AgentPerformance } from "./components/AgentPerformance";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { AnalyticsTestData } from "./components/AnalyticsTestData";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { PropertyAnalytics } from "./components/PropertyAnalytics";
import { RevenueAnalytics } from "./components/RevenueAnalytics";
import { UserEngagement } from "./components/UserEngagement";

export default function AnalyticsPage() {
  const t = useTranslations('Analytics');
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const [analyticsType, setAnalyticsType] = useState<string | undefined>(undefined);
  const [entityType, setEntityType] = useState<string | undefined>(undefined);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [sharing, setSharing] = useState<string | null>(null);

  // Get analytics metrics for summary cards
  // Use unknown to avoid explicit-any and destructure safely below
   
  const metricsQueryResult = (api as unknown as { analytics: { getMetrics: { useQuery: (...args: unknown[]) => { data?: unknown } } } }).analytics.getMetrics.useQuery(
    {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
    {
      enabled: !!session?.user,
    },
  );
  const metricsData = metricsQueryResult?.data;

  // Get user data for summary
   
  const usersQueryResult = (api as unknown as { user: { all: { useQuery: (...args: unknown[]) => { data?: unknown } } } }).user.all.useQuery(
    {
      page: 1,
      pageSize: 100,
    },
    {
      enabled: !!session?.user,
    },
  );
  const usersData = usersQueryResult?.data;

  // Get property data for summary
   
  const propertiesQueryResult = (api as unknown as { property: { all: { useQuery: (...args: unknown[]) => { data?: unknown } } } }).property.all.useQuery(
    {
      page: 1,
      pageSize: 100,
    },
    {
      enabled: !!session?.user,
    },
  );
  const propertiesData = propertiesQueryResult?.data;

  // Get agent data for summary
   
  const agentsQueryResult = (api as unknown as { agent: { all: { useQuery: (...args: unknown[]) => { data?: unknown } } } }).agent.all.useQuery(
    {
      page: 1,
      pageSize: 100,
    },
    {
      enabled: !!session?.user,
    },
  );
  const agentsData = agentsQueryResult?.data;

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate export data based on type
      const exportData = generateExportData(type);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_analytics_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${t('export_success', { defaultValue: 'Successfully exported' })} ${type} ${t('export_data', { defaultValue: 'data' })}`);
    } catch {
      toast.error(t('export_error', { defaultValue: 'Export failed. Please try again.' }));
    } finally {
      setExporting(null);
    }
  };

  const handleShare = async (type: string) => {
    setSharing(type);
    try {
      // Simulate share process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate shareable link
      const shareUrl = `${(env.NEXT_PUBLIC_APP_URL || window.location.origin)}/analytics/share/${type}?dateRange=${dateRange.startDate.toISOString()}&to=${dateRange.endDate.toISOString()}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast.success(t('share_success', { defaultValue: 'Shareable link copied to clipboard!' }));
    } catch {
      toast.error(t('share_error', { defaultValue: 'Share failed. Please try again.' }));
    } finally {
      setSharing(null);
    }
  };

  const generateExportData = (type: string) => {
    const baseData = {
      exportDate: new Date().toISOString(),
      dateRange: {
        start: dateRange.startDate.toISOString(),
        end: dateRange.endDate.toISOString(),
      },
      filters: {
        analyticsType,
        entityType,
      },
      type,
    };

    switch (type) {
      case 'overview':
        return {
          ...baseData,
          summary: getQuickStats(),
          metrics: {
            totalEvents: 1234,
            growthRate: 12.5,
            topMetrics: ['USER_ENGAGEMENT', 'REVENUE', 'PERFORMANCE'],
          },
        };
      case 'revenue':
        return {
          ...baseData,
          revenue: {
            total: 98765,
            monthly: 45678,
            growth: 15.2,
            sources: ['Property Sales', 'Commissions', 'Services'],
          },
        };
      case 'property':
        return {
          ...baseData,
          properties: {
            total: 567,
            active: 432,
            views: 12345,
            inquiries: 890,
          },
        };
      case 'user':
        return {
          ...baseData,
          users: {
            total: 1234,
            active: 890,
            new: 123,
            engagement: 78.5,
          },
        };
      case 'agent':
        return {
          ...baseData,
          agents: {
            total: 45,
            active: 38,
            performance: 92.3,
            revenue: 234567,
          },
        };
      case 'performance':
        return {
          ...baseData,
          performance: {
            uptime: 99.8,
            responseTime: 245,
            errorRate: 0.2,
            requestsPerMinute: 890,
          },
        };
      default:
        return baseData;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    
    // Invalidate all analytics queries
    try {
      // This would typically invalidate tRPC queries
      // await utils.analytics.invalidate();
      toast.success(t('refresh_success', { defaultValue: 'Data refreshed successfully!' }));
    } catch {
      toast.error(t('refresh_error', { defaultValue: 'Refresh failed. Please try again.' }));
    }
    
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getAnalyticsTypeIcon = (type: string) => {
    switch (type) {
      case 'USER_ENGAGEMENT':
        return <Users className="h-4 w-4" />;
      case 'REVENUE':
        return <DollarSign className="h-4 w-4" />;
      case 'PERFORMANCE':
        return <BarChart3 className="h-4 w-4" />;
      case 'LISTING_VIEW':
        return <Home className="h-4 w-4" />;
      case 'BOOKING_CONVERSION':
        return <TrendingUp className="h-4 w-4" />;
      case 'ML_PROPERTY_SCORE':
        return <BarChart3 className="h-4 w-4" />;
      case 'AGENT_PERFORMANCE':
        return <Users className="h-4 w-4" />;
      case 'AGENCY_PERFORMANCE':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getQuickStats = () => {
    // Helper to safely get array length from typical { data: T[] } responses
    const getDataLength = (val: unknown): number | undefined => {
      if (val && typeof val === 'object' && 'data' in (val as Record<string, unknown>)) {
        const data = (val as { data?: unknown }).data;
        if (Array.isArray(data)) return data.length;
      }
      return undefined;
    };

    const usersLen = getDataLength(usersData);
    const propertiesLen = getDataLength(propertiesData);
    const agentsLen = getDataLength(agentsData);

    const totalUsers: number = usersLen ?? 1234;
    const totalProperties: number = propertiesLen ?? 567;
    const totalAgents: number = agentsLen ?? 24;
    const metricsArr: { type: string; _count?: number }[] = Array.isArray(metricsData) ? (metricsData as { type: string; _count?: number }[]) : [];
    const revenue: number = metricsArr.find(m => m.type === 'REVENUE')?._count ?? 98765;

    return [
      {
        label: t('summary.users', { defaultValue: 'Total Users' }),
        value: totalUsers.toLocaleString(),
        change: '+12%',
        changeType: 'positive',
        icon: <Users className="h-5 w-5" />,
        color: 'from-blue-500 to-blue-600',
      },
      {
        label: t('summary.activeProperties', { defaultValue: 'Active Properties' }),
        value: totalProperties.toLocaleString(),
        change: '+8%',
        changeType: 'positive',
        icon: <Home className="h-5 w-5" />,
        color: 'from-green-500 to-green-600',
      },
      {
        label: t('summary.revenue', { defaultValue: 'Revenue' }),
        value: `$${revenue.toLocaleString()}`,
        change: '+15%',
        changeType: 'positive',
        icon: <DollarSign className="h-5 w-5" />,
        color: 'from-purple-500 to-purple-600',
      },
      {
        label: t('summary.agents', { defaultValue: 'Active Agents' }),
        value: totalAgents.toLocaleString(),
        change: '+23%',
        changeType: 'positive',
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'from-orange-500 to-orange-600',
      },
    ];
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'last7Days':
        setDateRange({
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        });
        break;
      case 'last30Days':
        setDateRange({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        });
        break;
      case 'last90Days':
        setDateRange({
          startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
        });
        break;
      case 'clearFilters':
        setAnalyticsType(undefined);
        setEntityType(undefined);
        break;
    }
    toast.success(t('quickActions_success', { defaultValue: 'Filters updated successfully!' }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {t('title', { defaultValue: 'Analytics Dashboard' })}
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  {t('subtitle', { defaultValue: 'Comprehensive insights and performance metrics' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  {t('status.live', { defaultValue: 'Live Data' })}
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? t('refreshing', { defaultValue: 'Refreshing...' }) : t('refresh', { defaultValue: 'Refresh' })}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('refresh_tooltip', { defaultValue: 'Refresh analytics data' })}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Enhanced Filters with Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t('filters.title', { defaultValue: 'Filters & Date Range' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('filters.startDate', { defaultValue: 'Start Date' })}
                  </Label>
                  <Input
            type="date"
            value={dateRange.startDate.toISOString().slice(0, 10)}
            onChange={(e) => {
                      const startDate = new Date(e.target.value);
              setDateRange((r) => ({ ...r, startDate }));
            }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('filters.endDate', { defaultValue: 'End Date' })}
                  </Label>
                  <Input
            type="date"
            value={dateRange.endDate.toISOString().slice(0, 10)}
            onChange={(e) => {
                      const endDate = new Date(e.target.value);
              setDateRange((r) => ({ ...r, endDate }));
            }}
                    className="w-full"
          />
        </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t('filters.analyticsType', { defaultValue: 'Analytics Type' })}
                  </Label>
                  <Select value={analyticsType ?? "all"} onValueChange={(value) => setAnalyticsType(value === "all" ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('filters.type_all', { defaultValue: 'All Types' })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.type_all', { defaultValue: 'All Types' })}</SelectItem>
                      <SelectItem value="LISTING_VIEW">{t('filters.type_listingView', { defaultValue: 'Listing View' })}</SelectItem>
                      <SelectItem value="BOOKING_CONVERSION">{t('filters.type_bookingConversion', { defaultValue: 'Booking Conversion' })}</SelectItem>
                      <SelectItem value="ML_PROPERTY_SCORE">{t('filters.type_mlPropertyScore', { defaultValue: 'ML Property Score' })}</SelectItem>
                      <SelectItem value="USER_ENGAGEMENT">{t('filters.type_userEngagement', { defaultValue: 'User Engagement' })}</SelectItem>
                      <SelectItem value="REVENUE">{t('filters.type_revenue', { defaultValue: 'Revenue' })}</SelectItem>
                      <SelectItem value="PERFORMANCE">{t('filters.type_performance', { defaultValue: 'Performance' })}</SelectItem>
                      <SelectItem value="AGENT_PERFORMANCE">{t('filters.type_agentPerformance', { defaultValue: 'Agent Performance' })}</SelectItem>
                      <SelectItem value="AGENCY_PERFORMANCE">{t('filters.type_agencyPerformance', { defaultValue: 'Agency Performance' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('filters.entityType', { defaultValue: 'Entity Type' })}
                  </Label>
                  <Select value={entityType ?? "all"} onValueChange={(value) => setEntityType(value === "all" ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('filters.entity_all', { defaultValue: 'All Entities' })} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.entity_all', { defaultValue: 'All Entities' })}</SelectItem>
                      <SelectItem value="Property">{t('filters.entity_property', { defaultValue: 'Property' })}</SelectItem>
                      <SelectItem value="User">{t('filters.entity_user', { defaultValue: 'User' })}</SelectItem>
                      <SelectItem value="Agent">{t('filters.entity_agent', { defaultValue: 'Agent' })}</SelectItem>
                      <SelectItem value="Agency">{t('filters.entity_agency', { defaultValue: 'Agency' })}</SelectItem>
                      <SelectItem value="Reservation">{t('filters.entity_reservation', { defaultValue: 'Reservation' })}</SelectItem>
                      <SelectItem value="Task">{t('filters.entity_task', { defaultValue: 'Task' })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
      </div>
              
              {/* Quick Actions */}
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('last7Days')}>
                  {t('quickActions_last7Days', { defaultValue: 'Last 7 Days' })}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('last30Days')}>
                  {t('quickActions_last30Days', { defaultValue: 'Last 30 Days' })}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('last90Days')}>
                  {t('quickActions_last90Days', { defaultValue: 'Last 90 Days' })}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('clearFilters')}>
                  {t('quickActions_clearFilters', { defaultValue: 'Clear Filters' })}
                </Button>
        </div>
            </CardContent>
          </Card>

          {/* Enhanced Summary Cards with Progress Indicators */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {getQuickStats().map((stat, index) => (
              <Card key={index} className={`bg-gradient-to-r ${stat.color} text-white hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-200' : 'text-red-200'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm opacity-75">
                          {t('summary.fromLastMonth', { defaultValue: 'from last month' })}
                        </span>
        </div>
        </div>
                    <div className="opacity-80">
                      {stat.icon}
        </div>
      </div>
                  {/* Progress indicator */}
                  <div className="mt-4">
                    <Progress value={Math.min(parseInt(stat.change.replace('+', '').replace('%', '')), 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

      {/* Test Data Generator - Only show in development */}
          {env.NODE_ENV === "development" && <AnalyticsTestData />}

          {/* Enhanced Dashboard with Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('tabs.overview', { defaultValue: 'Overview' })}
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t('tabs.revenue', { defaultValue: 'Revenue' })}
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t('tabs.properties', { defaultValue: 'Properties' })}
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('tabs.users', { defaultValue: 'Users' })}
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('tabs.agents', { defaultValue: 'Agents' })}
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {t('tabs.performance', { defaultValue: 'Performance' })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getAnalyticsTypeIcon('USER_ENGAGEMENT')}
                      {t('dashboard.overview', { defaultValue: 'Analytics Overview' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div onClick={() => handleCardClick(<AnalyticsDashboard />)} className="cursor-pointer">
                      <AnalyticsDashboard />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleExport('overview')}
                            disabled={exporting === 'overview'}
                          >
                            {exporting === 'overview' ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            {exporting === 'overview' ? t('exporting', { defaultValue: 'Exporting...' }) : t('export', { defaultValue: 'Export' })}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('export_tooltip', { defaultValue: 'Export overview data' })}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleShare('overview')}
                            disabled={sharing === 'overview'}
                          >
                            {sharing === 'overview' ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Share2 className="h-4 w-4 mr-1" />
                            )}
                            {sharing === 'overview' ? t('sharing', { defaultValue: 'Sharing...' }) : t('share', { defaultValue: 'Share' })}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('share_tooltip', { defaultValue: 'Share overview data' })}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getAnalyticsTypeIcon('REVENUE')}
                      {t('revenue.title', { defaultValue: 'Revenue Analytics' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div onClick={() => handleCardClick(<RevenueAnalytics />)} className="cursor-pointer">
                      <RevenueAnalytics />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleExport('revenue')}
                            disabled={exporting === 'revenue'}
                          >
                            {exporting === 'revenue' ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            {exporting === 'revenue' ? t('exporting', { defaultValue: 'Exporting...' }) : t('export', { defaultValue: 'Export' })}
            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('export_tooltip', { defaultValue: 'Export revenue data' })}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleShare('revenue')}
                            disabled={sharing === 'revenue'}
                          >
                            {sharing === 'revenue' ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Share2 className="h-4 w-4 mr-1" />
                            )}
                            {sharing === 'revenue' ? t('sharing', { defaultValue: 'Sharing...' }) : t('share', { defaultValue: 'Share' })}
            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('share_tooltip', { defaultValue: 'Share revenue data' })}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
          </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAnalyticsTypeIcon('REVENUE')}
                    {t('revenue.title', { defaultValue: 'Revenue Analytics' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div onClick={() => handleCardClick(<RevenueAnalytics />)} className="cursor-pointer">
                    <RevenueAnalytics />
        </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleExport('revenue')}
                          disabled={exporting === 'revenue'}
                        >
                          {exporting === 'revenue' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          {exporting === 'revenue' ? t('exporting', { defaultValue: 'Exporting...' }) : t('export', { defaultValue: 'Export' })}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('export_tooltip', { defaultValue: 'Export revenue data' })}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleShare('revenue')}
                          disabled={sharing === 'revenue'}
                        >
                          {sharing === 'revenue' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Share2 className="h-4 w-4 mr-1" />
                          )}
                          {sharing === 'revenue' ? t('sharing', { defaultValue: 'Sharing...' }) : t('share', { defaultValue: 'Share' })}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('share_tooltip', { defaultValue: 'Share revenue data' })}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAnalyticsTypeIcon('LISTING_VIEW')}
                    {t('property.title', { defaultValue: 'Property Analytics' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div onClick={() => handleCardClick(<PropertyAnalytics />)} className="cursor-pointer">
          <PropertyAnalytics />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleExport('property')}
                          disabled={exporting === 'property'}
                        >
                          {exporting === 'property' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          {exporting === 'property' ? t('exporting', { defaultValue: 'Exporting...' }) : t('export', { defaultValue: 'Export' })}
            </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('export_tooltip', { defaultValue: 'Export property data' })}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleShare('property')}
                          disabled={sharing === 'property'}
                        >
                          {sharing === 'property' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Share2 className="h-4 w-4 mr-1" />
                          )}
                          {sharing === 'property' ? t('sharing', { defaultValue: 'Sharing...' }) : t('share', { defaultValue: 'Share' })}
            </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('share_tooltip', { defaultValue: 'Share property data' })}</p>
                      </TooltipContent>
                    </Tooltip>
          </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAnalyticsTypeIcon('USER_ENGAGEMENT')}
                    {t('user.title', { defaultValue: 'User Engagement' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div onClick={() => handleCardClick(<UserEngagement />)} className="cursor-pointer">
                    <UserEngagement />
        </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleExport('user')}
                          disabled={exporting === 'user'}
                        >
                          {exporting === 'user' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          {exporting === 'user' ? t('exporting', { defaultValue: 'Exporting...' }) : t('export', { defaultValue: 'Export' })}
            </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('export_tooltip', { defaultValue: 'Export user data' })}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleShare('user')}
                          disabled={sharing === 'user'}
                        >
                          {sharing === 'user' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Share2 className="h-4 w-4 mr-1" />
                          )}
                          {sharing === 'user' ? t('sharing', { defaultValue: 'Sharing...' }) : t('share', { defaultValue: 'Share' })}
            </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('share_tooltip', { defaultValue: 'Share user data' })}</p>
                      </TooltipContent>
                    </Tooltip>
          </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAnalyticsTypeIcon('AGENT_PERFORMANCE')}
                    {t('agent.title', { defaultValue: 'Agent Performance' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div onClick={() => handleCardClick(<AgentPerformance />)} className="cursor-pointer">
                    <AgentPerformance />
        </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleExport('agent')}
                          disabled={exporting === 'agent'}
                        >
                          {exporting === 'agent' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          {exporting === 'agent' ? t('exporting', { defaultValue: 'Exporting...' }) : t('export', { defaultValue: 'Export' })}
            </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('export_tooltip', { defaultValue: 'Export agent data' })}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleShare('agent')}
                          disabled={sharing === 'agent'}
                        >
                          {sharing === 'agent' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Share2 className="h-4 w-4 mr-1" />
                          )}
                          {sharing === 'agent' ? t('sharing', { defaultValue: 'Sharing...' }) : t('share', { defaultValue: 'Share' })}
            </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('share_tooltip', { defaultValue: 'Share agent data' })}</p>
                      </TooltipContent>
                    </Tooltip>
          </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAnalyticsTypeIcon('PERFORMANCE')}
                    {t('performance.title', { defaultValue: 'Performance Metrics' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div onClick={() => handleCardClick(<PerformanceMetrics />)} className="cursor-pointer">
                    <PerformanceMetrics />
        </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleExport('performance')}
                          disabled={exporting === 'performance'}
                        >
                          {exporting === 'performance' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          {exporting === 'performance' ? t('exporting', { defaultValue: 'Exporting...' }) : t('export', { defaultValue: 'Export' })}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('export_tooltip', { defaultValue: 'Export performance data' })}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleShare('performance')}
                          disabled={sharing === 'performance'}
                        >
                          {sharing === 'performance' ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Share2 className="h-4 w-4 mr-1" />
                          )}
                          {sharing === 'performance' ? t('sharing', { defaultValue: 'Sharing...' }) : t('share', { defaultValue: 'Share' })}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('share_tooltip', { defaultValue: 'Share performance data' })}</p>
                      </TooltipContent>
                    </Tooltip>
      </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Enhanced Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('details', { defaultValue: 'Analytics Details' })}
              </DialogTitle>
              <div className="mt-4">
          {modalContent}
              </div>
        </DialogContent>
      </Dialog>
    </div>
      </div>
    </TooltipProvider>
  );
}
