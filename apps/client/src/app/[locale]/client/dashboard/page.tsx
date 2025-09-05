"use client";

import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BarChartIcon,
  Bell,
  Building,
  Building2,
  BuildingIcon,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  CreditCard,
  CreditCardIcon,
  Database,
  DollarSign,
  FileText,
  Filter,
  Globe,
  HardDrive,
  Plus,
  RefreshCw,
  Settings,
  SettingsIcon,
  UserCheck,
  Users,
  Users2,
  Users as UsersIcon,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";

const clientSectionGroups = [
  {
    key: "userManagement",
    titleKey: "dashboard.sectionGroups.userManagement.title",
    descriptionKey: "dashboard.sectionGroups.userManagement.description",
    icon: Users2,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    sections: [
      { key: "users", href: "/client/users", icon: Users, titleKey: "dashboard.sectionGroups.userManagement.users.title", descriptionKey: "dashboard.sectionGroups.userManagement.users.description", badgeKey: "dashboard.sectionGroups.userManagement.users.badge" },
      { key: "agents", href: "/client/agents", icon: UserCheck, titleKey: "dashboard.sectionGroups.userManagement.agents.title", descriptionKey: "dashboard.sectionGroups.userManagement.agents.description", badgeKey: "dashboard.sectionGroups.userManagement.agents.badge" },
      { key: "agencies", href: "/client/agencies", icon: Users, titleKey: "dashboard.sectionGroups.userManagement.agencies.title", descriptionKey: "dashboard.sectionGroups.userManagement.agencies.description", badgeKey: "dashboard.sectionGroups.userManagement.agencies.badge" },
      { key: "tenants", href: "/client/tenants", icon: UserCheck, titleKey: "dashboard.sectionGroups.userManagement.tenants.title", descriptionKey: "dashboard.sectionGroups.userManagement.tenants.description", badgeKey: "dashboard.sectionGroups.userManagement.tenants.badge" },
    ],
  },
  {
    key: "propertyManagement",
    titleKey: "dashboard.sectionGroups.propertyManagement.title",
    descriptionKey: "dashboard.sectionGroups.propertyManagement.description",
    icon: BuildingIcon,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    sections: [
      { key: "properties", href: "/client/properties", icon: Building2, titleKey: "dashboard.sectionGroups.propertyManagement.properties.title", descriptionKey: "dashboard.sectionGroups.propertyManagement.properties.description", badgeKey: "dashboard.sectionGroups.propertyManagement.properties.badge" },
      { key: "facilities", href: "/client/facilities", icon: Building2, titleKey: "dashboard.sectionGroups.propertyManagement.facilities.title", descriptionKey: "dashboard.sectionGroups.propertyManagement.facilities.description", badgeKey: "dashboard.sectionGroups.propertyManagement.facilities.badge" },
      { key: "providers", href: "/client/providers", icon: Users, titleKey: "dashboard.sectionGroups.propertyManagement.providers.title", descriptionKey: "dashboard.sectionGroups.propertyManagement.providers.description", badgeKey: "dashboard.sectionGroups.propertyManagement.providers.badge" },
      { key: "availability", href: "/client/availability", icon: CheckSquare, titleKey: "dashboard.sectionGroups.propertyManagement.availability.title", descriptionKey: "dashboard.sectionGroups.propertyManagement.availability.description", badgeKey: "dashboard.sectionGroups.propertyManagement.availability.badge" },
    ],
  },
  {
    key: "financials",
    titleKey: "dashboard.sectionGroups.financials.title",
    descriptionKey: "dashboard.sectionGroups.financials.description",
    icon: CreditCardIcon,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    sections: [
      { key: "payment", href: "/client/payment", icon: CreditCard, titleKey: "dashboard.sectionGroups.financials.payment.title", descriptionKey: "dashboard.sectionGroups.financials.payment.description", badgeKey: "dashboard.sectionGroups.financials.payment.badge" },
      { key: "currency", href: "/client/currency", icon: DollarSign, titleKey: "dashboard.sectionGroups.financials.currency.title", descriptionKey: "dashboard.sectionGroups.financials.currency.description", badgeKey: "dashboard.sectionGroups.financials.currency.badge" },
      { key: "subscription", href: "/client/subscription", icon: CreditCard, titleKey: "dashboard.sectionGroups.financials.subscription.title", descriptionKey: "dashboard.sectionGroups.financials.subscription.description", badgeKey: "dashboard.sectionGroups.financials.subscription.badge" },
      { key: "subscriptions", href: "/client/subscriptions", icon: CreditCard, titleKey: "dashboard.sectionGroups.financials.subscriptions.title", descriptionKey: "dashboard.sectionGroups.financials.subscriptions.description", badgeKey: "dashboard.sectionGroups.financials.subscriptions.badge" },
    ],
  },
  {
    key: "operationsAnalytics",
    titleKey: "dashboard.sectionGroups.operationsAnalytics.title",
    descriptionKey: "dashboard.sectionGroups.operationsAnalytics.description",
    icon: BarChartIcon,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    sections: [
      { key: "analytics", href: "/client/analytics", icon: BarChart3, titleKey: "dashboard.sectionGroups.operationsAnalytics.analytics.title", descriptionKey: "dashboard.sectionGroups.operationsAnalytics.analytics.description", badgeKey: "dashboard.sectionGroups.operationsAnalytics.analytics.badge" },
      { key: "tasks", href: "/client/tasks", icon: CheckSquare, titleKey: "dashboard.sectionGroups.operationsAnalytics.tasks.title", descriptionKey: "dashboard.sectionGroups.operationsAnalytics.tasks.description", badgeKey: "dashboard.sectionGroups.operationsAnalytics.tasks.badge" },
      { key: "events", href: "/client/events", icon: Calendar, titleKey: "dashboard.sectionGroups.operationsAnalytics.events.title", descriptionKey: "dashboard.sectionGroups.operationsAnalytics.events.description", badgeKey: "dashboard.sectionGroups.operationsAnalytics.events.badge" },
      { key: "report", href: "/client/report", icon: FileText, titleKey: "dashboard.sectionGroups.operationsAnalytics.report.title", descriptionKey: "dashboard.sectionGroups.operationsAnalytics.report.description", badgeKey: "dashboard.sectionGroups.operationsAnalytics.report.badge" },
    ],
  },
  {
    key: "settingsMisc",
    titleKey: "dashboard.sectionGroups.settingsMisc.title",
    descriptionKey: "dashboard.sectionGroups.settingsMisc.description",
    icon: SettingsIcon,
    color: "from-gray-500 to-slate-500",
    bgColor: "from-gray-50 to-slate-50",
    sections: [
      { key: "profile", href: "/client/profile", icon: UserCheck, titleKey: "dashboard.sectionGroups.settingsMisc.profile.title", descriptionKey: "dashboard.sectionGroups.settingsMisc.profile.description", badgeKey: "dashboard.sectionGroups.settingsMisc.profile.badge" },
      { key: "settings", href: "/client/settings", icon: Settings, titleKey: "dashboard.sectionGroups.settingsMisc.settings.title", descriptionKey: "dashboard.sectionGroups.settingsMisc.settings.description", badgeKey: "dashboard.sectionGroups.settingsMisc.settings.badge" },
      { key: "notifications", href: "/client/notification", icon: Bell, titleKey: "dashboard.sectionGroups.settingsMisc.notifications.title", descriptionKey: "dashboard.sectionGroups.settingsMisc.notifications.description", badgeKey: "dashboard.sectionGroups.settingsMisc.notifications.badge" },
    ],
  },
];

// Enhanced statistics data
const statsData = [
  {
    key: "totalUsers",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive",
    icon: UsersIcon,
    color: "from-blue-500 to-cyan-500",
    trend: "up",
    detailKey: "activeUsersThisMonth",
  },
  {
    key: "activeProperties",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive",
    icon: Building,
    color: "from-green-500 to-emerald-500",
    trend: "up",
    detailKey: "propertiesAvailable",
  },
  {
    key: "revenue",
    value: "$45,678",
    change: "+15.3%",
    changeType: "positive",
    icon: Wallet,
    color: "from-purple-500 to-pink-500",
    trend: "up",
    detailKey: "thisMonthsRevenue",
  },
  {
    key: "systemHealth",
    value: "98.5%",
    change: "+2.1%",
    changeType: "positive",
    icon: Activity,
    color: "from-orange-500 to-red-500",
    trend: "up",
    detailKey: "uptimeThisMonth",
  },
];

// Enhanced recent activities
type MessageParams = Record<string, string | number | Date>;

interface RecentActivity {
  id: number;
  type: string;
  messageKey: string;
  messageParams?: MessageParams;
  timeKey: string;
  timeParams?: MessageParams;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  status: string;
}

const recentActivities: RecentActivity[] = [
  {
    id: 1,
    type: "user_registered",
    messageKey: "dashboard.recentActivities.userRegistered",
    messageParams: { name: "John Doe" },
    timeKey: "dashboard.recentActivities.timeMinutesAgo",
    timeParams: { minutes: 2 },
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    status: "success",
  },
  {
    id: 2,
    type: "property_added",
    messageKey: "dashboard.recentActivities.propertyAdded",
    messageParams: { property: "Downtown Apartment" },
    timeKey: "dashboard.recentActivities.timeMinutesAgo",
    timeParams: { minutes: 5 },
    icon: Building2,
    color: "text-green-500",
    bgColor: "bg-green-100",
    status: "success",
  },
  {
    id: 3,
    type: "payment_received",
    messageKey: "dashboard.recentActivities.paymentReceived",
    messageParams: { amount: "$1,250.00" },
    timeKey: "dashboard.recentActivities.timeMinutesAgo",
    timeParams: { minutes: 10 },
    icon: CreditCard,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    status: "success",
  },
  {
    id: 4,
    type: "system_alert",
    messageKey: "dashboard.recentActivities.systemAlert",
    messageParams: {},
    timeKey: "dashboard.recentActivities.timeMinutesAgo",
    timeParams: { minutes: 15 },
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    status: "warning",
  },
];

interface Section {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descriptionKey: string;
  badgeKey: string;
}

interface SectionGroup {
  key: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  sections: Section[];
}

// Collapsible Section Component
function CollapsibleSection({ group, isOpen, onToggle }: { 
  group: SectionGroup; 
  isOpen: boolean; 
  onToggle: () => void; 
}) {
  const t = useTranslations();
  
  return (
    <div className="rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${group.color} shadow-lg`}>
            <group.icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">{t(group.titleKey)}</h2>
            <p className="text-sm text-gray-600">{t(group.descriptionKey)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${group.bgColor} text-gray-700`}>
            {group.sections.length} items
          </div>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="p-6">
            {/* Redesigned Grid - Larger, Cleaner Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.sections.map((section, index: number) => (
                <Link
                  key={section.key}
                  href={section.href}
                  className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-gray-300 hover:bg-gray-50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon and Title Row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${group.color} shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 group-hover:text-gray-700 text-lg leading-tight">
                        {t(section.titleKey)}
                      </h3>
                      {section.badgeKey && (
                        <span className="inline-block mt-1 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {t(section.badgeKey)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {t(section.descriptionKey)}
                  </p>
                  
                  {/* Action Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {t('dashboard.managementSections.clickToManage')}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-600 transition-colors">
                      <span className="text-xs">{t('dashboard.managementSections.view')}</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientDashboardPage() {
  const t = useTranslations();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    userManagement: false,
    propertyManagement: false,
    financials: false,
    operationsAnalytics: false,
    settingsMisc: false,
  });

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent lg:text-4xl">
              {t("dashboard.title")}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {t("dashboard.description")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 border border-green-200">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">{t('dashboard.systemOnline')}</span>
            </div>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <div
              key={stat.key}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-gray-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.statistics.' + stat.key)}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">{t('dashboard.statistics.changeVsLastMonth')}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t('dashboard.statistics.' + stat.detailKey)}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.quickActions.title')}</h2>
            <p className="text-gray-600">{t('dashboard.quickActions.description')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/client/users/new"
            className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('dashboard.quickActions.addUser')}</h3>
              <p className="text-sm text-gray-600">{t('dashboard.quickActions.addUserDesc')}</p>
            </div>
          </Link>

          <Link
            href="/client/properties/new"
            className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-green-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('dashboard.quickActions.addProperty')}</h3>
              <p className="text-sm text-gray-600">{t('dashboard.quickActions.addPropertyDesc')}</p>
            </div>
          </Link>

          <Link
            href="/client/analytics"
            className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-orange-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('dashboard.quickActions.viewAnalytics')}</h3>
              <p className="text-sm text-gray-600">{t('dashboard.quickActions.viewAnalyticsDesc')}</p>
            </div>
          </Link>

          <Link
            href="/client/tasks/new"
            className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-purple-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('dashboard.quickActions.createTask')}</h3>
              <p className="text-sm text-gray-600">{t('dashboard.quickActions.createTaskDesc')}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Enhanced Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{t('dashboard.recentActivities.title')}</h2>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-500">{t('dashboard.recentActivities.liveUpdates')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                  <Filter className="h-4 w-4 text-gray-600" />
                </button>
                <Link href="/client/activities" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-50 border border-transparent hover:border-gray-100">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.bgColor} ${activity.color}`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t(activity.messageKey, activity.messageParams)}</p>
                    <p className="text-xs text-gray-500">{t(activity.timeKey, activity.timeParams)}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions and System Status */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/client/users/new"
                className="flex items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">Add New User</span>
              </Link>
              <Link
                href="/client/properties/new"
                className="flex items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-green-50 border border-transparent hover:border-green-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">Add Property</span>
              </Link>
              <Link
                href="/client/reports"
                className="flex items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-purple-50 border border-transparent hover:border-purple-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-medium text-gray-900">Generate Report</span>
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
            <h3 className="mb-4 text-lg font-bold text-gray-900">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Database</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">API Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-gray-700">Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium text-yellow-600">{t('dashboard.systemStatus.used', { percent: 75 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Client Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.managementSections.title')}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCollapsedSections({
                userManagement: true,
                propertyManagement: true,
                financials: true,
                operationsAnalytics: true,
                settingsMisc: true,
              })}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t('dashboard.managementSections.collapseAll')}
            </button>
            <button 
              onClick={() => setCollapsedSections({
                userManagement: false,
                propertyManagement: false,
                financials: false,
                operationsAnalytics: false,
                settingsMisc: false,
              })}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t('dashboard.managementSections.expandAll')}
            </button>
          </div>
        </div>
        
        {clientSectionGroups.map((group) => (
          <CollapsibleSection
            key={group.key}
            group={group}
            isOpen={!collapsedSections[group.key]}
            onToggle={() => toggleSection(group.key)}
          />
        ))}
      </div>

      {/* Enhanced Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex flex-col gap-3">
          <Link
            href="/client/users/new"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
            title={t('dashboard.floatingActions.addNewUser')}
          >
            <Plus className="h-6 w-6" />
          </Link>
          <Link
            href="/client/properties/new"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
            title={t('dashboard.floatingActions.addNewProperty')}
          >
            <Building2 className="h-6 w-6" />
          </Link>
          <Link
            href="/client/analytics"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
            title={t('dashboard.floatingActions.viewAnalytics')}
          >
            <BarChart3 className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
