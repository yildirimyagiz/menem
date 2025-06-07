"use client";

import type { ReactNode, Dispatch, SetStateAction } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultContext: SidebarContextType = {
  isCollapsed: false,
  isMobileOpen: false,
  toggle: () => console.warn('SidebarContext not initialized'),
  open: () => console.warn('SidebarContext not initialized'),
  close: () => console.warn('SidebarContext not initialized'),
  setIsCollapsed: () => console.warn('SidebarContext not initialized'),
  setIsMobileOpen: () => console.warn('SidebarContext not initialized'),
};

const SidebarContext = createContext<SidebarContextType>(defaultContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsedState = window.localStorage.getItem("sidebarCollapsed");
      if (savedCollapsedState !== null) {
        try {
          const parsed = JSON.parse(savedCollapsedState);
          if (typeof parsed === 'boolean') {
            setIsCollapsed(parsed);
          }
        } catch (e) {
          console.error('Failed to parse saved sidebar state:', e);
        }
      }
    }

    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  const toggle = () => setIsMobileOpen(prev => !prev);
  const open = () => setIsMobileOpen(true);
  const close = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggle,
        open,
        close,
        setIsCollapsed,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
