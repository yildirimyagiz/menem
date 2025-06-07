"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
  open: () => {},
  close: () => {},
  isCollapsed: false,
  setIsCollapsed: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
});

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    const savedMobileOpen = localStorage.getItem("sidebarMobileOpen");
    const savedIsCollapsed = localStorage.getItem("sidebarIsCollapsed");
    const savedIsOpen = localStorage.getItem("sidebarIsOpen");
    setIsOpen(savedIsOpen !== null ? JSON.parse(savedIsOpen) : !isMobile);
    setIsMobileOpen(savedMobileOpen ? JSON.parse(savedMobileOpen) : false);
    setIsCollapsed(savedIsCollapsed ? JSON.parse(savedIsCollapsed) : false);
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      if (!newIsMobile) {
        setIsOpen(true);
        localStorage.setItem("sidebarIsOpen", JSON.stringify(true));
        setIsMobileOpen(false);
        localStorage.setItem("sidebarMobileOpen", JSON.stringify(false));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateMobileOpen = (value: boolean) => {
    setIsMobileOpen(value);
    localStorage.setItem("sidebarMobileOpen", JSON.stringify(value));
  };
  const updateIsCollapsed = (value: boolean) => {
    setIsCollapsed(value);
    localStorage.setItem("sidebarIsCollapsed", JSON.stringify(value));
  };
  const toggle = () => {
    if (window.innerWidth < 1024) {
      updateMobileOpen(!isMobileOpen);
    } else {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      localStorage.setItem("sidebarIsOpen", JSON.stringify(newIsOpen));
    }
  };
  const open = () => {
    if (window.innerWidth < 1024) {
      updateMobileOpen(true);
    } else {
      setIsOpen(true);
      localStorage.setItem("sidebarIsOpen", JSON.stringify(true));
    }
  };
  const close = () => {
    if (window.innerWidth < 1024) {
      updateMobileOpen(false);
    } else {
      setIsOpen(false);
      localStorage.setItem("sidebarIsOpen", JSON.stringify(false));
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle,
        open,
        close,
        isCollapsed,
        setIsCollapsed: updateIsCollapsed,
        isMobileOpen,
        setIsMobileOpen: updateMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
