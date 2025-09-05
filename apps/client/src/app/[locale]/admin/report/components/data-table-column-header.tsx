import React from "react";

interface DataTableColumnHeaderProps {
  title: string;
}

export const DataTableColumnHeader: React.FC<DataTableColumnHeaderProps> = ({
  title,
}) => {
  return <span className="font-semibold">{title}</span>;
};
