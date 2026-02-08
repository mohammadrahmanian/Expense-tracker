import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { DashboardSidebarProps } from "../DashboardLayout.types";
import { navigation } from "../DashboardLayout.utils";

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  closeButton,
  collapsed = false,
  onToggle,
}) => {
  const location = useLocation();

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div
        className={cn(
          "flex-1 flex flex-col overflow-y-auto transition-all duration-300",
          collapsed ? "px-2 py-6" : "p-6",
        )}
      >
        <div
          className={cn(
            "flex items-center relative transition-all duration-300",
            collapsed ? "justify-center mb-6" : "justify-between mb-6",
          )}
        >
          {collapsed ? (
            <button
              onClick={onToggle}
              className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 group"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          ) : (
            <>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">$</span>
                </div>
                <div className="ml-3 transition-opacity duration-300">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Expensio
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                    Dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </button>
            </>
          )}
          {closeButton}
        </div>
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center text-sm font-medium rounded-xl transition-all duration-300 ease-in-out w-full px-3 py-3",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white",
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 transition-colors duration-200",
                    collapsed ? "mr-0" : "mr-3",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                  )}
                />
                <span
                  className={cn(
                    "font-medium transition-all duration-300 ease-in-out whitespace-nowrap",
                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
