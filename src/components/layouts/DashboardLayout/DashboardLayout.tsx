import { BottomTabBar } from "@/components/ui/bottom-tab-bar";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardLayoutProps } from "./DashboardLayout.types";
import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ease-in-out z-20",
          sidebarCollapsed ? "lg:w-20" : "lg:w-72",
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300",
            sidebarCollapsed ? "px-2 py-4" : "p-4",
          )}
        >
          <DashboardSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        <DashboardHeader />

        <main className="flex-1">
          <div className="py-6 pb-32 lg:pb-6">
            <div className="max-w-7xl mx-auto px-4">{children}</div>
          </div>
        </main>

        <FloatingActionButton />
        <BottomTabBar />
      </div>
    </div>
  );
};
