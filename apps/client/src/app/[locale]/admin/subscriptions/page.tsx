"use client";

import {
  Building2,
  CheckCircle,
  Crown,
  Edit,
  Eye,
  RefreshCw,
  Search,
  Trash2,
  Users
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";

import { api } from "~/trpc/react";

interface SubscriptionPackage {
  tier: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  description?: string;
}

interface Subscription {
  id: string;
  tier: string;
  status: string;
  startDate: string;
  endDate: string;
  isAutoRenew: boolean;
  entityId: string;
  entityType: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
  Agency?: {
    id: string;
    name: string;
  } | null;
  Agent?: {
    id: string;
    name: string;
  } | null;
}

const AdminSubscriptionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch all subscriptions with pagination and filters
  const {
    data: subscriptionsResponse,
    isLoading: subscriptionsLoading,
    refetch: refetchSubscriptions,
  } = api.subscription.all.useQuery({
    page,
    pageSize,
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    tier: tierFilter !== "all" ? (tierFilter as any) : undefined,
  });

  // Fetch available subscription packages
  const { data: subscriptionPackages, isLoading: packagesLoading } =
    api.subscription.listPackages.useQuery();

  // Update subscription mutation
  const updateSubscriptionMutation = api.subscription.update.useMutation({
    onSuccess: () => {
      toast.success("Subscription updated successfully!");
      refetchSubscriptions();
    },
    onError: (error) => {
      toast.error(`Failed to update subscription: ${error.message}`);
    },
  });

  // Delete subscription mutation
  const deleteSubscriptionMutation = api.subscription.delete.useMutation({
    onSuccess: () => {
      toast.success("Subscription deleted successfully!");
      refetchSubscriptions();
    },
    onError: (error) => {
      toast.error(`Failed to delete subscription: ${error.message}`);
    },
  });

  const subscriptions = (subscriptionsResponse as any)?.data || [];
  const totalSubscriptions = (subscriptionsResponse as any)?.total || 0;
  const packages = subscriptionPackages || [];

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter((sub: Subscription) => {
    const matchesSearch =
      searchQuery === "" ||
      sub.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.tier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.Agency?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.Agent?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEntityType =
      entityTypeFilter === "all" || sub.entityType === entityTypeFilter;

    return matchesSearch && matchesEntityType;
  });

  // Subscription status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "TRIAL":
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case "EXPIRED":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "SUSPENDED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Subscription tier badge
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "BASIC":
        return <Badge className="bg-gray-100 text-gray-800">Basic</Badge>;
      case "PRO":
        return <Badge className="bg-blue-100 text-blue-800">Pro</Badge>;
      case "ENTERPRISE":
        return (
          <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{tier}</Badge>;
    }
  };

  // Get subscription package info
  const getSubscriptionPackage = (tier: string) => {
    return packages.find((pkg: SubscriptionPackage) => pkg.tier === tier);
  };

  // Calculate statistics
  const stats = {
    total: totalSubscriptions,
    active: subscriptions.filter((sub: Subscription) => sub.status === "ACTIVE")
      .length,
    trial: subscriptions.filter((sub: Subscription) => sub.status === "TRIAL")
      .length,
    expired: subscriptions.filter(
      (sub: Subscription) => sub.status === "EXPIRED",
    ).length,
    suspended: subscriptions.filter(
      (sub: Subscription) => sub.status === "SUSPENDED",
    ).length,
    agencies: subscriptions.filter(
      (sub: Subscription) => sub.entityType === "AGENCY",
    ).length,
    agents: subscriptions.filter(
      (sub: Subscription) => sub.entityType === "AGENT",
    ).length,
  };

  const handleDeleteSubscription = (subscriptionId: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      deleteSubscriptionMutation.mutate(subscriptionId);
    }
  };

  const handleRefresh = () => {
    refetchSubscriptions();
  };

  if (subscriptionsLoading || packagesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="ml-3">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage all subscriptions across the platform
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Subscriptions
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agencies</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.agencies}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agents</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.agents}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="TRIAL">Trial</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="BASIC">Basic</SelectItem>
                <SelectItem value="PRO">Pro</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={entityTypeFilter}
              onValueChange={setEntityTypeFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="AGENCY">Agency</SelectItem>
                <SelectItem value="AGENT">Agent</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={subscriptionsLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${subscriptionsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Subscriptions ({filteredSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Auto-renew
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredSubscriptions.map((subscription: Subscription) => {
                  const packageInfo = getSubscriptionPackage(subscription.tier);
                  const entityName =
                    subscription.Agency?.name ||
                    subscription.Agent?.name ||
                    subscription.entityId;

                  return (
                    <tr key={`subscription-${subscription.id}`} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entityName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subscription.entityType}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTierBadge(subscription.tier)}
                          {packageInfo && (
                            <span className="text-sm text-gray-500">
                              ${packageInfo.price}/month
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(subscription.status)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge
                          className={
                            subscription.isAutoRenew
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {subscription.isAutoRenew ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteSubscription(subscription.id)
                            }
                            disabled={deleteSubscriptionMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalSubscriptions > pageSize && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, totalSubscriptions)} of{" "}
            {totalSubscriptions} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page * pageSize >= totalSubscriptions}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;
