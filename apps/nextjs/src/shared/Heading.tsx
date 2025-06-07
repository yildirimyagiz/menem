import type { HTMLAttributes, ReactNode } from "react";
import React from "react";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  desc?: ReactNode;
  isCenter?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  desc = "Discover the most outstanding articles in all topics of life.",
  className = "mb-10 text-neutral-900 dark:text-neutral-50",
  isCenter = false,
  ...props
}) => {
  const textAlignClass = isCenter
    ? "text-center w-full max-w-2xl mx-auto"
    : "max-w-2xl";

  return (
    <div className={`nc-Section-Heading relative ${className}`}>
      <div className={`${textAlignClass} mb-4`}>
        <h2 className={`text-3xl font-semibold md:text-4xl`} {...props}>
          {children ?? "Section Heading"}
        </h2>
        {desc && (
          <span className="mt-2 block text-base text-neutral-500 dark:text-neutral-400 sm:text-lg md:mt-3">
            {desc}
          </span>
        )}
      </div>
    </div>
  );
};

export default Heading;
