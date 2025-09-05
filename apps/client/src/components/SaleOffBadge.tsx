import type { FC } from "react";
import React, { memo } from "react";

export interface SaleOffBadgeProps {
  className?: string;
  desc?: string;
  value: number; // Changed from 'discount' to 'value'
  percentage: number;
}

const SaleOffBadge: FC<SaleOffBadgeProps> = ({
  className = "",
  desc = "-10% today",
  percentage,
}) => {
  return (
    <div
      className={`nc-SaleOffBadge flex items-center justify-center rounded-full bg-red-700 px-3 py-0.5 text-xs text-red-50 ${className}`}
      data-nc-id="SaleOffBadge"
    >
      {desc}
    </div>
  );
};

export default memo(SaleOffBadge);
