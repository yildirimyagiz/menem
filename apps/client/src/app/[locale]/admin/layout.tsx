import type { ReactNode } from "react";

import AdminLayout from "~/app/_components/layouts/admin-layout";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
