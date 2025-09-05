"use client";

import {
  Activity,
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
  CreditCard,
  CreditCardIcon,
  Database,
  DollarSign,
  FileText,
  Filter,
  Globe,
  HardDrive,
  Home,
  Image,
  Plus,
  RefreshCw,
  Settings,
  SettingsIcon,
  Sliders,
  UserCheck,
  Users,
  Users2,
  Users as UsersIcon,
  Wallet
} from "lucide-react";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import React, { useState } from "react";

import { useAdminDashboard, useAdminSections } from "~/services/adminService";

const adminSectionGroups = [
  {
    key: "userManagement",
    titleKey: "sectionGroups.userManagement.title",
    descriptionKey: "sectionGroups.userManagement.description",
    icon: Users2,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    sections: [
      { key: "accounts", href: "/admin/accounts", icon: Users, descriptionKey: "sections.accounts", badge: "12 active" },
      { key: "users", href: "/admin/users", icon: Users, descriptionKey: "sections.users", badge: "2,847 total" },
      { key: "agents", href: "/admin/agents", icon: UserCheck, descriptionKey: "sections.agents", badge: "156 agents" },
      { key: "agencies", href: "/admin/agencies", icon: Users, descriptionKey: "sections.agencies", badge: "89 agencies" },
      { key: "tenants", href: "/admin/tenants", icon: UserCheck, descriptionKey: "sections.tenants", badge: "1,234 tenants" },
      { key: "permission", href: "/admin/permission", icon: Settings, descriptionKey: "sections.permission", badge: "Updated" },
    ],
  },
  {
    key: "propertyManagement",
    titleKey: "sectionGroups.propertyManagement.title",
    descriptionKey: "sectionGroups.propertyManagement.description",
    icon: BuildingIcon,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    sections: [
      { key: "properties", href: "/admin/properties", icon: Building2, descriptionKey: "sections.properties", badge: "1,234 active" },
      { key: "facilities", href: "/admin/facilities", icon: Building2, descriptionKey: "sections.facilities", badge: "567 facilities" },
      { key: "providers", href: "/admin/providers", icon: Users, descriptionKey: "sections.providers", badge: "234 providers" },
      { key: "channels", href: "/admin/channels", icon: Bell, descriptionKey: "sections.channels", badge: "12 channels" },
      { key: "availability", href: "/admin/availability", icon: CheckSquare, descriptionKey: "sections.availability", badge: "Updated" },
      { key: "photo", href: "/admin/photo", icon: Image, descriptionKey: "sections.photo", badge: "5,678 photos" },
    ],
  },
  {
    key: "financials",
    titleKey: "sectionGroups.financials.title",
    descriptionKey: "sectionGroups.financials.description",
    icon: CreditCardIcon,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    sections: [
      { key: "payment", href: "/admin/payment", icon: CreditCard, descriptionKey: "sections.payment", badge: "$45,678" },
      { key: "currency", href: "/admin/currency", icon: DollarSign, descriptionKey: "sections.currency", badge: "12 currencies" },
      { key: "commissionRule", href: "/admin/commissionRule", icon: DollarSign, descriptionKey: "sections.commissionRule", badge: "Updated" },
      { key: "pricingRule", href: "/admin/pricingRule", icon: DollarSign, descriptionKey: "sections.pricingRule", badge: "15 rules" },
      { key: "discount", href: "/admin/discount", icon: DollarSign, descriptionKey: "sections.discount", badge: "23 active" },
      { key: "mortgage", href: "/admin/mortgage", icon: DollarSign, descriptionKey: "sections.mortgage", badge: "8 providers" },
      { key: "offer", href: "/admin/offer", icon: DollarSign, descriptionKey: "sections.offer", badge: "45 offers" },
      { key: "subscription", href: "/admin/subscription", icon: CreditCard, descriptionKey: "sections.subscription", badge: "6 plans" },
      { key: "subscriptions", href: "/admin/subscriptions", icon: CreditCard, descriptionKey: "sections.subscriptions", badge: "1,089 active" },
    ],
  },
  {
    key: "operationsAnalytics",
    titleKey: "sectionGroups.operationsAnalytics.title",
    descriptionKey: "sectionGroups.operationsAnalytics.description",
    icon: BarChartIcon,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    sections: [
      { key: "analytics", href: "/admin/analytics", icon: BarChart3, descriptionKey: "sections.analytics", badge: "Live" },
      { key: "tasks", href: "/admin/tasks", icon: CheckSquare, descriptionKey: "sections.tasks", badge: "23 pending" },
      { key: "events", href: "/admin/events", icon: Calendar, descriptionKey: "sections.events", badge: "12 upcoming" },
      { key: "report", href: "/admin/report", icon: FileText, descriptionKey: "sections.report", badge: "Updated" },
      { key: "complianceRecord", href: "/admin/complianceRecord", icon: FileText, descriptionKey: "sections.complianceRecord", badge: "100% compliant" },
      { key: "contracts", href: "/admin/contracts", icon: FileText, descriptionKey: "sections.contracts", badge: "156 contracts" },
      { key: "reservations", href: "/admin/reservations", icon: Calendar, descriptionKey: "sections.reservations", badge: "89 active" },
      { key: "ticket", href: "/admin/ticket", icon: CheckSquare, descriptionKey: "sections.ticket", badge: "5 open" },
    ],
  },
  {
    key: "settingsMisc",
    titleKey: "sectionGroups.settingsMisc.title",
    descriptionKey: "sectionGroups.settingsMisc.description",
    icon: SettingsIcon,
    color: "from-gray-500 to-slate-500",
    bgColor: "from-gray-50 to-slate-50",
    sections: [
      { key: "profile", href: "/admin/profile", icon: UserCheck, descriptionKey: "sections.profile", badge: "Updated" },
      { key: "ml-settings", href: "/admin/ml-settings", icon: Sliders, descriptionKey: "sections.mlSettings", badge: "AI enabled" },
      { key: "settings", href: "/admin/settings", icon: Settings, descriptionKey: "sections.settings", badge: "Configured" },
      { key: "dashboard", href: "/admin", icon: Home, descriptionKey: "sections.dashboard", badge: "Live" },
      { key: "notifications", href: "/admin/notification", icon: Bell, descriptionKey: "sections.notifications", badge: "5 unread" },
    ],
  },
];

interface SectionGroup {
  key: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  sections: {
    key: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    descriptionKey: string;
    badge?: string;
  }[];
}

// Collapsible Section Component
function CollapsibleSection({ group, isOpen, onToggle, t }: { 
  group: SectionGroup; 
  isOpen: boolean; 
  onToggle: () => void; 
  t: (key: string) => string;
}) {
  
  return (
    <div className="space-y-4">
      <div 
        className="admin-collapsible-header"
        onClick={onToggle}
      >
        <div className="admin-collapsible-title">
          <div className={`admin-collapsible-icon bg-gradient-to-br ${group.color}`}>
            <group.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
                      <div className="admin-collapsible-text">
                              <h3 className="admin-collapsible-name">
                  {t(group.titleKey)}
                </h3>
                <p className="admin-collapsible-description">
                  {t(group.descriptionKey)}
                </p>
            </div>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>
      
      {isOpen && (
        <div className="admin-collapsible-content">
          {group.sections.map((section) => (
            <Link
              key={section.key}
              href={section.href}
              className="admin-collapsible-item group"
            >
              <div className="admin-collapsible-item-content">
                <div className={`admin-collapsible-item-icon bg-gradient-to-br ${group.color}`}>
                  <section.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                                  <div className="admin-collapsible-item-text">
                    <h3 className="admin-collapsible-item-title">
                      {t(`sections.${section.key}`)}
                    </h3>
                    {section.badge && (
                      <span className="admin-collapsible-item-badge">
                        {section.badge}
                      </span>
                    )}
                  </div>
                </div>
                                  <p className="admin-collapsible-item-description">
                    {t(section.descriptionKey)}
                  </p>
              <div className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  // Platform detection for demo/mockup; in production, use user agent or prop
  let platform: 'android' | 'ios' | 'web' = 'web';
  if (typeof window !== 'undefined') {
    if (/android/i.test(navigator.userAgent)) platform = 'android';
    else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) platform = 'ios';
  }

  const t = useTranslations();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    userManagement: false,
    propertyManagement: false,
    financials: false,
    operationsAnalytics: false,
    settingsMisc: false,
  });

  // Use real API data
  const { stats, recentActivities, systemStatus, isLoading } = useAdminDashboard();
  const adminSections = useAdminSections();
  const { users, properties, agents, agencies, tenants, tasks, facilities, providers, subscriptions } = adminSections;

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Update section badges with real data
  const updatedSectionGroups = adminSectionGroups.map(group => ({
    ...group,
    sections: group.sections.map(section => {
      let badge = section.badge;
      
      // Update badges with real data
      switch (section.key) {
        case 'users':
          badge = `${users.length} total`;
          break;
        case 'properties':
          badge = `${properties.length} active`;
          break;
        case 'agents':
          badge = `${agents.length} agents`;
          break;
        case 'agencies':
          badge = `${agencies.length} agencies`;
          break;
        case 'tenants':
          badge = `${tenants.length} tenants`;
          break;
        case 'facilities':
          badge = `${facilities.length} facilities`;
          break;
        case 'providers':
          badge = `${providers.length} providers`;
          break;
        case 'payment':
          badge = `$${stats.revenue.toLocaleString()}`;
          break;
        case 'subscriptions':
          badge = `${subscriptions.length} active`;
          break;
        case 'tasks':
          badge = `${tasks.length} pending`;
          break;
      }
      
      return { ...section, badge };
    })
  }));

  // Create stats data from real API
      const statsData = [
      {
        title: t("statistics.totalUsers"),
        value: stats.totalUsers.toLocaleString(),
        change: "+12.5%",
        changeType: "positive" as const,
        icon: UsersIcon,
        color: "from-blue-500 to-cyan-500",
        trend: "up",
        detail: t("statistics.detailUsers"),
      },
      {
        title: t("statistics.activeProperties"),
        value: stats.activeProperties.toLocaleString(),
        change: "+8.2%",
        changeType: "positive" as const,
        icon: Building,
        color: "from-green-500 to-emerald-500",
        trend: "up",
        detail: t("statistics.detailProperties"),
      },
      {
        title: t("statistics.revenue"),
        value: `$${stats.revenue.toLocaleString()}`,
        change: "+15.3%",
        changeType: "positive" as const,
        icon: Wallet,
        color: "from-purple-500 to-pink-500",
        trend: "up",
        detail: t("statistics.detailRevenue"),
      },
      {
        title: t("statistics.systemHealth"),
        value: `${stats.systemHealth}%`,
        change: "+2.1%",
        changeType: "positive" as const,
        icon: Activity,
        color: "from-orange-500 to-red-500",
        trend: "up",
        detail: t("statistics.detailHealth"),
      },
    ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      {/* Enhanced Header Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="admin-header">
                      <div className="admin-header-content">
              <h1 className="admin-header-title">
                {t("title")}
              </h1>
              <p className="admin-header-description">
                {t("description")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 sm:px-4 py-2 border border-green-200">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-green-700">{t("systemOnline")}</span>
              </div>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="admin-stats-grid">
          {statsData.map((stat, index) => (
            <div
              key={stat.title}
              className="admin-stats-card group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="admin-stats-content">
                <div className="admin-stats-text">
                  <p className="admin-stats-label">{stat.title}</p>
                  <p className="admin-stats-value">{stat.value}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{stat.detail}</p>
                </div>
                <div className={`admin-stats-icon bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Recent Activities and Quick Actions */}
      <div className="admin-sections-grid">
        <div className="lg:col-span-2">
          <div className="admin-section-card">
                          <div className="admin-activities-header">
                <div className="admin-activities-title">
                  <h2 className="admin-activities-title-text">{t("recentActivities.title")}</h2>
                  <div className="admin-activities-live-indicator">
                    <div className="admin-activities-live-dot"></div>
                    <span className="admin-activities-live-text">{t("recentActivities.liveUpdates")}</span>
                  </div>
                </div>
              <div className="admin-activities-actions">
                <button className="admin-activities-filter">
                  <Filter className="h-4 w-4 text-gray-600" />
                </button>
                <Link href="/admin/activities" className="admin-activities-view-all">
                  {t("recentActivities.viewAll")}
                </Link>
              </div>
            </div>
            <div className="admin-activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="admin-activity-item">
                  <div className={`admin-activity-icon ${activity.bgColor} ${activity.color}`}>
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="admin-activity-content">
                    <p className="admin-activity-message">{activity.message}</p>
                    <p className="admin-activity-time">{activity.time}</p>
                  </div>
                  <div className={`admin-activity-status ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions and System Status */}
        <div className="space-y-4 sm:space-y-6">
          <div className="admin-section-card">
            <h3 className="admin-section-title">{t("quickActions.title")}</h3>
            <div className="admin-quick-actions">
              <Link
                href="/admin/users/new"
                className="admin-quick-action-item"
              >
                <div className="admin-quick-action-icon bg-blue-100">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <span className="admin-quick-action-text">{t("quickActions.addNewUser")}</span>
              </Link>
              <Link
                href="/admin/properties/new"
                className="admin-quick-action-item"
              >
                <div className="admin-quick-action-icon bg-green-100">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="admin-quick-action-text">{t("quickActions.addProperty")}</span>
              </Link>
              <Link
                href="/admin/reports"
                className="admin-quick-action-item"
              >
                <div className="admin-quick-action-icon bg-purple-100">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <span className="admin-quick-action-text">{t("quickActions.generateReport")}</span>
              </Link>
            </div>
          </div>

          <div className="admin-section-card">
            <h3 className="admin-section-title">{t("systemStatus.title")}</h3>
            <div className="admin-system-status">
              <div className="admin-system-item bg-green-50 border-green-200">
                <div className="admin-system-item-content">
                  <Database className="admin-system-item-icon text-green-600" />
                  <span className="admin-system-item-text">{t("systemStatus.database")}</span>
                </div>
                <div className="admin-system-item-status">
                  <div className="admin-system-item-indicator bg-green-500"></div>
                  <span className="admin-system-item-value text-green-600">{systemStatus.database}</span>
                </div>
              </div>
              <div className="admin-system-item bg-green-50 border-green-200">
                <div className="admin-system-item-content">
                  <Globe className="admin-system-item-icon text-green-600" />
                  <span className="admin-system-item-text">{t("systemStatus.apiServices")}</span>
                </div>
                <div className="admin-system-item-status">
                  <div className="admin-system-item-indicator bg-green-500"></div>
                  <span className="admin-system-item-value text-green-600">{systemStatus.apiServices}</span>
                </div>
              </div>
              <div className="admin-system-item bg-yellow-50 border-yellow-200">
                <div className="admin-system-item-content">
                  <HardDrive className="admin-system-item-icon text-yellow-600" />
                  <span className="admin-system-item-text">{t("systemStatus.storage")}</span>
                </div>
                <div className="admin-system-item-status">
                  <div className="admin-system-item-indicator bg-yellow-500"></div>
                  <span className="admin-system-item-value text-yellow-600">{systemStatus.storage}% Used</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Admin Sections */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="admin-section-title">{t("managementSections.title")}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCollapsedSections({
                userManagement: true,
                propertyManagement: true,
                financials: true,
                operationsAnalytics: true,
                settingsMisc: true,
              })}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
            >
              {t("managementSections.collapseAll")}
            </button>
            <button 
              onClick={() => setCollapsedSections({
                userManagement: false,
                propertyManagement: false,
                financials: false,
                operationsAnalytics: false,
                settingsMisc: false,
              })}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
            >
              {t("managementSections.expandAll")}
            </button>
          </div>
        </div>
        
        {updatedSectionGroups.map((group) => (
          <CollapsibleSection
            key={group.key}
            group={group}
            isOpen={!collapsedSections[group.key]}
            onToggle={() => toggleSection(group.key)}
            t={t}
          />
        ))}
      </div>

      {/* Enhanced Floating Action Buttons (FAB) */}
      <div className="admin-fab-container">
        <Link
          href="/admin/users/new"
          className="admin-fab-button bg-gradient-to-r from-blue-600 to-purple-600"
          title={t("quickActions.addNewUser")}
        >
          <Plus className="admin-fab-icon" />
        </Link>
        <Link
          href="/admin/properties/new"
          className="admin-fab-button bg-gradient-to-r from-green-600 to-emerald-600"
          title={t("floatingActions.addNewProperty")}
        >
          <Building2 className="admin-fab-icon" />
        </Link>
        <Link
          href="/admin/analytics"
          className="admin-fab-button bg-gradient-to-r from-purple-600 to-pink-600"
          title={t("floatingActions.viewAnalytics")}
        >
          <BarChart3 className="admin-fab-icon" />
        </Link>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className={`admin-mobile-nav ${platform === 'android' ? 'android-footer-nav' : ''} ${platform === 'ios' ? 'ios-footer-nav' : ''}`}
        role="tablist"
      >
        <Link href="/admin" className="admin-mobile-nav-item" aria-label="Dashboard">
          <Home className="admin-mobile-nav-icon" />
          <span className="admin-mobile-nav-text">{t("sections.dashboard")}</span>
        </Link>
        <Link href="/admin/users" className="admin-mobile-nav-item" aria-label="Users">
          <Users className="admin-mobile-nav-icon" />
          <span className="admin-mobile-nav-text">{t("sections.users")}</span>
        </Link>
        <Link href="/admin/properties" className="admin-mobile-nav-item" aria-label="Properties">
          <Building2 className="admin-mobile-nav-icon" />
          <span className="admin-mobile-nav-text">{t("sections.properties")}</span>
        </Link>
        <Link href="/admin/analytics" className="admin-mobile-nav-item" aria-label="Analytics">
          <BarChart3 className="admin-mobile-nav-icon" />
          <span className="admin-mobile-nav-text">{t("sections.analytics")}</span>
        </Link>
        <Link href="/admin/settings" className="admin-mobile-nav-item" aria-label="Settings">
          <Settings className="admin-mobile-nav-icon" />
          <span className="admin-mobile-nav-text">{t("sections.settings")}</span>
        </Link>
      </nav>
    </div>
  );
}

