import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { DashboardSidebarProps, NavigationItem } from "../DashboardLayout.types";
import { navigationSections } from "../DashboardLayout.utils";
import { SidebarUserProfile } from "./SidebarUserProfile";

const NavItem = ({
  item,
  isActive,
  collapsed,
}: {
  item: NavigationItem;
  isActive: boolean;
  collapsed: boolean;
}) => (
  <Link
    to={item.href}
    className={cn(
      "group flex items-center h-10 rounded-lg text-body transition-colors",
      collapsed ? "px-0 justify-center gap-0" : "px-3 gap-2.5",
      isActive
        ? "bg-gold-50 text-gold-500 font-semibold dark:bg-gold-500/10"
        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
    )}
    title={collapsed ? item.name : undefined}
  >
    <item.icon
      className={cn(
        "flex-shrink-0",
        isActive
          ? "text-gold-500"
          : "text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200",
      )}
    />
    <span
      className={cn(
        "whitespace-nowrap transition-all duration-300",
        collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
      )}
    >
      {item.name}
    </span>
  </Link>
);

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  closeButton,
  collapsed = false,
  onToggle,
}) => {
  const location = useLocation();

  return (
    <div className="flex-1 flex flex-col h-full bg-surface dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div
        className={cn(
          "flex-1 flex flex-col overflow-y-auto transition-all duration-300",
          collapsed ? "px-2 py-2" : "px-4 py-2",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center relative transition-all duration-300 pb-4",
            collapsed ? "justify-center" : "justify-between px-1",
          )}
        >
          {collapsed ? (
            <button
              onClick={onToggle}
              className="w-8 h-8 bg-gold-500 rounded-sm flex items-center justify-center hover:bg-gold-400 transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gold-500 rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-base">E</span>
                </div>
                <span className="text-h2 text-neutral-900 dark:text-neutral-50">
                  Expensio
                </span>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4 text-neutral-500" />
              </button>
            </>
          )}
          {closeButton}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 flex flex-col gap-0.5">
          {navigationSections.map((section) => (
            <div key={section.label} className="pt-4">
              {!collapsed && (
                <span className="text-overline text-neutral-500 px-3 mb-1 block tracking-wider">
                  {section.label}
                </span>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    isActive={location.pathname === item.href}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Divider */}
          <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

          {/* Bottom Section */}
          <div className="pt-3 space-y-0.5 pb-2">
            <Link
              to="/profile"
              className={cn(
                "group flex items-center h-10 rounded-lg text-body transition-colors",
                collapsed ? "px-0 justify-center gap-0" : "px-3 gap-2.5",
                location.pathname === "/profile"
                  ? "bg-gold-50 text-gold-500 font-semibold dark:bg-gold-500/10"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
              )}
              title={collapsed ? "Settings" : undefined}
            >
              <Settings className="h-[18px] w-[18px] flex-shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  collapsed
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100 w-auto",
                )}
              >
                Settings
              </span>
            </Link>

            <SidebarUserProfile collapsed={collapsed ?? false} />
          </div>
        </nav>
      </div>
    </div>
  );
};
