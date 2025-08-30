import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Receipt,
  Settings,
  PieChart,
  User,
} from 'lucide-react';

interface TabItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

const tabs: TabItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    ariaLabel: 'Navigate to Dashboard',
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: Receipt,
    ariaLabel: 'Navigate to Transactions',
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: Settings,
    ariaLabel: 'Navigate to Categories',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: PieChart,
    ariaLabel: 'Navigate to Reports',
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    ariaLabel: 'Navigate to Profile',
  },
];

export const BottomTabBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.href;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center min-h-[44px] px-1 py-2 text-xs font-medium transition-all duration-200 ease-in-out',
                'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500',
                'active:bg-gray-100 dark:active:bg-gray-700',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
              aria-label={tab.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 mb-1 transition-all duration-200 ease-in-out',
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 scale-110'
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                )}
              />
              <span
                className={cn(
                  'transition-all duration-200 ease-in-out leading-none',
                  isActive
                    ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                    : 'font-medium'
                )}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};