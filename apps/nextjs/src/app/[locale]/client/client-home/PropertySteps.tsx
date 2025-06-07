import React from "react";

type Step = { id: number; title: string; description: string };

interface PropertyStepsProps {
  steps: Step[];
  activeStep: number;
}

const PropertySteps: React.FC<PropertyStepsProps> = ({ steps, activeStep }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`flex-1 text-center relative ${
            step.id === activeStep
              ? "font-medium text-primary"
              : step.id < activeStep
              ? "text-muted-foreground"
              : "text-muted-foreground"
          }`}
        >
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center ${
                step.id === activeStep
                  ? "bg-primary text-primary-foreground"
                  : step.id < activeStep
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.id < activeStep ? (
                <span>✓</span>
              ) : (
                step.id + 1
              )}
            </div>
            <div className="text-sm hidden md:block">{step.title}</div>
          </div>
          {step.id < steps.length - 1 && (
            <div
              className={`absolute top-4 w-full h-0.5 left-1/2 ${
                step.id < activeStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default PropertySteps;
