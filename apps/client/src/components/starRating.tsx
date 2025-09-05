// StartRating.tsx
import React from "react";

export interface StartRatingProps {
  className?: string;
  rating: number | null; // Ensure this prop is defined
}

const StartRating: React.FC<StartRatingProps> = ({ className, rating }) => {
  return (
    <div className={className}>
      {/* Render stars based on rating */}
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < (rating || 0) ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
};

export default StartRating;
