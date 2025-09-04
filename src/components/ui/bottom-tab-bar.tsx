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
                "relative flex items-center justify-center transition-all duration-300 ease-in-out z-10",
                "focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
                isActive
                  ? "flex-[2] px-4 py-2 mx-1"
                  : "flex-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full",
              )}
              aria-label={tab.ariaLabel}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Individual tab background with fade and scale animation */}
              <div
                className={cn(
                  "absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full shadow-sm transition-all duration-500 ease-out origin-left",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-75",
                )}
              />
              <Icon
                className={cn(
                  "relative h-5 w-5 transition-all duration-250 ease-in-out z-10",
                  isActive
                    ? "text-indigo-700 dark:text-indigo-300 mr-2"
                    : "text-gray-500 dark:text-gray-400",
                )}
              />
              <span
                className={cn(
                  "relative text-sm font-medium transition-all duration-250 ease-in-out z-10",
                  isActive
                    ? "text-indigo-700 dark:text-indigo-300 opacity-100 translate-x-0 max-w-none"
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
