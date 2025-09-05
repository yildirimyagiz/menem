"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Platform = "android" | "ios" | "web";

interface MobileCardProps {
  children: ReactNode;
  platform?: Platform;
  variant?: "default" | "elevated" | "outlined" | "glass";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function MobileCard({
  children,
  platform = "web",
  variant = "default",
  className = "",
  onClick,
  disabled = false,
  loading = false,
}: MobileCardProps) {
  const getVariantClasses = () => {
    const baseClasses = "mobile-card transition-all duration-200";

    switch (variant) {
      case "elevated":
        return `${baseClasses} shadow-lg hover:shadow-xl`;
      case "outlined":
        return `${baseClasses} border-2 border-gray-200 bg-transparent`;
      case "glass":
        return `${baseClasses} bg-white/20 backdrop-blur-lg border border-white/30`;
      default:
        return `${baseClasses} shadow-sm hover:shadow-md`;
    }
  };

  const getPlatformClasses = () => {
    const baseClasses = getVariantClasses();

    if (platform === "ios") {
      return `${baseClasses} ios-card`;
    } else if (platform === "android") {
      return `${baseClasses} android-card`;
    }

    return baseClasses;
  };

  const getPlatformStyles = () => {
    if (platform === "ios") {
      return {
        borderRadius: "12px",
      };
    } else if (platform === "android") {
      return {
        borderRadius: "8px",
      };
    }
    return {};
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const cardContent = (
    <motion.div
      className={`${getPlatformClasses()} ${className} ${onClick ? "cursor-pointer" : ""} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      style={getPlatformStyles()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
        </motion.div>
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );

  return cardContent;
}

// Mobile card with image
export function MobileImageCard({
  image,
  title,
  subtitle,
  action,
  platform = "web",
  className = "",
}: {
  image: string;
  title: string;
  subtitle?: string;
  action?: () => void;
  platform?: Platform;
  className?: string;
}) {
  return (
    <MobileCard
      platform={platform}
      variant="elevated"
      className={`overflow-hidden ${className}`}
      onClick={action}
    >
      <div className="relative">
        <motion.img
          src={image}
          alt={title}
          className="h-48 w-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="mb-1 text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
        </div>
      </div>
    </MobileCard>
  );
}

// Mobile card with content
export function MobileContentCard({
  title,
  content,
  footer,
  platform = "web",
  className = "",
}: {
  title?: string;
  content: ReactNode;
  footer?: ReactNode;
  platform?: Platform;
  className?: string;
}) {
  return (
    <MobileCard platform={platform} className={`p-4 ${className}`}>
      {title && (
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      <div className="text-gray-700 dark:text-gray-300">{content}</div>
      {footer && (
        <div className="mt-4 border-t border-gray-200 pt-4">{footer}</div>
      )}
    </MobileCard>
  );
}

// Mobile card with stats
export function MobileStatsCard({
  title,
  value,
  change,
  platform = "web",
  className = "",
}: {
  title: string;
  value: string | number;
  change?: { value: number; isPositive: boolean };
  platform?: Platform;
  className?: string;
}) {
  return (
    <MobileCard platform={platform} className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
        {change && (
          <motion.div
            className={`flex items-center text-sm ${
              change.isPositive ? "text-green-600" : "text-red-600"
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className={change.isPositive ? "↑" : "↓"}>
              {Math.abs(change.value)}%
            </span>
          </motion.div>
        )}
      </div>
    </MobileCard>
  );
}
