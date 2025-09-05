import React from "react";

import type { Report } from "@reservatior/validators";

interface DataTableRowActionsProps {
  report: Report;
}

export const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({
  report,
}) => {
  return (
    <div className="flex gap-2">
      <button className="text-blue-600 hover:underline">View</button>
      <button className="text-green-600 hover:underline">Edit</button>
      <button className="text-red-600 hover:underline">Delete</button>
      <button className="text-gray-600 hover:underline">Download</button>
    </div>
  );
};
