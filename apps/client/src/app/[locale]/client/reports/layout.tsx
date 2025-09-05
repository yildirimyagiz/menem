import type { Metadata } from "next";
import type { FC, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Reports | Property Management",
  description: "Generate and view property management reports",
};

interface ReportsLayoutProps {
  children: ReactNode;
}

const ReportsLayout: FC<ReportsLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="mt-2 text-gray-600">
          Generate and view detailed reports about your properties and business
        </p>
      </div>
      <div className="grid gap-6">{children}</div>
    </div>
  );
};

export default ReportsLayout;
