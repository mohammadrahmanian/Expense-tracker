import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { House, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { QuickExpenseModal } from "@/components/transactions/QuickExpenseModal";

interface TabItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

const HomeTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <House className={cn("h-[18px] w-[18px]", className)} />
);

const TransactionsTabIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <Icon
    icon="hugeicons:money-add-01"
    className={cn("h-[18px] w-[18px]", className)}
  />
);

const ReportsTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon
    icon="hugeicons:chart-02"
    className={cn("h-[18px] w-[18px]", className)}
  />
);

const MoreTabIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Icon
    icon="hugeicons:more-02"
    className={cn("h-[18px] w-[18px]", className)}
  />
);

const leftTabs: TabItem[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeTabIcon,
    ariaLabel: "Navigate to Home",
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: TransactionsTabIcon,
    ariaLabel: "Navigate to Transactions",
  },
];

const rightTabs: TabItem[] = [
  {
    name: "Reports",
    href: "/reports",
    icon: ReportsTabIcon,
    ariaLabel: "Navigate to Reports",
  },
  {
    name: "More",
    href: "/more",
    icon: MoreTabIcon,
    ariaLabel: "Navigate to More",
  },
];

export const BottomTabBar: React.FC = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderTab = (tab: TabItem) => {
    const isActive = location.pathname === tab.href;
    const TabIcon = tab.icon;

    return (
      <Link
        key={tab.name}
        to={tab.href}
        className="flex flex-1 flex-col items-center justify-center gap-[3px] py-1.5"
        aria-label={tab.ariaLabel}
        aria-current={isActive ? "page" : undefined}
      >
        <TabIcon
          className={cn(
            "transition-colors",
            isActive ? "text-gold-500" : "text-neutral-500",
          )}
        />
        <span
          className={cn(
            "text-[9px] font-semibold uppercase tracking-[0.8px] transition-colors",
            isActive ? "text-gold-500" : "text-neutral-500",
          )}
        >
          {tab.name}
        </span>
      </Link>
    );
  };

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden"
        role="navigation"
        aria-label="Bottom navigation"
      >
        <div className="bg-surface border-t border-neutral-200 pt-2.5 dark:bg-neutral-900 dark:border-neutral-700">
          <div className="flex items-end">
            {leftTabs.map(renderTab)}

            {/* Center FAB */}
            <div className="flex flex-1 items-center justify-center pb-1.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-white shadow-md transition-transform active:scale-95"
                aria-label="Add expense"
              >
                <Plus className="h-[22px] w-[22px]" />
              </button>
            </div>

            {rightTabs.map(renderTab)}
          </div>
        </div>
      </nav>

      <QuickExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
