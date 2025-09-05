import React from "react";
import { PropertyCategory } from "@prisma/client";

interface PropertyCategorySelectProps {
  value: PropertyCategory;
  onChange: (value: PropertyCategory) => void;
  className?: string;
}

const propertyCategoryOptions = Object.values(PropertyCategory);

const formatCategory = (cat: string) =>
  cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const PropertyCategorySelect: React.FC<PropertyCategorySelectProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <select
      className={"rounded-lg border px-4 py-2 text-base " + (className ?? "")}
      value={value}
      onChange={(e) => onChange(e.target.value as PropertyCategory)}
    >
      {propertyCategoryOptions.map((cat) => (
        <option key={cat} value={cat}>
          {formatCategory(cat)}
        </option>
      ))}
    </select>
  );
};

export default PropertyCategorySelect;
