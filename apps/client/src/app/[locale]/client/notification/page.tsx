"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Home,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  Star,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Avatar } from "@reservatior/ui/Avatar";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { Input } from "@reservatior/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reservatior/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

import { api } from "~/trpc/react";

// Define notification types for better type safety
type NotificationType =
  | "MENTION"
  | "TASK_ASSIGNED"
  | "BOOKING_CONFIRMED"
  | "REVIEW_RECEIVED"
  | "PRICE_CHANGE"
  | "SYSTEM_UPDATE"
  | "COMPLIANCE_ALERT"
  | "COMMUNICATION_RECEIVED"
  | "RENT_DUE"
  | "RENT_PAID"
  | "LEASE_EXPIRING"
  | "MAINTENANCE_REQUEST"
  | "LEASE_RENEWAL"
  | "LATE_PAYMENT_WARNING"
  | "LEASE_TERMINATION"
  | "RENT_INCREASE"
  | "COMMUNITY_NOTICE"
  | "POLICY_UPDATE"
  | "LIKE"
  | "COMMENT"
  | "FOLLOW"
  | "AVAILABILITY"
  | "OTHER";

interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  entityId?: string;
  entityType?: string;
  user: {
    id: string;
    name: string;
  };
  agency?: {
    id: string;
    name: string;
  } | null;
  agent?: {
    id: string;
    name: string;
  } | null;
  review?: {
    id: string;
    rating: number;
  } | null;
  tenant?: {
    id: string;
    name: string;
  } | null;
}

export default function NotificationsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showRead, setShowRead] = useState(true);
  const [showUnread, setShowUnread] = useState(true);

  // Mock data - replace with actual API call
  const notifications: Notification[] = [
    {
      id: "1",
      type: "BOOKING_CONFIRMED",
      content: "Your booking for Downtown Apartment has been confirmed",
      isRead: false,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      user: { id: "1", name: "John Doe" },
    },
    {
      id: "2",
      type: "REVIEW_RECEIVED",
      content: "You received a 5-star review for your property",
      isRead: true,
      createdAt: "2024-01-14T15:45:00Z",
      updatedAt: "2024-01-14T15:45:00Z",
      user: { id: "2", name: "Jane Smith" },
      review: { id: "1", rating: 5 },
    },
    {
      id: "3",
      type: "RENT_DUE",
      content: "Rent payment is due in 3 days",
      isRead: false,
      createdAt: "2024-01-13T09:15:00Z",
      updatedAt: "2024-01-13T09:15:00Z",
      user: { id: "3", name: "Mike Johnson" },
    },
  ];

  const getNotificationConfig = (type: NotificationType) => {
    const configs = {
      BOOKING_CONFIRMED: {
        icon: Calendar,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Booking Confirmed",
      },
      REVIEW_RECEIVED: {
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        label: "Review Received",
      },
      RENT_DUE: {
        icon: DollarSign,
        color: "text-red-600",
        bgColor: "bg-red-100",
        label: "Rent Due",
      },
      SYSTEM_UPDATE: {
        icon: Settings,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        label: "System Update",
      },
      MAINTENANCE_REQUEST: {
        icon: Wrench,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        label: "Maintenance Request",
      },
      COMMUNICATION_RECEIVED: {
        icon: Mail,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        label: "Message Received",
      },
    };

    return configs[type] || {
      icon: Bell,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      label: "Notification",
    };
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    // Implement mark as read functionality
    console.log(`Marking notification ${id} as ${isRead ? "read" : "unread"}`);
    toast.success(`Notification marked as ${isRead ? "read" : "unread"}`);
  };

  const handleMarkAsUnread = (id: string) => {
    handleMarkAsRead(id, false);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log(`Deleting notification ${id}`);
    toast.success("Notification deleted");
  };

  const handleMarkAllAsRead = () => {
    // Implement mark all as read functionality
    console.log("Marking all notifications as read");
    toast.success("All notifications marked as read");
  };

  const getPriorityCount = (priority: "high" | "medium" | "low") => {
    return notifications.filter((n) => {
      // Mock priority logic - replace with actual logic
      if (priority === "high") return n.type === "RENT_DUE";
      if (priority === "medium") return n.type === "BOOKING_CONFIRMED";
      return n.type === "REVIEW_RECEIVED";
    }).length;
  };

  const handleRefresh = () => {
    // Implement refresh functionality
    console.log("Refreshing notifications");
    toast.success("Notifications refreshed");
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch = notification.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || notification.type === selectedType;
      const matchesStatus = selectedStatus === "all" || 
        (selectedStatus === "read" && notification.isRead) ||
        (selectedStatus === "unread" && !notification.isRead);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchQuery, selectedType, selectedStatus]);

  return (
    <div className="ios-layout android-layout">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mobile-fade-in mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-text-xl font-bold lg:text-3xl">Notifications</h1>
              <p className="mobile-text-base text-gray-600 dark:text-gray-300">
                Stay updated with your latest activities
              </p>
            </div>
            <Button onClick={handleRefresh} className="mobile-button">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mobile-fade-in mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="mobile-card ios-mobile-menu android-mobile-menu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="mobile-text-sm text-gray-600">High Priority</p>
                  <p className="mobile-text-xl font-bold">{getPriorityCount("high")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mobile-card ios-mobile-menu android-mobile-menu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="mobile-text-sm text-gray-600">Medium Priority</p>
                  <p className="mobile-text-xl font-bold">{getPriorityCount("medium")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mobile-card ios-mobile-menu android-mobile-menu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="mobile-text-sm text-gray-600">Low Priority</p>
                  <p className="mobile-text-xl font-bold">{getPriorityCount("low")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mobile-card mobile-fade-in mb-6 ios-mobile-menu android-mobile-menu">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mobile-text-sm font-medium">Search</label>
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-input"
                />
              </div>
              <div>
                <label className="mobile-text-sm font-medium">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="mobile-input">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="BOOKING_CONFIRMED">Booking Confirmed</SelectItem>
                    <SelectItem value="REVIEW_RECEIVED">Review Received</SelectItem>
                    <SelectItem value="RENT_DUE">Rent Due</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mobile-text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="mobile-input">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleMarkAllAsRead} className="mobile-button w-full">
                  Mark All Read
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="mobile-fade-in space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const config = getNotificationConfig(notification.type);
              const Icon = config.icon;

              return (
                <Card
                  key={notification.id}
                  className={`mobile-card mobile-scale-in ios-mobile-menu android-mobile-menu ${
                    !notification.isRead ? "border-blue-200 bg-blue-50/50" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="mobile-text-base font-medium text-gray-900 dark:text-white">
                              {notification.content}
                            </p>
                            <p className="mobile-text-sm text-gray-600 dark:text-gray-400">
                              {formatTimestamp(notification.createdAt)}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="mobile-button">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="mobile-card ios-mobile-menu android-mobile-menu">
                              <DropdownMenuItem
                                onClick={() => handleMarkAsRead(notification.id, !notification.isRead)}
                                className="mobile-nav-item"
                              >
                                {notification.isRead ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Mark as unread
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Mark as read
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(notification.id)}
                                className="mobile-nav-item text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {!notification.isRead && (
                          <Badge variant="secondary" className="mobile-text-xs mt-2">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="mobile-card mobile-fade-in text-center ios-mobile-menu android-mobile-menu">
              <CardContent className="p-8">
                <Bell className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">
                  No notifications
                </h3>
                <p className="mobile-text-base text-gray-600 dark:text-gray-300">
                  You're all caught up!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
