import type { FC } from "react";

import { PropertyType } from "./PropertyTypeSelect";

interface Props {
  value: PropertyType;
  onChange: (type: PropertyType) => void;
}

const tabClass = (selected: boolean) =>
  selected
    ? "bg-green-600 text-white font-bold rounded-full px-5 py-2 mr-2 focus:outline-none shadow-sm border border-green-600"
    : "border border-gray-300 bg-white text-gray-700 rounded-full px-5 py-2 mr-2 focus:outline-none hover:border-green-600 hover:text-green-700 font-normal";

const PropertyTypeTabs: FC<Props> = ({ value, onChange }) => (
  <div className="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent flex items-center space-x-2 overflow-x-auto py-1">
    {Object.values(PropertyType).map((type) => (
      <button
        key={type}
        type="button"
        className={tabClass(value === type)}
        onClick={() => onChange(type)}
      >
        {type.charAt(0) + type.slice(1).toLowerCase()}
      </button>
    ))}
  </div>
);

export default PropertyTypeTabs;
