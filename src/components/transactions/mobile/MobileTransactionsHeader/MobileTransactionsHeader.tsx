import { type FC } from "react";
import { SlidersHorizontal } from "lucide-react";

type MobileTransactionsHeaderProps = {
  totalTransactions: number;
  onFilterTap: () => void;
  hasActiveFilters: boolean;
};

export const MobileTransactionsHeader: FC<MobileTransactionsHeaderProps> = ({
  totalTransactions,
  onFilterTap,
  hasActiveFilters,
}) => (
  <div className="flex items-center justify-between px-0 pt-2.5 pb-4">
    <div className="flex items-center gap-2">
      <h1 className="text-[22px] font-bold tracking-tight text-foreground">
        Transactions
      </h1>
      <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[11px] font-bold text-primary dark:bg-gold-900/40 dark:text-gold-200">
        {totalTransactions}
      </span>
    </div>
    <button
      type="button"
      onClick={onFilterTap}
      className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-border"
    >
      <SlidersHorizontal className="h-[18px] w-[18px] text-muted-foreground" />
      {hasActiveFilters && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary" />
      )}
    </button>
  </div>
);
