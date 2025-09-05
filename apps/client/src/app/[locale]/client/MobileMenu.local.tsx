"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  FileText,
  Heart,
  HelpCircle,
  Home,
  LogOut,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  User,
  Users,
  Wallet,
  Wrench,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "~/context/LanguageContext";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@reservatior/ui/sheet";

import { useAuth } from "~/hooks/use-auth";
import PromotionBanner from "./facility/_components/PromotionBanner";

// Role enum (moved here for local use)
export enum Role {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  AGENCY_ADMIN = "AGENCY_ADMIN",
  AGENT_ADMIN = "AGENT_ADMIN",
  MODERATOR = "MODERATOR",
  FACILITY_MANAGER = "FACILITY_MANAGER",
  GUEST = "GUEST",
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  onlyFor?: Role[];
  badge?: number;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  platform?: "android" | "ios" | "web";
}

export default function MobileMenu({ isOpen, onClose, platform = "web" }: MobileMenuProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const userRole: Role = Object.values(Role).includes(
    (user?.role ?? "") as Role,
  )
    ? ((user?.role ?? "") as Role)
    : Role.GUEST;

  // Safe-area handled via global utilities (pt-safe, pb-safe)

  // Platform-specific menu width
  const getMenuWidth = () => {
    if (platform === "ios") {
      return "w-80"; // iOS: standard width
    } else if (platform === "android") {
      return "w-72"; // Android: slightly narrower
    }
    return "w-80"; // Web: standard width
  };



  // Define navigation items with role-based filtering
  const allNavItems: NavItem[] = [
    // Dashboard
    {
      path: "/",
      label: t("nav.dashboard"),
      icon: <Home className="mr-3 h-5 w-5" />,
      category: "dashboard",
    },
    // Properties
    {
      path: "/client/property",
      label: t("nav.properties"),
      icon: <Building2 className="mr-3 h-5 w-5" />,
      category: "properties",
    },
    // Places
    {
      path: "/client/places",
      label: t("nav.places"),
      icon: <MapPin className="mr-3 h-5 w-5" />,
      category: "properties",
    },
    // Favorites
    {
      path: "/client/favorites",
      label: t("nav.favorites"),
      icon: <Heart className="mr-3 h-5 w-5" />,
      category: "properties",
    },
    // Search
    {
      path: "/client/search",
      label: t("nav.search"),
      icon: <Search className="mr-3 h-5 w-5" />,
      category: "search",
    },
    // Communication
    {
      path: "/client/chat",
      label: t("nav.messages"),
      icon: <MessageSquare className="mr-3 h-5 w-5" />,
      category: "communication",
      badge: 3,
    },
    // Notifications
    {
      path: "/client/notification",
      label: t("nav.notifications"),
      icon: <Bell className="mr-3 h-5 w-5" />,
      category: "communication",
      badge: 2,
    },
    // Financial
    {
      path: "/client/payments",
      label: t("nav.payments"),
      icon: <Wallet className="mr-3 h-5 w-5" />,
      category: "financial",
    },
    {
      path: "/client/subscription",
      label: t("nav.subscription"),
      icon: <CreditCard className="mr-3 h-5 w-5" />,
      category: "financial",
    },
    // Analytics
    {
      path: "/client/analytics",
      label: t("nav.analytics"),
      icon: <BarChart3 className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [Role.ADMIN, Role.AGENCY_ADMIN, Role.AGENT_ADMIN],
    },
    // Users
    {
      path: "/client/users",
      label: t("nav.users"),
      icon: <Users className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [Role.ADMIN, Role.AGENCY_ADMIN],
    },
    // Reports
    {
      path: "/client/reports",
      label: t("nav.reports"),
      icon: <FileText className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [Role.ADMIN, Role.AGENCY_ADMIN, Role.AGENT_ADMIN],
    },
    // Facilities
    {
      path: "/client/facilities",
      label: t("nav.facilities"),
      icon: <Wrench className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [Role.ADMIN, Role.AGENCY_ADMIN, Role.AGENT_ADMIN, Role.FACILITY_MANAGER],
    },
    // Help
    {
      path: "/client/help",
      label: t("nav.help"),
      icon: <HelpCircle className="mr-3 h-5 w-5" />,
      category: "support",
    },
    // Settings
    {
      path: "/client/settings",
      label: t("nav.settings"),
      icon: <Settings className="mr-3 h-5 w-5" />,
      category: "support",
    },
  ];

  // Filter items by role
  const navItems = allNavItems.filter(
    (item) => !item.onlyFor || item.onlyFor.includes(userRole),
  );

  // Group items by category
  const groupedItems = navItems.reduce((acc, item) => {
    acc[item.category] ??= [];
    acc[item.category]?.push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const renderCategory = (categoryName: string, items: typeof navItems) => {
    const categoryLabels: Record<string, string> = {
      dashboard: t("nav.dashboard"),
      properties: t("nav.properties"),
      search: t("nav.search"),
      communication: t("nav.communication"),
      financial: t("nav.financial"),
      admin: t("nav.admin"),
      support: t("nav.support"),
    };

    if (items.length === 0) return null;

    return (
      <motion.div
        key={categoryName}
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {categoryLabels[categoryName]}
        </h3>
        <div className="space-y-1">
          {items
            .filter((item) => item.category === categoryName)
            .map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={item.path}
                    onClick={onClose}
                    className={`mobile-nav-item flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <motion.span
                        className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
        </div>
      </motion.div>
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className={`${getMenuWidth()} pt-safe pb-safe border-r border-gray-200 bg-white/95 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/95 ${
          platform === "ios" ? "ios-mobile-menu" : platform === "android" ? "android-mobile-menu" : ""
        }`}
      >
        <SheetHeader className="flex items-center justify-between border-b border-gray-200 pb-4">
  {/* Logo/Brand - only in MobileMenu */}
  <div className="flex items-center gap-2">
    <span className="relative">
      <Building2 className="h-7 w-7 text-blue-600" />
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 blur-xl group-hover:opacity-100" />
    </span>
    <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-lg font-bold text-transparent">
      Reservatior
    </span>
  </div>
          <SheetTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {t("common.menu")}
          </SheetTitle>
          <button
            aria-label={t("common.close")}
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="h-5 w-5" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-2 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* User Info */}
          {user && (
            <motion.div
              className={`mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-gray-800 dark:to-gray-700`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ minHeight: 64, touchAction: 'manipulation' }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("common.welcomeBack")}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.name ?? t("common.user")}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  )}
                  {user.role && (
                    <motion.span
                      className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {user.role.replace(/_/g, " ")}
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-4" aria-label={t("common.menu")}>
            {Object.keys(groupedItems).map((category) =>
              renderCategory(category, navItems),
            )}
          </nav>

          {/* Logout Button */}
          <motion.div
            className="mt-8 border-t border-gray-200 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <button
              onClick={handleLogout}
              className="mobile-nav-item w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="flex-1">{t("common.logout")}</span>
            </button>
          </motion.div>

          {/* Promotion Banner */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <PromotionBanner title={t('promotion.title')} description={t('promotion.description')} />
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
