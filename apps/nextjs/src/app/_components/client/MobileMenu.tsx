"use client";

import { X, Home, Building, Users, DollarSign, MessageSquare, CalendarCheck, FileText, BarChart2 } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "~/context/LanguageContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const navItems = [
    { path: '/', label: t('sidebar.dashboard'), icon: <Home className="mr-3 h-5 w-5" /> },
    { path: '/properties', label: t('sidebar.properties'), icon: <Building className="mr-3 h-5 w-5" /> },
    { path: '/tenants', label: t('sidebar.tenants'), icon: <Users className="mr-3 h-5 w-5" /> },
    { path: '/payments', label: t('sidebar.payments'), icon: <DollarSign className="mr-3 h-5 w-5" /> },
    { path: '/messages', label: t('sidebar.messages'), icon: <MessageSquare className="mr-3 h-5 w-5" />, badge: 4 },
    { path: '/tasks', label: t('sidebar.tasks'), icon: <CalendarCheck className="mr-3 h-5 w-5" /> },
    { path: '/documents', label: t('sidebar.documents'), icon: <FileText className="mr-3 h-5 w-5" /> },
    { path: '/reports', label: t('sidebar.reports'), icon: <BarChart2 className="mr-3 h-5 w-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
      <div className="h-full w-64 bg-white overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <span className="text-primary-500 text-xl font-bold">RentWise</span>
          <button onClick={onClose} className="text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} legacyBehavior>
                <a
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.path
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-500 hover:bg-primary-50'
                  }`}
                  onClick={onClose}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
