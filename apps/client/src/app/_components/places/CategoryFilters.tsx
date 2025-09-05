"use client";

interface CategoryFiltersProps {
  category: string;
  onCategoryChange: (category: string) => void;
  categories: Record<string, string>;
}

export default function CategoryFilters({
  category,
  onCategoryChange,
  categories,
}: CategoryFiltersProps) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl ring-1 ring-blue-200 p-3 md:p-4 transition-all duration-200 hover:scale-[1.01] md:hover:scale-[1.02]">
      <div className="flex flex-wrap justify-center gap-1 md:gap-2">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`rounded-full px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium transition-all duration-200 ${
              category === key
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
} 