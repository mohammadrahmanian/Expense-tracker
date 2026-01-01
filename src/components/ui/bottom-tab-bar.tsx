import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
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
  <Icon
    icon="hugeicons:dashboard-square-03"
    className={cn("h-6 w-6", className)}
  />
);

const TransactionsTabIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <Icon icon="hugeicons:money-add-01" className={cn("h-6 w-6", className)} />
);

const ReportsTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon icon="hugeicons:chart-02" className={cn("h-6 w-6", className)} />
);

const MoreTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon icon="hugeicons:more-02" className={cn("h-6 w-6", className)} />
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
    name: "Reports",
    href: "/reports",
    icon: ReportsTabIcon,
    ariaLabel: "Navigate to Reports",
  },
  {
    name: "More",
    href: "/more",
    icon: MoreTabIcon,
    ariaLabel: "Navigate to More",
  },
];

export const BottomTabBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="bg-white dark:bg-gray-800 shadow-sm border-t border-gray-200 dark:border-gray-700 pb-safe-bottom">
        <div className="flex items-stretch pt-2 pb-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.href;
            const TabIcon = tab.icon;

            return (
              <Link
                key={tab.name}
                to={tab.href}
                className={cn(
                  "group relative flex flex-1 flex-col items-center justify-center min-h-[56px] py-1.5 transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200",
                )}
                aria-label={tab.ariaLabel}
                aria-current={isActive ? "page" : undefined}
              >
                <TabIcon
                  className={cn(
                    "transition-colors flex-shrink-0 mb-0.5 h-6 w-6",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium leading-tight transition-colors",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200",
                  )}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
