"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "~/context/LanguageContext";
import { SidebarProvider } from "~/context/SidebarContext";
import { Sidebar } from "../client/Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="flex">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <main className="py-8 lg:py-12 ios-dashboard-layout android-dashboard-layout">
                <div className="mobile-content px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </LanguageProvider>
  );
}
