"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Edit,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";
import { Label } from "@reservatior/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Switch } from "@reservatior/ui/switch";

import { api } from "~/trpc/react";

interface Subscription {
  id: string;
  tier: string;
  status: string;
  startDate: string | Date;
  endDate: string | Date;
  isAutoRenew: boolean;
  entityId: string;
  entityType: string;
  features: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
  Agency?: {
    id: string;
    name: string;
  } | null;
  Agent?: {
    id: string;
    name: string;
  } | null;
}

interface EditData {
  tier?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  isAutoRenew?: boolean;
}

const SubscriptionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.subscriptionId as string;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({});

  // Fetch subscription details
  const {
    data: subscription,
    isLoading,
    refetch,
  } = api.subscription.byId.useQuery({ id: subscriptionId });

  // Update subscription mutation
  const updateMutation = api.subscription.update.useMutation({
    onSuccess: () => {
      toast.success("Subscription updated successfully!");
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update subscription: ${error.message}`);
    },
  });

  // Delete subscription mutation
  const deleteMutation = api.subscription.delete.useMutation({
    onSuccess: () => {
      toast.success("Subscription deleted successfully!");
      router.push("/admin/subscription");
    },
    onError: (error) => {
      toast.error(`Failed to delete subscription: ${error.message}`);
    },
  });

  const handleEdit = () => {
    setEditData({
      tier: subscription?.tier,
      status: subscription?.status,
      startDate: subscription?.startDate
        ? formatDateForInput(subscription.startDate)
        : undefined,
      endDate: subscription?.endDate
        ? formatDateForInput(subscription.endDate)
        : undefined,
      isAutoRenew: subscription?.isAutoRenew,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (subscription) {
      updateMutation.mutate({
        id: subscription.id,
        status: editData.status as
          | "ACTIVE"
          | "INACTIVE"
          | "SUSPENDED"
          | "EXPIRED"
          | undefined,
        startDate: editData.startDate
          ? new Date(editData.startDate)
          : undefined,
        endDate: editData.endDate ? new Date(editData.endDate) : undefined,
        isAutoRenew: editData.isAutoRenew,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      deleteMutation.mutate(subscriptionId);
    }
  };

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

  // Helper function to format date for input field
  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return "";
    if (typeof date === "string") {
      const parts = date.split("T");
      return parts[0] || "";
    }
    return date.toISOString().split("T")[0] || "";
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date: string | Date | undefined): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="ml-3">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-lg text-gray-500">Subscription not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/subscription")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subscriptions
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Subscription Details</h1>
            <p className="text-muted-foreground">ID: {subscription.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={handleDelete} variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Entity</Label>
              <p className="mt-1 text-sm text-gray-600">
                {subscription.Agency?.name ||
                  subscription.Agent?.name ||
                  subscription.entityId}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Entity Type</Label>
              <p className="mt-1 text-sm text-gray-600">
                {subscription.entityType}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Subscription Tier</Label>
              <div className="mt-1">
                {isEditing ? (
                  <Select
                    value={editData.tier ?? subscription.tier}
                    onValueChange={(value) =>
                      setEditData({ ...editData, tier: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="PRO">Pro</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getTierBadge(subscription.tier)
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">
                {isEditing ? (
                  <Select
                    value={editData.status ?? subscription.status}
                    onValueChange={(value) =>
                      setEditData({ ...editData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="TRIAL">Trial</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getStatusBadge(subscription.status)
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates and Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dates & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Start Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={
                    editData.startDate ??
                    formatDateForInput(subscription.startDate)
                  }
                  onChange={(e) =>
                    setEditData({ ...editData, startDate: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-600">
                  {formatDateForDisplay(subscription.startDate)}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">End Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={
                    editData.endDate ?? formatDateForInput(subscription.endDate)
                  }
                  onChange={(e) =>
                    setEditData({ ...editData, endDate: e.target.value })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-600">
                  {formatDateForDisplay(subscription.endDate)}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Auto Renew</Label>
              <div className="mt-1 flex items-center space-x-2">
                {isEditing ? (
                  <Switch
                    checked={editData.isAutoRenew ?? subscription.isAutoRenew}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, isAutoRenew: checked })
                    }
                  />
                ) : (
                  <Badge
                    className={
                      subscription.isAutoRenew
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {subscription.isAutoRenew ? "Yes" : "No"}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {subscription.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border p-3"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">Created At</Label>
                <p className="mt-1 text-sm text-gray-600">
                  {formatDateForDisplay(subscription.createdAt)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Updated At</Label>
                <p className="mt-1 text-sm text-gray-600">
                  {formatDateForDisplay(subscription.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionDetailPage;
