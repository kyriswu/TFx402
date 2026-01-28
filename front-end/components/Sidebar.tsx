'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  FileText,
  Bell,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  {
    id: 'overview',
    label: '总览',
    icon: LayoutDashboard,
    href: '/dashboard/overview',
  },
  {
    id: 'analytics',
    label: '分析报表',
    icon: BarChart3,
    href: '/dashboard/analytics',
  },
  {
    id: 'users',
    label: '用户管理',
    icon: Users,
    href: '/dashboard/users',
  },
  {
    id: 'content',
    label: '内容管理',
    icon: FileText,
    href: '/dashboard/content',
  },
  {
    id: 'notifications',
    label: '通知',
    icon: Bell,
    href: '/dashboard/notifications',
  },
  {
    id: 'settings',
    label: '设置',
    icon: Settings,
    href: '/dashboard/settings',
  },
  {
    id: 'products',
    label: '商品管理',
    icon: Settings,
    href: '/dashboard/products',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 lg:hidden cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-primary" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 z-30 transition-transform duration-300 lg:translate-x-0 overflow-y-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo/Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 h-20 flex items-center justify-center border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-primary font-fira-code">
            Admin
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobile}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer',
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20',
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            v1.0.0 | Admin Dashboard
          </p>
        </div>
      </aside>
    </>
  );
}
