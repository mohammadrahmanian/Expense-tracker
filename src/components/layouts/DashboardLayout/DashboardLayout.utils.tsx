import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { NavigationItem } from "./DashboardLayout.types";

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ({ className }: { className?: string }) => (
      <Icon
        icon="hugeicons:dashboard-square-03"
        className={cn("h-5 w-5", className)}
      />
    ),
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ({ className }: { className?: string }) => (
      <Icon
        icon="hugeicons:money-add-01"
        className={cn("h-5 w-5", className)}
      />
    ),
  },
  {
    name: "Recurring",
    href: "/recurring-transactions",
    icon: ({ className }: { className?: string }) => (
      <Icon icon="hugeicons:repeat" className={cn("h-5 w-5", className)} />
    ),
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ({ className }: { className?: string }) => (
      <Icon icon="hugeicons:chart-02" className={cn("h-5 w-5", className)} />
    ),
  },
  {
    name: "Categories",
    href: "/categories",
    icon: ({ className }: { className?: string }) => (
      <Icon icon="hugeicons:folder-02" className={cn("h-5 w-5", className)} />
    ),
  },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/recurring-transactions": "Recurring",
  "/reports": "Reports",
  "/categories": "Categories",
  "/profile": "Profile",
  "/more": "More",
};

const pageDescriptions: Record<string, string> = {
  "/dashboard": "Overview of your financial activity",
  "/transactions": "Manage your income and expenses",
  "/recurring-transactions": "Manage your recurring income and expenses",
  "/reports": "Analyze your spending patterns",
  "/categories": "Organize your expense categories",
  "/profile": "Manage your account settings",
  "/more": "Additional features and settings",
};

export const getPageTitle = (pathname: string): string => {
  return pageTitles[pathname] || "Dashboard";
};

export const getPageDescription = (pathname: string): string => {
  return pageDescriptions[pathname] || "Welcome back to your dashboard";
};
