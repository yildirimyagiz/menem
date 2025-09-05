import React from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "text-blue-600",
  className = "",
}) => {
  const sizeClasses = {
    xs: "w-2 h-2",
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-t-2 ${color} ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default Spinner;
