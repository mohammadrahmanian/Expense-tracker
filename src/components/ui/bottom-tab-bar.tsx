import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Settings,
  User,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface TabItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

const tabs: TabItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    ariaLabel: "Navigate to Dashboard",
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
    ariaLabel: "Navigate to Transactions",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Settings,
    ariaLabel: "Navigate to Categories",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: PieChart,
    ariaLabel: "Navigate to Reports",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    ariaLabel: "Navigate to Profile",
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
      <div className="relative flex h-16 px-4 py-2">
        {tabs.map((tab, index) => {
          const isActive = location.pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={cn(
                "group relative flex items-center justify-center transition-all duration-300 ease-in-out",
                "focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
                isActive
                  ? "flex-[2] px-4 py-2 mx-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md rounded-xl"
                  : "flex-1 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md",
              )}
              aria-label={tab.ariaLabel}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-colors flex-shrink-0",
                  isActive
                    ? "text-white mr-2"
                    : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium transition-all duration-300 ease-in-out",
                  isActive
                    ? "opacity-100 translate-x-0 max-w-none"
                    : "opacity-0 translate-x-2 max-w-0 overflow-hidden",
                )}
                style={{
                  transitionProperty: "opacity, transform, max-width",
                  transitionDuration: "400ms",
                  transitionTimingFunction:
                    "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
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
