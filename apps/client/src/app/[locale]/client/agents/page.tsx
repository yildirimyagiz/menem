"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Activity, Building2, CheckCircle, ChevronLeft, ChevronRight, Globe, Mail, Phone, Search, TrendingUp, Users } from "lucide-react";
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

// Agent Statistics Component - Updated to match agencies layout
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
                  {stats.total ?? 0}
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
                  {stats.active ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('statistics.pending')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pending ?? 0}
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
                  {stats.suspended ?? 0}
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
  handleViewProfile: (agentId: string) => void;
}>(({ agent, handleViewProfile }) => {
  const t = useTranslations("agent");
  
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
            imgUrl={agent.logoUrl ?? ""}
            hasChecked={agent.isActive}
            hasCheckedClass="w-6 h-6 -top-1 right-1"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
              {agent.name ?? t('name')}
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
                {agent.status?.replace("_", " ") ?? t('status')}
              </Badge>
              {agent.agency && (
                <>
                  <Badge variant="secondary">
                    {agent.agency.status ? t(`statusValues.${agent.agency.status}`) : t('unknown')}
                  </Badge>
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
        </div>

        {/* Quick Stats */}
        <div className="mb-4 grid grid-cols-3 gap-4 text-center">
          <div className="agent-stat-item">
            <Building2 className="agent-stat-icon" />
            <span className="agent-stat-value">{agent._count?.Property ?? 0}</span>
            <span className="agent-stat-label">{t('properties')}</span>
          </div>
          <div className="agent-stat-item">
            <Users className="agent-stat-icon" />
            <span className="agent-stat-value">{agent._count?.Reservation ?? 0}</span>
            <span className="agent-stat-label">{t('reservations')}</span>
          </div>
          <div className="agent-stat-item">
            <Activity className="agent-stat-icon" />
            <span className="agent-stat-value">{agent._count?.Review ?? 0}</span>
            <span className="agent-stat-label">{t('reviews')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Link
            href={`/client/agents/${agent.id}`}
            className="agent-card-action"
            onClick={() => handleViewProfile(agent.id)}
          >
            <span>{t('viewProfile')}</span>
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
                <Mail className="mr-2 h-4 w-4" />
                {t('contact')}
              </Button>
            )}
            {agent.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleVisitWebsite}
                className="flex-1"
              >
                <Globe className="mr-2 h-4 w-4" />
                {t('website')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Enhanced Loading Skeleton - Updated to match agencies
const LoadingSkeleton = () => {
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
};

// API Status Component - New component to match agencies
const APIStatusComponent = ({ 
  agentsResponse, 
  agentStats 
}: { 
  agentsResponse: any;
  agentStats: any;
}) => {
  const t = useTranslations("agent");
  
  return (
    <div className="mb-6">
      <Card className="api-status-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="api-status-item">
              <div className="api-status-icon">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="api-status-content">
                <h4 className="api-status-title">{t('apiStatus.agents')}</h4>
                <p className="api-status-value">
                  {(agentsResponse)?.data?.total ?? 0}
                </p>
              </div>
            </div>
            
            <div className="api-status-item">
              <div className="api-status-icon">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="api-status-content">
                <h4 className="api-status-title">{t('apiStatus.active')}</h4>
                <p className="api-status-value">
                  {agentStats?.active ?? 0}
                </p>
              </div>
            </div>
            
            <div className="api-status-item">
              <div className="api-status-icon">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="api-status-content">
                <h4 className="api-status-title">{t('apiStatus.pending')}</h4>
                <p className="api-status-value">
                  {agentStats?.pending ?? 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
    <div className="mt-8 flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ErrorComponent = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center">
      <h2 className="mb-4 text-2xl font-bold text-red-600">{t('error.title')}</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">{t('error.message')}</p>
      <Button onClick={() => window.location.reload()}>
        {t('error.retry')}
      </Button>
    </div>
  </div>
);

const EmptyState = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center">
      <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{t('empty.title')}</h2>
      <p className="text-gray-600 dark:text-gray-400">{t('empty.message')}</p>
    </div>
  </div>
);

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
  } = (api as any).agent.public.useQuery(
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

  // Fetch agent statistics
  const { data: agentStats } = (api as any).agent.stats.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  );

  // Memoized agents data
  const agents = useMemo(() => {
    const arr = (agentsResponse)?.data?.data;
    return Array.isArray(arr) ? arr : [];
  }, [agentsResponse]);

  // Memoized pagination data
  const paginationData = useMemo(() => {
    const response = agentsResponse;
    return {
      page: response?.data?.page ?? 1,
      pageSize: response?.data?.pageSize ?? pageSize,
      total: response?.data?.total ?? 0,
      totalPages: response?.data?.totalPages ?? 1,
      hasNextPage: response?.data?.hasNextPage ?? false,
      hasPreviousPage: response?.data?.hasPreviousPage ?? false,
    };
  }, [agentsResponse, pageSize]);

  // Memoized event handlers
  const handleViewProfile = useCallback((agentId: string) => {
    // Analytics tracking could be added here
    console.log(`Viewing agent profile: ${agentId}`);
  }, []);

  // Memoized agent cards
  const agentCards = useMemo(() => {
    return agents.map((agent: any) => (
      <AgentCard
        key={agent.id}
        agent={agent}
        handleViewProfile={handleViewProfile}
      />
    ));
  }, [agents, handleViewProfile]);

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
    return <LoadingSkeleton />;
  }

  // Error state
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
          {t('showingResults', { 
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
          {t('clearFilters')}
        </Button>
      </div>

      {Array.isArray(agents) && agents.length > 0 ? (
        <>
          <AgentStats stats={agentStats} />
          <APIStatusComponent 
            agentsResponse={agentsResponse} 
            agentStats={agentStats} 
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
