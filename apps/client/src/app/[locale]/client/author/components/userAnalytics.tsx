import type { FC } from "react";
import React from "react";

interface UserAnalyticsProps {
  analytics: any[];
}

const UserAnalytics: FC<UserAnalyticsProps> = ({ analytics }) => {
  return (
    <div className="listingSection__wrap">
      <h2 className="text-2xl font-semibold">Analytics</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      <div className="mt-6">
        {analytics && analytics.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {analytics.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {item.type || "Analytics"}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.description || "No description available"}
                </p>
                {item.value && (
                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No analytics data available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAnalytics;
