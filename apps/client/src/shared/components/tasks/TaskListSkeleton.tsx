"use client";

interface TaskListSkeletonProps {
  count?: number;
  className?: string;
  showPagination?: boolean;
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const TaskListSkeleton: React.FC<TaskListSkeletonProps> = ({
  count = 4,
  className = "",
  showPagination = false,
  gridCols = {
    sm: 2,
    md: 2,
    lg: 1,
  },
}) => {
  const getGridColsClass = () => {
    const cols = [];
    if (gridCols.sm) cols.push(`sm:grid-cols-${gridCols.sm}`);
    if (gridCols.md) cols.push(`md:grid-cols-${gridCols.md}`);
    if (gridCols.lg) cols.push(`lg:grid-cols-${gridCols.lg}`);
    return cols.join(" ");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className={`grid gap-6 ${getGridColsClass()}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
      {showPagination && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListSkeleton;
