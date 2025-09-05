"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    BarChart3,
    Bell,
    Building2,
    CreditCard,
    FileCheck,
    FileText,
    Heart,
    HelpCircle,
    Home,
    LogOut,
    MapPin,
    MessageSquare,
    Receipt,
    Settings,
    Shield,
    User,
    Users,
    Wallet,
    Wrench,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "~/context/LanguageContext";

import { useAuth } from "~/hooks/use-auth";
import { Role } from "./RoleSidebar";

type Platform = "android" | "ios" | "web";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  platform?: Platform;
}

export function MobileMenu({
  isOpen,
  onClose,
  platform = "web",
}: MobileMenuProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const userRole: Role = Object.values(Role).includes(
    (user?.role ?? "") as Role,
  )
    ? ((user?.role ?? "") as Role)
    : Role.GUEST;

  // Platform-specific styling
  const getPlatformStyles = () => {
    if (platform === "ios") {
      return {
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        WebkitOverflowScrolling: "touch" as const,
      };
    } else if (platform === "android") {
      return {
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      };
    }
    return {};
  };

  // Platform-specific classes
  const getPlatformClasses = () => {
    const baseClasses = "fixed inset-0 z-50 md:hidden";

    if (platform === "ios") {
      return `${baseClasses} ios-mobile-menu`;
    } else if (platform === "android") {
      return `${baseClasses} android-mobile-menu`;
    }

    return baseClasses;
  };

  // Platform-specific menu width
  const getMenuWidth = () => {
    if (platform === "ios") {
      return "w-80";
    } else if (platform === "android") {
      return "w-72";
    }
    return "w-80";
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const menuVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  // Define navigation items with role-based filtering
  const allNavItems = [
    // Dashboard
    {
      path: "/",
      label: t("nav.dashboard", { default: "Dashboard" }),
      icon: <Home className="mr-3 h-5 w-5" />,
      category: "dashboard",
    },

    // Properties
    {
      path: "/properties",
      label: t("nav.properties", { default: "Properties" }),
      icon: <Building2 className="mr-3 h-5 w-5" />,
      category: "properties",
    },
    {
      path: "/properties/listings",
      label: t("nav.listings", { default: "Listings" }),
      icon: <MapPin className="mr-3 h-5 w-5" />,
      category: "properties",
    },
    {
      path: "/properties/favorites",
      label: t("nav.favorites", { default: "Favorites" }),
      icon: <Heart className="mr-3 h-5 w-5" />,
      category: "properties",
    },

    // Communication
    {
      path: "/chat",
      label: t("nav.messages", { default: "Messages" }),
      icon: <MessageSquare className="mr-3 h-5 w-5" />,
      category: "communication",
      badge: 3,
    },
    {
      path: "/notifications",
      label: t("nav.notifications", { default: "Notifications" }),
      icon: <Bell className="mr-3 h-5 w-5" />,
      category: "communication",
      badge: 2,
    },

    // Financial
    {
      path: "/payments",
      label: t("nav.payments", { default: "Payments" }),
      icon: <Wallet className="mr-3 h-5 w-5" />,
      category: "financial",
    },
    {
      path: "/expenses",
      label: t("nav.expenses", { default: "Expenses" }),
      icon: <Receipt className="mr-3 h-5 w-5" />,
      category: "financial",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.FACILITY_MANAGER,
      ],
    },
    {
      path: "/tax-records",
      label: t("nav.taxRecords", { default: "Tax Records" }),
      icon: <FileCheck className="mr-3 h-5 w-5" />,
      category: "financial",
    },
    {
      path: "/subscription",
      label: t("nav.subscription", { default: "Subscription" }),
      icon: <CreditCard className="mr-3 h-5 w-5" />,
      category: "financial",
    },

    // Admin
    {
      path: "/admin/users",
      label: t("nav.users", { default: "Users" }),
      icon: <Users className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
        Role.FACILITY_MANAGER,
      ],
    },
    {
      path: "/admin/agents",
      label: t("nav.agents", { default: "Agents" }),
      icon: <Users className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
      ],
    },
    {
      path: "/admin/analytics",
      label: t("nav.analytics", { default: "Analytics" }),
      icon: <BarChart3 className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
        Role.FACILITY_MANAGER,
      ],
    },
    {
      path: "/admin/reports",
      label: t("nav.reports", { default: "Reports" }),
      icon: <FileText className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
        Role.FACILITY_MANAGER,
      ],
    },
    {
      path: "/admin/compliance",
      label: t("nav.compliance", { default: "Compliance" }),
      icon: <Shield className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
      ],
    },
    {
      path: "/admin/facilities",
      label: t("nav.facilities", { default: "Facilities" }),
      icon: <Wrench className="mr-3 h-5 w-5" />,
      category: "admin",
      onlyFor: [
        Role.ADMIN,
        Role.SUPER_ADMIN,
        Role.AGENCY_ADMIN,
        Role.AGENT_ADMIN,
        Role.MODERATOR,
        Role.FACILITY_MANAGER,
      ],
    },

    // Support
    {
      path: "/help",
      label: t("nav.help", { default: "Help" }),
      icon: <HelpCircle className="mr-3 h-5 w-5" />,
      category: "support",
    },
    {
      path: "/support",
      label: t("nav.support", { default: "Support" }),
      icon: <Shield className="mr-3 h-5 w-5" />,
      category: "support",
    },
    {
      path: "/settings",
      label: t("nav.settings", { default: "Settings" }),
      icon: <Settings className="mr-3 h-5 w-5" />,
      category: "support",
    },
  ];

  // Filter nav items by role
  const filteredNavItems = allNavItems.filter(
    (item) => !item.onlyFor || item.onlyFor.includes(userRole),
  );

  // Group by category
  const categories: Record<string, typeof allNavItems> = {
    dashboard: [],
    properties: [],
    communication: [],
    financial: [],
    admin: [],
    support: [],
  };

  filteredNavItems.forEach((item) => {
    if (categories[item.category]) {
      categories[item.category]?.push(item);
    }
  });

  function renderCategory(title: string, items: typeof allNavItems) {
    if (items.length === 0) return null;

    return (
      <motion.div
        key={title}
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </h3>
        <div className="space-y-1">
          {items.map((item, index) => {
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
                  className={`mobile-nav-item ${
                    isActive
                      ? "mobile-nav-item-active"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <motion.span
                      className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white"
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
  }

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={getPlatformClasses()}
        style={getPlatformStyles()}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className={`h-full ${getMenuWidth()} overflow-y-auto bg-white shadow-2xl`}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.div
            className="flex items-center justify-between border-b border-gray-200 p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Building2 className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="text-xl font-bold text-primary">Reservatior</span>
            </div>
            <motion.button
              onClick={onClose}
              className="mobile-button rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* User Profile Section */}
          <motion.div
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div
              className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  {user ? (
                    <>
                      <p className="text-sm text-gray-600">Welcome back,</p>
                      <p className="font-semibold text-gray-900">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : (user.username ??
                            user.email?.split("@")[0] ??
                            "User")}
                      </p>
                      {user.role && (
                        <motion.span
                          className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {user.role.replace(/_/g, " ")}
                        </motion.span>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="space-y-2">
                          {renderCategory("Dashboard", categories.dashboard ?? [])}
            {renderCategory("Properties", categories.properties ?? [])}
            {renderCategory("Communication", categories.communication ?? [])}
            {renderCategory("Financial", categories.financial ?? [])}
            {renderCategory("Admin", categories.admin ?? [])}
            {renderCategory("Support", categories.support ?? [])}
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
                className="mobile-nav-item w-full text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="flex-1">Logout</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

