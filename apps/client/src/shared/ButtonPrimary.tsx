import React from "react";

import type { ButtonProps } from "./Button";
import Button from "./Button";

export interface ButtonPrimaryProps extends ButtonProps {
  children: React.ReactNode;
  type: "reset" | "submit" | "button";
  className: string;
  loading: boolean; // Change 'isLoading' to 'loading'
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = "",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary bg-blue-600 text-neutral-50 transition duration-200 hover:bg-blue-700 disabled:bg-opacity-70 ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
