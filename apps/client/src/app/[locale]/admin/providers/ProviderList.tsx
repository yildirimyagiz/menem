import React from "react";

import type { Provider } from "@reservatior/validators";
import { Button } from "@reservatior/ui/button";

interface ProviderListProps {
  providers: Provider[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading)
    return <div className="py-8 text-center">Loading providers...</div>;
  if (!providers.length)
    return (
      <div className="py-8 text-center text-gray-500">No providers found.</div>
    );
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Source</th>
            <th className="px-4 py-2 text-left">Commission</th>
            <th className="px-4 py-2 text-left">Active</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id} className="border-b">
              <td className="px-4 py-2">{provider.name}</td>
              <td className="px-4 py-2">{provider.source}</td>
              <td className="px-4 py-2">{provider.commission}%</td>
              <td className="px-4 py-2">{provider.isActive ? "Yes" : "No"}</td>
              <td className="flex gap-2 px-4 py-2">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(provider.id)}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(provider.id)}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderList;
