"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type Platform = "android" | "ios" | "web";

interface MobileLoadingSpinnerProps {
  platform?: Platform;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function MobileLoadingSpinner({
  platform = "web",
  size = "md",
  text,
  className = "",
}: MobileLoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-8 w-8";
      default:
        return "h-6 w-6";
    }
  };

  const getPlatformStyles = () => {
    if (platform === "ios") {
      return {
        color: "#007AFF", // iOS blue
      };
    } else if (platform === "android") {
      return {
        color: "#6200EE", // Material Design purple
      };
    }
    return {
      color: "hsl(var(--primary))",
    };
  };

  const getPlatformClasses = () => {
    const baseClasses = "flex flex-col items-center justify-center gap-3";

    if (platform === "ios") {
      return `${baseClasses} ios-loading-spinner`;
    } else if (platform === "android") {
      return `${baseClasses} android-loading-spinner`;
    }

    return baseClasses;
  };

  return (
    <motion.div
      className={`${getPlatformClasses()} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Loader2 className={getSizeClasses()} style={getPlatformStyles()} />
      </motion.div>
      {text && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}

// Skeleton loading component for mobile
export function MobileSkeleton({
  platform = "web",
  type = "card",
  className = "",
}: {
  platform?: Platform;
  type?: "card" | "text" | "avatar" | "button";
  className?: string;
}) {
  const getSkeletonClasses = () => {
    const baseClasses = "mobile-skeleton animate-pulse";

    switch (type) {
      case "card":
        return `${baseClasses} rounded-xl h-32 ${className}`;
      case "text":
        return `${baseClasses} h-4 w-full rounded ${className}`;
      case "avatar":
        return `${baseClasses} h-12 w-12 rounded-full ${className}`;
      case "button":
        return `${baseClasses} h-10 w-24 rounded-lg ${className}`;
      default:
        return `${baseClasses} ${className}`;
    }
  };

  const getPlatformStyles = () => {
    if (platform === "ios") {
      return {
        backgroundColor: "rgba(0, 122, 255, 0.1)",
      };
    } else if (platform === "android") {
      return {
        backgroundColor: "rgba(98, 0, 238, 0.1)",
      };
    }
    return {};
  };

  return (
    <motion.div
      className={getSkeletonClasses()}
      style={getPlatformStyles()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// Mobile loading overlay
export function MobileLoadingOverlay({
  platform = "web",
  isVisible = false,
  text = "Loading...",
}: {
  platform?: Platform;
  isVisible?: boolean;
  text?: string;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <MobileLoadingSpinner platform={platform} size="lg" text={text} />
    </motion.div>
  );
}
