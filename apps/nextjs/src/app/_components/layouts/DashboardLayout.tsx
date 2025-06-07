"use client";

import { useSidebar } from "~/context/SidebarContext"; // Assuming you use SidebarContext
import { MobileMenu } from "../client/MobileMenu"; // Assuming you have a MobileMenu
import Navbar from "../client/Navbar"; // Adjust the import path if necessary

import RoleSidebar from "../client/RoleSidebar"; // Assuming you use the RoleSidebar

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isMobileOpen, setIsMobileOpen } = useSidebar(); // Use your sidebar context if applicable

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar at the top */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar for larger screens */}
        <RoleSidebar />

        {/* Main Content Area - takes remaining width */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile Menu Overlay - appears on top */}
        <MobileMenu
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
        />
      </div>
    </div>
  );
}
