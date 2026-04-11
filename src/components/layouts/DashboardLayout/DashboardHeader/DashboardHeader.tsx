import { type FC } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Bell, ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getPageDescription, getPageTitle } from "../DashboardLayout.utils";
import { CurrencySwitcher } from "./CurrencySwitcher";

export const DashboardHeader: FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <header
      className="bg-surface dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 lg:bg-transparent lg:dark:bg-transparent lg:border-b-0"
      style={{
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="flex items-center justify-between h-[72px] px-4 lg:px-8 border-b border-neutral-200 dark:border-neutral-800">
        {/* Left side */}
        <div className="flex flex-1 min-w-0 items-center">
          {(location.pathname === "/categories" ||
            location.pathname === "/recurring-transactions") && (
            <Link
              to="/more"
              className="lg:hidden mr-2 p-1 -ml-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gold-500" />
            </Link>
          )}
          <div>
            {isDashboard ? (
              <>
                <h1 className="text-h2 text-neutral-900 dark:text-white">
                  Good morning{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="text-caption text-neutral-500">
                  {format(new Date(), "EEEE, MMM dd, yyyy")}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-h2 text-neutral-900 dark:text-white">
                  {getPageTitle(location.pathname)}
                </h1>
                <p className="hidden lg:block text-caption text-neutral-500 mt-0.5">
                  {getPageDescription(location.pathname)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="hidden lg:flex items-center justify-center h-9 w-9 rounded-lg bg-surface dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <Bell className="h-[18px] w-[18px] text-neutral-600 dark:text-neutral-400" />
          </button>
          <CurrencySwitcher />
        </div>
      </div>
    </header>
  );
};
