import { CurrencySwitcher } from "./CurrencySwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getPageDescription, getPageTitle } from "../DashboardLayout.utils";
import { UserProfileMenu } from "./UserProfileMenu";

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header
      className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 lg:bg-transparent lg:border-b-0"
      style={{
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="lg:mx-4 lg:mt-4">
        <div className="lg:bg-white lg:dark:bg-gray-800 lg:rounded-2xl lg:shadow-sm lg:border lg:border-gray-200 lg:dark:border-gray-700 px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Left side - Back button (mobile only) + Page title and description */}
            <div className="flex flex-1 min-w-0 items-center">
              {/* Back button - only on specific pages on mobile */}
              {(location.pathname === "/categories" ||
                location.pathname === "/recurring-transactions") && (
                <Link
                  to="/more"
                  className="lg:hidden mr-2 p-1 -ml-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </Link>
              )}

              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {getPageTitle(location.pathname)}
                  </h1>
                  <p className="hidden lg:block text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {getPageDescription(location.pathname)}
                  </p>
                </div>
              </div>
            </div>
            {/* Right side items */}
            <div className="flex items-center space-x-4">
              <CurrencySwitcher />
              <UserProfileMenu user={user} onLogout={logout} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
