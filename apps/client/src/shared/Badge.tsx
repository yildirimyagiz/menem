import type { FC, ReactNode } from "react";
import React from "react";
import Link from "next/link";

import type { Route } from "~/routers/types";

export interface BadgeProps {
  className?: string;
  name?: ReactNode;
  color?: string;
  href?: Route<string>;
  target?: string;
  children?: React.ReactNode;
  variant?: string;
}

const Badge: FC<BadgeProps> = ({
  className = "relative",
  name,
  color = "blue",
  href,
  target,
  children,
  variant,
}) => {
  // Define colors and hover effects
  const colorClasses: Record<string, string> = {
    blue: "text-blue-800 bg-blue-100 hover:bg-blue-800",
    red: "text-red-800 bg-red-100 hover:bg-red-800",
    gray: "text-gray-800 bg-gray-100 hover:bg-gray-800",
    green: "text-green-800 bg-green-100 hover:bg-green-800",
    purple: "text-purple-800 bg-purple-100 hover:bg-purple-800",
    indigo: "text-indigo-800 bg-indigo-100 hover:bg-indigo-800",
    yellow: "text-yellow-800 bg-yellow-100 hover:bg-yellow-800",
  };

  // Fallback to default color
  const colorClass = colorClasses[color] || colorClasses.blue;

  const baseClasses =
    "nc-Badge inline-flex px-2.5 py-1 rounded-full font-medium text-xs";
  const combinedClasses = `${baseClasses} ${className} ${colorClass} ${variant ?? ""}`;

  return href ? (
    <Link
      href={href}
      className={`transition-colors duration-300 hover:text-white ${combinedClasses}`}
    >
      {children ?? name}
    </Link>
  ) : (
    <span className={combinedClasses}>{children ?? name}</span>
  );
};

export default Badge;
