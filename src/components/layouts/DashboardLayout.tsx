import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/contexts/SidebarContext";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  PieChart,
  Receipt,
  Settings,
  User,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Categories", href: "/categories", icon: Settings },
  { name: "Profile", href: "/profile", icon: User },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize from localStorage, default to false if not found
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Persist sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Get page title based on current route
  const getPageTitle = () => {
    const currentPage = navigation.find(nav => nav.href === location.pathname);
    return currentPage?.name || "Dashboard";
  };

  const getPageDescription = () => {
    const descriptions: Record<string, string> = {
      "/dashboard": "Overview of your financial activity",
      "/transactions": "Manage your income and expenses", 
      "/reports": "Analyze your spending patterns",
      "/categories": "Organize your expense categories",
      "/profile": "Manage your account settings"
    };
    return descriptions[location.pathname] || "Welcome back to your dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar - Hidden for bottom tab bar implementation */}

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
        {/* Top navigation */}
        <header 
          className="sticky top-0 z-10"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Mobile menu button - Hidden for bottom tab bar implementation */}
              
              {/* Left side - Page title and description on desktop */}
              <div className="hidden lg:flex flex-1 min-w-0">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                      {getPageTitle()}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {getPageDescription()}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mobile spacer */}
              <div className="lg:hidden flex-1" />
              {/* Right side items */}
              <div className="flex items-center space-x-4">

                {/* Currency switcher */}
                <CurrencySwitcher />

                {/* User profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-3 cursor-pointer group">
                      <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <button className="relative h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </button>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="flex items-center text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6 pb-20 lg:pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>

        <FloatingActionButton />
      </div>
    </div>
  );
};

const DashboardSidebar = ({
  closeButton,
  collapsed = false,
  onToggle,
}: {
  closeButton?: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}) => {
  const location = useLocation();
  const { activeIndex, setActiveIndex, backgroundStyle, setBackgroundStyle, navRefs, navContainerRef } = useSidebarContext();

  // Find active tab index
  useEffect(() => {
    const currentIndex = navigation.findIndex(nav => nav.href === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  // Calculate background position
  useEffect(() => {
    const updateBackgroundPosition = () => {
      const activeNav = navRefs.current[activeIndex];
      const container = navContainerRef.current;
      
      if (activeNav && container) {
        const containerRect = container.getBoundingClientRect();
        const navRect = activeNav.getBoundingClientRect();
        
        setBackgroundStyle({
          top: navRect.top - containerRect.top,
          height: navRect.height,
        });
      }
    };

    const timeoutId = setTimeout(updateBackgroundPosition, 50);
    return () => clearTimeout(timeoutId);
  }, [activeIndex, collapsed]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
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
            /* Expand button replaces logo when collapsed */
            <button
              onClick={onToggle}
              className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 group"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          ) : (
            /* Normal logo and collapse button when expanded */
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
        <nav ref={navContainerRef} className={cn("flex-1 relative", "space-y-2")}>
          {/* Sliding background */}
          <div
            className="absolute left-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md transition-all duration-300 ease-out z-0"
            style={{
              top: `${backgroundStyle.top}px`,
              height: `${backgroundStyle.height}px`,
              width: collapsed ? '48px' : '100%',
              marginLeft: collapsed ? 'auto' : '0',
              marginRight: collapsed ? 'auto' : '0',
            }}
          />
          
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                ref={(el) => (navRefs.current[index] = el)}
                to={item.href}
                className={cn(
                  "group flex items-center text-sm font-medium rounded-xl relative overflow-hidden z-10",
                  "transition-all duration-300 ease-in-out",
                  "w-full px-3 py-3",
                  isActive
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white",
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 h-5 w-5 transition-all duration-300 ease-in-out",
                    collapsed ? "mr-0" : "mr-3",
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                  )}
                />
                <span
                  className={cn(
                    "font-medium transition-all duration-300 ease-in-out whitespace-nowrap",
                    collapsed
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100 w-auto",
                  )}
                >
                  {item.name}
                </span>
                {isActive && (
                  <div
                    className={cn(
                      "absolute right-3 w-1.5 h-1.5 bg-white/30 rounded-full transition-all duration-300 ease-in-out",
                      collapsed ? "opacity-0" : "opacity-100",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
