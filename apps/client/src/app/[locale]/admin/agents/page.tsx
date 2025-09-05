"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Activity, Building2, Calendar, CheckCircle, ChevronLeft, ChevronRight, Globe, Mail, MapPin, Phone, Search, TrendingUp, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@reservatior/ui/select";

import Avatar from "~/shared/Avatar";
import { api } from "~/trpc/react";

// Agent Statistics Component
const AgentStats = ({ stats }: { stats: any }) => {
  const t = useTranslations("agent");
  
  if (!stats) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        {t('statistics.title')}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('statistics.total')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('statistics.active')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.active || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('statistics.pending')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pending || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('statistics.suspended')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.suspended || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Agent Card Component
const AgentCard = React.memo<{
  agent: any;
  subscription: any;
  subscriptionPackage: any;
  getStatusBadge: (status: string) => React.ReactNode;
  getTierBadge: (tier: string) => React.ReactNode;
}>(
  ({
    agent,
    subscription,
    subscriptionPackage,
    getStatusBadge,
    getTierBadge,
  }) => {
    const handleViewProfile = useCallback(() => {
      // Analytics tracking could be added here
      console.log(`Viewing agent profile: ${agent.id}`);
    }, [agent.id]);

    const handleContactAgent = useCallback(() => {
      if (agent.email) {
        window.open(`mailto:${agent.email}`, '_blank');
      }
    }, [agent.email]);

    const handleVisitWebsite = useCallback(() => {
      if (agent.website) {
        window.open(agent.website, '_blank');
      }
    }, [agent.website]);

    return (
      <Card className="agent-listing-card group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start space-x-4">
            <Avatar
              sizeClass="h-14 w-14 text-lg"
              imgUrl={agent.avatarUrl ?? ""}
              hasChecked={agent.isActive}
              hasCheckedClass="w-6 h-6 -top-1 right-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {agent.name ?? "Agent"}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {agent.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={agent.isActive ? "default" : "secondary"}>
                  {agent.status?.replace("_", " ") || "Agent"}
                </Badge>
                {subscription && (
                  <>
                    {getStatusBadge(subscription.status)}
                    {getTierBadge(subscription.tier)}
                  </>
                )}
              </div>
            </div>
          </div>

          {agent.bio && (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {agent.bio}
            </p>
          )}

          {/* Contact Information */}
          <div className="mb-4 space-y-2">
            {agent.phoneNumber && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{agent.phoneNumber}</span>
              </div>
            )}
            {agent.website && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Globe className="h-4 w-4" />
                <a
                  href={agent.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate dark:text-blue-400"
                >
                  {agent.website}
                </a>
              </div>
            )}
            {agent.address && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{agent.address}</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mb-4 grid grid-cols-3 gap-4 text-center">
            <div className="agent-stat-item">
              <Building2 className="agent-stat-icon" />
              <span className="agent-stat-value">{agent._count?.Property || 0}</span>
              <span className="agent-stat-label">Properties</span>
            </div>
            <div className="agent-stat-item">
              <Users className="agent-stat-icon" />
              <span className="agent-stat-value">{agent._count?.Client || 0}</span>
              <span className="agent-stat-label">Clients</span>
            </div>
            <div className="agent-stat-item">
              <Activity className="agent-stat-icon" />
              <span className="agent-stat-value">{agent._count?.Transaction || 0}</span>
              <span className="agent-stat-label">Transactions</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Link
              href={`/admin/agents/${agent.id}`}
              className="agent-card-action"
              onClick={handleViewProfile}
            >
              <span>View Profile</span>
              <ArrowRightIcon className="agent-card-action-icon" />
            </Link>
            
            <div className="flex space-x-2">
              {agent.email && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactAgent}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              )}
              {agent.website && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVisitWebsite}
                  className="flex-1"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Website
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

// Empty State Component
const EmptyState = ({ t }: { t: ReturnType<typeof useTranslations> }) => {
  return (
    <Card className="agent-empty-state">
      <CardContent className="p-12 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {t('noData')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('noDataDescription')}
        </p>
      </CardContent>
    </Card>
  );
};

// Error Component
const ErrorComponent = ({ t }: { t: ReturnType<typeof useTranslations> }) => {
  return (
    <Card className="agent-error-state">
      <CardContent className="p-12 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {t('errorLoading')}
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {t('noDataDescription')}
        </p>
        <Button onClick={() => window.location.reload()}>
          {t('retry')}
        </Button>
      </CardContent>
    </Card>
  );
};

// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      {getPageNumbers().map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
          disabled={typeof page !== 'number'}
          className={typeof page !== 'number' ? 'cursor-default' : ''}
        >
          {page}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// API Status Component
const APIStatusComponent = ({ 
  agentsResponse, 
  agentStats, 
  subscriptionPackages, 
  subscriptionsResponse,
  featuredProperties 
}: { 
  agentsResponse: any;
  agentStats: any;
  subscriptionPackages: any;
  subscriptionsResponse: any;
  featuredProperties: any;
}) => {
  const t = useTranslations("agent");
  
  const apiStatuses = [
    {
      name: "Agents API",
      status: agentsResponse ? "✅ Connected" : "❌ Disconnected",
      data: agentsResponse?.data?.data?.length || 0,
      label: "agents"
    },
    {
      name: "Statistics API", 
      status: agentStats ? "✅ Connected" : "❌ Disconnected",
      data: agentStats?.total || 0,
      label: "total agents"
    },
    {
      name: "Subscription Packages API",
      status: subscriptionPackages ? "✅ Connected" : "❌ Disconnected", 
      data: subscriptionPackages?.length || 0,
      label: "packages"
    },
    {
      name: "Subscriptions API",
      status: subscriptionsResponse ? "✅ Connected" : "❌ Disconnected",
      data: subscriptionsResponse?.data?.data?.length || 0,
      label: "subscriptions"
    },
    {
      name: "Featured Properties API",
      status: featuredProperties ? "✅ Connected" : "❌ Disconnected",
      data: featuredProperties?.length || 0,
      label: "properties"
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t('apiStatus.title')}
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {apiStatuses.map((api, index) => (
          <Card key={index} className="api-status-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {api.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {api.data} {api.label}
                  </p>
                </div>
                <span className={`text-xs font-medium ${
                  api.status.includes('✅') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {api.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AgentsPage = () => {
  const t = useTranslations("agent");

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "ACTIVE" | "SUSPENDED" | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Fetch agents with caching and stale-while-revalidate
  const {
    data: agentsResponse,
    isLoading,
    isError,
    refetch: refetchAgents,
  } = api.agent.all.useQuery(
    {
      page: currentPage,
      pageSize,
      search: searchTerm || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      sortBy: sortBy as any,
      sortOrder,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
    },
  );

  // Fetch subscription packages with caching
  const { data: subscriptionPackages } = api.subscription.listPackages.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  );

  // Fetch agent statistics
  const { data: agentStats } = api.agent.stats.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  );

  // Fetch featured properties for agents
  const { data: featuredProperties } = api.property.public.featured.useQuery(
    { limit: 6 },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  );

  // Fetch analytics data for agents (if available)
  const { data: analyticsData } = api.analytics.all.useQuery(
    {
      entityType: "AGENT",
      page: 1,
      pageSize: 10,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      enabled: false, // Disabled for now as it might require authentication
    },
  );

  // Memoized agents data
  const agents = useMemo(() => {
    const arr = (agentsResponse as any)?.data?.data;
    return Array.isArray(arr) ? arr : [];
  }, [agentsResponse]);

  // Memoized pagination data
  const paginationData = useMemo(() => {
    const response = agentsResponse as any;
    return {
      page: response?.data?.page || 1,
      pageSize: response?.data?.pageSize || pageSize,
      total: response?.data?.total || 0,
      totalPages: response?.data?.totalPages || 1,
      hasNextPage: response?.data?.hasNextPage || false,
      hasPreviousPage: response?.data?.hasPreviousPage || false,
    };
  }, [agentsResponse, pageSize]);

  // Memoized agent IDs for subscription query
  const agentIds = useMemo(() => {
    return agents.map((agent: any) => agent.id);
  }, [agents]);

  // Fetch subscriptions for all agents with conditional query
  const { data: subscriptionsResponse } = api.subscription.all.useQuery(
    {
      entityType: "AGENT",
      page: 1,
      pageSize: 100,
    },
    {
      enabled: agentIds.length > 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  );

  // Memoized subscriptions data
  const subscriptions = useMemo(() => {
    const data = (subscriptionsResponse as any)?.data?.data;
    return Array.isArray(data) ? data : [];
  }, [subscriptionsResponse]);

  // Memoized helper functions
  const getAgentSubscription = useCallback(
    (agentId: string) => {
      return subscriptions.find(
        (sub: any) =>
          sub.entityId === agentId &&
          (sub.status === "ACTIVE" || sub.status === "TRIAL"),
      );
    },
    [subscriptions],
  );

  const getSubscriptionPackage = useCallback(
    (tier: string) => {
      return subscriptionPackages?.find((pkg: any) => pkg.tier === tier);
    },
    [subscriptionPackages],
  );

  // Memoized badge components
  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-xs text-green-800">Active</Badge>
        );
      case "TRIAL":
        return (
          <Badge className="bg-blue-100 text-xs text-blue-800">Trial</Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-red-100 text-xs text-red-800">Expired</Badge>
        );
      case "SUSPENDED":
        return (
          <Badge className="bg-yellow-100 text-xs text-yellow-800">
            Suspended
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-xs text-gray-800">{status}</Badge>
        );
    }
  }, []);

  const getTierBadge = useCallback((tier: string) => {
    switch (tier) {
      case "BASIC":
        return (
          <Badge className="bg-gray-100 text-xs text-gray-800">Basic</Badge>
        );
      case "PRO":
        return <Badge className="bg-blue-100 text-xs text-blue-800">Pro</Badge>;
      case "ENTERPRISE":
        return (
          <Badge className="bg-purple-100 text-xs text-purple-800">
            Enterprise
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-xs text-gray-800">{tier}</Badge>
        );
    }
  }, []);

  // Memoized agent cards
  const agentCards = useMemo(() => {
    return agents.map((agent: any) => {
      const subscription = getAgentSubscription(agent.id);
      const subscriptionPackage = subscription
        ? getSubscriptionPackage(subscription.tier)
        : null;

      return (
        <AgentCard
          key={agent.id}
          agent={agent}
          subscription={subscription}
          subscriptionPackage={subscriptionPackage}
          getStatusBadge={getStatusBadge}
          getTierBadge={getTierBadge}
        />
      );
    });
  }, [
    agents,
    getAgentSubscription,
    getSubscriptionPackage,
    getStatusBadge,
    getTierBadge,
  ]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-8 h-8 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorComponent t={t} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('description')}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="agent-filter-card mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value as "PENDING" | "ACTIVE" | "SUSPENDED" | "ALL");
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('statusValues.ALL')}</SelectItem>
                <SelectItem value="ACTIVE">{t('statusValues.ACTIVE')}</SelectItem>
                <SelectItem value="PENDING">{t('statusValues.PENDING')}</SelectItem>
                <SelectItem value="SUSPENDED">{t('statusValues.SUSPENDED')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select 
              value={sortBy} 
              onValueChange={(value) => {
                setSortBy(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">{t('sortByValues.createdAt')}</SelectItem>
                <SelectItem value="name">{t('sortByValues.name')}</SelectItem>
                <SelectItem value="status">{t('sortByValues.status')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select 
              value={sortOrder} 
              onValueChange={(value) => {
                setSortOrder(value as "asc" | "desc");
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('sortOrder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t('sortOrderValues.desc')}</SelectItem>
                <SelectItem value="asc">{t('sortOrderValues.asc')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('agent.showingResults', { 
            showing: agents.length, 
            total: paginationData.total,
            page: currentPage,
            totalPages: paginationData.totalPages
          })}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("ALL");
            setSortBy("createdAt");
            setSortOrder("desc");
            setCurrentPage(1);
          }}
        >
          {t('agent.clearFilters')}
        </Button>
      </div>

      {Array.isArray(agents) && agents.length > 0 ? (
        <>
          <AgentStats stats={agentStats} />
          <APIStatusComponent 
            agentsResponse={agentsResponse} 
            agentStats={agentStats} 
            subscriptionPackages={subscriptionPackages} 
            subscriptionsResponse={subscriptionsResponse}
            featuredProperties={featuredProperties} 
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agentCards}
          </div>
          
          {/* Pagination */}
          {paginationData.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <EmptyState t={t} />
      )}
    </div>
  );
};

export default React.memo(AgentsPage);
