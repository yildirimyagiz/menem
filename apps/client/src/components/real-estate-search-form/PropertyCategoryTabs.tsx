import type { FC } from "react";

import { PropertyCategory } from "./PropertyCategorySelect";

interface Props {
  value: PropertyCategory;
  onChange: (category: PropertyCategory) => void;
}

const tabClass = (selected: boolean) =>
  selected
    ? "bg-green-600 text-white font-bold rounded-full px-5 py-2 mr-2 focus:outline-none shadow-sm border border-green-600"
    : "border border-gray-300 bg-white text-gray-700 rounded-full px-5 py-2 mr-2 focus:outline-none hover:border-green-600 hover:text-green-700 font-normal";

const PropertyCategoryTabs: FC<Props> = ({ value, onChange }) => (
  <div className="flex items-center space-x-2">
    {Object.values(PropertyCategory).map((category) => (
      <button
        key={category}
        type="button"
        className={tabClass(value === category)}
        onClick={() => onChange(category)}
      >
        {category.charAt(0) + category.slice(1).toLowerCase()}
      </button>
    ))}
  </div>
);

export default PropertyCategoryTabs;
