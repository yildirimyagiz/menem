import { Card, CardContent } from "@reservatior/ui/card";
import { CheckCircle, Dot, Eye, Home, Image as ImageIcon, MapPin, Settings } from "lucide-react";
import { useTranslations } from 'next-intl';
import React from "react";

type Step = { id: number; title: string; description: string };

interface PropertyStepsProps {
  steps: Step[];
  activeStep: number;
}

const stepIcons = [Home, Settings, MapPin, ImageIcon, Eye];

const PropertySteps: React.FC<PropertyStepsProps> = ({ steps, activeStep }) => {
  const t = useTranslations('clientHome.property');
  
  return (
    <Card className="mb-8">
      <CardContent>
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const Icon = stepIcons[idx] || Dot;
            const isActive = step.id === activeStep;
            const isCompleted = step.id < activeStep;
            return (
              <div
                key={step.id}
                className={`flex-1 text-center relative ${
                  isActive
                    ? "font-bold text-primary"
                    : isCompleted
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary scale-110 shadow"
                        : isCompleted
                        ? "border-green-600 bg-green-50 text-green-600"
                        : "border-muted bg-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="text-xs md:text-sm font-medium mt-1">{step.title}</div>
                </div>
                {step.id < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                      isCompleted ? "bg-green-600" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertySteps;
