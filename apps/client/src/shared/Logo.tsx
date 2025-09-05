import React from "react";
import Link from "next/link";

import LogoSvg from "./LogoSvg";
import LogoSvgLight from "./LogoSvgLight";

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-24" }) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo text-primary-6000 inline-block focus:outline-none focus:ring-0 ${className}`}
    >
      <LogoSvgLight />
      <LogoSvg />
      <span className="ml-2 align-middle text-2xl font-bold text-primary">
        Reservatior
      </span>
    </Link>
  );
};

export default Logo;
