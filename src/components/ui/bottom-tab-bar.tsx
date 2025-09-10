import { cn } from "@/lib/utils";
import {
  User,
} from "lucide-react";
import { Icon } from '@iconify/react';
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface TabItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

// Icon components
const DashboardTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon icon="hugeicons:dashboard-square-03" className={cn("h-6 w-6", className)} />
);

const TransactionsTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon icon="hugeicons:money-add-01" className={cn("h-6 w-6", className)} />
);

const CategoriesTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon icon="hugeicons:folder-02" className={cn("h-6 w-6", className)} />
);

const ReportsTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon icon="hugeicons:chart-02" className={cn("h-6 w-6", className)} />
);

const tabs: TabItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: DashboardTabIcon,
    ariaLabel: "Navigate to Dashboard",
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: TransactionsTabIcon,
    ariaLabel: "Navigate to Transactions",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: CategoriesTabIcon,
    ariaLabel: "Navigate to Categories",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ReportsTabIcon,
    ariaLabel: "Navigate to Reports",
  },
];

export const BottomTabBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden safe-area-bottom"
      role="navigation"
      aria-label="Bottom navigation"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="mx-2 mb-2">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex justify-between items-center">
        {tabs.map((tab, index) => {
          const isActive = location.pathname === tab.href;
          const TabIcon = tab.icon;

          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={cn(
                "group relative flex flex-col items-center justify-center min-h-[44px] transition-all duration-200 ease-in-out p-2 rounded-lg",
                "focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300",
              )}
              aria-label={tab.ariaLabel}
              aria-current={isActive ? "page" : undefined}
            >
              <TabIcon
                className={cn(
                  "transition-colors flex-shrink-0 mb-1",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                )}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
          </div>
        </div>
      </div>
    </nav>
  );
};
