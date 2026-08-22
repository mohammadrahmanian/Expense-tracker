import { type FC } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { getPageDescription, getPageTitle } from "../DashboardLayout.utils";
import { CurrencySwitcher } from "./CurrencySwitcher";

type DashboardHeaderProps = {
  title?: string;
  backTo?: string;
};

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  title,
  backTo,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const resolvedBackTo =
    backTo ??
    (location.pathname === "/categories" ||
    location.pathname === "/recurring-transactions"
      ? "/more"
      : undefined);

  const trailing = (
    <>
      <button className="hidden lg:flex items-center justify-center h-9 w-9 rounded-lg bg-surface dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
        <Bell className="h-[18px] w-[18px] text-neutral-600 dark:text-neutral-400" />
      </button>
      <CurrencySwitcher />
    </>
  );

  if (isDashboard) {
    return (
      <PageHeader
        title={`Good morning${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description={format(new Date(), "EEEE, MMM dd, yyyy")}
        descriptionAlwaysVisible
        backTo={resolvedBackTo}
        trailing={trailing}
      />
    );
  }

  return (
    <PageHeader
      title={title ?? getPageTitle(location.pathname)}
      description={getPageDescription(location.pathname)}
      backTo={resolvedBackTo}
      trailing={trailing}
    />
  );
};
