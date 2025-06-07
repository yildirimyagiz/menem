import type { ButtonHTMLAttributes } from "react";
import React from "react";

export interface ButtonCircleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: string;
}

const ButtonCircle: React.FC<ButtonCircleProps> = ({
  className = " ",
  size = " w-9 h-9 ",
  ...args
}) => {
  return (
    <button
      className={`ttnc-ButtonCircle bg-primary-6000 hover:bg-primary-700 flex items-center justify-center rounded-full !leading-none text-neutral-50 disabled:bg-opacity-70 ${className} ${size} `}
      {...args}
    />
  );
};

export default ButtonCircle;
