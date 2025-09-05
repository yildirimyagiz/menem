import React from "react";

interface StepperProps {
  steps: string[];
  activeStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, activeStep }) => (
  <div className="flex items-center justify-between mb-8">
    {steps.map((label, idx) => (
      <div key={label} className="flex-1 flex flex-col items-center">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
            idx <= activeStep
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-gray-200 border-gray-300 text-gray-500"
          }`}
        >
          {idx + 1}
        </div>
        <span
          className={`mt-2 text-xs text-center ${
            idx === activeStep ? "font-bold text-blue-600" : "text-gray-500"
          }`}
        >
          {label}
        </span>
        {idx < steps.length - 1 && (
          <div className="w-full h-1 bg-gray-300 mt-2 mb-2" />
        )}
      </div>
    ))}
  </div>
);

export default Stepper;
