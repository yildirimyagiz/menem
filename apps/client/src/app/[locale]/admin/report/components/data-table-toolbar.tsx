import React from "react";

export const DataTableToolbar: React.FC = () => {
  return (
    <div className="mb-2 flex gap-2">
      {/* Placeholder for bulk actions, export, etc. */}
      <button className="rounded bg-gray-200 px-3 py-1">Bulk Action</button>
      <button className="rounded bg-gray-200 px-3 py-1">Export</button>
    </div>
  );
};
